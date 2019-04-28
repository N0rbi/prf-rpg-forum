const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const userModel = mongoose.model('user');

var router = express.Router();

router.post("/signup", (req, res)=> {
  var nickname = req.body.nickname;
  var password = req.body.passport;
  if (!nickname) {
    return res.status(404).send({message: "nickname missing"});
  }
  if (!password) {
    return res.status(404).send({message: "password missing"});
  }

  var user = new userModel({nickname: nickname, password: password});
  user.save((err)=> {
    if (err) {
      return res.status(500).send({message: "internal error"});
    }
    //TODO: autologin
    return res.status(200).send({message: "authenticated"});
  });
});

router.post("/login", (req, res) => {
  var nickname = req.body.nickname;
  var password = req.body.passport;
  if (!nickname) {
    return res.status(404).send({message: "nickname missing"});
  }
  if (!password) {
    return res.status(404).send({message: "password missing"});
  }
  passport.authenticate('local', function (error, username) {
      if (error) {
          return res.status(403).send(error);
      } else {
          req.logIn(username, function (error) {
              if (error) return res.status(500).send(error);
              return res.status(200).send({message: "login successful"});
          })
      }
  })(req, res);
});

router.post('/logout', function(req, res) {
    if(req.isAuthenticated()) {
        req.logout();
        res.status(200).send({message: "logout successful"});
    } else {
        res.status(403).send({message: "no user to logout"});
    }
});

router.get("/debug", function(req, res) {
  var username = (req.user || {}).displayName;
  console.log(req.user);
  userModel.findOne({username: username}, function(err, user) {
      if(!user || err) return res.status(500).send({message: "user not found"});
      return res.status(200).send({message: "user found", user: user});
})});


module.exports = router;
