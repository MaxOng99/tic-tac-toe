import React from "react";
import '../css/board.css';

function Board() {
    const cells = Array.from({length: 9}, (_, id) => (<button key={id}>X</button>));
    
    return(
        <div id="board-container">
            {cells}
        </div>
    );
}

export default Board;