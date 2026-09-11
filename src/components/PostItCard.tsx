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
  Calendar,
  Sparkles
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

  // Deterministic tilt angle based on ID hash for realistic corkboard look
  const getTiltAngle = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const angles = [-2, -1.2, 0.8, 1.5, -0.5, 2.2, -1.8];
    return angles[Math.abs(hash) % angles.length];
  };

  const tiltAngle = getTiltAngle(lembrete.id);

  // Handle completion toggle with confetti celebration on success
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lembrete.concluido) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#f59e0b', '#3b82f6']
        });
      } catch (err) {
        // Fallback if canvas confetti fails
      }
    }
    onToggleComplete(lembrete.id, lembrete.concluido);
  };

  // Due date status evaluation
  const evaluateDueDate = (dataLimiteStr: string | null) => {
    if (!dataLimiteStr) return null;
    const now = new Date();
    const dueDate = new Date(dataLimiteStr);
    
    if (isNaN(dueDate.getTime())) return null;

    const diffMs = dueDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

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
      diffHours,
    };
  };

  const dueInfo = evaluateDueDate(lembrete.data_limite);

  // Map postit paper colors to CSS classes
  const postitColorClasses: Record<string, string> = {
    yellow: "postit-yellow",
    pink: "postit-pink",
    blue: "postit-blue",
    green: "postit-green",
    purple: "postit-purple",
    orange: "postit-orange",
  };

  const postitBg = postitColorClasses[lembrete.cor_postit] || "postit-yellow";

  // Priority color details
  const priorityConfig = {
    baixa: {
      label: "Baixa",
      icon: "🟢",
      bgClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      dotClass: "bg-emerald-500",
    },
    media: {
      label: "Média",
      icon: "🟠",
      bgClass: "bg-amber-100 text-amber-900 border-amber-300",
      dotClass: "bg-amber-500",
    },
    alta: {
      label: "Alta",
      icon: "🔴",
      bgClass: "bg-rose-100 text-rose-900 border-rose-400 font-bold",
      dotClass: "bg-rose-600",
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
      className={`group relative flex flex-col justify-between p-5 rounded-sm border-2 postit-shadow transition-all duration-300 hover:rotate-0 hover:scale-[1.02] hover:z-20 ${postitBg} ${
        lembrete.concluido ? "opacity-75 grayscale-[20%]" : ""
      } ${isDeleting ? "scale-0 opacity-0 transition-all duration-300" : ""}`}
    >
      {/* Decorative Adhesive Tape or Push Pin at Top */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="postit-tape flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-amber-400/40" />
        </div>
      </div>

      <div>
        {/* Header Ribbon: Priority Badge & Category */}
        <div className="flex items-center justify-between gap-2 mb-3 pt-1">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentPriority.bgClass} shadow-xs`}
            title={`Prioridade ${currentPriority.label}`}
          >
            <span className={`w-2 h-2 rounded-full ${currentPriority.dotClass} animate-pulse`} />
            {currentPriority.label}
          </span>

          {lembrete.categoria && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-700 bg-white/60 backdrop-blur-xs px-2 py-0.5 rounded border border-black/5">
              <Tag className="w-3 h-3 text-gray-500" />
              {lembrete.categoria}
            </span>
          )}
        </div>

        {/* Title and Completion Checkbox */}
        <div className="flex items-start gap-2.5 mb-2.5">
          <button
            onClick={handleToggle}
            type="button"
            className="mt-0.5 text-gray-700 hover:text-emerald-600 transition-colors shrink-0 focus:outline-hidden"
            title={lembrete.concluido ? "Desmarcar conclusão" : "Marcar como concluído"}
          >
            {lembrete.concluido ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100 transition-transform active:scale-90" />
            ) : (
              <Circle className="w-6 h-6 text-gray-500 hover:text-emerald-600 transition-transform active:scale-90" />
            )}
          </button>

          <h3
            className={`text-lg font-bold text-gray-900 leading-snug break-words flex-1 ${
              lembrete.concluido ? "completed-text text-gray-600" : ""
            }`}
          >
            {lembrete.titulo}
          </h3>
        </div>

        {/* Note Content / Description */}
        {lembrete.conteudo && (
          <p
            className={`text-sm text-gray-800 whitespace-pre-wrap leading-relaxed mb-4 font-sans ${
              lembrete.concluido ? "line-through text-gray-500 opacity-80" : ""
            }`}
          >
            {lembrete.conteudo}
          </p>
        )}
      </div>

      {/* Footer Details: Due Date & Action Buttons */}
      <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between gap-2 text-xs">
        {/* Due Date Indicator */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {dueInfo ? (
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                dueInfo.isOverdue
                  ? "bg-red-600 text-white animate-bounce shadow-sm"
                  : dueInfo.isToday
                  ? "bg-amber-500 text-white font-bold"
                  : "bg-black/5 text-gray-800"
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
                  <span>Vence Hoje ({dueInfo.formattedDate.split(" ")[1]})</span>
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5 text-gray-600" />
                  <span>{dueInfo.formattedDate}</span>
                </>
              )}
            </div>
          ) : (
            <span className="text-gray-500 italic text-[11px]">Sem data limite</span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(lembrete)}
            type="button"
            className="p-1.5 rounded-full text-gray-700 hover:text-blue-700 hover:bg-black/5 transition-colors"
            title="Editar Post-it"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {!showConfirmDelete ? (
            <button
              onClick={() => setShowConfirmDelete(true)}
              type="button"
              className="p-1.5 rounded-full text-gray-700 hover:text-red-700 hover:bg-black/5 transition-colors"
              title="Apagar Post-it"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-white/90 p-1 rounded-md border border-red-200 shadow-sm animate-in fade-in zoom-in-95">
              <button
                onClick={handleDeleteConfirm}
                type="button"
                className="px-2 py-0.5 bg-red-600 text-white font-bold rounded text-[11px] hover:bg-red-700 transition-colors"
              >
                Apagar
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                type="button"
                className="px-1.5 py-0.5 text-gray-600 hover:text-gray-900 text-[11px]"
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
