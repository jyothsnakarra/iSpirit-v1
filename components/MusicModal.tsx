import React, { useState } from 'react';
import { Song } from '../types';
import { getMusicSuggestions } from '../services/geminiService';
import { CloseIcon } from './icons/CloseIcon';

interface MusicModalProps {
  onClose: () => void;
}

const genres = ['Chill Lo-fi', 'Upbeat Pop', 'Focus Ambient', 'Workout Electronic', 'Indie Acoustic', 'Classic Rock'];

const MusicModal: React.FC<MusicModalProps> = ({ onClose }) => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenreSelect = async (genre: string) => {
    setSelectedGenre(genre);
    setIsLoading(true);
    const result = await getMusicSuggestions(genre);
    setSuggestions(result);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800/80 border border-purple-500/30 rounded-2xl shadow-xl w-full max-w-md p-6 m-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <CloseIcon />
        </button>

        {!selectedGenre ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">What's your mood?</h2>
            <div className="grid grid-cols-2 gap-4">
              {genres.map(genre => (
                <button key={genre} onClick={() => handleGenreSelect(genre)} className="p-4 bg-purple-600/50 hover:bg-purple-600 rounded-lg transition-all text-center">
                  {genre}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Suggestions for <span className="text-purple-400">{selectedGenre}</span></h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                 <div className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.15s] mx-2"></div>
                 <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
              </div>
            ) : (
              <ul className="space-y-3">
                {suggestions.length > 0 ? suggestions.map((song, index) => (
                  <li key={index} className="bg-black/20 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{song.title}</p>
                      <p className="text-sm text-gray-400">{song.artist}</p>
                    </div>
                  </li>
                )) : <p className="text-center text-gray-400">Couldn't find any suggestions. Try another genre!</p>}
              </ul>
            )}
             <button onClick={() => setSelectedGenre(null)} className="mt-6 w-full px-4 py-2 text-sm bg-black/20 rounded-full hover:bg-black/40 transition-colors">Back to Genres</button>
          </>
        )}
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

export default MusicModal;
