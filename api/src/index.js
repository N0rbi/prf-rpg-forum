var express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const cors = require('cors');
require("./user/user.model");

var app = express();

//userModel = setupMongo(mongoose, app);
var dbPath = "mongodb://db:27017";
app.set("dbPath", dbPath);
mongoose.connect(dbPath);

mongoose.connection.on('error', () => {
  console.log('db connection error');
});

const userModel = mongoose.model('user');


passport.serializeUser(function(user, done) {
  if(!user) return done("serialization problem", user);
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  if(!user) return done("serialization problem", user);
  return done(null, user);
});

passport.use('local',
new localStrategy(function(username, password, done) {
    userModel.findOne({username: username}, function(err, user) {
        if(!user || err) return done("cannot get user", false);
        user.comparePasswords(password, function(err, isMatch) {
            if(err || !isMatch) return done("password incorrect", false);
            return done(null, user);
        });
  });
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors());

app.use(expressSession({secret: 'admin123'}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./user/routes"));

app.listen(8080, () => {
    console.log('the server is running');
});