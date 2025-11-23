
import React, { useState, useEffect } from 'react';
import Game from './components/Game';
import AvatarStore from './components/AvatarStore';
import Avatar from './components/Avatar';
import Leaderboard from './components/Leaderboard';
import { Screen, AvatarConfig, StoreItem, LeaderboardEntry } from './types';
import { INITIAL_AVATAR, getRankInfo, RANK_THRESHOLDS } from './constants';
import { getHostCommentary } from './services/geminiService';
import { playSound } from './services/soundService';
import { Play, Store, Star, Search, Trophy, Check, Medal } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<Screen>('WELCOME');
  const [wallet, setWallet] = useState<number>(0);
  const [playerName, setPlayerName] = useState<string>('');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(INITIAL_AVATAR);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [lastScore, setLastScore] = useState<number>(0);
  const [gameMessage, setGameMessage] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Load persistence
  useEffect(() => {
    const savedBoard = localStorage.getItem('moneyDetectives_leaderboard');
    if (savedBoard) setLeaderboard(JSON.parse(savedBoard));

    const savedWallet = localStorage.getItem('moneyDetectives_wallet');
    if (savedWallet) setWallet(parseInt(savedWallet, 10));

    const savedItems = localStorage.getItem('moneyDetectives_items');
    if (savedItems) setPurchasedItems(JSON.parse(savedItems));

    // Initial welcome
    getHostCommentary('start').then(setGameMessage);
  }, []);

  // Save wallet whenever it changes
  useEffect(() => {
    localStorage.setItem('moneyDetectives_wallet', wallet.toString());
  }, [wallet]);

  // Save items whenever they change
  useEffect(() => {
    localStorage.setItem('moneyDetectives_items', JSON.stringify(purchasedItems));
  }, [purchasedItems]);

  const saveScore = (score: number, currentWallet: number) => {
    // Calculate what the rank is NOW (after winning)
    const rankInfo = getRankInfo(currentWallet);

    const newEntry: LeaderboardEntry = {
        name: playerName || 'Anonymous',
        score: score,
        date: Date.now(),
        avatar: avatarConfig,
        rank: rankInfo.name
    };
    
    const newBoard = [...leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    
    setLeaderboard(newBoard);
    localStorage.setItem('moneyDetectives_leaderboard', JSON.stringify(newBoard));
  };

  const handleStartGame = () => {
    playSound('click');
    if (playerName.trim().length === 0) return;
    setScreen('MENU');
  };

  const handleGameOver = (score: number) => {
    setLastScore(score);
    
    // Update wallet
    const newWallet = wallet + score;
    setWallet(newWallet);
    
    saveScore(score, newWallet);
    getHostCommentary('end', score).then(setGameMessage);
    playSound('win');
    setScreen('RESULTS');
  };

  const handlePurchase = (item: StoreItem) => {
    if (wallet >= item.price) {
      playSound('pop');
      setWallet(prev => prev - item.price);
      setPurchasedItems(prev => [...prev, item.id]);
    }
  };

  const currentRank = getRankInfo(wallet);

  // Calculate progress to next rank
  let nextRankStars = RANK_THRESHOLDS.BRONZE;
  if (wallet >= RANK_THRESHOLDS.BRONZE) nextRankStars = RANK_THRESHOLDS.SILVER;
  if (wallet >= RANK_THRESHOLDS.SILVER) nextRankStars = RANK_THRESHOLDS.GOLD;
  if (wallet >= RANK_THRESHOLDS.GOLD) nextRankStars = RANK_THRESHOLDS.DIAMOND;
  if (wallet >= RANK_THRESHOLDS.DIAMOND) nextRankStars = wallet; // Maxed out

  const progressPercent = wallet >= RANK_THRESHOLDS.DIAMOND 
    ? 100 
    : Math.min(100, (wallet / nextRankStars) * 100);


  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-100 to-pink-200 font-sans text-gray-800 flex flex-col items-center overflow-x-hidden selection:bg-orange-200">
      
      {/* Main Container */}
      <div className="w-full max-w-4xl p-4 flex-1 flex flex-col items-center justify-center">

        {/* --- WELCOME / NAME INPUT --- */}
        {screen === 'WELCOME' && (
             <div className="text-center space-y-8 animate-fade-in w-full max-w-md bg-white/80 backdrop-blur rounded-3xl p-10 border-4 border-white shadow-xl">
                 <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600 drop-shadow-sm leading-tight">
                    Money Detectives
                 </h1>
                 
                 <div className="relative w-32 h-32 mx-auto animate-bounce">
                     <Avatar config={avatarConfig} size="md" />
                 </div>

                 <div className="space-y-4">
                     <label className="block text-gray-600 font-bold uppercase tracking-wide text-sm">Agent Name</label>
                     <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Type your name..." 
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && playerName.length > 0 && handleStartGame()}
                            className="w-full p-4 rounded-xl border-2 border-gray-200 text-xl font-bold focus:border-orange-400 focus:outline-none focus:ring-4 ring-orange-100"
                        />
                     </div>
                 </div>

                 <button 
                    onClick={handleStartGame}
                    disabled={playerName.length === 0}
                    className={`w-full py-4 rounded-xl font-black text-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                        ${playerName.length > 0 ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                    `}
                 >
                    Join the Agency <Check strokeWidth={4} />
                 </button>
             </div>
        )}

        {/* --- MENU SCREEN --- */}
        {screen === 'MENU' && (
          <div className="text-center space-y-6 animate-fade-in w-full max-w-lg">
            
            <header className="space-y-1">
               <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase">Detective Agency</h2>
               <div className="text-2xl font-black text-gray-800">Hello, Agent {playerName}!</div>
            </header>

            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl border-4 border-white flex flex-col items-center gap-6 relative">
              
              <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    playSound('click'); 
                    setScreen('LEADERBOARD'); 
                }} 
                className="absolute top-4 right-4 p-3 bg-yellow-400 text-white rounded-xl hover:bg-yellow-500 shadow-md transition-colors z-50 border-2 border-yellow-200" 
                title="Leaderboard"
              >
                  <Trophy className="w-6 h-6" />
              </button>

              {/* Avatar Scene Container - Click to go to Store */}
              <div 
                className="relative group cursor-pointer w-full flex justify-center perspective-1000" 
                onClick={() => { playSound('click'); setScreen('STORE'); }}
                title="Go to Style Shop"
              >
                  <div className="absolute top-0 right-10 bg-purple-500 text-white rounded-full p-2 border-2 border-white shadow-lg z-30 animate-pulse">
                      <Store className="w-5 h-5" />
                  </div>

                  {/* Detective Background */}
                  <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-gray-800 bg-gray-900 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                     <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,_#333_1px,_transparent_1px)] bg-[size:10px_10px]"></div>
                     
                     <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/40 to-black/80 z-10"></div>
                     <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-40 h-80 bg-yellow-100/10 blur-xl rotate-12 z-0 animate-pulse"></div>

                     {/* The Avatar */}
                     <div className="z-10 mt-10">
                        <Avatar config={avatarConfig} size="lg" />
                     </div>

                     {/* Animated Magnifying Glass */}
                     <div className="absolute z-20 top-1/2 left-1/2 animate-[spin_5s_linear_infinite_reverse] origin-[0_-70px]"> 
                        <div className="animate-[spin_5s_linear_infinite] origin-center"> 
                            <Search className="w-16 h-16 text-white/50 drop-shadow-lg" strokeWidth={3} />
                        </div>
                     </div>
                  </div>
              </div>

              {/* Rank Badge - Clickable now */}
              <button 
                onClick={() => { playSound('click'); setScreen('LEADERBOARD'); }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 ${currentRank.color} shadow-sm hover:scale-105 transition-transform cursor-pointer`}
              >
                  <span className="text-lg">{currentRank.icon}</span>
                  <span className="font-bold uppercase text-xs tracking-wider">{currentRank.name} Detective</span>
              </button>

              {/* Stats Bar */}
              <div className="w-full flex justify-between items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 text-2xl font-black text-orange-500">
                    <Star className="fill-orange-500" /> {wallet}
                  </div>
                  
                  {/* Rank Progress Bar */}
                  {wallet < RANK_THRESHOLDS.DIAMOND && (
                    <div className="flex-1 max-w-[120px] flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                            <span>Progress</span>
                            <span>{nextRankStars - wallet} to Next</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                  )}
              </div>

              <button 
                onClick={() => { playSound('click'); setScreen('GAME'); }}
                className="w-full bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white text-3xl font-black py-6 rounded-2xl shadow-lg border-b-8 border-green-800 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-4 mt-2"
              >
                <Play className="fill-white w-8 h-8" /> PLAY
              </button>
            </div>
          </div>
        )}

        {/* --- GAME SCREEN --- */}
        {screen === 'GAME' && (
          <Game 
            onGameOver={handleGameOver} 
            onExit={() => { playSound('click'); setScreen('MENU'); }}
            avatarConfig={avatarConfig}
          />
        )}

        {/* --- STORE SCREEN --- */}
        {screen === 'STORE' && (
          <AvatarStore 
            currentConfig={avatarConfig}
            onUpdateConfig={setAvatarConfig}
            wallet={wallet}
            purchasedItems={purchasedItems}
            onPurchase={handlePurchase}
            onClose={() => { playSound('click'); setScreen('MENU'); }}
          />
        )}

         {/* --- LEADERBOARD SCREEN --- */}
         {screen === 'LEADERBOARD' && (
          <Leaderboard 
            entries={leaderboard}
            onBack={() => { playSound('click'); setScreen('MENU'); }}
          />
        )}

        {/* --- RESULTS SCREEN --- */}
        {screen === 'RESULTS' && (
          <div className="text-center w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border-4 border-orange-200 animate-bounce-in">
             <div className="flex justify-center -mt-20 mb-6">
                <div className="bg-yellow-400 p-6 rounded-full border-4 border-white shadow-lg animate-wiggle">
                    <Trophy className="w-16 h-16 text-white" />
                </div>
             </div>
             
             <h2 className="text-4xl font-black text-gray-800 mb-2">Game Over!</h2>
             <p className="text-gray-500 font-bold mb-6 text-lg">{gameMessage}</p>

             <div className="bg-orange-50 rounded-xl p-6 mb-8 border border-orange-100 transform rotate-1">
                 <p className="text-sm uppercase tracking-wide text-orange-400 font-bold">Score</p>
                 <div className="text-7xl font-black text-orange-500 flex items-center justify-center gap-2 mt-2">
                    {lastScore} <Star className="w-12 h-12 fill-orange-500" />
                 </div>
                 <div className="mt-4 pt-4 border-t border-orange-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Current Rank</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${currentRank.color} text-sm font-bold`}>
                       {currentRank.icon} {currentRank.name}
                    </div>
                 </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <button 
                    onClick={() => { playSound('click'); setScreen('MENU'); }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-colors"
                 >
                    Menu
                 </button>
                 <button 
                    onClick={() => { playSound('click'); setScreen('STORE'); }}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                 >
                    <Store className="w-5 h-5" /> Spend Stars
                 </button>
             </div>
          </div>
        )}

      </div>
      
      {/* Footer */}
      <div className="w-full text-center p-4 text-orange-800/30 font-bold text-xs">
         Money Detectives • Sound On 🔊
      </div>
    </div>
  );
}
