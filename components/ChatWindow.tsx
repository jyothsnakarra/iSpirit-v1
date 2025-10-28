import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType, MessageAuthor, GameType } from '../types';
import ChatMessage from './ChatMessage';
import { sendMessageStream, startChat } from '../services/geminiService';
import { SendIcon } from './icons/SendIcon';
import { playSound, SoundEffect } from '../services/soundService';

interface ChatWindowProps {
  onPlayGame: (gameType: GameType) => void;
  onPlayMusic: (query: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onPlayGame, onPlayMusic }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    { id: 'init', author: MessageAuthor.BOT, text: 'Hello, friend. I am iSpirit. How are you feeling today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startChat();
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    playSound(SoundEffect.MessageSent);

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      author: MessageAuthor.USER,
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: botMessageId, author: MessageAuthor.BOT, text: '' }]);

    try {
      const stream = await sendMessageStream(input);
      let accumulatedText = '';
      let isFirstChunk = true;

      for await (const chunk of stream) {
        if(chunk.functionCalls) {
          for(const fc of chunk.functionCalls) {
            if(fc.name === 'playGame' && fc.args.gameType) {
              onPlayGame(fc.args.gameType as GameType);
              accumulatedText += `\nI've opened the ${fc.args.gameType} game for you to relax your mind.`;
            } else if (fc.name === 'playMusic' && fc.args.query) {
              onPlayMusic(fc.args.query as string);
              accumulatedText += `\nI found some music that might help: "${fc.args.query}"`;
            }
          }
        }
        
        const chunkText = chunk.text;
        if (chunkText) {
          if (isFirstChunk) {
            playSound(SoundEffect.MessageReceived);
            isFirstChunk = false;
          }
          accumulatedText += chunkText;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId ? { ...msg, text: accumulatedText } : msg
            )
          );
        }
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, text: 'Sorry, I encountered a problem. Please try again.' } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow space-y-6 overflow-y-auto pr-2">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length-1].author === MessageAuthor.BOT && (
           <div className="flex items-center space-x-2 animate-pulse ml-14">
             <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
             <div className="w-2 h-2 bg-purple-400 rounded-full animation-delay-200"></div>
             <div className="w-2 h-2 bg-purple-400 rounded-full animation-delay-400"></div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="mt-6 flex items-center space-x-3 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Talk to iSpirit..."
          className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg p-3 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;