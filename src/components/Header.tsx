import React, { useState } from 'react';
import { Logo } from './Logo';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import {
  Bell,
  Plus,
  User,
  Shield,
  Briefcase,
  ChevronDown,
  Menu,
  X,
  Building2,
  Search,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';
import { ActiveView } from '../hooks/useAppState';

interface HeaderProps {
  currentUser: UserProfile;
  users: UserProfile[];
  activeView: ActiveView;
  unreadCount: number;
  onNavigate: (view: ActiveView) => void;
  onOpenPublish: () => void;
  onOpenAuth: () => void;
  onSwitchUser: (userId: string) => void;
  isAuthenticated: boolean;
  onLogout: () => Promise<boolean>;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  users,
  activeView,
  unreadCount,
  onNavigate,
  onOpenPublish,
  onOpenAuth,
  onSwitchUser,
  isAuthenticated,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: { label: string; view: ActiveView; icon?: React.ReactNode }[] = [
    { label: 'Início', view: 'home' },
    { label: 'Buscar Profissionais', view: 'find_professionals' },
    { label: 'Mural de Oportunidades', view: 'opportunities_wall' },
    { label: 'Para Empresas & Condomínios', view: 'for_companies' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#DDE3E8]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-1.5 sm:gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Logo
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              showSubtitle={false}
              className="py-1"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  id={`nav-${item.view}`}
                  onClick={() => onNavigate(item.view)}
                  className={`text-xs font-semibold transition-all cursor-pointer py-1 relative ${
                    isActive
                      ? 'text-[#071B2F] font-bold border-b-2 border-[#45C900]'
                      : 'text-[#66727D] hover:text-[#071B2F] hover:border-b-2 hover:border-[#DDE3E8]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* PWA Install Button */}
            <div className="hidden sm:block">
              <PWAInstallPrompt compact />
            </div>

            {/* Auth / User Menu */}
            <div className="relative hidden sm:block">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F5F7F9] hover:bg-[#DDE3E8]/50 text-[#071B2F] border border-[#DDE3E8] transition"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#45C900]" />
                    <span className="max-w-[110px] sm:max-w-[140px] truncate text-xs font-semibold text-[#071B2F]">
                      {currentUser.name.split(' ')[0]} (
                      {currentUser.role === 'professional'
                        ? 'Pro'
                        : currentUser.role === 'admin'
                        ? 'Admin'
                        : 'Contratante'}
                      )
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#66727D]" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-white p-2 shadow-xl border border-[#DDE3E8] z-50 animate-fade-in"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-[#DDE3E8]">
                        <p className="text-xs font-bold text-[#071B2F]">
                          {currentUser.name}
                        </p>
                        <p className="text-[10px] text-[#66727D] mt-0.5">
                          {currentUser.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            if (currentUser.role === 'professional') {
                              onNavigate('professional_dashboard');
                            } else if (currentUser.role === 'admin') {
                              onNavigate('admin');
                            } else {
                              onNavigate('contractor_dashboard');
                            }
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#071B2F] hover:bg-[#F5F7F9] transition"
                        >
                          Meu Painel
                        </button>

                        <button
                          onClick={async () => {
                            setUserDropdownOpen(false);
                            await onLogout();
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                        >
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#071B2F] text-white hover:bg-[#003A67] transition"
                >
                  Entrar
                </button>
              )}
            </div>

            {/* Notifications Bell */}
            <button
              id="btn-notifications"
              onClick={() => onNavigate('notifications')}
              className="relative p-2 rounded-lg text-[#071B2F] hover:bg-[#F5F7F9] border border-[#DDE3E8] transition"
              title="Notificações"
            >
              <Bell className="w-4 h-4 text-[#071B2F]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center bg-[#45C900] text-[9px] font-bold text-[#071B2F] rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Primary CTA: "+ Publicar Serviço" (Ação Institucional: Azul-Marinho) */}
            <button
              id="btn-header-publish"
              onClick={onOpenPublish}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs text-white bg-[#071B2F] hover:bg-[#003A67] active:scale-[0.98] transition shadow-xs border border-[#071B2F]"
            >
              <Plus className="w-3.5 h-3.5 text-[#59E600]" />
              <span className="hidden sm:inline">Publicar Serviço</span>
              <span className="sm:hidden">Pedir</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#071B2F] hover:bg-[#F5F7F9] border border-[#DDE3E8]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#DDE3E8] bg-white px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
                  activeView === item.view
                    ? 'bg-[#071B2F] text-white'
                    : 'text-[#071B2F] hover:bg-[#F5F7F9]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-[#DDE3E8] pt-3 space-y-2">
            <button
              onClick={() => {
                if (currentUser.role === 'professional') {
                  onNavigate('professional_dashboard');
                } else if (currentUser.role === 'admin') {
                  onNavigate('admin');
                } else {
                  onNavigate('contractor_dashboard');
                }
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#F5F7F9] text-xs font-bold text-[#071B2F] border border-[#DDE3E8]"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#003A67]" />
                <span>Meu Painel ({currentUser.name.split(' ')[0]})</span>
              </div>
              <span className="text-[10px] text-[#66727D] uppercase font-semibold">
                {currentUser.role}
              </span>
            </button>

            <button
              onClick={() => {
                onNavigate('schedule');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#071B2F] hover:bg-[#F5F7F9] rounded-lg"
            >
              <Calendar className="w-4 h-4 text-[#003A67]" />
              <span>Agenda de Disponibilidade</span>
            </button>

            <button
              onClick={() => {
                onNavigate('favorites');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#071B2F] hover:bg-[#F5F7F9] rounded-lg"
            >
              <Sparkles className="w-4 h-4 text-[#45C900]" />
              <span>Profissionais Favoritos</span>
            </button>

            <div className="pt-2">
              <PWAInstallPrompt />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
