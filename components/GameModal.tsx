import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { playSound, SoundEffect } from '../services/soundService';
import { QuestionIcon } from './icons/QuestionIcon';
import { Confetti } from './Confetti';

interface GameModalProps {
  onClose: () => void;
}

const EMOJIS = ['🧠', '❤️', '✨', '🧘', '🌟', '🙏', '🌌', '🕊️'];
const CARDS = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);

const GameModal: React.FC<GameModalProps> = ({ onClose }) => {
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [lastMatched, setLastMatched] = useState<string | null>(null);
  
  const isGameWon = matched.length === EMOJIS.length;

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (CARDS[first] === CARDS[second]) {
        setMatched((prev) => [...prev, CARDS[first]]);
        setLastMatched(CARDS[first]);
        playSound(SoundEffect.MatchSuccess);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  }, [flipped]);

  useEffect(() => {
    if (isGameWon) {
      playSound(SoundEffect.GameWin);
    }
  }, [isGameWon]);

  const handleCardClick = (index: number) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(CARDS[index])) {
      setLastMatched(null); // Clear previous glow on new move
      playSound(SoundEffect.CardFlip);
      setFlipped((prev) => [...prev, index]);
      setMoves(moves + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-purple-500/50 rounded-2xl p-6 w-full max-w-md shadow-2xl relative text-center animate-fade-in overflow-hidden">
        {isGameWon && <Confetti />}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
          <CloseIcon />
        </button>
        <div className="flex items-center justify-center space-x-2">
            <h2 className="text-2xl font-bold text-purple-400">Mindful Memory</h2>
            <button onClick={() => setShowHelp(!showHelp)} className="text-gray-400 hover:text-white" aria-label="How to play">
                <QuestionIcon />
            </button>
        </div>
        {isGameWon ? (
            <div className='flex flex-col items-center justify-center min-h-[280px]'>
                <p className='text-4xl'>🎉</p>
                <h3 className='text-xl font-semibold mt-4'>Well Done!</h3>
                <p className='text-gray-300 mt-2'>You completed the game in {Math.floor(moves / 2)} pairs.</p>
                <button onClick={onClose} className='mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg'>
                    Close
                </button>
            </div>
        ) : (
            <>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showHelp ? 'max-h-20 opacity-100 mt-4 mb-2' : 'max-h-0 opacity-0'}`}>
                    <p className="text-gray-300">Flip cards to find matching pairs. Clear the board to win.</p>
                </div>
                {!showHelp && <p className="text-gray-300 mb-6 h-[28px]">Match the pairs to clear your mind.</p>}
                
                <div className="grid grid-cols-4 gap-4">
                {CARDS.map((emoji, index) => {
                    const isCardFlipped = flipped.includes(index) || matched.includes(emoji);
                    const isGlowing = matched.includes(emoji) && lastMatched === emoji;

                    return (
                        <div key={index} className="aspect-square perspective-1000" onClick={() => handleCardClick(index)}>
                            <div className={`w-full h-full rounded-lg flex items-center justify-center text-3xl cursor-pointer transition-transform duration-500 transform-style-3d ${isCardFlipped ? 'rotate-y-180' : ''}`}>
                                <div className="absolute w-full h-full bg-purple-600 hover:bg-purple-700 rounded-lg backface-hidden"></div>
                                <div className={`absolute w-full h-full bg-gray-700 rounded-lg rotate-y-180 backface-hidden flex items-center justify-center ${isGlowing ? 'animate-glow' : ''}`}>
                                    {emoji}
                                </div>
                            </div>
                        </div>
                    );
                })}
                </div>
                <p className="mt-6 text-sm text-gray-400">Moves: {moves}</p>
            </>
        )}
      </div>
       <style>{`
          .perspective-1000 { perspective: 1000px; }
          .transform-style-3d { transform-style: preserve-3d; }
          .rotate-y-180 { transform: rotateY(180deg); }
          .backface-hidden { backface-visibility: hidden; }
          .animate-fade-in { animation: fadeIn 0.3s ease-out; }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-glow {
            animation: glow 0.8s ease-in-out;
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 12px 2px rgba(192, 132, 252, 0.6); }
            50% { box-shadow: 0 0 20px 5px rgba(192, 132, 252, 0.9); }
          }
        `}</style>
    </div>
  );
};

export default GameModal;