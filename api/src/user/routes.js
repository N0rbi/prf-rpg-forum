const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const userModel = mongoose.model('user');
const ADMIN_NAME_LIST_FILE = "/utils/adminfile";

var router = express.Router();


router.post("/signup", (req, res)=> {
  var username = req.body.username;
  var password = req.body.password;
  if (!username) {
    return res.status(404).send({message: "username missing"});
  }
  if (!password) {
    return res.status(404).send({message: "password missing", body: req});
  }

  var user = new userModel({username: username, password: password});
  user.save((err)=> {
    if (err) {
      return res.status(500).send({message: "internal error", error: err});
    }
    //TODO: autologin
    return res.status(200).send({message: "authenticated", user: user});
  });
});

router.post("/login", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  if (!username) {
    return res.status(404).send({message: "username missing"});
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
              return res.status(200).send({message: "login successful", user: username});
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
  var username = (req.user || {}).username;
  console.log(req.user);
  userModel.findOne({username: username}, function(err, user) {
      if(!user || err) return res.status(500).send({message: "user not found", error: err});
      return res.status(200).send({message: "user found", user: user});
})});


router.get("/isAuthenticated", function(req, res) {
  return res.status(200).send({isAuthenticated: req.isAuthenticated()});
});

router.get('/fetchUser', function(req, res) {
  if(req.isAuthenticated()) {
      userModel.find({username: req.query.username}, function(err, user) {
          return res.status(200).send(user[0]);
      })
  } else {
      return res.status(401).send({message: "Unauthorized access"});
  }
});

router.get('/fetchAuthenticatedUser', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({message: "Unauthorized access"});
  }
  return res.status(200).send(req.user);
});


router.post("/isAdmin", function(req, res) {
    if (req.isAuthenticated()) {
        var username = req.user.username;
        var adminNames = getAdminNames();
          return res.status(200).send({isAdmin: adminNames.indexOf(username) != -1});

      } else {
        return res.status(401).send({message: "Unauthorized access"})
      }
});

function getAdminNames() {
    var contents = require('fs').readFileSync(ADMIN_NAME_LIST_FILE, 'utf8');
    return contents.split("\n");
}

module.exports = router;
