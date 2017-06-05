import React from 'react';
import MoveLabel from './move-label';
import BoldMoveLabel from './bold-move-label';
import Board from './board';

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                moveNumber: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
            sortAsc: true,
        };
    }

    handleClick(i) {
        const history = this.state.history;
        const currentIndex = this.state.sortAsc ? history.length - 1 : 0;
        const current = history[currentIndex];
        const squares = current.squares.slice();
        const sortAsc = this.state.sortAsc;
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        let newHistoryEntry = [{
            squares: squares,
            lastMovedPosition: [Math.floor(i / 3) + 1, i % 3 + 1],
            moveNumber: history.length,
        }];
        let updatedHistory;
        if (sortAsc) {
            updatedHistory = history.concat(newHistoryEntry);
        }
        else {
            updatedHistory = newHistoryEntry.concat(history);
        }

        this.setState((prevState, props) => ({
            history: updatedHistory,
            stepNumber: history.length,
            xIsNext: !prevState.xIsNext,
            sortAsc: prevState.sortAsc,
        }));
    }

    jumpTo(step) {
        const sortAsc = this.state.sortAsc;
        const history = this.state.history;
        let newHistory;
        let stepNumber;
        if (sortAsc) {
            newHistory = history.slice(0, step + 1);
            stepNumber = newHistory[newHistory.length - 1].moveNumber;
        }
        else {
            newHistory = history.slice(step);
            stepNumber = newHistory[0].moveNumber;
        }
        this.setState({
            history: newHistory,
            stepNumber: stepNumber,
            xIsNext: (step % 2) ? false : true,
            sortAsc: sortAsc,
        });
    }

    sortMoves() {
        const history = this.state.history.slice();
        const sortAsc = this.state.sortAsc;
        if (sortAsc) {
            history.sort((a, b) => b.moveNumber - a.moveNumber);
        }
        else {
            history.sort((a, b) => a.moveNumber - b.moveNumber);
        }
        this.setState((prevState, props) => ({
            history: history,
            stepNumber: prevState.stepNumber,
            xIsNext: prevState.xIsNext,
            sortAsc: !sortAsc,
        }));
    }

    render() {
        const history = this.state.history;
        const currentIndex = this.state.sortAsc ? history.length - 1 : 0;
        const current = history[currentIndex];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const descritption = step.moveNumber ?
                'Move (' + step.lastMovedPosition + ')' :
                'Game start';

            if (step.moveNumber === this.state.stepNumber) {
                return (
                    <BoldMoveLabel key={move} move={move} descritption={descritption} onClick={(move) => this.jumpTo(move)} />
                );
            }
            else {
                return (
                    <MoveLabel key={move} move={move} descritption={descritption} onClick={(move) => this.jumpTo(move)} />
                );
            }
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div><button onClick={() => this.sortMoves()}>Sort Moves</button></div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

export default Game;