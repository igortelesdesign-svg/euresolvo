import React, { useState } from 'react';
import { LogoIcon } from './LogoIcon';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'white';
  showSubtitle?: boolean;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  className = 'h-10',
  variant = 'light',
  showSubtitle = false,
  onClick,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col select-none cursor-pointer ${className}`}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center gap-2.5">
        {!imgFailed ? (
          <img
            src="/euresolvo.png"
            alt="EURESOLVO"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-10 sm:h-16 w-auto object-contain max-w-[220px] sm:max-w-[320px] transition-transform duration-150 hover:scale-[1.02]"
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-2xl sm:text-3xl text-[#45C900] tracking-tight leading-none">
              eu
            </span>
            <span
              className={`font-black text-2xl sm:text-3xl tracking-tight leading-none ${
                variant === 'white' ? 'text-white' : 'text-[#071B2F]'
              }`}
            >
              RESOLVO
            </span>
            <LogoIcon size={32} className="h-8 w-8 ml-1" />
          </div>
        )}
      </div>

      {showSubtitle && (
        <span
          className={`text-[10px] font-semibold uppercase tracking-wide mt-0.5 ${
            variant === 'white' ? 'text-white/50' : 'text-[#66727D]'
          }`}
        >
          Encontre Quem Pode Resolver
        </span>
      )}
    </div>
  );
};
