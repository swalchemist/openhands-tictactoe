class GameBoard {
  static BOARD_SIZE = 3;
  static EMPTY_CELL = '';

  constructor() {
    // Initialize a 3x3 grid with empty strings
    this.board = Array(GameBoard.BOARD_SIZE).fill(null)
      .map(() => Array(GameBoard.BOARD_SIZE).fill(GameBoard.EMPTY_CELL));
  }

  getCell(row, col) {
    this._validatePosition(row, col);
    return this.board[row][col];
  }

  setCell(row, col, value) {
    this._validatePosition(row, col);
    this.board[row][col] = value;
  }

  _validatePosition(row, col) {
    if (row < 0 || row >= GameBoard.BOARD_SIZE || col < 0 || col >= GameBoard.BOARD_SIZE) {
      throw new Error(`Invalid position: (${row}, ${col}). Must be between 0 and ${GameBoard.BOARD_SIZE - 1}.`);
    }
  }

  checkWinner() {
    return this._checkHorizontalWins() || 
           this._checkVerticalWins() || 
           this._checkDiagonalWins() || 
           null;
  }

  _checkHorizontalWins() {
    for (let row = 0; row < GameBoard.BOARD_SIZE; row++) {
      const winner = this._checkThreeInLine(
        this.board[row][0], 
        this.board[row][1], 
        this.board[row][2]
      );
      if (winner) return winner;
    }
    return null;
  }

  _checkVerticalWins() {
    for (let col = 0; col < GameBoard.BOARD_SIZE; col++) {
      const winner = this._checkThreeInLine(
        this.board[0][col], 
        this.board[1][col], 
        this.board[2][col]
      );
      if (winner) return winner;
    }
    return null;
  }

  _checkDiagonalWins() {
    // Check main diagonal (top-left to bottom-right)
    const mainDiagonal = this._checkThreeInLine(
      this.board[0][0], 
      this.board[1][1], 
      this.board[2][2]
    );
    if (mainDiagonal) return mainDiagonal;

    // Check anti-diagonal (top-right to bottom-left)
    const antiDiagonal = this._checkThreeInLine(
      this.board[0][2], 
      this.board[1][1], 
      this.board[2][0]
    );
    return antiDiagonal;
  }

  _checkThreeInLine(cell1, cell2, cell3) {
    if (cell1 !== GameBoard.EMPTY_CELL && cell1 === cell2 && cell2 === cell3) {
      return cell1;
    }
    return null;
  }
}

export default GameBoard;