const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const movie = require("./models/movieschema.js");
const seedDB = require("./models/seed.js");

mongoose.connect("mongodb://localhost/test",{useNewUrlParser: true,useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));

// var jocker = new movie({
// 	name:"Toy Story 4",
// 	image:"https://m.media-amazon.com/images/M/MV5BMTYzMDM4NzkxOV5BMl5BanBnXkFtZTgwNzM1Mzg2NzM@._V1_QL50_SY1000_CR0,0,674,1000_AL_.jpg",
// 	year:2019,
// 	about:"When a new toy called \"Forky\" joins Woody and the gang, a road trip alongside old and new friends reveals how big the world can be for a toy",
// 	director: "Josh Cooley",
//     actors: "Tom Hanks, Tim Allen, Annie Potts" 
// });

// jocker.save(function(err,res){
// 	if(err){
// 		console.log("An Error occured");
// 	}
// 	else{
// 		console.log(res);
// 	}
// });
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


app.get("/index/:id",function(req,res){
	movie.findById(req.params.id,function(err,foundMovie){
		if(err){
			console.log("Something went wrong");
		}
		else{
			res.render("show.ejs",{foundMovie:foundMovie});
		}
	});
})
app.get("/host",function(req,res){
	res.send("hello world",{movie:movie});
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.listen(3000,console.log("server is listening"));


/*class="form-inline my-2 my-lg-0"*/