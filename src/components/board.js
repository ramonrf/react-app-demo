import React from 'react';
import Square from './square';

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let rows = [];
        for (let i = 0; i < 3; ++i) {
            let cells = [];
            for (let j = 0; j < 3; ++j) {
                cells.push(this.renderSquare(3 * i + j));
            }
            rows.push(
                <div key={i} className="board-row">{cells}</div>
            );
        }
        return (
            <div>{rows}</div>
        );
    }
}

export default Board;