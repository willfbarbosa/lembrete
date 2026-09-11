export type Prioridade = 'baixa' | 'media' | 'alta';
export type CorPostit = 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange';

export interface Lembrete {
  id: string;
  titulo: string;
  conteudo: string;
  prioridade: Prioridade;
  data_limite: string | null;
  concluido: boolean;
  categoria: string;
  cor_postit: CorPostit;
  created_at: string;
  updated_at: string;
}

export interface CreateLembreteInput {
  titulo: string;
  conteudo: string;
  prioridade: Prioridade;
  data_limite?: string | null;
  categoria?: string;
  cor_postit?: CorPostit;
}

export interface UpdateLembreteInput {
  titulo?: string;
  conteudo?: string;
  prioridade?: Prioridade;
  data_limite?: string | null;
  concluido?: boolean;
  categoria?: string;
  cor_postit?: CorPostit;
}
