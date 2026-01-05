
import React, { useState } from 'react';
import { Screen, UserProgress } from './types';
import { HomeScreen } from './components/HomeScreen';
import { PracticeScreen } from './components/PracticeScreen';
import { RewardsScreen } from './components/RewardsScreen';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('HOME');
  const [progress, setProgress] = useState<UserProgress>({
    currentWordIndex: 0,
    completedWordIndices: new Set(),
    userRecordings: {},
    stars: 0
  });

  const handleUpdateProgress = (updates: Partial<UserProgress>) => {
    setProgress(prev => ({ ...prev, ...updates }));
  };

  const resetApp = () => {
    setProgress({
      currentWordIndex: 0,
      completedWordIndices: new Set(),
      userRecordings: {},
      stars: 0
    });
    setScreen('HOME');
  };

  return (
    <div className="min-h-screen bg-sky-50 selection:bg-sky-200">
      {/* Global Header */}
      <header className="p-4 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center space-x-2">
          <span className="text-3xl md:text-4xl">🦖</span>
          <span className="text-xl md:text-2xl font-bold text-sky-600">Roar & Read</span>
        </div>
        
        {screen !== 'HOME' && (
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-sky-100">
            <span className="text-2xl mr-2">⭐</span>
            <span className="text-xl font-bold text-sky-800">{progress.stars}</span>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto pb-20">
        {screen === 'HOME' && (
          <HomeScreen onStart={() => setScreen('PRACTICE')} />
        )}

        {screen === 'PRACTICE' && (
          <PracticeScreen 
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onFinish={() => setScreen('REWARDS')}
          />
        )}

        {screen === 'REWARDS' && (
          <RewardsScreen 
            stars={progress.stars}
            onRestart={resetApp}
          />
        )}
      </main>

      <footer className="fixed bottom-0 w-full p-4 text-center text-sky-400 text-sm opacity-50 select-none">
        Elementary English Practice • Let's Learn Together!
      </footer>
    </div>
  );
};

export default App;
