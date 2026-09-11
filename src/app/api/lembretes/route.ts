import { NextResponse } from "next/server";
import { db, ensureDbInitialized } from "@/lib/db";
import { Prioridade, CorPostit } from "@/types/lembrete";

export async function GET(request: Request) {
  try {
    await ensureDbInitialized();
    const { searchParams } = new URL(request.url);
    const prioridade = searchParams.get("prioridade");
    const concluido = searchParams.get("concluido");
    const search = searchParams.get("search");

    let query = "SELECT * FROM lembretes WHERE 1=1";
    const args: any[] = [];

    if (prioridade && ['baixa', 'media', 'alta'].includes(prioridade)) {
      query += " AND prioridade = ?";
      args.push(prioridade);
    }

    if (concluido !== null && concluido !== undefined) {
      if (concluido === "true" || concluido === "1") {
        query += " AND concluido = 1";
      } else if (concluido === "false" || concluido === "0") {
        query += " AND concluido = 0";
      }
    }

    if (search) {
      query += " AND (titulo LIKE ? OR conteudo LIKE ? OR categoria LIKE ?)";
      const searchPattern = `%${search}%`;
      args.push(searchPattern, searchPattern, searchPattern);
    }

    query += " ORDER BY concluido ASC, CASE prioridade WHEN 'alta' THEN 1 WHEN 'media' THEN 2 WHEN 'baixa' THEN 3 END ASC, datetime(created_at) DESC";

    const rs = await db.execute({ sql: query, args });

    const lembretes = rs.rows.map((row) => ({
      id: String(row.id),
      titulo: String(row.titulo),
      conteudo: String(row.conteudo),
      prioridade: row.prioridade as Prioridade,
      data_limite: row.data_limite ? String(row.data_limite) : null,
      concluido: Boolean(row.concluido),
      categoria: String(row.categoria || 'Geral'),
      cor_postit: (row.cor_postit || 'yellow') as CorPostit,
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    }));

    return NextResponse.json(lembretes);
  } catch (error: any) {
    console.error("Erro no GET /api/lembretes:", error);
    return NextResponse.json(
      { error: "Falha ao buscar lembretes", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureDbInitialized();
    const body = await request.json();

    const { titulo, conteudo, prioridade, data_limite, categoria, cor_postit } = body;

    if (!titulo || typeof titulo !== "string" || !titulo.trim()) {
      return NextResponse.json(
        { error: "O título do lembrete é obrigatório" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const prioridadeVal: Prioridade = ['baixa', 'media', 'alta'].includes(prioridade) ? prioridade : 'baixa';
    const categoriaVal = categoria?.trim() || 'Geral';
    const corPostitVal: CorPostit = cor_postit || 'yellow';
    const dataLimiteVal = data_limite ? data_limite : null;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO lembretes (id, titulo, conteudo, prioridade, data_limite, concluido, categoria, cor_postit, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
      args: [
        id,
        titulo.trim(),
        conteudo ? conteudo.trim() : "",
        prioridadeVal,
        dataLimiteVal,
        categoriaVal,
        corPostitVal,
        now,
        now,
      ],
    });

    const newLembrete = {
      id,
      titulo: titulo.trim(),
      conteudo: conteudo ? conteudo.trim() : "",
      prioridade: prioridadeVal,
      data_limite: dataLimiteVal,
      concluido: false,
      categoria: categoriaVal,
      cor_postit: corPostitVal,
      created_at: now,
      updated_at: now,
    };

    return NextResponse.json(newLembrete, { status: 201 });
  } catch (error: any) {
    console.error("Erro no POST /api/lembretes:", error);
    return NextResponse.json(
      { error: "Falha ao criar lembrete", details: error.message },
      { status: 500 }
    );
  }
}
