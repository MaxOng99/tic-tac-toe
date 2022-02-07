import React from 'react';
import ReactDOM from 'react-dom';
import useLocalStorage from './hooks/useLocalStorage';

import './css/index.css';

/* GLOBAL PROPS */
const INITIAL_BOARD_STATE = [".", ".", ".", ".", ".", ".", ".", ".", "."];
const INITIAL_INDEX = 0;
const INITIAL_GAME_STATE = {"currentIndex": INITIAL_INDEX, "history": [INITIAL_BOARD_STATE]};

/* COMPOMNENTS */
function Status(props) {
    const player = props.player;
    const winner = props.winner;
    const turns = props.turns;

    if (winner !== null) {
        return(
            <p id="game-status">Player {winner} has won!</p>
        );
    }
    else if (turns === 9) {
        return(
            <p id="game-status">Draw</p>
        );  
    }
    else{
        return(
            <p id="game-status">Player {player}'s turn</p>
        );
    }
}

function Board(props) {
    const boardState = props.boardState;
    const winner = props.winner;
    const cells = boardState.map((symbol, index) => {
        if (winner !== null || symbol === "X" || symbol === "O") {
            return(
                <button disabled onClick={() => props.handleCellClick(index)} key={index}>{symbol}</button>
            );
        }
        else{
            return(
                <button onClick={() => props.handleCellClick(index)} key={index}>{symbol}</button>
            );
        }
    })
    
    return(
        <div id="board-container">
            {cells}
        </div>
    );
}

function Controls(props) {

    const historyLength = props.historyLength;
    const cells = Array.from({length: historyLength}, (_, id) => (<button onClick={() => props.rewind(id)} className="history-btn" key={id}>{id+1}</button>));

    return(
        <section id="controls">   
            <div id="history-control">
                <label>History</label>
                {cells}
            </div>
            <button onClick={props.handleRestart} id="restart-control">Restart</button>
        </section>
    );
}


function Game() {

    const [gameState, setGameState] = useLocalStorage("gameState", INITIAL_GAME_STATE);
    
    function filledCells(boardState) {
        let cellsWithSymbols = 0;
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === "X" || boardState[i] === "O") {
                cellsWithSymbols = cellsWithSymbols + 1;
            }
        }
        return cellsWithSymbols;
    }

    function checkWinner(boardState) {
        
        const winningPositions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < winningPositions.length; i++) {
            const [a, b, c] = winningPositions[i];
            if (boardState[a] === boardState[b] && boardState[a] === boardState[c] && (boardState[a] === "X" || boardState[a] === "O")) {
                return boardState[a];
            }
        }
        return null;
    }

    function currentPlayer(historyIndex) {
        const player = historyIndex % 2 === 0 ? "X" : "O";
        return player;  
    }

    function onCellClick(cellIndex) {

        setGameState(prev => {
            const newIndex = prev.currentIndex + 1;
            const temp = prev.history[prev.currentIndex].slice();
            temp[cellIndex] = currentPlayer(prev.currentIndex)

            return(
                {
                    "currentIndex": newIndex,
                    "history": [...prev.history.slice(0, newIndex), temp],
                }
            );
        });
    }

    function onRestart() {
        setGameState(prev => {
            return(
                {
                    "currentIndex": 0,
                    "history": [[".", ".", ".", ".", ".", ".", ".", ".", "."]],
                }
            );
        });
    }

    function onRewind(index) {
        setGameState(prev => {
            return(
                {
                    "currentIndex": index,
                    "history": [...prev.history]
                }
            );
        })
    }

    const winner = checkWinner(gameState.history[gameState.currentIndex]);
    const player = currentPlayer(gameState.currentIndex);
    const cellsWithSymbols = filledCells(gameState.history[gameState.currentIndex]);
    return(
        <React.Fragment>
            <Status player={player} winner={winner} turns={cellsWithSymbols}/>
            <Board boardState={gameState.history[gameState.currentIndex]} handleCellClick={onCellClick} winner={winner}/>
            <Controls historyLength={gameState.history.length} handleRestart={onRestart} rewind={onRewind}/>
        </React.Fragment>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <Game />
    </React.StrictMode>,
    document.getElementById('root')
);