import type { Processo, Intimacao, Movimentacao, Parte, Documento, Tarefa, Turma } from '@/integrations/supabase/types';

// ---- Persistent demo store using localStorage ----

const KEYS = {
  processos: 'demo-processos',
  movimentacoes: 'demo-movimentacoes',
  intimacoes: 'demo-intimacoes',
  partes: 'demo-partes',
  documentos: 'demo-documentos',
  tarefas: 'demo-tarefas',
  turmas: 'demo-turmas',
};

function get<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function set<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- TURMAS ----------
export const demoTurmas: Turma[] = [
  { id: 'demo-turma-1', nome: 'Processo Civil I — 2025.1', professor_id: 'demo-prof-1', semestre: '2025.1', ano: 2025, created_at: '2025-02-01T00:00:00Z' },
  { id: 'demo-turma-2', nome: 'Processo Penal I — 2025.1', professor_id: 'demo-prof-1', semestre: '2025.1', ano: 2025, created_at: '2025-02-01T00:00:00Z' },
];

// ---------- TAREFAS ----------
const defaultTarefas: Tarefa[] = [
  {
    id: 'demo-tarefa-1',
    titulo: 'Petição Inicial — Responsabilidade Civil',
    descricao: `**Objetivo:** Elabore e protocole uma petição inicial de ação de responsabilidade civil por danos morais e materiais.\n\n**Enunciado:** Seu cliente, João da Silva, foi vítima de um acidente de trânsito causado por negligência do réu Carlos Pereira. João sofreu danos materiais (R$ 8.000,00 no veículo) e danos morais. Redija e protocole a petição inicial no e-Proc.\n\n**Documentos obrigatórios:** Petição inicial, procuração, boletim de ocorrência, orçamento de reparo.`,
    turma_id: 'demo-turma-1',
    professor_id: 'demo-prof-1',
    data_inicio: '2025-03-01T00:00:00Z',
    prazo: '2025-03-20T23:59:59Z',
    documentos_obrigatorios: ['Petição Inicial', 'Procuração', 'Documento de Identidade'],
    ativa: true,
    created_at: '2025-02-28T00:00:00Z',
  },
  {
    id: 'demo-tarefa-2',
    titulo: 'Mandado de Segurança — Direito Administrativo',
    descricao: `**Objetivo:** Elabore e protocole um mandado de segurança.\n\n**Enunciado:** Sua cliente Maria Costa foi preterida em concurso público por ato ilegal da autoridade coatora. Protocole o mandado de segurança com pedido liminar.`,
    turma_id: 'demo-turma-1',
    professor_id: 'demo-prof-1',
    data_inicio: '2025-04-01T00:00:00Z',
    prazo: '2025-04-30T23:59:59Z',
    documentos_obrigatorios: ['Petição Inicial', 'Procuração', 'Comprovante de Residência'],
    ativa: true,
    created_at: '2025-03-25T00:00:00Z',
  },
];

export function getDemoTarefas(): Tarefa[] {
  return get<Tarefa[]>(KEYS.tarefas, defaultTarefas);
}

export function saveDemoTarefa(tarefa: Tarefa) {
  const list = getDemoTarefas();
  const idx = list.findIndex(t => t.id === tarefa.id);
  if (idx >= 0) list[idx] = tarefa;
  else list.push(tarefa);
  set(KEYS.tarefas, list);
}

export function deleteDemoTarefa(id: string) {
  set(KEYS.tarefas, getDemoTarefas().filter(t => t.id !== id));
}

// ---------- PROCESSOS ----------
const defaultProcessos: Processo[] = [
  {
    id: 'demo-proc-1',
    numero_processo: '1000042-33.2025.4.01.3800',
    aluno_id: 'demo-aluno-1',
    tarefa_id: 'demo-tarefa-1',
    classe_processual: 'Procedimento Comum Cível',
    assunto: 'Responsabilidade Civil — Indenização por Dano Moral e Material',
    valor_causa: 18500,
    vara: '1ª Vara Federal de Belo Horizonte',
    segredo_justica: false,
    prioridade: null,
    status: 'com_despacho',
    nota: 8.5,
    feedback_professor: 'Boa petição! A causa de pedir está bem fundamentada. Atenção ao pedido de tutela antecipada — especifique melhor o periculum in mora. Nota: 8,5.',
    created_at: '2025-03-10T10:30:00Z',
    updated_at: '2025-03-12T14:00:00Z',
  },
];

export function getDemoProcessos(alunoId: string): Processo[] {
  return get<Processo[]>(KEYS.processos, defaultProcessos).filter(p => p.aluno_id === alunoId);
}

export function getAllDemoProcessos(): Processo[] {
  return get<Processo[]>(KEYS.processos, defaultProcessos);
}

export function saveDemoProcesso(processo: Processo) {
  const list = get<Processo[]>(KEYS.processos, defaultProcessos);
  const idx = list.findIndex(p => p.id === processo.id);
  if (idx >= 0) list[idx] = processo;
  else list.push(processo);
  set(KEYS.processos, list);
}

// ---------- PARTES ----------
const defaultPartes: Parte[] = [
  { id: 'demo-parte-1', processo_id: 'demo-proc-1', polo: 'ativo', tipo_pessoa: 'fisica', nome: 'João da Silva', cpf_cnpj: '111.222.333-44', rg: null, data_nascimento: null, endereco: { rua: 'Rua das Flores', numero: '100', bairro: 'Centro', cidade: 'Belo Horizonte', estado: 'MG', cep: '30100-000' }, email: 'joao@email.com', telefone: '(31) 99999-1234' },
  { id: 'demo-parte-2', processo_id: 'demo-proc-1', polo: 'passivo', tipo_pessoa: 'fisica', nome: 'Carlos Pereira', cpf_cnpj: '555.666.777-88', rg: null, data_nascimento: null, endereco: null, email: null, telefone: null },
];

export function getDemoPartes(processoId: string): Parte[] {
  return get<Parte[]>(KEYS.partes, defaultPartes).filter(p => p.processo_id === processoId);
}

export function saveDemoPartes(partes: Parte[]) {
  const all = get<Parte[]>(KEYS.partes, defaultPartes);
  partes.forEach(p => {
    const idx = all.findIndex(a => a.id === p.id);
    if (idx >= 0) all[idx] = p; else all.push(p);
  });
  set(KEYS.partes, all);
}

// ---------- MOVIMENTAÇÕES ----------
const defaultMovimentacoes: Movimentacao[] = [
  { id: 'demo-mov-1', processo_id: 'demo-proc-1', tipo: 'distribuicao', descricao: 'Petição inicial protocolada e distribuída à 1ª Vara Federal de Belo Horizonte', autor_id: 'demo-aluno-1', created_at: '2025-03-10T10:30:00Z' },
  { id: 'demo-mov-2', processo_id: 'demo-proc-1', tipo: 'despacho', descricao: 'Despacho da professora: Boa petição! A causa de pedir está bem fundamentada. Nota: 8,5', autor_id: 'demo-prof-1', created_at: '2025-03-12T14:00:00Z' },
];

export function getDemoMovimentacoes(processoId: string): Movimentacao[] {
  return get<Movimentacao[]>(KEYS.movimentacoes, defaultMovimentacoes)
    .filter(m => m.processo_id === processoId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function saveDemoMovimentacao(mov: Movimentacao) {
  const all = get<Movimentacao[]>(KEYS.movimentacoes, defaultMovimentacoes);
  all.push(mov);
  set(KEYS.movimentacoes, all);
}

// ---------- INTIMAÇÕES ----------
const defaultIntimacoesAluno: Intimacao[] = [
  {
    id: 'demo-intim-1',
    processo_id: 'demo-proc-1',
    destinatario_id: 'demo-aluno-1',
    remetente_id: 'demo-prof-1',
    texto: 'Processo nº 1000042-33.2025.4.01.3800 — Despacho da Juíza:\n\nExcelente trabalho na elaboração da petição inicial. A causa de pedir está bem estruturada e os pedidos são claros.\n\nSugestão de melhoria: na próxima petição, detalhe melhor o requisito do periculum in mora no pedido de tutela antecipada, citando a jurisprudência do STJ.\n\nNota atribuída: 8,5 (oito vírgula cinco).\n\nDr(a). Luiz Cordeiro, fique à vontade para protocolar eventual recurso.',
    prazo_resposta: '2025-03-19T23:59:59Z',
    lida: false,
    data_ciencia: null,
    created_at: '2025-03-12T14:00:00Z',
  },
];

export function getDemoIntimacoesAluno(alunoId: string): Intimacao[] {
  return get<Intimacao[]>(KEYS.intimacoes, defaultIntimacoesAluno)
    .filter(i => i.destinatario_id === alunoId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getDemoIntimacoesNaoLidas(alunoId: string): number {
  return getDemoIntimacoesAluno(alunoId).filter(i => !i.lida).length;
}

export function marcarIntimacoesLida(id: string) {
  const all = get<Intimacao[]>(KEYS.intimacoes, defaultIntimacoesAluno);
  const idx = all.findIndex(i => i.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], lida: true, data_ciencia: new Date().toISOString() };
    set(KEYS.intimacoes, all);
  }
}

export function saveDemoIntimacao(intim: Intimacao) {
  const all = get<Intimacao[]>(KEYS.intimacoes, defaultIntimacoesAluno);
  all.push(intim);
  set(KEYS.intimacoes, all);
}

// ---------- DOCUMENTOS ----------
export function getDemoDocumentos(processoId: string): Documento[] {
  return get<Documento[]>(KEYS.documentos, []).filter(d => d.processo_id === processoId);
}

export function saveDemoDocumento(doc: Documento) {
  const all = get<Documento[]>(KEYS.documentos, []);
  all.push(doc);
  set(KEYS.documentos, all);
}
