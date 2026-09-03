import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'warning';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  return (
    <div
      id="app-global-toast"
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold animate-fade-in backdrop-blur-md max-w-md w-11/12 sm:w-auto ${
        type === 'success'
          ? 'bg-[#071B2F]/95 text-white border-[#45C900]/40'
          : type === 'warning'
          ? 'bg-amber-900/95 text-white border-amber-500'
          : 'bg-[#003A67]/95 text-white border-sky-400/40'
      }`}
    >
      {type === 'success' && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#45C900] text-[#071B2F] shrink-0 font-black">
          ✓
        </span>
      )}
      {type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
      {type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
      <span className="leading-snug">{message}</span>
    </div>
  );
};
