var express = require('express');
var app = express();
var passport = require("passport");
var twitchStrategy = require("passport-twitch").Strategy;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var tmi = require("tmi.js");
var async = require('async');
var config = require("./config.json");
var mainModel = require("./src/model.js");
var db = require("./src/db.js");

var model = mainModel.model;
var modModel = mainModel.modModel;
var mods = null;
var client = new tmi.client(config);

app.use(express.static('public'));
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({    
  extended: true
})); 
app.use(passport.initialize());

db.connect();
client.connect();

client.on("connected", function(address, port){
    client.action(config.channels[0], "Whats up chat");
    client.mods(config.channels[0]).then(function(data) {
        var Mods = modModel;
        console.log(data);
        async.eachSeries(data, function iteratee(mod, callback) {
            console.log(mod);
            Mods.findOne({ username: mod }, (err, foundUser) => {
                if(foundUser) {
                    console.log("mod " + foundUser.username + " already exist");
                } else {
                    var myUser = new Mods(JSON.parse('{"username":"' + mod + '"}'));
                    myUser.save(function (err, user) {
                        if (err) return console.error(user);
                        console.log("Saved Mod "  + mod);
                    }); 
                }
            });
            callback();
        }, function done() {
            console.log("Mods Updated");
        });

    }).catch(function(err) {
        console.log(err);
    });
});

client.on("chat", function(channel, user, message, self) {
    if(message == "!twitter") {
        client.action(config.channels[0], "www.twitter.com/AKABennyP");
    }
    else {
        var User = model;
        usern = user['username'];
        User.findOne({username: usern}, (err, foundUser) => {
            if(user['username'] !== "akabennybot") {
                if(foundUser) {
                    console.log("user was found");
                    foundUser.messageCount += 1;
                    foundUser.messages.push(JSON.parse('{"message": "' + escape(message) + '", "messageDate":"' + new Date() + '"}'));
                    foundUser.subscribed = user['subscriber'];
                    foundUser.save();
                    console.log("user was updated");
                } else {
                    var myUser = new User(JSON.parse('{"username":"' + user['username'] + '","displayName":"' + user['display-name'] + '","subscribed":"' + user['subscriber'] + '","messageCount":1,"messages":[{"message": "' + escape(message) + '", "messageDate":"' + new Date() + '"}]}'));
                    myUser.save(function (err, user) {
                        if (err) return console.error(user);
                        console.log("Saved");
                    }); 
                }
            }
        });
    }
});

passport.use(new twitchStrategy({
    clientID: "3qgiq0lekijkuu50z4ck6qaqgp63wf",
    clientSecret: "sptesrjxyp41uddafdr0t8y2o93gaj",
    callbackURL: "http://localhost:3030",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    var User = model; 
    User.findOrCreate({ username: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});
 
passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get("/auth/twitch", passport.authenticate("twitch"));
app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    res.redirect("/");
});

app.get("/", function(req, res) {
    var request = require("request");

    var options = { 
        method: 'GET',
        url: 'https://api.twitch.tv/kraken',
        qs: { oauth_token: req.query.code },
        headers: 
        { 
            'postman-token': '5cfa2760-ad7f-7b81-6370-5182a13ea426',
            'cache-control': 'no-cache',
            'client-id': 'e02sdbg7xy5j86e61ik398k9k6c340',
            accept: 'application/vnd.twitchtv.v5+json'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
    });

    res.sendFile("index.html", {"root": __dirname });
});

app.get("/users", function(req, res) {
    var Users = model;
    Users.find({}, (err, users) => {
        res.json(JSON.stringify(users));
        res.end();
    });
});

app.listen(process.env.PORT || 3030, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});