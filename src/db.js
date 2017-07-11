var mongoose = require('mongoose');

exports.connect = function() {
    var promise = mongoose.connect('mongodb://twitchChatStats:Tw!tch123@ds151202.mlab.com:51202/heroku_0dj0339d', { useMongoClient: true });
    promise.then(function(db) {
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log("db connected");
        });
    });
};