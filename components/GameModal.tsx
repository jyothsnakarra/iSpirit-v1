import React from 'react';
import ComingSoonModal from './ComingSoonModal';

interface GameModalProps {
    onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ onClose }) => {
    return <ComingSoonModal onBack={onClose} featureName="This game" />;
};

export default GameModal;
