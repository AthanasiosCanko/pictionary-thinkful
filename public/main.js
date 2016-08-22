$(document).ready(function() {
	var socket = io();
	var canvas, context;
	
  	canvas = $('canvas');
	context = canvas[0].getContext('2d');
	canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;

	socket.on("key", function(key) {
		if (key === true) {
		    $("#guess").remove();
		    
			var drawing = false;
    
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
    			
			
		}
		else {
			
			var guessBox = $('#guess input');
	
		    socket.on("guess", function(guessText) {
   	 			$("#text").append("<p>" + guessText + "</p>");
    		});
    		
    		var onKeyDown = function(event) {
   				if (event.keyCode != 13) {
        			return;
    			}

			    socket.emit("guess", guessBox.val());
    			guessBox.val('');
			};
    		
			guessBox.on('keydown', onKeyDown);
		}
	});
	
	socket.on("draw", function(position) {
				console.log("Hello!");
		        context.beginPath();
        		context.arc(position.x, position.y,
                        6, 0, 2 * Math.PI);
    		    context.fill();
    		});  
});