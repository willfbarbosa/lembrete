import { createClient } from "@libsql/client";

// On Vercel serverless environment, local filesystem is read-only except /tmp
const defaultUrl = process.env.VERCEL 
  ? "file:/tmp/lembrete.db" 
  : "file:lembrete.db";

const url = process.env.TURSO_DATABASE_URL || defaultUrl;
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

export const db = createClient({
  url,
  ...(authToken ? { authToken } : {}),
});

let initialized = false;

export async function ensureDbInitialized() {
  if (initialized) return;
  
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS lembretes (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        conteudo TEXT NOT NULL,
        prioridade TEXT CHECK(prioridade IN ('baixa', 'media', 'alta')) NOT NULL DEFAULT 'baixa',
        data_limite TEXT,
        concluido INTEGER DEFAULT 0,
        categoria TEXT DEFAULT 'Geral',
        cor_postit TEXT DEFAULT 'yellow',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);
    initialized = true;
  } catch (error) {
    console.error("Aviso ao inicializar tabela lembretes no Turso DB:", error);
  }
}
