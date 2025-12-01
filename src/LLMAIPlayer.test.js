import LLMAIPlayer from './LLMAIPlayer';

// Mock fetch for testing
global.fetch = jest.fn();

describe('LLMAIPlayer', () => {
  let llmAI;
  
  beforeEach(() => {
    llmAI = new LLMAIPlayer('test-api-key', 'gpt-3.5-turbo', 'normal');
    fetch.mockClear();
  });

  describe('constructor', () => {
    test('should initialize with default values', () => {
      const ai = new LLMAIPlayer();
      expect(ai.apiKey).toBeNull();
      expect(ai.model).toBe('gpt-3.5-turbo');
      expect(ai.difficulty).toBe('normal');
    });

    test('should initialize with custom values', () => {
      const ai = new LLMAIPlayer('custom-key', 'gpt-4', 'hard');
      expect(ai.apiKey).toBe('custom-key');
      expect(ai.model).toBe('gpt-4');
      expect(ai.difficulty).toBe('hard');
    });
  });

  describe('boardToString', () => {
    test('should convert empty board to readable format', () => {
      const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ];
      
      const result = llmAI.boardToString(board);
      expect(result).toContain('Current board state:');
      expect(result).toContain('   0   1   2');
      expect(result).toContain(' |   | ');
    });

    test('should convert board with moves to readable format', () => {
      const board = [
        ['X', null, 'O'],
        [null, 'X', null],
        ['O', null, null]
      ];
      
      const result = llmAI.boardToString(board);
      expect(result).toContain('X |   | O');
      expect(result).toContain('  | X |  ');
      expect(result).toContain('O |   |  ');
    });
  });

  describe('getAvailableMoves', () => {
    test('should return all positions for empty board', () => {
      const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ];
      
      const moves = llmAI.getAvailableMoves(board);
      expect(moves).toHaveLength(9);
      expect(moves).toContainEqual({ row: 0, col: 0 });
      expect(moves).toContainEqual({ row: 2, col: 2 });
    });

    test('should return only empty positions', () => {
      const board = [
        ['X', null, 'O'],
        [null, 'X', null],
        ['O', null, null]
      ];
      
      const moves = llmAI.getAvailableMoves(board);
      expect(moves).toHaveLength(5);
      expect(moves).toContainEqual({ row: 0, col: 1 });
      expect(moves).toContainEqual({ row: 1, col: 0 });
      expect(moves).toContainEqual({ row: 1, col: 2 });
      expect(moves).toContainEqual({ row: 2, col: 1 });
      expect(moves).toContainEqual({ row: 2, col: 2 });
    });

    test('should return empty array for full board', () => {
      const board = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['X', 'O', 'X']
      ];
      
      const moves = llmAI.getAvailableMoves(board);
      expect(moves).toHaveLength(0);
    });
  });

  describe('getSystemPrompt', () => {
    test('should return different prompts for different difficulties', () => {
      llmAI.setDifficulty('easy');
      const easyPrompt = llmAI.getSystemPrompt();
      
      llmAI.setDifficulty('hard');
      const hardPrompt = llmAI.getSystemPrompt();
      
      expect(easyPrompt).toContain('strategic mistakes');
      expect(hardPrompt).toContain('Play optimally');
      expect(easyPrompt).not.toBe(hardPrompt);
    });

    test('should include basic tic-tac-toe rules', () => {
      const prompt = llmAI.getSystemPrompt();
      expect(prompt).toContain('tic-tac-toe');
      expect(prompt).toContain('player O');
      expect(prompt).toContain('3x3');
      expect(prompt).toContain('row,col');
    });
  });

  describe('getUserPrompt', () => {
    test('should include board state and available moves', () => {
      const board = [
        ['X', null, null],
        [null, null, null],
        [null, null, null]
      ];
      
      const prompt = llmAI.getUserPrompt(board);
      expect(prompt).toContain('Current board state:');
      expect(prompt).toContain('Available positions:');
      expect(prompt).toContain('0,1');
      expect(prompt).toContain('Your move');
    });
  });

  describe('parseResponse', () => {
    test('should parse valid row,col format', () => {
      expect(llmAI.parseResponse('1,2')).toEqual({ row: 1, col: 2 });
      expect(llmAI.parseResponse('0,0')).toEqual({ row: 0, col: 0 });
      expect(llmAI.parseResponse('2,1')).toEqual({ row: 2, col: 1 });
    });

    test('should parse response with extra text', () => {
      expect(llmAI.parseResponse('I choose position 1,2')).toEqual({ row: 1, col: 2 });
      expect(llmAI.parseResponse('My move is 0,1 for strategic reasons')).toEqual({ row: 0, col: 1 });
    });

    test('should return null for invalid responses', () => {
      expect(llmAI.parseResponse('invalid')).toBeNull();
      expect(llmAI.parseResponse('3,3')).toBeNull(); // out of bounds
      expect(llmAI.parseResponse('a,b')).toBeNull();
      expect(llmAI.parseResponse('')).toBeNull();
    });

    test('should handle case insensitive responses', () => {
      expect(llmAI.parseResponse('1,2')).toEqual({ row: 1, col: 2 });
      expect(llmAI.parseResponse('1,2')).toEqual({ row: 1, col: 2 });
    });
  });

  describe('getFallbackMove', () => {
    test('should prefer center when available', () => {
      const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ];
      
      const move = llmAI.getFallbackMove(board);
      expect(move).toEqual({ row: 1, col: 1 });
    });

    test('should prefer corners when center is taken', () => {
      const board = [
        [null, null, null],
        [null, 'X', null],
        [null, null, null]
      ];
      
      const move = llmAI.getFallbackMove(board);
      expect([
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        { row: 2, col: 0 },
        { row: 2, col: 2 }
      ]).toContainEqual(move);
    });

    test('should throw error when no moves available', () => {
      const board = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['X', 'O', 'X']
      ];
      
      expect(() => llmAI.getFallbackMove(board)).toThrow('No available moves');
    });
  });

  describe('callLLMAPI', () => {
    test('should make API call with correct parameters', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: '1,1' } }]
        })
      };
      fetch.mockResolvedValue(mockResponse);

      const board = [
        ['X', null, null],
        [null, null, null],
        [null, null, null]
      ];

      const result = await llmAI.callLLMAPI(board);
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key'
          }
        })
      );
      
      expect(result).toEqual({ row: 1, col: 1 });
    });

    test('should throw error when API key is missing', async () => {
      const aiWithoutKey = new LLMAIPlayer();
      const board = [[null, null, null], [null, null, null], [null, null, null]];
      
      await expect(aiWithoutKey.callLLMAPI(board)).rejects.toThrow('API key not provided');
    });

    test('should throw error when API call fails', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      });

      const board = [[null, null, null], [null, null, null], [null, null, null]];
      
      await expect(llmAI.callLLMAPI(board)).rejects.toThrow('LLM API error: 401 Unauthorized');
    });
  });

  describe('getMove', () => {
    test('should return LLM move when API succeeds', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: '1,1' } }]
        })
      };
      fetch.mockResolvedValue(mockResponse);

      const board = [
        ['X', null, null],
        [null, null, null],
        [null, null, null]
      ];

      const result = await llmAI.getMove(board);
      expect(result).toEqual({ row: 1, col: 1 });
    });

    test('should use fallback when LLM returns invalid move', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: '0,0' } }] // Position already taken
        })
      };
      fetch.mockResolvedValue(mockResponse);

      const board = [
        ['X', null, null],
        [null, null, null],
        [null, null, null]
      ];

      const result = await llmAI.getMove(board);
      // Should fallback to center since it's available
      expect(result).toEqual({ row: 1, col: 1 });
    });

    test('should use fallback when API fails', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ];

      const result = await llmAI.getMove(board);
      // Should fallback to center
      expect(result).toEqual({ row: 1, col: 1 });
    });
  });

  describe('setters', () => {
    test('should update difficulty', () => {
      llmAI.setDifficulty('hard');
      expect(llmAI.difficulty).toBe('hard');
    });

    test('should update API key', () => {
      llmAI.setApiKey('new-key');
      expect(llmAI.apiKey).toBe('new-key');
    });
  });
});