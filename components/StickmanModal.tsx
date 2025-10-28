import React, { useState, useMemo } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { Confetti } from './Confetti';
import { playSound, SoundEffect } from '../services/soundService';

interface StickmanModalProps {
    onClose: () => void;
}

const words = ["Hope", "Dream", "Peace", "Love", "Courage", "Serenity", "Kindness", "Joy", "Grace", "Believe"];
const MAX_WRONG_GUESSES = 6;

const StickmanModal: React.FC<StickmanModalProps> = ({ onClose }) => {
    const [secretWord, setSecretWord] = useState(() => words[Math.floor(Math.random() * words.length)]);
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

    const wrongGuesses = useMemo(() => {
        return guessedLetters.filter(letter => !secretWord.toLowerCase().includes(letter.toLowerCase()));
    }, [guessedLetters, secretWord]);

    const isWinner = useMemo(() => {
        return secretWord.toLowerCase().split('').every(letter => guessedLetters.includes(letter.toLowerCase()));
    }, [guessedLetters, secretWord]);

    const isLoser = wrongGuesses.length >= MAX_WRONG_GUESSES;

    const handleGuess = (letter: string) => {
        if (isWinner || isLoser || guessedLetters.includes(letter.toLowerCase())) return;
        setGuessedLetters(prev => [...prev, letter.toLowerCase()]);
    };
    
    const resetGame = () => {
        setSecretWord(words[Math.floor(Math.random() * words.length)]);
        setGuessedLetters([]);
    };

    const StickmanFigure = ({ wrongGuessesCount }: { wrongGuessesCount: number }) => {
        const parts = [
            <circle key="head" cx="100" cy="50" r="20" stroke="white" strokeWidth="4" fill="none" />, // Head
            <line key="body" x1="100" y1="70" x2="100" y2="130" stroke="white" strokeWidth="4" />,   // Body
            <line key="r-arm" x1="100" y1="80" x2="130" y2="110" stroke="white" strokeWidth="4" />, // Right Arm
            <line key="l-arm" x1="100" y1="80" x2="70" y2="110" stroke="white" strokeWidth="4" />, // Left Arm
            <line key="r-leg" x1="100" y1="130" x2="130" y2="160" stroke="white" strokeWidth="4" />, // Right Leg
            <line key="l-leg" x1="100" y1="130" x2="70" y2="160" stroke="white" strokeWidth="4" />, // Left Leg
        ];
        return (
            <svg viewBox="0 0 200 250" className="w-40 h-50 mx-auto">
                {/* Gallows */}
                <line x1="20" y1="230" x2="180" y2="230" stroke="white" strokeWidth="4" />
                <line x1="50" y1="230" x2="50" y2="20" stroke="white" strokeWidth="4" />
                <line x1="50" y1="20" x2="100" y2="20" stroke="white" strokeWidth="4" />
                <line x1="100" y1="20" x2="100" y2="30" stroke="white" strokeWidth="4" />
                {parts.slice(0, wrongGuessesCount)}
            </svg>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
             {isWinner && <Confetti />}
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-2xl shadow-xl w-full max-w-lg p-6 m-4 relative text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <CloseIcon />
                </button>
                <h2 className="text-2xl font-bold mb-4">Stickman's Fate</h2>

                <StickmanFigure wrongGuessesCount={wrongGuesses.length} />

                <div className="flex justify-center gap-2 md:gap-4 my-6 text-2xl md:text-4xl font-bold tracking-widest">
                    {secretWord.split('').map((letter, index) => (
                        <span key={index} className="w-8 md:w-10 h-10 md:h-12 border-b-4 flex items-center justify-center">
                            {guessedLetters.includes(letter.toLowerCase()) ? letter : ''}
                        </span>
                    ))}
                </div>

                {isWinner || isLoser ? (
                     <div className="p-4 bg-black/30 rounded-lg">
                        <h3 className="text-xl font-bold">{isWinner ? "You Saved Him!" : "Game Over"}</h3>
                        {!isWinner && <p>The word was: <span className="font-bold">{secretWord}</span></p>}
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-2">
                        {'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => (
                            <button
                                key={letter}
                                onClick={() => handleGuess(letter)}
                                disabled={guessedLetters.includes(letter)}
                                className="w-9 h-9 md:w-10 md:h-10 bg-purple-600 hover:bg-purple-700 rounded-md text-xl font-bold flex items-center justify-center transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                {letter.toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}
                
                 <button onClick={resetGame} className="mt-6 w-full bg-black/30 hover:bg-black/50 rounded-lg py-2 font-semibold transition-colors">
                    New Word
                </button>
            </div>
            <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default StickmanModal;
