import React from 'react';

interface PersonalitySelectionProps {
  onSelect: (personality: string) => void;
}

const personalities = [
    { name: 'Zen Companion', description: 'Calm, mindful, and supportive.' },
    { name: 'Creative Muse', description: 'Imaginative, inspiring, and artistic.' },
    { name: 'Witty Pal', description: 'Humorous, clever, and playful.' },
    { name: 'Wise Sage', description: 'Knowledgeable, insightful, and thoughtful.' },
];

const PersonalitySelection: React.FC<PersonalitySelectionProps> = ({ onSelect }) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white font-sans animate-fade-in">
        <div className="text-center max-w-2xl p-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Companion's Personality</h1>
            <p className="text-lg text-gray-400 mb-10">Select a personality that best suits your mood for today's conversation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {personalities.map(p => (
                    <button
                        key={p.name}
                        onClick={() => onSelect(p.name)}
                        className="p-6 bg-gray-800/80 border border-purple-500/30 rounded-xl text-left hover:bg-purple-900/40 hover:border-purple-500 transition-all duration-300 transform hover:scale-105"
                    >
                        <h2 className="text-xl font-semibold text-purple-300">{p.name}</h2>
                        <p className="text-gray-300 mt-2">{p.description}</p>
                    </button>
                ))}
            </div>
        </div>
        <style>{`
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        `}</style>
    </div>
  );
};

export default PersonalitySelection;
