/**
 * LLM-based AI Player for Tic-Tac-Toe
 * Provides more varied and human-like gameplay compared to minimax algorithm
 */
class LLMAIPlayer {
  constructor(apiKey = null, model = 'gpt-3.5-turbo', difficulty = 'normal') {
    this.apiKey = apiKey;
    this.model = model;
    this.difficulty = difficulty;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
  }

  /**
   * Convert board state to a readable format for the LLM
   * @param {Array} board - 3x3 board array
   * @returns {string} - Human readable board representation
   */
  boardToString(board) {
    const symbols = { null: ' ', 'X': 'X', 'O': 'O' };
    let boardStr = 'Current board state:\n';
    boardStr += '   0   1   2\n';
    for (let row = 0; row < 3; row++) {
      boardStr += `${row}  ${symbols[board[row][0]]} | ${symbols[board[row][1]]} | ${symbols[board[row][2]]}\n`;
      if (row < 2) boardStr += '  ---|---|---\n';
    }
    return boardStr;
  }

  /**
   * Get available moves from the board
   * @param {Array} board - 3x3 board array
   * @returns {Array} - Array of {row, col} objects for empty cells
   */
  getAvailableMoves(board) {
    const moves = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === null) {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  }

  /**
   * Create the system prompt based on difficulty level
   * @returns {string} - System prompt for the LLM
   */
  getSystemPrompt() {
    const basePrompt = `You are playing tic-tac-toe as player O. The human player is X.

Rules:
- The board is 3x3 with positions labeled by row and column (0-2)
- You win by getting 3 O's in a row (horizontal, vertical, or diagonal)
- Block the opponent from getting 3 X's in a row
- Respond with ONLY the position in format "row,col" (e.g., "1,2")

`;

    const difficultyPrompts = {
      easy: `Play style: Make some strategic mistakes occasionally. Don't always play optimally. Sometimes miss obvious winning moves or blocks.`,
      normal: `Play style: Play strategically but not perfectly. Make good moves most of the time, but occasionally make suboptimal choices for variety.`,
      hard: `Play style: Play optimally. Always look for winning moves first, then blocking moves, then strategic positioning.`,
      creative: `Play style: Be creative and unpredictable. Make interesting moves that might not be optimal but create engaging gameplay. Add some personality to your choices.`
    };

    return basePrompt + (difficultyPrompts[this.difficulty] || difficultyPrompts.normal);
  }

  /**
   * Create the user prompt with current board state
   * @param {Array} board - 3x3 board array
   * @returns {string} - User prompt with board state
   */
  getUserPrompt(board) {
    const boardStr = this.boardToString(board);
    const availableMoves = this.getAvailableMoves(board);
    const movesStr = availableMoves.map(m => `${m.row},${m.col}`).join(', ');
    
    return `${boardStr}

Available positions: ${movesStr}

Your move (respond with only "row,col"):`;
  }

  /**
   * Parse LLM response to extract move coordinates
   * @param {string} response - LLM response text
   * @returns {Object|null} - {row, col} object or null if invalid
   */
  parseResponse(response) {
    // Clean the response and look for row,col pattern
    const cleaned = response.trim().toLowerCase();
    const match = cleaned.match(/(\d),(\d)/);
    
    if (match) {
      const row = parseInt(match[1]);
      const col = parseInt(match[2]);
      
      // Validate coordinates are within bounds
      if (row >= 0 && row <= 2 && col >= 0 && col <= 2) {
        return { row, col };
      }
    }
    
    return null;
  }

  /**
   * Make an API call to the LLM service
   * @param {Array} board - 3x3 board array
   * @returns {Promise<Object>} - Promise resolving to {row, col} move
   */
  async callLLMAPI(board) {
    if (!this.apiKey) {
      throw new Error('API key not provided for LLM service');
    }

    const messages = [
      { role: 'system', content: this.getSystemPrompt() },
      { role: 'user', content: this.getUserPrompt(board) }
    ];

    const requestBody = {
      model: this.model,
      messages: messages,
      max_tokens: 10,
      temperature: this.difficulty === 'creative' ? 0.8 : 0.3
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const llmResponse = data.choices[0].message.content;
      
      return this.parseResponse(llmResponse);
    } catch (error) {
      console.error('LLM API call failed:', error);
      throw error;
    }
  }

  /**
   * Fallback strategy when LLM fails - simple heuristic
   * @param {Array} board - 3x3 board array
   * @returns {Object} - {row, col} move
   */
  getFallbackMove(board) {
    const availableMoves = this.getAvailableMoves(board);
    
    if (availableMoves.length === 0) {
      throw new Error('No available moves');
    }

    // Simple fallback: prefer center, then corners, then edges
    const preferredOrder = [
      { row: 1, col: 1 }, // center
      { row: 0, col: 0 }, { row: 0, col: 2 }, { row: 2, col: 0 }, { row: 2, col: 2 }, // corners
      { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 2 }, { row: 2, col: 1 }  // edges
    ];

    for (const preferred of preferredOrder) {
      if (availableMoves.some(move => move.row === preferred.row && move.col === preferred.col)) {
        return preferred;
      }
    }

    // If none of the preferred moves are available, pick randomly
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  /**
   * Get the next move for the AI player
   * @param {Array} board - 3x3 board array
   * @returns {Promise<Object>} - Promise resolving to {row, col} move
   */
  async getMove(board) {
    try {
      // Try LLM first
      const move = await this.callLLMAPI(board);
      
      // Validate the move is available
      const availableMoves = this.getAvailableMoves(board);
      const isValidMove = availableMoves.some(m => m.row === move.row && m.col === move.col);
      
      if (move && isValidMove) {
        return move;
      } else {
        console.warn('LLM returned invalid move, using fallback');
        return this.getFallbackMove(board);
      }
    } catch (error) {
      console.warn('LLM failed, using fallback strategy:', error.message);
      return this.getFallbackMove(board);
    }
  }

  /**
   * Set the difficulty level
   * @param {string} difficulty - 'easy', 'normal', 'hard', or 'creative'
   */
  setDifficulty(difficulty) {
    this.difficulty = difficulty;
  }

  /**
   * Set the API key for LLM service
   * @param {string} apiKey - API key for the LLM service
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }
}

export default LLMAIPlayer;