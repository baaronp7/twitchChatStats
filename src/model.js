var mongoose = require('mongoose');

var channelSchemaDef = {
    name: {
        type: String,
        index: true,
        label: 'Username'
    },
    activeChannel: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ActiveChannel' }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    mods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mods' }]
};

var channelSchema = mongoose.Schema(
    channelSchemaDef
);

exports.channelModel = mongoose.model('Channel', channelSchema);

var activeChannelSchemaDef = {
    _channel: { type: String, ref: 'Channel' },
    name: {
        type: String,
        index: true,
        label: 'Username'
    },
};

var activeChannelSchema = mongoose.Schema(
    activeChannelSchemaDef
);

exports.activeChannelModel = mongoose.model('ActiveChannel', activeChannelSchema);

var viewerSchemaDef = {
    _channel: { type: String, ref: 'Channel' },
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

var viewerSchema = mongoose.Schema(
    viewerSchemaDef
);

exports.viewerModel = mongoose.model('Users', viewerSchema);

var modSchemaDef = {
    _channel: { type: String, ref: 'Channel' },
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