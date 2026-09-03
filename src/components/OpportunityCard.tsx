import React from 'react';
import { ServiceRequest, ServiceApplication } from '../types';
import {
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Building,
  User,
  Zap,
} from 'lucide-react';

interface OpportunityCardProps {
  request: ServiceRequest;
  hasApplied: boolean;
  onApply: (requestId: string) => void;
  onViewDetails: (requestId: string) => void;
  isProView?: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  request,
  hasApplied,
  onApply,
  onViewDetails,
  isProView = false,
}) => {
  const getUrgencyBadge = () => {
    switch (request.urgency) {
      case 'emergency':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
            <AlertCircle className="w-3 h-3 text-red-600" />
            Emergência
          </span>
        );
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <Zap className="w-3 h-3 text-amber-600" />
            Urgente
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            Normal
          </span>
        );
    }
  };

  const getContractorLabel = () => {
    if (request.organizationName) {
      return (
        <div className="flex items-center gap-1 text-xs font-semibold text-[#003A67] truncate">
          <Building className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{request.organizationName}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-xs font-medium text-slate-600 truncate">
        <User className="w-3.5 h-3.5 shrink-0 text-slate-400" />
        <span className="truncate">{request.contractorName}</span>
      </div>
    );
  };

  const isResolved = request.status === 'resolved';

  return (
    <div
      id={`card-req-${request.id}`}
      className={`group relative bg-white rounded-xl border p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        isResolved
          ? 'border-[#45C900]/40 bg-[#45C900]/5'
          : hasApplied
          ? 'border-[#071B2F] ring-1 ring-[#071B2F]/20'
          : 'border-[#DDE3E8] hover:border-[#003A67]'
      }`}
    >
      <div>
        {/* Header: Category & Urgency */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#003A67]">
            {request.categoryName}
          </span>
          <div className="flex items-center gap-2">
            {isResolved ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 border border-[#45C900]/40 bg-[#45C900]/15 text-[#003A67] rounded-md">
                <CheckCircle2 className="w-3 h-3 text-[#45C900]" />
                RESOLVIDO ✓
              </span>
            ) : (
              getUrgencyBadge()
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(request.id)}
          className="font-bold text-base text-[#071B2F] hover:text-[#45C900] cursor-pointer line-clamp-2 leading-snug mb-2 tracking-tight transition-colors"
        >
          {request.title}
        </h3>

        {/* Contractor Identity */}
        <div className="mb-3">{getContractorLabel()}</div>

        {/* Description snippet */}
        <p className="text-xs text-[#66727D] line-clamp-2 leading-relaxed mb-4 font-normal">
          {request.description}
        </p>

        {/* Badges Info (Location, Date, Time) */}
        <div className="space-y-1.5 py-2.5 my-2 border-t border-[#DDE3E8] text-xs text-[#66727D]">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#003A67] shrink-0" />
            <span className="font-semibold text-[#071B2F] truncate">
              {request.neighborhood}, {request.city}
              {request.distanceKm ? ` (~${request.distanceKm} km)` : ''}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#003A67] shrink-0" />
              <span className="font-semibold text-[#071B2F]">
                {request.dateLabel || request.serviceDate}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#003A67] shrink-0" />
              <span className="font-medium text-[#66727D]">
                {request.startTime} às {request.endTime}
              </span>
            </div>
          </div>

          {request.photosCount ? (
            <div className="flex items-center gap-1 text-[11px] text-[#66727D] pt-0.5 font-medium">
              <ImageIcon className="w-3.5 h-3.5 text-[#003A67]" />
              <span>{request.photosCount} foto(s) anexada(s)</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Action: EU RESOLVO Button (Ação de Resolução: Verde) */}
      <div className="pt-3 border-t border-[#DDE3E8] mt-2 flex items-center gap-2">
        <button
          onClick={() => onViewDetails(request.id)}
          className="py-2.5 px-3 rounded-lg text-xs font-semibold text-[#66727D] hover:text-[#071B2F] hover:bg-[#F5F7F9] transition"
        >
          Detalhes
        </button>

        {!isResolved && (
          hasApplied ? (
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg text-xs font-bold text-[#003A67] bg-[#45C900]/15 border border-[#45C900]/30">
              <CheckCircle2 className="w-4 h-4 text-[#45C900]" />
              <span>EU RESOLVO ENVIADO!</span>
            </div>
          ) : (
            <button
              id={`btn-eu-resolvo-${request.id}`}
              type="button"
              onClick={() => onApply(request.id)}
              className="flex-1 py-2.5 px-4 rounded-lg text-xs font-bold bg-[#45C900] hover:bg-[#59E600] active:scale-[0.99] text-[#071B2F] transition-all flex items-center justify-center gap-2 border border-[#45C900] shadow-xs"
            >
              <span>EU RESOLVO</span>
              <span className="text-[#071B2F] font-extrabold">→</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};
