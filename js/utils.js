
var colors = ['#d87044', '#dba143', '#7c9db4', '#ff5555', 'black', 'gray', 'maroon', 'turquoise'];

//Function that creates a matrix:
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

//Function that renders board:
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

//Function that creates objects:
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

//Function that returns a random int (max inclusive):
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//Function for cell rendering:
function renderCell(i, j, value) {
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.innerText = value;
}

//Timer Function:
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

//Function that checks whether all cells are Shown:
function isAllCellsShown() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isFlag) continue;
            if (!gBoard[i][j].isShown) return false;
        }
    }
    return true;
}

//Function to open and Close the 'How to play' modal:
function openModal(elBtn) {
    var modalBg = document.querySelector('.modal-bg');
    var modalClose = document.querySelector('.modal-close');

    elBtn.addEventListener('click', function () {
        modalBg.classList.add('bg-active');
    })

    modalBg.addEventListener('click', function () {
        modalBg.classList.remove('bg-active');
    })
}