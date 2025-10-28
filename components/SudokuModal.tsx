import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { Confetti } from './Confetti';
import { playSound, SoundEffect } from '../services/soundService';

interface SudokuModalProps {
    onClose: () => void;
}

// Example puzzle (0 represents an empty cell)
const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
];


const SudokuModal: React.FC<SudokuModalProps> = ({ onClose }) => {
    const [board, setBoard] = useState<number[][]>(JSON.parse(JSON.stringify(puzzle)));
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    const handleCellClick = (row: number, col: number) => {
        if (puzzle[row][col] === 0) {
            setSelectedCell({ row, col });
        }
    };

    const handleNumberInput = (num: number) => {
        if (selectedCell) {
            const { row, col } = selectedCell;
            const newBoard = board.map(r => r.slice());
            newBoard[row][col] = num;
            setBoard(newBoard);
            checkCompletion(newBoard);
        }
    };

    const checkCompletion = (currentBoard: number[][]) => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (currentBoard[i][j] !== solution[i][j]) {
                    return;
                }
            }
        }
        setIsComplete(true);
        playSound(SoundEffect.GameWin);
    };

    const resetGame = () => {
        setBoard(JSON.parse(JSON.stringify(puzzle)));
        setSelectedCell(null);
        setIsComplete(false);
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
             {isComplete && <Confetti />}
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-2xl shadow-xl w-full max-w-lg p-6 m-4 relative text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <CloseIcon />
                </button>
                <h2 className="text-2xl font-bold mb-4">Sudoku</h2>

                <div className="grid grid-cols-9 gap-px bg-purple-500/30 p-1 my-4 mx-auto w-fit">
                    {board.map((row, rIndex) =>
                        row.map((cell, cIndex) => {
                             const isPuzzleCell = puzzle[rIndex][cIndex] !== 0;
                             const isSelected = selectedCell?.row === rIndex && selectedCell?.col === cIndex;
                             const isIncorrect = cell !== 0 && cell !== solution[rIndex][cIndex];
                             
                             const borderTop = rIndex % 3 === 0 ? 'border-t-purple-400' : 'border-t-transparent';
                             const borderRight = (cIndex + 1) % 3 === 0 ? 'border-r-purple-400' : 'border-r-transparent';
                            
                            return (
                                <div
                                    key={`${rIndex}-${cIndex}`}
                                    onClick={() => handleCellClick(rIndex, cIndex)}
                                    className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-xl font-mono
                                    bg-gray-800
                                    ${isPuzzleCell ? 'text-cyan-300 font-bold' : 'cursor-pointer'}
                                    ${isSelected ? 'bg-purple-600/50' : ''}
                                    ${isIncorrect ? 'text-red-500' : 'text-white'}
                                    ${borderTop} ${borderRight} border-2
                                    `}
                                >
                                    {cell !== 0 ? cell : ''}
                                </div>
                            )
                        })
                    )}
                </div>

                {isComplete ? (
                    <div className='p-4 text-green-300 bg-green-500/20 rounded-lg'>
                        <h3 className="text-xl font-bold">Congratulations! You solved it!</h3>
                    </div>
                ) : (
                    <div className="flex justify-center gap-2 my-4">
                        {Array.from({ length: 9 }, (_, i) => i + 1).map(num => (
                            <button
                                key={num}
                                onClick={() => handleNumberInput(num)}
                                className="w-9 h-9 md:w-10 md:h-10 bg-purple-600 hover:bg-purple-700 rounded-md text-xl font-bold flex items-center justify-center transition-colors"
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                )}

                 <button onClick={resetGame} className="mt-4 w-full bg-black/30 hover:bg-black/50 rounded-lg py-2 font-semibold transition-colors">
                    Reset Game
                </button>
            </div>
             <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default SudokuModal;
