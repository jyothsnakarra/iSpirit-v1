import React from 'react';

interface ComingSoonModalProps {
  onBack: () => void;
  featureName?: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ onBack, featureName = "This feature" }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800/80 border border-purple-500/30 rounded-2xl shadow-xl w-full max-w-xs p-8 m-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
        <p className="text-gray-300 mb-6">{featureName} is under construction. Check back later!</p>
        <button onClick={onBack} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors">
          Back
        </button>
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

export default ComingSoonModal;
