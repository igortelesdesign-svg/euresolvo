import React, { useState } from 'react';

interface LogoIconProps {
  className?: string;
  size?: number;
  showBadge?: boolean;
}

export const LogoIcon: React.FC<LogoIconProps> = ({
  className = 'h-10 w-10',
  size = 40,
  showBadge = false,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (!imgFailed) {
    return (
      <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
        <img
          src="/assets/brand/icon-symbol.png"
          alt="EURESOLVO Símbolo"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-200 hover:scale-105"
        />
        {showBadge && (
          <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#45C900] ring-2 ring-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          </span>
        )}
      </div>
    );
  }

  // High-fidelity Vector fallback if image cannot load
  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-transform duration-200 hover:scale-105"
      >
        <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="4" />
        <circle cx="50" cy="50" r="44" stroke="#071B2F" strokeWidth="7" fill="#071B2F" fillOpacity="0.08" />
        {/* Helmet */}
        <path d="M26 44 C26 23, 40 14, 50 14 C60 14, 74 23, 74 44 Z" fill="#003A67" stroke="white" strokeWidth="2.5" />
        <path d="M47 14 H53 V42 H47 Z" fill="#003A67" />
        <path d="M20 44 C20 42, 80 42, 80 44 C80 48, 72 51, 50 51 C28 51, 20 48, 20 44 Z" fill="#071B2F" stroke="white" strokeWidth="2" />
        <path d="M30 50 C36 58, 64 58, 70 50 C66 65, 34 65, 30 50 Z" fill="#071B2F" />
        {/* Lime Checkmark */}
        <path
          d="M36 67 L47 78 C48 79, 50 79, 51 78 L86 48 C88 46, 86 42, 83 44 L49 68 L39 58 C37 56, 34 59, 36 67 Z"
          fill="#45C900"
          stroke="white"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      {showBadge && (
        <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#45C900] ring-2 ring-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        </span>
      )}
    </div>
  );
};
