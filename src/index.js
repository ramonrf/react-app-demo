import React from 'react';
import ReactDOM from 'react-dom';
import MoveLabel from './components/move-label';
import BoldMoveLabel from './components/bold-move-label';
import Square from './components/square';
import './index.css';

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

    this.setState({
      history: updatedHistory,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      sortAsc: this.state.sortAsc,
    });
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
    this.setState({
      history: history,
      stepNumber: this.state.stepNumber,
      xIsNext: this.state.xIsNext,
      sortAsc: !sortAsc,
    });
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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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