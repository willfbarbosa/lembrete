"use client";

import React from "react";
import Image from "next/image";
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Globe,
  Sparkles,
  LogOut,
  UserCheck
} from "lucide-react";

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
  user: { username: string; name: string } | null;
  onLogout: () => void;
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
  user,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0e]/95 backdrop-blur-md border-b border-red-950/40 shadow-xl mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        {/* Top row: Brand Logo, User Info & Action CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 bg-black p-1.5 rounded-xl border border-red-600/50 shadow-md flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="Logo Eletrozone"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white font-sans">
                  Lembrete <span className="text-red-500">Eletrozone</span>
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-950/80 text-red-300 px-2 py-0.5 rounded-full border border-red-600/40">
                  <Sparkles className="w-3 h-3 text-red-500" /> Le Postiche
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium flex items-center gap-1 mt-0.5">
                <Globe className="w-3 h-3 text-red-500" /> lembrete.eletrozone.net.br
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
            {/* User Session Info & Logout */}
            {user && (
              <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-200">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline text-zinc-300">{user.username}</span>
                <button
                  onClick={onLogout}
                  className="ml-1 p-1 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                  title="Sair da Conta"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={onOpenNewModal}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 via-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/60 transition-all active:scale-95 group cursor-pointer"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>Novo Post-it</span>
            </button>
          </div>
        </div>

        {/* Bottom row: Search Bar & Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-2.5 border-t border-zinc-800/80">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Pesquisar lembretes..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-900/80 text-xs text-white border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder:text-zinc-500"
            />
          </div>

          {/* Filters & View Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-300">
              <Filter className="w-3.5 h-3.5 text-red-500 ml-1.5" />
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="bg-transparent pr-2 py-1 focus:outline-hidden cursor-pointer text-xs"
              >
                <option value="todos" className="bg-zinc-900 text-white">Todos os Status</option>
                <option value="pendentes" className="bg-zinc-900 text-white">⏳ Pendentes</option>
                <option value="concluidos" className="bg-zinc-900 text-white">✅ Concluídos</option>
                <option value="atrasados" className="bg-zinc-900 text-white">🚨 Atrasados</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-300">
              <select
                value={priorityFilter}
                onChange={(e) => onPriorityFilterChange(e.target.value)}
                className="bg-transparent px-2 py-1 focus:outline-hidden cursor-pointer text-xs"
              >
                <option value="todas" className="bg-zinc-900 text-white">Todas as Prioridades</option>
                <option value="baixa" className="bg-zinc-900 text-emerald-400">🟢 Verde (Baixa)</option>
                <option value="media" className="bg-zinc-900 text-amber-400">🟠 Laranja (Média)</option>
                <option value="alta" className="bg-zinc-900 text-red-400">🔴 Vermelho (Alta)</option>
              </select>
            </div>

            {/* View Mode Toggle (Grid vs List) */}
            <div className="flex items-center bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 ml-auto sm:ml-0">
              <button
                onClick={() => onViewModeChange("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-red-600 text-white shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                title="Visualização em Quadro"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-red-600 text-white shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200"
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
