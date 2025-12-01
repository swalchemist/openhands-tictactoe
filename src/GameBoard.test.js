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
});