// Core node package for reading and writing files
var fs = require("fs");
// Twitter NPM package
var Twitter = require('twitter');
// Twitter key folder
var keys = require("./keys.js");
// Spotify NPM package
var Spotify = require('node-spotify-api');
// Request NPM package
var request = require("request");
// user input
var userLiri = process.argv[2];


//Switch user commands
switch (userLiri) {
  case "my-tweets":
    myTweets();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
    // Instructions 
  default:
    console.log("\r\n" + "Try typing one of the following commands after 'node liri.js' : " + "\r\n" +
      "1. my-tweets" + "\r\n" +
      "2. spotify-this-song any song name " + "\r\n" +
      "3. movie-this any movie name " + "\r\n" +
      "4. do-what-it-says." + "\r\n");
};

//Twitter function
function myTweets() {
  // New object with keys
  var client = new Twitter(keys);
  //Parameter for Screen_Name @liri_tweets
  var params = {
    screen_name: "liri_tweets"
  };
  
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      //Pretty print tweets object
      //console.log(JSON.stringify(tweets, null, 2));

      // for loop to print 20 tweets
      for (var i = 0; i < tweets.length && i < 20; i++) {

        var userTweets =
          "User name: " + tweets[i].user.screen_name +
          "\n-> " + tweets[i].text +
          "\n-> " + tweets[i].created_at;

        console.log(userTweets);
      }
    }
    //Print if there is an Error
    else {
      //Print error
      console.log(error);
    }
  });
};


//Spotify function
function spotifyThisSong(songName) {

  var spotify = new Spotify({
    id: "ddf4120d2cc84c31989f4f52816dc9e7",
    secret: "289530e972ad445590afb1722cd507a7"
  });

  var songName = process.argv[3];
  if (!songName) {
    songName = "Ace of Bass";
  }
  userRequest = songName;

  spotify.search({
    type: 'track',
    query: userRequest
  }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var songInfo = data.tracks.items;

    if (songInfo[0] != undefined) {
      var spotifyResults =
        "Artist: " + songInfo[0].artists[0].name + "\r\n" +
        "Song: " + songInfo[0].name + "\r\n" +
        "Album the song is from: " + songInfo[0].album.name + "\r\n" +
        "Preview Url: " + songInfo[0].preview_url + "\r\n";

      console.log(spotifyResults);

    }
  });
};

// Function movieThis
function movieThis() {

  var movie = process.argv[3];
  if (!movie) {
    movie = "Titanic";
  }
  params = movie

  var movieName = "Titanic";
  var queryUrl = "http://www.omdbapi.com/?t=" + params + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function (error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      var movieObject = JSON.parse(body);

      var movieResults =
        "Title: " + movieObject.Title + "\r\n" +
        "Year: " + movieObject.Year + "\r\n" +
        "Imdb Rating: " + movieObject.imdbRating + "\r\n" +
        "Rotten Tomatoes Rating: " + movieObject.Ratings[1].Value + "\r\n" +
        "Country: " + movieObject.Country + "\r\n" +
        "Language: " + movieObject.Language + "\r\n" +
        "Plot: " + movieObject.Plot + "\r\n" +
        "Actors: " + movieObject.Actors + "\r\n";
      console.log(movieResults);

    }
  });
};

// Function do what it says
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (!error) {
      doWhatItSaysResults = data.split(",");
      spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
    } else {
      console.log("Error occurred" + error);
    }
  });
};