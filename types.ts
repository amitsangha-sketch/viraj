
export type Screen = 'WELCOME' | 'MENU' | 'GAME' | 'STORE' | 'RESULTS' | 'LEADERBOARD';

export interface AvatarConfig {
  color: string;
  hat: string; // ID of the hat
  glasses: string; // ID of the glasses
  shirt: string; // ID of the shirt
}

export interface StoreItem {
  id: string;
  type: 'hat' | 'glasses' | 'shirt' | 'color';
  name: string;
  price: number;
  emoji: string; // Visual representation for the icon
}

export interface GameState {
  round: number;
  score: number;
  isShuffling: boolean;
  gameStatus: 'IDLE' | 'SHUFFLING' | 'GUESSING' | 'REVEALED' | 'TRANSITION';
  winningBasketIndex: number; // 0, 1, or 2
  selectedBasketIndex: number | null;
  hostMessage: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: number;
  avatar: AvatarConfig;
  rank: string; // 'White' | 'Bronze' | 'Silver' | 'Gold' | 'Diamond'
}
