
import { StoreItem } from './types';

export const TOTAL_ROUNDS = 5;

export const INITIAL_AVATAR = {
  color: 'bg-yellow-300',
  hat: 'none',
  glasses: 'none',
  shirt: 'none',
};

export const RANK_THRESHOLDS = {
  BRONZE: 10,
  SILVER: 30,
  GOLD: 60,
  DIAMOND: 100
};

export const getRankInfo = (totalStars: number) => {
  if (totalStars >= RANK_THRESHOLDS.DIAMOND) return { name: 'Diamond', color: 'bg-cyan-100 text-cyan-700 border-cyan-400', icon: '💎' };
  if (totalStars >= RANK_THRESHOLDS.GOLD) return { name: 'Gold', color: 'bg-yellow-100 text-yellow-700 border-yellow-400', icon: '🥇' };
  if (totalStars >= RANK_THRESHOLDS.SILVER) return { name: 'Silver', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: '🥈' };
  if (totalStars >= RANK_THRESHOLDS.BRONZE) return { name: 'Bronze', color: 'bg-orange-100 text-orange-800 border-orange-300', icon: '🥉' };
  return { name: 'White', color: 'bg-gray-100 text-gray-600 border-gray-300', icon: '⚪' };
};

export const STORE_ITEMS: StoreItem[] = [
  // Colors (Free mostly, or cheap)
  { id: 'bg-yellow-300', type: 'color', name: 'Sunny Yellow', price: 0, emoji: '🟡' },
  { id: 'bg-blue-300', type: 'color', name: 'Sky Blue', price: 1, emoji: '🔵' },
  { id: 'bg-pink-300', type: 'color', name: 'Candy Pink', price: 1, emoji: '🔴' },
  { id: 'bg-green-300', type: 'color', name: 'Lime Green', price: 1, emoji: '🟢' },
  { id: 'bg-purple-300', type: 'color', name: 'Royal Purple', price: 2, emoji: '🟣' },

  // Hats
  { id: 'none', type: 'hat', name: 'No Hat', price: 0, emoji: '❌' },
  { id: 'cap', type: 'hat', name: 'Blue Cap', price: 2, emoji: '🧢' },
  { id: 'crown', type: 'hat', name: 'Gold Crown', price: 5, emoji: '👑' },
  { id: 'cowboy', type: 'hat', name: 'Cowboy Hat', price: 3, emoji: '🤠' },
  { id: 'beanie', type: 'hat', name: 'Winter Hat', price: 2, emoji: '🧶' },

  // Glasses
  { id: 'none', type: 'glasses', name: 'No Glasses', price: 0, emoji: '❌' },
  { id: 'sunglasses', type: 'glasses', name: 'Cool Shades', price: 2, emoji: '😎' },
  { id: 'nerd', type: 'glasses', name: 'Reading Specs', price: 2, emoji: '👓' },
  { id: 'star', type: 'glasses', name: 'Star Eyes', price: 4, emoji: '⭐' },

  // Shirts (represented by colors/patterns visually)
  { id: 'none', type: 'shirt', name: 'Plain Tee', price: 0, emoji: '👕' },
  { id: 'stripe', type: 'shirt', name: 'Striped', price: 3, emoji: '🦓' },
  { id: 'bowtie', type: 'shirt', name: 'Formal', price: 5, emoji: '🤵' },
  { id: 'super', type: 'shirt', name: 'Hero Suit', price: 6, emoji: '🦸' },
];
