
import React from 'react';

interface HomeScreenProps {
  onStart: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="space-y-4">
        <h1 className="text-6xl md:text-8xl font-bold text-sky-600 drop-shadow-sm">
          Roar & Read! 🦖
        </h1>
        <p className="text-2xl md:text-3xl text-sky-800 opacity-80">
          Learn fun dinosaur words!
        </p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-green-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <button
          onClick={onStart}
          className="relative px-12 py-6 bg-white rounded-full text-4xl font-bold text-sky-600 hover:text-green-600 transition-colors shadow-xl active:scale-95"
        >
          Start Reading! 🚀
        </button>
      </div>

      <div className="flex space-x-4">
        <span className="text-5xl animate-bounce delay-75">🦕</span>
        <span className="text-5xl animate-bounce delay-150">🦴</span>
        <span className="text-5xl animate-bounce delay-300">🌋</span>
      </div>
    </div>
  );
};
