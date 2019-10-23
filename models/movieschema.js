const mongoose = require("mongoose");


var movieschema = new mongoose.Schema({
	name:String,
	image:String,
	year:Number,
	director:String,
	actors:String,
	about:String
});

module.exports = mongoose.model("movie",movieschema);