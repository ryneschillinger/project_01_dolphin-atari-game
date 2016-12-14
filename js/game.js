$(document).ready(function() {

	// SETTING POSITIONS & GAME CONTROLS

	var playerPromptDuration = 2000;
	var gameBoundaryTop = $("#game-boundary").position().top;
	var gameBoundaryBottom = $(window).height() - 250;
	var dolphinTop = $("#player").position().top;
	var dolphinLeft = $("#player").position().left;
	var squidTop = $("#squid").position().top;
	var squidRight = $("#squid").position().left + 230;
	var seahorsesLeft = $("#seahorse-wall").position().left;
	var emptyTop = $("#empty").position().top + $("#seahorse-wall").position().top;
	var player1Score = 0;
	var moveAmount = 45;
	var hasSeahorseCollided = false;


	// START PLAYER'S TURN WITH PROMPT

	function playerPromptTimer() {
		setTimeout(function() {
			$("#prompts").hide();
		}, playerPromptDuration);
	};

	window.onload = playerPromptTimer();


	// BEGIN GAMPLEPLAY ONLY AFTER PLAYER START PROMPT HAS DISAPPEARED
	setTimeout(function() {


		function gameOver() {
			clearInterval(movingSeahorses);
			clearInterval(movingSquid);
			clearInterval(increaseScore);
		}


		// MOVING THE PLAYER CHARACTER

		document.onkeydown = keyPress;

		function keyPress(e) {

			// Up key
		    if (e.keyCode == 38 && dolphinTop > gameBoundaryTop + 30) {
		        $("#direction").text("Up arrow");
		        dolphinTop -= moveAmount; 
		        $("#player").css("top", dolphinTop + "px");
		    }

		    // Down key
		    else if (e.keyCode == 40 && dolphinTop < gameBoundaryBottom - 15) {
		    	$("#direction").text("Down arrow");
		    	dolphinTop += moveAmount; 
		    	$("#player").css("top", dolphinTop + "px");
		    }
		}


		// MAKING SEAHORSES MOVE LEFT

		var movingSeahorses = window.setInterval(function(){
			seahorsesLeft -= 3; 
			$("#seahorse-wall").css("left", seahorsesLeft + "px");
		}, 5);


		// MAKING SQUID MOVE UP AND DOWN

		var squidMovingDown = true;

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


		// SCORING

		var increaseScore = window.setInterval(function(){
			$("#player-1-score").text(player1Score);
			player1Score += 15;
		}, 300);


		// DETECTING COLLISIONS

		var seahorsesCollision = window.setInterval(function(){
			if ((dolphinLeft + 254 >= seahorsesLeft && dolphinLeft <= seahorsesLeft + 54) && (dolphinTop <= emptyTop - 10 || dolphinTop >= emptyTop + 70) && hasSeahorseCollided == false) {
				dolphinLeft -= 130; 
				$("#player").css("left", dolphinLeft + "px");
				hasSeahorseCollided = true;
			} 
		}, 1);

		var squidCollision = window.setInterval(function(){
			if (dolphinLeft <= squidRight && (dolphinTop >= squidTop - 68 && dolphinTop <= squidTop + 68)) {
				gameOver();
			} 
		}, 1);


		// REMOVE SEAHORSES ONCE THEY'VE LEFT THE SCREEN
		// GENERATE NEW SEAHORSES

		var seahorses = "<div id='seahorse-wall'>" +
				"<div class='seahorse'><img src='img/seahorse.svg' alt='seahorse'></div>" +
				"<div class='seahorse'><img src='img/seahorse.svg' alt='seahorse'></div>" +
				"<div id='empty'></div>" +
				"<div class='seahorse'><img src='img/seahorse.svg' alt='seahorse'></div>" +
				"<div class='seahorse'><img src='img/seahorse.svg' alt='seahorse'></div>" +
				"<div class='seahorse'><img src='img/seahorse.svg' alt='seahorse'></div>" +
				"<div class='seahorse'><img src='img/seahorse.svg' alt='seahorse'></div>" +
				"</div>";


		// Remove old seahorses and insert new ones		

		var clearSeahorses = window.setInterval(function() { 
			if (seahorsesLeft < 0) {
				$("#seahorse-wall").remove();
				seahorsesOrder = [];
				randomSeahorsesOrder();
				makeNewSeahorses(seahorsesOrder);
				seahorsesLeft = 1600;
				$(seahorses).insertAfter("#squid");
				emptyTop = $("#empty").position().top + $("#seahorse-wall").position().top;
				console.log(emptyTop);
				hasSeahorseCollided = false;
			}
		});


		// Generate random order for new seahorses

		var seahorsesOrder = [];

		function randomSeahorsesOrder() {
			var randomNumber = 0;
			var numberOfTrues = 0;
			for (var i = 1; i < 8; i++) {
				randomNumber = Math.random();
				// All six values so far have been false, so final must be true
				if (i == 7 && numberOfTrues == 0) {
					seahorsesOrder.push(true);
				}	
				// A true has already been assigned, so rest must be false
				else if (numberOfTrues == 1) {
					seahorsesOrder.push(false);
				}
				// No trues have been assigned yet, and randomly-generated boolean is a true
				else if (randomNumber > 0.83) {
					seahorsesOrder.push(true);
					numberOfTrues++;
				}
				// Random boolean is a false
				else {
					seahorsesOrder.push(false);
				}
			}
		}

		// Change seahorse wall based on randomly-generated order

		function makeNewSeahorses(array) {
			seahorses = "<div id='seahorse-wall'>";
			for (var i = 0; i < 7; i++) {
				if (array[i] == false) {
					seahorses += "<div class='seahorse'><img src='img/seahorse.svg' alt='seahorse'></div>";
				}
				else {
					seahorses += "<div id='empty'></div>";
				}
			}
			seahorses += "</div>";
		}

	// Player prompt delay
	}, playerPromptDuration);

});