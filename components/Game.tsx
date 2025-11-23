
import React, { useState, useEffect, useRef } from 'react';
import { GameState, AvatarConfig } from '../types';
import { TOTAL_ROUNDS } from '../constants';
import { getHostCommentary } from '../services/geminiService';
import { playSound } from '../services/soundService';
import Avatar from './Avatar';
import { DollarSign, RefreshCw, Loader2 } from 'lucide-react';

interface GameProps {
  onGameOver: (score: number) => void;
  onExit: () => void;
  avatarConfig: AvatarConfig;
}

// Internal Confetti Component
const ConfettiBurst = () => {
  const particles = Array.from({ length: 40 }).map((_, i) => {
    const angle = Math.random() * 360;
    const distance = 60 + Math.random() * 100;
    const tx = Math.cos(angle * (Math.PI / 180)) * distance;
    const ty = Math.sin(angle * (Math.PI / 180)) * distance;
    const rot = Math.random() * 720;
    const color = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#a855f7', '#ec4899'][Math.floor(Math.random() * 6)];
    
    return { id: i, tx, ty, rot, color };
  });

  return (
    <div className="absolute top-1/2 left-1/2 w-0 h-0 z-50 pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-sm animate-confetti"
          style={{
            backgroundColor: p.color,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            '--rot': `${p.rot}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

const Game: React.FC<GameProps> = ({ onGameOver, onExit, avatarConfig }) => {
  const [state, setState] = useState<GameState>({
    round: 1,
    score: 0,
    isShuffling: false,
    gameStatus: 'IDLE',
    winningBasketIndex: 1,
    selectedBasketIndex: null,
    hostMessage: 'Ready to find the money?',
  });

  // Start game on mount
  useEffect(() => {
    getHostCommentary('start').then(msg => setState(s => ({ ...s, hostMessage: msg })));
    // Delay start slightly for entrance
    const timer = setTimeout(() => {
        startRound();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const startRound = () => {
    playSound('shuffle');
    setState(prev => ({
      ...prev,
      gameStatus: 'SHUFFLING',
      isShuffling: true,
      selectedBasketIndex: null,
      hostMessage: "Mixing up the cups! Watch closely...",
    }));

    const newWinningIndex = Math.floor(Math.random() * 3);
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isShuffling: false,
        gameStatus: 'GUESSING',
        winningBasketIndex: newWinningIndex,
        hostMessage: "Guess which cup has the money!",
      }));
    }, 1500);
  };

  const handleBasketClick = async (index: number) => {
    if (state.gameStatus !== 'GUESSING') return;

    playSound('pop');
    const isWin = index === state.winningBasketIndex;
    const newScore = isWin ? state.score + 1 : state.score;

    if (isWin) playSound('win');
    else playSound('lose');

    setState(prev => ({
      ...prev,
      gameStatus: 'REVEALED',
      selectedBasketIndex: index,
      score: newScore,
      hostMessage: isWin ? "You found it!" : "Checking...",
    }));

    const comment = await getHostCommentary(isWin ? 'win' : 'lose', newScore, state.round);
    setState(prev => ({ ...prev, hostMessage: comment }));

    // Auto-advance logic
    setTimeout(() => {
        if (state.round >= TOTAL_ROUNDS) {
            onGameOver(newScore);
        } else {
            // Move to next round
            setState(prev => ({
                ...prev,
                gameStatus: 'TRANSITION', // New intermediate state
                round: prev.round + 1,
                hostMessage: "Loading next round...",
            }));
            
            // Short delay before shuffle starts
            setTimeout(() => {
                startRound();
            }, 1000);
        }
    }, 2500); // 2.5 seconds to view result
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[80vh] w-full max-w-2xl mx-auto p-4 select-none">
      
      {/* Header Info */}
      <div className="w-full flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-3xl shadow-sm border border-orange-200 mb-4 transition-all">
        <div className="flex items-center gap-2">
            <div className="w-16 h-16 -ml-2 -mt-2">
                 <Avatar config={avatarConfig} size="sm" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-orange-800/60 font-black uppercase tracking-wider">Round</span>
                <span className="text-2xl font-black text-orange-600 leading-none">{state.round}<span className="text-lg text-orange-400">/{TOTAL_ROUNDS}</span></span>
            </div>
        </div>

        <div className="flex flex-col items-end">
            <span className="text-xs text-orange-800/60 font-black uppercase tracking-wider">Score</span>
             <div className="flex items-center text-green-600 bg-white px-3 py-1 rounded-full shadow-inner">
                <DollarSign className="w-5 h-5 fill-green-600" />
                <span className="text-2xl font-black">{state.score}</span>
             </div>
        </div>
      </div>

      {/* Host Message Bubble */}
      <div className="bg-white border-b-4 border-r-4 border-blue-400 p-6 rounded-2xl shadow-lg mb-8 max-w-md w-full relative animate-fade-in">
         <p className="text-xl text-center font-bold text-slate-700">{state.hostMessage}</p>
         <div className="absolute -bottom-3 left-8 w-6 h-6 bg-white border-b-4 border-r-4 border-blue-400 transform rotate-45"></div>
      </div>

      {/* Game Area */}
      <div className="flex-1 w-full flex items-center justify-center gap-4 md:gap-12 min-h-[300px]">
        {[0, 1, 2].map((i) => {
          const isSelected = state.gameStatus === 'REVEALED' && i === state.selectedBasketIndex;
          const isWinner = i === state.winningBasketIndex;
          const showConfetti = isSelected && isWinner;
          const isRevealed = state.gameStatus === 'REVEALED' || state.gameStatus === 'TRANSITION';

          return (
            <div key={i} className="relative flex flex-col items-center">
              
              {showConfetti && <ConfettiBurst />}

              {/* The Rainbow Cup */}
              <button
                onClick={() => handleBasketClick(i)}
                disabled={state.gameStatus !== 'GUESSING'}
                onMouseEnter={() => state.gameStatus === 'GUESSING' && playSound('hover')}
                className={`
                  relative z-20 w-24 h-32 md:w-32 md:h-40 transition-all duration-300 transform
                  ${state.isShuffling ? 'animate-wiggle cursor-wait' : ''}
                  ${state.gameStatus === 'GUESSING' ? 'hover:-translate-y-4 cursor-pointer hover:scale-110 active:scale-95' : ''}
                  ${isRevealed && isSelected ? '-translate-y-24 rotate-12' : ''}
                  ${isRevealed && isWinner && !isSelected ? '-translate-y-24 rotate-12 opacity-40' : ''}
                `}
              >
                 <div className="w-full h-full rounded-b-[2rem] rounded-t-lg shadow-2xl border-4 border-white/50 flex items-center justify-center overflow-hidden bg-gradient-to-b from-red-500 via-yellow-400 to-blue-600">
                   <div className="absolute top-0 left-2 w-6 h-full bg-white/20 skew-x-12 blur-md"></div>
                   <span className="relative z-10 text-6xl font-black text-white drop-shadow-lg opacity-90">{i + 1}</span>
                 </div>
                 {/* Cup Lip */}
                 <div className="absolute top-0 w-[114%] h-5 bg-white rounded-full left-[-7%] shadow-sm"></div>
              </button>

              {/* The Hidden Item */}
              <div className={`
                  absolute bottom-2 z-10 transition-all duration-500 transform
                  ${(isRevealed && isWinner) ? 'opacity-100 scale-110' : 'opacity-0 scale-50 translate-y-10'}
              `}>
                  <div className="w-24 h-12 bg-green-500 border-b-4 border-green-700 text-white font-black text-xl flex items-center justify-center shadow-lg -rotate-3 rounded-lg animate-bounce">
                     <DollarSign className="w-6 h-6 mr-1" />
                     1.00
                  </div>
              </div>

              {/* Empty reveal indicator */}
              <div className={`
                  absolute bottom-8 z-10 transition-opacity duration-500
                  ${(isRevealed && isSelected && !isWinner) ? 'opacity-100' : 'opacity-0'}
              `}>
                  <span className="text-6xl filter drop-shadow-lg">💨</span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Status Bar / Loading Indicator */}
      <div className="w-full h-16 flex items-center justify-center mt-6">
        {state.gameStatus === 'TRANSITION' && (
             <div className="flex items-center gap-2 text-orange-600 font-bold text-xl animate-pulse bg-white/60 px-6 py-3 rounded-full shadow-sm">
                <Loader2 className="animate-spin" /> Next Round...
             </div>
        )}
        
        {state.gameStatus === 'SHUFFLING' && (
             <div className="text-purple-600 font-bold text-xl animate-pulse bg-white/80 px-4 py-2 rounded-full shadow-lg border-2 border-purple-100">Mixing colors...</div>
        )}

        {state.gameStatus === 'GUESSING' && (
             <div className="text-blue-600 font-black text-2xl bg-white px-8 py-3 rounded-full shadow-xl border-b-4 border-blue-100 animate-bounce">Pick a cup!</div>
        )}
      </div>

      <button onClick={onExit} className="absolute top-4 right-4 text-orange-800/40 hover:text-red-500 font-bold bg-white/30 hover:bg-white px-4 py-2 rounded-full text-sm transition-colors">
        Quit Game
      </button>

    </div>
  );
};

export default Game;
