var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var ghostsInterval;
var bonusInterval;
var flashNewGameButtonInterval;
var lives;

var context = canvas.getContext('2d');

var cell_height = 60;
var cell_width = 60;

// music
var game_music = new Audio('media/game_music.mp3');

// bonus
var bonus = new Object();
bonus.image = new Image(cell_width, cell_height);
bonus.image.src = './media/hamburger.jpg';
bonus.show = true;

// settings
var key_up = 38;
var key_down = 40;
var key_left = 37;
var key_right = 39;

var food_remain;

var food_low_color;
var food_mid_color;
var food_high_color;

// ghots
var monster_count;

var pinky = new Object();
pinky.image = new Image(cell_width-4, cell_height-4);
pinky.image.src = './media/Pinky.jpeg';
pinky.id = 8;

var inky = new Object();
inky.image = new Image(cell_width-4, cell_height-4);
inky.image.src = './media/Inky.jpeg';
inky.id = 9;

var clyde = new Object();
clyde.image = new Image(cell_width-4, cell_height-4);
clyde.image.src = './media/Clyde.jpeg';
clyde.id = 10;

var blinky = new Object();
blinky.image = new Image(cell_width-4, cell_height-4);
blinky.image.src = './media/Blinky.jpeg';
blinky.id = 11;

var game_time;

function Start() {

	let board_objects = configureGameSettings();

	window.clearInterval(flashNewGameButtonInterval);

	lblUserName.value = username;
	//game_music.play();	

	bonus.show = true;
	board = new Array();
	score = 0;
	pac_color = "yellow";
	start_time = new Date();

	lives = 5;

	for (var i = 0; i < 10; i++) {
		
		// 7:food-high, 6:food-mid, 1:food-low, 2:pacman, 0:nothing, 5:bonus, 4:wall
		board[i] = new Array();

		for (var j = 0; j < 10; j++) {
			//ghots	
			if (i == 0 && j == 0 && blinky.show) {
				board[i][j] = blinky.id;
				blinky.i = 0;
				blinky.j = 0;
			}
			else if (i == 0 && j == 9 && clyde.show) {
				board[i][j] = clyde.id;
				clyde.i = 0;
				clyde.j = 9;
			}
			else if (i == 9 && j == 0 && inky.show) {
				board[i][j] = inky.id;
				inky.i = 9;
				inky.j = 0;
			}
			else if (i == 9 && j == 9 && pinky.show) {
				board[i][j] = pinky.id;
				pinky.i = 9;
				pinky.j = 9;
			}
			//walls
			else if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			} 
			else {
				let chosen = Math.floor(Math.random() * board_objects.length);
				board[i][j] = board_objects[chosen];
				if (board_objects[chosen] == 2) {
					shape.i = i;
					shape.j = j;
				}
				board_objects.splice(chosen, 1);
			}
		}
	}
	
	// bonus
	bonus.also = board[7][7]
	board[7][7] = 5;
	bonus.x = 7
	bonus.y = 7

	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	
	//intervals
	interval = setInterval(UpdatePosition, 200);
	ghostsInterval = setInterval(updateGhostPositions, 400);
	bonusInterval = setInterval(updateBonusPosition, 300);
}

function configureGameSettings() {
	food_dispaly = document.getElementById('food-count').value;
	food_remain = document.getElementById('food-count').value;
	document.getElementById("FoodShow").innerHTML = 'FOOD BALLS: ' + food_dispaly;
	
	food_low_color = document.getElementById('food-color-low').value;
	food_mid_color = document.getElementById('food-color-mid').value;
	food_high_color = document.getElementById('food-color-high').value;

	game_time = document.getElementById('game-time-input-id').value;
	
	document.getElementById("TimeShow").innerHTML = 'GAME TIME: ' + game_time + " SECONDS";
	

	monster_count = document.getElementById('monster-count-id').value;
	
	document.getElementById("MonsterShow").innerHTML = 'NUMBER OF GHOSTS: ' + monster_count;

	if (monster_count == 1) {
		pinky.show = false;
		inky.show = false;
		clyde.show = false;
		blinky.show = true;
		blinky.also = 0;
	}
	if (monster_count == 2) {
		pinky.show = false;
		inky.show = false;
		clyde.show = true;
		blinky.show = true;
		clyde.also = 0;
		blinky.also = 0;
	}
	if (monster_count == 3) {
		pinky.show = false;
		inky.show = true;
		clyde.show = true;
		blinky.show = true;
		inky.also = 0;
		clyde.also = 0;
		blinky.also = 0;
	}
	if (monster_count == 4) {
		pinky.show = true;
		inky.show = true;
		clyde.show = true;
		blinky.show = true;
		pinky.also = 0;
		inky.also = 0;
		clyde.also = 0;
		blinky.also = 0;
	}

	// distribute food
	let board_objects = [2]
	for (i=0; i < 0.1*food_remain; i++) {
		board_objects.push(7);
	}
	for (i=0; i < 0.3 *food_remain; i++) {
		board_objects.push(6);
	}
	for (i=0; i < 0.6*food_remain; i++) {
		board_objects.push(1);
	}
	while (board_objects.length < 95 - monster_count) {
		board_objects.push(0);
	}
	return board_objects
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[key_up]) {  // up
		return 1;
	}
	if (keysDown[key_down]) {  // down
		return 2;
	}
	if (keysDown[key_left]) {  // left
		return 3;
	}
	if (keysDown[key_right]) {  // right
		return 4;
	}
}

function Draw(x) {
	canvas.width = canvas.width;  // clean board
	
	lblScore.value = score;
	lblTime.value = time_elapsed;
	
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {

			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;

			context.beginPath();
			context.rect(center.x - 30, center.y - 30, 60, 60);
			context.fillStyle = "black";
			context.fill();

			// border	
			border_color = getRandomColor();
			if (i == 0) {
				if (j != 4) {
					context.beginPath();
					context.rect(center.x - 30, center.y - 30, 1, 60);
					context.fillStyle = border_color;
					context.fill();
				}
			}
			if (j == 0) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 1);
				context.fillStyle = border_color;
				context.fill();
			}
			if (i==9) {
				if (j != 4) {
					context.beginPath();
					context.rect(center.x + 29, center.y -30, 1, 60);
					context.fillStyle = border_color;
					context.fill();
				}
			}
			if (j==9) {
				context.beginPath();
				context.rect(center.x - 30, center.y + 29, 60, 1);
				context.fillStyle = border_color;
				context.fill();
			}
		
			if (board[i][j] == 2 ) {  // pacman
				if(x==4) {
					context.beginPath();
					context.arc(center.x, center.y, 30, 0.25 * Math.PI, 1.75 * Math.PI); // half circle mo
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color;
					context.fill();
					context.beginPath();
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI, false); // circle eyes
					context.fillStyle = "black";
					context.fill();
				}
				else if(x == 1) {
					context.beginPath();
					context.arc(center.x, center.y, 30, 1.8 * Math.PI, 1.2 * Math.PI); // half circle mo
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color;
					context.fill();
					context.beginPath();
					context.arc(center.x -15, center.y+15 , 5, 0, 2 * Math.PI, false); // circle eyes
					context.fillStyle = "black";
					context.fill();
				}
				else if(x == 2) {
					context.beginPath();
					context.arc(center.x, center.y, 30, 0.75 * Math.PI, 0.25 * Math.PI); // half circle mo
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color;
					context.fill();
					context.beginPath();
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI, false); // circle eyes
					context.fillStyle = "black";
					context.fill();
				}
				else if(x == 3) {
					context.beginPath();
					context.arc(center.x, center.y, 30, 1.25 * Math.PI, 0.75 * Math.PI); // half circle mo
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color;
					context.fill();
					context.beginPath();
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI, false); // circle eyes
					context.fillStyle = "black"; //color
					context.fill();
				}
				else {	
					context.beginPath();
					context.arc(center.x, center.y, 30, 0.25 * Math.PI, 1.85 * Math.PI); // half circle mo
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI, false); // circle eyes
					context.fillStyle = "black"; //color
					context.fill();			
				}
			} 
			
			else if (board[i][j] == 1) {  // food-low
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI);
				context.fillStyle = food_low_color;
				context.fill();
			}
			
			else if (board[i][j] == 6) {  // food-mid
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI);
				context.fillStyle = food_mid_color;
				context.fill();
			}
			
			else if (board[i][j] == 7) {  // food-high
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI);
				context.fillStyle = food_high_color;
				context.fill();
			}
			
			 else if (board[i][j] == 4) {  // wall
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey";
				context.fill();
			}

			else if (board[i][j] == 5 && bonus.show) {  // bonus
				context.drawImage(bonus.image, center.x - (cell_width / 2) + 2, center.y - (cell_height / 2) + 2, cell_width - 4, cell_height - 4);
			}

			// ghosts
			else if (board[i][j] == blinky.id && blinky.show) {  // blinky
				context.drawImage(blinky.image, center.x - (cell_width / 2) + 2, center.y - (cell_height / 2) + 2, cell_width - 4, cell_height - 4);
			}
			else if (board[i][j] == clyde.id && clyde.show) {  // clyde
				context.drawImage(clyde.image, center.x - (cell_width / 2) + 2, center.y - (cell_height / 2) + 2, cell_width - 4, cell_height - 4);
			}
			else if (board[i][j] == inky.id && inky.show) {  // inky
				context.drawImage(inky.image, center.x - (cell_width / 2) + 2, center.y - (cell_height / 2) + 2, cell_width - 4, cell_height - 4);
			}
			else if (board[i][j] == pinky.id && pinky.show) {  // pinky
				context.drawImage(pinky.image, center.x - (cell_width / 2) + 2, center.y - (cell_height / 2) + 2, cell_width - 4, cell_height - 4);
			}
		}
	}
}

function UpdatePosition() {
	
	board[shape.i][shape.j] = 0;

	var x = GetKeyPressed();

	if (x == 1) {  //  up
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {  // down
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {  // left
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
		else if (shape.j == 4 && shape.i == 0) {
			shape.i = 9;
		}
	}
	if (x == 4) {  // right
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
		else if (shape.j == 4 && shape.i == 9) {
			shape.i = 0;
		}
	}

	if (board[shape.i][shape.j] == 1) {  // food-low
		score += 5;
	}
	else if (board[shape.i][shape.j] == 6) {  // food-med
		score += 15;
	}
	else if (board[shape.i][shape.j] == 7) {  // food-high
		score += 25;
	}
	else if (board[shape.i][shape.j] == 5 && bonus.show == true) {  // bonus
		consumeBonus();
	}
	else if (board[shape.i][shape.j] >= 8 && board[shape.i][shape.j] <= 11) {
		encounterGhost();
	}
	
	board[shape.i][shape.j] = 2;

	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;

	if (score >= 500 || time_elapsed >= game_time) {
		endGame();
	} 
	else {
		Draw(x);
	}
}

// *** BONUS  LOGIC *** //
function calc_available_bonus_moves() {
	// return array of avaliable moves for the bonus
	// 0-up , 1-down , 2-left , 3-right
	let available_directions = []

	if (bonus.y > 0 && board[bonus.x][bonus.y - 1] != 4) {  // up
		available_directions.push(0)
	}
	if (bonus.y < 9 && board[bonus.x][bonus.y + 1] != 4) {  // down
		available_directions.push(1)
	}
	if (bonus.x > 0 && board[bonus.x - 1][bonus.y] != 4) {  // left
		available_directions.push(2)
	}
	if (bonus.x < 9 && board[bonus.x + 1][bonus.y] != 4) {  // right
		available_directions.push(3)
	}
	return available_directions
}

function move_bonus() {

	if ( Math.abs(bonus.x - shape.i) + Math.abs(bonus.y - shape.j) <= 1) {
		return;
	}

	let available_directions = calc_available_bonus_moves();
	
	if (bonus.also != 2) {
		board[bonus.x][bonus.y] = bonus.also;  // put back what was there before
	}

	let dir = available_directions[Math.floor(Math.random() * available_directions.length)];

	// update bonus coordinates
	if (dir == 0) {  // up
		bonus.y -= 1;
	}
	else if (dir == 1) {  // down
		bonus.y += 1;
	}
	else if (dir == 2) {  // left
		bonus.x -= 1;
	}
	else if (dir == 3) {  // right
		bonus.x += 1;
	}

	if (board[bonus.x][bonus.y] != 2) {
		bonus.also = board[bonus.x][bonus.y];
	}
	board[bonus.x][bonus.y] = 5;

}

function updateLives(num) {
	//num between 0-5
	var i=1;
	while (i <= num) {
		document.getElementById('heart' + i.toString()).style.visibility = 'visible';
		i++;
	}
	while (i <= 5) {
		document.getElementById('heart' + i.toString()).style.visibility = 'hidden';
		i++;
	}
}

function moveGhost(ghost) {

	board[ghost.i][ghost.j] = ghost.also;

	if (shape.i > ghost.i && ghost.i + 1 < board.length ) { 
		if(board[ghost.i+1][ghost.j]!=4 && board[ghost.i + 1][ghost.j]<8) // prevents wall encounter
		{
		ghost.i ++ ;
		}
		else if(shape.j > ghost.j && ghost.j + 1 < board.length) // find another soloution 
		{
			ghost.j += 1;
			
		}
		else
		{
			ghost.j-=1;
		}
	}
	else if (shape.i < ghost.i && ghost.i - 1 >= 0 ) {
		if(board[ghost.i - 1][ghost.j] != 4 && board[ghost.i - 1][ghost.j]<8) 
		{
		ghost.i -= 1;
		}
		else if(shape.j > ghost.j && ghost.j + 1 < board.length)
		{
			ghost.j += 1;
			
		}
		else
		{
			ghost.j-=1;
		}

	}
	else if(shape.j > ghost.j && ghost.j + 1 < board.length) {
		if(board[ghost.i][ghost.j + 1]!=4 && board[ghost.i][ghost.j + 1]<8)
		{
		ghost.j += 1;
		}
		else if(shape.i > ghost.i && ghost.i + 1 < board.length)
		{
			ghost.i += 1;
			
		}
		else
		{
			ghost.i-=1;
		}

	}
	else if(shape.j < ghost.j && ghost.j - 1 >= 0) {

		if( board[ghost.i][ghost.j - 1]!=4 && board[ghost.i][ghost.j - 1]<8)
		{
		ghost.j -= 1;
		}
		else if(shape.i > ghost.i && ghost.i + 1 < board.length)
		{
			ghost.i += 1;
		}
		else
		{
			ghost.i-=1;
		}
	}
	
	if (board[ghost.i][ghost.j] == 2) {
		encounterGhost();
	}

	if ( 
		(board[ghost.i][ghost.j] != 5) && 
		(board[ghost.i][ghost.j] != 8) && 
		(board[ghost.i][ghost.j] != 9) && 
		(board[ghost.i][ghost.j] != 10) && 
		(board[ghost.i][ghost.j] != 11)
	){
		ghost.also = board[ghost.i][ghost.j];
	}
	board[ghost.i][ghost.j] = ghost.id;
}

function updateGhostPositions() {

	if(blinky.show) {
		moveGhost(blinky);
	}
	if(pinky.show) {
		moveGhost(pinky);
	}
	if(clyde.show) {
		moveGhost(clyde);
	}
	if(inky.show) {
		moveGhost(inky);
	}
	Draw();
}

function updateBonusPosition() {
	if (bonus.show) {
		move_bonus();
	}
}

function consumeBonus() {
	bonus.show = false;
	score += 50;
	if (bonus.also == 1) { score += 5; }
	if (bonus.also == 6) { score += 15; }
	if (bonus.also == 7) { score += 25; }
}

function encounterGhost() {
	lives--;
	updateLives(lives);
	if (lives == 0) {
		endGame();
	}
	else {
		resetGhostLocations();
	}
	setPlayerInRandomPosition();
	Draw();
}

function resetGhostLocations() {
	// send ghosts back to the corners
	// blinky
	if (blinky.show) {
		board[blinky.i][blinky.j] = blinky.also;
		blinky.also = 0;
		blinky.i = 0;
		blinky.j = 0;
		board[0][0] = 8;
	}
	// clyde
	if (clyde.show) {
		board[clyde.i][clyde.j] = clyde.also;
		clyde.also = 0;
		clyde.i = 0;
		clyde.j = 9;
		board[0][9] = 9;
	}

	// inky
	if (inky.show) {
		board[inky.i][inky.j] = inky.also;
		inky.also = 0;
		inky.i = 9;
		inky.j = 0;
		board[9][0] = 10;
	}

	// pinky
	if (pinky.show) {
		board[pinky.i][pinky.j] = pinky.also;
		pinky.also = 0;
		pinky.i = 9;
		pinky.j = 9;
		board[9][9] = 11;
	}
}

function endGame() {
	window.clearInterval(interval);
	window.clearInterval(ghostsInterval);
	window.clearInterval(bonusInterval);
	game_music.pause();
	game_music.time_elapsed = 0;
	
	var endMessage;

	if (lives == 0) {
		endMessage = "Your score is " + score.toString() + "\nLoser!";
	}
	else {
		scores.push([username, time_elapsed]);
		if (score < 100) {
			endMessage = "You are better than " + score.toString() + " points!";
		}
		else {
			endMessage = "Your score is " + score.toString() + "\nWinner!!!";
		}
	}

	flashNewGameButtonInterval = setInterval(flashNewGameButton, 500);

	window.alert(endMessage);
}

function flashNewGameButton() {

	var btn = document.getElementById('new-game-btn-id');

	var tmpColorCheck = btn.style.color;

		if (tmpColorCheck === 'yellow') {
			btn.style.color = 'black';
			btn.style.backgroundColor = 'yellow';
		} else {
			btn.style.color = 'yellow';
			btn.style.backgroundColor = 'black';
		}
}

function setPlayerInRandomPosition() {
	
	let new_i = Math.floor(Math.random() * 10);
	let new_j = Math.floor(Math.random() * 10);

	while (board[new_i][new_j] != 0) {
		new_i = Math.floor(Math.random() * 10);
		new_j = Math.floor(Math.random() * 10);
	}

	shape.i = new_i;
	shape.j = new_j;

	board[new_i][new_j] = 2;

}