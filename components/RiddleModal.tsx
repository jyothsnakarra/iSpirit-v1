import React, { useState, useEffect } from 'react';
import { RiddleState } from '../types';
import { getNewRiddle } from '../services/geminiService';
import { CloseIcon } from './icons/CloseIcon';
import { Confetti } from './Confetti';

interface RiddleModalProps {
  onClose: () => void;
}

const RiddleModal: React.FC<RiddleModalProps> = ({ onClose }) => {
  const [riddleState, setRiddleState] = useState<RiddleState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [solved, setSolved] = useState(false);

  const loadRiddle = async () => {
    setIsLoading(true);
    setSolved(false);
    setGuess('');
    setFeedback('');
    const newRiddle = await getNewRiddle();
    setRiddleState(newRiddle);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRiddle();
  }, []);
  
  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || !riddleState) return;

    const formattedAnswer = riddleState.answer.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").trim();
    const formattedGuess = guess.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").trim();

    if (formattedAnswer.includes(formattedGuess) || formattedGuess.includes(formattedAnswer)) {
      setFeedback('You got it! Correct!');
      setSolved(true);
    } else {
      setFeedback("Not quite, try again!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800/80 border border-purple-500/30 rounded-2xl shadow-xl w-full max-w-md p-6 m-4 relative">
        {solved && <Confetti />}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">Riddle Me This</h2>
        
        {isLoading ? (
            <div className="flex justify-center items-center h-40">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s] mx-2"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            </div>
        ) : (
          <div className="text-center">
            <p className="text-lg italic my-6 min-h-[6rem] flex items-center justify-center">{riddleState?.riddle}</p>
            {!solved ? (
                 <form onSubmit={handleGuess}>
                    <input
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="Your answer..."
                        className="w-full bg-black/30 rounded-lg px-4 py-2 border border-white/10 focus:outline-none focus:border-purple-500"
                    />
                    <button type="submit" className="mt-4 w-full bg-purple-600 hover:bg-purple-700 rounded-lg py-2 font-semibold transition-colors">Guess</button>
                </form>
            ) : (
                 <div className="p-4 bg-green-500/20 rounded-lg text-green-300">
                    <p className="font-bold">Correct!</p>
                    <p>The answer was: {riddleState?.answer}</p>
                 </div>
            )}
            {feedback && <p className={`mt-4 ${solved ? 'text-green-400' : 'text-yellow-400'}`}>{feedback}</p>}

             <button onClick={loadRiddle} className="mt-6 text-sm text-purple-400 hover:underline">
               Get a New Riddle
            </button>
          </div>
        )}
      </div>
       <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default RiddleModal;
