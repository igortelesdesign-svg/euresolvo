import React, { useEffect, useState } from 'react';
import { X, User, Briefcase, Building2, CheckCircle2, Shield } from 'lucide-react';
import { UserProfile, UserRole, ContractorType } from '../types';
import { LogoIcon } from '../components/LogoIcon';
import { SERVICE_CATEGORIES } from '../data/categories';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup' | 'role_select';
  users: UserProfile[];
  currentUserId: string;
  onClose: () => void;
  onSelectUser: (userId: string) => void;
  onCreateUser: (newUser: UserProfile, password: string) => Promise<boolean>;
  onLoginUser: (email: string, password: string) => Promise<boolean>;
  onPasswordReset: (email: string) => Promise<boolean>;
  isPasswordRecovery: boolean;
  onUpdatePassword: (password: string) => Promise<boolean>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  users,
  currentUserId,
  onClose,
  onSelectUser,
  onCreateUser,
  onLoginUser,
  onPasswordReset,
  isPasswordRecovery,
  onUpdatePassword,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('professional');
  const [contractorType, setContractorType] = useState<ContractorType>('individual');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [city, setCity] = useState('Natal');
  const [orgName, setOrgName] = useState('');
  const [professionalCategory, setProfessionalCategory] = useState('');
  const [formError, setFormError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [localMode, setLocalMode] = useState<'login' | 'signup'>(
    mode === 'login' ? 'login' : 'signup'
  );

  useEffect(() => {
    if (isOpen) {
      setLocalMode(mode === 'login' ? 'login' : 'signup');

      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setWhatsappConsent(false);
      setCity('Natal');
      setOrgName('');
      setFormError('');
      setIsCreating(false);
      setSelectedRole('professional');
      setContractorType('individual');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    const logged = await onLoginUser(email, password);

    if (logged) {
      onClose();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Informe seu nome completo.');
      return;
    }

    if (!email.trim()) {
      setFormError('Informe um e-mail válido.');
      return;
    }

    if (password.length < 6) {
      setFormError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    const phoneDigits = phone.split('').filter((char) => char >= '0' && char <= '9').join('');

    if (phone.trim() && (phoneDigits.length < 10 || phoneDigits.length > 11)) {
      setFormError('Informe um WhatsApp válido com DDD.');
      return;
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      email: email.trim(),
      name: name.trim(),
      role: selectedRole,
      professionalCategory: selectedRole === 'professional' ? professionalCategory : undefined,
      phone: phoneDigits || undefined,
      whatsapp: phoneDigits || undefined,
      whatsappNotifications: phone.trim() ? whatsappConsent : false,
      city,
      state: 'RN',
      contractorType: selectedRole === 'contractor' ? contractorType : undefined,
      organizationName: orgName || undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      setIsCreating(true);

      const created = await onCreateUser(newUser, password);

      if (created) {
        onClose();
        return;
      }

      setFormError(
        'Não foi possível criar a conta. Verifique os dados informados ou se este e-mail já possui cadastro.'
      );
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      setFormError('Ocorreu um erro ao criar a conta. Tente novamente.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (newPassword.length < 6) {
      setFormError('A nova senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('As senhas não coincidem.');
      return;
    }

    try {
      setIsCreating(true);
      await onUpdatePassword(newPassword);
    } finally {
      setIsCreating(false);
    }
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

        {/* Or Create Custom Account */}
        <div className="border-t border-slate-100 pt-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => setLocalMode('login')}
              className={`py-2.5 rounded-xl text-xs font-black transition ${
                localMode === 'login'
                  ? 'bg-[#071B2F] text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              ENTRAR
            </button>

            <button
              type="button"
              onClick={() => setLocalMode('signup')}
              className={`py-2.5 rounded-xl text-xs font-black transition ${
                localMode === 'signup'
                  ? 'bg-[#45C900] text-[#071B2F]'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              QUERO ME CADASTRAR
            </button>
          </div>

          {isPasswordRecovery ? (
            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 mb-3">
                <p className="text-sm font-black text-[#071B2F]">
                  Redefinir senha
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Crie uma nova senha para acessar sua conta no EURESOLVO.
                </p>
              </div>

              <input
                type="password"
                required
                minLength={6}
                placeholder="Nova senha"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setFormError('');
                }}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:outline-none"
              />

              <input
                type="password"
                required
                minLength={6}
                placeholder="Confirmar nova senha"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setFormError('');
                }}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:outline-none"
              />

              {formError && (
                <p className="text-xs font-bold text-red-600">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-2.5 rounded-xl bg-[#45C900] hover:bg-[#59E600] disabled:opacity-60 text-[#071B2F] text-xs font-black transition"
              >
                {isCreating ? 'SALVANDO...' : 'SALVAR NOVA SENHA'}
              </button>
            </form>
          ) : localMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-2.5">
              <input
                type="email"
                required
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:outline-none"
              />

              <input
                type="password"
                required
                minLength={6}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:outline-none"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onPasswordReset(email)}
                  className="text-[11px] font-bold text-[#003A67] hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#45C900] hover:bg-[#59E600] text-[#071B2F] text-xs font-black transition"
              >
                ENTRAR NO EURESOLVO
              </button>
            </form>
          ) : (
            <>
              <p className="text-xs font-bold text-slate-800 mb-2">
                Como você deseja usar o EURESOLVO?
              </p>

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
                  <span>Sou Profissional</span>
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
                  <span>Preciso de um serviço</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('contractor');
                    setContractorType('company');
                  }}
                  className={`p-2 rounded-xl text-center border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    selectedRole === 'contractor' && contractorType === 'company'
                      ? 'bg-[#071B2F] text-white border-[#071B2F]'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Empresa / Condomínio</span>
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

                <div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Crie uma senha"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFormError('');
                    }}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:outline-none"
                  />

                  <p
                    className={`mt-1.5 px-1 text-[11px] font-semibold ${
                      password.length >= 6
                        ? 'text-[#2B8A00]'
                        : 'text-slate-500'
                    }`}
                  >
                    {password.length >= 6
                      ? '✓ Senha válida'
                      : 'Use pelo menos 6 caracteres'}
                  </p>
                </div>

                {selectedRole === 'professional' && (
                  <select
                    required
                    value={professionalCategory}
                    onChange={(e) => setProfessionalCategory(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:outline-none bg-white"
                  >
                    <option value="">Selecione sua área de atuação</option>
                    {SERVICE_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}

                <input
                  type="tel"
                  placeholder="WhatsApp (ex: 84 99999-8888)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:outline-none"
                />

                {phone.trim() && (
                  <label className="flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-200 p-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={whatsappConsent}
                      onChange={(e) => setWhatsappConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[#45C900]"
                    />
                    <span className="text-[10px] leading-relaxed text-slate-600">
                      Aceito receber pelo WhatsApp comunicações relacionadas à minha conta, oportunidades e serviços do EURESOLVO.
                    </span>
                  </label>
                )}

                {contractorType !== 'individual' && selectedRole === 'contractor' && (
                  <input
                    type="text"
                    placeholder="Nome da Empresa / Condomínio"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:outline-none"
                  />
                )}

                {formError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[11px] font-semibold text-red-700">
                    {formError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full py-2.5 rounded-xl bg-[#071B2F] hover:bg-[#003A67] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-black transition"
                >
                  {isCreating ? 'CRIANDO CONTA...' : 'CRIAR MINHA CONTA'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
