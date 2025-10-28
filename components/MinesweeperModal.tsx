import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { Confetti } from './Confetti';
import { playSound, SoundEffect } from '../services/soundService';

interface MinesweeperModalProps {
    onClose: () => void;
}

const ROWS = 10;
const COLS = 10;
const MINES = 12;

type CellState = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
};

const createEmptyBoard = (): CellState[][] => {
    return Array(ROWS).fill(null).map(() => Array(COLS).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
    })));
};

const MinesweeperModal: React.FC<MinesweeperModalProps> = ({ onClose }) => {
    const [board, setBoard] = useState<CellState[][]>(createEmptyBoard());
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [firstClick, setFirstClick] = useState(true);
    const [timer, setTimer] = useState(0);

     useEffect(() => {
        // FIX: Replaced NodeJS.Timeout with a browser-compatible type.
        let interval: ReturnType<typeof setInterval> | null = null;
        if (!gameOver && !gameWon && !firstClick) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameOver, gameWon, firstClick]);

    const plantMines = (initialBoard: CellState[][], startRow: number, startCol: number) => {
        let minesPlaced = 0;
        const newBoard = JSON.parse(JSON.stringify(initialBoard));

        while (minesPlaced < MINES) {
            const row = Math.floor(Math.random() * ROWS);
            const col = Math.floor(Math.random() * COLS);
            if (!newBoard[row][col].isMine && !(row === startRow && col === startCol)) {
                newBoard[row][col].isMine = true;
                minesPlaced++;
            }
        }

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (newBoard[r][c].isMine) continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].isMine) {
                            count++;
                        }
                    }
                }
                newBoard[r][c].adjacentMines = count;
            }
        }
        return newBoard;
    };
    
    const revealCell = (row: number, col: number, currentBoard: CellState[][]): CellState[][] => {
        const newBoard = JSON.parse(JSON.stringify(currentBoard));
        const cell = newBoard[row][col];
        if (cell.isRevealed || cell.isFlagged) return newBoard;

        cell.isRevealed = true;
        
        if (cell.adjacentMines === 0 && !cell.isMine) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = row + dr;
                    const nc = col + dc;
                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !newBoard[nr][nc].isRevealed) {
                        Object.assign(newBoard, revealCell(nr, nc, newBoard));
                    }
                }
            }
        }
        return newBoard;
    };
    
    const checkWinCondition = (currentBoard: CellState[][]) => {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = currentBoard[r][c];
                if (!cell.isMine && !cell.isRevealed) {
                    return false;
                }
            }
        }
        return true;
    };
    
    const handleClick = (row: number, col: number) => {
        if (gameOver || gameWon) return;

        let currentBoard = board;
        if (firstClick) {
            currentBoard = plantMines(board, row, col);
            setFirstClick(false);
        }
        
        const cell = currentBoard[row][col];
        if (cell.isFlagged || cell.isRevealed) return;
        
        if (cell.isMine) {
            setGameOver(true);
            const finalBoard = currentBoard.map(r => r.map(c => ({...c, isRevealed: true})));
            setBoard(finalBoard);
            return;
        }
        
        const newBoard = revealCell(row, col, currentBoard);
        setBoard(newBoard);

        if (checkWinCondition(newBoard)) {
            setGameWon(true);
            playSound(SoundEffect.GameWin);
        } else {
            playSound(SoundEffect.MoveClick);
        }
    };
    
    const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
        e.preventDefault();
        if (gameOver || gameWon || board[row][col].isRevealed) return;

        const newBoard = JSON.parse(JSON.stringify(board));
        newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
        setBoard(newBoard);
    };

    const resetGame = () => {
        setBoard(createEmptyBoard());
        setGameOver(false);
        setGameWon(false);
        setFirstClick(true);
        setTimer(0);
    };
    
    const getCellContent = (cell: CellState) => {
        if (cell.isFlagged) return '🚩';
        if (!cell.isRevealed) return '';
        if (cell.isMine) return '💣';
        if (cell.adjacentMines > 0) return cell.adjacentMines;
        return '';
    };
    
    const getAdjMinesColor = (count: number) => {
      const colors = ['', 'text-blue-500', 'text-green-500', 'text-red-500', 'text-purple-500', 'text-yellow-500', 'text-cyan-500', 'text-pink-500', 'text-gray-500'];
      return colors[count];
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            {gameWon && <Confetti />}
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-2xl shadow-xl w-full max-w-lg p-6 m-4 relative text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <CloseIcon />
                </button>
                <h2 className="text-2xl font-bold mb-4">Minesweeper</h2>

                <div className="flex justify-between items-center my-4 bg-black/20 p-2 rounded-lg">
                    <div className="font-mono text-lg">🚩 {board.flat().filter(c => c.isFlagged).length} / {MINES}</div>
                    <div className="font-mono text-lg">⏱️ {timer}s</div>
                </div>

                <div className="grid grid-cols-10 gap-px bg-purple-500/30 p-1 my-4 mx-auto w-fit">
                    {board.map((row, rIndex) =>
                        row.map((cell, cIndex) => (
                            <div
                                key={`${rIndex}-${cIndex}`}
                                onClick={() => handleClick(rIndex, cIndex)}
                                onContextMenu={(e) => handleRightClick(e, rIndex, cIndex)}
                                className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center font-bold text-lg
                                ${!cell.isRevealed ? 'bg-gray-600 hover:bg-gray-500 cursor-pointer' : 'bg-gray-700'}
                                ${getAdjMinesColor(cell.adjacentMines)}
                                `}
                            >
                               {getCellContent(cell)}
                            </div>
                        ))
                    )}
                </div>

                {gameOver && <div className="p-2 text-red-400 bg-red-500/20 rounded-lg text-xl font-bold">Game Over!</div>}
                {gameWon && <div className="p-2 text-green-300 bg-green-500/20 rounded-lg text-xl font-bold">You Win!</div>}

                <button onClick={resetGame} className="mt-4 w-full bg-purple-600 hover:bg-purple-700 rounded-lg py-2 font-semibold transition-colors">
                    New Game
                </button>
            </div>
             <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default MinesweeperModal;