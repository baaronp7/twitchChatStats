var router = require('express').Router();
var passport = require("passport");
var twitchStrategy = require("passport-twitch").Strategy;

var mainModel = require("../model.js");

var Viewers = mainModel.viewerModel;
var Mods = mainModel.modModel;
var config = require("../../config.json");

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

router.get("/", function(req, res) {
    res.sendFile("index.html", {"root": __dirname + "/../../" });
});

router.get("/viewers", function(req, res) {
    Viewers.find({}, (err, viewers) => {
        res.json(viewers);
        res.end();
    });
});

module.exports = router;