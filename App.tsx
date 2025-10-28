import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import DailyWisdom from './components/DailyWisdom';
import GameSelectionModal from './components/GameSelectionModal';
import MusicModal from './components/MusicModal';
import PersonalitySelection from './components/PersonalitySelection';
import { themes, Theme } from './themes';

const App: React.FC = () => {
  const [modal, setModal] = useState<'music' | 'games' | null>(null);
  const [personality, setPersonality] = useState<string>('Default');
  const [showPersonalitySelection, setShowPersonalitySelection] = useState<boolean>(true);
  const [theme] = useState<Theme>(themes.deepSpace);

  useEffect(() => {
    document.body.style.backgroundImage = theme.gradient;
  }, [theme]);

  const handleSelectPersonality = (p: string) => {
    setPersonality(p);
    setShowPersonalitySelection(false);
  };

  const closeModal = () => setModal(null);

  if (showPersonalitySelection) {
    return <PersonalitySelection onSelect={handleSelectPersonality} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center text-white font-sans overflow-hidden">
      <ChatWindow
        onOpenMusic={() => setModal('music')}
        onOpenGames={() => setModal('games')}
        personality={personality}
      />

      <DailyWisdom />

      {modal === 'music' && <MusicModal onClose={closeModal} />}
      {modal === 'games' && <GameSelectionModal onClose={closeModal} />}
    </div>
  );
};

export default App;
