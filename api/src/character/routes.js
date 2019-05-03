const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const userModel = mongoose.model('user');

var router = express.Router();

router.get("/all", (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({message: "unauthorized"});
    userModel.findOne({username: req.user.username}, (err, user) => {
        if(!user || err) return res.status(500).send({message: "internal error", error: err});
        return res.status(200).send({message: "ok", characters: user.characters});
    })
});

router.route("/:character_id")
    .get((req, res) => {
            if (!req.isAuthenticated()) return res.status(401).send({message: "unauthorized"});
            var character_id = req.params.character_id;
            userModel.findOne(
              {username: req.user.username, "characters": {$elemMatch: {"_id": mongoose.Types.ObjectId(character_id)}}},
              (err,user) => {
                if (!user || err) return res.status(500).send({message: "character not found", error: err});
                var result = user.characters.find(char => {
                  return char.id === character_id
                });
                return res.status(200).send({message: "character found", character: result});
              });
    });

router.route("/")
      .post((req, res) => {
        if (!req.isAuthenticated()) return res.status(401).send({message: "unauthorized"});
        var character_id = req.body.character_id;
        var character = {};
        Object.keys(req.body.character).forEach((key) => {
          character["characters.$."+key] = req.body.character[key];
        });
        console.log(character);
        userModel.findOneAndUpdate(
          {username: req.user.username, "characters": {$elemMatch: {"_id": mongoose.Types.ObjectId(character_id)}}},
          {$set: character},
          {new: true},
          (err,user) => {
            if (!user || err) return res.status(500).send({message: "character could not be modified", error: err});
            return res.status(200).send({message: "character updated"});
          });
      })
      .put((req, res) => {
        if (!req.isAuthenticated()) return res.status(401).send({message: "unauthorized"});
        var character = {name: req.body.name,
                        race: req.body.race,
                        type: req.body.type,
                        commentNum: 0,
                        hp: req.body.hp,
                        attack: req.body.attack,
                        level: 1};
        userModel.findOneAndUpdate(
          {username: req.user.username},
          {$push: {characters: character}},
          {new: true},
          (err,user) => {
            if (err) res.status(500).send({message: "character could not be added", error: err});
            return res.status(200).send({message: "character added", user: user});
          });
      })
      .delete((req, res) => {
        if (!req.isAuthenticated()) return res.status(401).send({message: "unauthorized"});
        var character_id = req.body.character_id;
        userModel.findOneAndUpdate(
                  {username: req.user.username},
                  {$pull: {"characters": {_id: mongoose.Types.ObjectId(character_id)}}},
                  {new: true},
                  (err,user) => {
                    if (err) return res.status(500).send({message: "character could not be deleted", error: err});
                    return res.status(200).send({message: "character deleted"});
                  });
      });

module.exports = router;
