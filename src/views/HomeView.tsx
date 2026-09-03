import React, { useState } from 'react';
import {
  UserProfile,
  ProfessionalProfile,
  ServiceRequest,
  ServiceApplication,
} from '../types';
import { ActiveView, SearchFilters } from '../hooks/useAppState';
import { SERVICE_CATEGORIES } from '../data/categories';
import { POPULAR_LOCATIONS } from '../data/locations';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { OpportunityCard } from '../components/OpportunityCard';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Star,
  Sparkles,
  Award,
  Users,
} from 'lucide-react';

interface HomeViewProps {
  currentUser: UserProfile;
  professionals: ProfessionalProfile[];
  users: UserProfile[];
  requests: ServiceRequest[];
  applications: ServiceApplication[];
  favorites: string[];
  filters: SearchFilters;
  onUpdateFilters: (filters: SearchFilters) => void;
  onNavigate: (view: ActiveView) => void;
  onSelectPro: (proId: string) => void;
  onSelectRequest: (requestId: string) => void;
  onApplyToRequest: (requestId: string) => void;
  onToggleFavorite: (proId: string) => void;
  onOpenPublish: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser,
  professionals,
  users,
  requests,
  applications,
  favorites,
  filters,
  onUpdateFilters,
  onNavigate,
  onSelectPro,
  onSelectRequest,
  onApplyToRequest,
  onToggleFavorite,
  onOpenPublish,
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.query);
  const [selectedCity, setSelectedCity] = useState(filters.city || 'Natal');
  const [selectedWhen, setSelectedWhen] = useState(filters.when || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(filters.timeSlot || 'todos');
  const [onlyAvailableNow, setOnlyAvailableNow] = useState(filters.onlyAvailableNow);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFilters({
      ...filters,
      query: searchQuery,
      city: selectedCity,
      when: selectedWhen,
      timeSlot: selectedTimeSlot,
      onlyAvailableNow,
    });
    onNavigate('find_professionals');
  };

  const handleCategoryClick = (categoryName: string) => {
    onUpdateFilters({
      ...filters,
      category: categoryName,
      query: '',
    });
    onNavigate('find_professionals');
  };

  // Available Now Pros
  const availableNowPros = professionals.filter((p) => p.isAvailableNow).slice(0, 3);

  // Recent open opportunities
  const openRequests = requests.filter((r) => r.status !== 'resolved').slice(0, 3);

  return (
    <div className="space-y-14 sm:space-y-20 pb-16">
      {/* HERO SECTION - Modern Brand SaaS & Marketplace Interface */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#F5F7F9] border-b border-[#DDE3E8] pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          
          {/* Marketplace Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDE3E8] text-xs font-semibold text-[#071B2F] mb-5 shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-[#45C900] animate-pulse" />
            <span>Profissionais disponíveis • Rio Grande do Norte</span>
          </div>

          {/* Main Hero Headline: Plus Jakarta Sans, 800, -0.03em, 1.05, institutional green highlight on resolver? */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] text-[#071B2F] mb-6 text-balance">
            O que você precisa <span className="text-[#45C900]">resolver?</span>
          </h1>

          <p className="text-sm sm:text-base text-[#66727D] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Encontre profissionais disponíveis perto de você e no horário que você precisa.
          </p>

          {/* HERO SEARCH ENGINE */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#DDE3E8] text-left max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Query: O que precisa */}
              <div className="p-3 rounded-xl bg-[#F5F7F9] border border-[#DDE3E8] focus-within:border-[#45C900] focus-within:ring-1 focus-within:ring-[#45C900] transition">
                <label className="block text-[11px] font-semibold text-[#66727D] uppercase tracking-wide mb-1">
                  O que precisa?
                </label>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#071B2F] shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Eletricista, ar-condicionado..."
                    className="w-full text-xs font-medium text-[#071B2F] bg-transparent focus:outline-none placeholder-[#66727D]"
                  />
                </div>
              </div>

              {/* Onde: Cidade */}
              <div className="p-3 rounded-xl bg-[#F5F7F9] border border-[#DDE3E8] focus-within:border-[#45C900] focus-within:ring-1 focus-within:ring-[#45C900] transition">
                <label className="block text-[11px] font-semibold text-[#66727D] uppercase tracking-wide mb-1">
                  Onde? (Local)
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#071B2F] shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-xs font-medium text-[#071B2F] bg-transparent focus:outline-none cursor-pointer"
                  >
                    {POPULAR_LOCATIONS.map((loc) => (
                      <option key={loc.city} value={loc.city}>
                        {loc.city} - {loc.state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quando */}
              <div className="p-3 rounded-xl bg-[#F5F7F9] border border-[#DDE3E8] focus-within:border-[#45C900] focus-within:ring-1 focus-within:ring-[#45C900] transition">
                <label className="block text-[11px] font-semibold text-[#66727D] uppercase tracking-wide mb-1">
                  Quando?
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#071B2F] shrink-0" />
                  <select
                    value={selectedWhen}
                    onChange={(e) => setSelectedWhen(e.target.value)}
                    className="w-full text-xs font-medium text-[#071B2F] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="">Qualquer dia</option>
                    <option value="hoje">Hoje</option>
                    <option value="amanha">Amanhã</option>
                    <option value="esta_semana">Esta semana</option>
                  </select>
                </div>
              </div>

              {/* Horário / Turno */}
              <div className="p-3 rounded-xl bg-[#F5F7F9] border border-[#DDE3E8] focus-within:border-[#45C900] focus-within:ring-1 focus-within:ring-[#45C900] transition">
                <label className="block text-[11px] font-semibold text-[#66727D] uppercase tracking-wide mb-1">
                  Horário / Turno
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#071B2F] shrink-0" />
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full text-xs font-medium text-[#071B2F] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="todos">Todos os turnos</option>
                    <option value="agora">Disponível Agora</option>
                    <option value="manha">Manhã (08h - 12h)</option>
                    <option value="tarde">Tarde (14h - 18h)</option>
                    <option value="noite">Noite (18h - 21h)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom row: Availability toggle & Actions */}
            <div className="mt-4 pt-4 border-t border-[#DDE3E8] flex flex-col sm:flex-row items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#071B2F]">
                <input
                  type="checkbox"
                  checked={onlyAvailableNow}
                  onChange={(e) => setOnlyAvailableNow(e.target.checked)}
                  className="w-4 h-4 rounded text-[#45C900] focus:ring-[#45C900] border-[#DDE3E8] cursor-pointer accent-[#45C900]"
                />
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="flex h-2 w-2 rounded-full bg-[#45C900]" />
                  Apenas profissionais com <strong className="text-[#071B2F] font-semibold">DISPONÍVEL AGORA</strong>
                </span>
              </label>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onOpenPublish}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl font-bold text-xs text-[#071B2F] bg-white hover:bg-[#F5F7F9] border border-[#DDE3E8] transition shadow-2xs"
                >
                  Publicar Demanda
                </button>

                <button
                  type="submit"
                  id="btn-hero-search-submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#45C900] hover:bg-[#59E600] active:scale-[0.99] text-[#071B2F] font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 border border-[#45C900] transition"
                >
                  <span>ENCONTRAR QUEM RESOLVE</span>
                  <ArrowRight className="w-4 h-4 text-[#071B2F]" />
                </button>
              </div>
            </div>
          </form>

          {/* Quick Category Chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-[#66727D] mr-1">
              Mais buscados:
            </span>
            {['Eletricista', 'Ar-condicionado', 'CFTV & Câmeras', 'Encanador', 'Pintor', 'Diarista'].map(
              (term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    onUpdateFilters({ ...filters, query: term, city: selectedCity });
                    onNavigate('find_professionals');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F5F7F9] text-[#071B2F] text-xs font-semibold transition border border-[#DDE3E8] shadow-2xs"
                >
                  {term}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#DDE3E8]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-[#45C900]">
              Catálogo & Especialidades
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#071B2F] mt-1">
              Navegue por Categorias
            </h2>
          </div>
          <button
            onClick={() => onNavigate('find_professionals')}
            className="text-xs font-semibold text-[#071B2F] hover:text-[#003A67] flex items-center gap-1.5 transition"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#003A67]" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {SERVICE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group cursor-pointer p-5 rounded-xl bg-white border border-[#DDE3E8] hover:border-[#003A67] hover:shadow-md transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#F5F7F9] border border-[#DDE3E8] group-hover:bg-[#071B2F] group-hover:text-white flex items-center justify-center text-[#071B2F] transition mb-4">
                  <Sparkles className="w-5 h-5 text-[#003A67] group-hover:text-[#59E600]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#071B2F] tracking-tight">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#66727D] mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-[#DDE3E8] flex items-center justify-between text-xs font-semibold text-[#66727D] group-hover:text-[#071B2F]">
                <span>{cat.popularServices.length} serviços</span>
                <span className="group-hover:translate-x-1 transition-transform text-[#003A67]">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: PROFISSIONAIS DISPONÍVEIS AGORA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5F7F9] rounded-2xl p-6 sm:p-10 border border-[#DDE3E8] shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#DDE3E8]">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#071B2F] text-white">
                <Zap className="w-5 h-5 text-[#59E600] fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#071B2F]">
                    Disponíveis Agora no Polo RN
                  </h2>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#45C900] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#45C900]" />
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#66727D] mt-1 font-medium">
                  Profissionais ativos prontos para atendimento imediato e sem espera.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onUpdateFilters({ ...filters, onlyAvailableNow: true });
                onNavigate('find_professionals');
              }}
              className="px-4 py-2.5 rounded-lg bg-[#071B2F] text-white hover:bg-[#003A67] text-xs font-bold transition shadow-xs"
            >
              Ver todos com status verde →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {availableNowPros.map((pro) => {
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
        </div>
      </section>

      {/* SECTION: MURAL DE OPORTUNIDADES ("EU RESOLVO") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-[#DDE3E8]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-[#45C900]">
              Mural Aberto
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#071B2F] mt-1">
              Demandas Recentes Aguardando Profissionais
            </h2>
            <p className="text-xs sm:text-sm text-[#66727D] mt-1 font-medium">
              Você é prestador? Clique em <strong className="text-[#071B2F] font-semibold">EU RESOLVO</strong> para demonstrar prontidão imediata.
            </p>
          </div>

          <button
            onClick={() => onNavigate('opportunities_wall')}
            className="text-xs font-semibold text-[#071B2F] hover:text-[#003A67] flex items-center gap-1.5 transition"
          >
            <span>Ver mural completo ({requests.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#003A67]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {openRequests.map((req) => {
            const hasApplied = applications.some(
              (a) => a.requestId === req.id && a.professionalId === currentUser.id
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
      </section>

      {/* SECTION: COMO FUNCIONA O EURESOLVO */}
      <section className="bg-[#F5F7F9] border-y border-[#DDE3E8] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#45C900]">
              Fluxo Simples & Eficiente
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.1] text-[#071B2F] mt-1">
              Como Funciona o EURESOLVO
            </h2>
            <p className="text-xs sm:text-sm text-[#66727D] mt-2 font-medium">
              Conexão ágil e transparente do primeiro contato até a resolução completa
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                title: 'Descreva o que precisa',
                desc: 'Informe o problema, local no RN, urgência e o horário que você pode receber o profissional.',
              },
              {
                step: '02',
                title: 'Consulte a disponibilidade',
                desc: 'Veja quem está livre agora ou com agenda aberta no turno que você precisa.',
              },
              {
                step: '03',
                title: 'Profissionais dizem "EU RESOLVO"',
                desc: 'Prestadores qualificados com ferramentas completas confirmam prontidão para atender.',
              },
              {
                step: '04',
                title: 'Contato seguro liberado',
                desc: 'Após a seleção mútua, telefone e WhatsApp são desbloqueados em conformidade com a LGPD.',
              },
              {
                step: '05',
                title: 'Serviço executado com excelência',
                desc: 'O profissional comparece pontualmente, resolve o chamado e emite seu parecer.',
              },
              {
                step: '06',
                title: 'RESOLVIDO ✓ e Avaliação Dupla',
                desc: 'Avaliação criteriosa em 5 pontos: qualidade, pontualidade, comunicação, organização e postura.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white p-6 rounded-xl border border-[#DDE3E8] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-[#45C900] uppercase tracking-wide">
                    PASSO {item.step}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#071B2F] tracking-tight mt-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#66727D] leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: PARA SÍNDICOS, CONDOMÍNIOS E EMPRESAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#071B2F] text-white rounded-2xl p-8 sm:p-12 border border-[#003A67] shadow-md relative overflow-hidden">
          <div className="max-w-3xl relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#59E600]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
                Solução Corporativa & Condominial
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] leading-[1.1] text-white">
              Para Condomínios, Síndicos, Administradoras e Empresas
            </h2>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-2xl font-normal">
              Mantenha seu prédio e empresa funcionando sem dor de cabeça. Eletricistas prediais, técnicos de ar-condicionado, segurança CFTV, laudos PMOC e reparos de emergência com profissionais que emitem nota fiscal e possuem antecedentes checados.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-white/90 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#45C900] shrink-0" />
                <span>Profissionais com CNPJ/MEI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#45C900] shrink-0" />
                <span>Emissão de Nota Fiscal</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#45C900] shrink-0" />
                <span>Atendimento Prioritário</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('for_companies')}
                className="px-6 py-3.5 rounded-lg bg-white text-[#071B2F] font-bold text-xs hover:bg-[#F5F7F9] transition shadow-xs"
              >
                Conhecer Soluções para Empresas →
              </button>
              <button
                onClick={onOpenPublish}
                className="px-5 py-3.5 rounded-lg bg-transparent hover:bg-white/10 text-white font-bold text-xs transition border border-white/20"
              >
                Publicar Demanda de Condomínio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: CTA PARA PROFISSIONAIS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-white to-[#F5F7F9] text-[#071B2F] border border-[#DDE3E8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#45C900]">
              Junte-se à Rede
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#071B2F]">
              Você resolve? Venha fazer parte do EURESOLVO
            </h3>
            <p className="text-xs sm:text-sm text-[#66727D] max-w-xl leading-relaxed font-normal">
              Receba oportunidades diretamente no seu WhatsApp, defina seus dias livres e fature atendendo quem precisa na sua região.
            </p>
          </div>

          <button
            onClick={() => onNavigate('schedule')}
            className="shrink-0 px-6 py-3.5 rounded-lg bg-[#45C900] hover:bg-[#59E600] text-[#071B2F] text-xs font-bold transition border border-[#45C900] shadow-xs"
          >
            Cadastrar Disponibilidade Grátis
          </button>
        </div>
      </section>
    </div>
  );
};
