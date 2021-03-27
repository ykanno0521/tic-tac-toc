import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    // onClickプロパティにアラートを出す関数を渡す
    <button className="square"
      // onClickハンドラ内でthis.setStateを呼び出すことで、<button>がクリックされたら、常に再レンダーするようの伝えている
      onClick={props.onClick}>
      { props.value }
    </button>
  );
}



class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        // BoardからSquareに関数を渡す
        onClick={() => this.props.onClick(i)}  key={ i }
      />
    );
  }

  render() {
    return (
      <div>
        {
          Array(3).fill(0).map((row, i) => {
            console.log(i)
            return (
              <div className="board-row" key={i}>
                {
                  Array(3).fill(0).map((col, j) => {
                    console.log(j)
                          return (
                      this.renderSquare(i * 3 + j)
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      isAsc: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1 ];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        col: (i % 3) + 1,
        row: Math.floor(i / 3) + 1,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }
  
  toggleAsc() {
    this.setState({
      isAsc: !this.state.isAsc
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'move #' + move + '(' + step.col  + ',' + step.row + ')':
        'Go to game start';
      return (
        <li key={ move }>
          <button onClick={() => this.jumpTo(move)}
            className={ this.state.stepNumber === move ? 'bold' : ''}
            >
            {desc}
          </button>
        </li>
      );
    })



    let status;
    if (winner) {
      status = 'Winner:' + winner
    } else {
      status = 'Next Player:' + (this.state.xIsNext ? 'X' : '0')
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={ (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><button onClick={ () => this.toggleAsc()}>ASC⇔DESC</button></div>
          <ol>{this.state.isAsc ? moves : moves.reverse() }</ol>
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