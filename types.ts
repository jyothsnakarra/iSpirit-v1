export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export interface ChatMessage {
  id: string;
  text: string;
  author: MessageAuthor;
}

export interface Song {
  title: string;
  artist: string;
}

export interface RiddleState {
  riddle: string;
  answer: string;
}
