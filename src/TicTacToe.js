import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import AIPlayer from './AIPlayer';
import LLMAIPlayer from './LLMAIPlayer';
import './TicTacToe.css';

const TicTacToe = () => {
  const [gameBoard, setGameBoard] = useState(() => new GameBoard());
  const [aiPlayer] = useState(() => new AIPlayer('O'));
  const [llmAIPlayer] = useState(() => new LLMAIPlayer());
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [useLLM, setUseLLM] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [difficulty, setDifficulty] = useState('normal');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [, forceUpdate] = useState({});

  // Force component re-render when game state changes
  const updateGame = () => {
    forceUpdate({});
  };

  // AI move logic with delay
  const makeAIMove = async () => {
    if (!isAIEnabled || gameBoard.getGameStatus() !== 'playing' || gameBoard.getCurrentPlayer() !== 'O') {
      return;
    }

    setIsAIThinking(true);
    
    try {
      let move;
      
      if (useLLM && apiKey) {
        // Use LLM AI player
        llmAIPlayer.setApiKey(apiKey);
        llmAIPlayer.setDifficulty(difficulty);
        move = await llmAIPlayer.getMove(gameBoard.getBoard());
      } else {
        // Use traditional minimax AI player
        await new Promise(resolve => setTimeout(resolve, 500)); // Add delay for consistency
        move = aiPlayer.getBestMove(gameBoard);
      }
      
      if (move) {
        try {
          gameBoard.makeMove(move.row, move.col);
          updateGame();
        } catch (error) {
          console.log('AI move error:', error.message);
        }
      }
    } catch (error) {
      console.log('AI move failed:', error.message);
    } finally {
      setIsAIThinking(false);
    }
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
      return useLLM && apiKey ? '🧠 LLM AI is thinking...' : '🤖 AI is thinking...';
    }

    switch (status) {
      case 'playing':
        if (isAIEnabled && currentPlayer === 'O') {
          return useLLM && apiKey ? 'LLM AI\'s turn (O)' : 'AI\'s turn (O)';
        } else if (isAIEnabled && currentPlayer === 'X') {
          return 'Your turn (X)';
        } else {
          return `Current player: ${currentPlayer}`;
        }
      case 'won':
        if (isAIEnabled) {
          const aiType = useLLM && apiKey ? '🧠 LLM AI' : '🤖 AI';
          return winner === 'X' ? '🎉 You win!' : `${aiType} wins!`;
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
        
        {isAIEnabled && (
          <div className="ai-settings">
            <div className="ai-type-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={useLLM}
                  onChange={(e) => setUseLLM(e.target.checked)}
                />
                🧠 Use LLM AI (more creative)
              </label>
            </div>
            
            {useLLM && (
              <div className="llm-settings">
                <div className="api-key-input">
                  <input
                    type="password"
                    placeholder="Enter OpenAI API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="api-key-field"
                  />
                </div>
                
                <div className="difficulty-selector">
                  <label>Difficulty: </label>
                  <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="difficulty-select"
                  >
                    <option value="easy">Easy</option>
                    <option value="normal">Normal</option>
                    <option value="hard">Hard</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
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