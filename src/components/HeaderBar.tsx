"use client";

import React from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  StickyNote, 
  Globe,
  Sparkles
} from "lucide-react";
import { Prioridade } from "@/types/lembrete";

interface HeaderBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onOpenNewModal: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  viewMode,
  onViewModeChange,
  onOpenNewModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fffdf9]/90 backdrop-blur-md border-b border-amber-900/10 shadow-xs mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Top row: Brand & New Note CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-yellow-400 text-amber-950 rounded-2xl shadow-md rotate-[-3deg]">
              <StickyNote className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-amber-950 font-sans">
                  Lembrete <span className="text-amber-600">Eletrozone</span>
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Le Postiche
                </span>
              </div>
              <p className="text-xs text-amber-900/70 font-medium flex items-center gap-1 mt-0.5">
                <Globe className="w-3 h-3 text-amber-700" /> lembrete.eletrozone.net.br
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-end gap-2">
            <button
              onClick={onOpenNewModal}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 group"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              <span>Novo Post-it</span>
            </button>
          </div>
        </div>

        {/* Bottom row: Search Bar & Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-amber-900/5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-800/50 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Pesquisar lembretes..."
              className="w-full pl-10 pr-4 py-2 bg-amber-50/60 focus:bg-white text-sm text-gray-900 border border-amber-900/15 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-gray-500"
            />
          </div>

          {/* Filters & View Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-amber-50/60 p-1 rounded-xl border border-amber-900/15 text-xs font-semibold text-gray-700">
              <Filter className="w-3.5 h-3.5 text-amber-700 ml-1.5" />
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="bg-transparent pr-2 py-1 focus:outline-hidden cursor-pointer"
              >
                <option value="todos">Todos os Status</option>
                <option value="pendentes">⏳ Pendentes</option>
                <option value="concluidos">✅ Concluídos</option>
                <option value="atrasados">🚨 Atrasados</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 bg-amber-50/60 p-1 rounded-xl border border-amber-900/15 text-xs font-semibold text-gray-700">
              <select
                value={priorityFilter}
                onChange={(e) => onPriorityFilterChange(e.target.value)}
                className="bg-transparent px-2 py-1 focus:outline-hidden cursor-pointer"
              >
                <option value="todas">Todas as Prioridades</option>
                <option value="baixa">🟢 Verde (Baixa)</option>
                <option value="media">🟠 Laranja (Média)</option>
                <option value="alta">🔴 Vermelho (Alta)</option>
              </select>
            </div>

            {/* View Mode Toggle (Grid vs List) */}
            <div className="flex items-center bg-amber-50/60 p-1 rounded-xl border border-amber-900/15 ml-auto sm:ml-0">
              <button
                onClick={() => onViewModeChange("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-amber-900/70 hover:text-amber-950"
                }`}
                title="Visualização em Quadro (Post-it)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-amber-900/70 hover:text-amber-950"
                }`}
                title="Visualização em Lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
