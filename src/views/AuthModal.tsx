import React, { useState } from 'react';
import { X, User, Briefcase, Building2, CheckCircle2, Shield } from 'lucide-react';
import { UserProfile, UserRole, ContractorType } from '../types';
import { LogoIcon } from '../components/LogoIcon';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup' | 'role_select';
  users: UserProfile[];
  currentUserId: string;
  onClose: () => void;
  onSelectUser: (userId: string) => void;
  onCreateUser: (newUser: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  users,
  currentUserId,
  onClose,
  onSelectUser,
  onCreateUser,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('professional');
  const [contractorType, setContractorType] = useState<ContractorType>('individual');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Natal');
  const [orgName, setOrgName] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      email,
      name,
      role: selectedRole,
      phone: phone || '(84) 99999-8888',
      whatsapp: phone || '(84) 99999-8888',
      whatsappNotifications: true,
      city,
      state: 'RN',
      contractorType: selectedRole === 'contractor' ? contractorType : undefined,
      organizationName: orgName || undefined,
      createdAt: new Date().toISOString(),
    };

    onCreateUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 my-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <LogoIcon size={36} className="h-9 w-9" />
          <div>
            <h3 className="text-lg font-black text-[#071B2F]">Acesso à Plataforma</h3>
            <p className="text-xs text-slate-500">Escolha o seu perfil no EURESOLVO</p>
          </div>
        </div>

        {/* Existing Quick Switch Profiles */}
        <div className="mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Entrar com Perfil Demo Existente:
          </p>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {users.map((u) => {
              const isSelected = u.id === currentUserId;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u.id);
                    onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition border ${
                    isSelected
                      ? 'bg-white border-[#45C900] shadow-xs'
                      : 'bg-white/60 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                        u.role === 'professional'
                          ? 'bg-[#45C900]/20 text-[#2B8A00]'
                          : u.role === 'admin'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{u.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {u.organizationName ||
                          (u.role === 'professional' ? 'Profissional' : 'Contratante')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {u.role === 'professional' ? 'Prestador' : u.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Or Create Custom Account */}
        <div className="border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold text-slate-800 mb-2">
            Ou crie um novo cadastro rápido:
          </h4>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              type="button"
              onClick={() => setSelectedRole('professional')}
              className={`p-2 rounded-xl text-center border text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'professional'
                  ? 'bg-[#071B2F] text-white border-[#071B2F]'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Prestador</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('contractor');
                setContractorType('individual');
              }}
              className={`p-2 rounded-xl text-center border text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'contractor' && contractorType === 'individual'
                  ? 'bg-[#071B2F] text-white border-[#071B2F]'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Pessoa Física</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('contractor');
                setContractorType('condominium');
              }}
              className={`p-2 rounded-xl text-center border text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'contractor' && contractorType !== 'individual'
                  ? 'bg-[#071B2F] text-white border-[#071B2F]'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Empresa</span>
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-2.5">
            <input
              type="text"
              required
              placeholder="Seu Nome Completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:outline-none"
            />
            <input
              type="email"
              required
              placeholder="Seu E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:outline-none"
            />
            <input
              type="tel"
              placeholder="WhatsApp (ex: 84 99999-8888)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:outline-none"
            />

            {contractorType !== 'individual' && selectedRole === 'contractor' && (
              <input
                type="text"
                placeholder="Nome da Empresa / Condomínio"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:outline-none"
              />
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#071B2F] hover:bg-[#003A67] text-white text-xs font-black transition shadow-xs"
            >
              Concluir & Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
