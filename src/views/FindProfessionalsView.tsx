import React, { useState, useMemo } from 'react';
import {
  UserProfile,
  ProfessionalProfile,
} from '../types';
import { SearchFilters } from '../hooks/useAppState';
import { SERVICE_CATEGORIES } from '../data/categories';
import { POPULAR_LOCATIONS } from '../data/locations';
import { ProfessionalCard } from '../components/ProfessionalCard';
import {
  Search,
  MapPin,
  Filter,
  Zap,
  Star,
  CheckCircle,
  SlidersHorizontal,
} from 'lucide-react';

interface FindProfessionalsViewProps {
  professionals: ProfessionalProfile[];
  users: UserProfile[];
  favorites: string[];
  filters: SearchFilters;
  onUpdateFilters: (filters: SearchFilters) => void;
  onSelectPro: (proId: string) => void;
  onToggleFavorite: (proId: string) => void;
}

export const FindProfessionalsView: React.FC<FindProfessionalsViewProps> = ({
  professionals,
  users,
  favorites,
  filters,
  onUpdateFilters,
  onSelectPro,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState(filters.query || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
  const [selectedCity, setSelectedCity] = useState(filters.city || 'Natal');
  const [onlyAvailableNow, setOnlyAvailableNow] = useState(filters.onlyAvailableNow);
  const [sortBy, setSortBy] = useState<'rating' | 'resolved' | 'score'>('score');

  const filteredPros = useMemo(() => {
    return professionals
      .filter((pro) => {
        const user = users.find((u) => u.id === pro.userId);
        if (!user) return false;

        // Query check
        if (query.trim()) {
          const q = query.toLowerCase();
          const matchName = user.name.toLowerCase().includes(q);
          const matchProName = (user.professionalName || '').toLowerCase().includes(q);
          const matchCategory = pro.mainCategory.toLowerCase().includes(q);
          const matchSub = pro.subcategories.some((s) => s.toLowerCase().includes(q));
          const matchBio = pro.bio.toLowerCase().includes(q);
          if (!matchName && !matchProName && !matchCategory && !matchSub && !matchBio) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory) {
          const matchCat =
            pro.mainCategory === selectedCategory ||
            pro.categories.includes(selectedCategory);
          if (!matchCat) return false;
        }

        // City filter
        if (selectedCity && !pro.serviceAreas.includes(selectedCity) && user.city !== selectedCity) {
          return false;
        }

        // Available now filter
        if (onlyAvailableNow && !pro.isAvailableNow) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'resolved') return b.resolvedCount - a.resolvedCount;
        return b.score - a.score;
      });
  }, [professionals, users, query, selectedCategory, selectedCity, onlyAvailableNow, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#DDE3E8] pb-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#45C900] block mb-1">
          Diretório de Especialistas
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071B2F] tracking-[-0.03em] leading-[1.05]">
          Encontre Quem Pode Resolver
        </h1>
        <p className="text-xs sm:text-sm text-[#66727D] mt-2 max-w-2xl font-normal leading-relaxed">
          Profissionais verificados com avaliação transparente e horários disponíveis na agenda para atendimento imediato ou programado.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#DDE3E8] shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Query */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[#071B2F] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por serviço, profissão ou nome..."
              className="w-full text-xs rounded-lg border border-[#DDE3E8] bg-[#F5F7F9] pl-10 pr-3 py-2.5 text-[#071B2F] focus:border-[#45C900] focus:ring-1 focus:ring-[#45C900] focus:outline-none transition font-medium placeholder-[#66727D]"
            />
          </div>

          {/* Cidade */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#071B2F] absolute left-3.5 top-3.5" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full text-xs rounded-lg border border-[#DDE3E8] pl-10 pr-3 py-2.5 bg-[#F5F7F9] text-[#071B2F] focus:border-[#45C900] focus:ring-1 focus:ring-[#45C900] focus:outline-none transition font-medium cursor-pointer"
            >
              <option value="">Todas as cidades</option>
              {POPULAR_LOCATIONS.map((l) => (
                <option key={l.city} value={l.city}>
                  {l.city} - {l.state}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenar */}
          <div className="relative">
            <SlidersHorizontal className="w-4 h-4 text-[#071B2F] absolute left-3.5 top-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs rounded-lg border border-[#DDE3E8] pl-10 pr-3 py-2.5 bg-[#F5F7F9] text-[#071B2F] focus:border-[#45C900] focus:ring-1 focus:ring-[#45C900] focus:outline-none transition font-medium cursor-pointer"
            >
              <option value="score">Relevância EURESOLVO</option>
              <option value="rating">Melhor Avaliação</option>
              <option value="resolved">Mais Serviços Resolvidos</option>
            </select>
          </div>
        </div>

        {/* Category horizontal pills & Available Now Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#DDE3E8]">
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === ''
                  ? 'bg-[#071B2F] text-white shadow-2xs'
                  : 'bg-white text-[#66727D] border border-[#DDE3E8] hover:bg-[#F5F7F9] hover:text-[#071B2F]'
              }`}
            >
              Todas as Categorias
            </button>
            {SERVICE_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() =>
                  setSelectedCategory(selectedCategory === c.name ? '' : c.name)
                }
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === c.name
                    ? 'bg-[#071B2F] text-white shadow-2xs'
                    : 'bg-white text-[#66727D] border border-[#DDE3E8] hover:bg-[#F5F7F9] hover:text-[#071B2F]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#071B2F] bg-[#F5F7F9] px-3.5 py-1.5 rounded-lg border border-[#DDE3E8] shrink-0">
            <input
              type="checkbox"
              checked={onlyAvailableNow}
              onChange={(e) => setOnlyAvailableNow(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-[#45C900] focus:ring-[#45C900] border-[#DDE3E8] cursor-pointer accent-[#45C900]"
            />
            <span className="flex items-center gap-1.5 text-[#071B2F]">
              <Zap className="w-3.5 h-3.5 text-[#45C900] fill-current" />
              <span>Apenas DISPONÍVEL AGORA</span>
            </span>
          </label>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#66727D] px-1 font-medium">
        <span>
          Encontrados <strong className="text-[#071B2F] font-bold">{filteredPros.length}</strong> profissionais em {selectedCity || 'todas as regiões'}
        </span>
      </div>

      {/* Grid */}
      {filteredPros.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPros.map((pro) => {
            const user = users.find((u) => u.id === pro.userId);
            if (!user) return null;
            return (
              <ProfessionalCard
                key={pro.id}
                professional={pro}
                user={user}
                isFavorite={favorites.includes(pro.id)}
                onSelect={onSelectPro}
                onToggleFavorite={onToggleFavorite}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-[#DDE3E8] p-8 shadow-xs">
          <div className="w-12 h-12 rounded-xl border border-[#DDE3E8] bg-[#F5F7F9] flex items-center justify-center mx-auto text-[#071B2F] mb-3">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#071B2F] tracking-tight">
            Nenhum profissional encontrado com esses filtros
          </h3>
          <p className="text-xs text-[#66727D] mt-1 max-w-sm mx-auto font-normal">
            Tente remover alguns filtros de categoria ou desativar o filtro de "Disponível Agora".
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('');
              setOnlyAvailableNow(false);
            }}
            className="mt-5 px-5 py-2.5 rounded-lg bg-[#071B2F] text-white text-xs font-bold hover:bg-[#003A67] transition shadow-xs"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
};
