var mongoose = require('mongoose');

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

exports.model = mongoose.model('Users', schema);

var modSchemaDef = {
    username: {
        type: String,
        index: true,
        label: 'Username'
    }
};

var modSchema = mongoose.Schema(
    modSchemaDef
);

exports.modModel = mongoose.model('Mods', modSchema);