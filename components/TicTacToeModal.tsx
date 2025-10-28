import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { playSound, SoundEffect } from '../services/soundService';
import { QuestionIcon } from './icons/QuestionIcon';

const TicTacToeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const prevWinnerRef = useRef<string | null>(null);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every(square => square !== null)) {
      return 'Draw';
    }
    return null;
  };

  const handlePlayerMove = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;
    playSound(SoundEffect.MoveClick);
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setIsPlayerTurn(false);
    }
  };
  
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      setIsBotThinking(true);
      const botMoveTimeout = setTimeout(() => {
          const emptySquares = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
          if (emptySquares.length > 0) {
              const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)] as number;
              const newBoard = [...board];
              newBoard[randomIndex] = 'O';
              playSound(SoundEffect.MoveClick);
              setBoard(newBoard);
              const gameWinner = calculateWinner(newBoard);
              if (gameWinner) {
                  setWinner(gameWinner);
              }
          }
          setIsPlayerTurn(true);
          setIsBotThinking(false);
      }, 800);
      return () => clearTimeout(botMoveTimeout);
    }
  }, [isPlayerTurn, winner, board]);

  useEffect(() => {
    if (winner && prevWinnerRef.current === null) {
      playSound(SoundEffect.GameWin);
    }
    prevWinnerRef.current = winner;
  }, [winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    prevWinnerRef.current = null;
    setIsPlayerTurn(true);
  };

  const getStatusMessage = () => {
    if (winner) {
      if (winner === 'Draw') return "It's a draw!";
      return `${winner === 'X' ? 'You' : 'iSpirit'} won!`;
    }
    if (isBotThinking) return 'iSpirit is thinking...';
    return isPlayerTurn ? 'Your turn (X)' : "iSpirit's turn (O)";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-purple-500/50 rounded-2xl p-6 w-full max-w-xs shadow-2xl relative text-center animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <CloseIcon />
        </button>
        <div className="flex items-center justify-center space-x-2">
          <h2 className="text-2xl font-bold text-purple-400">Tic-Tac-Toe</h2>
           <button onClick={() => setShowHelp(!showHelp)} className="text-gray-400 hover:text-white" aria-label="How to play">
                <QuestionIcon />
            </button>
        </div>
         <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showHelp ? 'max-h-20 opacity-100 my-4' : 'max-h-0 opacity-0'}`}>
            <p className="text-gray-300 text-sm">Get three of your marks in a row (horizontally, vertically, or diagonally) to win.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 my-6">
          {board.map((value, index) => (
            <button
              key={index}
              onClick={() => handlePlayerMove(index)}
              className="aspect-square bg-gray-700 rounded-lg text-4xl font-bold flex items-center justify-center hover:bg-gray-600 transition-colors disabled:cursor-not-allowed"
              disabled={!!value || !!winner || !isPlayerTurn}
              aria-label={`Square ${index + 1}${value ? `, marked as ${value}` : ''}`}
            >
              {value === 'X' && <span className="text-cyan-400">{value}</span>}
              {value === 'O' && <span className="text-amber-400">{value}</span>}
            </button>
          ))}
        </div>
        <p className="text-lg text-gray-300 h-8" aria-live="polite">{getStatusMessage()}</p>
        {(winner) && (
          <button onClick={resetGame} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg">
            Play Again
          </button>
        )}
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default TicTacToeModal;