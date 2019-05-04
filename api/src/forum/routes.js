const express = require('express');
const mongoose = require('mongoose');
const forumModel = mongoose.model('forum');

var router = express.Router();

router.post('/createForum', function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({message: "Unauthorized access"})
    }

    var forum = new forumModel({
        theme: req.body.theme,
        creator: req.body.creator,
        post: [],
        players: [],
        playerNumber: req.body.playerNumber,
        minLevel: req.body.minLevel
    });
    forum.save((err) => {
        if (err) {
            return res.status(500).send({message: "internal error", error: err});
        }
        return res.status(200).send({message: "forum saved", forum: forum});
    })
});

router.get('/fetchForum', function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({message: "Unauthorized access"});
    }
    forumModel.find({_id: req.query.forumID}, function(err, user) {
        return res.status(200).send(user[0]);
    })
});

router.get('/fetchAllForums', function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({message: "Unauthorized access"});
    }
    forumModel.find({}, function(err, forums) {
        return res.status(200).send(forums);
    }, err => {
        return res.status(500).send(err);
    })
})


router.put('/playerJoin', function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({message: "Unauthorized access"});
    }
    forumModel.update(
        {_id: req.body.forumID},
        {
            $push: {players: {
                user: req.body.user,
                character: {
                    name: req.body.characterName,
                    race: req.body.characterRace,
                    type: req.body.characterType,
                    commentNum: req.body.characterCommentNumber,
                    hp: req.body.characterHp,
                    attack: req.body.characterAttack,
                    level: req.body.characterLevel
                }
            }}
        }, (forum) => {
            return res.status(200).send({message: "Sikeresen regisztrálva a játékba!", forum: forum})
        }, err => {
            return res.status(500).send({message: "Nem sikerült regisztrálni", err: err})
        }
    )
});

module.exports = router;
