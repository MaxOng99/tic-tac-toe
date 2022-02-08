import React from 'react';
import ReactDOM from 'react-dom';
import useLocalStorage from './hooks/useLocalStorage';

import './css/index.css';

/* GLOBAL VARS */
const WINNING_POSITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const INITIAL_GAME_STATE = { "currentHistoryIndex": 0, "history": [Array(9).fill(".")]};

/* COMPONENTS */
const Game = () => {

    /** Top-level state */
    const [gameState, setGameState] = useLocalStorage("gameState", INITIAL_GAME_STATE);

    /** Derived state properties */
    const currentBoardState = gameState.history[gameState.currentHistoryIndex]; 
    const winner = getWinner(currentBoardState);
    const player = getCurrentPlayer(gameState.currentHistoryIndex);
    
    /** Event Callbacks */
    function onRestart() {
        setGameState(INITIAL_GAME_STATE);
    }

    function onRewind(historyIndex) {
        setGameState(prev => {
            return(
                {
                    "currentHistoryIndex": historyIndex,
                    "history": prev.history
                }
            );
        })
    }

    function onBoardCellClick(boardCellIndex) {
        setGameState(prev => {
            const currentHistoryIndex = prev.currentHistoryIndex;
            const currentBoardState = prev.history[currentHistoryIndex];

            const newIndex = currentHistoryIndex + 1;
            const newBoardState = currentBoardState.slice();
            newBoardState[boardCellIndex] = getCurrentPlayer(currentHistoryIndex);

            return(
                {
                    "currentHistoryIndex": newIndex,
                    "history": [...prev.history.slice(0, newIndex), newBoardState],
                }
            );
        });
    }

    /** Utility Functions */
    function getWinner(boardState) {
        for (let i = 0; i < WINNING_POSITIONS.length; i++) {
            const [pos1, pos2, pos3] = WINNING_POSITIONS[i];
            if (boardState[pos1] === boardState[pos2] && boardState[pos1] === boardState[pos3] && boardState[pos1] != ".") {
                return boardState[pos1];
            }
        }
        return null;
    }

    function getCurrentPlayer(historyIndex) {
        return historyIndex % 2 === 0 ? "X" : "O";  
    }

    /** UI Rendering */
    return(
        <React.Fragment>
            <Status boardState={currentBoardState} player={player} winner={winner}/>
            <Board boardState={currentBoardState} handleCellClickFunction={onBoardCellClick} winner={winner}/>
            <Controls historyLength={gameState.history.length} restartBoardFunction={onRestart} rewindToHistoryByIndex={onRewind}/>
        </React.Fragment>
    );
}

const Status = ({ player, winner, boardState }) => {
    const statusMessage = winner 
        ? `Player ${winner} has won!`
        : boardState.every( (symbol) => (symbol == "O" || symbol == "X") )  
        ? `It's a draw!`
        : `Player ${player}'s turn`

    return(
        <p id="game-status">{statusMessage}</p>
    );
}

const Board = ({ winner, boardState, handleCellClickFunction }) => {    
    /* Board Cells UI */
    const boardCells = boardState.map((symbol, index) => {
        const disableButton = (winner || symbol != ".") ? true : false;
        return (
            <button key={index}
            onClick={() => handleCellClickFunction(index)}
            disabled={disableButton}>
                {symbol}
            </button>
        );
    });

    /** Board UI */
    return(
        <div id="board-container">
            {boardCells}
        </div>
    );
}

function Controls({ rewindToHistoryByIndex, restartBoardFunction, historyLength }) {

    /* History Controls UI */
    const historyButtons = []
    for (let index = 0; index < historyLength; index++) {
        historyButtons.push(
            <button className="history-btn" onClick={() => rewindToHistoryByIndex(index)} key={index}>
                {index + 1}
            </button>
        );
    }
    const historyControl = <div id="history-control">
        <label>History</label>
        {historyButtons}
    </div>

    /* Restart Button UI*/
    const restartButton = <button id="restart-control" onClick={restartBoardFunction}>Restart</button>

    return(
        <section id="controls">
            {historyControl}
            {restartButton}
        </section>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <Game />
    </React.StrictMode>,
    document.getElementById('root')
);