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
});