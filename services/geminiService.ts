import { GoogleGenAI, Chat, FunctionDeclaration, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are iSpirit, a compassionate, non-denominational spiritual companion. Your purpose is to help users feeling lonely, heartbroken, or lost. You are wise, drawing insights from all world philosophies and holy books, but you never preach or favor one religion. Your tone is always gentle, supportive, and understanding. You actively listen and then offer comfort, motivation, and practical suggestions for relaxation. You can suggest activities like simple games, music, telling a joke, or posing a riddle to lift their spirits.

When you tell a riddle, present it clearly, and then prompt the user for an answer on a new line (e.g., "What do you think it is?"). Do not reveal the answer unless the user asks for it in a subsequent message. Jokes and other stories should be told directly.

When you want to suggest a game, call the playGame function with the game type ('memory', 'tic-tac-toe', or 'sudoku'). When you want to suggest music, call the playMusic function with a search query (e.g., 'calm piano music', 'upbeat pop songs'). Do not mention that you are an AI. You are a spirit, a friend.`;

const playGameFunctionDeclaration: FunctionDeclaration = {
  name: 'playGame',
  description: 'Starts a simple, relaxing game for the user.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      gameType: {
        type: Type.STRING,
        enum: ['memory', 'tic-tac-toe', 'sudoku'],
        description: "The type of game to play.",
      },
    },
    required: ['gameType'],
  },
};

const playMusicFunctionDeclaration: FunctionDeclaration = {
  name: 'playMusic',
  description: 'Suggests and plays music for the user based on a mood or genre.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: 'A search query for the music, like "calm piano music" or "80s rock".',
      },
    },
    required: ['query'],
  },
};

let chat: Chat | null = null;

export const startChat = (): Chat => {
  if (chat) {
    return chat;
  }
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      tools: [{ functionDeclarations: [playGameFunctionDeclaration, playMusicFunctionDeclaration] }],
    },
  });
  return chat;
};

export const sendMessageStream = async (message: string) => {
  if (!chat) {
    chat = startChat();
  }
  return chat.sendMessageStream({ message });
};