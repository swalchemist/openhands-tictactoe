import React, { useState } from 'react';
import GameBoard from './GameBoard';
import './TicTacToe.css';

const TicTacToe = () => {
  const [gameBoard, setGameBoard] = useState(() => new GameBoard());
  const [, forceUpdate] = useState({});

  // Force component re-render when game state changes
  const updateGame = () => {
    forceUpdate({});
  };

  const handleCellClick = (row, col) => {
    try {
      gameBoard.makeMove(row, col);
      updateGame();
    } catch (error) {
      // Could show error message to user, for now just ignore invalid moves
      console.log(error.message);
    }
  };

  const handleReset = () => {
    gameBoard.reset();
    updateGame();
  };

  const renderCell = (row, col) => {
    const cellValue = gameBoard.getCell(row, col);
    const isClickable = gameBoard.getGameStatus() === 'playing' && cellValue === '';
    
    return (
      <button
        key={`${row}-${col}`}
        className={`cell ${isClickable ? 'clickable' : ''}`}
        onClick={() => handleCellClick(row, col)}
        disabled={!isClickable}
      >
        {cellValue}
      </button>
    );
  };

  const renderBoard = () => {
    const rows = [];
    for (let row = 0; row < 3; row++) {
      const cells = [];
      for (let col = 0; col < 3; col++) {
        cells.push(renderCell(row, col));
      }
      rows.push(
        <div key={row} className="board-row">
          {cells}
        </div>
      );
    }
    return rows;
  };

  const getStatusMessage = () => {
    const status = gameBoard.getGameStatus();
    const currentPlayer = gameBoard.getCurrentPlayer();
    const winner = gameBoard.getWinner();

    switch (status) {
      case 'playing':
        return `Current player: ${currentPlayer}`;
      case 'won':
        return `🎉 Winner: ${winner}!`;
      case 'draw':
        return `🤝 It's a draw!`;
      default:
        return '';
    }
  };

  return (
    <div className="tic-tac-toe">
      <h1>Tic-Tac-Toe</h1>
      <div className="game-status">
        {getStatusMessage()}
      </div>
      <div className="game-board">
        {renderBoard()}
      </div>
      <button className="reset-button" onClick={handleReset}>
        New Game
      </button>
    </div>
  );
};

export default TicTacToe;