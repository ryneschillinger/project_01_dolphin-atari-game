$(document).ready(function() {

	// SETTING POSITIONS & GAME CONTROLS

	var gameBoundaryTop = $("#game-boundary").position().top;
	var gameBoundaryBottom = $(window).height() - 250;
	var dolphinTop = $("#dolphin").position().top;
	var dolphinLeft = $("#dolphin").position().left;
	var squidTop = $("#squid").position().top;
	var squidRight = $("#squid").position().left + 230;
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

	    // // Left key
	    // else if (e.keyCode == 37) {
	    //     $("#direction").text("Left arrow");
	    //     dolphinLeft -= moveAmount; 
	    //     $("#dolphin").css("left", dolphinLeft + "px");
	    // }

	    // // Right key
	    // else if (e.keyCode == 39) {
	    // 	$("#direction").text("Right arrow");
	    // 	dolphinLeft += moveAmount; 
	    // 	$("#dolphin").css("left", dolphinLeft + "px");
	    // }
	}


	// MAKING SEAHORSES MOVE LEFT

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


	// DETECTING COLLISIONS

	function gameOver() {
		clearInterval(movingSeahorses);
		clearInterval(movingSquid);
	}

	var newSeahorseCollision = true;

	var seahorsesCollision = window.setInterval(function(){
		if ((dolphinLeft + 254 >= seahorsesLeft && dolphinLeft <= seahorsesLeft + 54) && (dolphinTop <= emptyTop || dolphinTop >= emptyTop + 86) && newSeahorseCollision == true) {
			newSeahorseCollision = false;
			dolphinLeft -= 130; 
			$("#dolphin").css("left", dolphinLeft + "px");
		} 
	}, 1);

	var squidCollision = window.setInterval(function(){
		if (dolphinLeft <= squidRight && (dolphinTop >= squidTop - 68 && dolphinTop <= squidTop + 68)) {
			gameOver();
		} 
	}, 1);


	// REMOVE SEAHORSES ONCE THEY'VE LEFT THE SCREEN
	// GENERATE NEW OBSTACLES

	var newSeahorses = "<div id='seahorse-wall'>" +
			"<div class='seahorse'><img src='img/seahorse.svg' alt='seahorse'></div>" +
			"<div class='seahorse'><img src='img/seahorse.svg' alt='seahorse'></div>" +
			"<div id='empty'></div>" +
			"<div class='seahorse'><img src='img/seahorse.svg' alt='seahorse'></div>" +
			"<div class='seahorse'><img src='img/seahorse.svg' alt='seahorse'></div>" +
			"<div class='seahorse'><img src='img/seahorse.svg' alt='seahorse'></div>" +
			"</div>";

	var clearSeahorses = window.setInterval(function() { 
		if (seahorsesLeft < 0) {
			$("#seahorse-wall").remove();
			seahorsesLeft = 1600;
			$("body").append(newSeahorses);
			newSeahorseCollision = true;
		}
	});


});


// NOTES AND BUGS:
