import React, { useEffect, useState } from 'react';
import {
  UserProfile,
  ProfessionalProfile,
  ServiceRequest,
  ServiceApplication,
} from '../types';
import { StarRating } from '../components/StarRating';
import { supabase } from '../services/supabase';
import {
  Plus,
  Clock,
  CheckCircle2,
  MapPin,
  Calendar,
  MessageCircle,
  Building,
  User,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface ContractorDashboardViewProps {
  currentUser: UserProfile;
  requests: ServiceRequest[];
  applications: ServiceApplication[];
  professionals: ProfessionalProfile[];
  onOpenPublish: () => void;
  onSelectPro: (requestId: string, proId: string) => void;
  onMarkResolved: (requestId: string) => void;
  onViewRequestDetails: (requestId: string) => void;
}

export const ContractorDashboardView: React.FC<ContractorDashboardViewProps> = ({
  currentUser,
  requests,
  applications,
  professionals,
  onOpenPublish,
  onSelectPro,
  onMarkResolved,
  onViewRequestDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'open' | 'in_progress' | 'resolved'>('open');
  const [requestContacts, setRequestContacts] = useState<
    Record<
      string,
      {
        professionalPhone?: string;
        professionalWhatsapp?: string;
      }
    >
  >({});

  // Requests created by this contractor
  const myRequests = requests.filter((r) => r.contractorId === currentUser.id);

  useEffect(() => {
    if (!supabase) return;

    const selectedRequests = myRequests.filter(
      (r) => r.contactUnlocked && r.selectedProfessionalId
    );

    if (selectedRequests.length === 0) return;

    let cancelled = false;

    const loadContacts = async () => {
      const entries = await Promise.all(
        selectedRequests.map(async (req) => {
          const { data, error } = await supabase.rpc(
            "get_selected_contact_for_request",
            { p_request_id: req.id }
          );

          if (error) {
            console.error("Erro ao carregar contato liberado:", error);
            return null;
          }

          const contact = data?.[0];

          if (!contact) return null;

          return [
            req.id,
            {
              professionalPhone: contact.professional_phone || undefined,
              professionalWhatsapp: contact.professional_whatsapp || undefined,
            },
          ] as const;
        })
      );

      if (cancelled) return;

      const validEntries = entries.filter(
        (entry): entry is NonNullable<typeof entry> => entry !== null
      );

      setRequestContacts(Object.fromEntries(validEntries));
    };

    loadContacts();

    return () => {
      cancelled = true;
    };
  }, [requests, currentUser.id]);

  const filteredRequests = myRequests.filter((r) => {
    if (activeTab === 'resolved') return r.status === 'resolved';
    if (activeTab === 'in_progress') {
      return (
        r.status === 'professional_selected' ||
        r.status === 'scheduled' ||
        r.status === 'in_progress'
      );
    }
    return r.status === 'open' || r.status === 'receiving_applications';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#003A67] text-white flex items-center justify-center font-bold text-xl">
            {currentUser.organizationName ? (
              <Building className="w-7 h-7" />
            ) : (
              <User className="w-7 h-7" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#071B2F]">
                {currentUser.organizationName || currentUser.name}
              </h1>
              <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                {currentUser.contractorType === 'condominium'
                  ? 'Condomínio'
                  : currentUser.contractorType === 'company'
                  ? 'Empresa'
                  : 'Contratante'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Polo {currentUser.city} - {currentUser.state} • Painel de Gestão de Demandas
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPublish}
          className="px-5 py-3 rounded-2xl bg-[#071B2F] hover:bg-[#003A67] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition border border-[#003A67]"
        >
          <Plus className="w-4 h-4 text-[#45C900]" />
          <span>Publicar Nova Demanda</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('open')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'open'
              ? 'bg-[#071B2F] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Demandas Abertas (
          {
            myRequests.filter(
              (r) => r.status === 'open' || r.status === 'receiving_applications'
            ).length
          }
          )
        </button>

        <button
          onClick={() => setActiveTab('in_progress')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'in_progress'
              ? 'bg-[#071B2F] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Em Andamento / Selecionados (
          {
            myRequests.filter(
              (r) =>
                r.status === 'professional_selected' ||
                r.status === 'scheduled' ||
                r.status === 'in_progress'
            ).length
          }
          )
        </button>

        <button
          onClick={() => setActiveTab('resolved')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'resolved'
              ? 'bg-[#071B2F] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          RESOLVIDO ✓ ({myRequests.filter((r) => r.status === 'resolved').length})
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-6">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => {
            const reqApps = applications.filter((a) => a.requestId === req.id);
            const isResolved = req.status === 'resolved';

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                {/* Request Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {req.categoryName}
                      </span>
                      {isResolved ? (
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#45C900]/20 text-[#2B8A00]">
                          RESOLVIDO ✓
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                          {req.status === 'open'
                            ? 'Aguardando interessados'
                            : req.status === 'receiving_applications'
                            ? `${reqApps.length} interessado(s)`
                            : 'Profissional Selecionado'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {req.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isResolved && req.status === 'professional_selected' && (
                      <button
                        onClick={() => onMarkResolved(req.id)}
                        className="px-4 py-2 rounded-xl bg-[#071B2F] hover:bg-[#003A67] text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#45C900]" />
                        <span>Marcar como RESOLVIDO ✓</span>
                      </button>
                    )}
                    <button
                      onClick={() => onViewRequestDetails(req.id)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>

                {/* Request Info Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>
                      {req.neighborhood}, {req.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>
                      {req.dateLabel || req.serviceDate} ({req.startTime} - {req.endTime})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Urgência: {req.urgency}</span>
                  </div>
                </div>

                {/* Candidates Section */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Profissionais que disseram "EU RESOLVO" ({reqApps.length})
                  </h4>

                  {reqApps.length > 0 ? (
                    <div className="space-y-3">
                      {reqApps.map((app) => {
                        const isSelected = app.status === 'selected';
                        return (
                          <div
                            key={app.id}
                            className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                              isSelected
                                ? 'bg-emerald-50/50 border-[#45C900]/50'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-start gap-3.5">
                              <img
                                src={
                                  app.professionalAvatar ||
                                  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200'
                                }
                                alt={app.professionalName}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs font-bold text-slate-900">
                                    {app.professionalName}
                                  </h5>
                                  {isSelected && (
                                    <span className="text-[10px] font-black text-[#2B8A00] bg-[#45C900]/20 px-2 py-0.5 rounded-full">
                                      SELECIONADO ✓
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1">
                                  <StarRating rating={app.rating} size="sm" />
                                  <span>• {app.resolvedCount} resolvidos</span>
                                  <span>• {app.completionRate}% pontual</span>
                                </div>
                                {app.message && (
                                  <p className="text-xs text-slate-700 italic mt-2 bg-white p-2.5 rounded-xl border border-slate-100">
                                    "{app.message}"
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Action per candidate */}
                            <div className="flex items-center gap-2 shrink-0">
                              {isSelected ? (
                                requestContacts[req.id]?.professionalWhatsapp ? (
                                  <a
                                    href={`https://wa.me/${requestContacts[
                                      req.id
                                    ].professionalWhatsapp!.replace(/\D/g, "")}?text=${encodeURIComponent(
                                      `Olá, ${app.professionalName}! Te selecionei no EURESOLVO para o serviço "${req.title}".`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Falar no WhatsApp</span>
                                  </a>
                                ) : (
                                  <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold">
                                    Contato não informado
                                  </span>
                                )
                              ) : !isResolved ? (
                                <button
                                  onClick={() => onSelectPro(req.id, app.professionalId)}
                                  className="px-4 py-2 rounded-xl bg-[#071B2F] text-white text-xs font-bold hover:bg-[#003A67] transition"
                                >
                                  Escolher Este Profissional
                                </button>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 text-center text-xs text-slate-500">
                      Nenhum profissional clicou em "EU RESOLVO" ainda. Sua oportunidade está ativa e visível no mural!
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <p className="text-sm font-bold text-slate-800">
              Nenhuma demanda nesta aba.
            </p>
            <button
              onClick={onOpenPublish}
              className="mt-3 px-5 py-2.5 rounded-xl bg-[#071B2F] hover:bg-[#003A67] text-white text-xs font-bold transition"
            >
              Publicar Primeira Demanda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
