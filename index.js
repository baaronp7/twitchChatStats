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

client.on("connected", function(address, port){
    console.log("Adress: " + address + " Port: " + port);
    client.action("akabennyp", "Whats up chat");
});

client.on("chat", function(channel, user, message, self) {
    if(message == "!twitter") {
        client.action("akabennyp", "www.twitter.com/AKABennyP");
    }
    else {
        client.action("akabennyp", "Whats up " + user['display-name']);
    }
});