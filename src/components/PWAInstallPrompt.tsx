import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, Share } from 'lucide-react';
import { LogoIcon } from './LogoIcon';

interface PWAInstallPromptProps {
  compact?: boolean;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback guide
      alert('Para instalar no seu navegador: clique nos três pontinhos do menu e selecione "Instalar aplicativo" ou "Adicionar à tela inicial".');
    }
  };

  return (
    <>
      {installSuccess ? (
        <div className="flex items-center gap-2 rounded-xl bg-[#45C900]/15 text-[#071B2F] px-3 py-1.5 text-xs font-semibold border border-[#45C900]/30 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#45C900]" />
          <span>App instalado! Abra na tela inicial.</span>
        </div>
      ) : compact ? (
        <button
          id="btn-pwa-install-compact"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#071B2F] bg-white border border-slate-200 hover:border-[#45C900] hover:bg-slate-50 transition shadow-xs"
          title="Instalar aplicativo EURESOLVO no celular ou computador"
        >
          <Download className="w-3.5 h-3.5 text-[#45C900]" />
          <span>Instalar App</span>
        </button>
      ) : (
        <button
          id="btn-pwa-install"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#071B2F] bg-gradient-to-r from-emerald-50 to-lime-50 border border-[#45C900]/40 hover:border-[#45C900] transition shadow-xs hover:shadow-sm"
        >
          <Smartphone className="w-4 h-4 text-[#45C900]" />
          <span className="hidden sm:inline">Instalar EURESOLVO no celular</span>
          <span className="sm:hidden">Instalar App</span>
        </button>
      )}

      {/* iOS Safari Guided Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <LogoIcon size={36} className="h-9 w-9" />
              <div>
                <h3 className="text-base font-bold text-[#071B2F]">Instalar no iPhone / iPad</h3>
                <p className="text-xs text-slate-500">Acesse como um app nativo</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700 my-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#071B2F] text-[10px] font-bold text-white">
                  1
                </span>
                <p>
                  Toque no botão <strong className="inline-flex items-center gap-1 font-semibold text-sky-700"><Share className="w-3 h-3 inline" /> Compartilhar</strong> na barra inferior do Safari.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#071B2F] text-[10px] font-bold text-white">
                  2
                </span>
                <p>
                  Role a lista para baixo e selecione <strong className="font-semibold text-slate-900">Adicionar à Tela de Início</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#45C900] text-[10px] font-black text-[#071B2F]">
                  3
                </span>
                <p>
                  Toque em <strong className="font-semibold text-slate-900">Adicionar</strong> no canto superior direito.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#071B2F] text-white text-xs font-bold hover:bg-[#003A67] transition"
            >
              Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
