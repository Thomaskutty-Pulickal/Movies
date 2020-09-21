const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const comment = require("./models/commentschema.js");
const movie = require("./models/movieschema.js");
const seedDB = require("./models/seed.js");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");
var errors = [];

mongoose.connect("mongodb://localhost/test",{useNewUrlParser: true,useUnifiedTopology: true});

// ================================
// passport setup

app.use(session({
	secret:"This is me",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy({usernameField:'username'},
  function(username, password, done) {
    User.findOne({ username: username }, function (err, founduser) {
      if (err) { return done(err); }
      if (!founduser) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password,founduser.password,function(err,isMatch){
      	if(err){
      		console.log(err);
      	}
      	if(isMatch){
      		return done(null,founduser);
      	}
      	else{
      		return done(null,false,{message:'password incorrect'});
      	}
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
// const Strategy = LocalStrategy.Strategy; 
// passport.use(new Strategy(user.authenticate())); 

//=================================

app.use(bodyParser.urlencoded({extended: true}));
seedDB();
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
	res.render("register.ejs",{errors:errors});
});

//=================
//login
//==================

app.post("/index/register",function(req,res){
	if ((req.body.username.length < 5) || (req.body.password.length < 5)){
		// return res.redirect("/index/register");
		errors.push("Use appropriate credentials");
		res.render("register.ejs",{errors:errors});
	}
	else{
		const newUser = new User({username:req.body.username,password:req.body.password});
		User.findOne({username:newUser.username},function(err,user){
			if(err){
				console.log(err);
			}
			if(user){
				errors.push('The username already taken');
				return res.render('register.ejs',{errors:errors});
			}
			if(!user){
				bcrypt.genSalt(10, function(err, salt){
					bcrypt.hash(req.body.password,salt,function(err,hash){
						newUser.password = hash;
						newUser.save(function(newerr,result){
							if(newerr){
								console.log(err);
							}
							else{
								errors.push("successfully regestered you can now login");
								return res.redirect("/index/login");
							}
						});
					});
				});
			}
		});
		
	}
});

app.get("/index/login",function(req,res){
	res.render("login.ejs",{errors:errors});
});

app.post("/index/login",function(req,res,next){
        passport.authenticate("local",{
		successRedirect:"/index",
		failureRedirect:"/index/login"
	    })(req,res,next);
});

app.get("/index/logout",function(req,res){
	req.logout();
	res.redirect("/index");
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

app.post("/index/:id",isLoggedIn,function(req,res){
	// res.redirect("/index/"+String(req.params.id));
	const comment1 = new comment({
		author:req.user.username,
		content:req.body.review
	});
	comment1.save(function(err,newreview){
		if(err){
			console.log(err);
		}
		else{
			console.log(newreview);
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
			        		console.log(data);
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

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		console.log("login first");
		return res.redirect("/index/login");
	}
}

app.listen(3000,console.log("server is listening"));

