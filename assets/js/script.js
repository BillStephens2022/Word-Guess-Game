//variables for HTML elements
var timerEl = document.getElementById("timer");
var startButton = document.getElementById("start");
var wordEl = document.getElementById("word");
var messageEl = document.getElementById("message");
var winsEl = document.getElementById("wins");
var lossesEl = document.getElementById("losses");
var resetScoresButton = document.getElementById("reset-scores");
var timeLeftEl = document.getElementById("time-left");
var gameHeaderEl = document.getElementById("game-header");

//gamePlay variables
var timeLeft = 30;
var selectedWord = "";
var wins = 0;
var losses = 0;
var winGame = false;
var blanksArray = [];

//initialize game, refresh wins/losses, empty blanksArray, enable start button
function init() {
    getWins();
    getLosses();
    blanksArray = [];
    startButton.disabled=false;
}

//function to start game.  empties any messages rendered in previous game, initializes screen, renders blanks for new word selection and starts the timer.
function startGame() {
    winGame = false;
    startButton.disabled = true;
    messageEl.textContent = "";
    wordEl.focus();
    init();
    renderBlanks();
    startTimer();
};

//gets wins total from local storage.
function getWins() {
    var storedWins = localStorage.getItem("wins");
    if (storedWins === null) {
        wins = 0;
    } else {
        wins = storedWins;
    };
    winsEl.textContent = wins;
}

//gets losses total from local storage.
function getLosses() {
    var storedLosses = localStorage.getItem("losses");
    if (storedLosses === null) {
        losses = 0;
    } else {
        losses = storedLosses;
    };
    lossesEl.textContent = losses;
}

//saves wins in local storage.
function setWins() {
    winsEl.textContent = wins;
    localStorage.setItem("wins", wins);
}

//saves losses in local storage.
function setLosses() {
    lossesEl.textContent = losses;
    localStorage.setItem("losses", losses);
}

//starts timer and renders message when time is up and initiates win/loss sequence depending on whether player guessed the word within the allotted time.
function startTimer() {
    timeLeft = 30;
    timerEl.textContent = "Time Remaining: " + timeLeft;
    var timer = setInterval(function() {
        timeLeft--;
        timerEl.textContent = "Time Remaining: " + timeLeft;
        
        if ((timeLeft > 0) && (winGame === true)) {
            clearInterval(timer);
            initiateWinSequence();
        } else if((timeLeft > 0) && (winGame === false)) {
            return
        } else {
            timerEl.textContent = "Time Up!";
            clearInterval(timer);
            initiateLossSequence();
        }
    }, 1000)
}

//renders blanks for the new random word chosen
function renderBlanks() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    for (var i=0; i < selectedWord.length; i++) {
        blanksArray.push("_  ");
    };
    blanksString = blanksArray.join('');
    gameHeaderEl.textContent = "Guess a letter:";
    wordEl.textContent = blanksString;
    console.log(selectedWord);
}

//checks if letter pressed by player is in the selected word.
function checkLetter(key) {
    for (var i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i] === key) {
            blanksArray[i] = key;
        }
    }
    checkWord();     
}

//checks if player word equals the computer selected word.
function checkWord() {
    wordEl.textContent = blanksArray.join(''); 
    if ((wordEl.textContent === selectedWord) && (timeLeft > 0)) {
        winGame = true;
    } else {
        return;
    };
}

//initiates the win sequence, increments win total, displays win message, updates local storage.
function initiateWinSequence() {
    wins++;
    messageEl.textContent = "YOU WIN!!";
    messageEl.style.color = "#2BFF88";
    setWins();
    init();
}

//initiates the loss sequence, increments loss total, displays loss message, updates local storage.
function initiateLossSequence () {
    losses++;
    messageEl.textContent = "YOU LOSE!!";
    messageEl.style.color = "#be3144";
    setLosses();
    init();
}

//resets win/loss totals to zero in local storage.
function resetScores() {
    wins = 0;
    losses = 0;
    setWins();
    setLosses();
}

//adds an event listener to the screen listening for player key presses so that letter can be checked if in selected word and if player has successfully guessed the word.
document.addEventListener("keypress", function(event) {
    var keyPress = event.key.toLowerCase();
    checkLetter(keyPress);
    checkWord();
}); 

//adds an event listener to the screen listening for a click on the start button which will start the game.
startButton.addEventListener("click", startGame)

//adds an event listener to the reset scores button, so that scores can be reset to zero.
resetScoresButton.addEventListener("click", resetScores);

// initiates page for new game before player clicks start.
init();