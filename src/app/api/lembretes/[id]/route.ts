import { NextResponse } from "next/server";
import { db, ensureDbInitialized } from "@/lib/db";
import { Prioridade, CorPostit } from "@/types/lembrete";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDbInitialized();
    const { id } = await params;
    const body = await request.json();

    const existing = await db.execute({
      sql: "SELECT * FROM lembretes WHERE id = ?",
      args: [id],
    });

    if (existing.rows.length === 0) {
      return NextResponse.json(
        { error: "Lembrete não encontrado" },
        { status: 404 }
      );
    }

    const current = existing.rows[0];

    const titulo = body.titulo !== undefined ? String(body.titulo).trim() : String(current.titulo);
    const conteudo = body.conteudo !== undefined ? String(body.conteudo).trim() : String(current.conteudo);
    const prioridade: Prioridade = body.prioridade && ['baixa', 'media', 'alta'].includes(body.prioridade)
      ? body.prioridade
      : (current.prioridade as Prioridade);
    const data_limite = body.data_limite !== undefined ? (body.data_limite ? String(body.data_limite) : null) : (current.data_limite ? String(current.data_limite) : null);
    const concluido = body.concluido !== undefined ? (body.concluido ? 1 : 0) : Number(current.concluido);
    const categoria = body.categoria !== undefined ? String(body.categoria).trim() : String(current.categoria || 'Geral');
    const cor_postit: CorPostit = body.cor_postit !== undefined ? body.cor_postit : (current.cor_postit as CorPostit || 'yellow');
    const updated_at = new Date().toISOString();

    await db.execute({
      sql: `UPDATE lembretes 
            SET titulo = ?, conteudo = ?, prioridade = ?, data_limite = ?, concluido = ?, categoria = ?, cor_postit = ?, updated_at = ?
            WHERE id = ?`,
      args: [titulo, conteudo, prioridade, data_limite, concluido, categoria, cor_postit, updated_at, id],
    });

    const updatedLembrete = {
      id,
      titulo,
      conteudo,
      prioridade,
      data_limite,
      concluido: Boolean(concluido),
      categoria,
      cor_postit,
      created_at: String(current.created_at),
      updated_at,
    };

    return NextResponse.json(updatedLembrete);
  } catch (error: any) {
    console.error("Erro no PATCH /api/lembretes/[id]:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar lembrete", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDbInitialized();
    const { id } = await params;

    const existing = await db.execute({
      sql: "SELECT id FROM lembretes WHERE id = ?",
      args: [id],
    });

    if (existing.rows.length === 0) {
      return NextResponse.json(
        { error: "Lembrete não encontrado" },
        { status: 404 }
      );
    }

    await db.execute({
      sql: "DELETE FROM lembretes WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Erro no DELETE /api/lembretes/[id]:", error);
    return NextResponse.json(
      { error: "Falha ao excluir lembrete", details: error.message },
      { status: 500 }
    );
  }
}
