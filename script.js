let isSinglePlayer = false; //to check if single player mode is selected

function createPlayer(name, mark){ //creating a player
    const getName = () => name;
    const getMark = () => mark;
    return {getName, getMark};
}

function createGameBoard(){ //creating game board
    let board = ["", "", "", "", "", "", "", "", ""]; //initially every cell is empty
    const player1 = createPlayer("Player 1", "X"); 
    const player2 = createPlayer("Player 2", "O"); //if multiplayer
    const computerPlayer = createPlayer("Computer", "O"); //if singleplayer
    let turn = player1;    
    const getBoard = () => board;
    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
        document.getElementById("game-result").textContent = "";
        Array.from(document.querySelectorAll(".cell")).forEach(cell => cell.textContent = "");
        turn = player1;
        gameboard.innerHTML = "";
    }
    const getPlayer = () => turn; //to check which player's turn it is
    const changeTurn = () =>{ //changing turns
        if(turn === player1) turn = isSinglePlayer ? computerPlayer : player2;
        else turn = player1;
    }
    const gameboard = document.getElementById("game-board"); //creating cells inside game-board div
    for(let i=0; i<board.length; i++){
        const cell = document.createElement("div");
        cell.style.border ="solid 1px black";
        cell.className = "cell";
        cell.textContent = board[i];
        gameboard.appendChild(cell);
    }
    return {getBoard, resetBoard, getPlayer, changeTurn};
}

function checkWinner(gameboard){ //to check winner after each turn
    let board = gameboard.getBoard();
    if((board[0]!=="" && board[0]===board[1] && board[1]===board[2]) || (board[3]!=="" && board[3]===board[4] && board[4]===board[5]) || (board[6]!=="" && board[6]===board[7] && board[7]===board[8]) ||
        (board[0]!=="" && board[0]===board[3] && board[3]===board[6]) || (board[1]!=="" && board[1]===board[4] && board[4]===board[7]) || (board[2]!=="" && board[2]===board[5] && board[5]===board[8]) ||
        (board[0]!=="" && board[0]===board[4] && board[4]===board[8]) || (board[2]!=="" && board[2]===board[4] && board[4]===board[6])){
        return gameboard.getPlayer().getName() + " wins!!!";
    }
    let count = 0;
    for(let i=0; i<board.length; i++){
        if(board[i]!=="") count++;
    }
    if(count===9) return "It's a tie..."; //if all cells are full and none wins then it's a tie
    return "";
}

function computerMove(gameboard) { //random move by computer
    const availableCells = gameboard.getBoard()
        .map((value, index) => value === "" ? index : null)
        .filter(index => index !== null);

    if (availableCells.length > 0) {
        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        gameboard.getBoard()[randomIndex] = gameboard.getPlayer().getMark();
        const cell = document.querySelectorAll(".cell")[randomIndex];
        cell.textContent = gameboard.getPlayer().getMark();
    }
}

document.getElementById("start").addEventListener("click", ()=>{

    isSinglePlayer = document.getElementById("single-player").checked;
    const gameboard = createGameBoard();

    //once game is started we don't need game-mode and start button to display
    document.getElementById("start").style.display = "none"; 
    document.getElementById("mode-selector").style.display = "none";
    
    // selecting each cell
    Array.from(document.querySelectorAll(".cell")).forEach((element, index) => {
        element.addEventListener("click", ()=>{
            //when user clicks empty cells before annouching game result.
            if(element.textContent==="" && gameboard.getPlayer().getName() !== "Computer" && document.getElementById("game-result").textContent===""){
                gameboard.getBoard()[index] = gameboard.getPlayer().getMark();
                element.textContent = gameboard.getPlayer().getMark();
                const result = checkWinner(gameboard);
                if(result!==""){ //when we are getting a result
                    document.getElementById("game-result").textContent = result;
                    document.getElementById("restart").style.display = "block";
                    return;
                }
                gameboard.changeTurn();

                if (isSinglePlayer) { //handing computer's turn
                    setTimeout(() => {
                        computerMove(gameboard);
                        const result = checkWinner(gameboard);
                        if (result !== "") {
                            document.getElementById("game-result").textContent = result;
                            document.getElementById("restart").style.display = "block";
                            return;
                        }
                        gameboard.changeTurn();
                    }, 400);
                }
            }
        })
    });
    document.getElementById("restart").addEventListener("click", () => { //if restart is selected
        gameboard.resetBoard();
        document.getElementById("restart").style.display = "none";
        document.getElementById("start").style.display = "block";
        document.getElementById("mode-selector").style.display = "block";
    });
})




