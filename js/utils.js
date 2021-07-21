
var colors = ['blue', 'green', 'red', 'purple', 'black', 'gray', 'maroon', 'turquoise'];

function createMat(size, obj) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = getCellObj(i, j);

            board[i][j] = cell;
        }
    }
    return board;
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < board[i].length; j++) {
            var className = `cell-${i}-${j}`;
            var cellContent;
            var negMinesCounter = getNegsMines(i, j);
            if (board[i][j].isMine && board[i][j].isShown) {
                cellContent = MINE;
                className += ' mine'
            } else if (!board[i][j].isMine && board[i][j].isShown && !board[i][j].isFlag) {
                if (board[i][j].minesAroundCount === 0) {
                    cellContent = '';
                } else {

                    cellContent = '' + board[i][j].minesAroundCount;
                }
                className += ' shown'
                // console.log(cellContent)
            } if (!board[i][j].isShown) {
                cellContent = '';
            } if (!board[i][j].isShown && board[i][j].isFlag) {
                cellContent = FLAG;
            }
            strHTML += `<td class="${className} cell" style="color:${colors[negMinesCounter - 1]}" onclick="cellClicked(${i}, ${j}, this)" oncontextmenu="rightClick(${i}, ${j}, event);return false;">${cellContent}</td>`;

        }
        strHTML += `</tr>`;
    }
    document.querySelector('table').innerHTML = strHTML;
}

function getCellObj(idxI, idxJ, isMine = false) {
    var cell = {
        i: idxI,
        j: idxJ,
        minesAroundCount: 0,
        isShown: false,
        isMine: isMine,
        // isMarked: false,
        isFlag: false
    }
    return cell;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function renderCell(i, j, value) {
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.innerText = value;
}

var timerVar;

var totalSeconds = 0;
function countTimer() {
    ++totalSeconds;
    var hour = Math.floor(totalSeconds / 3600);
    var minute = Math.floor((totalSeconds - hour * 3600) / 60);
    var seconds = totalSeconds - (hour * 3600 + minute * 60);
    if (hour < 10)
        hour = "0" + hour;
    if (minute < 10)
        minute = "0" + minute;
    if (seconds < 10)
        seconds = "0" + seconds;
    document.querySelector('.timer').innerText = minute + ":" + seconds;
}


function isAllCellsShown() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isFlag) continue;
            if (!gBoard[i][j].isShown) return false;
        }
    }
    return true;
}