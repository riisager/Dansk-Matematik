import React, { useState, useEffect } from 'react';
import { StoryData } from '../types';

interface ReadingChallengeProps {
  questionData: StoryData['reading_question'];
  onSolve: () => void;
  isSolved: boolean;
}

export const ReadingChallenge: React.FC<ReadingChallengeProps> = ({ questionData, onSolve, isSolved }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  // Reset internal state if the problem changes (new story)
  useEffect(() => {
    setSelectedOption(null);
    setFeedback('idle');
  }, [questionData]);

  const handleOptionClick = (index: number) => {
    if (isSolved) return; // Prevent changing answer after solved
    
    setSelectedOption(index);
    
    if (index === questionData.correct_option_index) {
      setFeedback('correct');
      onSolve();
    } else {
      setFeedback('incorrect');
    }
  };

  return (
    <div className="bg-pink-50 border border-pink-100 rounded-xl p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-pink-900 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Læseforståelse
        </h3>
        <p className="text-gray-700 mb-4 italic">{questionData.question}</p>
      </div>

      <div className="mt-auto">
        <div className="space-y-3">
          {questionData.options.map((option, index) => {
            let btnClass = "w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 text-sm md:text-base ";
            
            if (isSolved && index === questionData.correct_option_index) {
              // Correct answer revealed/confirmed
              btnClass += "bg-green-100 border-green-300 text-green-800 font-bold shadow-sm";
            } else if (feedback === 'incorrect' && index === selectedOption) {
              // Selected wrong answer
              btnClass += "bg-red-100 border-red-300 text-red-800";
            } else if (isSolved) {
               // Other options when solved
               btnClass += "bg-white border-gray-100 text-gray-400 opacity-60";
            } else {
              // Default interactive state
              btnClass += "bg-white border-gray-200 hover:border-pink-300 hover:bg-pink-50 text-gray-800 hover:shadow-sm";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isSolved}
                className={btnClass}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            );
          })}
        </div>

        {feedback === 'correct' && (
           <div className="mt-4 text-center text-green-700 font-bold animate-bounce-short text-sm">
             Korrekt! Godt læst!
           </div>
        )}
        
        {feedback === 'incorrect' && !isSolved && (
          <p className="text-red-500 mt-3 text-sm font-medium animate-pulse text-center">
              Det var ikke helt rigtigt. Prøv at læse teksten igen.
          </p>
        )}
      </div>
    </div>
  );
};