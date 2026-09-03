import React, { useState } from 'react';
import { ServiceRequest, ServiceApplication, UserProfile } from '../types';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Building,
  User,
  CheckCircle2,
  Phone,
  MessageCircle,
  Share2,
  AlertCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { StarRating } from '../components/StarRating';

interface OpportunityDetailModalProps {
  request: ServiceRequest | null;
  applications: ServiceApplication[];
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onApply: (requestId: string, message?: string) => void;
  onSelectPro?: (requestId: string, proId: string) => void;
  onMarkResolved?: (requestId: string) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  request,
  applications,
  currentUser,
  isOpen,
  onClose,
  onApply,
  onSelectPro,
  onMarkResolved,
}) => {
  const [customMessage, setCustomMessage] = useState('');
  const [showApplyBox, setShowApplyBox] = useState(false);

  if (!isOpen || !request) return null;

  const relevantApps = applications.filter((a) => a.requestId === request.id);
  const hasApplied = relevantApps.some((a) => a.professionalId === currentUser.id);
  const isOwner = request.contractorId === currentUser.id;
  const isSelectedPro = request.selectedProfessionalId === currentUser.id;
  const isResolved = request.status === 'resolved';

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(request.id, customMessage);
    setShowApplyBox(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 my-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status header */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
            {request.categoryName}
          </span>
          {request.urgency === 'emergency' ? (
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
              Emergência
            </span>
          ) : request.urgency === 'urgent' ? (
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
              Urgente
            </span>
          ) : null}

          {isResolved ? (
            <span className="text-xs font-black px-3 py-0.5 rounded-full bg-[#45C900]/20 text-[#2B8A00] border border-[#45C900]/40">
              RESOLVIDO ✓
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {request.status === 'open'
                ? 'Aberto para Propostas'
                : request.status === 'receiving_applications'
                ? 'Recebendo Interessados'
                : 'Profissional Selecionado'}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-[#071B2F] leading-snug mb-3">
          {request.title}
        </h2>

        {/* Contractor info */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mb-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#003A67] text-white font-bold text-sm">
            {request.organizationName ? (
              <Building className="w-5 h-5" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 truncate">
                {request.organizationName || request.contractorName}
              </span>
              <ShieldCheck className="w-4 h-4 text-[#45C900] shrink-0" />
            </div>
            <p className="text-xs text-slate-500">
              Contratante verificado no polo de {request.city} - RN
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Descrição da Demanda
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
            {request.description}
          </p>
        </div>

        {/* Schedule & Location details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs">
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <MapPin className="w-4 h-4 text-[#45C900]" />
              <span className="font-bold uppercase tracking-wider text-[10px]">Local de Atendimento</span>
            </div>
            <p className="font-bold text-slate-800 text-sm">
              {request.neighborhood}, {request.city} - {request.state}
            </p>
            {request.address && (
              <p className="text-slate-500 text-xs mt-0.5">{request.address}</p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Calendar className="w-4 h-4 text-[#003A67]" />
              <span className="font-bold uppercase tracking-wider text-[10px]">Data & Horário</span>
            </div>
            <p className="font-bold text-slate-800 text-sm">
              {request.dateLabel || request.serviceDate} ({request.startTime} às {request.endTime})
            </p>
            <p className="text-slate-500 text-xs mt-0.5">Turno: {request.timeSlot || 'Preferência contratante'}</p>
          </div>
        </div>

        {/* Photos if any */}
        {request.images && request.images.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Fotos Anexadas ({request.images.length})
            </h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {request.images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-32 h-24 shrink-0 rounded-2xl overflow-hidden border border-slate-200"
                >
                  <img
                    src={img}
                    alt="Foto da demanda"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Contact Section (When professional is selected) */}
        {request.contactUnlocked && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#45C900]" />
                <span>Contato e WhatsApp Liberados com Segurança</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                LGPD Protegido
              </span>
            </div>
            <p className="text-xs text-emerald-800 mb-3">
              Profissional selecionado:{' '}
              <strong>{request.selectedProfessionalName}</strong>. Já podem combinar os detalhes finais da chegada:
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://wa.me/5584994223180?text=Olá!%20Vi%20sua%20solicitação%20no%20EURESOLVO"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] text-white font-bold text-xs shadow-xs hover:bg-[#20bd5a] transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar pelo WhatsApp</span>
              </a>
              {isOwner && !isResolved && onMarkResolved && (
                <button
                  onClick={() => onMarkResolved(request.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#071B2F] text-white font-bold text-xs hover:bg-[#003A67] transition"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#45C900]" />
                  <span>Marcar como RESOLVIDO ✓</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Interested Candidates Section (For Contractor view) */}
        {isOwner && relevantApps.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Candidatos que disseram "EU RESOLVO" ({relevantApps.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {relevantApps.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        app.professionalAvatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
                      }
                      alt={app.professionalName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{app.professionalName}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <StarRating rating={app.rating} size="sm" />
                        <span>• {app.resolvedCount} resolvidos</span>
                      </div>
                    </div>
                  </div>

                  {request.status !== 'resolved' && (
                    app.status === 'selected' ? (
                      <span className="text-xs font-bold text-[#45C900] bg-emerald-50 px-2.5 py-1 rounded-xl">
                        Selecionado ✓
                      </span>
                    ) : onSelectPro ? (
                      <button
                        onClick={() => onSelectPro(request.id, app.professionalId)}
                        className="px-3 py-1.5 rounded-xl bg-[#071B2F] text-white text-xs font-bold hover:bg-[#003A67] transition"
                      >
                        Selecionar
                      </button>
                    ) : null
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button: "EU RESOLVO" for Professional view */}
        {!isResolved && currentUser.role === 'professional' && (
          hasApplied ? (
            <div className="p-4 rounded-2xl bg-[#45C900]/15 text-[#2B8A00] border border-[#45C900]/30 text-center font-bold text-sm">
              ✓ Você já demonstrou interesse nesta oportunidade. Aguarde o retorno do contratante!
            </div>
          ) : showApplyBox ? (
            <form onSubmit={handleApplySubmit} className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-800">
                Sua Mensagem / Apresentação Rápida
              </label>
              <textarea
                rows={2}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Ex: Olá! Estou perto e com agenda livre. Tenho ferramentas completas e atendo imediatamente."
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyBox(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#071B2F] text-[#45C900] font-black text-xs hover:bg-[#003A67] transition flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>CONFIRMAR EU RESOLVO</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={() => setShowApplyBox(true)}
                className="flex-1 py-3 px-6 rounded-2xl bg-[#071B2F] hover:bg-[#003A67] text-white text-sm font-extrabold transition-all shadow-md flex items-center justify-center gap-2 border border-[#003A67] active:scale-98"
              >
                <span className="text-[#45C900] font-black text-base tracking-wide">
                  EU RESOLVO
                </span>
                <span className="text-white text-xs font-semibold">
                  (Demonstrar Prontidão)
                </span>
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
