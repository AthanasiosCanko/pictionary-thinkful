var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var canvasKey = true;

io.on("connection", function(socket) {
	console.log("New canvas...");
	console.log(canvasKey);
	
	io.emit("key", canvasKey);
	canvasKey = false;
	
	
	socket.on("draw", function(position) {
		io.emit("draw", position);
	});
	
	socket.on("guess", function(guessText) {
		io.emit("guess", guessText);
	});
});

server.listen(process.env.PORT || 8080);