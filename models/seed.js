const mongoose = require("mongoose");
const movieschema = require("./movieschema.js");

const data = [
     {name:"Joker",image:"https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_QL50_SY1000_CR0,0,674,1000_AL_.jpg",
     year:2019,director:"Todd Phillips",actors:"Todd Phillips, Scott Silver",about:" In Gotham City, mentally-troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego"
     },
     {
     	name:"Terminator: Dark Fate",image:"https://m.media-amazon.com/images/M/MV5BNzhlYjE5MjMtZDJmYy00MGZmLTgwN2MtZGM0NTk2ZTczNmU5XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_QL50_SX640_CR0,0,640,999_AL_.jpg",
     	year:2019,director:"Tim Miller",actors:" Mackenzie Davis, Linda Hamilton, Edward Furlong",about:" Sarah Connor and a hybrid cyborg human must protect a young girl from a newly modified liquid Terminator from the future."
     },
     {
     	name:"Spider-Man: Far from Home",image:"https://m.media-amazon.com/images/M/MV5BMGZlNTY1ZWUtYTMzNC00ZjUyLWE0MjQtMTMxN2E3ODYxMWVmXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_QL50_SY1000_CR0,0,674,1000_AL_.jpg",
     	year:2019,director:"Jon Watts",actors:" Tom Holland, Samuel L. Jackson, Jake Gyllenhaal",about:"Following the events of Avengers: Endgame (2019), Spider-Man must step up to take on new threats in a world that has changed forever."
     },
     {
     	name:"Toy Story 4",image:"https://m.media-amazon.com/images/M/MV5BMTYzMDM4NzkxOV5BMl5BanBnXkFtZTgwNzM1Mzg2NzM@._V1_QL50_SY1000_CR0,0,674,1000_AL_.jpg",
     	year:2019,director:"Josh Cooley",actors:"Tom Hanks, Tim Allen, Annie Potts",about:"When a new toy called \"Forky\" joins Woody and the gang, a road trip alongside old and new friends reveals how big the world can be for a toy."
     }
];
function seed(){
	movieschema.remove({},function(err,result){
	  if(err){
		  console.log(err);
	  }
	  else{
		 console.log("Successfull removed");
		 data.forEach(function(seed){
		 	movieschema.create(seed,function(err,data){
		 		if(err){
		 			console.log("error");
		 		}
		 	})
		 });
	  }
   });
}


module.exports = seed;