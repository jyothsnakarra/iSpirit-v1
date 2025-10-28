import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType, MessageAuthor } from '../types';
import ChatMessage from './ChatMessage';
import { SendIcon } from './icons/SendIcon';
import { getChatResponse } from '../services/geminiService';
import { playSound, SoundEffect } from '../services/soundService';

interface ChatWindowProps {
  onOpenMusic: () => void;
  onOpenGames: () => void;
  personality: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onOpenMusic, onOpenGames, personality }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    { id: '1', text: 'Hello! How are you feeling today? You can chat with me, or we can listen to some music or play a game.', author: MessageAuthor.BOT },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      text: input,
      author: MessageAuthor.USER,
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    playSound(SoundEffect.MessageSent);

    // Call Gemini API
    const botResponseText = await getChatResponse(currentInput, messages, personality);

    const botMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      author: MessageAuthor.BOT,
    };

    setMessages(prev => [...prev, botMessage]);
    playSound(SoundEffect.MessageReceived);
    setIsLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 max-w-4xl w-full mx-auto">
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
            <div className="flex items-start gap-4 animate-message-fade-in">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                </div>
                <div className="max-w-md md:max-w-lg px-5 py-3 rounded-2xl bg-white/10 rounded-tl-none">
                    <p className="whitespace-pre-wrap">Thinking...</p>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-6">
        <div className="flex items-center space-x-2 mb-2">
          <button onClick={onOpenMusic} className="px-4 py-2 text-sm bg-black/20 rounded-full hover:bg-black/40 transition-colors">Listen to Music 🎧</button>
          <button onClick={onOpenGames} className="px-4 py-2 text-sm bg-black/20 rounded-full hover:bg-black/40 transition-colors">Play a Game 🎲</button>
        </div>
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-2 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 focus-within:border-purple-500/50 transition-colors">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-4 py-2 focus:outline-none"
            disabled={isLoading}
          />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg p-3" disabled={isLoading || !input.trim()}>
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
