var express = require('express');
var app = express();
var passport = require("passport");
var twitchStrategy = require("passport-twitch").Strategy;
var bodyParser = require('body-parser');

var db = require("./src/db.js");
var client = require("./src/tmiClient.js");

app.use(express.static('public'));
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({    
  extended: true
})); 
app.use(passport.initialize());

db.connect();
client.connect();

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