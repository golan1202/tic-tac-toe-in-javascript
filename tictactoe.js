var winners = new Array();
var player1Selections = new Array();
var player2Selections = new Array();
var numberOfPlayers = 2;
var currentPlayer = 0;
var points1 = 0;    // player 1 points
var points2 = 0;    // player 2 points
const btn_start = d("start");
const btn_reset = d("reset");
var size = 3;     // default board size is 3*3

function drawBoard(size) {
    var Parent = d("game");
    var counter = 1;

    while (Parent.hasChildNodes()) {
        Parent.removeChild(Parent.firstChild);
    }

    for (s = 0; s < size; s++) {
        var row = document.createElement("tr");

        for (r = 0; r < size; r++) {
            var col = document.createElement("td");
            col.id = counter;

            var handler = function (e) {
                var all_cells = document.getElementsByTagName('td');

                if (this.innerHTML == "X" || this.innerHTML == "O") {
                    d("status").innerHTML = "This cell is occupied";
                }

                else if (currentPlayer == 0 || currentPlayer == 1) {
                    if (currentPlayer == 0) {
                        this.innerHTML = "X";
                        this.style.color = "blue";
                        player1Selections.push(parseInt(this.id));
                        player1Selections.sort(function (a, b) { return a - b });
                    }
                    else {
                        this.innerHTML = "O";
                        this.style.color = "red";
                        player2Selections.push(parseInt(this.id));
                        player2Selections.sort(function (a, b) { return a - b });
                    }
                    changeSelected();
                    d("status").innerHTML = "Game in progress";

                    if (checkWinner() != -1) {
                        currentPlayer == 0 ? points1++ : points2++;

                        d("player1").innerHTML = points1;
                        d("player2").innerHTML = points2;
                        d("status").innerHTML = `Player ${currentPlayer == 0 ? 1 : 2} Won!`;

                        var win = checkWinner();

                        for (i = 0; i < size; i++) {
                            all_cells[winners[win][i] - 1].style.backgroundColor = "yellow";
                        }

                        currentPlayer == 0 ? d("status").style.color = "blue" : d("status").style.color = "red";

                        setTimeout(function () {
                            reset();
                            drawBoard(size)
                        }, 2000);

                    }
                    else if (player2Selections.length + player1Selections.length == size * size) {
                        d("status").innerHTML = "Draw";

                        for (i = 0; i < size * size; i++) {
                            all_cells[i].style.backgroundColor = "yellow";
                        }
                        d("status").style.color = "yellow";
                        setTimeout(function () {
                            reset();
                            drawBoard(size)
                        }, 2000);
                    }
                    else {
                        changeCurrentPlayer();
                    }
                }
            };
            col.addEventListener('click', handler);
            row.appendChild(col);
            counter++;
        }
        Parent.appendChild(row);
    }
    loadAnswers();
}

function d(id) {
    var el = document.getElementById(id);
    return el;
}

function reset() {
    changeCurrentPlayer();
    player1Selections = new Array();
    player2Selections = new Array();
    winners = new Array();
    d("status").style.color = "black";
    d("status").innerHTML = "Let's begin";
}

function changeSelected() {
    if (currentPlayer == 0) {
        d('player1').classList.remove('selected');
        d('player2').classList.add('selected');
    }
    else {
        d('player2').classList.remove('selected');
        d('player1').classList.add('selected');
    }
}

function changeCurrentPlayer() {
    currentPlayer == 0 ? currentPlayer = 1 : currentPlayer = 0;
}

function loadAnswers() {
    // Option 1 to win : rows 
    for (i = 1; i < size * size; i += size) {
        var arr = [];
        for (j = i; j < i + size; j++) {
            arr.push(j);
        }
        winners.push(arr);
    }
    // Option 2 to win : coloumns
    for (i = 1; i <= size; i++) {
        arr = [];
        for (j = i; j <= size * size; j += size) {
            arr.push(j);
        }
        winners.push(arr);
    }
    // Option 3 to win : diagonal
    arr = [];
    for (i = 1; i <= size * size; i += size + 1) {

        arr.push(i);
    }
    winners.push(arr);
    // Option 4 to win : anti - diagonal
    arr = [];
    for (i = size; i <= size * size - size + 1; i += size - 1) {
        arr.push(i);
    }
    winners.push(arr);
}

function checkWinner() {
    // check if current player has a winning hand
    // only start checking when player x has size number of selections
    var win = false;
    var playerSelections = new Array();

    if (currentPlayer == 0)
        playerSelections = player1Selections;
    else
        playerSelections = player2Selections;

    if (playerSelections.length >= size) {
        // check if any 'winners' are also in your selections
        for (i = 0; i < winners.length; i++) {
            var sets = winners[i];  // winning hand
            var setFound = true;
            for (r = 0; r < sets.length; r++) {
                // check if number is in current players hand
                // if not, break, not winner
                var found = false;
                // players hand
                for (s = 0; s < playerSelections.length; s++) {
                    if (sets[r] == playerSelections[s]) {
                        found = true;
                        break;
                    }
                }
                // value not found in players hand
                // not a valid set, move on
                if (found == false) {
                    setFound = false;
                    break;
                }
            }
            if (setFound == true) {
                win = true;
                break;
            }
        }
    }
    var result = win ? i : -1;
    return result;
}

//The load event is fired when the whole page has loaded, including all dependent resources such as stylesheets and images.
window.addEventListener('load', drawBoard(size));

// Clicking on the 'start' button will reset the data and draw a new board according to the 'board-size' input field
btn_start.addEventListener("click", function () {
    size = parseInt(d("board-size").value);
    reset();
    drawBoard(size);
});
// Clicking on the 'reset' button will initialize the score, reset the data, draw a new board 
btn_reset.addEventListener("click", function () {
    points1 = 0;
    points2 = 0;
    d("player1").innerHTML = points1;
    d("player2").innerHTML = points2;
    reset();
    drawBoard(size);
});

