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

  const setQuickDate = (hoursFromNow: number) => {
    const target = new Date(Date.now() + hoursFromNow * 3600 * 1000);
    const tzOffset = target.getTimezoneOffset() * 60000;
    const localISOTime = new Date(target.getTime() - tzOffset).toISOString().slice(0, 16);
    setDataLimite(localISOTime);
  };

  const paperColors: { key: CorPostit; name: string; bgClass: string }[] = [
    { key: "yellow", name: "Amarelo", bgClass: "bg-yellow-500 border-yellow-300" },
    { key: "pink", name: "Rosa", bgClass: "bg-pink-500 border-pink-300" },
    { key: "blue", name: "Azul", bgClass: "bg-sky-500 border-sky-300" },
    { key: "green", name: "Verde", bgClass: "bg-emerald-500 border-emerald-300" },
    { key: "purple", name: "Roxo", bgClass: "bg-purple-500 border-purple-300" },
    { key: "orange", name: "Laranja", bgClass: "bg-orange-500 border-orange-300" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#121215] rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.2)] border border-red-900/40 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-600 to-rose-700 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-200" />
            <h2 className="text-lg font-bold">
              {editingLembrete ? "Editar Post-it" : "Novo Post-it Le Postiche"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-red-300 bg-red-950/60 border border-red-600/50 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Título do Lembrete *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Manutenção de equipamento..."
              className="w-full px-4 py-2.5 text-white bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-semibold transition-all placeholder:text-zinc-600"
              required
              autoFocus
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Conteúdo / Detalhes
            </label>
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Adicione observações ou tarefas..."
              rows={3}
              className="w-full px-4 py-2.5 text-white bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all resize-none placeholder:text-zinc-600"
            />
          </div>

          {/* Priority selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Prioridade *
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPrioridade("baixa")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs font-bold cursor-pointer ${
                  prioridade === "baixa"
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/50 shadow-sm"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                <span className="text-base mb-0.5">🟢</span>
                <span>Verde</span>
                <span className="text-[10px] font-normal text-emerald-400">Baixa Prioridade</span>
              </button>

              <button
                type="button"
                onClick={() => setPrioridade("media")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs font-bold cursor-pointer ${
                  prioridade === "media"
                    ? "bg-amber-950/80 border-amber-500 text-amber-300 ring-2 ring-amber-500/50 shadow-sm"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                <span className="text-base mb-0.5">🟠</span>
                <span>Laranja</span>
                <span className="text-[10px] font-normal text-amber-400">Média Prioridade</span>
              </button>

              <button
                type="button"
                onClick={() => setPrioridade("alta")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs font-bold cursor-pointer ${
                  prioridade === "alta"
                    ? "bg-rose-950/80 border-rose-500 text-rose-300 ring-2 ring-rose-500/50 shadow-sm"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                <span className="text-base mb-0.5">🔴</span>
                <span>Vermelho</span>
                <span className="text-[10px] font-normal text-rose-400">Alta Prioridade</span>
              </button>
            </div>
          </div>

          {/* Due date picker */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                Data Limite para Finalizar
              </label>
              {dataLimite && (
                <button
                  type="button"
                  onClick={() => setDataLimite("")}
                  className="text-xs text-red-400 hover:underline cursor-pointer"
                >
                  Limpar data
                </button>
              )}
            </div>
            <input
              type="datetime-local"
              value={dataLimite}
              onChange={(e) => setDataLimite(e.target.value)}
              className="w-full px-4 py-2 text-white bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium transition-all"
            />
            {/* Quick date presets */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 text-xs">
              <span className="text-zinc-500 text-[11px] font-medium flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3 text-red-500" /> Atalhos:
              </span>
              <button
                type="button"
                onClick={() => setQuickDate(4)}
                className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700 text-[11px] shrink-0 cursor-pointer"
              >
                Hoje +4h
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(24)}
                className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700 text-[11px] shrink-0 cursor-pointer"
              >
                Amanhã
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(72)}
                className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700 text-[11px] shrink-0 cursor-pointer"
              >
                Em 3 dias
              </button>
            </div>
          </div>

          {/* Paper Color & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-red-500" /> Cor do Post-it
              </label>
              <div className="flex items-center gap-2 pt-1">
                {paperColors.map((color) => (
                  <button
                    key={color.key}
                    type="button"
                    onClick={() => setCorPostit(color.key)}
                    title={color.name}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${color.bgClass} ${
                      corPostit === color.key ? "scale-125 ring-2 ring-red-500 shadow-md" : "opacity-75 hover:opacity-100 hover:scale-110"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-red-500" /> Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 text-white border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-500 text-sm font-medium cursor-pointer"
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
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-zinc-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 rounded-xl shadow-lg shadow-red-950/60 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
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
