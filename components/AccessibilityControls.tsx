import React from 'react';

interface AccessibilityControlsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
  colorTheme: 'light' | 'sepia' | 'dark' | 'contrast';
  setColorTheme: (theme: 'light' | 'sepia' | 'dark' | 'contrast') => void;
  splitSentences: boolean;
  setSplitSentences: (split: boolean) => void;
  readingRuler: boolean;
  setReadingRuler: (active: boolean) => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  colorTheme,
  setColorTheme,
  splitSentences,
  setSplitSentences,
  readingRuler,
  setReadingRuler,
}) => {
  return (
    <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between shadow-sm">
      
      {/* Group 1: Visual Appearance */}
      <div className="flex flex-wrap gap-4 items-center">
        
        {/* Font Size */}
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-indigo-900 tracking-wide">Tekst:</span>
            <div className="flex bg-white rounded-lg border border-indigo-200 overflow-hidden shadow-sm">
            <button 
                onClick={() => setFontSize(Math.max(1, fontSize - 0.1))}
                className="px-3 py-1.5 hover:bg-indigo-50 text-indigo-700 font-bold border-r border-indigo-100"
                aria-label="Formindsk tekst"
                title="Mindre tekst"
            >
                A-
            </button>
            <button 
                onClick={() => setFontSize(Math.min(2, fontSize + 0.1))}
                className="px-3 py-1.5 hover:bg-indigo-50 text-indigo-700 font-bold"
                aria-label="Forstør tekst"
                title="Større tekst"
            >
                A+
            </button>
            </div>
        </div>

        {/* Line Height */}
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-indigo-900 tracking-wide">Linjer:</span>
            <div className="flex bg-white rounded-lg border border-indigo-200 overflow-hidden shadow-sm">
            <button 
                onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.2))}
                className="px-3 py-1.5 hover:bg-indigo-50 text-indigo-700 font-medium border-r border-indigo-100 flex items-center justify-center"
                aria-label="Mindre linjeafstand"
                title="Mindre afstand"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
               </svg>
            </button>
            <button 
                onClick={() => setLineHeight(Math.min(2.4, lineHeight + 0.2))}
                className="px-3 py-1.5 hover:bg-indigo-50 text-indigo-700 font-medium flex items-center justify-center"
                aria-label="Større linjeafstand"
                title="Større afstand"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
               </svg>
            </button>
            </div>
        </div>

        {/* Color Theme */}
         <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-indigo-900 tracking-wide">Tema:</span>
            <div className="flex gap-1">
                <button 
                    onClick={() => setColorTheme('light')}
                    className={`w-6 h-6 rounded-full border shadow-sm ${colorTheme === 'light' ? 'ring-2 ring-indigo-500 ring-offset-2' : 'border-gray-300'}`}
                    style={{ backgroundColor: '#ffffff' }}
                    title="Lyst tema"
                />
                <button 
                    onClick={() => setColorTheme('sepia')}
                    className={`w-6 h-6 rounded-full border shadow-sm ${colorTheme === 'sepia' ? 'ring-2 ring-indigo-500 ring-offset-2' : 'border-amber-200'}`}
                    style={{ backgroundColor: '#f4ecd8' }}
                    title="Sepia tema"
                />
                 <button 
                    onClick={() => setColorTheme('dark')}
                    className={`w-6 h-6 rounded-full border shadow-sm ${colorTheme === 'dark' ? 'ring-2 ring-indigo-500 ring-offset-2' : 'border-gray-600'}`}
                    style={{ backgroundColor: '#1f2937' }}
                    title="Mørkt tema"
                />
                 <button 
                    onClick={() => setColorTheme('contrast')}
                    className={`w-6 h-6 rounded-full border shadow-sm ${colorTheme === 'contrast' ? 'ring-2 ring-indigo-500 ring-offset-2' : 'border-yellow-400'}`}
                    style={{ backgroundColor: '#fde047' }}
                    title="Høj kontrast"
                />
            </div>
         </div>
      </div>

      {/* Group 2: Tools */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold uppercase text-indigo-900 tracking-wide mr-1">Værktøjer:</span>
        
        <button
          onClick={() => setSplitSentences(!splitSentences)}
          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 shadow-sm ${
            splitSentences 
              ? 'bg-indigo-600 text-white border-indigo-600' 
              : 'bg-white text-gray-700 border-indigo-200 hover:bg-indigo-50'
          }`}
          title="Vis én sætning per linje"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <span className="hidden sm:inline">Linjeskift</span>
        </button>

        <button
          onClick={() => setReadingRuler(!readingRuler)}
          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 shadow-sm ${
            readingRuler 
              ? 'bg-indigo-600 text-white border-indigo-600' 
              : 'bg-white text-gray-700 border-indigo-200 hover:bg-indigo-50'
          }`}
          title="Fremhæv læselinjen med musen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
          <span className="hidden sm:inline">Linjal</span>
        </button>
      </div>
    </div>
  );
};