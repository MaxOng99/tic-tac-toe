import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/Board';

import './css/index.css';

function Status() {
    return(
        <p id="game-status">Player X's turn</p>
    );
}

function Controls() {

    const cells = Array.from({length: 1}, (_, id) => (<button class="history-btn" key={id}>1</button>));
    return(
        <section id="controls">   
            <div id="history-control">
                <label>History</label>
                {cells}
            </div>
            <button id="restart-control">Restart</button>
        </section>
    );

    /* 
        1. History buttons
        2. Restart button
    */
}


ReactDOM.render(
    <React.StrictMode>
        <Status />
        <Board />
        <Controls />
    </React.StrictMode>,
    document.getElementById('root')
);