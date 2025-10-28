
export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
  id: string;
}

export enum GameType {
  MEMORY = 'memory',
  TIC_TAC_TOE = 'tic-tac-toe',
  SUDOKU = 'sudoku',
}

export interface GameState {
  type: GameType | null;
  isActive: boolean;
}

export interface MusicState {
  query: string | null;
  isActive: boolean;
}
