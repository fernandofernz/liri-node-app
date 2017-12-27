//keys
var keys = require("./keys.js");
//Twitter 
var Twitter = require('twitter');
//NPM request 
var request = require('request');
//Spotify
var Spotify = require('node-spotify-api');
// Core node package for reading and writing files
var fs = require("fs");

//user input
var userLiri = process.argv[2];



switch(userLiri) {
  case "my-tweets": myTweets(); 
   break;
  case "spotify-this-song": spotifyThisSong(); 
  break;
  case "movie-this": movieThis(); 
  break;
  case "do-what-it-says": doWhatItSays(); 
  break;
  // Instructions displayed in terminal to the user
  default: console.log("\r\n" +"Try typing one of the following commands after 'node liri.js' : " +"\r\n"+
    "1. my-tweets 'any twitter name' " +"\r\n"+
    "2. spotify-this-song 'any song name' "+"\r\n"+
    "3. movie-this 'any movie name' "+"\r\n"+
    "4. do-what-it-says."+"\r\n");
};

// Function do what it says
function doWhatItSays(){
  fs.readFile("random.txt", "utf8", function(error, data){
    if (!error) {
      doWhatItSaysResults = data.split(",");
      spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
    } else {
      console.log("Error occurred" + error);
    }
  });
};

// Function Spotify
function spotifyThisSong(userSong) {
  var songName = process.argv[3];
  if(!songName){
    songName =  "The Sign";
  }
  userRequest = songName;
  spotify.search({
    type: 'track',
    query: userRequest
  }, function (err, data) {
    if (!err) {

      var songInfo = data.tracks.items;

      if (songInfo[0] != undefined) {
        var spotifyResults =
          "Artist: " + songInfo[0].artists[0].name + "\r\n" +
          "Song: " + songInfo[0].name + "\r\n" +
          "Album the song is from: " + songInfo[0].album.name + "\r\n" +
          "Preview Url: " + songInfo[0].preview_url + "\r\n" +
          "------------------------------ " + " ------------------------------" + "\r\n";
        console.log(spotifyResults);

      }
    } else {
      return console.log('Error occurred: ' + err);
    }
  });
}

//OMDB 
function movieThis() {
  var movie = process.argv[3];
  if(!movie){
    movie = "mr nobody";
  }
  params = movie
  request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
    if (error){
      console.log(error);
    }else{
      var movieObject = JSON.parse(body);
      //console.log(movieObject); // Show the text in the terminal
     var movieResults =
     "Title: " + movieObject.Title+"\r\n"+
     "Year: " + movieObject.Year+"\r\n"+
     "Imdb Rating: " + movieObject.imdbRating+"\r\n"+
     "Country: " + movieObject.Country+"\r\n"+
     "Language: " + movieObject.Language+"\r\n"+
     "Plot: " + movieObject.Plot+"\r\n"+
     "Actors: " + movieObject.Actors+"\r\n";
     console.log(movieResults);
   
    }
  });
}

// Function mytweets
function myTweets() {
  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret,

  });
  var params = {
    screen_name: "liri_tweets"
  };

  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    // If no error
    if (!error) {
      //console.log(response);
      console.log(JSON.stringify(tweets, null, 2));
      //For loop 
      for (var i = 0; i < tweets.length; i++) {

        var userTweets =
          "User name: " + tweets[i].user.screen_name +
          "\n-> " + tweets[i].text +
          "\n-> " + tweets[i].created_at;

        console.log(userTweets);

      }
    } else {
      console.log("Error: " + error);
    }
  });
}