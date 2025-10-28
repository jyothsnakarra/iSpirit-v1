import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { Confetti } from './Confetti';
import { playSound, SoundEffect } from '../services/soundService';

interface TicTacToeModalProps {
    onClose: () => void;
}

type Player = 'X' | 'O' | null;

const TicTacToeModal: React.FC<TicTacToeModalProps> = ({ onClose }) => {
    const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState<Player>(null);

    const calculateWinner = (squares: Player[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6], // diagonals
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const isBoardFull = board.every(square => square !== null);

    const handleClick = (i: number) => {
        if (winner || board[i] || !isXNext) return;
        const newBoard = board.slice();
        newBoard[i] = 'X';
        setBoard(newBoard);
        setIsXNext(false);
        playSound(SoundEffect.MoveClick);
    };
    
    // AI Move Logic
    useEffect(() => {
        const checkWinner = calculateWinner(board);
        if (checkWinner) {
            setWinner(checkWinner);
            if(checkWinner === 'X') playSound(SoundEffect.GameWin);
            return;
        }

        if (!isXNext && !checkWinner && !isBoardFull) {
            const timeout = setTimeout(() => {
                const availableMoves = board.map((sq, idx) => sq === null ? idx : null).filter(val => val !== null);
                if (availableMoves.length > 0) {
                    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)] as number;
                    const newBoard = board.slice();
                    newBoard[randomMove] = 'O';
                    setBoard(newBoard);
                    setIsXNext(true);
                    playSound(SoundEffect.MoveClick);
                }
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [board, isXNext, isBoardFull]);


    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
    };

    const renderSquare = (i: number) => {
        return (
            <button
                className={`w-20 h-20 md:w-24 md:h-24 bg-black/30 rounded-lg text-4xl font-bold flex items-center justify-center
                ${board[i] === 'X' ? 'text-purple-400' : 'text-cyan-400'}
                transition-colors duration-300 hover:bg-black/50`}
                onClick={() => handleClick(i)}
            >
                {board[i]}
            </button>
        );
    };

    let status;
    if (winner) {
        status = `Winner: ${winner}`;
    } else if (isBoardFull) {
        status = "It's a Draw!";
    } else {
        status = `Next player: ${isXNext ? 'You (X)' : 'AI (O)'}`;
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
             {winner === 'X' && <Confetti />}
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-2xl shadow-xl w-full max-w-sm p-6 m-4 relative text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <CloseIcon />
                </button>
                <h2 className="text-2xl font-bold mb-4">Tic-Tac-Toe</h2>
                <div className="grid grid-cols-3 gap-2 my-6">
                    {Array(9).fill(null).map((_, i) => renderSquare(i))}
                </div>
                <div className="text-lg font-semibold mb-4">{status}</div>
                <button onClick={resetGame} className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg py-2 font-semibold transition-colors">
                    New Game
                </button>
            </div>
             <style>{`
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default TicTacToeModal;
