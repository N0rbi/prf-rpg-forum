const mongoose = require('mongoose');

require("../user/user.model");
const userModel = mongoose.model('user').schema;

var forumSchema = new mongoose.Schema({
    theme: {type: String, required: true},
    creator: {type: userModel, required: true},
    post: [{
        postCreator: { type: userModel, require: true },
        content: { type: String, require: true },
        thread: [{
            messageCreator: {type: userModel, require: true},
            message: {type: String, require: true}
        }]
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
    playerNumber: {type: Number, required: true},
    minLevel: {type: Number, required: true}
}, {collection: 'forum'});

forumSchema.pre('save', function(next) {
    return next();
});

mongoose.model('forum', forumSchema);