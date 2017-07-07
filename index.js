var express = require('express');
var app = express();

app.use(express.static('public'));


var bodyParser = require('body-parser')
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({    
  extended: true
})); 

var mongoose = require('mongoose');
mongoose.connect('mongodb://twitchChatStats:Tw!tch123@ds151202.mlab.com:51202/heroku_0dj0339d');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connecteD");
});

var tmi = require("tmi.js");

var config = {
    options: {
        debug: true
    },
    conncetions: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: "AKABennyBot",
        password: "oauth:c4peosshgsvjpsjqqsa8nve1f5ditg"
    },
    channels: ["akabennyp"]
};

var client = new tmi.client(config);
client.connect();

var schemaDef = {
    username: {
        type: String,
        index: true,
        label: 'Username'
    },
    displayName: {
        type: String,
        label: 'Display Name'
    },
    subscribed: {
        type: Boolean,
        label: 'Subscribed'
    },
    messageCount: {
        type: Number,
        label: 'Message Count'
    },
    messages: {
        type: Array,
        label: 'Messages'
    }
};

var schema = mongoose.Schema(
    schemaDef
);

var model = mongoose.model('Users', schema);

client.on("connected", function(address, port){
    console.log("Adress: " + address + " Port: " + port);
    client.action("akabennyp", "Whats up chat");
});

client.on("chat", function(channel, user, message, self) {
    if(message == "!twitter") {
        client.action("akabennyp", "www.twitter.com/AKABennyP");
    }
    else {
        var User = model;
        usern = user['username'];
        User.findOne({username: usern}, (err, foundUser) => {
            if(foundUser) {
                console.log("user was found");
                foundUser.messageCount += 1;
                foundUser.messages.push(message);
                foundUser.subscribed = user['subscriber'];
                foundUser.save();
                console.log("user was updated");
            } else {
                var myUser = new User(JSON.parse('{"username":"' + user['username'] + '","displayName":"' + user['display-name'] + '","subscribed":"' + user['subscriber'] + '","messageCount":1,"messages":["' + message + '"]}'));
                myUser.save(function (err, user) {
                    if (err) return console.error(user);
                    console.log("Saved");
                }); 
            }
        });
        client.action("akabennyp", "Whats up " + user['display-name']);
    }
});

app.listen(process.env.PORT || 3030, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});