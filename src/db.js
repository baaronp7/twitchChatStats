var mongoose = require('mongoose');

mongoose.connect('mongodb://twitchChatStats:Tw!tch123@ds151202.mlab.com:51202/heroku_0dj0339d');
var db = mongoose.connection;

exports.connect = function() {
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    console.log("db connected");
    });
};