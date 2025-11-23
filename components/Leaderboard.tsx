
import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';
import Avatar from './Avatar';
import { Trophy, ArrowLeft, Star, List, Medal } from 'lucide-react';
import { RANK_THRESHOLDS } from '../constants';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, onBack }) => {
  const [activeTab, setActiveTab] = useState<'scores' | 'ranks'>('scores');
  
  // Helper to map stored string rank to visual style
  const getRankBadge = (rankName: string | undefined) => {
    // Default to white if legacy data or undefined
    const name = rankName || 'White'; 
    
    let colorClass = 'bg-gray-100 text-gray-600 border-gray-300';
    let icon = '⚪';

    if (name === 'Diamond') { colorClass = 'bg-cyan-100 text-cyan-700 border-cyan-400'; icon = '💎'; }
    else if (name === 'Gold') { colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-400'; icon = '🥇'; }
    else if (name === 'Silver') { colorClass = 'bg-slate-100 text-slate-700 border-slate-300'; icon = '🥈'; }
    else if (name === 'Bronze') { colorClass = 'bg-orange-100 text-orange-800 border-orange-300'; icon = '🥉'; }

    return (
        <div className={`px-2 py-1 rounded-md border text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${colorClass}`}>
            <span>{icon}</span> {name}
        </div>
    );
  };

  // Rank definitions for the guide
  const RANKS_INFO = [
    { name: 'Diamond', icon: '💎', stars: `${RANK_THRESHOLDS.DIAMOND}+`, color: 'bg-cyan-100 text-cyan-700 border-cyan-400', desc: 'The Ultimate Detective!' },
    { name: 'Gold', icon: '🥇', stars: `${RANK_THRESHOLDS.GOLD}+`, color: 'bg-yellow-100 text-yellow-700 border-yellow-400', desc: 'Expert Investigator' },
    { name: 'Silver', icon: '🥈', stars: `${RANK_THRESHOLDS.SILVER}+`, color: 'bg-slate-100 text-slate-700 border-slate-300', desc: 'Skilled Agent' },
    { name: 'Bronze', icon: '🥉', stars: `${RANK_THRESHOLDS.BRONZE}+`, color: 'bg-orange-100 text-orange-800 border-orange-300', desc: 'Rookie Detective' },
    { name: 'White', icon: '⚪', stars: '0+', color: 'bg-gray-100 text-gray-600 border-gray-300', desc: 'New Recruit' },
  ];

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-yellow-300 max-h-[80vh] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="text-gray-600 w-6 h-6" />
        </button>
        <h2 className="text-2xl font-black text-yellow-500 flex items-center gap-2 uppercase tracking-wide">
            <Trophy className="fill-yellow-500 w-6 h-6" /> Leaderboard
        </h2>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
        <button 
            onClick={() => setActiveTab('scores')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'scores' ? 'bg-white text-yellow-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
            <List className="w-4 h-4" /> Top Agents
        </button>
        <button 
            onClick={() => setActiveTab('ranks')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'ranks' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
            <Medal className="w-4 h-4" /> Rank Guide
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        
        {activeTab === 'scores' ? (
            <div className="space-y-3">
                {entries.length === 0 ? (
                    <div className="text-center text-gray-400 py-10 italic">No detectives yet. Be the first!</div>
                ) : (
                    entries.map((entry, index) => (
                        <div key={index} className={`flex items-center gap-3 p-3 rounded-xl border-b-4 ${index === 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${index === 0 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                #{index + 1}
                            </div>
                            <div className="w-10 h-10 shrink-0">
                                <Avatar config={entry.avatar} size="sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-gray-800 truncate text-sm">{entry.name}</div>
                                <div className="mt-1">
                                    {getRankBadge(entry.rank)}
                                </div>
                            </div>
                            <div className="font-black text-xl text-orange-500 whitespace-nowrap flex items-center gap-1">
                                {entry.score} <Star className="w-4 h-4 fill-orange-500" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        ) : (
            <div className="space-y-3">
                <p className="text-xs text-center text-gray-400 font-bold uppercase mb-2">Collect stars to rank up!</p>
                {RANKS_INFO.map((rank) => (
                    <div key={rank.name} className={`flex items-center gap-4 p-4 rounded-xl border-2 ${rank.color}`}>
                        <div className="text-3xl">{rank.icon}</div>
                        <div className="flex-1">
                            <h3 className="font-black text-lg uppercase tracking-wide">{rank.name}</h3>
                            <p className="text-xs font-bold opacity-70">{rank.desc}</p>
                        </div>
                        <div className="text-right">
                             <div className="text-xs uppercase font-bold opacity-60">Needs</div>
                             <div className="font-black text-xl flex items-center gap-1 justify-end">
                                {rank.stars} <Star className="w-4 h-4 fill-current" />
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  );
};

export default Leaderboard;
