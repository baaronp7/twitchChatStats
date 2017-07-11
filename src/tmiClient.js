var tmi = require("tmi.js");
var async = require("async");
var mainModel = require("./model.js");
var config = require("../config.json");
var client = new tmi.client(config);

var Channel = mainModel.channelModel;
var Mod = mainModel.modModel;
var Viewers = mainModel.viewerModel;

exports.connect = function(channelName) {
    client.connect();

    var channelObj;

    client.on("connected", function(address, port) {
        async.waterfall([
            function(callback) {
                Channel.findOne({ 'name': channelName }).exec( (err, foundChannel) => {
                    if(foundChannel) {
                        console.log("Channel " + foundChannel.name + " already exist");
                        channelObj = foundChannel;
                        callback(null, foundChannel.name);
                    } else {
                        var myChannel = new Channel({ name: channelName });
                        myChannel.save(function (err, channel) {
                            if (err) return console.error(err);
                            console.log("Saved Channel "  + channel.name);
                            channelObj = channel;
                            callback(null, channel);
                        }); 
                    }
                });
            },
            function(channel, callback) {
                client.mods(channelName).then(function(data) {
                    async.eachSeries(data, function iteratee(mod, callback2) {
                        Mod.findOne({ 'username': mod }).populate('_channel').exec( (err, foundUser) => {
                            if(foundUser) {
                                console.log("mod " + foundUser.username + " already exist in channel " + foundUser._channel.name);
                            } else {
                                var myUser = new Mod({
                                    username: mod, 
                                    _channel: channel.id
                                });
                                myUser.save(function (err, user) {
                                    if (err) return console.error(err);
                                    console.log("Saved Mod "  + user.username);
                                }); 
                            }
                        });
                        callback2();
                    }, function done() {
                        console.log("Mods Updated");
                        callback(null, "Whats up chat");
                    });
                });
            }
        ], function(err, result) {
            client.action(channelName, result);
        });
    });

    client.on("chat", function(channel, user, message, self) {
        if(message == "!twitter") {
            client.action(channelName, "www.twitter.com/AKABennyP");
        }
        else {
            usern = user['username'];
            Viewers.findOne({ 'username': usern }).populate('_channel').exec( (err, foundUser) => {
                if(user['username'] !== "akabennybot") {
                    if(foundUser) {
                        console.log("Viewer " + foundUser.username + " was found");
                        foundUser.messageCount += 1;
                        var msgObj = {message: escape(message), messageDate: new Date().toUTCString()};
                        foundUser.messages.push(msgObj);
                        foundUser.subscribed = user['subscriber'];
                        foundUser.save();
                        console.log("Viewer " + foundUser.username + " was updated for chanel "  + foundUser._channel.name);
                    } else {
                        var myUser = new Viewers({
                            _channel: channelObj.id, 
                            username: user['username'],
                            displayName: user['display-name'],
                            subscribed: user['subscriber'],
                            messageCount: 1,
                            messages: [
                                {message: escape(message), messageDate: new Date().toUTCString()}
                            ]
                        });
                        myUser.save(function (err, user) {
                            if (err) return console.error(user);
                            console.log("Saved viewer " + user['username'] + " in channel " + channelObj.name);
                        }); 
                    }
                }
            });
        }
    });
};