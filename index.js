var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

// Wrapping our Express app in a bidirectional connection
var server = http.Server(app);
var io = socket_io(server);

// Boolean value that regulates drawer/guesser relationship
var canvasKey = true;

// Keeps count of online users
var counter = 0;

// Random word array
var WORDS = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];

// Whenever we detect a connection
io.on("connection", function(socket) {
	console.log("New canvas...");
	console.log(canvasKey);
	
	// Random number to choose from the array
	var number =  parseInt(Math.random() * (WORDS.length - 1));
	console.log(number);
	
	counter += 1;
	
	// Emitting random array element
	socket.on("randomWord", function() {	
		socket.emit("randomWord", WORDS[number]);
	});
	
	// Emiting canvas key
	io.emit("key", canvasKey);
	// Emitting counter value
	io.emit("counter", counter);
	canvasKey = false;
	
	// Emitting drawing to all users
	socket.on("draw", function(position) {
		io.emit("draw", position);
	});
	
	// Emitting guess text to all users
	socket.on("guess", function(guessText) {
		io.emit("guess", guessText);
	});
	
	// Whenever a user disconnects, the following happens
	socket.on("disconnect", function() {

		counter -= 1;
			
		io.emit("counter", counter);
		if (counter === 0) {
			canvasKey = true;
		}
	});
});

server.listen(process.env.PORT || 8080);