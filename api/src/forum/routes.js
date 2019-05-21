const express = require('express');
const mongoose = require('mongoose');
const forumModel = mongoose.model('forum');
const adminService = require("../utils/admin.service");

var router = express.Router();

function createForum(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({message: "Unauthorized access"})
    }

    const welcomePost = {
        postCreator: req.user,
        content: "Welcome to my game, let's get started"
    };

    var forum = new forumModel({
        theme: req.body.theme,
        creator: req.user,
        post: [welcomePost],
        players: [],
        playerNumber: req.body.playerNumber,
        minLevel: req.body.minLevel
    });
    forum.save((err) => {
        if (err) {
            return res.status(500).send({message: "internal error", error: err});
        }
        return res.status(200).send({message: "Fórum létrehozva", forum: forum});
    })
}

router.put("/", createForum);
//DEPRECATED: "/createForum"
router.post('/createForum', createForum);

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
    // if (adminService.isAdmin(req.user.username)) {
    //     forumModel.find({}, function(err, forums) {
    //         return res.status(200).send(forums);
    //     }, err => {
    //         return res.status(500).send(err);
    //     })
    // } else {
        forumModel.aggregate([
            {$project: {_id: 1, theme: 1, creator: 1, players: 1, playerNumber: 1, minLevel: 1, isActive: 1}}
        ],
         function(err, forums) {
            if (err) return res.status(500).send({message: "Nem sikerült fórumokat betölteni", err: err})
            return res.status(200).send({message: "Fórumok betöltve", forum: forums})
        })
    // }
});


router.put('/playerJoin', function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({message: "Unauthorized access"});
    }
    forumModel.aggregate([
        {$match: {_id: mongoose.Types.ObjectId(req.body.forum_id)}},
        {$project: {creator: 1, players: 1, playerNumber: 1, minLevel: 1, isActive: 1}}
    ]).exec(
     function(err, criteria) {
        if (err || criteria.length === 0) {
            return res.status(500).send({message: "Nem sikerült a kritériumok ellenőrzése.", err: err});
        }
        //check min level & game creator can also play (shouldnt be able to) + player number
         console.log('criteria', criteria);
        criteria = criteria[0];
        var playerIds = (criteria.players).map(player=>player.user._id.toString());
        var isOwner = criteria.creator._id === req.user._id;
        var isPlayerExperienced = criteria.minLevel <= req.body.character.level;
        var isPlayerAlreadyInLobby = playerIds.indexOf(req.user._id) !== -1;
        var isLobbyFull = playerIds.length === criteria.playerNumber;
        var isActive = criteria.isActive;
        var errorMessages =
        [
         {isError: isOwner, message: "Játékmesterek nem lehetnek játékosok."},
         {isError: !isPlayerExperienced, message: "A karakter szintje nem éri el a minimumot."},
         {isError: isPlayerAlreadyInLobby, message: "Már a játék része vagy."},
         {isError: isLobbyFull, message: "Több játékos nem csatlakozhat a játékhoz."},
         {isError: !isActive, message: "A játék már véget ért"}
        ];
        var errorList = errorMessages.filter(errorObj => errorObj.isError).map(errorObj=>errorObj.message);
        if (errorList.length !== 0) {
            return res.status(403).send({message: "Sikertelen csatlakozás", "errors": errorList});
        }
        forumModel.update(
            {_id: req.body.forum_id},
            {
                $push: {players: {
                    user: req.user,
                    character: req.body.character
                }}
            }, (forum) => {
                return res.status(200).send({message: "Sikeresen regisztrálva a játékba!", forum: forum})
            }, err => {
                return res.status(500).send({message: "Nem sikerült regisztrálni", err: err})
            }
        )
    });

});

router.post("/endGame/:forum_id", function (req, res) {
    forumModel.findOne({_id: mongoose.Types.ObjectId(req.params.forum_id)}, function (err, forum) {
        if (!forum || err) return res.status(500).send({message: "forum not found", error: err});
        if (forum.creator._id.toString() !== req.user._id.toString()) return res.status(402).send({message: "Nincs jogosultságod a művelethez"});

        forumModel.updateOne({_id: mongoose.Types.ObjectId(req.params.forum_id)}, {isActive: false}, function (err, forum) {
            if (!forum || err) return res.status(500).send({message: "user not found", error: err});
            return res.status(200).send({message: "Fórum archiválva"});
        });

    })
});

router.post("/takeChallenge/:forum_id/:post_id", function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({message: "Unauthorized access"});
    }

    forumModel.aggregate(
    [
    {$match: {_id: mongoose.Types.ObjectId(req.params.forum_id)}},
    {$unwind: "$players"},
    {$match: {"players.user._id": mongoose.Types.ObjectId(req.user._id)}},
    {$project: {character: "$players.character"}}
    ],
    function(err, character) {
       if (err) return res.status(500).send({message: "Szerverhiba.", err: err})
        forumModel.aggregate(
            [
            {$match: {_id: mongoose.Types.ObjectId(req.params.forum_id)}},
            {$unwind: "$post"},
            {$match: {"post._id": mongoose.Types.ObjectId(req.params.post_id)}},
            {$project: {character: "$players.character"}}
            ],
            function(err, challenge) {
               if (err) return res.status(500).send({message: "Szerverhiba.", err: err})
               var challengeResult = req.body.throw > ((character.hp + character.attack) / (challenge.hp + challenge.attack )) * 5;
               if (challengeResult) {
                   forumModel.update(
                       {_id: req.params.forum_id, post: {$elemMatch: {"_id": req.params.post_id}}},
                       {
                           $push: {"post.$.challenge.usersPassed": req.user}
                       }, (forum) => {
                           return res.status(200).send({message: "Küldetés sikerrel teljesítve", forum: forum})
                       }, err => {
                           return res.status(500).send({message: "Szerverhiba.", err: err})
                       }
                   )
               } else {
                    forumModel.update(
                       {_id: req.params.forum_id, players: {$elemMatch: {"user._id": req.user._id}}},
                       {
                           $set: {"players.$.character.hp": 0, "players.$.character.attack": 0}
                       }, (forum) => {
                           return res.status(200).send({message: "A karaktered elesett.", end: true ,forum: forum})
                       }, err => {
                           return res.status(500).send({message: "Szerverhiba.", err: err})
                       }
                   )
               }
           })
       })
});

//CREATE FORUM POST or DELETE FORUM
router.route("/:forum_id")
    .get(function(req, res) {
        if (!req.isAuthenticated()) {
            return res.status(401).send({message: "Unauthorized access"});
        }
        forumModel.aggregate(
        [
        {$match: {_id: mongoose.Types.ObjectId(req.params.forum_id)}},
        {$unwind: "$post"},
        {$match: {"post.time":
        {$lte: getFirstNonCompletedChallengeTimestamp(req.params.forum_id, req.user._id)}}},
         {"$group":
            {
                "_id": "$_id",
                "theme": { "$first": "$theme" },
                "creator": { "$first": "$creator" },
                "players": { "$first": "$players" },
                "playerNumber": { "$first": "$playerNumber" },
                "minLevel": {"$first": "$minLevel"},
                "post": { "$push": "$post" }
            }
        }
        ],
        function(err, forum) {
           if (err) return res.status(500).send({message: "Nem sikerült fórumot betölteni", err: err})
           var playerIds = forum[0].players.map(player=>player.user._id.toString());
           if (playerIds.indexOf(req.user._id) != -1 || forum[0].creator._id == req.user._id) {
               return res.status(200).send({message: "Fórum betöltve", forum: forum[0]});
           }
           // the user is not part of the lobby
           return res.status(402).send({message: "Nincs jogosultságod a fórumhoz"})
       })
    })
    .put(function(req, res) {
        if (!req.isAuthenticated()) {
            return res.status(401).send({message: "Unauthorized access"});
        }
        //if he is UP_TO_DATE with forum, aka he has passed all previous challenges
        var userLatestVisible = getFirstNonCompletedChallengeTimestamp(req.params.forum_id, req.user._id);
            forumModel.aggregate(
                [
                    {$match: {_id: mongoose.Types.ObjectId(req.params.forum_id)}},
                    {$unwind: "$post"},
                    {$project: {"post.time": 1, "post.challenge.usersPassed": 1}},
                    {$project: {"time": "$post.time"}},
                    {$sort: {"time": -1}},
                    {$limit: 1}
                ]
            , function(err, lastEntryDate) {
                if (Date(userLatestVisible) < Date(lastEntryDate)) {
                    return res.status(403).send({message: "Ahhoz hogy írhass a fórumra előbb teljesítened kell a kihívásokat"});
                }

                    forumModel.aggregate(
                        [
                            {$match: {_id: mongoose.Types.ObjectId(req.params.forum_id)}},
                            {$unwind: "$post"},
                            {$match: {"post.time":
                                        {$lte: getFirstNonCompletedChallengeTimestamp(req.params.forum_id, req.user._id)}}},
                            {"$group":
                                    {
                                        "_id": "$_id",
                                        "theme": { "$first": "$theme" },
                                        "creator": { "$first": "$creator" },
                                        "players": { "$first": "$players" },
                                        "playerNumber": { "$first": "$playerNumber" },
                                        "minLevel": {"$first": "$minLevel"},
                                        "post": { "$push": "$post" }
                                    }
                            }
                        ],
                        function(err, forum) {
                            if (!forum ||  forum.length === 0 || forum[0].creator._id != req.user._id && req.body.challenge) {
                                return res.status(500).send({message: "Nem sikerült a posztot létrehozni", err: err ? err : "Játékosok nem hozhatnak létre kihívásokat"});
                            }

                            forumModel.update(
                                {_id: req.params.forum_id},
                                {
                                    $push: {post: {
                                            postCreator: req.user,
                                            content: req.body.content,
                                            challenge: req.body.challenge
                                        }}
                                }, (forum) => {
                                    return res.status(200).send({message: "Poszt létrehozva", forum: forum})
                                }, err => {
                                    return res.status(500).send({message: "Nem sikerült a posztot létrehozni", err: err})
                                }
                            )
                        });
            });
    })
    .delete(function(req, res) {
        if (!req.isAuthenticated()) {
            return res.status(401).send({message: "Unauthorized access"});
        }
        forumModel.findByIdAndRemove(req.params.forum_id,
            (err, forum) => {
                if (err) return res.status(500).send({message: "Fórum törlése sikertelen", err: err});
                return res.status(200).send({message: "Fórum törölve", forum: forum});
            }
        )
    });

//CREATE THREAD FOR FORUM POST or DELETE FORUM POST
router.route("/:forum_id/:post_id")
    .put(function(req, res) {
        if (!req.isAuthenticated()) {
            return res.status(401).send({message: "Unauthorized access"});
        }
        var [forum_id, post_id] = [req.params.forum_id, req.params.post_id];
        forumModel.update(
            {_id: mongoose.Types.ObjectId(forum_id), "post": {$elemMatch: {"_id": mongoose.Types.ObjectId(post_id)}}},
            {
                $push: {"post.$.thread" : {
                    messageCreator: req.user,
                    message: req.body.message
                }}
            }, (forum) => {
                return res.status(200).send({message: "Szál elem hozzáadva", forum: forum})
            }, err => {
                return res.status(500).send({message: "Szál elem létrehozása sikertelen", err: err})
            }
        )
    })
    .delete(function(req, res) {
        if (!req.isAuthenticated()) {
            return res.status(401).send({message: "Unauthorized access"});
        }
        var [forum_id, post_id] = [req.params.forum_id, req.params.post_id];
        forumModel.update(
            {_id: mongoose.Types.ObjectId(forum_id)},
            {
                $pull: {post: {
                    _id: mongoose.Types.ObjectId(post_id)
                }}
            }, (forum) => {
                return res.status(200).send({message: "Poszt törölve", forum: forum})
            }, err => {
                return res.status(500).send({message: "Nem sikerült a posztot törölni", err: err})
            }
        )
    });

router.delete("/:forum_id/:post_id/:thread_item_id", function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({message: "Unauthorized access"});
    }
    var [forum_id, post_id, thread_item_id] = [req.params.forum_id, req.params.post_id, req.params.thread_item_id];
    forumModel.update(
        {_id: mongoose.Types.ObjectId(forum_id), post: {$elemMatch: {_id: mongoose.Types.ObjectId(post_id)}}},
        {
            $pull: {"post.$.thread": {
                _id: mongoose.Types.ObjectId(thread_item_id)
            }}
        }, (forum) => {
            return res.status(200).send({message: "Szál elem törölve", forum: forum})
        }, err => {
            return res.status(500).send({message: "Nem sikerült a szál elemet törölni", err: err})
        }
    )
});

function getFirstNonCompletedChallengeTimestamp(forum_id, user_id) {
    var date;
    forumModel.aggregate(
        [
            {$match: {_id: mongoose.Types.ObjectId(forum_id)}},
            {$unwind: "$post"},
            {$project: {"post.time": 1, "post.challenge.usersPassed": 1}},
            {$match: {"post.challenge.usersPassed": { $exists: true, $not: {$size: 0}}}},
            {$match: {"post.challenge.usersPassed": {$not: {$elemMatch: {_id: mongoose.Types.ObjectId(user_id)}}}}},
            {$project: {"time": "$post.time"}},
            {$sort: {"time": 1}},
            {$limit: 1}
        ]
    , function(err, result) {
        date = result;
    });
    return !!date ? new Date(date) : new Date(new Date().getTime() + 100);
}

module.exports = router;
