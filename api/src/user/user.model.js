const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true, lowercase: true},
    password: {type: String, required: true},
    characters: [{
      name: {type: String, required: true, lowercase: true},
      race: {type: String, required: true, lowercase: true},
      type: {type: String, required: true, lowercase: true},
      commentNum: {type: Number, required: true, min: 0},
      hp: {type: Number, required: true, min: 0},
      attack: {type: Number, required: true, min: 0},
      level: {type: Number, required: true, min: 0}
    }]
}, {collection: 'user'});

function raceValidator(raceCandid) {
  return /orc|human|elf/i.test(raceCandid);
}

function typeValidator(typeCandid) {
  return /bowman|mage|assassin/i.test(typeCandid);
}

userSchema.path("characters.0.race").validate(raceValidator, "Race `{VALUE}` is not valid");
userSchema.path("characters.0.type").validate(typeValidator, "Character type `{VALUE}` is not valid");


userSchema.pre('save', function(next) {
    var user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10, function(error, salt) {
            if(error) {
                return next(error);
            }
            bcrypt.hash(user.password, salt, function(error, hash) {
                if(error) {
                    return next(error);
                }
                user.password = hash;
                return next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePasswords = function(password, next) {
    bcrypt.compare(password, this.password, function(error, isMatch) {
        next(error, isMatch);
    });
};

mongoose.model('user', userSchema);
