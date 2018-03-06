export default class Player {
  constructor(role) {
    this.role = role;
    this.game = 1;
    this.runningState = "off";
    this.learning = true
    this.memory = {};
  }

  choice(board) {
    let availablePositions = [];
    
    [0,1,2].forEach((i) => {
      [0,1,2].forEach((j) => {
        if (board[i][j] === null) {
          availablePositions.push([i,j])
        }
      });
    });
    
    if (Math.random() >= 0.5 || !this.learning) {
      var choice = this.bestChoice(availablePositions.map(arr => arr.join("")), this.findRotationOfBoard(board));
    }
    else {
      var choice = availablePositions[Math.floor(Math.random()*availablePositions.length)].join("");
    }
    this.lastChoice = choice;
    this.lastBoard = board.slice(0);
    
    return choice;
  }

  boardToString(board) {
    return board.concat.apply([], board).reduce((str, i) => str + (i === null ? "-" : i), "");
  }

  updateMemory(result) {
    if (!this.lastBoard && !this.lastChoice)
      return;
    
    this.lastBoard = this.findRotationOfBoard(this.lastBoard)
    let stringifiedBoard = this.boardToString(this.lastBoard)
      
    if (!this.memory[stringifiedBoard]) {
      this.memory[stringifiedBoard] = {
        "00": 0, "01": 0, "02": 0,
        "10": 0, "11": 0, "12": 0,
        "20": 0, "21": 0, "22": 0
      };
    }

    let boardOdds = this.memory[stringifiedBoard];
    
    if (boardOdds) {
      if (result === "alive") {
        this.memory[stringifiedBoard][this.lastChoice] += 1
      }
      else if (result === "lose") {
        this.memory[stringifiedBoard][this.lastChoice] -= 10
      }
      else if (result === "won") {
        this.memory[stringifiedBoard][this.lastChoice] += 10
      }
      else if (result === "tie") {
        this.memory[stringifiedBoard][this.lastChoice] += 5
      }
    }
  }

  bestChoice(availablePositions, board) {
    let boardOdds = this.memory[this.boardToString(board)];
    if (boardOdds && availablePositions.filter(pos => boardOdds[pos] > 0).length > 0) {
      return availablePositions.sort(pos => boardOdds[pos])[0]
    }
    else {
      return availablePositions[Math.floor(Math.random() * Math.floor(availablePositions.length))];
    }
  }

  findRotationOfBoard(board) {
    if (this.memory[this.boardToString(board)])
      return board;

    for (var i in [1,2,3]) {
      board = this.rotate(board)
      if (this.memory[this.boardToString(board)])
        return board;
    }
    return this.rotate(board);
  }

  rotate(board) {
    let newBoard = [[null,null,null],[null,null,null],[null,null,null]];
    for (var i = 0; i < 3; ++i) {
        for (var j = 0; j < 3; ++j) {
            newBoard[i][j] = board[3 - j - 1][i];
        }
    }

    return newBoard;
  }
}
