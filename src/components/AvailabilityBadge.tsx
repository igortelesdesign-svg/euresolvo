import React from 'react';
import { Clock, Zap } from 'lucide-react';

interface AvailabilityBadgeProps {
  isAvailableNow?: boolean;
  nextAvailableText?: string;
  size?: 'sm' | 'md';
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  isAvailableNow = false,
  nextAvailableText = 'Disponível hoje',
  size = 'md',
}) => {
  if (isAvailableNow) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md font-bold uppercase tracking-wide bg-[#45C900]/15 text-[#003A67] border border-[#45C900]/40 ${
          size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'
        }`}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#59E600] opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#45C900]" />
        </span>
        <Zap className="w-2.5 h-2.5 text-[#45C900]" />
        <span>DISPONÍVEL AGORA</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-semibold uppercase tracking-wide bg-[#F5F7F9] text-[#66727D] border border-[#DDE3E8] ${
        size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'
      }`}
    >
      <Clock className="w-2.5 h-2.5 text-[#66727D]" />
      <span>{nextAvailableText}</span>
    </span>
  );
};
