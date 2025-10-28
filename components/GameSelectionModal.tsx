import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import RiddleModal from './RiddleModal';
import TicTacToeModal from './TicTacToeModal';
import SudokuModal from './SudokuModal';
import MinesweeperModal from './MinesweeperModal';
import ConnectStarsModal from './ConnectStarsModal';
import MindFeudModal from './MindFeudModal';
import DebateClubModal from './DebateClubModal';
import StickmanModal from './StickmanModal';

interface GameSelectionModalProps {
  onClose: () => void;
}

type Game = 'riddle' | 'tictactoe' | 'sudoku' | 'minesweeper' | 'connect' | 'feud' | 'debate' | 'stickman';

const games = [
    { id: 'riddle', name: 'Riddle Me This' },
    { id: 'stickman', name: "Stickman's Fate" },
    { id: 'tictactoe', name: 'Tic-Tac-Toe' },
    { id: 'connect', name: 'Connect the Stars' },
    { id: 'feud', name: 'Mind Feud' },
    { id: 'debate', name: 'Debate Club' },
    { id: 'sudoku', name: 'Sudoku' },
    { id: 'minesweeper', name: 'Minesweeper' },
] as const;

const GameSelectionModal: React.FC<GameSelectionModalProps> = ({ onClose }) => {
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  const renderGame = () => {
    switch (activeGame) {
      case 'riddle':
        return <RiddleModal onClose={() => setActiveGame(null)} />;
      case 'tictactoe':
        return <TicTacToeModal onClose={() => setActiveGame(null)} />;
      case 'sudoku':
        return <SudokuModal onClose={() => setActiveGame(null)} />;
      case 'minesweeper':
        return <MinesweeperModal onClose={() => setActiveGame(null)} />;
       case 'connect':
        return <ConnectStarsModal onClose={() => setActiveGame(null)} />;
      case 'feud':
        return <MindFeudModal onClose={() => setActiveGame(null)} />;
      case 'debate':
        return <DebateClubModal onClose={() => setActiveGame(null)} />;
      case 'stickman':
        return <StickmanModal onClose={() => setActiveGame(null)} />;
      default:
        return null;
    }
  };

  if (activeGame) {
    return renderGame();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800/80 border border-purple-500/30 rounded-2xl shadow-xl w-full max-w-lg p-6 m-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Game Arena</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {games.map(game => (
             <button key={game.id} onClick={() => setActiveGame(game.id)} className="p-4 bg-purple-600/50 hover:bg-purple-600 rounded-lg transition-all text-center transform hover:scale-105">
                {game.name}
             </button>
          ))}
        </div>
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

export default GameSelectionModal;