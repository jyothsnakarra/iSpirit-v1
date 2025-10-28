
import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface MusicModalProps {
  query: string;
  onClose: () => void;
}

const MusicModal: React.FC<MusicModalProps> = ({ query, onClose }) => {
  const embedUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-purple-500/50 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative text-center animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-purple-400 mb-4">A Moment for Music</h2>
        <p className="text-gray-300 mb-6">Playing suggestions for: <span className="font-semibold">{query}</span></p>
        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg border-0"
          ></iframe>
        </div>
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

export default MusicModal;
