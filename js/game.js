$(document).ready(function() {

	// SETTING POSITIONS & GAME CONTROLS

	var windowHeight = window.innerHeight;
	var windowWidth = window.innerWidth;
	var playerPromptDuration = 2000;
	var gameBoundaryTop = Math.round(windowHeight*.184);
	var gameBoundaryBottom = Math.round(windowHeight*.716);
	var dolphinTop = Math.round(windowHeight*.38);
	var dolphinLeft = Math.round(windowWidth*.357);
	var squidTop = Math.round(windowHeight*.397);
	var squidRight = Math.round(windowWidth*.1665);
	var seahorsesLeft = Math.round(windowWidth*.952);
	var fishTop = "";
	var fishLeft = "";
	var fishRight = "";
	var randomFishTop = Math.random * (gameBoundaryBottom-gameBoundaryTop);
	var newFishies = "<img src='img/fish.png' alt='fish' id='fish'>";
	var emptyTop = $("#empty").position().top + $("#seahorse-wall").position().top;
	var player1Score = 0;
	var player2Score = 0;
	var player1Turn = true;
	var moveIncrement = windowHeight*.05;
	var hasSeahorseCollided = false;
	var squidMovingDown = true;
	var gamePaused = false;


	// CLICK "START GAME" FROM TITLE SCREEN

	$("#start").click(function() {
	    $("#main-title").hide();
	    $("#game").css("visibility", "visible");
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


		// RESUMING GAME AFTER PAUSE

		function resumeGame() {
			gamePaused = false;
			$("#resume").css("visibility", "hidden");
			$("#prompts").hide();
			startGameplay();
		}

		$("#resume").click(function() {
			resumeGame();
		});


		// BEGIN GAMPLEPLAY ONLY AFTER PLAYER START PROMPT HAS DISAPPEARED
		function startGameplay() { 

			gamePaused = false;


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
				if (gamePaused == false) {
					// Up key
				    if (e.keyCode == 38 && dolphinTop > gameBoundaryTop) {
				        dolphinTop -= moveIncrement; 
				        $("#player").css("top", dolphinTop + "px");
				    }
				    // Down key
				    else if (e.keyCode == 40 && dolphinTop < gameBoundaryBottom) {
				    	dolphinTop += moveIncrement; 
				    	$("#player").css("top", dolphinTop + "px");
				    }
				    // Enter key: pause
				    else if (e.keyCode == 13) {
				    	pauseGame();
				    }
				}
				else if (gamePaused == true) {
					if (e.keyCode == 13) {
				    	resumeGame();
				    }
					return;
				}
			}


			// PAUSING THE GAME

			function stopMovements() {
				clearInterval(movingSeahorses);
				clearInterval(movingSquid);
				clearInterval(increaseScore);
				clearInterval(squidCollision);
				clearInterval(movingFish);
				clearInterval(fishCollision);
			}

			function pauseGame() {
				gamePaused = true;
				stopMovements();
				showPlayerPrompt();
				$("#player-start").text("PAUSED");
				$("#resume").css("visibility", "visible");
				if (player1Turn == true) {
					$("#player").attr("src", "img/dolphin_player_1.png");
				}
				else {
					$("#player").attr("src", "img/dolphin_player_2.png");
				}
			}

			$("#pause").click(function() {
				pauseGame();
			});


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

			var movingSquid = setInterval(function(){
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

			var movingSeahorses = setInterval(function() {
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
					seahorsesLeft = Math.round(windowWidth*.952);
					$(newSeahorses).insertAfter("#squid");
					emptyTop = $("#empty").position().top + $("#seahorse-wall").position().top;
					hasSeahorseCollided = false;
				}
			});


			// OCCASIONALLY ADD FISH BOOSTS

			// 1. Adding a fish boost

			function newFishBoost() {
				randomFishTop = Math.floor((Math.random() * (gameBoundaryBottom - gameBoundaryBottom*.2) + gameBoundaryTop));
				console.log(randomFishTop);
				$(newFishies).insertAfter("#player");
				$("#fish").css("top", randomFishTop + "px").css("left", 1);
				fishTop = $("#fish").position().top;
				fishLeft = $("#fish").position().left;
				fishRight = $("#fish").position().left + Math.round(windowWidth*.052);
			}

			var movingFish = setInterval(function(){
				fishLeft += 4; 
				$("#fish").css("left", fishLeft + "px");
			}, 5);

			var addingFish = setInterval(function() {
				newFishBoost();
			}, 7000);

			// 2. Removing fish boost once it's left screen

			var clearFishies = window.setInterval(function() { 
				if (fishLeft >= windowWidth - (windowWidth*.052)) {
					$("#fish").remove();
				}
			});


			// DETECTING COLLISIONS

			var seahorsesCollision = window.setInterval(function() {
				if ((dolphinLeft + windowWidth*.15 >= seahorsesLeft && dolphinLeft <= seahorsesLeft + windowWidth*.03) && (dolphinTop <= emptyTop - windowHeight*.012 || dolphinTop >= emptyTop + windowHeight*.079) && hasSeahorseCollided == false) {
					dolphinLeft -= windowWidth*.077; 
					$("#player").css("left", dolphinLeft + "px");
					hasSeahorseCollided = true;
				} 
			}, 1);

			var squidCollision = window.setInterval(function() {
				if (dolphinLeft <= squidRight && (dolphinTop >= squidTop - windowHeight*.077 && dolphinTop <= squidTop + windowHeight*.077)) {
					gameOver();
					gamePaused = true;
				} 
			}, 1);

			var fishCollision = window.setInterval(function() {
				if (dolphinLeft <= (fishLeft + windowWidth*.052) && (dolphinTop >= fishTop - windowHeight*.072 && dolphinTop <= fishTop + windowHeight*.072)) {
					$("#fish").remove();
					fishLeft = NaN;
					dolphinLeft += windowWidth*.04; 
					$("#player").css("left", dolphinLeft + "px");
				} 
			}, 1);


			// END OF TURN, GAME OVER 

			function gameOver() {
				stopMovements();
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
						stopMovements();
						setTimeout(function() {
							window.location.reload();
						}, 3500);
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
				$("#fish").remove();
				seahorsesLeft = 0;
				fishLeft = 0;
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
			
		}

	}

});