"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Lembrete, CreateLembreteInput } from "@/types/lembrete";
import { HeaderBar } from "@/components/HeaderBar";
import { StatsBar } from "@/components/StatsBar";
import { PostItCard } from "@/components/PostItCard";
import { PostItModal } from "@/components/PostItModal";
import { LoginModal } from "@/components/LoginModal";
import { StickyNote, Plus, RefreshCw, AlertCircle, Sparkles } from "lucide-react";

const STORAGE_KEY = "eletrozone_lembretes_v1";
const SEEDED_KEY = "eletrozone_lembretes_seeded_v1";

export default function Home() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ username: string; name: string } | null>(null);

  // App state
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & View State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [priorityFilter, setPriorityFilter] = useState("todas");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLembrete, setEditingLembrete] = useState<Lembrete | null>(null);

  // Check Session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            setUser(data.user);
            return;
          }
        }
      } catch (err) {
        console.error("Erro ao verificar sessão:", err);
      }
      setIsAuthenticated(false);
      setUser(null);
    };
    checkSession();
  }, []);

  const handleLoginSuccess = (userData: { username: string; name: string }) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  // Sync state to LocalStorage
  const syncToLocalStorage = (data: Lembrete[]) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (e) {
      console.error("Erro ao salvar no localStorage:", e);
    }
  };

  // Seed default notes
  const seedDefaultLembretes = async () => {
    try {
      const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
      const inThreeDays = new Date(Date.now() + 72 * 3600 * 1000).toISOString();
      const pastDate = new Date(Date.now() - 12 * 3600 * 1000).toISOString();

      const defaultItems: CreateLembreteInput[] = [
        {
          titulo: "🔥 Lembrete Urgente - Reunião Eletrozone",
          conteudo: "Revisar o alocamento do sistema em lembrete.eletrozone.net.br e verificar prioridades.",
          prioridade: "alta",
          data_limite: pastDate,
          categoria: "Urgente",
          cor_postit: "pink",
        },
        {
          titulo: "🛒 Comprar suprimentos de escritório",
          conteudo: "Blocos de papel post-it coloridos, canetas e prancheta.",
          prioridade: "media",
          data_limite: tomorrow,
          categoria: "Compras",
          cor_postit: "yellow",
        },
        {
          titulo: "📚 Estudar documentação Turso DB",
          conteudo: "Aprender mais sobre sincronização edge e réplicas no @libsql/client.",
          prioridade: "baixa",
          data_limite: inThreeDays,
          categoria: "Estudos",
          cor_postit: "green",
        },
      ];

      const createdList: Lembrete[] = [];
      for (const item of defaultItems) {
        const res = await fetch("/api/lembretes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (res.ok) {
          const created = await res.json();
          createdList.push(created);
        }
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(SEEDED_KEY, "true");
      }

      setLembretes(createdList);
      syncToLocalStorage(createdList);
    } catch (err) {
      console.error("Erro ao popular lembretes padrão:", err);
    }
  };

  // Fetch all lembretes
  const fetchLembretes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const isAlreadySeeded = typeof window !== "undefined" && localStorage.getItem(SEEDED_KEY) === "true";
      const localDataStr = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

      const res = await fetch("/api/lembretes");
      if (!res.ok) throw new Error("Erro ao buscar lembretes da API");
      const apiData: Lembrete[] = await res.json();
      
      if (Array.isArray(apiData) && apiData.length > 0) {
        setLembretes(apiData);
        syncToLocalStorage(apiData);
        if (typeof window !== "undefined") localStorage.setItem(SEEDED_KEY, "true");
      } else if (localDataStr !== null) {
        try {
          const parsed = JSON.parse(localDataStr);
          setLembretes(parsed);
        } catch {
          setLembretes([]);
        }
      } else if (!isAlreadySeeded) {
        await seedDefaultLembretes();
      } else {
        setLembretes([]);
        syncToLocalStorage([]);
      }
    } catch (err: any) {
      console.error(err);
      if (typeof window !== "undefined") {
        const localDataStr = localStorage.getItem(STORAGE_KEY);
        if (localDataStr) {
          try {
            setLembretes(JSON.parse(localDataStr));
          } catch {
            setError("Não foi possível carregar os lembretes.");
          }
        } else {
          setError("Não foi possível carregar os lembretes do banco de dados.");
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLembretes();
    }
  }, [isAuthenticated, fetchLembretes]);

  // Toggle completion
  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const updated = lembretes.map((item) =>
      item.id === id ? { ...item, concluido: nextStatus } : item
    );
    setLembretes(updated);
    syncToLocalStorage(updated);

    try {
      await fetch(`/api/lembretes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concluido: nextStatus }),
      });
    } catch (err) {
      console.error("Erro ao atualizar status na API:", err);
    }
  };

  // Save (Create or Update)
  const handleSaveLembrete = async (input: CreateLembreteInput, id?: string) => {
    if (id) {
      const res = await fetch(`/api/lembretes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      
      let updatedItem: Lembrete;
      if (res.ok) {
        updatedItem = await res.json();
      } else {
        updatedItem = {
          id,
          titulo: input.titulo,
          conteudo: input.conteudo,
          prioridade: input.prioridade,
          data_limite: input.data_limite || null,
          concluido: false,
          categoria: input.categoria || "Geral",
          cor_postit: input.cor_postit || "yellow",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      const newList = lembretes.map((item) => (item.id === id ? updatedItem : item));
      setLembretes(newList);
      syncToLocalStorage(newList);
    } else {
      const res = await fetch("/api/lembretes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      let newItem: Lembrete;
      if (res.ok) {
        newItem = await res.json();
      } else {
        newItem = {
          id: crypto.randomUUID(),
          titulo: input.titulo,
          conteudo: input.conteudo,
          prioridade: input.prioridade,
          data_limite: input.data_limite || null,
          concluido: false,
          categoria: input.categoria || "Geral",
          cor_postit: input.cor_postit || "yellow",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      const newList = [newItem, ...lembretes];
      setLembretes(newList);
      syncToLocalStorage(newList);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(SEEDED_KEY, "true");
    }
  };

  // Delete
  const handleDeleteLembrete = async (id: string) => {
    const newList = lembretes.filter((item) => item.id !== id);
    setLembretes(newList);
    syncToLocalStorage(newList);

    if (typeof window !== "undefined") {
      localStorage.setItem(SEEDED_KEY, "true");
    }

    try {
      await fetch(`/api/lembretes/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Erro ao excluir lembrete na API:", err);
    }
  };

  // Modal actions
  const handleOpenNewModal = () => {
    setEditingLembrete(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lembrete: Lembrete) => {
    setEditingLembrete(lembrete);
    setIsModalOpen(true);
  };

  // Filtering logic
  const filteredLembretes = useMemo(() => {
    const now = new Date();

    return lembretes.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.titulo.toLowerCase().includes(q);
        const matchContent = (item.conteudo || "").toLowerCase().includes(q);
        const matchCat = (item.categoria || "").toLowerCase().includes(q);
        if (!matchTitle && !matchContent && !matchCat) return false;
      }

      if (priorityFilter !== "todas" && item.prioridade !== priorityFilter) {
        return false;
      }

      if (statusFilter === "pendentes" && item.concluido) return false;
      if (statusFilter === "concluidos" && !item.concluido) return false;
      if (statusFilter === "atrasados") {
        if (item.concluido || !item.data_limite) return false;
        const dueDate = new Date(item.data_limite);
        if (isNaN(dueDate.getTime()) || dueDate.getTime() >= now.getTime()) return false;
      }

      return true;
    });
  }, [lembretes, searchQuery, statusFilter, priorityFilter]);

  // Render Login Modal if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <LoginModal isOpen={true} onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Initial Auth Loading Screen
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-red-500">
        <RefreshCw className="w-8 h-8 animate-spin mb-3" />
        <p className="text-sm font-semibold text-zinc-400">Verificando autenticação Eletrozone...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-12 bg-[#09090b] text-zinc-100">
      {/* Top Bar */}
      <HeaderBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenNewModal={handleOpenNewModal}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 flex-1 w-full">
        {/* Statistics Bar */}
        <StatsBar lembretes={lembretes} />

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
            <RefreshCw className="w-8 h-8 animate-spin mb-3 text-red-500" />
            <p className="text-sm font-semibold">Carregando seus Post-its...</p>
          </div>
        )}

        {/* Error Indicator */}
        {error && !loading && (
          <div className="p-4 bg-red-950/80 border border-red-800 text-red-200 rounded-xl flex items-center justify-between my-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchLembretes}
              className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg text-xs hover:bg-red-700 cursor-pointer"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredLembretes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[#121215]/80 backdrop-blur-xs rounded-3xl border border-dashed border-red-900/30 max-w-md mx-auto my-8 shadow-2xl">
            <div className="p-4 bg-red-950/50 text-red-500 rounded-full mb-4 border border-red-900/40">
              <StickyNote className="w-12 h-12 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Nenhum Post-it encontrado</h3>
            <p className="text-xs text-zinc-400 mb-6 max-w-xs">
              {searchQuery || statusFilter !== "todos" || priorityFilter !== "todas"
                ? "Tente ajustar seus filtros de busca ou prioridade."
                : "Você ainda não criou nenhum lembrete no quadro."}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenNewModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/60 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Novo Lembrete</span>
              </button>
              <button
                onClick={seedDefaultLembretes}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                title="Inserir post-its de exemplo"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>Exemplos</span>
              </button>
            </div>
          </div>
        )}

        {/* Post-it Board Grid View */}
        {!loading && !error && filteredLembretes.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
            {filteredLembretes.map((item) => (
              <PostItCard
                key={item.id}
                lembrete={item}
                onToggleComplete={handleToggleComplete}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteLembrete}
              />
            ))}
          </div>
        )}

        {/* List View */}
        {!loading && !error && filteredLembretes.length > 0 && viewMode === "list" && (
          <div className="space-y-3 p-2">
            {filteredLembretes.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-[#121215]/90 backdrop-blur-xs rounded-xl border border-zinc-800 shadow-lg hover:border-red-900/50 transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={item.concluido}
                    onChange={() => handleToggleComplete(item.id, item.concluido)}
                    className="w-5 h-5 text-red-600 rounded-md focus:ring-red-500 cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`font-bold text-sm text-white truncate ${
                          item.concluido ? "line-through text-zinc-500" : ""
                        }`}
                      >
                        {item.titulo}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          item.prioridade === "alta"
                            ? "bg-rose-950 text-rose-300 border border-rose-800"
                            : item.prioridade === "media"
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        }`}
                      >
                        {item.prioridade}
                      </span>
                    </div>
                    {item.conteudo && (
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{item.conteudo}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4 text-xs">
                  {item.data_limite && (
                    <span className="text-zinc-500 hidden sm:inline">
                      📅 {new Date(item.data_limite).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="px-2.5 py-1 text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteLembrete(item.id)}
                    className="px-2.5 py-1 text-xs font-semibold text-red-400 bg-red-950/60 hover:bg-red-900/80 rounded-lg cursor-pointer"
                  >
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Post-it Creation & Editing Modal */}
      <PostItModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLembrete}
        editingLembrete={editingLembrete}
      />

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-zinc-900 text-center text-xs text-zinc-500 font-medium">
        <p>Lembrete Eletrozone &copy; {new Date().getFullYear()} — Sistema Le Postiche</p>
        <p className="text-[11px] mt-0.5 text-zinc-600">Alocado em lembrete.eletrozone.net.br | Tema Preto e Vermelho</p>
      </footer>
    </div>
  );
}
