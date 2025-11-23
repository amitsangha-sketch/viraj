
import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarProps {
  config: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar: React.FC<AvatarProps> = ({ config, size = 'md' }) => {
  // Size mappings in pixels for SVG scaling
  const pixelSizes = {
    sm: 64,
    md: 128,
    lg: 192,
    xl: 256
  };
  
  const wh = pixelSizes[size];

  // Helper to get color code from tailwind class name (simplified mapping)
  const getColor = (cls: string) => {
    if (cls.includes('yellow')) return '#FDE047';
    if (cls.includes('blue')) return '#93C5FD';
    if (cls.includes('pink')) return '#F9A8D4';
    if (cls.includes('green')) return '#86EFAC';
    if (cls.includes('purple')) return '#D8B4FE';
    return '#FDE047'; // default
  };

  const bodyColor = getColor(config.color);

  return (
    <svg 
      width={wh} 
      height={wh} 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-md transition-all duration-300 hover:scale-105"
    >
      {/* --- BODY (Bean Shape) --- */}
      <defs>
        <linearGradient id={`grad-${config.color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={bodyColor} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      
      {/* Shirt / Base Body Layer */}
      {config.shirt !== 'none' && (
         <g id="shirt">
             {config.shirt === 'super' && <path d="M50 140 Q100 220 150 140 L150 200 L50 200 Z" fill="#3B82F6" />}
             {config.shirt === 'stripe' && (
                <g>
                    <path d="M40 130 Q100 210 160 130 L160 200 L40 200 Z" fill="#E5E7EB" />
                    <path d="M40 150 H160" stroke="#9CA3AF" strokeWidth="8" />
                    <path d="M45 170 H155" stroke="#9CA3AF" strokeWidth="8" />
                </g>
             )}
             {config.shirt === 'bowtie' && (
                 <g>
                     <path d="M40 130 Q100 210 160 130 L160 200 L40 200 Z" fill="#1F2937" />
                     <path d="M85 140 L115 140 L125 125 L75 125 Z" fill="white" /> {/* Collar */}
                 </g>
             )}
         </g>
      )}

      {/* Main Head Shape */}
      <ellipse cx="100" cy="100" rx="70" ry="80" fill={bodyColor} stroke="#000" strokeWidth="4" />
      
      {/* Shirt Decoration (Over body) */}
      {config.shirt === 'super' && (
        <text x="100" y="160" textAnchor="middle" fontSize="30" fill="gold" fontWeight="bold" fontFamily="sans-serif">S</text>
      )}
       {config.shirt === 'bowtie' && (
         <g transform="translate(100, 145)">
            <path d="M-15 -10 L15 10 L15 -10 L-15 10 Z" fill="#EF4444" stroke="#000" strokeWidth="2" />
            <circle cx="0" cy="0" r="4" fill="#EF4444" stroke="#000" strokeWidth="1"/>
         </g>
      )}

      {/* --- FACE --- */}
      {/* Cheeks */}
      <circle cx="60" cy="110" r="10" fill="#FFAAAA" opacity="0.6" />
      <circle cx="140" cy="110" r="10" fill="#FFAAAA" opacity="0.6" />

      {/* Eyes */}
      <g className="animate-[blink_4s_infinite]">
        <ellipse cx="70" cy="90" rx="10" ry="15" fill="black" />
        <ellipse cx="130" cy="90" rx="10" ry="15" fill="black" />
        {/* Sparkle in eyes */}
        <circle cx="73" cy="85" r="3" fill="white" />
        <circle cx="133" cy="85" r="3" fill="white" />
      </g>

      {/* Mouth */}
      <path d="M80 130 Q100 150 120 130" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />

      {/* --- GLASSES --- */}
      {config.glasses === 'sunglasses' && (
        <g>
          <path d="M50 85 Q70 85 90 85 L90 105 Q70 105 50 100 Z" fill="black" opacity="0.9" />
          <path d="M110 85 Q130 85 150 85 L150 100 Q130 105 110 105 Z" fill="black" opacity="0.9" />
          <line x1="90" y1="90" x2="110" y2="90" stroke="black" strokeWidth="4" />
        </g>
      )}
      {config.glasses === 'nerd' && (
        <g>
          <circle cx="70" cy="90" r="22" fill="white" fillOpacity="0.3" stroke="black" strokeWidth="4" />
          <circle cx="130" cy="90" r="22" fill="white" fillOpacity="0.3" stroke="black" strokeWidth="4" />
          <line x1="92" y1="90" x2="108" y2="90" stroke="black" strokeWidth="4" />
        </g>
      )}
      {config.glasses === 'star' && (
        <g fill="#F59E0B" stroke="#000" strokeWidth="1">
           <path transform="translate(70, 90) scale(0.8)" d="M0,-20 L5,-5 L20,-5 L10,5 L15,20 L0,10 L-15,20 L-10,5 L-20,-5 L-5,-5 Z" />
           <path transform="translate(130, 90) scale(0.8)" d="M0,-20 L5,-5 L20,-5 L10,5 L15,20 L0,10 L-15,20 L-10,5 L-20,-5 L-5,-5 Z" />
        </g>
      )}

      {/* --- HATS --- */}
      {config.hat === 'cap' && (
        <g transform="translate(0, -20)">
           <path d="M50 60 Q100 10 150 60" fill="#2563EB" stroke="#000" strokeWidth="3" />
           <path d="M140 55 L190 65 L140 75" fill="#2563EB" stroke="#000" strokeWidth="3" />
           <circle cx="100" cy="35" r="4" fill="#1D4ED8" />
        </g>
      )}
      {config.hat === 'crown' && (
         <path d="M60 60 L60 20 L80 50 L100 10 L120 50 L140 20 L140 60 Z" fill="gold" stroke="#000" strokeWidth="3" transform="translate(0, -10)" />
      )}
      {config.hat === 'cowboy' && (
          <g transform="translate(0, -25)">
              <ellipse cx="100" cy="70" rx="90" ry="20" fill="#92400E" stroke="#000" strokeWidth="3" />
              <path d="M60 70 Q100 0 140 70" fill="#92400E" stroke="#000" strokeWidth="3" />
          </g>
      )}
      {config.hat === 'beanie' && (
          <g transform="translate(0, -10)">
              <path d="M50 70 Q100 0 150 70" fill="#EF4444" stroke="#000" strokeWidth="3" />
              <circle cx="100" cy="30" r="10" fill="white" stroke="#000" strokeWidth="2" />
          </g>
      )}

      {/* Hands (Paws) - just peeking up */}
      <circle cx="40" cy="180" r="15" fill={bodyColor} stroke="black" strokeWidth="3" />
      <circle cx="160" cy="180" r="15" fill={bodyColor} stroke="black" strokeWidth="3" />

      <style>{`
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
      `}</style>
    </svg>
  );
};

export default Avatar;
