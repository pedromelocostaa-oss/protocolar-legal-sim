-- ============================================================
-- e-Proc Simulador Educacional — Seed de dados
-- Execute APÓS criar os usuários no Supabase Auth
-- ============================================================
-- Substitua os UUIDs abaixo pelos IDs gerados pelo Supabase Auth

-- ── 1. Crie os usuários no Auth primeiro (via Supabase Dashboard ou auth.admin.createUser)
-- Professora: 000.000.000-01@eproc.sim / Milton@2025
-- Alunos:     {cpf_digits}@eproc.sim   / Milton@2025

-- ── 2. Insira os profiles (substitua os UUIDs pelos reais do auth.users)

-- Professora
-- INSERT INTO public.profiles (id, cpf, nome_completo, perfil, primeiro_acesso, ativo)
-- VALUES ('PROF_UUID_AQUI', '000.000.000-01', 'Profa. Maria Helena Souza', 'professor', false, true);

-- ── Turmas
INSERT INTO public.turmas (nome, professor_id, semestre, ano)
SELECT 'Processo Civil I — 2025.1', id, '2025.1', 2025
FROM public.profiles WHERE cpf = '000.000.000-01' LIMIT 1;

INSERT INTO public.turmas (nome, professor_id, semestre, ano)
SELECT 'Processo Penal I — 2025.1', id, '2025.1', 2025
FROM public.profiles WHERE cpf = '000.000.000-01' LIMIT 1;

-- ── Alunos (atualizar turma_id após insert)
-- UPDATE public.profiles SET turma_id = (SELECT id FROM turmas WHERE nome = 'Processo Civil I — 2025.1')
-- WHERE cpf IN ('121.572.976-69', '234.567.890-12', '345.678.901-23');

-- ── Tarefas
INSERT INTO public.tarefas (titulo, descricao, turma_id, professor_id, data_inicio, prazo, documentos_obrigatorios)
SELECT
  'Petição Inicial — Responsabilidade Civil',
  '**Objetivo:** Elabore e protocole uma petição inicial de ação de responsabilidade civil por danos morais e materiais.

**Enunciado:** Seu cliente, João da Silva, foi vítima de um acidente de trânsito causado por negligência do réu Carlos Pereira. João sofreu danos materiais (R$ 8.000,00 no veículo) e danos morais. Redija e protocole a petição inicial no e-Proc.

**Documentos obrigatórios:** Petição inicial, procuração, boletim de ocorrência.',
  t.id,
  p.id,
  '2025-03-01',
  '2025-03-20 23:59:59',
  '["Petição Inicial", "Procuração", "Boletim de Ocorrência"]'::jsonb
FROM public.turmas t, public.profiles p
WHERE t.nome = 'Processo Civil I — 2025.1' AND p.cpf = '000.000.000-01';

INSERT INTO public.tarefas (titulo, descricao, turma_id, professor_id, data_inicio, prazo, documentos_obrigatorios)
SELECT
  'Mandado de Segurança — Direito Administrativo',
  '**Objetivo:** Elabore e protocole um mandado de segurança com pedido liminar.

**Enunciado:** Sua cliente Maria Costa foi preterida ilegalmente em concurso público. Protocole o mandado de segurança.',
  t.id,
  p.id,
  '2025-04-01',
  '2025-04-30 23:59:59',
  '["Petição Inicial", "Procuração", "Comprovante de Inscrição"]'::jsonb
FROM public.turmas t, public.profiles p
WHERE t.nome = 'Processo Civil I — 2025.1' AND p.cpf = '000.000.000-01';
