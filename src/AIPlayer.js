class AIPlayer {
  constructor(symbol) {
    this.symbol = symbol;
    this.opponent = symbol === 'X' ? 'O' : 'X';
  }

  /**
   * Get the best move for the AI player using minimax algorithm
   * @param {GameBoard} gameBoard - The current game board
   * @returns {Object|null} - {row, col} of best move, or null if no moves available
   */
  getBestMove(gameBoard) {
    const availableMoves = this.getAvailableMoves(gameBoard);
    
    if (availableMoves.length === 0) {
      return null;
    }

    // If it's the first move and board is empty, take center
    if (availableMoves.length === 9) {
      return { row: 1, col: 1 };
    }

    let bestMove = null;
    let bestScore = -Infinity;

    for (const move of availableMoves) {
      // Make the move
      gameBoard.setCell(move.row, move.col, this.symbol);
      
      // Calculate score using minimax
      const score = this.minimax(gameBoard, 0, false);
      
      // Undo the move
      gameBoard.setCell(move.row, move.col, '');
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  /**
   * Minimax algorithm implementation
   * @param {GameBoard} gameBoard - Current game board
   * @param {number} depth - Current depth in the game tree
   * @param {boolean} isMaximizing - Whether this is a maximizing or minimizing turn
   * @returns {number} - Score of the position
   */
  minimax(gameBoard, depth, isMaximizing) {
    const winner = gameBoard.checkWinner();
    
    // Terminal states
    if (winner === this.symbol) {
      return 10 - depth; // Prefer winning sooner
    }
    if (winner === this.opponent) {
      return depth - 10; // Prefer losing later
    }
    if (gameBoard.getGameStatus() === 'draw') {
      return 0;
    }

    const availableMoves = this.getAvailableMoves(gameBoard);
    
    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const move of availableMoves) {
        gameBoard.setCell(move.row, move.col, this.symbol);
        const score = this.minimax(gameBoard, depth + 1, false);
        gameBoard.setCell(move.row, move.col, '');
        maxScore = Math.max(score, maxScore);
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const move of availableMoves) {
        gameBoard.setCell(move.row, move.col, this.opponent);
        const score = this.minimax(gameBoard, depth + 1, true);
        gameBoard.setCell(move.row, move.col, '');
        minScore = Math.min(score, minScore);
      }
      return minScore;
    }
  }

  /**
   * Get all available moves on the board
   * @param {GameBoard} gameBoard - The game board
   * @returns {Array} - Array of {row, col} objects representing available moves
   */
  getAvailableMoves(gameBoard) {
    const moves = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (gameBoard.getCell(row, col) === '') {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  }
}

export default AIPlayer;