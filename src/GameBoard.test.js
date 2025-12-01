import GameBoard from './GameBoard';

describe('GameBoard', () => {
  test('should construct a game board and verify bottom right cell is empty', () => {
    // Arrange
    const gameBoard = new GameBoard();
    
    // Act
    const bottomRightCell = gameBoard.getCell(2, 2);
    
    // Assert
    expect(bottomRightCell).toBe('');
  });

  test('should set a game board location to X or O', () => {
    // Arrange
    const gameBoard = new GameBoard();
    
    // Act
    gameBoard.setCell(1, 1, 'X');
    gameBoard.setCell(0, 2, 'O');
    
    // Assert
    expect(gameBoard.getCell(1, 1)).toBe('X');
    expect(gameBoard.getCell(0, 2)).toBe('O');
  });

  test('should return a copy of the board state', () => {
    // Arrange
    const gameBoard = new GameBoard();
    gameBoard.setCell(0, 0, 'X');
    gameBoard.setCell(1, 1, 'O');
    
    // Act
    const board = gameBoard.getBoard();
    
    // Assert
    expect(board).toEqual([
      ['X', '', ''],
      ['', 'O', ''],
      ['', '', '']
    ]);
    
    // Verify it's a copy (modifying returned board shouldn't affect original)
    board[0][0] = 'MODIFIED';
    expect(gameBoard.getCell(0, 0)).toBe('X');
  });

  test('should detect when X wins horizontally', () => {
    // Arrange
    const gameBoard = new GameBoard();
    
    // Act - X wins in top row
    gameBoard.setCell(0, 0, 'X');
    gameBoard.setCell(0, 1, 'X');
    gameBoard.setCell(0, 2, 'X');
    
    // Assert
    expect(gameBoard.checkWinner()).toBe('X');
  });

  test('should detect when O wins vertically', () => {
    // Arrange
    const gameBoard = new GameBoard();
    
    // Act - O wins in first column
    gameBoard.setCell(0, 0, 'O');
    gameBoard.setCell(1, 0, 'O');
    gameBoard.setCell(2, 0, 'O');
    
    // Assert
    expect(gameBoard.checkWinner()).toBe('O');
  });

  test('should detect when X wins diagonally', () => {
    // Arrange
    const gameBoard = new GameBoard();
    
    // Act - X wins on main diagonal
    gameBoard.setCell(0, 0, 'X');
    gameBoard.setCell(1, 1, 'X');
    gameBoard.setCell(2, 2, 'X');
    
    // Assert
    expect(gameBoard.checkWinner()).toBe('X');
  });

  test('should return null when no winner exists', () => {
    // Arrange
    const gameBoard = new GameBoard();
    
    // Act - Set some moves but no winner
    gameBoard.setCell(0, 0, 'X');
    gameBoard.setCell(0, 1, 'O');
    gameBoard.setCell(1, 0, 'X');
    
    // Assert
    expect(gameBoard.checkWinner()).toBe(null);
  });

  test('should throw error for invalid positions', () => {
    // Arrange
    const gameBoard = new GameBoard();
    
    // Assert - Test various invalid positions
    expect(() => gameBoard.getCell(-1, 0)).toThrow('Invalid position: (-1, 0). Must be between 0 and 2.');
    expect(() => gameBoard.getCell(0, -1)).toThrow('Invalid position: (0, -1). Must be between 0 and 2.');
    expect(() => gameBoard.getCell(3, 0)).toThrow('Invalid position: (3, 0). Must be between 0 and 2.');
    expect(() => gameBoard.getCell(0, 3)).toThrow('Invalid position: (0, 3). Must be between 0 and 2.');
    expect(() => gameBoard.setCell(-1, 0, 'X')).toThrow('Invalid position: (-1, 0). Must be between 0 and 2.');
    expect(() => gameBoard.setCell(0, 3, 'O')).toThrow('Invalid position: (0, 3). Must be between 0 and 2.');
  });

  test('should track current player starting with X', () => {
    // Arrange
    const gameBoard = new GameBoard();
    
    // Assert
    expect(gameBoard.getCurrentPlayer()).toBe('X');
  });

  test('should alternate players after each move', () => {
    // Arrange
    const gameBoard = new GameBoard();
    
    // Act & Assert
    expect(gameBoard.getCurrentPlayer()).toBe('X');
    gameBoard.makeMove(0, 0);
    expect(gameBoard.getCurrentPlayer()).toBe('O');
    gameBoard.makeMove(0, 1);
    expect(gameBoard.getCurrentPlayer()).toBe('X');
  });

  test('should prevent moves on occupied cells', () => {
    // Arrange
    const gameBoard = new GameBoard();
    gameBoard.makeMove(1, 1); // X takes center
    
    // Act & Assert
    expect(() => gameBoard.makeMove(1, 1)).toThrow('Cell (1, 1) is already occupied.');
  });

  test('should detect game status as playing initially', () => {
    // Arrange
    const gameBoard = new GameBoard();
    
    // Assert
    expect(gameBoard.getGameStatus()).toBe('playing');
  });

  test('should detect game status as won when X wins', () => {
    // Arrange
    const gameBoard = new GameBoard();
    
    // Act - X wins horizontally
    gameBoard.makeMove(0, 0); // X
    gameBoard.makeMove(1, 0); // O
    gameBoard.makeMove(0, 1); // X
    gameBoard.makeMove(1, 1); // O
    gameBoard.makeMove(0, 2); // X wins
    
    // Assert
    expect(gameBoard.getGameStatus()).toBe('won');
    expect(gameBoard.getWinner()).toBe('X');
  });

  test('should detect game status as draw when board is full with no winner', () => {
    // Arrange
    const gameBoard = new GameBoard();
    
    // Act - Create a draw scenario
    gameBoard.makeMove(0, 0); // X
    gameBoard.makeMove(0, 1); // O
    gameBoard.makeMove(0, 2); // X
    gameBoard.makeMove(1, 0); // O
    gameBoard.makeMove(1, 1); // X
    gameBoard.makeMove(2, 0); // O
    gameBoard.makeMove(1, 2); // X
    gameBoard.makeMove(2, 2); // O
    gameBoard.makeMove(2, 1); // X - Board full, no winner
    
    // Assert
    expect(gameBoard.getGameStatus()).toBe('draw');
  });

  test('should prevent moves after game is won', () => {
    // Arrange
    const gameBoard = new GameBoard();
    
    // Act - X wins
    gameBoard.makeMove(0, 0); // X
    gameBoard.makeMove(1, 0); // O
    gameBoard.makeMove(0, 1); // X
    gameBoard.makeMove(1, 1); // O
    gameBoard.makeMove(0, 2); // X wins
    
    // Assert
    expect(() => gameBoard.makeMove(2, 2)).toThrow('Game is over. Winner: X');
  });

  test('should reset game to initial state', () => {
    // Arrange
    const gameBoard = new GameBoard();
    
    // Act - Play some moves and win
    gameBoard.makeMove(0, 0); // X
    gameBoard.makeMove(1, 0); // O
    gameBoard.makeMove(0, 1); // X
    gameBoard.makeMove(1, 1); // O
    gameBoard.makeMove(0, 2); // X wins
    
    // Reset the game
    gameBoard.reset();
    
    // Assert - Game should be back to initial state
    expect(gameBoard.getCurrentPlayer()).toBe('X');
    expect(gameBoard.getGameStatus()).toBe('playing');
    expect(gameBoard.getWinner()).toBe(null);
    expect(gameBoard.getCell(0, 0)).toBe('');
    expect(gameBoard.getCell(2, 2)).toBe('');
    
    // Should be able to make moves again
    gameBoard.makeMove(1, 1);
    expect(gameBoard.getCell(1, 1)).toBe('X');
    expect(gameBoard.getCurrentPlayer()).toBe('O');
  });
});