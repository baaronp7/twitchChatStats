var express = require('express');
var app = express();
var passport = require("passport");
var bodyParser = require('body-parser');

var db = require("./src/db.js");
var client = require("./src/tmiClient.js");
var config = require("./config.json");
var mainModel = require("./src/model.js");

var Viewers = mainModel.viewerModel;

app.use(express.static('public'));
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({    
  extended: true
})); 
app.use(passport.initialize());
app.use(require('./src/routes/index.js'));

db.connect();
client.connect(config.channels[0]);

app.listen(process.env.PORT || 3030, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});