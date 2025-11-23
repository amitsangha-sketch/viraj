import React, { useState } from 'react';
import { AvatarConfig, StoreItem } from '../types';
import { STORE_ITEMS } from '../constants';
import Avatar from './Avatar';
import { ShoppingBag, Star, ArrowLeft } from 'lucide-react';

interface AvatarStoreProps {
  currentConfig: AvatarConfig;
  onUpdateConfig: (newConfig: AvatarConfig) => void;
  wallet: number; // Stars/Money available
  purchasedItems: string[];
  onPurchase: (item: StoreItem) => void;
  onClose: () => void;
}

const AvatarStore: React.FC<AvatarStoreProps> = ({ 
  currentConfig, 
  onUpdateConfig, 
  wallet, 
  purchasedItems, 
  onPurchase, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'hat' | 'glasses' | 'shirt' | 'color'>('hat');

  const filteredItems = STORE_ITEMS.filter(item => item.type === activeTab);

  const handleItemClick = (item: StoreItem) => {
    const isPurchased = item.price === 0 || purchasedItems.includes(item.id);

    if (isPurchased) {
      // Equip
      onUpdateConfig({
        ...currentConfig,
        [item.type]: item.id
      });
    } else if (wallet >= item.price) {
      // Buy
      onPurchase(item);
      // Auto equip after buy
       onUpdateConfig({
        ...currentConfig,
        [item.type]: item.id
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh]">
      
      {/* Store Header */}
      <div className="bg-purple-600 p-4 text-white flex justify-between items-center">
        <button onClick={onClose} className="p-2 hover:bg-purple-700 rounded-full">
           <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-black flex items-center gap-2">
            <ShoppingBag /> The Style Shop
        </h2>
        <div className="flex items-center gap-1 bg-purple-800 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-bold">{wallet}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          
          {/* Avatar Preview Panel */}
          <div className="w-full md:w-1/3 bg-purple-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-purple-100">
             <div className="scale-125 mb-6">
                <Avatar config={currentConfig} size="md" />
             </div>
             <p className="text-purple-400 font-bold text-center text-sm">You look amazing!</p>
          </div>

          {/* Items Grid Panel */}
          <div className="flex-1 flex flex-col bg-white">
             
             {/* Tabs */}
             <div className="flex p-2 gap-2 overflow-x-auto bg-gray-50 border-b border-gray-200">
                {(['color', 'hat', 'glasses', 'shirt'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-bold capitalize text-sm whitespace-nowrap transition-colors
                           ${activeTab === tab 
                             ? 'bg-purple-100 text-purple-700 border-2 border-purple-200' 
                             : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}
                        `}
                    >
                        {tab}
                    </button>
                ))}
             </div>

             {/* Grid */}
             <div className="flex-1 overflow-y-auto p-4">
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredItems.map(item => {
                        const isEquipped = currentConfig[item.type] === item.id;
                        const isOwned = item.price === 0 || purchasedItems.includes(item.id);
                        const canAfford = wallet >= item.price;

                        return (
                            <button 
                                key={item.id + item.type}
                                onClick={() => handleItemClick(item)}
                                className={`
                                    relative p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
                                    ${isEquipped 
                                        ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                                        : 'border-gray-200 hover:border-purple-300 hover:shadow-md'}
                                `}
                            >
                                <div className="text-4xl">{item.emoji}</div>
                                <span className="font-bold text-xs text-gray-700">{item.name}</span>
                                
                                {isOwned ? (
                                    <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                        {isEquipped ? 'Equipped' : 'Owned'}
                                    </span>
                                ) : (
                                    <div className={`flex items-center gap-1 text-sm font-bold ${canAfford ? 'text-orange-500' : 'text-gray-300'}`}>
                                        <Star className={`w-3 h-3 ${canAfford ? 'fill-orange-500' : 'fill-gray-300'}`} />
                                        {item.price}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                 </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default AvatarStore;
