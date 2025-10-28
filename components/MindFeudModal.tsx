import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { Confetti } from './Confetti';
import { getMindFeudQuestion } from '../services/geminiService';
import { playSound, SoundEffect } from '../services/soundService';

interface MindFeudModalProps {
    onClose: () => void;
}

interface Answer {
    answer: string;
    points: number;
    revealed: boolean;
}

const MindFeudModal: React.FC<MindFeudModalProps> = ({ onClose }) => {
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [guess, setGuess] = useState('');
    const [strikes, setStrikes] = useState(0);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadNewGame = async () => {
        setLoading(true);
        const data = await getMindFeudQuestion();
        setQuestion(data.question);
        setAnswers(data.answers.map(a => ({ ...a, revealed: false })));
        setStrikes(0);
        setScore(0);
        setGameOver(false);
        setGuess('');
        setLoading(false);
    };

    useEffect(() => {
        loadNewGame();
    }, []);

    const handleGuess = (e: React.FormEvent) => {
        e.preventDefault();
        if (!guess.trim() || gameOver) return;

        const formattedGuess = guess.toLowerCase().trim();
        const foundAnswer = answers.find(
            a => !a.revealed && a.answer.toLowerCase().trim() === formattedGuess
        );

        if (foundAnswer) {
            const newAnswers = answers.map(a =>
                a.answer === foundAnswer.answer ? { ...a, revealed: true } : a
            );
            setAnswers(newAnswers);
            setScore(prev => prev + foundAnswer.points);
            playSound(SoundEffect.MatchSuccess);

            if (newAnswers.every(a => a.revealed)) {
                setGameOver(true);
                playSound(SoundEffect.GameWin);
            }
        } else {
            setStrikes(prev => prev + 1);
            if (strikes + 1 >= 3) {
                setGameOver(true);
            }
        }
        setGuess('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
             {gameOver && answers.every(a => a.revealed) && <Confetti />}
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-2xl shadow-xl w-full max-w-2xl p-6 m-4 relative text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <CloseIcon />
                </button>
                <h2 className="text-2xl font-bold mb-4">Mind Feud</h2>

                {loading ? <p>Loading question...</p> : (
                    <>
                        <p className="text-lg text-cyan-300 italic mb-6 min-h-[3rem]">{question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                            {answers.map((ans, i) => (
                                <div key={i} className={`p-3 rounded-lg flex justify-between items-center transition-all duration-500 ${ans.revealed || (gameOver && strikes >= 3) ? 'bg-purple-600/70' : 'bg-black/30'}`}>
                                    <span className="font-semibold text-left">{ans.revealed || (gameOver && strikes >= 3) ? ans.answer : `...`}</span>
                                    <span className="font-bold text-yellow-400">{ans.revealed || (gameOver && strikes >= 3) ? ans.points : '--'}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center my-4">
                             <div className="flex items-center gap-2">
                                <span className="font-bold">Strikes:</span>
                                <span className={`w-6 h-6 rounded-full ${strikes >= 1 ? 'bg-red-500' : 'bg-gray-600'}`}></span>
                                <span className={`w-6 h-6 rounded-full ${strikes >= 2 ? 'bg-red-500' : 'bg-gray-600'}`}></span>
                                <span className={`w-6 h-6 rounded-full ${strikes >= 3 ? 'bg-red-500' : 'bg-gray-600'}`}></span>
                            </div>
                            <div className="text-2xl font-bold">Score: <span className="text-green-400">{score}</span></div>
                        </div>

                        {!gameOver ? (
                             <form onSubmit={handleGuess} className="flex gap-2">
                                <input
                                    type="text" value={guess} onChange={e => setGuess(e.target.value)}
                                    placeholder="Enter your guess..."
                                    className="w-full bg-black/30 rounded-lg px-4 py-2 border border-white/10 focus:outline-none focus:border-purple-500"
                                />
                                <button type="submit" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold">Guess</button>
                            </form>
                        ) : (
                             <div className="p-4 bg-black/30 rounded-lg mt-4">
                                <h3 className="text-xl font-bold">{answers.every(a => a.revealed) ? "Board Cleared!" : "Game Over!"}</h3>
                                <p>You scored {score} points!</p>
                             </div>
                        )}
                        
                        <button onClick={loadNewGame} className="mt-6 w-full bg-black/30 hover:bg-black/50 rounded-lg py-2 font-semibold transition-colors">New Game</button>
                    </>
                )}
            </div>
             <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default MindFeudModal;
