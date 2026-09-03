import React, { useState } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';
import { StarRating } from './StarRating';
import { ReviewCriteria } from '../types';

interface ReviewModalProps {
  data: {
    requestId: string;
    proId: string;
    proName: string;
    serviceTitle: string;
  };
  onClose: () => void;
  onSubmit: (
    requestId: string,
    targetId: string,
    targetName: string,
    criteria: ReviewCriteria,
    comment: string
  ) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ data, onClose, onSubmit }) => {
  const [criteria, setCriteria] = useState<ReviewCriteria>({
    quality: 5,
    punctuality: 5,
    communication: 5,
    organization: 5,
    professionalism: 5,
  });
  const [comment, setComment] = useState('');

  const overall =
    (criteria.quality +
      criteria.punctuality +
      criteria.communication +
      criteria.organization +
      criteria.professionalism) /
    5;

  const handleCriterionChange = (key: keyof ReviewCriteria, val: number) => {
    setCriteria((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data.requestId, data.proId, data.proName, criteria, comment);
  };

  const criterionItems: { key: keyof ReviewCriteria; label: string; desc: string }[] = [
    {
      key: 'quality',
      label: 'Qualidade da Resolução',
      desc: 'O serviço ficou bem executado, seguro e definitivo?',
    },
    {
      key: 'punctuality',
      label: 'Pontualidade',
      desc: 'Chegou no horário combinado ou avisou com antecedência?',
    },
    {
      key: 'communication',
      label: 'Comunicação & Clareza',
      desc: 'Explicou o que precisava ser feito e tirou dúvidas?',
    },
    {
      key: 'organization',
      label: 'Organização & Limpeza',
      desc: 'Deixou o local limpo e recolheu resíduos?',
    },
    {
      key: 'professionalism',
      label: 'Profissionalismo & Postura',
      desc: 'Educação, respeito e cumprimento do combinado.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#45C900]/20 text-[#2B8A00]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#071B2F]">
              Como esse profissional resolveu?
            </h3>
            <p className="text-xs text-slate-500">
              {data.proName} • {data.serviceTitle}
            </p>
          </div>
        </div>

        {/* Overall Score Box */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Média Calculada</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#071B2F]">
                {overall.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
          </div>
          <StarRating rating={overall} size="md" showNumber={false} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 5 Criteria */}
          <div className="space-y-3 divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
            {criterionItems.map((item) => (
              <div
                key={item.key}
                className="pt-2.5 first:pt-0 flex items-center justify-between gap-2"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.label}</p>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
                <StarRating
                  rating={criteria[item.key]}
                  interactive
                  size="sm"
                  showNumber
                  onChange={(v) => handleCriterionChange(item.key, v)}
                />
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Depoimento / Comentário (opcional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Descreva a experiência para ajudar outras pessoas a contratarem com segurança..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-800 placeholder-slate-400 focus:border-[#45C900] focus:ring-1 focus:ring-[#45C900] focus:outline-none"
            />
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#071B2F] text-white text-xs font-extrabold hover:bg-[#003A67] transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4 text-[#45C900]" />
              <span>Publicar Avaliação</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
