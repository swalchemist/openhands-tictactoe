class GameBoard {
  static BOARD_SIZE = 3;
  static EMPTY_CELL = '';
  static PLAYER_X = 'X';
  static PLAYER_O = 'O';
  static STATUS_PLAYING = 'playing';
  static STATUS_WON = 'won';
  static STATUS_DRAW = 'draw';

  constructor() {
    // Initialize a 3x3 grid with empty strings
    this.board = Array(GameBoard.BOARD_SIZE).fill(null)
      .map(() => Array(GameBoard.BOARD_SIZE).fill(GameBoard.EMPTY_CELL));
    
    // Game state
    this.currentPlayer = GameBoard.PLAYER_X;
    this.gameStatus = GameBoard.STATUS_PLAYING;
    this.winner = null;
  }

  getCell(row, col) {
    this._validatePosition(row, col);
    return this.board[row][col];
  }

  setCell(row, col, value) {
    this._validatePosition(row, col);
    this.board[row][col] = value;
  }

  getBoard() {
    // Return a copy of the board to prevent external modification
    return this.board.map(row => [...row]);
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

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getGameStatus() {
    return this.gameStatus;
  }

  getWinner() {
    return this.winner;
  }

  makeMove(row, col) {
    // Validate game state
    if (this.gameStatus !== GameBoard.STATUS_PLAYING) {
      const message = this.winner 
        ? `Game is over. Winner: ${this.winner}`
        : 'Game is over. It\'s a draw.';
      throw new Error(message);
    }

    // Validate position
    this._validatePosition(row, col);

    // Check if cell is occupied
    if (this.board[row][col] !== GameBoard.EMPTY_CELL) {
      throw new Error(`Cell (${row}, ${col}) is already occupied.`);
    }

    // Make the move
    this.board[row][col] = this.currentPlayer;

    // Update game state
    this._updateGameState();

    // Switch player if game is still playing
    if (this.gameStatus === GameBoard.STATUS_PLAYING) {
      this.currentPlayer = this.currentPlayer === GameBoard.PLAYER_X 
        ? GameBoard.PLAYER_O 
        : GameBoard.PLAYER_X;
    }
  }

  _updateGameState() {
    // Check for winner
    const winner = this.checkWinner();
    if (winner) {
      this.gameStatus = GameBoard.STATUS_WON;
      this.winner = winner;
      return;
    }

    // Check for draw (board full)
    if (this._isBoardFull()) {
      this.gameStatus = GameBoard.STATUS_DRAW;
      return;
    }

    // Game continues
    this.gameStatus = GameBoard.STATUS_PLAYING;
  }

  _isBoardFull() {
    for (let row = 0; row < GameBoard.BOARD_SIZE; row++) {
      for (let col = 0; col < GameBoard.BOARD_SIZE; col++) {
        if (this.board[row][col] === GameBoard.EMPTY_CELL) {
          return false;
        }
      }
    }
    return true;
  }

  reset() {
    // Reset board
    this.board = Array(GameBoard.BOARD_SIZE).fill(null)
      .map(() => Array(GameBoard.BOARD_SIZE).fill(GameBoard.EMPTY_CELL));
    
    // Reset game state
    this.currentPlayer = GameBoard.PLAYER_X;
    this.gameStatus = GameBoard.STATUS_PLAYING;
    this.winner = null;
  }
}

export default GameBoard;