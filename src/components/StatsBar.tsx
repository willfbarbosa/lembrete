"use client";

import React from "react";
import { Lembrete } from "@/types/lembrete";
import { CheckCircle2, Clock, AlertTriangle, StickyNote, Flame } from "lucide-react";

interface StatsBarProps {
  lembretes: Lembrete[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ lembretes }) => {
  const total = lembretes.length;
  const concluidos = lembretes.filter((l) => l.concluido).length;
  const pendentes = total - concluidos;

  const now = new Date();
  const atrasados = lembretes.filter((l) => {
    if (l.concluido || !l.data_limite) return false;
    const dueDate = new Date(l.data_limite);
    return !isNaN(dueDate.getTime()) && dueDate.getTime() < now.getTime();
  }).length;

  const altaPrioridade = lembretes.filter((l) => !l.concluido && l.prioridade === "alta").length;
  const mediaPrioridade = lembretes.filter((l) => !l.concluido && l.prioridade === "media").length;
  const baixaPrioridade = lembretes.filter((l) => !l.concluido && l.prioridade === "baixa").length;

  const percentConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-amber-900/10 mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Total Post-its */}
        <div className="flex items-center gap-3 p-3 bg-amber-50/80 rounded-xl border border-amber-200/60">
          <div className="p-2.5 bg-amber-500 text-white rounded-lg shadow-xs">
            <StickyNote className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900/70">Total Lembretes</p>
            <p className="text-xl font-extrabold text-amber-950">{total}</p>
          </div>
        </div>

        {/* Pendentes */}
        <div className="flex items-center gap-3 p-3 bg-blue-50/80 rounded-xl border border-blue-200/60">
          <div className="p-2.5 bg-blue-500 text-white rounded-lg shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-900/70">Pendentes</p>
            <p className="text-xl font-extrabold text-blue-950">{pendentes}</p>
          </div>
        </div>

        {/* Concluídos */}
        <div className="flex items-center gap-3 p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/60">
          <div className="p-2.5 bg-emerald-500 text-white rounded-lg shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-900/70">Concluídos</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-extrabold text-emerald-950">{concluidos}</p>
              <span className="text-xs font-semibold text-emerald-700">({percentConcluido}%)</span>
            </div>
          </div>
        </div>

        {/* Atrasados */}
        <div className="flex items-center gap-3 p-3 bg-rose-50/80 rounded-xl border border-rose-200/60">
          <div className="p-2.5 bg-rose-500 text-white rounded-lg shadow-xs animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-900/70">Atrasados</p>
            <p className="text-xl font-extrabold text-rose-950">{atrasados}</p>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex flex-col justify-center p-3 bg-gray-50/90 rounded-xl border border-gray-200">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Pendentes por Prioridade
          </p>
          <div className="flex items-center justify-between text-xs font-medium pt-1">
            <span className="text-rose-700 font-bold">🔴 Alta: {altaPrioridade}</span>
            <span className="text-amber-700 font-bold">🟠 Média: {mediaPrioridade}</span>
            <span className="text-emerald-700 font-bold">🟢 Baixa: {baixaPrioridade}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
