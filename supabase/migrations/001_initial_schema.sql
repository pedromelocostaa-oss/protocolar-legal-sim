-- ============================================================
-- e-Proc Simulador Educacional — Schema inicial
-- Faculdade Milton Campos / Grupo Anima Educação
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Profiles (extends auth.users) ────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  cpf           VARCHAR(14) UNIQUE NOT NULL,
  nome_completo TEXT NOT NULL,
  matricula     TEXT,
  turma_id      UUID,
  perfil        TEXT NOT NULL DEFAULT 'aluno'
                  CHECK (perfil IN ('aluno', 'professor', 'admin')),
  oab_simulado  TEXT,
  primeiro_acesso BOOLEAN NOT NULL DEFAULT TRUE,
  ativo         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Turmas ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.turmas (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome         TEXT NOT NULL,
  professor_id UUID NOT NULL REFERENCES public.profiles(id),
  semestre     TEXT,
  ano          INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles
  ADD CONSTRAINT fk_turma FOREIGN KEY (turma_id) REFERENCES public.turmas(id);

-- ── Tarefas ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tarefas (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo                   TEXT NOT NULL,
  descricao                TEXT,
  turma_id                 UUID NOT NULL REFERENCES public.turmas(id),
  professor_id             UUID NOT NULL REFERENCES public.profiles(id),
  data_inicio              TIMESTAMPTZ,
  prazo                    TIMESTAMPTZ,
  documentos_obrigatorios  JSONB DEFAULT '[]'::jsonb,
  ativa                    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Processos ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.processos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_processo   TEXT UNIQUE NOT NULL,
  aluno_id          UUID NOT NULL REFERENCES public.profiles(id),
  tarefa_id         UUID REFERENCES public.tarefas(id),
  classe_processual TEXT NOT NULL,
  assunto           TEXT NOT NULL,
  valor_causa       DECIMAL(14,2),
  vara              TEXT NOT NULL,
  segredo_justica   BOOLEAN NOT NULL DEFAULT FALSE,
  prioridade        TEXT,
  status            TEXT NOT NULL DEFAULT 'em_andamento'
                      CHECK (status IN ('em_andamento','aguardando_resposta','com_despacho','encerrado','devolvido')),
  nota              DECIMAL(4,2) CHECK (nota >= 0 AND nota <= 10),
  feedback_professor TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_processos_updated_at
  BEFORE UPDATE ON public.processos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Partes ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.partes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id     UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE,
  polo            TEXT NOT NULL CHECK (polo IN ('ativo', 'passivo')),
  tipo_pessoa     TEXT NOT NULL CHECK (tipo_pessoa IN ('fisica', 'juridica')),
  nome            TEXT NOT NULL,
  cpf_cnpj        TEXT,
  rg              TEXT,
  data_nascimento DATE,
  endereco        JSONB,
  email           TEXT,
  telefone        TEXT
);

-- ── Documentos ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.documentos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id   UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE,
  aluno_id      UUID NOT NULL REFERENCES public.profiles(id),
  tipo          TEXT NOT NULL,
  nome_arquivo  TEXT NOT NULL,
  storage_path  TEXT NOT NULL,
  tamanho_bytes INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Movimentações ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.movimentacoes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE,
  tipo        TEXT NOT NULL,
  descricao   TEXT NOT NULL,
  autor_id    UUID REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Intimações ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.intimacoes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id      UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE,
  destinatario_id  UUID NOT NULL REFERENCES public.profiles(id),
  remetente_id     UUID NOT NULL REFERENCES public.profiles(id),
  texto            TEXT NOT NULL,
  prazo_resposta   TIMESTAMPTZ,
  lida             BOOLEAN NOT NULL DEFAULT FALSE,
  data_ciencia     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turmas       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intimacoes   ENABLE ROW LEVEL SECURITY;

-- Profiles: users see own + professors see all
CREATE POLICY "profile_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.perfil IN ('professor','admin')
  ));
CREATE POLICY "profile_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profile_insert_admin" ON public.profiles
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.perfil IN ('professor','admin')
  ));

-- Tarefas: alunos see active tasks of their turma
CREATE POLICY "tarefas_aluno_read" ON public.tarefas
  FOR SELECT USING (
    ativa = TRUE AND EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.turma_id = turmas.id
    ) OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.perfil IN ('professor','admin')
    )
  );
CREATE POLICY "tarefas_professor_write" ON public.tarefas
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.perfil IN ('professor','admin'))
  );

-- Processos: alunos see own; professors see all
CREATE POLICY "processos_aluno" ON public.processos
  FOR ALL USING (
    aluno_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.perfil IN ('professor','admin')
    )
  );

-- Partes: same as processos
CREATE POLICY "partes_access" ON public.partes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.processos pr WHERE pr.id = processo_id AND (
      pr.aluno_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.perfil IN ('professor','admin')
      )
    ))
  );

-- Documentos: same as processos
CREATE POLICY "docs_access" ON public.documentos
  FOR ALL USING (
    aluno_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.perfil IN ('professor','admin')
    )
  );

-- Movimentações: all parties of process can read
CREATE POLICY "movs_read" ON public.movimentacoes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.processos pr WHERE pr.id = processo_id AND (
      pr.aluno_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.perfil IN ('professor','admin')
      )
    ))
  );
CREATE POLICY "movs_write" ON public.movimentacoes
  FOR INSERT WITH CHECK (autor_id = auth.uid());

-- Intimações: destinatário + professor
CREATE POLICY "intimacoes_read" ON public.intimacoes
  FOR SELECT USING (
    destinatario_id = auth.uid() OR remetente_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.perfil IN ('professor','admin')
    )
  );
CREATE POLICY "intimacoes_write" ON public.intimacoes
  FOR ALL USING (
    remetente_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.perfil IN ('professor','admin')
    )
  );
CREATE POLICY "intimacoes_update_destinatario" ON public.intimacoes
  FOR UPDATE USING (destinatario_id = auth.uid());

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_processos_aluno ON public.processos(aluno_id);
CREATE INDEX IF NOT EXISTS idx_processos_tarefa ON public.processos(tarefa_id);
CREATE INDEX IF NOT EXISTS idx_processos_numero ON public.processos(numero_processo);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_processo ON public.movimentacoes(processo_id);
CREATE INDEX IF NOT EXISTS idx_intimacoes_destinatario ON public.intimacoes(destinatario_id);
CREATE INDEX IF NOT EXISTS idx_intimacoes_lida ON public.intimacoes(destinatario_id, lida);

-- ── Storage bucket ────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos', 'documentos', FALSE, 10485760,
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;
