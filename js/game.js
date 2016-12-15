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
	var player2Score = 0;
	var player1Turn = true;
	var moveIncrement = 45;
	var hasSeahorseCollided = false;


	// CLICK "START GAME" FROM TITLE SCREEN

	$("#start").click(function() {
	    $("#main-title").hide();
	    initiateGameplay();
	});
	

	function initiateGameplay() {


		// START PLAYER'S TURN WITH PROMPT

		function showPlayerPrompt() {
			$("#prompts").show();
		}

		function playerPromptTimer() {
			setTimeout(function() {
				$("#prompts").hide();
				startGameplay();
			}, playerPromptDuration);
		};

		playerPromptTimer();


		// BEGIN GAMPLEPLAY ONLY AFTER PLAYER START PROMPT HAS DISAPPEARED
		function startGameplay() { setTimeout(function() {
			console.log(player1Turn);

			// START PLAYER CHARACTER ANIMATION
			if (player1Turn == true) {
				$("#player").attr("src", "img/dolphin_player_1_anim.gif");
			}
			else {
				$("#player").attr("src", "img/dolphin_player_2_anim.gif");
			}


			// MOVING THE PLAYER CHARACTER

			document.onkeydown = keyPress;

			function keyPress(e) {

				// Up key
			    if (e.keyCode == 38 && dolphinTop > gameBoundaryTop + 30) {
			        $("#direction").text("Up arrow");
			        dolphinTop -= moveIncrement; 
			        $("#player").css("top", dolphinTop + "px");
			    }

			    // Down key
			    else if (e.keyCode == 40 && dolphinTop < gameBoundaryBottom - 15) {
			    	$("#direction").text("Down arrow");
			    	dolphinTop += moveIncrement; 
			    	$("#player").css("top", dolphinTop + "px");
			    }
			}


			// PLAYER SCORING

			var increaseScore = window.setInterval(function(){
				if (player1Turn == true) {
					$("#player-1-score").text(player1Score);
					player1Score += 15;
				}
				else {
					$("#player-2-score").text(player2Score);
					player2Score += 15;
				}
			}, 300);


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


			// MAKING SEAHORSES MOVE LEFT

			var movingSeahorses = window.setInterval(function(){
				seahorsesLeft -= 3; 
				$("#seahorse-wall").css("left", seahorsesLeft + "px");
			}, 5);


			// REMOVE SEAHORSES ONCE THEY'VE LEFT THE SCREEN
			// GENERATE NEW SEAHORSES

			// 1. Generate random order for new seahorses

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

			// 2. Change seahorse wall based on randomly-generated order

			var newSeahorses = "";

			function makeNewSeahorses(array) {
				newSeahorses = "<div id='seahorse-wall'>";
				for (var i = 0; i < 7; i++) {
					if (array[i] == false) {
						newSeahorses += "<div class='seahorse'><img src='img/seahorse.svg' alt='seahorse'></div>";
					}
					else {
						newSeahorses += "<div id='empty'></div>";
					}
				}
				newSeahorses += "</div>";
			}

			// 3. Remove old seahorses and insert new ones		

			var clearSeahorses = window.setInterval(function() { 
				if (seahorsesLeft <= 0) {
					$("#seahorse-wall").remove();
					seahorsesOrder = [];
					randomSeahorsesOrder();
					makeNewSeahorses(seahorsesOrder);
					seahorsesLeft = 1600;
					$(newSeahorses).insertAfter("#squid");
					emptyTop = $("#empty").position().top + $("#seahorse-wall").position().top;
					hasSeahorseCollided = false;
				}
			});


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


			// END OF TURN, GAME OVER 

			function pauseMovements() {
				clearInterval(movingSeahorses);
				clearInterval(movingSquid);
				clearInterval(increaseScore);
				clearInterval(squidCollision);
			}

			function gameOver() {
				pauseMovements();
				$("#player").attr("src", "img/dolphin_game_over_animation.gif");
				setTimeout(function() {
					if (player1Turn == true) {
						$("#player-start").text("Player 2: START");
						player1Turn = false;
						playerPromptTimer();
						resetGameplay();
					}
					else {
						compareScores();
						pauseMovements();
						$("#restart").css("visibility", "visible");
					}
					showPlayerPrompt();
				}, playerPromptDuration);
			}


			// RESET FOR PLAYER 2

			function resetGameplay() {
				$("#player").css("top", "335px");
				$("#player").css("left", "600px");
				dolphinTop = $("#player").position().top;
				dolphinLeft = $("#player").position().left;
				$("#player").attr("src", "img/dolphin_player_2.png");
				seahorsesLeft = 0;
			}


			// COMPARING SCORES & DISPLAYING WINNER

			function compareScores() {
				if (player1Score > player2Score) {
					$("#player-start").text("Player 1 wins!");
				}
				else if (player1Score === player2Score) {
					$("#player-start").text("Holy crap, you guys tied!");

				} else {
					$("#player-start").text("Player 2 wins!");
				}
			}

		})};

	}

});