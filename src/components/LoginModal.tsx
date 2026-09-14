"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Lock, Eye, EyeOff, ShieldAlert, LogIn, Sparkles } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: { username: string; name: string }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState("willian.barbosa");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg("Por favor, preencha o usuário e a senha.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Credenciais inválidas.");
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setErrorMsg(err.message || "Falha na autenticação. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-md bg-[#121215] rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.2)] border border-red-900/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Banner */}
        <div className="h-2 bg-gradient-to-r from-red-700 via-red-500 to-rose-600 w-full" />

        <div className="p-8">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative w-20 h-20 mb-4 p-2 bg-black/80 rounded-2xl border border-red-600/40 shadow-inner flex items-center justify-center group">
              <Image
                src="/logo.png"
                alt="Logo Eletrozone"
                width={64}
                height={64}
                className="object-contain transition-transform group-hover:scale-105"
                priority
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-red-600 rounded-full text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Lembrete <span className="text-red-500">Eletrozone</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-medium">
              Autenticação de Acesso ao Le Postiche
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="flex items-center gap-2.5 p-3.5 text-xs text-red-300 bg-red-950/60 border border-red-600/50 rounded-xl animate-shake">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-red-500" />
                Usuário
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu nome de usuário..."
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900/90 text-white text-sm font-semibold border border-zinc-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder:text-zinc-600"
                  required
                  autoFocus
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-500" />
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha..."
                  className="w-full pl-10 pr-10 py-3 bg-zinc-900/90 text-white text-sm font-semibold border border-zinc-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder:text-zinc-600"
                  required
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 via-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-950/50 hover:shadow-red-600/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Autenticando...
                </span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar no Sistema</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 text-center border-t border-zinc-800/80 pt-4 text-[11px] text-zinc-500 font-medium">
            <p>Eletrozone &copy; {new Date().getFullYear()} — Painel de Controle</p>
            <p className="text-zinc-600 mt-0.5">lembrete.eletrozone.net.br</p>
          </div>
        </div>
      </div>
    </div>
  );
};
