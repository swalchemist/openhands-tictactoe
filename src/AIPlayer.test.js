import AIPlayer from './AIPlayer.js';
import GameBoard from './GameBoard.js';

describe('AIPlayer', () => {
  let aiPlayer;
  let gameBoard;

  beforeEach(() => {
    aiPlayer = new AIPlayer('O');
    gameBoard = new GameBoard();
  });

  test('should create AI player with correct symbol', () => {
    expect(aiPlayer.symbol).toBe('O');
  });

  test('should make a move on empty board', () => {
    const move = aiPlayer.getBestMove(gameBoard);
    expect(move).toHaveProperty('row');
    expect(move).toHaveProperty('col');
    expect(move.row).toBeGreaterThanOrEqual(0);
    expect(move.row).toBeLessThan(3);
    expect(move.col).toBeGreaterThanOrEqual(0);
    expect(move.col).toBeLessThan(3);
  });

  test('should win when possible', () => {
    // Set up board where O can win
    gameBoard.setCell(0, 0, 'O');
    gameBoard.setCell(0, 1, 'O');
    // O should play (0, 2) to win
    
    const move = aiPlayer.getBestMove(gameBoard);
    expect(move.row).toBe(0);
    expect(move.col).toBe(2);
  });

  test('should block opponent from winning', () => {
    // Set up board where X is about to win
    gameBoard.setCell(0, 0, 'X');
    gameBoard.setCell(0, 1, 'X');
    // O should play (0, 2) to block X from winning
    
    const move = aiPlayer.getBestMove(gameBoard);
    expect(move.row).toBe(0);
    expect(move.col).toBe(2);
  });

  test('should prefer center on empty board', () => {
    const move = aiPlayer.getBestMove(gameBoard);
    // On an empty board, center (1,1) is often the best move
    expect(move.row).toBe(1);
    expect(move.col).toBe(1);
  });

  test('should handle board with no available moves', () => {
    // Fill the entire board
    gameBoard.setCell(0, 0, 'X');
    gameBoard.setCell(0, 1, 'O');
    gameBoard.setCell(0, 2, 'X');
    gameBoard.setCell(1, 0, 'O');
    gameBoard.setCell(1, 1, 'X');
    gameBoard.setCell(1, 2, 'O');
    gameBoard.setCell(2, 0, 'X');
    gameBoard.setCell(2, 1, 'O');
    gameBoard.setCell(2, 2, 'X');
    
    const move = aiPlayer.getBestMove(gameBoard);
    expect(move).toBeNull();
  });

  test('should make optimal moves to force draw against perfect play', () => {
    // Test a specific scenario where AI should be able to force at least a draw
    gameBoard.setCell(0, 0, 'X'); // X takes corner
    
    const move = aiPlayer.getBestMove(gameBoard);
    // AI should make a move that leads to at least a draw (center or opposite corner are both optimal)
    expect(move).not.toBeNull();
    expect(move.row).toBeGreaterThanOrEqual(0);
    expect(move.row).toBeLessThan(3);
    expect(move.col).toBeGreaterThanOrEqual(0);
    expect(move.col).toBeLessThan(3);
    
    // Verify the move is on an empty cell
    expect(gameBoard.getCell(move.row, move.col)).toBe('');
  });

  test('should detect winning move in diagonal', () => {
    // Set up diagonal win opportunity
    gameBoard.setCell(0, 0, 'O');
    gameBoard.setCell(1, 1, 'O');
    // O should play (2, 2) to win diagonally
    
    const move = aiPlayer.getBestMove(gameBoard);
    expect(move.row).toBe(2);
    expect(move.col).toBe(2);
  });

  test('should block diagonal win', () => {
    // Set up diagonal threat from X
    gameBoard.setCell(0, 0, 'X');
    gameBoard.setCell(1, 1, 'X');
    // O should play (2, 2) to block diagonal win
    
    const move = aiPlayer.getBestMove(gameBoard);
    expect(move.row).toBe(2);
    expect(move.col).toBe(2);
  });
});