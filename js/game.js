const MINE = '💣'
const FLAG = '⛳️'

var isHintOn = false;
var clickCounter = 0;
var gBoard;
var shownCellsCount;//Will store the number of shown cells.


var gLevel = {
    size: 4,
    mines: 2,
    livesLeft: 1
}
var numCellsOnBoard; //Will store how many cells with neighbor mines.
var minesIgnored = 0;
var flagCounter = gLevel.mines;
var gGame = {
    isOn: false,

}


function initGame() {
    clearInterval(timerVar)
    gBoard = createMat(gLevel.size);
    renderBoard(gBoard);
    putMinesOnBoard(gLevel.mines);
    setMinesNegCount();
    renderBoard(gBoard);
    gLevel.livesleft = 1;
    resetGame();
    resetHints();
    gGame.isOn = true;


}

//Randomly putting Mines on board:
function putMinesOnBoard(count) {

    for (var i = 0; i < count; i++) {
        var randIdxI = getRandomInt(0, gBoard.length - 1);
        var randIdxJ = getRandomInt(0, gBoard.length - 1);
        if (gBoard[randIdxI][randIdxJ].isMine) {
            i--;
        } else {
            gBoard[randIdxI][randIdxJ].isMine = true;
        }
    }
}


//Returns the amount of neighboors mines around specific cell:
function getNegsMines(idxI, idxJ) {
    var minesCount = 0;

    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === idxI && j === idxJ) continue;
            if (gBoard[i][j].isMine) {
                minesCount++;
            }
        }
    }

    return minesCount;
}

//Updates the Model with the mines locations:
function setMinesNegCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            gBoard[i][j].minesAroundCount = getNegsMines(i, j, gBoard);
        }
    }
}

//Function for left clicking:
function cellClicked(i, j, elCell) {
    new Audio('/sound/click.wav').play();
    if (!gGame.isOn) return;
    if (gBoard[i][j].isFlag) return;
    if (isHintOn) {//When user clicks on a hint:
        showHintCells(i, j);
        isHintOn = false;
        return;
    }
    if (gBoard[i][j].minesAroundCount === 0) {
        (numsReveal(i, j));
    }
    gBoard[i][j].isShown = true;//Updates the Model to reveal the cell.

    clickCounter++;
    if (clickCounter === 1) {//Starts the timer on first click.
        timerVar = setInterval(countTimer, 1000);
    }

    if (gBoard[i][j].isMine) {//When user clicks a mine:
        if (clickCounter === 1) {
            initGame();
            var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            cellClicked(i, j, elCurrCell);
            renderBoard(gBoard);
            return
        }

        gLevel.livesLeft--;
        minesIgnored++;//Counts how many mines the user has clicked on.
        gBoard[i][j].isShown = true;

        if (gLevel.livesLeft < 0) {//Game over when:
            minesReveal();
            gameOver();
            return;
        }
        document.querySelector('.lives span').innerText = gLevel.livesLeft;

    }


    countShownCells();//Checks how many cells are shown.
    if (shownCellsCount === numCellsOnBoard && gLevel.livesLeft >= 0) {

        winGame();
    }



    renderBoard(gBoard);
}

//Function for right click:
function rightClick(i, j) {
    clickCounter++;
    if (!gGame.isOn) return;
    if (clickCounter === 1) {
        timerVar = setInterval(countTimer, 1000);
    }


    if (gBoard[i][j].isFlag) {//Revealing a flag
        console.log('HI')
        gBoard[i][j].isFlag = false;
        flagCounter++;
        document.querySelector('.flags').innerText = '⛳️ ' + flagCounter;
        renderBoard(gBoard);
    } else if (!gBoard[i][j].isShown && flagCounter > 0) {//Removing a flag
        gBoard[i][j].isFlag = true;
        flagCounter--;
        document.querySelector('.flags').innerText = '⛳️ ' + flagCounter;
        renderBoard(gBoard);

    }

    if (shownCellsCount === numCellsOnBoard && gLevel.livesLeft >= 0) {//Win game:
        winGame();
    }


    if (flagCounter === 0) return;


}

//Game over function:
function gameOver() {
    clearInterval(timerVar);
    gGame.isOn = false;
    totalSeconds = 0;
    document.querySelector('.smiley').innerText = '🤕'
    gLevel.livesLeft = 1;
    document.querySelector('h2').style.visibility = 'visible';
    document.querySelector('h2').style.color = 'red';
    document.querySelector('h2').innerText = 'You LOST!';


}

//Function to determine difficulty on board:
function chooseDifficulty(elBtn) {
    if (elBtn.innerText === 'Easy') {
        gLevel.size = 4;
        gLevel.mines = 2;
        gLevel.livesLeft = 1;
        flagCounter = gLevel.mines;
    } else if (elBtn.innerText === 'Medium') {
        gLevel.size = 8;
        gLevel.mines = 12;
        gLevel.livesLeft = 2;
        flagCounter = gLevel.mines;
    } else if (elBtn.innerText === 'Expert') {
        gLevel.size = 12;
        gLevel.mines = 30;
        gLevel.livesLeft = 3;
        flagCounter = gLevel.mines;
    }

    initGame();
}

//Reveals mines all over the board when user loses:
function minesReveal() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) gBoard[i][j].isShown = true;
        }
    }
    renderBoard(gBoard);
}

//Reveals all neighboors with no mines around in recursion:
function numsReveal(idxI, idxJ) {
    // var recur = [];
    if (gBoard[idxI][idxJ].minesAroundCount === 0 && !gBoard[idxI][idxJ].isMine) {

        for (var i = idxI - 1; i <= idxI + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = idxJ - 1; j <= idxJ + 1; j++) {
                if (j < 0 || j >= gBoard[i].length) continue;
                if (i === idxI && j === idxJ) continue;
                if (gBoard[i][j].isFlag === true) {
                    gBoard[i][j].isFlag = false;
                    gBoard[i][j].isShown = true;
                    flagCounter++;
                    continue;
                }
                if (gBoard[i][j].isMine || gBoard[i][j].isShown) continue;
                gBoard[i][j].isShown = true;
                if (gBoard[i][j].minesAroundCount === 0) {
                    numsReveal(i, j);
                }

            }

        }
    }

    document.querySelector('.flags').innerText = '⛳️ ' + flagCounter;
    renderBoard(gBoard);
}

//Function for updating DOM hint clicking:
function hintClicked(elHint) {
    if (elHint.style.opacity === 1) return;
    elHint.style.opacity = '1';
    isHintOn = true;

    setTimeout(function () {
        elHint.style.display = 'none'
    }, 2000)

}

//Function for hint clicking:
function showHintCells(idxI, idxJ) {

    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].isShown || gBoard[i][j].isFlag) continue;

            var elCell = document.querySelector(`.cell-${i}-${j}`);
            console.log(elCell);
            elCell.classList.add('shown')
            if (!gBoard[i][j].isMine) {
                elCell.innerText = gBoard[i][j].minesAroundCount;
            } else {
                elCell.innerText = '💣'
            }

        }
    }

    setTimeout(function () {

        for (var i = idxI - 1; i <= idxI + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = idxJ - 1; j <= idxJ + 1; j++) {
                if (j < 0 || j >= gBoard[i].length) continue;
                if (gBoard[i][j].isShown || gBoard[i][j].isFlag) continue;
                var elCell = document.querySelector(`.cell-${i}-${j}`);
                elCell.classList.remove('shown')
                console.log(elCell);
                elCell.innerText = '';
            }
        }
    }, 1000)
}

//Function to reset all parameters to starting point;
function resetGame() {
    document.querySelector('.flags').innerText = '⛳️ ' + flagCounter;
    document.querySelector('.timer').innerText = ' 00:00';
    document.querySelector('.lives span').innerText = gLevel.livesLeft;
    document.querySelector('.smiley').innerText = '😃'
    document.querySelector('h2').style.visibility = 'hidden';
    clickCounter = 0;
    flagCounter = gLevel.mines;
    minesIgnored = 0;
    isHintOn = false;
    shownCellsCount = 0;
    numCellsOnBoard = (gLevel.size ** 2) - gLevel.mines;
}

//Function for resseting the CSS of hints:
function resetHints() {
    var elHints = document.querySelectorAll('.hint');
    for (var i = 0; i < elHints.length; i++) {
        elHints[i].style.display = 'inline-block';
        elHints[i].style.opacity = 0.4;
    }

}

//Function that counts the number of shown cells on board:
function countShownCells() {
    shownCellsCount = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (!gBoard[i][j].isMine && gBoard[i][j].isShown) {
                shownCellsCount++;
            }
        }
    }
}

//Function for game win:
function winGame() {
    document.querySelector('.smiley').innerText = '😎'
    document.querySelector('h2').style.visibility = 'visible';
    document.querySelector('h2').style.color = 'green';
    document.querySelector('h2').innerText = 'You WON!';
    clearInterval(timerVar);
    new Audio('/sound/win.wav').play();
    gGame.isOn = false;
}