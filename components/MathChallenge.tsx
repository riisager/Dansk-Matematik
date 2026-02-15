import React, { useState, useEffect } from 'react';
import { StoryData } from '../types';

interface MathChallengeProps {
  problem: StoryData['math_problem'];
  onSolve: () => void;
  isSolved: boolean;
}

export const MathChallenge: React.FC<MathChallengeProps> = ({ problem, onSolve, isSolved }) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  // Reset internal state if the problem changes (new story)
  useEffect(() => {
    setUserAnswer('');
    setFeedback('idle');
  }, [problem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSolved) return;

    const numAnswer = parseFloat(userAnswer.replace(',', '.'));
    
    // Allow a small margin of error for float calculations
    if (!isNaN(numAnswer) && Math.abs(numAnswer - problem.answer) < 0.01) {
      setFeedback('correct');
      onSolve();
    } else {
      setFeedback('incorrect');
    }
  };

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Dagens Udfordring
        </h3>
        <p className="text-gray-700 mb-4 italic">{problem.question}</p>
      </div>

      {(isSolved || feedback === 'correct') ? (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg flex flex-col items-center animate-fade-in border border-green-200 mt-auto">
          <p className="font-bold text-lg">Helt rigtigt! 🎉</p>
          <p>Svaret var {problem.answer} {problem.unit}</p>
          <div className="mt-2 text-indigo-600 font-bold bg-white/60 px-3 py-1 rounded-full text-xs uppercase tracking-wide">
             Score opdateret!
          </div>
        </div>
      ) : (
        <div className="mt-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative w-full">
              <input
                type="number"
                step="any"
                value={userAnswer}
                onChange={(e) => {
                    setUserAnswer(e.target.value);
                    setFeedback('idle');
                }}
                placeholder="Indtast dit svar..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              {problem.unit && (
                <span className="absolute right-3 top-3 text-gray-400 text-sm pointer-events-none bg-white pl-1">
                  {problem.unit}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md whitespace-nowrap"
            >
              Tjek Svar
            </button>
          </form>
          
          {feedback === 'incorrect' && !isSolved && (
            <p className="text-red-500 mt-3 text-sm font-medium animate-pulse text-center">
                Det var ikke helt rigtigt. Prøv igen! (Husk at bruge punktum eller komma)
            </p>
          )}
        </div>
      )}
    </div>
  );
};