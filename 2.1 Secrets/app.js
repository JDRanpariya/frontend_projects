require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongooes = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const findOrCreate = require('mongoose-findorcreate');
LocalStrategy = require('passport-local').Strategy;
const passportlocalmongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  secret: 'Our little secret',
  resave: false,
  saveUninitialized: false,

}));

app.use(passport.initialize());
app.use(passport.session());

mongooes.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});


const userSchema = new mongooes.Schema({
  email:String,
  password:String,
  googleId:String,
  secret:String,
});


userSchema.plugin(passportlocalmongoose);
userSchema.plugin(findOrCreate);

const User = new mongooes.model("User", userSchema);


// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
  },
  function(accessToken, refreshToken, profile, cb) {

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
// Authenticate Requests

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }
));



app.get('/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });


app.get("/", function (req, res) {
  res.render("home");
})

app.get("/submit", function (req, res) {
  if (req.isAuthenticated()){
      res.render("submit");
  }else {
    res.redirect("/login");
  }

})

app.get("/login", function (req, res) {
  res.render("login");
})

app.get("/register", function (req, res) {
  res.render("register");
})

app.get("/secrets", function (req, res) {
  if (req.isAuthenticated()){
     User.find({secret:{$ne:null}},function(err,users){
      res.render("secrets", {users:users});
    })

  }else {
    res.redirect("/login");
  }
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req,res){

    User.register({username:req.body.username}, req.body.password,function(err, user) {
      if (err) {
        if (err.name==='UserExistsError'){
          res.redirect("/login");
        }else
        res.redirect("/register");
      } else{
        passport.authenticate("local")(req, res, function (){
          res.redirect("/secrets");
        });
      }
    });

  });




app.post("/login", function(req, res) {

  const user = new User ({
    username:req.body.username,
    password:req.body.password
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    }else {
      passport.authenticate("local")(req, res, function (){
        res.redirect("/secrets");
        });
      }

    });

});

app.post("/submit", function (req, res) {

const newSecret = req.body.secret;

User.findById(req.user._id, function(err, foundUser) {
  if (err) {
    console.log(err);

  }else {
    if (foundUser) {
      foundUser.secret = newSecret;
      foundUser.save(function(){
        res.redirect("/secrets");
      });
    }
  }
});
});


app.listen(3000, function () {
  console.log("server started on port 3000");
});