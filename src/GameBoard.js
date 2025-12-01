class GameBoard {
  constructor() {
    // Initialize a 3x3 grid with empty strings
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
  }

  getCell(row, col) {
    return this.board[row][col];
  }

  setCell(row, col, value) {
    this.board[row][col] = value;
  }

  checkWinner() {
    // Check horizontal wins
    for (let row = 0; row < 3; row++) {
      if (this.board[row][0] !== '' && 
          this.board[row][0] === this.board[row][1] && 
          this.board[row][1] === this.board[row][2]) {
        return this.board[row][0];
      }
    }

    // Check vertical wins
    for (let col = 0; col < 3; col++) {
      if (this.board[0][col] !== '' && 
          this.board[0][col] === this.board[1][col] && 
          this.board[1][col] === this.board[2][col]) {
        return this.board[0][col];
      }
    }

    // Check diagonal wins (top-left to bottom-right)
    if (this.board[0][0] !== '' && 
        this.board[0][0] === this.board[1][1] && 
        this.board[1][1] === this.board[2][2]) {
      return this.board[0][0];
    }

    // Check diagonal wins (top-right to bottom-left)
    if (this.board[0][2] !== '' && 
        this.board[0][2] === this.board[1][1] && 
        this.board[1][1] === this.board[2][0]) {
      return this.board[0][2];
    }

    // No winner found
    return null;
  }
}

export default GameBoard;