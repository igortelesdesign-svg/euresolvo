import React from 'react';
import { ProfessionalProfile, UserProfile } from '../types';
import { StarRating } from './StarRating';
import { AvailabilityBadge } from './AvailabilityBadge';
import { Badge } from './Badge';
import { MapPin, CheckCircle, Heart, ArrowRight } from 'lucide-react';

interface ProfessionalCardProps {
  professional: ProfessionalProfile;
  user: UserProfile;
  isFavorite: boolean;
  onSelect: (proId: string) => void;
  onToggleFavorite: (proId: string) => void;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  user,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  return (
    <div
      id={`card-pro-${professional.id}`}
      className="group relative bg-white rounded-xl border border-[#DDE3E8] hover:border-[#003A67] p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Availability & Favorite */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <AvailabilityBadge
            isAvailableNow={professional.isAvailableNow}
            nextAvailableText={
              professional.isAvailableNow ? 'Disponível Agora' : 'Disponível com agendamento'
            }
          />
          <button
            id={`btn-fav-${professional.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(professional.id);
            }}
            className={`p-1.5 rounded-lg transition ${
              isFavorite
                ? 'text-rose-600 bg-rose-50'
                : 'text-[#66727D] hover:text-rose-600 hover:bg-[#F5F7F9]'
            }`}
            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* User Info Header */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="relative shrink-0">
            <img
              src={
                user.avatarUrl ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
              }
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-xl object-cover border border-[#DDE3E8]"
            />
            {professional.isAvailableNow && (
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center bg-[#071B2F] rounded-full ring-2 ring-white">
                <span className="h-1.5 w-1.5 bg-[#45C900] rounded-full" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#003A67] block mb-0.5">
              {professional.mainCategory}
            </span>
            <h3 className="font-bold text-base text-[#071B2F] truncate tracking-tight leading-tight">
              {user.professionalName || user.name}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-[#66727D] mt-1 font-medium">
              <MapPin className="w-3 h-3 text-[#003A67] shrink-0" />
              <span className="truncate">
                {user.neighborhood ? `${user.neighborhood}, ` : ''}
                {user.city} - {user.state}
              </span>
            </div>
          </div>
        </div>

        {/* Rating and Metrics */}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 py-2.5 my-2 border-y border-[#DDE3E8] text-xs font-medium">
          <StarRating rating={professional.rating} reviewCount={professional.totalReviews} size="sm" />
          <div className="flex items-center gap-1 font-semibold text-[#071B2F]">
            <CheckCircle className="w-3.5 h-3.5 text-[#45C900]" />
            <span>{professional.resolvedCount} resolvidos</span>
          </div>
          <div className="text-[#66727D]">
            <span>{professional.completionRate}% pontualidade</span>
          </div>
        </div>

        {/* Bio snippet */}
        <p className="text-xs text-[#66727D] line-clamp-2 leading-relaxed mb-3 font-normal">
          {professional.bio}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {professional.badges.slice(0, 3).map((badge) => (
            <Badge key={badge.id} badge={badge} size="sm" />
          ))}
        </div>
      </div>

      {/* Action Footer (Ação Institucional: Azul-Marinho) */}
      <button
        id={`btn-view-pro-${professional.id}`}
        onClick={() => onSelect(professional.id)}
        className="w-full mt-2 py-2.5 px-4 rounded-lg text-xs font-bold bg-[#071B2F] text-white hover:bg-[#003A67] transition flex items-center justify-center gap-2 border border-[#071B2F] shadow-xs"
      >
        <span>Ver Perfil & Horários</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#59E600]" />
      </button>
    </div>
  );
};
