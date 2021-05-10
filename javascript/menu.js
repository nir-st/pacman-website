var scores = []
var keys=[]

var current_active_menu_item = "welcome"

function hide_active_menu_item() {
    if (current_active_menu_item == 'game') {
        $('#side-game-settings').hide();
        game_music.pause()
        game_music.currentTime = 0;
        window.clearInterval(interval);
        window.clearInterval(ghostsInterval);
        window.clearInterval(bonusInterval);
    }
    $('#' + current_active_menu_item + '-div').hide();
}

function set_active_menu_item(item_name) {
    hide_active_menu_item();
    current_active_menu_item = item_name;
    if (item_name == 'scores') {
        updateScores();
    }
    else if (item_name == 'game') {
        $('#side-game-settings').show();
        $('#side-game-settings').css({"position":"relative","display":"inline-block"});
        $('#game-div').css("display","inline-block");
    }
    $('#' + current_active_menu_item + '-div').show();
}

// about modal
var about_modal = document.getElementById("about-modal-id");
var span = document.getElementById("about-close-btn");

function open_about_modal() {
    about_modal.style.display = "block";
}

span.onclick = function() {
    about_modal.style.display = "none";
}
  

window.onclick = function(event) {
  if (event.target == about_modal) {
    about_modal.style.display = "none";
  }
}

$(document).keydown(function(event) { 
    if (event.keyCode == 27) { 
        about_modal.style.display = "none";
    }
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

function randomizeSettings() {

    document.getElementById('upKey').value = 'Arrow Up';
    document.getElementById('downKey').value = 'Arrow Down';
    document.getElementById('leftKey').value = 'Arrow Left';
    document.getElementById('rightKey').value = 'Arrow Right';

    document.getElementById('upKeyShow').innerHTML = ' &#x2191; : UP ARROW';
    document.getElementById('downKeyShow').innerHTML = '&#x2193; : DOWN ARROW';
    document.getElementById('leftKeyShow').innerHTML = '&#x2190; : LEFT ARROW';
    document.getElementById('rightKeyShow').innerHTML =  '&#x2192; : RIGHT ARROW';

    let randomFoodCount = Math.floor(Math.random() * (90 - 50) ) + 50;
    document.getElementById('food-count').value = randomFoodCount;
    updateSliderValue()

    document.getElementById('FoodShow').innerHTML = 'FOOD BALLS: ' + randomFoodCount;
    
    document.getElementById('food-color-low').value = getRandomColor();
    document.getElementById('food-color-mid').value = getRandomColor();
    document.getElementById('food-color-high').value = getRandomColor();

    let randomGameTime = Math.floor(Math.random() * (180 - 60) ) + 60;
    document.getElementById('game-time-input-id').value = randomGameTime
    
    document.getElementById("TimeShow").innerHTML = "GAME TIME: " + randomGameTime + " SECONDS";

    let randomMonsterCount = selectRandomMonsterCount()  // select a random monster count
    document.getElementById("MonsterShow").innerHTML = 'NUMBER OF GHOSTS: ' + randomMonsterCount;

}

function selectRandomMonsterCount() {
    // selecting a random option form the monster count options in settings
    var select = document.getElementById('monster-count-id');
    var items = select.getElementsByTagName('option');
    var index = Math.floor(Math.random() * items.length);

    select.selectedIndex = index;

    return index + 1;
}

function getKeyName(keyCode)
{
    if(keyCode == 37) {
		return "Arrow Left";
	}
	else if(keyCode == 38){
		return "Arrow Up";
	}
	else if(keyCode == 39) {
		return "Arrow Right";
	}
    else if(keyCode == 40) {
		return "Arrow Down";
	}
	else {
		return String.fromCharCode(keyCode);
	}
}

function resetKeyButtonsColors() {

    document.getElementById('upKey').style.backgroundColor = 'white';
    document.getElementById('downKey').style.backgroundColor = 'white';
    document.getElementById('rightKey').style.backgroundColor = 'white';
    document.getElementById('leftKey').style.backgroundColor = 'white';
}

function highlightKeyButton(direction) {

    resetKeyButtonsColors()
    document.getElementById(direction + 'Key').style.backgroundColor = 'yellow';
}

function setKey(event, direction) {
	
    resetKeyButtonsColors();
    document.getElementById(direction + 'Key').style.backgroundColor = 'yellow';
    let keyName;
	let keyCode;
    keyCode = event.keyCode;
    keyName = getKeyName(keyCode)
    document.getElementById(direction + 'Key').value = keyName;

    if (direction == 'up') {
        key_up = event.keyCode;
        document.getElementById('upKeyShow').innerHTML = '&#x2191; : ' + keyName;
    }
    else if (direction == 'down') {
        key_down = event.keyCode;
        document.getElementById('downKeyShow').innerHTML = '&#x2193; : ' + keyName;
    }
    else if (direction == 'left') {
        key_left = event.keyCode;
        document.getElementById('leftKeyShow').innerHTML = '&#x2190; : ' + keyName;
    }
    else if (direction == 'right') {
        key_right = event.keyCode;
        document.getElementById('rightKeyShow').innerHTML = '&#x2192; : ' + keyName;
    }
}

function updateSliderValue() {
    var slider = document.getElementById("food-count");
    var output = document.getElementById("display-food-count");
    
    output.innerHTML = slider.value;
}

// validate game settings
$("#settings-form").validate({
    submitHandler: function(form) {
        set_active_menu_item('game')
        Start();
    }
});

function updateScores() {
    // sort the scores array
    scores.sort(function (first, second) { return (first[1] - second[1]); } );

    for (var i=0; i < scores.length; i++) {
        document.getElementById('score-table-username-' + i.toString()).innerHTML = scores[i][0];
        document.getElementById('score-table-time-' + i.toString()).innerHTML = scores[i][1];
    }
}