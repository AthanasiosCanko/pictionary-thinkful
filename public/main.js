$(document).ready(function() {
	var socket = io();
	var canvas, context;
	
	// Setting up canvas specs
  	canvas = $('canvas');
	context = canvas[0].getContext('2d');
	canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;

	// We detect is a user is a drawer or guesser
	socket.on("key", function(key) {
		if (key === true) {
			var drawing = false;
			
			socket.emit("randomWord");
		    $("#guess").remove();
		    
		    /* <<< BETA >>>
		    
		    $(".btn-warning").on("click", function() {
		    	console.log(this.id);
		    });
		    */
    
    		// Mouse movement detection
		    canvas.on('mousemove', function(event) {
    
    			if (drawing === true) {
	   		     	var offset = canvas.offset();
    	    		var position = {x: event.pageX - offset.left, y: event.pageY - offset.top};
	    			socket.emit("draw", position);	
    			}
    			
    		});
    		
    		// Function that activates mousedown actions
    		function mouseDown(bool) {
    			canvas.on('mousedown', function(event) {
    				drawing = bool;
    			});
    		}
		
			// Getting a random word from the server and displaying it to the drawer
    		socket.on("randomWord", function(word) {
    			$("#word").html("Word to draw: " + word);
    		});	
    		
    		// Keeping track of online users for the drawer
    		socket.on("counter", function(counter) {
    			if (counter === 1) {
    				$("#drawOrNot").html("<p style='color: crimson'>You cannot draw. No guesser online yet.</p>");
    				// Deactivates mouse action
    				mouseDown(false);
    			}
    			else {
    				$("#drawOrNot").html("<p style='color: green'>Guesser popped up. Now you can draw!</p>");
    				// Activates mouse action
    				mouseDown(true);
    
		    		canvas.on('mouseup', function(event) {
    					drawing = false;
    				});  
    			}
    		});
		}
		else {
			// Guesser code
			var guessBox = $('#guess input');
    	
    		var onKeyDown = function(event) {
   				if (event.keyCode != 13) {
        			return;
    			}
				
				// When we hit Enter, we send the guess to the server
			    socket.emit("guess", guessBox.val());
    			guessBox.val('');
			};
    		
			guessBox.on('keydown', onKeyDown);
		}
	});
	
	// When we receive a drawing from the server, we display it to our page
	socket.on("draw", function(position) {
		        context.beginPath();
        		context.arc(position.x, position.y,
                        6, 0, 2 * Math.PI);
    		    context.fill();
    		});  
    	
    // When we receive a guess, we add it as a button for the drawer to click if correct
    socket.on("guess", function(guessText) {
   	 	$("#text").append("<button id='" + guessText + "' class='btn btn-warning' style='width: 150px'>" + guessText + "</button><br>");
    });
});