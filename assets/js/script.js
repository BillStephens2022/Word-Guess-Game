var timerEl = document.getElementById("timer");
var startButton = document.getElementById("start");
var wordEl = document.getElementById("word");
var messageEl = document.getElementById("message");
var winsEl = document.getElementById("wins");
var lossesEl = document.getElementById("losses");
var resetScoresButton = document.getElementById("reset-scores");
var timeLeftEl = document.getElementById("time-left");
var gameHeaderEl = document.getElementById("game-header");
var timeLeft = 30;
var selectedWord = "";
var wins = 0;
var losses = 0;
var winGame = false;
var blanksArray = [];

function init() {
    getWins();
    getLosses();
    blanksArray = [];
    startButton.disabled=false;
    
}

function startGame() {
    winGame = false;
    startButton.disabled = true;
    messageEl.textContent = "";
    init();
    renderBlanks();
    startTimer();
};

function getWins() {
    var storedWins = localStorage.getItem("wins");
    if (storedWins === null) {
        wins = 0;
    } else {
        wins = storedWins;
    };
    winsEl.textContent = wins;
}

function getLosses() {
    var storedLosses = localStorage.getItem("losses");
    if (storedLosses === null) {
        losses = 0;
    } else {
        losses = storedLosses;
    };
    lossesEl.textContent = losses;
}

function setWins() {
    winsEl.textContent = wins;
    localStorage.setItem("wins", wins);
}

function setLosses() {
    lossesEl.textContent = losses;
    localStorage.setItem("losses", losses);
}

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

function checkLetter(key) {
    for (var i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i] === key) {
            blanksArray[i] = key;
        }
    }
    checkWord();     
}

function checkWord() {
    wordEl.textContent = blanksArray.join(''); 
    if ((wordEl.textContent === selectedWord) && (timeLeft > 0)) {
        winGame = true;
    } else {
        return;
    };
}

function initiateWinSequence() {
    wins++;
    messageEl.textContent = "YOU WIN!!";
    messageEl.style.color = "#2BFF88";
    setWins();
    init();
}

function initiateLossSequence () {
    losses++;
    messageEl.textContent = "YOU LOSE!!";
    messageEl.style.color = "#be3144";
    setLosses();
    init();
}

function resetScores() {
    wins = 0;
    losses = 0;
    setWins();
    setLosses();
}

document.addEventListener("keypress", function(event) {
    var keyPress = event.key;
    checkLetter(keyPress);
    checkWord();
}); 
       
startButton.addEventListener("click", startGame)
resetScoresButton.addEventListener("click", resetScores);

init();