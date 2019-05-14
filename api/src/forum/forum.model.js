const mongoose = require('mongoose');

require("../user/user.model");
const userModel = mongoose.model('user').schema;

var forumSchema = new mongoose.Schema({
    theme: {type: String, required: true},
    creator: {type: userModel, required: true},
    post: [{
        postCreator: { type: userModel, required: true },
        content: { type: String, required: true },
        challenge: {
            hp: {type: Number, min: 0},
            attack: {type: Number, min: 0},
            usersPassed: [{type: userModel}],
        },
        thread: [{
            messageCreator: {type: userModel, require: true},
            message: {type: String, require: true},
            time : { type : Date, default: Date.now }
        }],
        time : { type : Date, default: Date.now }
    }],
    players: [{
        user: { type: userModel, require: true },
        character: {
            name: {type: String, required: true, lowercase: true},
            race: {type: String, required: true, lowercase: true},
            type: {type: String, required: true, lowercase: true},
            commentNum: {type: Number, required: true, min: 0},
            hp: {type: Number, required: true, min: 0},
            attack: {type: Number, required: true, min: 0},
            level: {type: Number, required: true, min: 0}
        }
     }],
    playerNumber: {type: Number, required: true, default: 0},
    minLevel: {type: Number, required: true, default: 0},
    isActive: {type: Boolean, required: true, default: true}
}, {collection: 'forum'});

forumSchema.pre('save', function(next) {
    return next();
});

mongoose.model('forum', forumSchema);