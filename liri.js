var getliri = require('./keys.js');
var twitter = require("twitter");
var Spotify= require("node-spotify-api");
var spotify2 = require("spotify");
var request = require("request");
var fs = require('fs');

console.log("Type a command from the following to get started: my-tweets, spotify-this-song, movie-this, do-what-it-says");
var yourCommand = process.argv[2];
var yourRequest = process.argv[3];  
	for(i=4; i<process.argv.length; i++){
	    yourRequest += '+' + process.argv[i];
	}
function menu(){
	switch(yourCommand){
		case 'my-tweets':
		fetchTweet();
		break;

		case 'spotify-this-song':
		findSong();
		break;

		case 'movie-this':
		findMovie();
		break;

		case 'do-what-it-says':
		doThis();
		break;
	}
}

function fetchTweet(){
	var client = new twitter(getliri);
	var requirements = {
		name : 'Jessica97632269',
		numtweets : 20
	}


	client.get('statuses/user_timeline', requirements, function(error, tweets, response){
		if (!error) {
	        for (i=0; i<tweets.length; i++) {
	            var returnedData = ('Number: ' + (i+1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
	            console.log(returnedData);
	            console.log("-------------------------");
	        }
	    };
	});
}

function findSong(){
	console.log("");
	var music;

	if(yourRequest === undefined){
		music = "What's My Age Again?";
	} else {
		music = yourRequest;
	} 
	var spotify = new Spotify({
		id: '36e099e2b49142e8b6de9aaf46eb08ea',
		secret: 'b453fd6c883544a6ab254120ecba0144' 
	})

	spotify.search({type:'track', query: music}, function(err,data){
	    if(err){
	        console.log('Error occurred: ' + err);
	        return;
	    }else{
	        //tried searching for release year! Spotify doesn't return this!
	  		console.log("Artist: " + data.tracks.items[0].artists[0].name);
	        console.log("Song: " + data.tracks.items[0].name);
	        console.log("Album: " + data.tracks.items[0].album.name);
	        console.log("Preview Here: " + data.tracks.items[0].preview_url);
	    }
	});
}

function findMovie(){
	var movie;
	if(yourRequest === undefined){
		movie = "Mr. Nobody";
	} else {
		movie = yourRequest;
	}
	var url = 'http://www.omdbapi.com/?APIkey=[c33ea8ba]&t=' + movie +'&y=&plot=long&tomatoes=true&r=json';
	request(url, function(error, response, body){
		if(!error && response.statusCode === 200){
			console.log(body);
			console.log("Title: " + JSON.parse(body)["Title"]);
	        console.log("Year: " + JSON.parse(body)["Year"]);
	        console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
	        console.log("Country: " + JSON.parse(body)["Country"]);
	        console.log("Language: " + JSON.parse(body)["Language"]);
	        console.log("Plot: " + JSON.parse(body)["Plot"]);
	        console.log("Actors: " + JSON.parse(body)["Actors"]);
	        console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
	        console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
		}
	});
}

function doThis(){
	console.log("Looking at random.txt.");
	fs.readFile("random.txt", "utf8", function(error, data) {
		if(error){
			console.log(error);
		} else {
			var dataArr = data.split(',');
			yourCommand = dataArr[0];
			yourRequest = dataArr[1];
			for(i = 2; i < dataArr.length; i++){
				yourRequest = yourRequest + "+" + dataArr[i];
			}
			menu(); //after extracting data from random.txt, call menu function again
		}
	});
};

menu(); //calling main switch function