const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const comment = require("./models/commentschema.js");
const movie = require("./models/movieschema.js");
const seedDB = require("./models/seed.js");
const user = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost/test",{useNewUrlParser: true,useUnifiedTopology: true});

// ================================
// passport setup

app.use(session({
	secret:"This is me you bitch",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
  function(username, password, done) {
    user.findOne({ username: username }, function (err, founduser) {
      if (err) { return done(err); }
      if (!founduser) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!founduser.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(req, user, done) {  //encrypt
    done(null, user.user_id);
});



passport.deserializeUser(function(user_id, done) {  // decrytp
    getUserInfo(user_id).then(function(user) {
        return done(null, user);
    }, function(err) {
        return done(err,null);
    });
});
// const Strategy = LocalStrategy.Strategy; 
// passport.use(new Strategy(user.authenticate())); 

//=================================

app.use(bodyParser.urlencoded({extended: true}));
// seedDB();
app.use(express.static("private"));

app.get("/",function(req,res){
	res.render("landing.ejs");
});

app.get("/index",function(req,res){
	let flag = null;
	if(req.query.query){
		const regex = new RegExp(escapeRegex(req.query.query), 'gi');
		movie.find({ "name": regex }, function(err, foundjobs) {
           if(err) {
               console.log(err);
           } else {
           	  if(foundjobs.length < 1){
           	  	flag = 'error';
           	  }
              res.render("index.ejs", { movies: foundjobs,flag:flag });
           }
        }); 
	}
	else{
		movie.find({},function(err,movies){
		  if(err){
			  console.log("some error occurred");
		  } 
		  else{
			res.render("index.ejs",{movies:movies,flag:flag});
		  }
	    });
	}
	
});

app.get("/index/register",function(req,res){
	res.render("register.ejs");
});

//=================
//login
//==================

app.post("/index/register",function(req,res){
	if ((req.body.username == null) || (req.body.password == null)){
		// return res.redirect("/index/register");
		return res.redirect("/index/register");
	}
	else{
		return res.send("login is gonna come soon......");
		
	}
});

app.get("/index/login",function(req,res){
	res.render("login.ejs");
});

app.post("/index/login",function(req,res){
		return res.send("login is gonna come soon.............");
});
//===================
//show
//===================
app.get("/index/:id",function(req,res){
	movie.findById(req.params.id).populate("comments").exec(function(err,foundMovie){
		if(err){
			console.log(err);
		}else{
			res.render("show.ejs",{foundMovie:foundMovie});
		}
	});
});

app.post("/index/:id",function(req,res){
	// res.redirect("/index/"+String(req.params.id));
	const comment1 = new comment({
		content:req.body.review
	});
	comment1.save(function(err,newreview){
		if(err){
			console.log(err);
		}
		else{
			movie.findById(req.params.id,function(err,founMovie){
				if(err){
					console.log("Something went wrong");
				}
				else{
			        founMovie.comments.push(newreview);
			        founMovie.save(function(err,data){
			        	if(err){
			        		console.log(err);
			        	}
			        	else{
			        		return res.redirect("/index/"+String(req.params.id));
			        	}
			        });
			    }
			});
		}
	});
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.listen(port,function(){
		console.log("server is listening")
});
