'use strict'
// all gVars are shared & accecable by all files (game.js,ghost.js,pacman.js,utils)

const PACMAN = '😷';

var gDirection = '';

var gPacman;
function createPacman(board) {
    gPacman = {
        location: {
            i: 3,
            j: 5
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}
function movePacman(ev) {

    if (!gGame.isOn) return;
    // console.log('ev', ev);
    var nextLocation = getNextLocation(ev)

    if (!nextLocation) return; // if nextLocation === null (key was pressed which isnt up, down, left, right)
    // console.log('nextLocation', nextLocation);

    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    // console.log('NEXT CELL', nextCell);

    if (nextCell === WALL) return; 
    if (nextCell === CHERRY)  updateScore(10); // not else if because we return line before
    else if (nextCell === FOOD) { // here we need else if, because if it not CHERRY then we want to Check FOOD
        gFoodEeatenCounter++;
        updateScore(1);
    } 
    else if (nextCell === GHOST && !gPacman.isSuper) {
        gameOver();
        renderCell(gPacman.location, EMPTY)
        return;

    } else if (nextCell === POWERFOOD) {

        if (gPacman.isSuper) return;
        gPacman.isSuper = true;
        for (var i = 0; i < gGhosts.length; i++) {
            // gGhostsColors.push(gGhosts[i].color);
            gGhosts[i].currentColor = 'pink';
        } 
        setTimeout (function () {
            gPacman.isSuper = false;
            var originalLength = gKilledGhosts.length;
            for (var i = 0; i < originalLength; i++) {
                gGhosts.push(gKilledGhosts[0]);
                gKilledGhosts.splice(0,1);
            }
            // gKilledGhosts = [];
            for (var i = 0; i <gGhosts.length; i++) {
                gGhosts[i].currentColor = gGhosts[i].originalColor;
            }
           
        },5000)

        // setTimeout (function () {
        //     gPacman.isSuper = false;
        //     var originalLength = gKilledGhosts.length;
        //     for (var i = 0; i < originalLength; i++) {
        //         console.log(gKilledGhosts.length);
        //         gGhosts.push(gKilledGhosts[i]);
        //         // gKilledGhosts.splice(i,1);
        //     }
        //     // gGhosts.push(...gKilledGhosts);
        //     gKilledGhosts = [];
        //     for (var i = 0; i <gGhosts.length; i++) {
        //         gGhosts[i].currentColor = gGhosts[i].originalColor;
        //     }
           
        // },5000)

    } else if (nextCell === GHOST && gPacman.isSuper) {
        var ghostEaten = getGhostObjectByLocation(nextLocation);
        audioEatGhost.play();
        // console.log(ghostEaten);
        // if (ghostEaten.currCellContent = 'FOOD') { big bug!!! wrote = instead of ===, it is hard to find the problem
        if (ghostEaten.currCellContent === FOOD) {
            ghostEaten.currCellContent = '';
            // console.log(gFoodEeatenCounter);
            gFoodEeatenCounter++;
            // console.log(gFoodEeatenCounter);
           updateScore(1);
        }
        gKilledGhosts.push(gGhosts.splice(gGhosts.indexOf(ghostEaten),1)[0]);
        // gBoard[ghostEaten.location.i][ghostEaten.location.j] = EMPTY;
        // renderCell(ghostEaten.location, EMPTY);
        // console.log(gKilledGhosts);
    }

    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    
    // update the dom
    renderCell(gPacman.location, EMPTY);
    
    gPacman.location = nextLocation;
    
    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
    // update the dom
    renderCell(gPacman.location, `<img src="img/Pacman_${gDirection}.png" width="30px" > `);

}


function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--;
            gDirection = 'U';
            break;
        case 'ArrowDown':
            nextLocation.i++;
            gDirection = 'D';
            break;
        case 'ArrowLeft':
            nextLocation.j--;
            gDirection = 'L';
            break;
        case 'ArrowRight':
            nextLocation.j++;
            gDirection = 'R';
            break;
        defaDlt:
            return null;
    }
    return nextLocation;
}


function getGhostObjectByLocation (loc) {
    // console.log(loc.i,loc.j);
    for (var i = 0; i < gGhosts.length; i++) {
        if (loc.i === gGhosts[i].location.i && loc.j === gGhosts[i].location.j) {
            return gGhosts[i];
        }
    }
    return null;
}