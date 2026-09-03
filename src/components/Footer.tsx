import React from 'react';
import { Logo } from './Logo';
import { MapPin, ShieldCheck, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { ActiveView } from '../hooks/useAppState';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTerms }) => {
  return (
    <footer className="bg-[#071B2F] text-white pt-14 pb-24 lg:pb-14 border-t border-[#003A67]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1 & 2: Brand and Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="white" showSubtitle={true} className="py-1" />
            <p className="text-xs sm:text-sm text-white/70 max-w-sm leading-relaxed">
              A plataforma inteligente que conecta quem precisa resolver manutenções, reparos e serviços a profissionais capacitados e disponíveis no horário que você precisa.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/70 font-medium">
              <span className="flex h-2 w-2 rounded-full bg-[#45C900]" />
              <span>Domínio oficial: <strong className="text-white">euresolvoagora.com.br</strong></span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-[11px] text-white/80 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-[#59E600]" />
                <span>LGPD & Contatos Protegidos</span>
              </div>
            </div>
          </div>

          {/* Col 3: Categorias */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-[#45C900] mb-4">
              Serviços Populares
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <button
                  onClick={() => onNavigate('find_professionals')}
                  className="hover:text-white transition"
                >
                  Eletricista Predial & Residencial
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find_professionals')}
                  className="hover:text-white transition"
                >
                  Ar-condicionado & Refrigeração
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find_professionals')}
                  className="hover:text-white transition"
                >
                  Câmeras CFTV & Fechaduras Digitais
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find_professionals')}
                  className="hover:text-white transition"
                >
                  Encanador & Desentupimento
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find_professionals')}
                  className="hover:text-white transition"
                >
                  Pintura & Pequenas Reformas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find_professionals')}
                  className="hover:text-white transition"
                >
                  Diarista & Limpeza Pós-obra
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Empresas e Profissionais */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-[#45C900] mb-4">
              Soluções
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <button
                  onClick={() => onNavigate('for_companies')}
                  className="hover:text-white transition"
                >
                  Para Condomínios & Síndicos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('for_companies')}
                  className="hover:text-white transition"
                >
                  Para Clínicas, Hotéis e Lojas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('opportunities_wall')}
                  className="hover:text-white transition"
                >
                  Mural de Demandas (Profissionais)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('schedule')}
                  className="hover:text-white transition"
                >
                  Gestão de Disponibilidade
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-white transition"
                >
                  Painel de Moderação
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Regiões & Contato */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-[#45C900] mb-4">
              Polo Rio Grande do Norte
            </h4>
            <div className="space-y-1.5 text-xs text-white/70 mb-4">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#59E600]" />
                <span className="text-white font-medium">Natal & Grande Natal</span>
              </div>
              <p className="text-[11px] text-white/50 pl-5">
                Parnamirim • São Gonçalo • Macaíba • Mossoró
              </p>
            </div>
            <div className="space-y-2 text-xs text-white/70">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#59E600]" />
                <span>contato@euresolvoagora.com.br</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#59E600]" />
                <span>WhatsApp: (84) 99422-3180</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© {new Date().getFullYear()} EURESOLVO. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenTerms} className="hover:text-white transition">
              Termos de Uso
            </button>
            <span>•</span>
            <button onClick={onOpenTerms} className="hover:text-white transition">
              Privacidade & LGPD
            </button>
            <span>•</span>
            <span className="text-[#45C900] font-bold">RESOLVIDO ✓</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
