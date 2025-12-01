import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import AIPlayer from './AIPlayer';
import './TicTacToe.css';

const TicTacToe = () => {
  const [gameBoard, setGameBoard] = useState(() => new GameBoard());
  const [aiPlayer] = useState(() => new AIPlayer('O'));
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [, forceUpdate] = useState({});

  // Force component re-render when game state changes
  const updateGame = () => {
    forceUpdate({});
  };

  // AI move logic with delay
  const makeAIMove = () => {
    if (!isAIEnabled || gameBoard.getGameStatus() !== 'playing' || gameBoard.getCurrentPlayer() !== 'O') {
      return;
    }

    setIsAIThinking(true);
    
    // Add a delay to make AI moves feel more natural
    setTimeout(() => {
      const move = aiPlayer.getBestMove(gameBoard);
      if (move) {
        try {
          gameBoard.makeMove(move.row, move.col);
          updateGame();
        } catch (error) {
          console.log('AI move error:', error.message);
        }
      }
      setIsAIThinking(false);
    }, 500); // 500ms delay
  };

  // Handle human player moves
  const handleCellClick = (row, col) => {
    // Don't allow moves if AI is thinking or if it's not human's turn
    if (isAIThinking || (isAIEnabled && gameBoard.getCurrentPlayer() === 'O')) {
      return;
    }

    try {
      gameBoard.makeMove(row, col);
      updateGame();
    } catch (error) {
      // Could show error message to user, for now just ignore invalid moves
      console.log(error.message);
    }
  };

  // Trigger AI moves when it's AI's turn
  useEffect(() => {
    if (isAIEnabled && gameBoard.getCurrentPlayer() === 'O' && gameBoard.getGameStatus() === 'playing') {
      makeAIMove();
    }
  }, [gameBoard.getCurrentPlayer(), gameBoard.getGameStatus(), isAIEnabled]);

  const handleReset = () => {
    setIsAIThinking(false);
    gameBoard.reset();
    updateGame();
  };

  const toggleAI = () => {
    setIsAIEnabled(!isAIEnabled);
    setIsAIThinking(false);
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

    if (isAIThinking) {
      return '🤖 AI is thinking...';
    }

    switch (status) {
      case 'playing':
        if (isAIEnabled && currentPlayer === 'O') {
          return 'AI\'s turn (O)';
        } else if (isAIEnabled && currentPlayer === 'X') {
          return 'Your turn (X)';
        } else {
          return `Current player: ${currentPlayer}`;
        }
      case 'won':
        if (isAIEnabled) {
          return winner === 'X' ? '🎉 You win!' : '🤖 AI wins!';
        } else {
          return `🎉 Winner: ${winner}!`;
        }
      case 'draw':
        return `🤝 It's a draw!`;
      default:
        return '';
    }
  };

  return (
    <div className="tic-tac-toe">
      <h1>Tic-Tac-Toe</h1>
      <div className="game-controls">
        <button 
          className={`ai-toggle ${isAIEnabled ? 'enabled' : 'disabled'}`}
          onClick={toggleAI}
        >
          {isAIEnabled ? '🤖 AI: ON' : '👥 AI: OFF'}
        </button>
      </div>
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