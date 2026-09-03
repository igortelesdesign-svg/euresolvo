import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-indicator-banner"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:right-auto md:max-w-md z-50 flex items-center gap-2.5 rounded-xl bg-amber-600 text-white px-4 py-2.5 text-xs font-semibold shadow-xl animate-bounce"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <div>
        <p className="font-bold">Modo Offline ativado</p>
        <p className="text-[11px] text-amber-100">
          Você continua navegando com os dados salvos em cache no seu dispositivo.
        </p>
      </div>
    </div>
  );
};
