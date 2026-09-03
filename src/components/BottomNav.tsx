import React from 'react';
import { Home, Search, Briefcase, Plus, UserCheck } from 'lucide-react';
import { ActiveView } from '../hooks/useAppState';
import { UserRole } from '../types';

interface BottomNavProps {
  activeView: ActiveView;
  userRole: UserRole;
  unreadCount: number;
  onNavigate: (view: ActiveView) => void;
  onOpenPublish: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  userRole,
  unreadCount,
  onNavigate,
  onOpenPublish,
}) => {
  const dashboardView: ActiveView =
    userRole === 'professional'
      ? 'professional_dashboard'
      : userRole === 'admin'
      ? 'admin'
      : 'contractor_dashboard';

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DDE3E8] px-3 py-1.5 safe-area-pb shadow-lg">
      <div className="flex items-center justify-around relative">
        {/* Início */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-semibold transition ${
            activeView === 'home' ? 'text-[#071B2F] font-bold' : 'text-[#66727D] hover:text-[#071B2F]'
          }`}
        >
          <Home className={`w-4 h-4 ${activeView === 'home' ? 'text-[#071B2F]' : 'text-[#66727D]'}`} />
          <span className="mt-0.5">Início</span>
          {activeView === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#45C900] mt-0.5" />
          )}
        </button>

        {/* Buscar */}
        <button
          onClick={() => onNavigate('find_professionals')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-semibold transition ${
            activeView === 'find_professionals'
              ? 'text-[#071B2F] font-bold'
              : 'text-[#66727D] hover:text-[#071B2F]'
          }`}
        >
          <Search
            className={`w-4 h-4 ${
              activeView === 'find_professionals' ? 'text-[#071B2F]' : 'text-[#66727D]'
            }`}
          />
          <span className="mt-0.5">Buscar</span>
          {activeView === 'find_professionals' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#45C900] mt-0.5" />
          )}
        </button>

        {/* Central Action: "+ Publicar" (Ação Institucional: Azul-Marinho) */}
        <div className="-mt-4 flex justify-center">
          <button
            onClick={onOpenPublish}
            className="flex items-center justify-center h-12 w-12 rounded-full bg-[#071B2F] hover:bg-[#003A67] text-white shadow-md border-2 border-white active:scale-95 transition-transform"
            title="Publicar Serviço"
          >
            <Plus className="w-5 h-5 text-[#59E600]" />
          </button>
        </div>

        {/* Mural "EU RESOLVO" */}
        <button
          onClick={() => onNavigate('opportunities_wall')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-semibold transition ${
            activeView === 'opportunities_wall'
              ? 'text-[#071B2F] font-bold'
              : 'text-[#66727D] hover:text-[#071B2F]'
          }`}
        >
          <Briefcase
            className={`w-4 h-4 ${
              activeView === 'opportunities_wall' ? 'text-[#071B2F]' : 'text-[#66727D]'
            }`}
          />
          <span className="mt-0.5">Mural</span>
          {activeView === 'opportunities_wall' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#45C900] mt-0.5" />
          )}
        </button>

        {/* Meu Painel */}
        <button
          onClick={() => onNavigate(dashboardView)}
          className={`relative flex flex-col items-center justify-center w-14 py-1 text-[10px] font-semibold transition ${
            activeView === dashboardView
              ? 'text-[#071B2F] font-bold'
              : 'text-[#66727D] hover:text-[#071B2F]'
          }`}
        >
          <UserCheck
            className={`w-4 h-4 ${
              activeView === dashboardView ? 'text-[#071B2F]' : 'text-[#66727D]'
            }`}
          />
          <span className="mt-0.5">Painel</span>
          {activeView === dashboardView && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#45C900] mt-0.5" />
          )}
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-2 h-2 w-2 rounded-full bg-[#45C900]" />
          )}
        </button>
      </div>
    </div>
  );
};
