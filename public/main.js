var pictionary = function() {
    var canvas, context;
	var socket = io();
	var drawing = false;
    var guessBox;
	
    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousemove', function(event) {
    
    	if (drawing === true) {
	        var offset = canvas.offset();
    	    var position = {x: event.pageX - offset.left, y: event.pageY - offset.top};
	    	socket.emit("draw", position);	
    	}
    	
    });
    
    canvas.on('mousedown', function(event) {
    	drawing = true;
    });
    
    canvas.on('mouseup', function(event) {
    	drawing = false;
    });
    
	var onKeyDown = function(event) {
   		if (event.keyCode != 13) { 
   			// Enter
        	return;
    	}

	    socket.emit("guess", guessBox.val());
    	guessBox.val('');
	};

	guessBox = $('#guess input');
	
    socket.on("draw", draw);
    socket.on("guess", function(guessText) {
    	$("#text").append("<p>" + guessText + "</p>");
    });
	guessBox.on('keydown', onKeyDown);
};

$(document).ready(function() {
    pictionary();
});