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
    <div className="w-full bg-[#121215]/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-red-950/30 mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Total Post-its */}
        <div className="flex items-center gap-3 p-3 bg-zinc-900/90 rounded-xl border border-zinc-800">
          <div className="p-2.5 bg-red-600/90 text-white rounded-lg shadow-xs">
            <StickyNote className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Lembretes</p>
            <p className="text-xl font-extrabold text-white">{total}</p>
          </div>
        </div>

        {/* Pendentes */}
        <div className="flex items-center gap-3 p-3 bg-zinc-900/90 rounded-xl border border-zinc-800">
          <div className="p-2.5 bg-sky-600/90 text-white rounded-lg shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Pendentes</p>
            <p className="text-xl font-extrabold text-white">{pendentes}</p>
          </div>
        </div>

        {/* Concluídos */}
        <div className="flex items-center gap-3 p-3 bg-zinc-900/90 rounded-xl border border-zinc-800">
          <div className="p-2.5 bg-emerald-600/90 text-white rounded-lg shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Concluídos</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-extrabold text-white">{concluidos}</p>
              <span className="text-xs font-semibold text-emerald-400">({percentConcluido}%)</span>
            </div>
          </div>
        </div>

        {/* Atrasados */}
        <div className="flex items-center gap-3 p-3 bg-zinc-900/90 rounded-xl border border-rose-950/60">
          <div className="p-2.5 bg-rose-600 text-white rounded-lg shadow-xs animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-300">Atrasados</p>
            <p className="text-xl font-extrabold text-rose-400">{atrasados}</p>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex flex-col justify-center p-3 bg-zinc-900/90 rounded-xl border border-zinc-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-red-500" /> Pendentes por Prioridade
          </p>
          <div className="flex items-center justify-between text-xs font-bold pt-1">
            <span className="text-rose-400">🔴 Alta: {altaPrioridade}</span>
            <span className="text-amber-400">🟠 Média: {mediaPrioridade}</span>
            <span className="text-emerald-400">🟢 Baixa: {baixaPrioridade}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
