import React from 'react';
import './App.css';
import Player from './Player.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { 
      turn: 'O',
      board: [[null, null, null],[null, null, null],[null, null, null]],
      winner: null,
      playerX: new Player("X"),
      playerO: new Player("O")
    };
  }

  render() {
    return (
      <span>
        <div>
          <button onClick={this.togglePlayerRunning.bind(this, "X")}>Turn {this.inversePlayerRoleState("X")} X</button>
          <button onClick={this.togglePlayerLearning.bind(this, "X")}>Turn {this.inversePlayerLearningState("X")} learning for X</button>
          <span>{this.percentOfBoardsTried(this.state.playerX)}% learned</span>
        </div>
        <div>
          <button onClick={this.togglePlayerRunning.bind(this, "O")}>Turn {this.inversePlayerRoleState("O")} O</button>
          <button onClick={this.togglePlayerLearning.bind(this, "O")}>Turn {this.inversePlayerLearningState("O")} learning for O</button>
          <span>{this.percentOfBoardsTried(this.state.playerO)}% learned</span>
        </div>
        {this.state.winner}
        <div className="Grid">
          <div className="Cell" onClick={this.choose.bind(this, 0, 0)}>{this.displaySquare(0, 0)}</div>
          <div className="Cell" onClick={this.choose.bind(this, 0, 1)}>{this.displaySquare(0, 1)}</div>
          <div className="Cell" onClick={this.choose.bind(this, 0, 2)}>{this.displaySquare(0, 2)}</div>
          <div className="Cell" onClick={this.choose.bind(this, 1, 0)}>{this.displaySquare(1, 0)}</div>
          <div className="Cell" onClick={this.choose.bind(this, 1, 1)}>{this.displaySquare(1, 1)}</div>
          <div className="Cell" onClick={this.choose.bind(this, 1, 2)}>{this.displaySquare(1, 2)}</div>
          <div className="Cell" onClick={this.choose.bind(this, 2, 0)}>{this.displaySquare(2, 0)}</div>
          <div className="Cell" onClick={this.choose.bind(this, 2, 1)}>{this.displaySquare(2, 1)}</div>
          <div className="Cell" onClick={this.choose.bind(this, 2, 2)}>{this.displaySquare(2, 2)}</div>
        </div>
      </span>
    );
  }

  percentOfBoardsTried(player) {
    //255168
    return (Object.keys(player.memory).length/63792) * 100
  }

  togglePlayerLearning(symbol) {
    if (symbol === "X") {
      let playerX = this.clonePlayer(symbol)
      playerX.learning = !playerX.learning
      this.setState({playerX})
    }
    else {
      let playerO = this.clonePlayer(symbol)
      playerO.learning = !playerO.learning
      this.setState({playerO})
    }
  }

  togglePlayerRunning(symbol) {
    if (symbol === "X") {
      let playerX = this.clonePlayer(symbol) 
      playerX.runningState = this.inversePlayerRoleState(symbol);
      this.setState({playerX});
    }
    else {
      let playerO = this.clonePlayer(symbol) 
      playerO.runningState = this.inversePlayerRoleState(symbol);
      this.setState({playerO});
    }
  }

  clonePlayer(symbol) {
    return Object.assign(Object.create(Object.getPrototypeOf(this.state[`player${symbol}`])), this.state[`player${symbol}`]);
  }

  inversePlayerRoleState(symbol) {
    return this.state[`player${symbol}`].runningState === "off" ? "on" : "off"
  }

  inversePlayerLearningState(symbol) {
    return this.state[`player${symbol}`].learning === true ? "off" : "on"
  }

  inverseSymbol(symbol) {
    return symbol === "X" ? "O" : "X"
  }

  displaySquare(x, y) {
    if (this.state.board[x][y])
      return this.state.board[x][y];
  }

  componentDidMount

  componentDidUpdate(prevProps, prevState) {
    // set timeout to avoid race condition in which maximum stack size is exceeded
    setTimeout(()=> {
      if (this.state[`player${this.state.turn}`].runningState === "on") {
        let choice = this.state[`player${this.state.turn}`].choice(this.state.board);
        this.state[`player${this.state.turn}`].updateMemory("alive");
        this.state[`player${this.inverseSymbol(this.state.turn)}`].updateMemory("alive");
        this.choose(choice[0], choice[1])
      }
    }, 1)
  }

  choose(x, y) {
    if (this.state.board[x][y] !== null)
      return;

    var board = this.state.board
    board[x][y] = this.state.turn
    
    if (this.isWinner(board)) {
      this.state.playerX.updateMemory(this.state.turn === this.state.playerX.role ? "win" : "lose");
      this.state.playerO.updateMemory(this.state.turn === this.state.playerO.role ? "win" : "lose");
      return this.setState({ 
        winner: `${this.state.turn} Won!`, 
        board: [[null, null, null],[null, null, null],[null, null, null]]
      })
    }

    if (this.catsGame(board)) {
      this.state.playerX.updateMemory("tie");
      this.state.playerO.updateMemory("tie");
      return this.setState({
        winner: "Cats Game",
        board: [[null, null, null],[null, null, null],[null, null, null]]
      })
    }
        
    this.setState({
      turn: this.state.turn === "X" ? "O" : "X",
      board: board
    });
  }

  isWinner(board) {
    return (board[0][0] !== null && board[0][0] === board[0][1] && board[0][0] === board[0][2]) || // top row
      (board[1][0] !== null && board[1][0] === board[1][1] && board[1][0] === board[1][2]) || // middle row
      (board[2][0] !== null && board[2][0] === board[2][1] && board[2][0] === board[2][2]) || // bottom row
      (board[0][0] !== null && board[0][0] === board[1][0] && board[0][0] === board[2][0]) || // left column
      (board[0][1] !== null && board[0][1] === board[1][1] && board[0][1] === board[2][1]) || // middle column
      (board[0][2] !== null && board[0][2] === board[1][2] && board[0][2] === board[2][2]) || // right column
      (board[0][0] !== null && board[0][0] === board[1][1] && board[0][0] === board[2][2]) || //diagonal from left
      (board[0][2] !== null && board[0][2] === board[1][1] && board[0][2] === board[2][0]) // diagonal from right
  }

  catsGame(board) {
    return board[0][0] !== null && board[0][1] !== null && board[0][2] !== null &&
      board[1][0] !== null && board[1][1] !== null && board[1][2] !== null &&
      board[2][0] !== null && board[2][1] !== null && board[2][2] !== null
  }
}

