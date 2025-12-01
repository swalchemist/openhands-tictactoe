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
}

export default GameBoard;