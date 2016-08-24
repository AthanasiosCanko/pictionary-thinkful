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
var arr = [];

// Keeps count of online users
var counter = 0;
var isDrawerOnline = false;

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
		isDrawerOnline = false;
		
		arr = [];
		
		io.emit("check");
		
		counter -= 1;
			
		io.emit("counter", counter);
		if (counter === 0) {
			canvasKey = true;
		}
	});
	
	/* <<< BETA >>> */
	socket.on("drawerOnline", function(key) {
		arr.push(key);
		
		if (arr.length === counter) {
			console.log(arr);
			
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === true) {
					isDrawerOnline = true;
				}
			};
					
			if (isDrawerOnline === false) {
				io.emit("drawerWentOff");
			};
		}
		
		/*
		arr.push(val);
		
		for (var i = 0; i < arr.length; i++) {
			console.log(val);
		};
	// console.log(val); */
	});
});


server.listen(process.env.PORT || 8080);