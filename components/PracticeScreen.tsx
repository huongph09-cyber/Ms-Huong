
import React, { useState, useRef, useEffect } from 'react';
import { WordItem, UserProgress } from '../types';
import { LESSON_WORDS, ENCOURAGEMENTS } from '../constants';
import { geminiService } from '../services/geminiService';

interface PracticeScreenProps {
  progress: UserProgress;
  onUpdateProgress: (updates: Partial<UserProgress>) => void;
  onFinish: () => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  progress,
  onUpdateProgress,
  onFinish
}) => {
  const currentWordIndex = progress.currentWordIndex;
  const currentWord = LESSON_WORDS[currentWordIndex];

  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [encouragement, setEncouragement] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Cleanup encouragement on word change
  useEffect(() => {
    setEncouragement(null);
    setHasRecorded(!!progress.userRecordings[currentWordIndex]);
  }, [currentWordIndex]);

  const playModel = async () => {
    setIsPlayingModel(true);
    await geminiService.playWordPronunciation(currentWord.word);
    setIsPlayingModel(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newRecordings = { ...progress.userRecordings, [currentWordIndex]: audioUrl };
        const newCompleted = new Set(progress.completedWordIndices);
        const addedStar = !newCompleted.has(currentWordIndex);
        newCompleted.add(currentWordIndex);

        onUpdateProgress({
          userRecordings: newRecordings,
          completedWordIndices: newCompleted,
          stars: progress.stars + (addedStar ? 1 : 0)
        });

        setHasRecorded(true);
        // Set random encouragement
        const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
        setEncouragement(msg);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Please allow microphone access to record your voice!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const playUserRecording = () => {
    const url = progress.userRecordings[currentWordIndex];
    if (url) {
      const audio = new Audio(url);
      audio.play();
    }
  };

  const handleNext = () => {
    if (currentWordIndex < LESSON_WORDS.length - 1) {
      onUpdateProgress({ currentWordIndex: currentWordIndex + 1 });
    } else {
      onFinish();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 py-8 px-4 animate-in slide-in-from-right duration-500">
      {/* Progress Bar */}
      <div className="w-full max-w-md bg-white rounded-full h-4 overflow-hidden shadow-inner border border-sky-200">
        <div 
          className="bg-green-500 h-full transition-all duration-500" 
          style={{ width: `${((currentWordIndex + 1) / LESSON_WORDS.length) * 100}%` }}
        />
      </div>

      <div className="text-center space-y-2">
        <p className="text-sky-400 font-bold uppercase tracking-widest">Word {currentWordIndex + 1} of {LESSON_WORDS.length}</p>
        <h2 className="text-7xl md:text-9xl font-bold text-sky-600 capitalize py-10 drop-shadow-sm select-none">
          {currentWord.word}
        </h2>
      </div>

      {encouragement && (
        <div className="animate-bounce-short text-3xl font-bold text-green-600 bg-green-50 px-6 py-2 rounded-full border-2 border-green-200">
          {encouragement}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-lg">
        {/* Listen Button */}
        <button
          onClick={playModel}
          disabled={isPlayingModel}
          className={`flex flex-col items-center justify-center p-6 rounded-3xl shadow-lg transition-all active:scale-95 ${
            isPlayingModel ? 'bg-gray-100 text-gray-400' : 'bg-sky-500 text-white hover:bg-sky-600'
          }`}
        >
          <span className="text-5xl mb-2">🔊</span>
          <span className="font-bold text-xl uppercase">Listen</span>
        </button>

        {/* Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex flex-col items-center justify-center p-6 rounded-3xl shadow-lg transition-all active:scale-95 ${
            isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          <span className="text-5xl mb-2">{isRecording ? '⏹' : '🎤'}</span>
          <span className="font-bold text-xl uppercase">{isRecording ? 'Stop' : 'Read'}</span>
        </button>

        {/* Playback Button */}
        <button
          onClick={playUserRecording}
          disabled={!hasRecorded}
          className={`flex flex-col items-center justify-center p-6 rounded-3xl shadow-lg transition-all active:scale-95 col-span-2 md:col-span-1 ${
            !hasRecorded ? 'bg-gray-100 text-gray-300' : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          <span className="text-5xl mb-2">▶️</span>
          <span className="font-bold text-xl uppercase">My Voice</span>
        </button>
      </div>

      {hasRecorded && (
        <button
          onClick={handleNext}
          className="mt-8 px-12 py-5 bg-sky-600 text-white rounded-full text-3xl font-bold shadow-xl hover:bg-sky-700 transition-colors animate-in zoom-in"
        >
          {currentWordIndex === LESSON_WORDS.length - 1 ? 'Finish! 🏁' : 'Next Word ➡️'}
        </button>
      )}
    </div>
  );
};
