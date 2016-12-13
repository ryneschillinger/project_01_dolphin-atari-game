$(document).ready(function() {

	// SETTING POSITIONS & GAME CONTROLS

	var gameBoundaryTop = $("#game-boundary").position().top;
	var gameBoundaryBottom = $(window).height() - 250;
	var dolphinTop = $("#dolphin").position().top;
	var dolphinLeft = $("#dolphin").position().left;
	// var obstacleLeft = $("#obstacle").position().left;
	// var obstacleTop = $("#obstacle").position().top;
	var squidTop = $("#squid").position().top;
	var seahorsesLeft = $("#seahorse-wall").position().left;
	var emptyTop = $("#empty").position().top + $("#seahorse-wall").position().top;
	var moveAmount = 30;


	// MOVING THE CHARACTER

	document.onkeydown = keyPress;

	function keyPress(e) {
		// Up key
	    if (e.keyCode == 38 && dolphinTop > gameBoundaryTop + 10) {
	        $("#direction").text("Up arrow");
	        dolphinTop -= moveAmount; 
	        $("#dolphin").css("top", dolphinTop + "px");
	    }

	    // Down key
	    else if (e.keyCode == 40 && dolphinTop < gameBoundaryBottom) {
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


	// MAKING SEAHORSES MOVE LEFT

	// var movingObstacles = window.setInterval(function(){
	// 	obstacleLeft -= 5; 
	// 	$("#obstacle").css("left", obstacleLeft + "px");
	// }, 5);

	var movingSeahorses = window.setInterval(function(){
		seahorsesLeft -= 5; 
		$("#seahorse-wall").css("left", seahorsesLeft + "px");
	}, 5);


	// MAKING SQUID MOVE UP AND DOWN

	squidMovingDown = true;

	var movingSquid = window.setInterval(function(){
		if (squidMovingDown == true) {
			squidTop += 1; 
			if (squidTop == gameBoundaryBottom + 10) {
				squidMovingDown = false;
			}
		}
		else {
			squidTop -= 1; 
			if (squidTop == gameBoundaryTop + 10) {
				squidMovingDown = true;
			}
		}
		$("#squid").css("top", squidTop + "px");
	}, 1);


	// DETECTING A COLLISION

	function gameOver() {
		clearInterval(movingSeahorses);
	}

	// var checkForCollision = window.setInterval(function(){
	// 	if (dolphinLeft + 254 >= obstacleLeft && (dolphinTop >= obstacleTop - 90 && dolphinTop <= obstacleTop + 90)) {
	// 		gameOver();
	// 	} 
	// }, 1);

	var checkForCollision = window.setInterval(function(){
		if (dolphinLeft + 254 >= seahorsesLeft && (dolphinTop <= emptyTop || dolphinTop >= emptyTop + 86)) {
			gameOver();
		} 
	}, 1);

	console.log(dolphinTop);
	console.log(emptyTop);


	// REMOVE OBSTACLES ONCE THEY'VE LEFT THE SCREEN
	// GENERATE NEW OBSTACLES

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

