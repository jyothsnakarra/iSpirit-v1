import React from 'react';

const CONFETTI_COUNT = 100;
const COLORS = ['#a855f7', '#8b5cf6', '#ec4899', '#f97316', '#22d3ee'];

const confetti = Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
  id: i,
  color: COLORS[i % COLORS.length],
  left: `${Math.random() * 100}%`,
  animationDuration: `${Math.random() * 3 + 2}s`,
  animationDelay: `${Math.random() * 2}s`,
}));

export const Confetti: React.FC = () => {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-hidden">
        {confetti.map(c => (
          <div
            key={c.id}
            className="absolute top-[-20px] w-2 h-4 animate-fall"
            style={{
              left: c.left,
              backgroundColor: c.color,
              animationDuration: c.animationDuration,
              animationDelay: c.animationDelay,
            }}
          ></div>
        ))}
      </div>
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotateZ(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: 1;
        }
      `}</style>
    </>
  );
};