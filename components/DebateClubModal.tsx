import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { getDebateTopicAndResponse } from '../services/geminiService';
import { SendIcon } from './icons/SendIcon';

interface DebateClubModalProps {
    onClose: () => void;
}

const DEBATE_TIME_SECONDS = 90;

const DebateClubModal: React.FC<DebateClubModalProps> = ({ onClose }) => {
    const [topic, setTopic] = useState('');
    const [userSide, setUserSide] = useState<'For' | 'Against'>('For');
    const [history, setHistory] = useState<{ user: string; model: string }[]>([]);
    const [currentTurn, setCurrentTurn] = useState<'user' | 'model' | 'ended'>('user');
    const [input, setInput] = useState('');
    const [timer, setTimer] = useState(DEBATE_TIME_SECONDS);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const startNewGame = async () => {
        setLoading(true);
        const data = await getDebateTopicAndResponse();
        setTopic(data.topic);
        setUserSide(Math.random() > 0.5 ? 'For' : 'Against');
        setHistory([{ user: 'Let\'s begin.', model: data.response }]);
        setCurrentTurn('user');
        setTimer(DEBATE_TIME_SECONDS);
        setLoading(false);
    };

    useEffect(() => {
        startNewGame();
    }, []);

    useEffect(() => {
        if (timer > 0 && currentTurn !== 'ended') {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            setCurrentTurn('ended');
        }
    }, [timer, currentTurn]);

     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSend = async () => {
        if (!input.trim() || currentTurn !== 'user') return;

        setCurrentTurn('model');
        const newUserArgument = input;
        setInput('');

        const newHistory = [...history, { user: newUserArgument, model: '...' }];
        setHistory(newHistory);

        const data = await getDebateTopicAndResponse(newHistory);
        setHistory(prev => {
            const updated = [...prev];
            updated[updated.length - 1].model = data.response;
            return updated;
        });

        setCurrentTurn('user');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-2xl shadow-xl w-full max-w-2xl h-[90vh] p-6 m-4 relative flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
                    <CloseIcon />
                </button>
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold">Debate Club</h2>
                    <p className="text-cyan-300">{topic}</p>
                    <p className="text-sm font-semibold">You are arguing: <span className="text-yellow-400">{userSide}</span></p>
                    <div className="text-3xl font-mono mt-2">{timer}</div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 p-2">
                    {history.map((turn, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <div className="flex justify-end"><div className="p-3 rounded-lg bg-purple-600 max-w-sm">{turn.user}</div></div>}
                            <div className="flex justify-start"><div className="p-3 rounded-lg bg-gray-600 max-w-sm">{turn.model}</div></div>
                        </React.Fragment>
                    ))}
                    {currentTurn === 'model' && <div className="p-3 rounded-lg bg-gray-600">Thinking...</div>}
                    <div ref={messagesEndRef} />
                </div>
                
                 {currentTurn === 'ended' && (
                    <div className="text-center p-4 bg-black/30 rounded-lg">
                        <h3 className="text-xl font-bold">Time's Up!</h3>
                        <p>A spirited debate! Well done.</p>
                        <button onClick={startNewGame} className="mt-2 text-purple-400 hover:underline">Play Again</button>
                    </div>
                )}


                <div className="mt-4">
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 p-2 bg-black/30 rounded-xl">
                        <input
                            type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Your argument..."
                            className="flex-1 bg-transparent px-4 py-2 focus:outline-none"
                            disabled={currentTurn !== 'user' || loading}
                        />
                        <button type="submit" className="bg-purple-600 p-3 rounded-lg" disabled={currentTurn !== 'user' || loading}>
                            <SendIcon />
                        </button>
                    </form>
                </div>
            </div>
            <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default DebateClubModal;
