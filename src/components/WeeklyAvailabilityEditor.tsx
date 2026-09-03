import React, { useState } from 'react';
import { DayAvailability } from '../types';
import { Clock, Plus, Trash2, Check, Zap } from 'lucide-react';

interface WeeklyAvailabilityEditorProps {
  schedule: DayAvailability[];
  isAvailableNow: boolean;
  onToggleAvailableNow: () => void;
  onSaveSchedule: (schedule: DayAvailability[]) => void;
}

export const WeeklyAvailabilityEditor: React.FC<WeeklyAvailabilityEditorProps> = ({
  schedule,
  isAvailableNow,
  onToggleAvailableNow,
  onSaveSchedule,
}) => {
  const [localSchedule, setLocalSchedule] = useState<DayAvailability[]>(schedule);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggleDay = (index: number) => {
    const updated = [...localSchedule];
    updated[index] = {
      ...updated[index],
      enabled: !updated[index].enabled,
      slots:
        !updated[index].enabled && updated[index].slots.length === 0
          ? [{ start: '08:00', end: '18:00' }]
          : updated[index].slots,
    };
    setLocalSchedule(updated);
    setHasChanges(true);
  };

  const handleAddSlot = (dayIndex: number) => {
    const updated = [...localSchedule];
    updated[dayIndex] = {
      ...updated[dayIndex],
      slots: [...updated[dayIndex].slots, { start: '14:00', end: '18:00' }],
    };
    setLocalSchedule(updated);
    setHasChanges(true);
  };

  const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
    const updated = [...localSchedule];
    const newSlots = updated[dayIndex].slots.filter((_, idx) => idx !== slotIndex);
    updated[dayIndex] = {
      ...updated[dayIndex],
      slots: newSlots,
      enabled: newSlots.length > 0,
    };
    setLocalSchedule(updated);
    setHasChanges(true);
  };

  const handleSlotChange = (
    dayIndex: number,
    slotIndex: number,
    field: 'start' | 'end',
    val: string
  ) => {
    const updated = [...localSchedule];
    updated[dayIndex].slots[slotIndex] = {
      ...updated[dayIndex].slots[slotIndex],
      [field]: val,
    };
    setLocalSchedule(updated);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSaveSchedule(localSchedule);
    setHasChanges(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs">
      {/* Top Banner: ESTOU DISPONÍVEL AGORA */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isAvailableNow
            ? 'bg-[#45C900]/10 border-[#45C900]/50'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              isAvailableNow ? 'bg-[#45C900] text-[#071B2F] shadow-md' : 'bg-slate-200 text-slate-500'
            }`}
          >
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-slate-900">
                Status: {isAvailableNow ? 'DISPONÍVEL AGORA' : 'Indisponível no Momento'}
              </h4>
              {isAvailableNow && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#45C900] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#45C900]" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {isAvailableNow
                ? 'Você ganha destaque prioritário no topo da busca para clientes com urgência hoje.'
                : 'Ative quando estiver livre e pronto para atender chamados imediatos.'}
            </p>
          </div>
        </div>

        <button
          id="btn-toggle-available-now"
          onClick={onToggleAvailableNow}
          className={`shrink-0 w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-xs ${
            isAvailableNow
              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
              : 'bg-[#071B2F] hover:bg-[#003A67] text-white border border-[#003A67]'
          }`}
        >
          {isAvailableNow ? 'Desativar Disponibilidade Agora' : 'Ativar "DISPONÍVEL AGORA"'}
        </button>
      </div>

      {/* Weekly Grid */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900">Grade Semanal Recorrente</h3>
          <p className="text-xs text-slate-500">
            Defina seus dias e blocos de horário para os contratantes agendarem
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#45C900] text-[#071B2F] font-bold text-xs shadow-sm hover:bg-[#59E600] transition"
          >
            <Check className="w-4 h-4" />
            Salvar Alterações
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {localSchedule.map((day, dayIndex) => (
          <div
            key={day.dayOfWeek}
            className={`py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
              day.enabled ? 'opacity-100' : 'opacity-60'
            }`}
          >
            {/* Day Toggle */}
            <div className="flex items-center gap-3 w-40 shrink-0">
              <input
                type="checkbox"
                id={`day-toggle-${day.dayOfWeek}`}
                checked={day.enabled}
                onChange={() => handleToggleDay(dayIndex)}
                className="w-4 h-4 text-[#45C900] rounded focus:ring-[#45C900] border-slate-300 cursor-pointer"
              />
              <label
                htmlFor={`day-toggle-${day.dayOfWeek}`}
                className="text-sm font-semibold text-slate-800 cursor-pointer select-none"
              >
                {day.dayLabel}
              </label>
            </div>

            {/* Slots */}
            <div className="flex-1 flex flex-wrap items-center gap-2">
              {day.enabled && day.slots.length > 0 ? (
                day.slots.map((slot, slotIndex) => (
                  <div
                    key={slotIndex}
                    className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl text-xs"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="time"
                      value={slot.start}
                      onChange={(e) =>
                        handleSlotChange(dayIndex, slotIndex, 'start', e.target.value)
                      }
                      className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
                    />
                    <span className="text-slate-400">às</span>
                    <input
                      type="time"
                      value={slot.end}
                      onChange={(e) =>
                        handleSlotChange(dayIndex, slotIndex, 'end', e.target.value)
                      }
                      className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(dayIndex, slotIndex)}
                      className="text-slate-400 hover:text-rose-600 p-0.5"
                      title="Remover horário"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">
                  {day.enabled ? 'Sem blocos definidos' : 'Dia indisponível / folga'}
                </span>
              )}

              {day.enabled && (
                <button
                  type="button"
                  onClick={() => handleAddSlot(dayIndex)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#003A67] hover:text-[#071B2F] px-2 py-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>Adicionar Turno</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasChanges && (
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#071B2F] text-white font-bold text-xs shadow-sm hover:bg-[#003A67] transition"
          >
            <Check className="w-4 h-4 text-[#45C900]" />
            Salvar Grade de Horários
          </button>
        </div>
      )}
    </div>
  );
};
