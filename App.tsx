import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import DailyWisdom from './components/DailyWisdom';
import GameModal from './components/GameModal';
import MusicModal from './components/MusicModal';
import { GameState, MusicState, GameType } from './types';
import TicTacToeModal from './components/TicTacToeModal';
import SudokuModal from './components/SudokuModal';

function App() {
  const [gameState, setGameState] = useState<GameState>({ type: null, isActive: false });
  const [musicState, setMusicState] = useState<MusicState>({ query: null, isActive: false });

  const handlePlayGame = (gameType: GameType) => {
    setGameState({ type: gameType, isActive: true });
  };

  const handlePlayMusic = (query: string) => {
    setMusicState({ query, isActive: true });
  };

  const closeGame = () => setGameState({ type: null, isActive: false });
  const closeMusic = () => setMusicState({ query: null, isActive: false });

  const renderGameModal = () => {
    if (!gameState.isActive) return null;

    switch (gameState.type) {
      case GameType.MEMORY:
        return <GameModal onClose={closeGame} />;
      case GameType.TIC_TAC_TOE:
        return <TicTacToeModal onClose={closeGame} />;
      case GameType.SUDOKU:
        return <SudokuModal onClose={closeGame} />;
      default:
        return null;
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 min-h-screen text-white font-sans flex flex-col items-center justify-center p-4 selection:bg-purple-500 selection:text-white">
      <DailyWisdom />
      <div className="w-full max-w-4xl h-[95vh] flex flex-col bg-black bg-opacity-30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <h1 className="text-2xl font-bold tracking-wider">iSpirit</h1>
          </div>
        </header>
        <main className="flex-grow p-4 md:p-6 overflow-y-auto">
          <ChatWindow onPlayGame={handlePlayGame} onPlayMusic={handlePlayMusic} />
        </main>
      </div>
      {renderGameModal()}
      {musicState.isActive && musicState.query && <MusicModal query={musicState.query} onClose={closeMusic} />}
       <footer className="text-center text-xs text-gray-400 mt-4">
        Created with Gemini API. For entertainment purposes only.
      </footer>
    </div>
  );
}

export default App;