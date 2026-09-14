"use client";

import React, { useState } from "react";
import { Lembrete } from "@/types/lembrete";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Tag, 
  Calendar
} from "lucide-react";
import confetti from "canvas-confetti";

interface PostItCardProps {
  lembrete: Lembrete;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
  onEdit: (lembrete: Lembrete) => void;
  onDelete: (id: string) => void;
}

export const PostItCard: React.FC<PostItCardProps> = ({
  lembrete,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Deterministic tilt angle
  const getTiltAngle = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const angles = [-1.8, -1, 0.5, 1.2, -0.6, 1.8, -1.2];
    return angles[Math.abs(hash) % angles.length];
  };

  const tiltAngle = getTiltAngle(lembrete.id);

  // Completion celebration
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lembrete.concluido) {
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#ef4444', '#10b981', '#f59e0b']
        });
      } catch (err) {}
    }
    onToggleComplete(lembrete.id, lembrete.concluido);
  };

  // Due date check
  const evaluateDueDate = (dataLimiteStr: string | null) => {
    if (!dataLimiteStr) return null;
    const now = new Date();
    const dueDate = new Date(dataLimiteStr);
    
    if (isNaN(dueDate.getTime())) return null;

    const diffMs = dueDate.getTime() - now.getTime();
    const isOverdue = diffMs < 0 && !lembrete.concluido;
    const isToday = !isOverdue && dueDate.toDateString() === now.toDateString();

    const formattedDate = dueDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      formattedDate,
      isOverdue,
      isToday,
    };
  };

  const dueInfo = evaluateDueDate(lembrete.data_limite);

  const postitColorClasses: Record<string, string> = {
    yellow: "postit-yellow",
    pink: "postit-pink",
    blue: "postit-blue",
    green: "postit-green",
    purple: "postit-purple",
    orange: "postit-orange",
  };

  const postitBg = postitColorClasses[lembrete.cor_postit] || "postit-yellow";

  const priorityConfig = {
    baixa: {
      label: "Baixa",
      bgClass: "priority-baixa",
      dotClass: "bg-emerald-400",
    },
    media: {
      label: "Média",
      bgClass: "priority-media",
      dotClass: "bg-amber-400",
    },
    alta: {
      label: "Alta",
      bgClass: "priority-alta",
      dotClass: "bg-red-500",
    },
  };

  const currentPriority = priorityConfig[lembrete.prioridade] || priorityConfig.baixa;

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    onDelete(lembrete.id);
  };

  return (
    <div
      style={{
        transform: `rotate(${tiltAngle}deg)`,
      }}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border-2 postit-shadow-dark transition-all duration-300 hover:rotate-0 hover:scale-[1.02] hover:z-20 ${postitBg} ${
        lembrete.concluido ? "opacity-60 grayscale-[30%]" : ""
      } ${isDeleting ? "scale-0 opacity-0 transition-all duration-300" : ""}`}
    >
      {/* Decorative Red Tape at Top */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="postit-tape-red flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-red-500/40" />
        </div>
      </div>

      <div>
        {/* Header Ribbon: Priority & Category */}
        <div className="flex items-center justify-between gap-2 mb-3 pt-1">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-xs ${currentPriority.bgClass}`}
          >
            <span className={`w-2 h-2 rounded-full ${currentPriority.dotClass} animate-pulse`} />
            {currentPriority.label}
          </span>

          {lembrete.categoria && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded-md border border-zinc-800">
              <Tag className="w-3 h-3 text-red-500" />
              {lembrete.categoria}
            </span>
          )}
        </div>

        {/* Title and Checkbox */}
        <div className="flex items-start gap-2.5 mb-2.5">
          <button
            onClick={handleToggle}
            type="button"
            className="mt-0.5 text-zinc-400 hover:text-emerald-400 transition-colors shrink-0 focus:outline-hidden cursor-pointer"
            title={lembrete.concluido ? "Desmarcar conclusão" : "Marcar como concluído"}
          >
            {lembrete.concluido ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950 transition-transform active:scale-90" />
            ) : (
              <Circle className="w-6 h-6 text-zinc-500 hover:text-emerald-400 transition-transform active:scale-90" />
            )}
          </button>

          <h3
            className={`text-base font-extrabold text-white leading-snug break-words flex-1 ${
              lembrete.concluido ? "completed-text text-zinc-400" : ""
            }`}
          >
            {lembrete.titulo}
          </h3>
        </div>

        {/* Content */}
        {lembrete.conteudo && (
          <p
            className={`text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed mb-4 font-sans ${
              lembrete.concluido ? "line-through text-zinc-500" : ""
            }`}
          >
            {lembrete.conteudo}
          </p>
        )}
      </div>

      {/* Footer: Due date & Actions */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          {dueInfo ? (
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                dueInfo.isOverdue
                  ? "bg-red-600 text-white animate-bounce shadow-sm"
                  : dueInfo.isToday
                  ? "bg-amber-500 text-black font-extrabold"
                  : "bg-zinc-900/90 text-zinc-300 border border-zinc-800"
              }`}
              title={`Data Limite: ${dueInfo.formattedDate}`}
            >
              {dueInfo.isOverdue ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Atrasado ({dueInfo.formattedDate})</span>
                </>
              ) : dueInfo.isToday ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Vence Hoje</span>
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{dueInfo.formattedDate}</span>
                </>
              )}
            </div>
          ) : (
            <span className="text-zinc-500 italic text-[11px]">Sem prazo</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(lembrete)}
            type="button"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Editar Post-it"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {!showConfirmDelete ? (
            <button
              onClick={() => setShowConfirmDelete(true)}
              type="button"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
              title="Apagar Post-it"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-red-800/80 shadow-md">
              <button
                onClick={handleDeleteConfirm}
                type="button"
                className="px-2 py-0.5 bg-red-600 text-white font-bold rounded text-[10px] hover:bg-red-700 cursor-pointer"
              >
                Apagar
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                type="button"
                className="px-1.5 py-0.5 text-zinc-400 hover:text-white text-[10px] cursor-pointer"
              >
                X
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
