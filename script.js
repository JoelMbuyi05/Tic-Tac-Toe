const board = document.getElementById('board')
const squares = document.getElementsByClassName('square')
const players = ['X', 'O']
let currentPlayer = players[0]
const endMessage = document.createElement('h2')
endMessage.id = 'end-message';
endMessage.textContent = `X's turn!`
/*endMessage.style.marginTop = '12px'
endMessage.style.textAlign='center'*/

board.after(endMessage)

const winning_combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

for(let i = 0; i < squares.length; i++){
    squares[i].addEventListener('click', () => {
        if(squares[i].textContent !== '' || currentPlayer === 'O' || gamerOver()) return;

        squares[i].textContent = currentPlayer;
        evaluateGame();

        if(!gamerOver()) {
            currentPlayer = 'O';
            endMessage.textContent = `O's turn!`;

            setTimeout(() => {
                aiMove();
                evaluateGame();
                if(!gamerOver()){
                    currentPlayer = 'X';
                    endMessage.textContent = `X's turn!`;
                }
            }, 500);
        }
    });
}

function evaluateGame(){
    if(checkWin(currentPlayer)){
        endMessage.textContent = `Game Over! ${currentPlayer} wins!`;
    }else if(checkTie()){
        endMessage.textContent = 'Game is tied!';
    }
}

function checkTie(){
    return Array.from(squares).every(square => square.textContent !== '');
}

function gamerOver(){
    return checkWin(players[0]) || checkWin(players[1]) || checkTie();
}

function restartButton() {
    for(let i = 0; i < squares.length; i++) {
        squares[i].textContent = "";
    }
    endMessage.textContent=`X's turn!`
    currentPlayer = players[0]
}

function aiMove() {
    const difficulty = document.getElementById("difficultySelector").value;

    if (difficulty === "easy") {
        makeRandomMove();
    } else if (difficulty === "medium") {
        if (!makeSmartMove()) {
            makeRandomMove();
        }
    } else if (difficulty === "hard") {
       if(!makeSmartMove()){
          makeBestMove();
       }
    }
    evaluateGame();
}

function makeRandomMove() {
    const emptySquares = Array.from(squares).filter(sq => sq.textContent === '');
    if (emptySquares.length === 0) return;
    const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    randomSquare.textContent = currentPlayer;
}

function makeSmartMove() {
    for (let combo of winning_combinations) {
        let [a, b, c] = combo;
        let values = [squares[a].textContent, squares[b].textContent, squares[c].textContent];
        if (values.filter(v => v === currentPlayer).length === 2 && values.includes("")) {
            squares[combo[values.indexOf("")]].textContent = currentPlayer;
            return true;
        } 
        if (values.filter(v => v === players[0]).length === 2 && values.includes("")) {
            squares[combo[values.indexOf("")]].textContent = currentPlayer;
            return true;
        }
    }
    return false;
}

function makeBestMove() {
    makeRandomMove();
}

function checkWin(player){
    return winning_combinations.some(combo => {
        return combo.every(index => squares[index].textContent === player);
    });
}

