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
});