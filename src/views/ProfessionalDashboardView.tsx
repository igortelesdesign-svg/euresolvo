import React, { useRef, useState } from 'react';
import {
  UserProfile,
  ProfessionalProfile,
  ServiceRequest,
  ServiceApplication,
} from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { WeeklyAvailabilityEditor } from '../components/WeeklyAvailabilityEditor';
import { StarRating } from '../components/StarRating';
import {
  Zap,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  MapPin,
  Bell,
  ArrowRight,
  Sparkles,
  Camera,
  Loader2,
} from 'lucide-react';
import { ActiveView } from '../hooks/useAppState';

interface ProfessionalDashboardViewProps {
  currentUser: UserProfile;
  profile: ProfessionalProfile | null;
  requests: ServiceRequest[];
  applications: ServiceApplication[];
  onToggleAvailableNow: () => void;
  onSaveSchedule: (schedule: any) => void;
  onApplyToRequest: (requestId: string) => void;
  onSelectRequest: (requestId: string) => void;
  onNavigate: (view: ActiveView) => void;
  onUpdateAvatar: (file: File) => Promise<boolean>;
}

export const ProfessionalDashboardView: React.FC<ProfessionalDashboardViewProps> = ({
  currentUser,
  profile,
  requests,
  applications,
  onToggleAvailableNow,
  onSaveSchedule,
  onApplyToRequest,
  onSelectRequest,
  onNavigate,
  onUpdateAvatar,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    await onUpdateAvatar(file);
    setIsUploadingAvatar(false);
    event.target.value = '';
  };
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-slate-600">Perfil profissional não inicializado.</p>
      </div>
    );
  }

  // Applications made by this professional
  const myApplications = applications.filter((a) => a.professionalId === profile.id);

  // Compatible open opportunities
  const compatibleRequests = requests
    .filter(
      (r) =>
        r.status !== 'resolved' &&
        (r.categoryName === profile.mainCategory ||
          profile.categories.includes(r.categoryName) ||
          profile.serviceAreas.includes(r.city))
    )
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#071B2F] to-[#003A67] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={
                currentUser.avatarUrl ||
                'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200'
              }
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              aria-label="Alterar foto de perfil"
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-[#45C900] text-[#071B2F] border-2 border-[#071B2F] flex items-center justify-center shadow-lg disabled:opacity-60"
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{currentUser.name}</h1>
              <span className="text-[11px] font-bold bg-[#45C900] text-[#071B2F] px-2 py-0.5 rounded-full">
                Profissional Ativo
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {profile.mainCategory} • Polo {currentUser.city} - {currentUser.state}
            </p>
          </div>
        </div>

        {/* Big Toggle "ESTOU DISPONÍVEL AGORA" */}
        <button
          onClick={onToggleAvailableNow}
          className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md flex items-center gap-2.5 ${
            profile.isAvailableNow
              ? 'bg-[#45C900] text-[#071B2F] hover:bg-[#59E600]'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
          }`}
        >
          <span className="relative flex h-3 w-3">
            {profile.isAvailableNow && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#071B2F] opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                profile.isAvailableNow ? 'bg-[#071B2F]' : 'bg-slate-400'
              }`}
            />
          </span>
          <Zap className="w-4 h-4 fill-current" />
          <span>
            {profile.isAvailableNow ? 'ESTOU DISPONÍVEL AGORA' : 'Ativar "Disponível Agora"'}
          </span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Serviços Resolvidos</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-[#071B2F]">
              {profile.resolvedCount}
            </span>
            <CheckCircle2 className="w-5 h-5 text-[#45C900]" />
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Selo RESOLVIDO ✓
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Média de Avaliação</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {profile.rating.toFixed(1)}
            </span>
            <StarRating rating={profile.rating} size="sm" showNumber={false} />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {profile.totalReviews} avaliações registradas
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Taxa de Pontualidade</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {profile.completionRate}%
            </span>
            <Clock className="w-5 h-5 text-sky-600" />
          </div>
          <span className="text-[11px] text-sky-800 font-semibold mt-1 block">
            Alta confiabilidade
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Minhas Candidaturas</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-[#003A67]">
              {myApplications.length}
            </span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Disse "EU RESOLVO"
          </span>
        </div>
      </div>

      {/* Minhas Candidaturas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-[#071B2F]">
              Minhas Candidaturas
            </h2>
            <p className="text-xs text-slate-500">
              Acompanhe as oportunidades em que você clicou em EU RESOLVO
            </p>
          </div>

          <span className="text-xs font-bold text-[#003A67] bg-[#003A67]/10 px-3 py-1.5 rounded-full">
            {myApplications.length} candidatura{myApplications.length === 1 ? '' : 's'}
          </span>
        </div>

        {myApplications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-[#071B2F]">
              Você ainda não enviou nenhuma candidatura
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Quando clicar em EU RESOLVO, a oportunidade aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myApplications.map((application) => {
              const request = requests.find(
                (r) => r.id === application.requestId
              );

              if (!request) return null;

              const statusLabel =
                application.status === 'selected'
                  ? 'Selecionado'
                  : application.status === 'rejected'
                  ? 'Não selecionado'
                  : application.status === 'cancelled'
                  ? 'Cancelado'
                  : 'Aguardando retorno';

              return (
                <button
                  key={application.id}
                  type="button"
                  onClick={() => onSelectRequest(request.id)}
                  className="w-full text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#003A67] hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wide text-[#003A67]">
                        {request.categoryName}
                      </span>

                      <h3 className="text-sm font-black text-[#071B2F] mt-1">
                        {request.title}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 text-[10px] font-black px-2.5 py-1 rounded-full ${
                        application.status === 'selected'
                          ? 'bg-[#45C900]/15 text-[#2B8A00]'
                          : application.status === 'rejected' ||
                            application.status === 'cancelled'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#003A67]" />
                      <span>
                        {request.neighborhood
                          ? `${request.neighborhood}, `
                          : ''}
                        {request.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#003A67]" />
                      <span>
                        Candidatura enviada em{' '}
                        {new Date(application.appliedAt).toLocaleDateString(
                          'pt-BR'
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#2B8A00]">
                      EU RESOLVO enviado ✓
                    </span>

                    <span className="text-[11px] font-bold text-[#003A67] flex items-center gap-1">
                      Ver oportunidade
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Oportunidades Próximas / Recomendadas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-[#071B2F]">
              Oportunidades Compatíveis com Você
            </h2>
            <p className="text-xs text-slate-500">
              Demandas abertas na sua área de atuação ({profile.mainCategory})
            </p>
          </div>

          <button
            onClick={() => onNavigate('opportunities_wall')}
            className="text-xs font-bold text-[#003A67] hover:underline flex items-center gap-1"
          >
            <span>Ver mural completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {compatibleRequests.map((req) => {
            const hasApplied = applications.some(
              (a) => a.requestId === req.id && a.professionalId === profile.id
            );
            return (
              <OpportunityCard
                key={req.id}
                request={req}
                hasApplied={hasApplied}
                onApply={onApplyToRequest}
                onViewDetails={onSelectRequest}
              />
            );
          })}
        </div>
      </div>

      {/* Weekly Schedule Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-black text-[#071B2F]">
            Minha Agenda & Horários de Atendimento
          </h2>
          <p className="text-xs text-slate-500">
            Mantenha seus dias e turnos atualizados para receber solicitações pontuais
          </p>
        </div>

        <WeeklyAvailabilityEditor
          schedule={profile.weeklySchedule}
          isAvailableNow={profile.isAvailableNow}
          onToggleAvailableNow={onToggleAvailableNow}
          onSaveSchedule={onSaveSchedule}
        />
      </div>
    </div>
  );
};
