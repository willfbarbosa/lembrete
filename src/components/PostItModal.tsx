"use client";

import React, { useState, useEffect } from "react";
import { Lembrete, Prioridade, CorPostit, CreateLembreteInput } from "@/types/lembrete";
import { X, Calendar, Tag, Palette, AlertCircle, Clock, Sparkles } from "lucide-react";

interface PostItModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateLembreteInput, id?: string) => Promise<void>;
  editingLembrete?: Lembrete | null;
}

export const PostItModal: React.FC<PostItModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLembrete,
}) => {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [prioridade, setPrioridade] = useState<Prioridade>("baixa");
  const [dataLimite, setDataLimite] = useState("");
  const [categoria, setCategoria] = useState("Geral");
  const [corPostit, setCorPostit] = useState<CorPostit>("yellow");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (editingLembrete) {
      setTitulo(editingLembrete.titulo);
      setConteudo(editingLembrete.conteudo || "");
      setPrioridade(editingLembrete.prioridade || "baixa");
      setCategoria(editingLembrete.categoria || "Geral");
      setCorPostit(editingLembrete.cor_postit || "yellow");
      
      if (editingLembrete.data_limite) {
        // Convert ISO date to datetime-local format string (YYYY-MM-DDTHH:mm)
        const d = new Date(editingLembrete.data_limite);
        if (!isNaN(d.getTime())) {
          const tzOffset = d.getTimezoneOffset() * 60000;
          const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
          setDataLimite(localISOTime);
        } else {
          setDataLimite("");
        }
      } else {
        setDataLimite("");
      }
    } else {
      // Defaults for new note
      setTitulo("");
      setConteudo("");
      setPrioridade("baixa");
      setDataLimite("");
      setCategoria("Geral");
      setCorPostit("yellow");
    }
    setErrorMsg("");
  }, [editingLembrete, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setErrorMsg("Por favor, digite um título para o lembrete.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await onSave(
        {
          titulo: titulo.trim(),
          conteudo: conteudo.trim(),
          prioridade,
          data_limite: dataLimite ? new Date(dataLimite).toISOString() : null,
          categoria,
          cor_postit: corPostit,
        },
        editingLembrete?.id
      );
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao salvar lembrete.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Preset Helper for Due Dates
  const setQuickDate = (hoursFromNow: number) => {
    const target = new Date(Date.now() + hoursFromNow * 3600 * 1000);
    const tzOffset = target.getTimezoneOffset() * 60000;
    const localISOTime = new Date(target.getTime() - tzOffset).toISOString().slice(0, 16);
    setDataLimite(localISOTime);
  };

  const paperColors: { key: CorPostit; name: string; bgClass: string }[] = [
    { key: "yellow", name: "Amarelo", bgClass: "bg-yellow-200 border-yellow-400" },
    { key: "pink", name: "Rosa", bgClass: "bg-pink-200 border-pink-400" },
    { key: "blue", name: "Azul", bgClass: "bg-sky-200 border-sky-400" },
    { key: "green", name: "Verde", bgClass: "bg-emerald-200 border-emerald-400" },
    { key: "purple", name: "Roxo", bgClass: "bg-purple-200 border-purple-400" },
    { key: "orange", name: "Laranja", bgClass: "bg-amber-200 border-amber-400" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#fffdfa] rounded-2xl shadow-2xl border border-amber-200/60 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-xl font-bold">
              {editingLembrete ? "Editar Post-it" : "Novo Post-it Le Postiche"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Título do Lembrete *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Comprar materiais de escritório..."
              className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-semibold transition-all"
              required
              autoFocus
            />
          </div>

          {/* Content textarea */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Conteúdo / Detalhes
            </label>
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Adicione notas, links ou detalhes importantes..."
              rows={3}
              className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all resize-none"
            />
          </div>

          {/* Priority selector (Verde, Laranja, Vermelho) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Prioridade *
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPrioridade("baixa")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all text-xs font-bold ${
                  prioridade === "baixa"
                    ? "bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400/50 scale-105 shadow-sm"
                    : "bg-emerald-50/50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/60"
                }`}
              >
                <span className="text-base mb-0.5">🟢</span>
                <span>Verde</span>
                <span className="text-[10px] font-normal text-emerald-600">Baixa Prioridade</span>
              </button>

              <button
                type="button"
                onClick={() => setPrioridade("media")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all text-xs font-bold ${
                  prioridade === "media"
                    ? "bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-400/50 scale-105 shadow-sm"
                    : "bg-amber-50/50 border-amber-200 text-amber-700 hover:bg-amber-100/60"
                }`}
              >
                <span className="text-base mb-0.5">🟠</span>
                <span>Laranja</span>
                <span className="text-[10px] font-normal text-amber-600">Média Prioridade</span>
              </button>

              <button
                type="button"
                onClick={() => setPrioridade("alta")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all text-xs font-bold ${
                  prioridade === "alta"
                    ? "bg-rose-100 border-rose-500 text-rose-900 ring-2 ring-rose-400/50 scale-105 shadow-sm"
                    : "bg-rose-50/50 border-rose-200 text-rose-700 hover:bg-rose-100/60"
                }`}
              >
                <span className="text-base mb-0.5">🔴</span>
                <span>Vermelho</span>
                <span className="text-[10px] font-normal text-rose-600">Alta Prioridade</span>
              </button>
            </div>
          </div>

          {/* Due date picker (Data Limite) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Data Limite para Finalizar
              </label>
              {dataLimite && (
                <button
                  type="button"
                  onClick={() => setDataLimite("")}
                  className="text-xs text-red-600 hover:underline"
                >
                  Limpar data
                </button>
              )}
            </div>
            <input
              type="datetime-local"
              value={dataLimite}
              onChange={(e) => setDataLimite(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium transition-all"
            />
            {/* Quick date presets */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 text-xs">
              <span className="text-gray-600 text-[11px] font-medium flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3 text-amber-600" /> Atalhos:
              </span>
              <button
                type="button"
                onClick={() => setQuickDate(4)}
                className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors text-[11px] shrink-0"
              >
                Hoje +4h
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(24)}
                className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors text-[11px] shrink-0"
              >
                Amanhã
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(72)}
                className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors text-[11px] shrink-0"
              >
                Em 3 dias
              </button>
            </div>
          </div>

          {/* Post-it Paper Color & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Post-it Color Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-amber-600" /> Cor do Papel
              </label>
              <div className="flex items-center gap-2 pt-1">
                {paperColors.map((color) => (
                  <button
                    key={color.key}
                    type="button"
                    onClick={() => setCorPostit(color.key)}
                    title={color.name}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${color.bgClass} ${
                      corPostit === color.key ? "scale-125 ring-2 ring-amber-500 shadow-sm" : "hover:scale-110"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-600" /> Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-sm font-medium"
              >
                <option value="Geral">📌 Geral</option>
                <option value="Trabalho">💼 Trabalho</option>
                <option value="Pessoal">🏡 Pessoal</option>
                <option value="Estudos">📚 Estudos</option>
                <option value="Urgente">🚨 Urgente</option>
                <option value="Compras">🛒 Compras</option>
              </select>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting
                ? "Salvando..."
                : editingLembrete
                ? "Atualizar Post-it"
                : "Criar Post-it"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
