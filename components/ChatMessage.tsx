
import React from 'react';
import { ChatMessage as ChatMessageType, MessageAuthor } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.author === MessageAuthor.BOT;
  const animationClass = isBot ? 'animate-message-fade-in' : '';

  return (
    <>
      <div className={`flex items-start gap-4 ${animationClass} ${isBot ? '' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isBot ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gray-600'}`}>
          {isBot ? <BotIcon /> : <UserIcon />}
        </div>
        <div className={`max-w-md md:max-w-lg px-5 py-3 rounded-2xl ${isBot ? 'bg-white/10 rounded-tl-none' : 'bg-purple-600 rounded-tr-none'}`}>
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
      <style>{`
        .animate-message-fade-in {
          animation: messageFadeIn 0.5s ease-in-out forwards;
        }

        @keyframes messageFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ChatMessage;
