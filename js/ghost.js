'use strict'
// all gVars are shared & accecable by all files (game.js,ghost.js,pacman.js,utils)

// const GHOST = '&#9781;';
const GHOST = '∰';

var gGhosts = [];
var gIntervalGhosts;

// var gGhostsColors = [];
var gKilledGhosts = [];


function createGhost(board,iPos,jPos) {
    var randomColor = getRandomColor();
    var ghost = {
        location: {
            i: iPos,
            j: jPos
        },
        currCellContent: FOOD,
        currentColor : randomColor,
        originalColor : randomColor
    }

    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = GHOST;
    //gBoard[ghost.location.i][ghost.location.j] = GHOST
}

function createGhosts(board) {
    gGhosts = [];
    createGhost(board,3,1)
    createGhost(board,12,5)
    createGhost(board,6,7)
    createGhost(board,3,10)
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        moveGhost(ghost)
    }
}
function moveGhost(ghost) {
    var moveDiff = getMoveDiff();
    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    if (nextCell === WALL) return;
    if (nextCell === GHOST) return; // no need else if because we return one line before
    if (nextCell === PACMAN && !gPacman.isSuper) { // no need else if because we return one line before
        gameOver(false);
        return;

    } if (nextCell === PACMAN && gPacman.isSuper) { // no need else if because we return one line before
        console.log('ghost eat pacman');
        // console.log(gKilledGhosts);
        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
        renderCell(ghost.location, ghost.currCellContent);
        ghost.currCellContent ='';
        gKilledGhosts.push(gGhosts.splice(gGhosts.indexOf(ghost),1)[0]);
        return;
   
    }

    // model
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // dom
    renderCell(ghost.location, ghost.currCellContent)

    // model
    ghost.location = nextLocation;
    ghost.currCellContent = gBoard[ghost.location.i][ghost.location.j]
    gBoard[ghost.location.i][ghost.location.j] = GHOST;
    // dom
    renderCell(ghost.location, getGhostHTML(ghost));

    var elGhostCell = document.querySelector(`.cell${ghost.location.i}-${ghost.location.j}`);
    // console.log(elGhostCell);
     elGhostCell.querySelector('span').style.color = ghost.currentColor;
}

function getMoveDiff() {
    var randNum = getRandomIntInt(0, 100);
    if (randNum < 25) {
        return { i: 0, j: 1 }
    } else if (randNum < 50) {
        return { i: -1, j: 0 }
    } else if (randNum < 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}


function getGhostHTML(ghost) {
    return`<span >${GHOST}</span>`;
   // return`<span style="color: ${ghost.currentColor} ;" >${GHOST}</span>`;
}

