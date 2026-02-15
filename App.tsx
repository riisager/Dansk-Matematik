import React, { useState, useEffect, useRef } from 'react';
import { generateStory } from './services/geminiService';
import { StoryData, LoadingState, ScoreEntry } from './types';
import { MathChallenge } from './components/MathChallenge';
import { ReadingChallenge } from './components/ReadingChallenge';
import { Scoreboard } from './components/Scoreboard';
import { AccessibilityControls } from './components/AccessibilityControls';

const App: React.FC = () => {
  // User state
  const [currentUser, setCurrentUser] = useState<string>(() => localStorage.getItem('mathStory_currentUser') || '');
  
  // App state
  const [topic, setTopic] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [data, setData] = useState<StoryData | null>(null);
  
  // Accessibility State
  const [fontSize, setFontSize] = useState(1.1); // rem
  const [splitSentences, setSplitSentences] = useState(false);
  const [readingRuler, setReadingRuler] = useState(false);
  const [rulerY, setRulerY] = useState(0);

  // Score state
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  // Individual solved states for the two challenges
  const [isMathSolved, setIsMathSolved] = useState(false);
  const [isReadingSolved, setIsReadingSolved] = useState(false);

  // Load scores when user changes
  useEffect(() => {
    if (currentUser) {
        const saved = localStorage.getItem(`mathStory_scores_${currentUser}`);
        setScores(saved ? JSON.parse(saved) : []);
    } else {
        setScores([]);
    }
  }, [currentUser]);

  // Track mouse for reading ruler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (readingRuler) {
        setRulerY(e.clientY);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingRuler]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('username') as HTMLInputElement;
    const name = input.value.trim();
    if (name) {
        localStorage.setItem('mathStory_currentUser', name);
        setCurrentUser(name);
    }
  };

  const handleLogout = () => {
    if(window.confirm("Vil du logge ud?")) {
        localStorage.removeItem('mathStory_currentUser');
        setCurrentUser('');
        setData(null);
        setTopic('');
        setLoadingState(LoadingState.IDLE);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoadingState(LoadingState.LOADING);
    setData(null);
    setIsMathSolved(false);
    setIsReadingSolved(false);

    try {
      const result = await generateStory(topic);
      setData(result);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleSurpriseMe = () => {
    // 6-dimensional generator for >2 million combinations
    const roller = [
      "En der altid passer sig selv", "Klassens klovn", "En outsider med en hemmelighed", 
      "En person i dyb sorg", "En der er vant til at få sin vilje", "En aktivist", 
      "En der føler sig overvåget", "En der lige er flyttet til byen", "En der har mistet alt", 
      "En perfektionist under pres", "En person der lever et dobbeltliv", "En sportsstjerne i krise"
    ]; 
  
    const stemninger = [
      "melankolsk", "hæsblæsende", "klaustrofobisk", "kynisk", "håbefuld", 
      "mareridtsagtig", "nostalgisk", "satirisk", "rå", "poetisk", "distanceret", "intens"
    ]; 
  
    const temaer = [
      "Digital hævn", "Brudt loyalitet", "Magtmisbrug", "Klimaskam", "Klasseskæl", 
      "Identitetskrise", "Uindfriet kærlighed", "En farlig løgn", "Generationernes kamp", 
      "Ensomhed i flokken", "Social kontrol", "Tabu", "Grådighed", "Tilgivelse"
    ]; 
  
    const steder = [
      "i en betonblok i Brøndby", "på bagsædet af en politibil", "i en fyldt biografsal", 
      "på kanten af en motorvejsbro", "i en luksusvilla i Nordsjælland", "i et omklædningsrum", 
      "på en Discord-server", "til en begravelse", "i en kø på McDonald's", 
      "under en teltlejr i regnvejr", "på et mørkt skolebibliotek", "i en lufthavnsterminal"
    ]; 
  
    const twists = [
      "hvor mobilen er gået død", "mens alle ser på", "hvor sandheden koster alt", 
      "og ingen tør gribe ind", "hvor tiden pludselig står stille", "og man opdager man er filmet", 
      "hvor en fremmed ved alt om dig", "og vejret afspejler indre kaos", "mens en alarm hyler i baggrunden",
      "hvor man må svigte sin bedste ven", "og intet er, som det ser ud på overfladen"
    ]; 
  
    const dilemmaer = [
      "Loyalitet vs. Sandhed", "Egoisme vs. Fællesskab", "Hævn vs. Tilgivelse", 
      "Tryghed vs. Frihed", "Facaden vs. Virkeligheden", "Digitalt vs. Analogt",
      "Retfærdighed vs. Lovlighed", "Popularitet vs. Integritet"
    ];

    const rRolle = roller[Math.floor(Math.random() * roller.length)];
    const rStemning = stemninger[Math.floor(Math.random() * stemninger.length)];
    const rTema = temaer[Math.floor(Math.random() * temaer.length)];
    const rSted = steder[Math.floor(Math.random() * steder.length)];
    const rTwist = twists[Math.floor(Math.random() * twists.length)];
    const rDilemma = dilemmaer[Math.floor(Math.random() * dilemmaer.length)];
    
    // Construct a complex prompt based on all dimensions
    const randomTopic = `Hovedperson: ${rRolle}. Stemning: ${rStemning}. Sted: ${rSted}. Tema: ${rTema}. Twist: ${rTwist}. Dilemma: ${rDilemma}.`;
    
    setTopic(randomTopic);
    
    setLoadingState(LoadingState.LOADING);
    setData(null);
    setIsMathSolved(false);
    setIsReadingSolved(false);

    generateStory(randomTopic).then(res => {
        setData(res);
        setLoadingState(LoadingState.SUCCESS);
    }).catch(() => setLoadingState(LoadingState.ERROR));
  };

  const addPoints = (points: number, type: string) => {
     if (!data) return;

     const newScore: ScoreEntry = {
        id: Date.now().toString() + Math.random().toString().slice(2),
        title: `${data.title} (${type})`,
        timestamp: Date.now(),
        points: points
    };
    
    const newScores = [newScore, ...scores];
    setScores(newScores);
    
    if (currentUser) {
        localStorage.setItem(`mathStory_scores_${currentUser}`, JSON.stringify(newScores));
    }
  };

  const handleMathSolve = () => {
    if (isMathSolved || !data) return;
    addPoints(10, 'Matematik');
    setIsMathSolved(true);
  };

  const handleReadingSolve = () => {
    if (isReadingSolved || !data) return;
    addPoints(10, 'Læsning');
    setIsReadingSolved(true);
  }

  const handleClearScores = () => {
    if(window.confirm("Er du sikker på, at du vil slette din historik?")) {
        setScores([]);
        if (currentUser) {
            localStorage.removeItem(`mathStory_scores_${currentUser}`);
        }
    }
  };

  // Logic to process text based on accessibility settings
  const renderStoryText = (text: string) => {
    if (!splitSentences) {
      // Standard paragraph rendering
      return text.split('\n').map((paragraph, idx) => (
        <p key={idx} className="mb-4" style={{ fontSize: `${fontSize}rem`, lineHeight: '1.6' }}>
          {paragraph}
        </p>
      ));
    } else {
      // Split by punctuation (. ! ?) followed by space or end of string
      const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
      
      return (
        <div className="space-y-4">
          {sentences.map((sentence, idx) => (
            <div 
              key={idx} 
              className="pl-4 border-l-4 border-indigo-100 py-1 hover:bg-indigo-50/50 transition-colors rounded-r"
              style={{ fontSize: `${fontSize}rem`, lineHeight: '1.5' }}
            >
              {sentence.trim()}
            </div>
          ))}
        </div>
      );
    }
  };

  // Login Screen
  if (!currentUser) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 flex items-center justify-center p-4 font-sans text-gray-800">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center border border-white/50 animate-fade-in-up">
                <div className="text-6xl mb-6">📚</div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 mb-4">
                    MathStory
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                    Indtast dit navn for at starte dit eventyr og gemme dine point.
                </p>
                <form onSubmit={handleLogin} className="relative">
                    <input 
                        name="username"
                        type="text" 
                        placeholder="Hvad hedder du?" 
                        className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition text-gray-900 bg-white text-center text-xl font-medium placeholder:text-gray-400 shadow-sm"
                        autoFocus
                        required
                        minLength={2}
                    />
                    <button 
                        type="submit"
                        className="w-full mt-4 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-0.5"
                    >
                        Start Nu →
                    </button>
                </form>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 text-gray-800 font-sans pb-12 relative overflow-x-hidden">
      
      {/* Reading Ruler Overlay */}
      {readingRuler && (
        <div 
          className="pointer-events-none fixed left-0 w-full h-16 bg-yellow-300/20 border-y border-yellow-400/50 z-50 mix-blend-multiply"
          style={{ top: rulerY - 32 }}
        ></div>
      )}

      {/* Header / Hero */}
      <header className="pt-8 pb-8 px-4 text-center relative max-w-6xl mx-auto">
        
        {/* User Profile / Logout */}
        <div className="absolute top-4 right-4 md:right-8 flex items-center gap-3">
            <div className="hidden sm:block text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Spiller</p>
                <p className="text-indigo-900 font-bold max-w-[100px] truncate">{currentUser}</p>
            </div>
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {currentUser.charAt(0).toUpperCase()}
            </div>
            <button 
                onClick={handleLogout}
                className="text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg transition"
                title="Log ud"
            >
                Log ud
            </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 mb-3 tracking-tight mt-12 md:mt-0">
          Fortællinger & Tal
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Skriv et emne, få en spændende historie, og løs gåden til sidst.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        
        {/* Input Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-8 border border-white/50">
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="F.eks. 'En spøgelseshistorie på et gammelt slot'..."
              className="flex-grow px-5 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition text-gray-900 bg-white shadow-sm placeholder-gray-400"
            />
            <div className="flex gap-2">
                <button
                type="submit"
                disabled={loadingState === LoadingState.LOADING}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                {loadingState === LoadingState.LOADING ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : "Fortæl!"}
                </button>
                <button
                    type="button"
                    onClick={handleSurpriseMe}
                    disabled={loadingState === LoadingState.LOADING}
                    className="px-4 py-3 bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold rounded-xl transition flex items-center justify-center"
                    title="Overrask mig"
                >
                    🎲
                </button>
            </div>
          </form>
        </div>

        {/* Error State */}
        {loadingState === LoadingState.ERROR && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8 text-center">
            Hov, der skete en fejl. Prøv igen eller vælg et andet emne.
          </div>
        )}

        {/* Content Section */}
        {data && loadingState === LoadingState.SUCCESS && (
          <div className="animate-fade-in-up">
            
            {/* Accessibility Controls */}
            <AccessibilityControls 
              fontSize={fontSize}
              setFontSize={setFontSize}
              splitSentences={splitSentences}
              setSplitSentences={setSplitSentences}
              readingRuler={readingRuler}
              setReadingRuler={setReadingRuler}
            />

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8">
              {/* Decorative Banner */}
              <div className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              <div className="p-8 md:p-10">
                
                {/* Title */}
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                  {data.title}
                </h2>

                {/* Story Text */}
                <div className="prose prose-lg text-gray-700 font-serif leading-relaxed mb-8 max-w-none">
                  {renderStoryText(data.story_text)}
                </div>

                {/* Fact Box */}
                <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-lg mb-8">
                  <h4 className="text-amber-800 font-bold text-sm uppercase tracking-wide mb-1">
                    Virkelighedens Verden
                  </h4>
                  <p className="text-amber-900 text-sm leading-relaxed" style={{ fontSize: `${Math.max(0.875, fontSize - 0.15)}rem` }}>
                    {data.real_world_fact}
                  </p>
                </div>

              </div>
            </div>

            {/* Challenges Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
                <ReadingChallenge 
                  questionData={data.reading_question}
                  onSolve={handleReadingSolve}
                  isSolved={isReadingSolved}
                />
                <MathChallenge 
                    problem={data.math_problem} 
                    onSolve={handleMathSolve}
                    isSolved={isMathSolved}
                />
            </div>

          </div>
        )}

        {/* Empty State / Loading Placeholder */}
        {loadingState === LoadingState.LOADING && (
           <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 animate-pulse mb-8">
             <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
             <div className="space-y-3">
               <div className="h-4 bg-gray-200 rounded w-full"></div>
               <div className="h-4 bg-gray-200 rounded w-full"></div>
               <div className="h-4 bg-gray-200 rounded w-5/6"></div>
               <div className="h-4 bg-gray-200 rounded w-full"></div>
             </div>
             <div className="h-24 bg-gray-100 rounded mt-8"></div>
           </div>
        )}

        {/* Scoreboard */}
        <Scoreboard scores={scores} onClear={handleClearScores} />

      </main>

      <footer className="text-center text-gray-400 text-sm mt-16">
        Built by Søren Riisager
      </footer>
    </div>
  );
};

export default App;