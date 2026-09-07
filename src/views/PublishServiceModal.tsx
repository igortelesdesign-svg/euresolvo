import React, { useRef, useState } from 'react';
import { X, Upload, Plus, Calendar, Clock, MapPin, Zap, AlertCircle } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/categories';
import { POPULAR_LOCATIONS } from '../data/locations';

interface PublishServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    categoryId: string;
    categoryName: string;
    city: string;
    state: string;
    neighborhood: string;
    address?: string;
    serviceDate: string;
    dateLabel?: string;
    startTime: string;
    endTime: string;
    timeSlot?: 'agora' | 'manha' | 'tarde' | 'noite' | 'personalizado';
    urgency: 'low' | 'normal' | 'urgent' | 'emergency';
    images?: string[];
  }) => void;
}

export const PublishServiceModal: React.FC<PublishServiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('manutencao');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('Natal');
  const [neighborhood, setNeighborhood] = useState('Ponta Negra');
  const [address, setAddress] = useState('');
  const [serviceDate, setServiceDate] = useState('hoje');
  const [dateLabel, setDateLabel] = useState('Hoje');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('18:00');
  const [timeSlot, setTimeSlot] = useState<'agora' | 'manha' | 'tarde' | 'noite' | 'personalizado'>('tarde');
  const [urgency, setUrgency] = useState<'low' | 'normal' | 'urgent' | 'emergency'>('normal');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []) as File[];
    const remainingSlots = 3 - images.length;

    if (remainingSlots <= 0) {
      alert("Você pode adicionar no máximo 3 fotos.");
      e.target.value = "";
      return;
    }

    files.slice(0, remainingSlots).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`O arquivo ${file.name} não é uma imagem válida.`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`A imagem ${file.name} ultrapassa o limite de 5 MB.`);
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImages((prev) => [...prev, reader.result].slice(0, 3));
        }
      };

      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };


  if (!isOpen) return null;

  const currentCityData = POPULAR_LOCATIONS.find((l) => l.city === city) || POPULAR_LOCATIONS[0];


  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Por favor, preencha o título e a descrição do que precisa resolver.');
      return;
    }

    const selectedCategory = SERVICE_CATEGORIES.find((c) => c.id === categoryId);

    onSubmit({
      title,
      description,
      categoryId,
      categoryName: selectedCategory?.name || 'Manutenção',
      city,
      state: 'RN',
      neighborhood,
      address,
      serviceDate,
      dateLabel,
      startTime,
      endTime,
      timeSlot,
      urgency,
      images,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 my-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#45C900]/15 text-[#2B8A00] text-xs font-bold mb-2">
            <span>Passo a Passo Contratante</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#071B2F] tracking-tight">
            O que você precisa resolver?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publique sua demanda e receba respostas de profissionais qualificados e disponíveis no seu horário.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Categoria & Título */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Categoria Principal *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white text-slate-800 focus:border-[#45C900] focus:ring-1 focus:ring-[#45C900] focus:outline-none"
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Título do Serviço / Demanda *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Troca de disjuntores e reparo na iluminação"
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:ring-1 focus:ring-[#45C900] focus:outline-none"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Descrição Detalhada do Problema *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explique o que está acontecendo, quantidade de itens, marca se souber, e o que precisa ser feito..."
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:ring-1 focus:ring-[#45C900] focus:outline-none"
            />
          </div>

          {/* Localização */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Cidade</label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  const found = POPULAR_LOCATIONS.find((l) => l.city === e.target.value);
                  if (found && found.neighborhoods.length > 0) {
                    setNeighborhood(found.neighborhoods[0]);
                  }
                }}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white text-slate-800 focus:border-[#45C900] focus:outline-none"
              >
                {POPULAR_LOCATIONS.map((loc) => (
                  <option key={loc.city} value={loc.city}>
                    {loc.city} - {loc.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Bairro</label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white text-slate-800 focus:border-[#45C900] focus:outline-none"
              >
                {currentCityData.neighborhoods.map((nb) => (
                  <option key={nb} value={nb}>
                    {nb}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Ponto de Referência / Rua (opcional)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Próximo à praça / Condomínio"
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-[#45C900] focus:outline-none"
              />
            </div>
          </div>

          {/* Quando & Horário */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Quando precisa?
              </label>
              <select
                value={serviceDate}
                onChange={(e) => {
                  setServiceDate(e.target.value);
                  if (e.target.value === 'hoje') setDateLabel('Hoje');
                  else if (e.target.value === 'amanha') setDateLabel('Amanhã');
                  else setDateLabel('Próximos dias');
                }}
                className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white text-slate-800 focus:border-[#45C900] focus:outline-none"
              >
                <option value="hoje">Hoje mesmo</option>
                <option value="amanha">Amanhã</option>
                <option value="nesta_semana">Nesta semana</option>
                <option value="fim_de_semana">Final de semana</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Turno de Preferência
              </label>
              <select
                value={timeSlot}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setTimeSlot(val);
                  if (val === 'manha') {
                    setStartTime('08:00');
                    setEndTime('12:00');
                  } else if (val === 'tarde') {
                    setStartTime('14:00');
                    setEndTime('18:00');
                  } else if (val === 'noite') {
                    setStartTime('18:00');
                    setEndTime('21:00');
                  }
                }}
                className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white text-slate-800 focus:border-[#45C900] focus:outline-none"
              >
                <option value="tarde">Tarde (14h - 18h)</option>
                <option value="manha">Manhã (08h - 12h)</option>
                <option value="noite">Noite (18h - 21h)</option>
                <option value="agora">Imediato (Agora)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Urgência
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white text-slate-800 focus:border-[#45C900] focus:outline-none"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgente</option>
                <option value="emergency">Emergência</option>
              </select>
            </div>
          </div>

          {/* Fotos do Local / Problema */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Fotos do Problema / Equipamento (ajuda muito o profissional)
            </label>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageFiles}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 3}
                className="w-full px-4 py-3 rounded-xl border border-dashed border-slate-300 hover:border-[#45C900] text-xs font-bold text-slate-700 disabled:opacity-50"
              >
                Selecionar foto do dispositivo
              </button>
            </div>

            {images.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={img}
                      alt="Anexo"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 rounded-full text-white hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#071B2F] text-white text-xs font-extrabold hover:bg-[#003A67] transition shadow-md flex items-center justify-center gap-2 border border-[#003A67]"
            >
              <span className="text-[#45C900] font-black text-sm">PUBLICAR NO MURAL</span>
              <span>→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
