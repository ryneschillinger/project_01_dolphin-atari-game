$(document).ready(function() {

	// SETTING POSITIONS & GAME CONTROLS

	var dolphinTop = $("#dolphin").position().top;
	var dolphinLeft = $("#dolphin").position().left;
	var obstacleLeft = $("#obstacle").position().left;
	var obstacleTop = $("#obstacle").position().top;
	var moveAmount = 30;

	console.log(obstacleTop);


	// MOVING THE CHARACTER

	document.onkeydown = keyPress;

	function keyPress(e) {
		// Up key
	    if (e.keyCode == 38) {
	        $("#direction").text("Up arrow");
	        dolphinTop -= moveAmount; 
	        $("#dolphin").css("top", dolphinTop + "px");
	    }

	    // Down key
	    else if (e.keyCode == 40) {
	    	$("#direction").text("Down arrow");
	    	dolphinTop += moveAmount; 
	    	$("#dolphin").css("top", dolphinTop + "px");
	    }

	    // Left key
	    else if (e.keyCode == 37) {
	        $("#direction").text("Left arrow");
	        dolphinLeft -= moveAmount; 
	        $("#dolphin").css("left", dolphinLeft + "px");
	    }

	    // Right key
	    else if (e.keyCode == 39) {
	    	$("#direction").text("Right arrow");
	    	dolphinLeft += moveAmount; 
	    	$("#dolphin").css("left", dolphinLeft + "px");
	    }
	}


	// MAKING OBSTACLES MOVE LEFT

	var movingObstacles = window.setInterval(function(){
		obstacleLeft -= 5; 
		$("#obstacle").css("left", obstacleLeft + "px");
	}, 5);


	// DETECTING A COLLISION

	function gameOver() {
		clearInterval(movingObstacles);
	}

	var checkForCollision = window.setInterval(function(){
		if (dolphinLeft + 254 >= obstacleLeft && (dolphinTop >= obstacleTop - 90 && dolphinTop <= obstacleTop + 90)) {
			gameOver();
		} 
	}, 1);


	// REMOVE OBSTACLE ONCE IT'S LEFT THE SCREEN
	// GENERATE NEW OBSTACLE

	var clearObstacle = window.setInterval(function() { 
		if (obstacleLeft < 0) {
			$("#obstacle").remove();
			obstacleLeft = 1500;
			newObstacleHeight = Math.floor(Math.random()*90);
			$("body").append("<div id='obstacle'></div>");
			$("#obstacle").css("top", newObstacleHeight + "vh");
			obstacleTop = $("#obstacle").position().top;
			console.log(newObstacleHeight);
		}
	});

});


// NOTES AND BUGS:
// * Once seahorses move past the dolphin, stop looking for collision.
// * Remember to change +100s in the collision detection to match sizes of dolphin and seahorses and squid

