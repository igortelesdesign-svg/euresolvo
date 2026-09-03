import React from 'react';
import { CheckCircle2, Award, Clock, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { ProfessionalBadge } from '../types';

interface BadgeProps {
  badge: ProfessionalBadge;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ badge, size = 'sm' }) => {
  const getIcon = () => {
    switch (badge.code) {
      case 'verified':
        return <ShieldCheck className="w-3 h-3 text-[#45C900]" />;
      case 'top_rated':
        return <Award className="w-3 h-3 text-amber-500" />;
      case 'punctual':
        return <Clock className="w-3 h-3 text-[#003A67]" />;
      case 'fast_solver':
        return <Zap className="w-3 h-3 text-[#45C900]" />;
      case 'quick_reply':
        return <Sparkles className="w-3 h-3 text-sky-600" />;
      default:
        return <CheckCircle2 className="w-3 h-3 text-[#45C900]" />;
    }
  };

  return (
    <span
      title={badge.description}
      className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wide rounded-md border border-[#DDE3E8] bg-[#F5F7F9] text-[#071B2F] transition-colors ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'
      }`}
    >
      {getIcon()}
      <span>{badge.label}</span>
    </span>
  );
};
