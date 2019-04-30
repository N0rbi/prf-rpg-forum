var express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const cors = require('cors');

var app = express();
app.use(cors({origin:["http://localhost:4200"],credentials: true}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

var dbPath = "mongodb://localhost:27017";
app.set("dbPath", dbPath);

require("./user/user.model");
const userModel = mongoose.model('user');

mongoose.connect(dbPath);

mongoose.connection.on('connected', ()=> {
  console.log('db connected');
})

mongoose.connection.on('error', () => {
  console.log('db connection error');
});

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

app.use(expressSession({secret: 'admin123'}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./user/routes"));
app.use("/character", require("./character/routes"));


app.listen(8080, () => {
    console.log('the server is running');
});