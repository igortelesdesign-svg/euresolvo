import React, { useState, useMemo } from 'react';
import {
  UserProfile,
  ServiceRequest,
  ServiceApplication,
} from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { SERVICE_CATEGORIES } from '../data/categories';
import { POPULAR_LOCATIONS } from '../data/locations';
import { Plus, Search, Filter, Zap, Briefcase } from 'lucide-react';

interface OpportunitiesWallViewProps {
  requests: ServiceRequest[];
  applications: ServiceApplication[];
  currentUser: UserProfile;
  onApply: (requestId: string) => void;
  onSelectRequest: (requestId: string) => void;
  onOpenPublish: () => void;
}

export const OpportunitiesWallView: React.FC<OpportunitiesWallViewProps> = ({
  requests,
  applications,
  currentUser,
  onApply,
  onSelectRequest,
  onOpenPublish,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchDesc = r.description.toLowerCase().includes(q);
        const matchNeigh = r.neighborhood.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchNeigh) return false;
      }

      if (selectedCategory && r.categoryName !== selectedCategory) {
        return false;
      }

      if (selectedCity && r.city !== selectedCity) {
        return false;
      }

      if (selectedUrgency && r.urgency !== selectedUrgency) {
        return false;
      }

      return true;
    });
  }, [requests, searchQuery, selectedCategory, selectedCity, selectedUrgency]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#DDE3E8] pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-[#45C900] block mb-1">
            Demandas de Clientes & Condomínios
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071B2F] tracking-[-0.03em] leading-[1.05]">
            Mural de Oportunidades ("EU RESOLVO")
          </h1>
          <p className="text-xs sm:text-sm text-[#66727D] mt-1 font-normal leading-relaxed">
            Mostre sua prontidão para resolver demandas reais na sua região no RN.
          </p>
        </div>

        <button
          onClick={onOpenPublish}
          className="px-5 py-2.5 rounded-lg bg-[#071B2F] text-white font-bold text-xs hover:bg-[#003A67] transition flex items-center gap-2 border border-[#071B2F] shadow-xs"
        >
          <Plus className="w-4 h-4 text-[#59E600]" />
          <span>Publicar Demanda</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-5 border border-[#DDE3E8] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-[#071B2F] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar nas oportunidades..."
              className="w-full text-xs rounded-lg border border-[#DDE3E8] bg-[#F5F7F9] pl-10 pr-3 py-2.5 text-[#071B2F] focus:border-[#45C900] focus:ring-1 focus:ring-[#45C900] focus:outline-none transition font-medium placeholder-[#66727D]"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs rounded-lg border border-[#DDE3E8] bg-[#F5F7F9] p-2.5 text-[#071B2F] focus:border-[#45C900] focus:ring-1 focus:ring-[#45C900] focus:outline-none transition font-medium cursor-pointer"
            >
              <option value="">Todas as Especialidades</option>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full text-xs rounded-lg border border-[#DDE3E8] bg-[#F5F7F9] p-2.5 text-[#071B2F] focus:border-[#45C900] focus:ring-1 focus:ring-[#45C900] focus:outline-none transition font-medium cursor-pointer"
            >
              <option value="">Todas as Urgências</option>
              <option value="emergency">Emergência</option>
              <option value="urgent">Urgente</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>
      </div>

      {/* List count */}
      <div className="text-xs text-[#66727D] px-1 font-medium">
        Mostrando <strong className="text-[#071B2F] font-bold">{filteredRequests.length}</strong> oportunidades abertas
      </div>

      {/* Grid */}
      {filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => {
            const hasApplied = applications.some(
              (a) => a.requestId === req.id && a.professionalId === currentUser.id
            );
            return (
              <OpportunityCard
                key={req.id}
                request={req}
                hasApplied={hasApplied}
                onApply={onApply}
                onViewDetails={onSelectRequest}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-[#DDE3E8] p-8 shadow-xs">
          <p className="text-base font-bold text-[#071B2F] tracking-tight">
            Nenhuma demanda encontrada com estes filtros.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
              setSelectedUrgency('');
            }}
            className="mt-4 px-5 py-2.5 rounded-lg bg-[#071B2F] text-white text-xs font-bold hover:bg-[#003A67] transition shadow-xs"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
};
