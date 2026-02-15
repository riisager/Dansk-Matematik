import React from 'react';
import { ScoreEntry } from '../types';

interface ScoreboardProps {
  scores: ScoreEntry[];
  onClear: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ scores, onClear }) => {
  if (scores.length === 0) return null;

  const sortedScores = [...scores].sort((a, b) => b.timestamp - a.timestamp);
  const totalPoints = scores.reduce((sum, entry) => sum + entry.points, 0);

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 mt-8 border border-white/50 animate-fade-in-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span>🏆</span> Scoreboard
        </h3>
        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
          Total: {totalPoints} point
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full text-left text-sm bg-white">
          <thead className="bg-gray-50">
            <tr className="text-gray-500">
              <th className="px-4 py-3 font-medium">Dato</th>
              <th className="px-4 py-3 font-medium">Historie</th>
              <th className="px-4 py-3 font-medium text-right">Point</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedScores.map((score) => (
              <tr key={score.id} className="group hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {new Date(score.timestamp).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{score.title}</td>
                <td className="px-4 py-3 text-right font-bold text-green-600">+{score.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-right">
        <button 
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-600 underline transition-colors"
        >
          Nulstil score
        </button>
      </div>
    </div>
  );
};