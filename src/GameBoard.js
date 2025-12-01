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
}

export default GameBoard;