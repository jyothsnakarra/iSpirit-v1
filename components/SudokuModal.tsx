
import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

const SudokuModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-purple-500/50 rounded-2xl p-8 w-full max-w-md shadow-2xl relative text-center animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-purple-400 mb-4">Sudoku</h2>
        <div className='flex flex-col items-center justify-center min-h-[200px]'>
            <p className='text-6xl mb-4' aria-hidden="true">🧘</p>
            <h3 className='text-xl font-semibold mt-4'>Coming Soon!</h3>
            <p className='text-gray-300 mt-2'>A relaxing Sudoku puzzle is being prepared for you.</p>
            <button onClick={onClose} className='mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg'>
                Close
            </button>
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

export default SudokuModal;
