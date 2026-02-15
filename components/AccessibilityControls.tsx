import React from 'react';

interface AccessibilityControlsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  splitSentences: boolean;
  setSplitSentences: (split: boolean) => void;
  readingRuler: boolean;
  setReadingRuler: (active: boolean) => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  fontSize,
  setFontSize,
  splitSentences,
  setSplitSentences,
  readingRuler,
  setReadingRuler,
}) => {
  return (
    <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center justify-between shadow-sm">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold uppercase text-indigo-900 mr-2 tracking-wide">Læsehjælp:</span>
        
        {/* Font Size Controls */}
        <div className="flex bg-white rounded-lg border border-indigo-200 overflow-hidden">
          <button 
            onClick={() => setFontSize(Math.max(1, fontSize - 0.1))}
            className="px-3 py-1.5 hover:bg-indigo-50 text-indigo-700 font-bold border-r border-indigo-100"
            aria-label="Formindsk tekst"
          >
            A-
          </button>
          <button 
            onClick={() => setFontSize(Math.min(2, fontSize + 0.1))}
            className="px-3 py-1.5 hover:bg-indigo-50 text-indigo-700 font-bold"
            aria-label="Forstør tekst"
          >
            A+
          </button>
        </div>

        {/* Sentence Splitter Toggle */}
        <button
          onClick={() => setSplitSentences(!splitSentences)}
          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${
            splitSentences 
              ? 'bg-indigo-600 text-white border-indigo-600' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Linjeskift v. punktum
        </button>

        {/* Reading Ruler Toggle */}
        <button
          onClick={() => setReadingRuler(!readingRuler)}
          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${
            readingRuler 
              ? 'bg-indigo-600 text-white border-indigo-600' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
          Læselinjal
        </button>
      </div>
    </div>
  );
};