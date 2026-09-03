import React from 'react';
import {
  Building2,
  ShieldCheck,
  FileCheck,
  Clock,
  CheckCircle2,
  PhoneCall,
  Zap,
  Award,
  Users,
} from 'lucide-react';

interface ForCompaniesViewProps {
  onOpenPublish: () => void;
}

export const ForCompaniesView: React.FC<ForCompaniesViewProps> = ({
  onOpenPublish,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Section */}
      <div className="bg-[#071B2F] text-white rounded-2xl p-8 sm:p-12 border border-[#003A67] shadow-md relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wide text-white/90 rounded-full">
            <Building2 className="w-3.5 h-3.5 text-[#59E600]" />
            <span>Condomínios, Síndicos, Administradoras & Empresas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
            Gestão de Manutenção Predial e Chamados de Emergência
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
            Elimine a dor de cabeça de procurar profissionais avulsos sem referência. No EURESOLVO, condomínios residenciais, comerciais e empresas encontram eletricistas prediais, técnicos de refrigeração e segurança eletrônica com documentação em dia e emissão de Nota Fiscal.
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <button
              onClick={onOpenPublish}
              className="px-6 py-3.5 rounded-xl bg-[#45C900] hover:bg-[#59E600] text-[#071B2F] font-extrabold text-xs transition shadow-sm"
            >
              Publicar Demanda Condominial / Corporativa →
            </button>
            <a
              href="https://wa.me/5584994223180?text=Olá!%20Sou%20síndico/gestor%20e%20gostaria%20de%20atendimento%20para%20condomínio"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 flex items-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#59E600]" />
              <span>Falar com Consultor Corporativo</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4 Pillars for Condos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            icon: <FileCheck className="w-5 h-5 text-[#003A67]" />,
            title: 'Emissão de Nota Fiscal',
            desc: 'Profissionais cadastrados como MEI ou ME com emissão regular de NF-e para prestação de contas no balancete.',
          },
          {
            icon: <ShieldCheck className="w-5 h-5 text-[#45C900]" />,
            title: 'Segurança & Compliance',
            desc: 'Checagem de antecedentes, conformidade com NR-10 (elétrica) e NR-35 (trabalho em altura).',
          },
          {
            icon: <Clock className="w-5 h-5 text-[#003A67]" />,
            title: 'Pontualidade Garantida',
            desc: 'Profissionais com métrica pública de pontualidade e agendamento prévio com a portaria.',
          },
          {
            icon: <Zap className="w-5 h-5 text-[#45C900]" />,
            title: 'Atendimento Rápido RN',
            desc: 'Rede ativa em Natal, Parnamirim e polo metropolitano para emergências em bombas d’água, portões e quadros.',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white border border-[#DDE3E8] space-y-3 shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F5F7F9] flex items-center justify-center border border-[#DDE3E8]">
              {item.icon}
            </div>
            <h3 className="font-bold text-base text-[#071B2F] tracking-tight">{item.title}</h3>
            <p className="text-xs text-[#66727D] leading-relaxed font-normal">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Frequent corporate needs */}
      <div className="bg-white rounded-2xl p-8 border border-[#DDE3E8] shadow-xs">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#45C900] block mb-1">
          Especialidades mais solicitadas
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-[#071B2F] tracking-[-0.025em] mb-6">
          Demandas Mais Atendidas em Condomínios e Empresas no RN
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-[#071B2F]">
          {[
            'Manutenção de Bombas e Pressurizadores',
            'Quadros Elétricos e Troca de Barramentos',
            'Contratos de Manutenção de Ar-Condicionado (PMOC)',
            'CFTV, Câmeras IP e Motores de Portão Automático',
            'Pintura de Fachada e Revitalização de Áreas Comuns',
            'Impermeabilização de Lajes e Caixas d’Água',
            'Controle de Acesso Biométrico e Fechaduras Eletrônicas',
            'Limpeza Pós-Obra e Mutirões Periódicos',
            'Laudos Técnicos e Adequação às Normas',
          ].map((service, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#F5F7F9] border border-[#DDE3E8] flex items-center gap-2.5 font-medium"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#45C900] shrink-0" />
              <span>{service}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
