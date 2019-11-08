const mongoose = require("mongoose");

var commentschema = new mongoose.Schema({
	author:{type:String,default:"Anonymous"},
	content:String,
	date:{type:Date,default:Date.now}
});
module.exports = mongoose.model("comment",commentschema);