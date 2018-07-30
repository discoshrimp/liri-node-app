require("dotenv").config();
var fs = require("fs")
var request = require("request")
var Twitter = require("twitter")
var spotify = require("node-spotify-api")
var keys = require("./keys")
var spotSearch = new spotify(keys.spotify)
var client = new Twitter(keys.twitter);
var type = process.argv[2]
var search = process.argv[3]

if (type === "my-tweets") {
	var params = { screen_name: '@groovecrab', count: 20 };
	client.get('statuses//user_timeline', params, function (error, tweets, response) {
		if (!error) {
			for (var i = 0; i < 20; i++) {
				console.log(tweets[i].text)
				fs.appendFile("log.txt", "\n-----------------------------------\n"+tweets[i].text, function (err) {
					if (!err) {
						console.log("saved")
					}
				})
			}
		} else {
			console.log("error: " + error[0])
		}
	});

} else if (type === "spotify-this-song") {
	spotSearch.search({ type: 'track', query: search }, function (err, data) {
		var useData = [data.tracks.items[0].artists[0].name, data.tracks.items[0].name, data.tracks.items[0].external_urls.spotify, data.tracks.items[0].album.name]
		if (err) {
			console.log('Error occurred: ' + err);
		} else {
			console.log(`${"Artist: " + data.tracks.items[0].artists[0].name}\n${"Song Title: " + data.tracks.items[0].name}\n${"Link: " + data.tracks.items[0].external_urls.spotify}\n${"Album: " + data.tracks.items[0].album.name}`)
			fs.appendFile("log.txt", "\n-----------------------------------\n"+useData, function (err) {
				if (!err) {
					console.log("saved")
				}
			})
		}
	})
} else if (type === "movie-this") {
	request("https://www.omdbapi.com/?t=" + search + "&apikey=3efbbefc", function (error, response, body) {

		//for some reason body doesnt like being broken down into its constituent elements and can only be logged as the full object
		console.log('error:', error)
		console.log("status code:", response && response.statusCode)
		console.log(`${"Title: " + body.Title}\n${"Year: " + body.Year}\n ${"Rated: " + body.Rated}\n${"IMBD Rating: " + body.imdbRating}\n${"Country: " + body.Country}\n${"Language: " + body.Language}\n${"Plot: " + body.Plot}\n${"Actors: " + body.Actors}`)
		fs.appendFile("log.txt", "\n-----------------------------------\n"+body, function (err) {
			if (!err) {
				console.log("saved")
			}
		})
		console.log('body:', body)
	})

} else if (type === "do-what-it-says") {
	spotSearch.search({ type: 'track', query: search }, function (err, data) {
		if (err) {
			console.log('Error occurred: ' + err);
		} else {
			console.log(`${"Artist: " + data.tracks.items[0].artists[0].name}\n${"Song Title: " + data.tracks.items[0].name}\n${"Link: " + data.tracks.items[0].external_urls.spotify}\n${"Album: " + data.tracks.items[0].album.name}`)
			fs.appendFile("log.txt", "\n-----------------------------------\n"+useData, function (err) {
				if (!err) {
					console.log("saved")
				}
			})

		}
	});
}
