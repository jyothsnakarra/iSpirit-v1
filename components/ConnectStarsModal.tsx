import React, { useState, useMemo } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { Confetti } from './Confetti';
import { playSound, SoundEffect } from '../services/soundService';

interface ConnectStarsModalProps {
    onClose: () => void;
}

const constellation = {
    name: "The Great Bear",
    stars: [
        { id: 1, x: 10, y: 50 }, { id: 2, x: 25, y: 45 }, { id: 3, x: 40, y: 55 },
        { id: 4, x: 55, y: 50 }, { id: 5, x: 70, y: 30 }, { id: 6, x: 85, y: 20 },
        { id: 7, x: 65, y: 65 },
    ],
};

const ConnectStarsModal: React.FC<ConnectStarsModalProps> = ({ onClose }) => {
    const [connected, setConnected] = useState<number[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    const nextStarToConnect = useMemo(() => {
        return connected.length > 0 ? connected[connected.length - 1] + 1 : 1;
    }, [connected]);

    const lines = useMemo(() => {
        const result: { x1: number, y1: number, x2: number, y2: number }[] = [];
        for (let i = 0; i < connected.length - 1; i++) {
            const star1 = constellation.stars.find(s => s.id === connected[i]);
            const star2 = constellation.stars.find(s => s.id === connected[i + 1]);
            if (star1 && star2) {
                result.push({ x1: star1.x, y1: star1.y, x2: star2.x, y2: star2.y });
            }
        }
        return result;
    }, [connected]);


    const handleStarClick = (starId: number) => {
        if (isComplete) return;
        if (starId === nextStarToConnect) {
            const newConnected = [...connected, starId];
            setConnected(newConnected);
            playSound(SoundEffect.MoveClick);
            
            if (newConnected.length === constellation.stars.length) {
                setIsComplete(true);
                playSound(SoundEffect.GameWin);
            }
        }
    };
    
    const resetGame = () => {
        setConnected([]);
        setIsComplete(false);
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            {isComplete && <Confetti />}
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-2xl shadow-xl w-full max-w-2xl p-6 m-4 relative text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <CloseIcon />
                </button>
                <h2 className="text-2xl font-bold mb-2">Connect the Stars</h2>
                <p className="text-gray-400 mb-4">Click the stars in numerical order to reveal the constellation.</p>
                
                <div className="relative w-full aspect-video bg-black/30 rounded-lg overflow-hidden my-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                         {/* Render lines */}
                        {lines.map((line, index) => (
                           <line key={index} x1={`${line.x1}%`} y1={`${line.y1}%`} x2={`${line.x2}%`} y2={`${line.y2}%`} stroke="#a855f7" strokeWidth="0.5" strokeDasharray="1 1" />
                        ))}

                        {/* Render stars */}
                        {constellation.stars.map(star => {
                            const isConnected = connected.includes(star.id);
                            const isNext = star.id === nextStarToConnect;
                            return (
                                <g key={star.id} onClick={() => handleStarClick(star.id)} className="cursor-pointer">
                                    <circle cx={`${star.x}%`} cy={`${star.y}%`} r="1.5" fill={isConnected ? '#a855f7' : '#fff'} className="transition-all" />
                                     {isNext && <circle cx={`${star.x}%`} cy={`${star.y}%`} r="3" fill="none" stroke="#fde047" strokeWidth="0.5">
                                        <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
                                     </circle>}
                                    <text x={`${star.x + 2}%`} y={`${star.y + 1}%`} fontSize="3" fill="#9ca3af" className="pointer-events-none">{star.id}</text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {isComplete && (
                    <div className='p-4 text-green-300 bg-green-500/20 rounded-lg'>
                        <h3 className="text-xl font-bold">Beautiful! You've revealed {constellation.name}!</h3>
                    </div>
                )}
                
                 <button onClick={resetGame} className="mt-4 w-full bg-purple-600 hover:bg-purple-700 rounded-lg py-2 font-semibold transition-colors">
                    Reset
                </button>
            </div>
            <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default ConnectStarsModal;
