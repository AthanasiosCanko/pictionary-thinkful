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
var user;

// Keeps count of online users
var counter = 0;
var absoluteCounter = 0;
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
	absoluteCounter += 1;
	
	socket.emit("username", absoluteCounter);
	
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
	
	socket.on("guesserToDrawer", function() {
		socket.emit("key", true);
	});
	
	// Emitting guess text to all users
	socket.on("guess", function(guessText, username) {
		io.emit("guess", guessText, username);
	});
	
	socket.on("correctGuess", function(username) {
		socket.emit("correct", username);
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
	
	socket.on("usernameBack", function(username) {
		user = username;
		console.log("Username: ", user);
	});
	
	socket.on("switch", function(user) {
		io.emit("wereYouRight", user);
	});
	
	// Checking if the drawer is online or not, after every received disconnection
	socket.on("drawerOnline", function(key) {
		arr.push(key);
		
		// When the array length matches the counter, execute the following code
		if (arr.length === counter) {
			console.log(arr);
			
			// We detect if the drawer is still online or not
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === true) {
					isDrawerOnline = true;
				}
			};
					
			// If he isn't, we emit the following event
			if (isDrawerOnline === false) {
				io.emit("drawerWentOff");
			};
		}
	});
});


server.listen(process.env.PORT || 8080);