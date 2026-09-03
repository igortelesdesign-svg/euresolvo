import React from 'react';
import {
  UserProfile,
  ProfessionalProfile,
  ServiceRequest,
  Review,
} from '../types';
import {
  Users,
  Briefcase,
  CheckCircle,
  Zap,
  Star,
  ShieldCheck,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { StarRating } from '../components/StarRating';

interface AdminViewProps {
  users: UserProfile[];
  professionals: ProfessionalProfile[];
  requests: ServiceRequest[];
  reviews: Review[];
}

export const AdminView: React.FC<AdminViewProps> = ({
  users,
  professionals,
  requests,
  reviews,
}) => {
  const availableNowCount = professionals.filter((p) => p.isAvailableNow).length;
  const resolvedCount = requests.filter((r) => r.status === 'resolved').length;
  const prosWithCnpj = users.filter((u) => u.hasCnpj).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Painel de Moderação & Gestão EURESOLVO</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#071B2F] tracking-tight">
          Métricas e Operação da Plataforma
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Visão geral de prestadores, demandas no RN, índice de resolução e segurança.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total de Usuários</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-2xl font-black text-slate-900">{users.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">
            {professionals.length} profissionais ativos
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Disponíveis Agora</span>
            <Zap className="w-4 h-4 text-[#45C900]" />
          </div>
          <span className="text-2xl font-black text-[#45C900]">{availableNowCount}</span>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">
            Prontos para atendimento hoje
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Demandas Publicadas</span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-2xl font-black text-[#071B2F]">{requests.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">
            {requests.filter((r) => r.status !== 'resolved').length} em andamento
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Serviços RESOLVIDOS ✓</span>
            <CheckCircle className="w-4 h-4 text-[#45C900]" />
          </div>
          <span className="text-2xl font-black text-[#071B2F]">{resolvedCount}</span>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">
            Taxa de sucesso alta
          </p>
        </div>
      </div>

      {/* Professionals List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-black text-[#071B2F] mb-4">
          Profissionais Cadastrados ({professionals.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <th className="pb-3">Profissional</th>
                <th className="pb-3">Categoria</th>
                <th className="pb-3">Cidade / Polo</th>
                <th className="pb-3">Disponível Agora</th>
                <th className="pb-3">Resolvidos</th>
                <th className="pb-3">Avaliação</th>
                <th className="pb-3">CNPJ/MEI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {professionals.map((pro) => {
                const u = users.find((usr) => usr.id === pro.userId);
                return (
                  <tr key={pro.id} className="hover:bg-slate-50/80">
                    <td className="py-3 font-bold text-slate-900">
                      {u?.professionalName || u?.name}
                    </td>
                    <td className="py-3 text-slate-600">{pro.mainCategory}</td>
                    <td className="py-3 text-slate-600">{u?.city} - RN</td>
                    <td className="py-3">
                      {pro.isAvailableNow ? (
                        <span className="inline-flex items-center gap-1 font-bold text-[#2B8A00] bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#45C900]" />
                          SIM (Verde)
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Não</span>
                      )}
                    </td>
                    <td className="py-3 font-bold text-[#071B2F]">
                      {pro.resolvedCount} ✓
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{pro.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      {u?.hasCnpj ? (
                        <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md text-[10px]">
                          Verificado
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Pessoa Física</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
