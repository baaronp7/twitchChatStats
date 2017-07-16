var router = require('express').Router();
var passport = require("passport");
var twitchStrategy = require("passport-twitch").Strategy;
var async = require('async');

var mainModel = require("../model.js");

var Viewers = mainModel.viewerModel;
var Channel = mainModel.channelModel;
var ActiveChannel = mainModel.activeChannelModel;
var Mods = mainModel.modModel;
var config = require("../../config.json");
var channelObj;

passport.use(new twitchStrategy({
    clientID: "3qgiq0lekijkuu50z4ck6qaqgp63wf",
    clientSecret: "sptesrjxyp41uddafdr0t8y2o93gaj",
    callbackURL: "http://localhost:3030/auth/twitch/callback",
    scope: "user_read"
    }, function(accessToken, refreshToken, profile, done) {
        Mods.find({ username: profile.username }).populate({path: '_channel', match: {name: config.channels[0]}}).exec( (err, mod) => {
            if(profile.username == config.channels[0].substr(1));
                mod.push(profile.username);
            return done(err, mod);
        });
    }
));

passport.serializeUser(function(user, done) {
    if (user.length != 1)
        done("You are not a mod for chanel: " + config.channels[0], user);
    else
        done(null, user);
});
 
passport.deserializeUser(function(user, done) {
    done(null, user);
});

router.get("/auth/twitch", passport.authenticate("twitch"));
router.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/404" }), function(req, res) {
    res.redirect("/");
});

router.get("/:channelID", function(req, res) {
    if(typeof req.params.channelID !== "undefined" && req.params.channelID !== "favicon.ico") {
        var findChannel = '#'+req.params.channelID;
        console.log(findChannel);
        async.waterfall([
            function(callback) {
                Channel.findOne({'name': findChannel}).exec( (err, foundChannel) => {
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
                ActiveChannel.remove({}, function() {});
                var myChannel = new ActiveChannel({ _channel: channelObj.id, name: channelObj.name });
                myChannel.save(function (err, channel) {
                    if (err) return console.error(err);
                    console.log("Saved Active Channel "  + channel.name);
                }); 
                callback(null, channel);
            }
        ], function(err, result) {
            console.log(result);
            res.sendFile("index.html", {"root": __dirname + "/../../" });
        });
    }
});

router.get("/get/viewers", function(req, res) {
    Viewers.find({}).populate({path: '_channel', match: {name: channelObj.name}}).exec((err, viewers) => {
        res.json(viewers);
        res.end();
    });
});

router.get("/get/channel", function(req, res) {
    ActiveChannel.find({}).populate('_channel').exec((err, channel) => {
        res.json(channel);
        res.end();
    });
});

module.exports = router;