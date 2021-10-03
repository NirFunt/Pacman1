'use strict'
// all gVars are shared & accesable by all files (game.js,ghost.js,pacman.js,utils)

//CR: 1) elGameOverDiv --> elGameOver , don't write the element type (Div)
//    2) gameOver('Won'); -->  gameOver(true);
//    3) gGhostsColors --> save the original color in ghost object, so ghost will have currCellContent, location, color, originalcolor
//    4) I could find ghost object by its location, write getGhostObjectByLocation()
 //   5)  return`<span>${GHOST}</span>`; -->  return`<span style="ghost.currentColor">${GHOST}</span>`; instead of querySelector at next step

const WALL = '🌊'
const FOOD = '🥖'
const EMPTY = '';
const POWERFOOD = '🥦';
const CHERRY = '🍒';

var gSIZE = 14;

var audioWon = new Audio('audio/retro-game.wav');
var audioLose = new Audio('audio/roar.wav');
var audioEatGhost = new Audio('audio/alarm.wav');

var gAddCherryInterval;

var gBoard;
var gGame = {
    score: 0,
    isOn: false
}

var gFoodCount = 107; // 196board - 52outwalls - 32innerwalls - 4superfood - 1pacman
var gFoodEeatenCounter = 0;

function init() {
    // console.log('hello')
    gBoard = buildBoard()
    createPacman(gBoard);
    createGhosts(gBoard);
    printMat(gBoard, '.board-container')
    gGame.isOn = true
    gAddCherryInterval = setInterval(insertCherry,15000);
    
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gSIZE; i++) {
        board.push([]);
        for (var j = 0; j < gSIZE; j++) {
            board[i][j] = FOOD;
            if (i === 0 || i === gSIZE - 1 ||
                j === 0 || j === gSIZE - 1 ||
                (j === 3 && i > 4 && i < gSIZE - 2)||
                (i === 5 && j > 6 && j < 11)||
                (i === 8 && j > 6 && j < 11) ||
                (j === 6 && i > 4 && i < gSIZE - 2)||
                (j === 6 && i > 1 && i < gSIZE - 2)||
                (i === 2 && j > 2 && j < 11) ){
                board[i][j] = WALL;
            }
        }
    }
    board[1][1] = board[1][board.length-2] = board[board.length - 2][1] = board[board.length -2][board.length - 2] =   POWERFOOD;
    return board;
}


function updateScore(diff) {
    gGame.score += diff;
    document.querySelector('h2 span').innerText = gGame.score
    if (gFoodEeatenCounter === gFoodCount) {
        gameOver(true);
    } 
}

function gameOver(isWon) {
    // console.log('Game Over');
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    clearInterval(gAddCherryInterval);
    var elGameOver = document.querySelector('.game-over');
    elGameOver.style.display = 'block';
    if (isWon) {
        elGameOver.querySelector('img').src = 'img/win.jpg';
        elGameOver.querySelector('h2').innerText = 'You Won';
        audioWon.play();
    } else {
        elGameOver.querySelector('img').src = 'img/lose.jpg';
        elGameOver.querySelector('h2').innerText = 'You Lose';
        audioLose.play();
    }
}

function restart () {
    gGame.score = 0;
    gFoodEeatenCounter = 0;
    document.querySelector('h2 span').innerText = gGame.score;
    var elGameOver = document.querySelector('.game-over');
    elGameOver.style.display = 'none';
    init();
}


function insertCherry() {
	var randomIdxI = getRandomIntInt(0, gBoard.length);
	var randomIdxJ = getRandomIntInt(0, gBoard[0].length);
	var count = 0;
	while (gBoard[randomIdxI][randomIdxJ]) {
		count++;
		if (count > 1000) {
			return;
		}
		// console.log(count);
		randomIdxI = getRandomIntInt(0, gBoard.length);
		randomIdxJ = getRandomIntInt(0, gBoard[0].length);
	}
	// model
	gBoard[randomIdxI][randomIdxJ] = CHERRY;
	// DOM
    renderCell({i:randomIdxI, j:randomIdxJ},CHERRY);
}


