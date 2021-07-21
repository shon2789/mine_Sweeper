const MINE = '💣'
const FLAG = '⛳️'


var clickCounter = 0;
var gBoard;
var gLevel = {
    size: 4,
    mines: 2,
    livesLeft: 1
}
var flagCounter = gLevel.mines;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}


function initGame() {
    clearInterval(timerVar)
    gBoard = createMat(gLevel.size);
    renderBoard(gBoard);
    // console.table(gBoard);
    putMinesOnBoard(gLevel.mines);
    setMinesNegCount();
    renderBoard(gBoard);
    document.querySelector('.flags').innerText = flagCounter;
    document.querySelector('.timer').innerText = '00:00';
    document.querySelector('.lives span').innerText = gLevel.livesLeft;
    document.querySelector('.smiley').innerText = '😃'
    gGame.isOn = true;
    clickCounter = 0;
}

function putMinesOnBoard(count) {

    for (var i = 0; i < count; i++) {
        var randIdxI = getRandomInt(0, gBoard.length - 1);
        var randIdxJ = getRandomInt(0, gBoard.length - 1);
        if (gBoard[randIdxI][randIdxJ].isMine) {
            i--;
        } else {
            gBoard[randIdxI][randIdxJ].isMine = true;
        }
        // renderCell(gBoard[randIdxI][randIdxJ].i, gBoard[randIdxI][randIdxJ].j, MINE);
    }

}

function getNegsMines(idxI, idxJ) {
    var minesCount = 0;

    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === idxI && j === idxJ) continue;
            if (gBoard[i][j].isMine) {
                // gBoard[idxI][idxJ].minesAroundCount++
                minesCount++;
            }
        }
    }
    // console.log(minesCount);
    return minesCount;
}

function setMinesNegCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            gBoard[i][j].minesAroundCount = getNegsMines(i, j, gBoard);
        }
    }
}

function cellClicked(i, j, elCell) {
    console.dir(elCell)
    if (!gGame.isOn) return;
    if (gBoard[i][j].isFlag) return;
    numsReveal(i, j);

    gBoard[i][j].isShown = true;
    clickCounter++;
    if (clickCounter === 1) {
        timerVar = setInterval(countTimer, 1000);
    }

    if (gBoard[i][j].isMine) {
        gLevel.livesLeft--;
        if (gLevel.livesLeft < 0) {
            minesReveal();
            gameOver();
            return;
        }
        document.querySelector('.lives span').innerText = gLevel.livesLeft;
        // renderBoard(gBoard);
        // return;
    }

    if (flagCounter === 0 && isAllCellsShown()) {
        document.querySelector('.smiley').innerText = '😎'
        console.log('You won!')
    }



    renderBoard(gBoard);
}

function rightClick(i, j) {
    if (!gGame.isOn) return;


    if (gBoard[i][j].isFlag) {
        console.log('HI')
        gBoard[i][j].isFlag = false;
        flagCounter++;
        document.querySelector('.flags').innerText = flagCounter;
        renderBoard(gBoard);
    } else if (!gBoard[i][j].isShown && flagCounter > 0) {
        gBoard[i][j].isFlag = true;
        flagCounter--;
        document.querySelector('.flags').innerText = flagCounter;
        renderBoard(gBoard);

    }
    if (flagCounter === 0) return;

}

function gameOver() {
    clearInterval(timerVar);
    gGame.isOn = false;
    console.log('You lost!')
    totalSeconds = 0;
    document.querySelector('.smiley').innerText = '🤕'
    // clickCounter = 0;
}

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
        gLevel.mines = 30
        gLevel.livesLeft = 3;
        flagCounter = gLevel.mines;
    }
    initGame();
}

function minesReveal() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) gBoard[i][j].isShown = true;
        }
    }
    renderBoard(gBoard);
}

function numsReveal(idxI, idxJ) {
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

                gBoard[i][j].isShown = true;

            }

        }
    }
    // numsReveal(i, j);
    document.querySelector('.flags').innerText = flagCounter;
    renderBoard(gBoard);
}



