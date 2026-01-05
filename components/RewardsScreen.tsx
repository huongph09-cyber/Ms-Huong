
import React from 'react';

interface RewardsScreenProps {
  stars: number;
  onRestart: () => void;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({ stars, onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 space-y-8 animate-in fade-in zoom-in duration-700">
      <div className="space-y-4">
        <h1 className="text-6xl md:text-7xl font-bold text-sky-600">
          Amazing Job! 🎉
        </h1>
        <p className="text-2xl md:text-3xl text-sky-800 opacity-80">
          You finished the lesson! 🚀
        </p>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-yellow-400 relative">
         <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-7xl animate-bounce">
            🎖️
         </div>
         
         <div className="mt-4 space-y-4">
            <h2 className="text-4xl font-bold text-sky-700">Your Badge</h2>
            <div className="text-9xl mb-4">🦖👑</div>
            <p className="text-2xl font-bold text-orange-500">Dinosaur Word Expert!</p>
         </div>

         <div className="mt-8 pt-8 border-t border-sky-100">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-4xl">⭐</span>
              <span className="text-5xl font-bold text-sky-800">{stars} Stars Earned!</span>
            </div>
         </div>
      </div>

      <button
        onClick={onRestart}
        className="px-10 py-5 bg-sky-500 text-white rounded-full text-3xl font-bold shadow-lg hover:bg-sky-600 transition-colors active:scale-95"
      >
        Play Again 🔄
      </button>
    </div>
  );
};
