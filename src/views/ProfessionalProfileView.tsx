import React from 'react';
import {
  UserProfile,
  ProfessionalProfile,
  Review,
} from '../types';
import { StarRating } from '../components/StarRating';
import { AvailabilityBadge } from '../components/AvailabilityBadge';
import { Badge } from '../components/Badge';
import {
  MapPin,
  CheckCircle,
  Calendar,
  Clock,
  ShieldCheck,
  Heart,
  Share2,
  ArrowLeft,
  Sparkles,
  Award,
  Phone,
} from 'lucide-react';

interface ProfessionalProfileViewProps {
  professional: ProfessionalProfile | null;
  user: UserProfile | null;
  reviews: Review[];
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: (proId: string) => void;
  onRequestService: () => void;
}

export const ProfessionalProfileView: React.FC<ProfessionalProfileViewProps> = ({
  professional,
  user,
  reviews,
  isFavorite,
  onBack,
  onToggleFavorite,
  onRequestService,
}) => {
  if (!professional || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-slate-500">Profissional não encontrado.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-[#071B2F] text-white text-xs font-bold"
        >
          Voltar para a busca
        </button>
      </div>
    );
  }

  const proReviews = reviews.filter((r) => r.targetId === professional.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para a lista</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="relative shrink-0">
              <img
                src={
                  user.avatarUrl ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'
                }
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-slate-200 ring-4 ring-slate-50 shadow-sm"
              />
              {professional.isAvailableNow && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#45C900] ring-4 ring-white">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#071B2F]">
                  {user.professionalName || user.name}
                </h1>
                <ShieldCheck className="w-5 h-5 text-[#45C900] shrink-0" />
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
                {professional.mainCategory} • {professional.experienceYears} anos de experiência
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {user.neighborhood ? `${user.neighborhood}, ` : ''}
                  {user.city} - {user.state}
                </span>
                <span>•</span>
                <span className="text-slate-400">Atende em: {professional.serviceAreas.join(', ')}</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <AvailabilityBadge
                  isAvailableNow={professional.isAvailableNow}
                  nextAvailableText="Disponível para agendamento"
                />
                {user.hasCnpj && (
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                    Emite Nota Fiscal (CNPJ)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => onToggleFavorite(professional.id)}
              className={`p-2.5 rounded-2xl border transition flex items-center gap-1.5 text-xs font-bold ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
              <span>{isFavorite ? 'Favorito' : 'Favoritar'}</span>
            </button>

            <button
              onClick={onRequestService}
              className="px-6 py-3 rounded-2xl bg-[#071B2F] hover:bg-[#003A67] text-white font-black text-xs sm:text-sm shadow-md transition border border-[#003A67]"
            >
              <span className="text-[#45C900]">SOLICITAR SERVIÇO</span>
            </button>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-slate-100">
          <div>
            <span className="text-xs text-slate-500 font-medium">Avaliação Geral</span>
            <div className="flex items-center gap-1.5 mt-1">
              <StarRating rating={professional.rating} size="sm" showNumber={false} />
              <span className="font-extrabold text-sm text-slate-900">
                {professional.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-medium">Serviços Resolvidos</span>
            <p className="font-extrabold text-sm text-[#071B2F] mt-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-[#45C900]" />
              <span>{professional.resolvedCount} concluídos</span>
            </p>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-medium">Taxa de Pontualidade</span>
            <p className="font-extrabold text-sm text-slate-900 mt-1">
              {professional.completionRate}% pontual
            </p>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-medium">Pontuação EURESOLVO</span>
            <p className="font-extrabold text-sm text-[#003A67] mt-1 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{professional.score} pts</span>
            </p>
          </div>
        </div>

        {/* Badges & Specializations */}
        <div className="pt-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Selos de Confiança Conquistados
            </h3>
            <div className="flex flex-wrap gap-2">
              {professional.badges.map((b) => (
                <Badge key={b.id} badge={b} size="md" />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Sobre o Profissional
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {professional.bio}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Especialidades e Serviços Atendidos
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {professional.subcategories.map((sub, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Display */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#003A67] flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#071B2F]">
              Disponibilidade Semanal de Atendimento
            </h3>
            <p className="text-xs text-slate-500">
              Horários regulares em que o profissional costuma realizar atendimentos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {professional.weeklySchedule.map((day) => (
            <div
              key={day.dayOfWeek}
              className={`p-3.5 rounded-2xl border text-xs ${
                day.enabled
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-slate-50/50 border-slate-100 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between font-bold mb-1">
                <span>{day.dayLabel}</span>
                {day.enabled ? (
                  <span className="text-[#45C900] text-[10px]">Aberto</span>
                ) : (
                  <span className="text-slate-400 text-[10px]">Folga</span>
                )}
              </div>
              {day.enabled && day.slots.length > 0 ? (
                <div className="space-y-0.5 text-[11px] text-slate-600">
                  {day.slots.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {s.start} às {s.end}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">Sem atendimentos</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section with 5 Criteria */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-[#071B2F]">
              Avaliações de Clientes ({proReviews.length})
            </h3>
            <p className="text-xs text-slate-500">
              Critérios auditados: Qualidade, Pontualidade, Comunicação, Organização e Profissionalismo.
            </p>
          </div>
        </div>

        {proReviews.length > 0 ? (
          <div className="space-y-4">
            {proReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{rev.authorName}</p>
                    <p className="text-[11px] text-slate-500">{rev.serviceTitle}</p>
                  </div>
                  <StarRating rating={rev.rating} size="sm" />
                </div>

                {/* 5 criteria badges */}
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                  <span>Qualidade: <strong>{rev.criteria.quality}/5</strong></span>
                  <span>•</span>
                  <span>Pontualidade: <strong>{rev.criteria.punctuality}/5</strong></span>
                  <span>•</span>
                  <span>Comunicação: <strong>{rev.criteria.communication}/5</strong></span>
                  <span>•</span>
                  <span>Organização: <strong>{rev.criteria.organization}/5</strong></span>
                  <span>•</span>
                  <span>Postura: <strong>{rev.criteria.professionalism}/5</strong></span>
                </div>

                {rev.comment && (
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            Nenhuma avaliação escrita ainda. Seja o primeiro a avaliar após a conclusão do serviço!
          </p>
        )}
      </div>
    </div>
  );
};
