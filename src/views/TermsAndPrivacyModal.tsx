import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { LogoIcon } from '../components/LogoIcon';

interface TermsAndPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsAndPrivacyModal: React.FC<TermsAndPrivacyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 my-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <LogoIcon size={36} className="h-9 w-9" />
          <div>
            <h3 className="text-lg font-black text-[#071B2F]">
              Segurança, LGPD & Termos
            </h3>
            <p className="text-xs text-slate-500">
              EURESOLVO — Plataforma e Marketplace Profissional
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-700 max-h-80 overflow-y-auto pr-1">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <div className="flex items-center gap-2 font-bold mb-1">
              <Lock className="w-4 h-4 text-[#45C900]" />
              <span>Liberação Segura de Contatos (Antispam & LGPD)</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Seu telefone e WhatsApp <strong>não ficam expostos publicamente</strong> na web. Eles só são liberados quando um contratante e um profissional confirmam o interesse mútuo no serviço ("EU RESOLVO" + Seleção).
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">1. Sobre o Marketplace</h4>
            <p className="leading-relaxed">
              O EURESOLVO é uma plataforma de conexão entre prestadores autônomos/empresas e contratantes (pessoas físicas, condomínios, empresas, clínicas e comércios). Não cobramos taxas ocultas abusivas.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">2. Responsabilidade e Qualidade</h4>
            <p className="leading-relaxed">
              Todos os profissionais contam com histórico público de serviços resolvidos, selos de pontualidade e avaliações baseadas em 5 critérios objetivos: Qualidade, Pontualidade, Comunicação, Organização e Profissionalismo.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">3. Cancelamento e Segurança</h4>
            <p className="leading-relaxed">
              Ambas as partes podem reportar irregularidades à moderação do sistema através dos canais oficiais ou do painel administrativo.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#071B2F] text-white text-xs font-bold hover:bg-[#003A67] transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
