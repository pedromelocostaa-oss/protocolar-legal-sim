import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EprocLayout from '@/components/layout/EprocLayout';
import {
  classesProcessuais, prioridades, tiposDocumento,
  ritos, tiposAcaoJEF, niveisSigno, forosJFMG, entidadesFederais, arvoreAssuntos,
} from '@/data/classesAssuntos';
import type { AssuntoCNJ, NodoAssunto, EntidadeFederal } from '@/data/classesAssuntos';
import { sortearVara } from '@/data/varas';
import { formatCpfCnpj, formatPhone, formatCep, formatCurrency, parseCurrency } from '@/lib/masks';
import { generateProcessNumber } from '@/lib/cnj';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import { saveDemoProcesso, saveDemoPartes, saveDemoMovimentacao, getDemoTarefas } from '@/data/demoStore';
import { CheckCircle, Upload, X, Plus, Trash2, ChevronDown, ChevronRight, Search, Loader2, ChevronUp } from 'lucide-react';
import type { Tarefa } from '@/integrations/supabase/types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Parte {
  polo: 'ativo' | 'passivo';
  tipo_pessoa: 'fisica' | 'juridica';
  nome: string;
  cpf_cnpj: string;
  rg: string;
  data_nascimento: string;
  email: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface DocumentoForm {
  tipo: string;
  arquivo: File | null;
  nomeArquivo: string;
  sigilo: string;
  collapsed: boolean;
}

interface InfoAdicionais {
  tutelaUrgencia: boolean;
  gratuidadeJustica: boolean;
  pedidoUrgente: boolean;
  beneficiarioJG: boolean;
  plenarioVirtual: boolean;
  liminarMS: boolean;
  antecipacaoTutela: boolean;
  medidaCautelar: boolean;
}

interface FormData {
  // Step 1 — Informações do processo
  foro: string;
  rito: string;
  classe: string;
  tipoAcaoJEF: string;
  valorCausa: string;
  renunciaExcedente: boolean;
  nivelSigilo: string;
  processoOriginario: string;
  juizo: string;
  outrosAdvogados: string;
  prioridade: string;
  tarefaId: string;
  // Step 2 — Assuntos
  assuntos: AssuntoCNJ[];
  // Step 3 — Partes autoras
  partesAutoras: Parte[];
  // Step 4 — Partes rés
  partesReus: Parte[];
  // Step 5 — Documentos
  documentos: DocumentoForm[];
  infoAdicionais: InfoAdicionais;
  // Resultado
  numeroProcesso: string;
  varaProtocolo: string;
  dataProtocolo: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STEP_NAMES = [
  'Informações do processo',
  'Assuntos',
  'Partes Autoras',
  'Partes Rés',
  'Documentos',
  'Confirmar Ajuizamento',
];

const INFO_ADICIONAIS_LABELS: Record<keyof InfoAdicionais, string> = {
  tutelaUrgencia:    'Pedido de tutela de urgência ou cautelar (art. 300, CPC)',
  gratuidadeJustica: 'Requerimento de gratuidade da justiça (art. 98, CPC)',
  pedidoUrgente:     'Processo urgente — prioridade de tramitação',
  beneficiarioJG:    'Autor é beneficiário da gratuidade da justiça',
  plenarioVirtual:   'Plenário virtual (TRF-1)',
  liminarMS:         'Liminar em Mandado de Segurança',
  antecipacaoTutela: 'Antecipação de tutela (art. 294, CPC)',
  medidaCautelar:    'Medida cautelar',
};

// Mock CPF lookup (demo) — real system would call Receita Federal
const CPF_MOCK_DB: Record<string, { nome: string; dataNasc: string }> = {
  '121.572.976-69': { nome: 'Luiz Cordeiro',             dataNasc: '1985-03-15' },
  '000.000.001-91': { nome: 'Maria da Silva Santos',      dataNasc: '1972-07-22' },
  '111.222.333-44': { nome: 'João Carlos Oliveira',       dataNasc: '1990-11-08' },
  '123.456.789-09': { nome: 'Ana Paula Ferreira',         dataNasc: '1995-05-30' },
  '987.654.321-00': { nome: 'Carlos Eduardo Nascimento',  dataNasc: '1968-12-01' },
};

const emptyParte = (polo: 'ativo' | 'passivo'): Parte => ({
  polo,
  tipo_pessoa: polo === 'ativo' ? 'fisica' : 'juridica',
  nome: '', cpf_cnpj: '', rg: '', data_nascimento: '',
  email: '', telefone: '', cep: '',
  logradouro: '', numero: '', bairro: '', cidade: '', estado: 'MG',
});

const emptyDocumento = (tipo = 'Certidão'): DocumentoForm => ({
  tipo, arquivo: null, nomeArquivo: '', sigilo: 'publico', collapsed: false,
});

const emptyInfoAdicionais = (): InfoAdicionais => ({
  tutelaUrgencia: false, gratuidadeJustica: false, pedidoUrgente: false,
  beneficiarioJG: false, plenarioVirtual: false, liminarMS: false,
  antecipacaoTutela: false, medidaCautelar: false,
});

const initialForm = (tarefaId: string): FormData => ({
  foro: 'SJMG-BH', rito: '', classe: '', tipoAcaoJEF: '',
  valorCausa: '', renunciaExcedente: false, nivelSigilo: 'publico',
  processoOriginario: '', juizo: '', outrosAdvogados: '',
  prioridade: '', tarefaId,
  assuntos: [],
  partesAutoras: [],
  partesReus: [],
  documentos: [{ tipo: 'Petição Inicial', arquivo: null, nomeArquivo: '', sigilo: 'publico', collapsed: false }],
  infoAdicionais: emptyInfoAdicionais(),
  numeroProcesso: '', varaProtocolo: '', dataProtocolo: '',
});

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Recursive tree node for Step 2 */
function AssuntoNode({
  node, level, selected, onToggle,
}: {
  node: NodoAssunto;
  level: number;
  selected: AssuntoCNJ[];
  onToggle: (a: AssuntoCNJ) => void;
}) {
  const [expanded, setExpanded] = useState(level < 1);
  const isLeaf = !node.subitens || node.subitens.length === 0;
  const isSelected = isLeaf && selected.some(s => s.codigo === node.codigo);
  const pl = level * 18 + 8;

  if (isLeaf) {
    return (
      <div
        onClick={() => onToggle({ codigo: node.codigo, descricao: node.descricao, area: node.area })}
        style={{
          paddingLeft: pl, paddingTop: 5, paddingBottom: 5, paddingRight: 8,
          cursor: 'pointer', fontSize: 12, borderBottom: '1px solid #f3f4f6',
          background: isSelected ? '#dbeafe' : 'transparent',
          color: isSelected ? '#1e40af' : '#374151',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <span style={{ width: 14, fontWeight: 700, color: isSelected ? '#1e40af' : '#9ca3af' }}>
          {isSelected ? '✓' : '○'}
        </span>
        <span>{node.descricao}</span>
        <span style={{ marginLeft: 'auto', color: '#9ca3af', fontSize: 11 }}>({node.codigo})</span>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          paddingLeft: pl, paddingTop: 6, paddingBottom: 6, paddingRight: 8,
          cursor: 'pointer', fontWeight: 600, fontSize: 12,
          background: level === 0 ? '#f1f5f9' : '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex', alignItems: 'center', gap: 4,
          color: '#1e3a5f',
        }}
      >
        {expanded
          ? <ChevronDown size={13} style={{ flexShrink: 0 }} />
          : <ChevronRight size={13} style={{ flexShrink: 0 }} />}
        {node.descricao}
      </div>
      {expanded && node.subitens?.map(sub => (
        <AssuntoNode key={sub.codigo} node={sub} level={level + 1} selected={selected} onToggle={onToggle} />
      ))}
    </div>
  );
}

/** Step panel wrapper */
function StepPanel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #d1d5db' }}>
      {children}
    </div>
  );
}

/** Summary row for Step 6 */
function SumRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr>
      <td style={{ padding: '5px 10px', fontWeight: 600, fontSize: 12, width: 200, background: '#f9fafb', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
        {label}
      </td>
      <td style={{ padding: '5px 10px', fontSize: 12, color: '#374151' }}>{value}</td>
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PeticaoInicialPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>(() => initialForm(searchParams.get('tarefa') ?? ''));

  // ── Step 3: Partes Autoras draft & CPF lookup ──
  const [draftAutora, setDraftAutora] = useState<Parte>(emptyParte('ativo'));
  const [cpfBuscaEstado, setCpfBuscaEstado] = useState<'idle' | 'carregando' | 'encontrado' | 'nao_encontrado'>('idle');

  // ── Step 4: Partes Réus draft & autocomplete ──
  const [reuSearch, setReuSearch] = useState('');
  const [reuSugestoes, setReuSugestoes] = useState<EntidadeFederal[]>([]);
  const [draftReu, setDraftReu] = useState<Parte>(emptyParte('passivo'));
  const [showReuSugestoes, setShowReuSugestoes] = useState(false);

  // ── Step 2: assuntos search ──
  const [assuntoSearch, setAssuntoSearch] = useState('');

  useEffect(() => {
    if (form.tarefaId && DEMO_MODE) {
      const t = getDemoTarefas().find(t => t.id === form.tarefaId);
      if (t) setTarefa(t);
    }
  }, [form.tarefaId]);

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });

  // ── Form helpers ──
  const update = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const resetForm = () => {
    setForm(initialForm(searchParams.get('tarefa') ?? ''));
    setStep(1);
    setErrors({});
    setDraftAutora(emptyParte('ativo'));
    setCpfBuscaEstado('idle');
    setReuSearch('');
    setDraftReu(emptyParte('passivo'));
    scrollTop();
  };

  // ── CPF Lookup (Step 3) ──
  const buscarCpf = () => {
    const cpf = draftAutora.cpf_cnpj;
    if (!cpf || cpf.length < 11) return;
    setCpfBuscaEstado('carregando');
    setTimeout(() => {
      const found = CPF_MOCK_DB[cpf];
      if (found) {
        setDraftAutora(d => ({ ...d, nome: found.nome, data_nascimento: found.dataNasc }));
        setCpfBuscaEstado('encontrado');
      } else {
        setCpfBuscaEstado('nao_encontrado');
      }
    }, 800);
  };

  const incluirAutora = () => {
    if (!draftAutora.nome.trim() || !draftAutora.cpf_cnpj.trim()) {
      setErrors(e => ({ ...e, autora: 'Preencha nome e CPF/CNPJ antes de incluir.' }));
      return;
    }
    setErrors(e => { const n = { ...e }; delete n.autora; return n; });
    setForm(f => ({ ...f, partesAutoras: [...f.partesAutoras, { ...draftAutora }] }));
    setDraftAutora(emptyParte('ativo'));
    setCpfBuscaEstado('idle');
  };

  const removerAutora = (idx: number) =>
    setForm(f => ({ ...f, partesAutoras: f.partesAutoras.filter((_, i) => i !== idx) }));

  // ── Réu autocomplete (Step 4) ──
  const handleReuSearchChange = (val: string) => {
    setReuSearch(val);
    setDraftReu(d => ({ ...d, nome: val }));
    if (val.length >= 2) {
      const q = val.toLowerCase();
      setReuSugestoes(entidadesFederais.filter(e =>
        e.nome.toLowerCase().includes(q) || e.cnpj.includes(q)
      ).slice(0, 8));
      setShowReuSugestoes(true);
    } else {
      setReuSugestoes([]);
      setShowReuSugestoes(false);
    }
  };

  const selecionarEntidade = (e: EntidadeFederal) => {
    setDraftReu(d => ({ ...d, nome: e.nome, cpf_cnpj: e.cnpj, tipo_pessoa: 'juridica' }));
    setReuSearch(e.nome);
    setShowReuSugestoes(false);
  };

  const incluirReu = () => {
    if (!draftReu.nome.trim()) {
      setErrors(e => ({ ...e, reu: 'Preencha a denominação da parte ré antes de incluir.' }));
      return;
    }
    setErrors(e => { const n = { ...e }; delete n.reu; return n; });
    setForm(f => ({ ...f, partesReus: [...f.partesReus, { ...draftReu }] }));
    setDraftReu(emptyParte('passivo'));
    setReuSearch('');
    setShowReuSugestoes(false);
  };

  const removerReu = (idx: number) =>
    setForm(f => ({ ...f, partesReus: f.partesReus.filter((_, i) => i !== idx) }));

  // ── Assuntos (Step 2) ──
  const toggleAssunto = (a: AssuntoCNJ) => {
    setForm(f => {
      const exists = f.assuntos.some(s => s.codigo === a.codigo);
      return {
        ...f,
        assuntos: exists
          ? f.assuntos.filter(s => s.codigo !== a.codigo)
          : [...f.assuntos, a],
      };
    });
  };

  // Flat list of all leaf nodes for search
  function flattenLeaves(nodes: NodoAssunto[]): NodoAssunto[] {
    return nodes.flatMap(n =>
      n.subitens ? flattenLeaves(n.subitens) : [n]
    );
  }
  const allLeaves = flattenLeaves(arvoreAssuntos);
  const filteredLeaves = assuntoSearch.length >= 2
    ? allLeaves.filter(n =>
        n.descricao.toLowerCase().includes(assuntoSearch.toLowerCase()) ||
        n.codigo.includes(assuntoSearch)
      )
    : null;

  // ── Documentos (Step 5) ──
  const updateDoc = (idx: number, key: keyof DocumentoForm, val: unknown) =>
    setForm(f => {
      const docs = [...f.documentos];
      docs[idx] = { ...docs[idx], [key]: val };
      return { ...f, documentos: docs };
    });

  const addDoc = () => {
    if (form.documentos.length >= 10) return;
    setForm(f => ({ ...f, documentos: [...f.documentos, emptyDocumento()] }));
  };

  const removeDoc = (idx: number) => {
    if (idx === 0) return;
    setForm(f => ({ ...f, documentos: f.documentos.filter((_, i) => i !== idx) }));
  };

  const toggleInfoAdic = (key: keyof InfoAdicionais) =>
    setForm(f => ({ ...f, infoAdicionais: { ...f.infoAdicionais, [key]: !f.infoAdicionais[key] } }));

  const buscarCep = async (cep: string, setFn: (key: keyof Parte, val: string) => void) => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setFn('logradouro', data.logradouro ?? '');
        setFn('bairro', data.bairro ?? '');
        setFn('cidade', data.localidade ?? '');
        setFn('estado', data.uf ?? 'MG');
      }
    } catch { /* ignore */ }
  };

  // ── Validation ──
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!form.foro)       errs.foro    = 'Selecione o foro.';
      if (!form.rito)       errs.rito    = 'Selecione o rito/procedimento.';
      if (!form.classe)     errs.classe  = 'Selecione a classe processual.';
      if (!form.valorCausa) errs.valorCausa = 'Informe o valor da causa.';
    }
    if (step === 2) {
      if (form.assuntos.length === 0) errs.assuntos = 'Selecione ao menos um assunto.';
    }
    if (step === 3) {
      if (form.partesAutoras.length === 0) errs.autora = 'Inclua ao menos uma parte autora.';
    }
    if (step === 4) {
      if (form.partesReus.length === 0) errs.reu = 'Inclua ao menos uma parte ré.';
    }
    if (step === 5) {
      if (!form.documentos[0].nomeArquivo) errs.peticao_inicial = 'A petição inicial é obrigatória.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep(s => s + 1);
    scrollTop();
  };

  const back = () => {
    setStep(s => s - 1);
    scrollTop();
  };

  // ── Protocolar ──────────────────────────────────────────────────────────────
  const protocolar = async () => {
    setLoading(true);
    try {
      const vara = sortearVara();
      const numeroProcesso = generateProcessNumber(vara.codigo);
      const dataProtocolo = new Date().toISOString();
      const processoId = crypto.randomUUID();

      // Merge partes for storage
      const todasPartes = [...form.partesAutoras, ...form.partesReus];
      const assuntoPrincipal = form.assuntos[0]?.descricao ?? '';

      if (DEMO_MODE) {
        saveDemoProcesso({
          id: processoId,
          numero_processo: numeroProcesso,
          aluno_id: user!.id,
          tarefa_id: form.tarefaId || null,
          classe_processual: form.classe,
          assunto: assuntoPrincipal,
          valor_causa: parseCurrency(form.valorCausa),
          vara: vara.nome,
          segredo_justica: form.nivelSigilo !== 'publico',
          prioridade: form.prioridade || null,
          status: 'em_andamento',
          nota: null,
          feedback_professor: null,
          created_at: dataProtocolo,
          updated_at: dataProtocolo,
        });

        saveDemoPartes(todasPartes.map(p => ({
          id: crypto.randomUUID(),
          processo_id: processoId,
          polo: p.polo,
          tipo_pessoa: p.tipo_pessoa,
          nome: p.nome,
          cpf_cnpj: p.cpf_cnpj || null,
          rg: p.rg || null,
          data_nascimento: p.data_nascimento || null,
          endereco: { logradouro: p.logradouro, numero: p.numero, bairro: p.bairro, cidade: p.cidade, estado: p.estado, cep: p.cep },
          email: p.email || null,
          telefone: p.telefone || null,
        })));

        saveDemoMovimentacao({
          id: crypto.randomUUID(),
          processo_id: processoId,
          tipo: 'distribuicao',
          descricao: `Petição inicial protocolada e distribuída automaticamente à ${vara.nome}. Número: ${numeroProcesso}`,
          autor_id: user!.id,
          created_at: dataProtocolo,
        });

      } else {
        await supabase!.from('processos').insert({
          id: processoId,
          numero_processo: numeroProcesso,
          aluno_id: user!.id,
          tarefa_id: form.tarefaId || null,
          classe_processual: form.classe,
          assunto: assuntoPrincipal,
          valor_causa: parseCurrency(form.valorCausa),
          vara: vara.nome,
          segredo_justica: form.nivelSigilo !== 'publico',
          prioridade: form.prioridade || null,
          status: 'em_andamento',
        });

        await supabase!.from('partes').insert(
          todasPartes.map(p => ({
            processo_id: processoId,
            polo: p.polo,
            tipo_pessoa: p.tipo_pessoa,
            nome: p.nome,
            cpf_cnpj: p.cpf_cnpj || null,
            rg: p.rg || null,
            data_nascimento: p.data_nascimento || null,
            endereco: { logradouro: p.logradouro, numero: p.numero, bairro: p.bairro, cidade: p.cidade, estado: p.estado, cep: p.cep },
            email: p.email || null,
            telefone: p.telefone || null,
          }))
        );

        await supabase!.from('movimentacoes').insert({
          processo_id: processoId,
          tipo: 'distribuicao',
          descricao: `Petição inicial protocolada e distribuída à ${vara.nome}`,
          autor_id: user!.id,
        });

        for (const doc of form.documentos) {
          if (!doc.arquivo) continue;
          const path = `processos/${processoId}/${doc.tipo}/${doc.arquivo.name}`;
          await supabase!.storage.from('documentos').upload(path, doc.arquivo, { upsert: true });
          await supabase!.from('documentos').insert({
            processo_id: processoId,
            aluno_id: user!.id,
            tipo: doc.tipo,
            nome_arquivo: doc.arquivo.name,
            storage_path: path,
            tamanho_bytes: doc.arquivo.size,
          });
        }
      }

      update('numeroProcesso', numeroProcesso);
      update('varaProtocolo', vara.nome);
      update('dataProtocolo', dataProtocolo);
      setStep(7);
      scrollTop();
    } catch (err) {
      console.error(err);
      alert('Erro ao protocolar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Render helpers
  // ─────────────────────────────────────────────────────────────────────────────

  const isReceipt = step === 7;
  const isConfirm = step === 6;

  const TOOLBAR_BTN: React.CSSProperties = {
    height: 28, padding: '0 12px', fontSize: 12, fontWeight: 600, border: '1px solid #a0a0a0',
    borderRadius: 2, cursor: 'pointer', background: '#e8e8e8', color: '#1a1a1a',
    display: 'inline-flex', alignItems: 'center', gap: 4,
  };
  const TOOLBAR_BTN_DISABLED: React.CSSProperties = { ...TOOLBAR_BTN, opacity: 0.45, cursor: 'default' };

  const FORM_ROW: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: '200px 1fr', gap: 0,
    borderBottom: '1px solid #e5e7eb', alignItems: 'center', minHeight: 36,
  };
  const FORM_LABEL_TD: React.CSSProperties = {
    padding: '6px 10px', fontSize: 12, fontWeight: 600, color: '#374151',
    background: '#f9fafb', borderRight: '1px solid #e5e7eb', alignSelf: 'stretch',
    display: 'flex', alignItems: 'center',
  };
  const FORM_INPUT_TD: React.CSSProperties = {
    padding: '4px 8px',
  };

  const SECT_HEADER: React.CSSProperties = {
    background: 'hsl(210,100%,20%)', color: '#fff',
    padding: '5px 10px', fontSize: 12, fontWeight: 700, letterSpacing: '0.03em',
  };

  const fieldCls = (err?: string) =>
    `form-field${err ? ' form-field-error' : ''}`;

  return (
    <EprocLayout>
      <div ref={topRef} style={{ minHeight: '100vh', background: '#f4f6f9' }}>

        {/* ── Page title ── */}
        {!isReceipt && (
          <div style={{
            background: 'hsl(210,100%,20%)', color: '#fff',
            padding: '8px 16px', fontSize: 13, fontWeight: 700,
            borderBottom: '2px solid hsl(210,100%,30%)',
          }}>
            {isConfirm
              ? 'Peticionamento Eletrônico — Confirmar Ajuizamento'
              : `Peticionamento Eletrônico (${step} de 5) — ${STEP_NAMES[step - 1]}`}
          </div>
        )}

        {/* ── Toolbar ── */}
        {!isReceipt && (
          <div style={{
            background: '#dde3ea', borderBottom: '1px solid #b0b8c4',
            padding: '6px 16px', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap',
          }}>
            <button style={TOOLBAR_BTN} onClick={() => navigate('/meus-processos')}>
              Consultar
            </button>
            <button style={TOOLBAR_BTN} onClick={resetForm}>
              Novo
            </button>
            <div style={{ width: 1, height: 22, background: '#b0b8c4', margin: '0 4px' }} />
            <button
              style={step <= 1 ? TOOLBAR_BTN_DISABLED : TOOLBAR_BTN}
              onClick={step > 1 ? back : undefined}
              disabled={step <= 1}
            >
              ◀ Anterior
            </button>
            {step < 6 && (
              <button style={TOOLBAR_BTN} onClick={next}>
                Próxima ▶
              </button>
            )}
            {step === 6 && (
              <button
                style={{ ...TOOLBAR_BTN, background: '#1e40af', color: '#fff', borderColor: '#1e3a8a' }}
                onClick={protocolar}
                disabled={loading}
              >
                {loading ? <><Loader2 size={12} className="animate-spin" /> Protocolando...</> : '⚖ Confirmar Ajuizamento'}
              </button>
            )}
            <div style={{ width: 1, height: 22, background: '#b0b8c4', margin: '0 4px' }} />
            <button style={TOOLBAR_BTN} onClick={() => navigate('/dashboard')}>
              Cancelar
            </button>
          </div>
        )}

        {/* ── Breadcrumb ── */}
        {!isReceipt && !isConfirm && (
          <div style={{
            background: '#fff', borderBottom: '1px solid #e5e7eb',
            padding: '6px 16px', fontSize: 11, display: 'flex', gap: 4, flexWrap: 'wrap',
          }}>
            {STEP_NAMES.slice(0, 5).map((name, i) => {
              const sNum = i + 1;
              const active = sNum === step;
              const done = sNum < step;
              return (
                <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {i > 0 && <span style={{ color: '#9ca3af' }}>&gt;&gt;</span>}
                  <span style={{
                    fontWeight: active ? 700 : done ? 600 : 400,
                    color: active ? 'hsl(210,100%,20%)' : done ? '#16a34a' : '#6b7280',
                    textDecoration: done ? 'none' : undefined,
                  }}>
                    {done && '✓ '}{name}
                  </span>
                </span>
              );
            })}
          </div>
        )}

        {/* ── Tarefa alert ── */}
        {tarefa && !isReceipt && (
          <div style={{
            margin: '12px 16px 0', padding: '8px 12px',
            background: '#eff6ff', border: '1px solid #bfdbfe',
            fontSize: 12, color: '#1e40af', borderRadius: 4,
          }}>
            <strong>Tarefa vinculada:</strong> {tarefa.titulo}
            {tarefa.prazo && (
              <span style={{ marginLeft: 8 }}>
                · Prazo: {new Date(tarefa.prazo).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP 1 — Informações do processo
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div style={{ margin: 16 }}>
            <StepPanel>
              {/* Seção: Identificação */}
              <div style={SECT_HEADER}>Identificação do Processo</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={FORM_ROW}>
                    <td style={FORM_LABEL_TD}>Foro / Seção Judiciária *</td>
                    <td style={FORM_INPUT_TD}>
                      <select
                        className={fieldCls(errors.foro)}
                        value={form.foro}
                        onChange={e => update('foro', e.target.value)}
                        style={{ maxWidth: 520 }}
                      >
                        <option value="">-- Selecione --</option>
                        {forosJFMG.map(f => (
                          <option key={f.codigo} value={f.codigo}>{f.descricao}</option>
                        ))}
                      </select>
                      {errors.foro && <div className="form-error">{errors.foro}</div>}
                    </td>
                  </tr>
                  <tr style={FORM_ROW}>
                    <td style={FORM_LABEL_TD}>Rito / Procedimento *</td>
                    <td style={FORM_INPUT_TD}>
                      <select
                        className={fieldCls(errors.rito)}
                        value={form.rito}
                        onChange={e => update('rito', e.target.value)}
                        style={{ maxWidth: 480 }}
                      >
                        <option value="">-- Selecione --</option>
                        {ritos.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      {errors.rito && <div className="form-error">{errors.rito}</div>}
                    </td>
                  </tr>
                  {form.rito.includes('JEF') && (
                    <tr style={FORM_ROW}>
                      <td style={FORM_LABEL_TD}>Tipo de Ação (JEF)</td>
                      <td style={FORM_INPUT_TD}>
                        <select
                          className="form-field"
                          value={form.tipoAcaoJEF}
                          onChange={e => update('tipoAcaoJEF', e.target.value)}
                          style={{ maxWidth: 480 }}
                        >
                          <option value="">-- Selecione --</option>
                          {tiposAcaoJEF.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </td>
                    </tr>
                  )}
                  <tr style={FORM_ROW}>
                    <td style={FORM_LABEL_TD}>Classe Processual *</td>
                    <td style={FORM_INPUT_TD}>
                      <select
                        className={fieldCls(errors.classe)}
                        value={form.classe}
                        onChange={e => update('classe', e.target.value)}
                        style={{ maxWidth: 520 }}
                      >
                        <option value="">-- Selecione --</option>
                        {classesProcessuais.map(c => (
                          <option key={c.codigo} value={c.descricao}>
                            [{c.grupo}] {c.descricao} (cód. {c.codigo})
                          </option>
                        ))}
                      </select>
                      {errors.classe && <div className="form-error">{errors.classe}</div>}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Seção: Valor e características */}
              <div style={SECT_HEADER}>Valor da Causa e Características</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={FORM_ROW}>
                    <td style={FORM_LABEL_TD}>Valor da Causa (R$) *</td>
                    <td style={FORM_INPUT_TD}>
                      <input
                        type="text"
                        className={fieldCls(errors.valorCausa)}
                        value={form.valorCausa}
                        onChange={e => update('valorCausa', formatCurrency(e.target.value))}
                        placeholder="0,00"
                        style={{ maxWidth: 200 }}
                      />
                      {errors.valorCausa && <div className="form-error">{errors.valorCausa}</div>}
                      {form.rito.includes('JEF') && (
                        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>
                          Limite JEF: 60 salários mínimos (R$ {(60 * 1412).toLocaleString('pt-BR')},00)
                        </div>
                      )}
                    </td>
                  </tr>

                  {form.rito.includes('JEF') && (
                    <tr style={FORM_ROW}>
                      <td style={FORM_LABEL_TD}>Renúncia ao excedente</td>
                      <td style={FORM_INPUT_TD}>
                        <label className="pje-checkbox">
                          <input
                            type="checkbox"
                            checked={form.renunciaExcedente}
                            onChange={e => update('renunciaExcedente', e.target.checked)}
                          />
                          <span style={{ fontSize: 12 }}>
                            Declaro que renuncio ao valor que exceder 60 salários mínimos
                            para fins de fixação da competência do JEF (art. 3º, §3º, Lei 10.259/2001)
                          </span>
                        </label>
                      </td>
                    </tr>
                  )}

                  <tr style={FORM_ROW}>
                    <td style={FORM_LABEL_TD}>Nível de Sigilo</td>
                    <td style={FORM_INPUT_TD}>
                      <select
                        className="form-field"
                        value={form.nivelSigilo}
                        onChange={e => update('nivelSigilo', e.target.value)}
                        style={{ maxWidth: 380 }}
                      >
                        {niveisSigno.map(n => <option key={n.codigo} value={n.codigo}>{n.descricao}</option>)}
                      </select>
                    </td>
                  </tr>

                  <tr style={FORM_ROW}>
                    <td style={FORM_LABEL_TD}>Prioridade</td>
                    <td style={FORM_INPUT_TD}>
                      <select
                        className="form-field"
                        value={form.prioridade}
                        onChange={e => update('prioridade', e.target.value)}
                        style={{ maxWidth: 360 }}
                      >
                        <option value="">Nenhuma</option>
                        {prioridades.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Seção: Processo originário e advogados */}
              <div style={SECT_HEADER}>Dados Complementares (opcional)</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={FORM_ROW}>
                    <td style={FORM_LABEL_TD}>Processo originário</td>
                    <td style={FORM_INPUT_TD}>
                      <input
                        type="text"
                        className="form-field"
                        value={form.processoOriginario}
                        onChange={e => update('processoOriginario', e.target.value)}
                        placeholder="Ex.: 0001234-56.2020.4.01.3800"
                        style={{ maxWidth: 320 }}
                      />
                    </td>
                  </tr>
                  <tr style={FORM_ROW}>
                    <td style={FORM_LABEL_TD}>Juízo / Instância</td>
                    <td style={FORM_INPUT_TD}>
                      <input
                        type="text"
                        className="form-field"
                        value={form.juizo}
                        onChange={e => update('juizo', e.target.value)}
                        placeholder="Ex.: 1ª Vara Federal de BH"
                        style={{ maxWidth: 400 }}
                      />
                    </td>
                  </tr>
                  <tr style={{ ...FORM_ROW, alignItems: 'flex-start' }}>
                    <td style={{ ...FORM_LABEL_TD, paddingTop: 10 }}>Outros advogados</td>
                    <td style={FORM_INPUT_TD}>
                      <textarea
                        className="form-field"
                        value={form.outrosAdvogados}
                        onChange={e => update('outrosAdvogados', e.target.value)}
                        placeholder="Nome e OAB de outros advogados (um por linha)"
                        rows={2}
                        style={{ resize: 'vertical', maxWidth: 480, fontSize: 12 }}
                      />
                      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                        O peticionante ({user?.nome_completo} — {user?.oab_simulado}) é incluído automaticamente.
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Custas info */}
              <div style={{ padding: '10px 12px', background: '#fffbeb', borderTop: '1px solid #e5e7eb', fontSize: 11, color: '#92400e' }}>
                <strong>ℹ Custas processuais:</strong> No sistema simulado, as custas são dispensadas para fins didáticos.
                Em ações reais perante a JF, a guia de custas deve ser recolhida via GRU antes do protocolo.
              </div>
            </StepPanel>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP 2 — Assuntos
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div style={{ margin: 16 }}>
            <StepPanel>
              <div style={SECT_HEADER}>Seleção de Assuntos (Tabela CNJ)</div>
              <div style={{ padding: '10px 12px', fontSize: 12, color: '#374151', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                Selecione o(s) assunto(s) que melhor descrevem o objeto da ação. Ao menos um é obrigatório.
                O primeiro assunto selecionado será o <strong>assunto principal</strong>.
              </div>

              {/* Search */}
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 8, alignItems: 'center' }}>
                <Search size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Buscar assunto ou código..."
                  className="form-field"
                  value={assuntoSearch}
                  onChange={e => setAssuntoSearch(e.target.value)}
                  style={{ maxWidth: 400, fontSize: 12 }}
                />
                {assuntoSearch && (
                  <button style={{ fontSize: 11, color: '#6b7280', cursor: 'pointer', background: 'none', border: 'none' }} onClick={() => setAssuntoSearch('')}>
                    limpar
                  </button>
                )}
              </div>

              {errors.assuntos && (
                <div style={{ padding: '6px 12px', background: '#fef2f2', color: '#dc2626', fontSize: 12, borderBottom: '1px solid #fecaca' }}>
                  {errors.assuntos}
                </div>
              )}

              {/* Tree or search results */}
              <div style={{ maxHeight: 320, overflowY: 'auto', border: '1px solid #e5e7eb', margin: 12, borderRadius: 4 }}>
                {filteredLeaves ? (
                  filteredLeaves.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 12 }}>
                      Nenhum assunto encontrado para "{assuntoSearch}"
                    </div>
                  ) : filteredLeaves.map(n => (
                    <AssuntoNode
                      key={n.codigo}
                      node={n}
                      level={0}
                      selected={form.assuntos}
                      onToggle={toggleAssunto}
                    />
                  ))
                ) : (
                  arvoreAssuntos.map(n => (
                    <AssuntoNode
                      key={n.codigo}
                      node={n}
                      level={0}
                      selected={form.assuntos}
                      onToggle={toggleAssunto}
                    />
                  ))
                )}
              </div>

              {/* Selected list */}
              <div style={{ margin: '0 12px 12px', padding: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#166534', marginBottom: 6 }}>
                  Assuntos selecionados ({form.assuntos.length}):
                </div>
                {form.assuntos.length === 0 ? (
                  <div style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>Nenhum selecionado ainda.</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#dcfce7' }}>
                        <th style={{ padding: '4px 8px', textAlign: 'left', fontWeight: 700, width: 30 }}>#</th>
                        <th style={{ padding: '4px 8px', textAlign: 'left', fontWeight: 700 }}>Descrição</th>
                        <th style={{ padding: '4px 8px', textAlign: 'left', fontWeight: 700, width: 90 }}>Código</th>
                        <th style={{ padding: '4px 8px', textAlign: 'left', fontWeight: 700, width: 80 }}>Função</th>
                        <th style={{ width: 32 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.assuntos.map((a, i) => (
                        <tr key={a.codigo} style={{ borderBottom: '1px solid #d1fae5' }}>
                          <td style={{ padding: '3px 8px', color: '#6b7280' }}>{i + 1}</td>
                          <td style={{ padding: '3px 8px' }}>{a.descricao}</td>
                          <td style={{ padding: '3px 8px', fontFamily: 'monospace' }}>{a.codigo}</td>
                          <td style={{ padding: '3px 8px', fontWeight: 600, color: i === 0 ? '#1e40af' : '#374151' }}>
                            {i === 0 ? 'Principal' : 'Secundário'}
                          </td>
                          <td style={{ padding: '3px 4px', textAlign: 'center' }}>
                            <button
                              onClick={() => toggleAssunto(a)}
                              style={{ color: '#dc2626', cursor: 'pointer', background: 'none', border: 'none', lineHeight: 1 }}
                              title="Remover"
                            >
                              <X size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </StepPanel>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP 3 — Partes Autoras
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div style={{ margin: 16 }}>
            <StepPanel>
              <div style={SECT_HEADER}>Polo Ativo — Partes Autoras</div>

              {errors.autora && (
                <div style={{ padding: '6px 12px', background: '#fef2f2', color: '#dc2626', fontSize: 12, borderBottom: '1px solid #fecaca' }}>
                  {errors.autora}
                </div>
              )}

              {/* Advogado info */}
              <div style={{ padding: '8px 12px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe', fontSize: 12 }}>
                <strong>Advogado(a) peticionante:</strong> {user?.nome_completo} — {user?.oab_simulado}
              </div>

              {/* Draft form */}
              <div style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e3a5f', marginBottom: 8 }}>
                  Incluir Parte Autora
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                  {/* Tipo */}
                  <div>
                    <label className="form-label" style={{ fontSize: 11 }}>Tipo de Pessoa</label>
                    <select
                      className="form-field"
                      value={draftAutora.tipo_pessoa}
                      onChange={e => setDraftAutora(d => ({ ...d, tipo_pessoa: e.target.value as 'fisica' | 'juridica', cpf_cnpj: '' }))}
                    >
                      <option value="fisica">Pessoa Física</option>
                      <option value="juridica">Pessoa Jurídica</option>
                    </select>
                  </div>

                  {/* CPF / CNPJ + lookup */}
                  <div>
                    <label className="form-label" style={{ fontSize: 11 }}>
                      {draftAutora.tipo_pessoa === 'fisica' ? 'CPF *' : 'CNPJ *'}
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="text"
                        className="form-field"
                        value={draftAutora.cpf_cnpj}
                        onChange={e => {
                          setDraftAutora(d => ({ ...d, cpf_cnpj: formatCpfCnpj(e.target.value) }));
                          setCpfBuscaEstado('idle');
                        }}
                        placeholder={draftAutora.tipo_pessoa === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                        maxLength={18}
                        style={{ flex: 1 }}
                      />
                      {draftAutora.tipo_pessoa === 'fisica' && (
                        <button
                          style={{ ...TOOLBAR_BTN, background: '#1e40af', color: '#fff', borderColor: '#1e3a8a', flexShrink: 0 }}
                          onClick={buscarCpf}
                          disabled={cpfBuscaEstado === 'carregando'}
                        >
                          {cpfBuscaEstado === 'carregando'
                            ? <Loader2 size={12} className="animate-spin" />
                            : <Search size={12} />}
                          {cpfBuscaEstado === 'carregando' ? 'Buscando...' : 'Buscar'}
                        </button>
                      )}
                    </div>
                    {cpfBuscaEstado === 'encontrado' && (
                      <div style={{ fontSize: 11, color: '#166534', marginTop: 2 }}>✓ Dados preenchidos automaticamente</div>
                    )}
                    {cpfBuscaEstado === 'nao_encontrado' && (
                      <div style={{ fontSize: 11, color: '#92400e', marginTop: 2 }}>CPF não encontrado — preencha manualmente</div>
                    )}
                  </div>

                  {/* Nome */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label" style={{ fontSize: 11 }}>
                      {draftAutora.tipo_pessoa === 'fisica' ? 'Nome Completo *' : 'Razão Social *'}
                    </label>
                    <input
                      type="text"
                      className="form-field"
                      value={draftAutora.nome}
                      onChange={e => setDraftAutora(d => ({ ...d, nome: e.target.value }))}
                    />
                  </div>

                  {draftAutora.tipo_pessoa === 'fisica' && (
                    <>
                      <div>
                        <label className="form-label" style={{ fontSize: 11 }}>RG</label>
                        <input type="text" className="form-field" value={draftAutora.rg}
                          onChange={e => setDraftAutora(d => ({ ...d, rg: e.target.value }))} />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: 11 }}>Data de Nascimento</label>
                        <input type="date" className="form-field" value={draftAutora.data_nascimento}
                          onChange={e => setDraftAutora(d => ({ ...d, data_nascimento: e.target.value }))} />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="form-label" style={{ fontSize: 11 }}>Telefone</label>
                    <input type="text" className="form-field" value={draftAutora.telefone}
                      onChange={e => setDraftAutora(d => ({ ...d, telefone: formatPhone(e.target.value) }))}
                      placeholder="(00) 00000-0000" maxLength={15} />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 11 }}>E-mail</label>
                    <input type="email" className="form-field" value={draftAutora.email}
                      onChange={e => setDraftAutora(d => ({ ...d, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 11 }}>CEP</label>
                    <input type="text" className="form-field" value={draftAutora.cep}
                      onChange={e => setDraftAutora(d => ({ ...d, cep: formatCep(e.target.value) }))}
                      onBlur={e => buscarCep(e.target.value, (k, v) => setDraftAutora(d => ({ ...d, [k]: v })))}
                      placeholder="00000-000" maxLength={9} />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 11 }}>Logradouro</label>
                    <input type="text" className="form-field" value={draftAutora.logradouro}
                      onChange={e => setDraftAutora(d => ({ ...d, logradouro: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 11 }}>Número</label>
                    <input type="text" className="form-field" value={draftAutora.numero}
                      onChange={e => setDraftAutora(d => ({ ...d, numero: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 11 }}>Bairro</label>
                    <input type="text" className="form-field" value={draftAutora.bairro}
                      onChange={e => setDraftAutora(d => ({ ...d, bairro: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 11 }}>Cidade</label>
                    <input type="text" className="form-field" value={draftAutora.cidade}
                      onChange={e => setDraftAutora(d => ({ ...d, cidade: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 11 }}>Estado</label>
                    <select className="form-field" value={draftAutora.estado}
                      onChange={e => setDraftAutora(d => ({ ...d, estado: e.target.value }))}>
                      {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  style={{ ...TOOLBAR_BTN, marginTop: 12, background: '#1e40af', color: '#fff', borderColor: '#1e3a8a', height: 36, padding: '0 20px', fontSize: 13 }}
                  onClick={incluirAutora}
                >
                  <Plus size={14} /> Incluir Parte Autora
                </button>
              </div>

              {/* Table of included autoras */}
              {form.partesAutoras.length > 0 && (
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1e3a5f', marginBottom: 6 }}>
                    Partes autoras incluídas ({form.partesAutoras.length}):
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nome / Razão Social</th>
                        <th>CPF / CNPJ</th>
                        <th>Tipo</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.partesAutoras.map((p, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td style={{ fontWeight: 600 }}>{p.nome}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{p.cpf_cnpj || '—'}</td>
                          <td>{p.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</td>
                          <td>
                            <button onClick={() => removerAutora(i)} style={{ color: '#dc2626', cursor: 'pointer', background: 'none', border: 'none' }}>
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </StepPanel>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP 4 — Partes Rés
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <div style={{ margin: 16 }}>
            <StepPanel>
              <div style={SECT_HEADER}>Polo Passivo — Partes Rés</div>

              {errors.reu && (
                <div style={{ padding: '6px 12px', background: '#fef2f2', color: '#dc2626', fontSize: 12, borderBottom: '1px solid #fecaca' }}>
                  {errors.reu}
                </div>
              )}

              {/* Draft form */}
              <div style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e3a5f', marginBottom: 8 }}>
                  Incluir Parte Ré
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                  {/* Tipo */}
                  <div>
                    <label className="form-label" style={{ fontSize: 11 }}>Tipo de Pessoa</label>
                    <select
                      className="form-field"
                      value={draftReu.tipo_pessoa}
                      onChange={e => setDraftReu(d => ({ ...d, tipo_pessoa: e.target.value as 'fisica' | 'juridica' }))}
                    >
                      <option value="juridica">Pessoa Jurídica</option>
                      <option value="fisica">Pessoa Física</option>
                    </select>
                  </div>

                  {/* Nome / autocomplete */}
                  <div style={{ position: 'relative', gridColumn: draftReu.tipo_pessoa === 'juridica' ? '1 / -1' : undefined }}>
                    <label className="form-label" style={{ fontSize: 11 }}>
                      {draftReu.tipo_pessoa === 'juridica' ? 'Denominação / Razão Social *' : 'Nome Completo *'}
                    </label>
                    <input
                      type="text"
                      className="form-field"
                      value={reuSearch}
                      onChange={e => handleReuSearchChange(e.target.value)}
                      onFocus={() => reuSugestoes.length > 0 && setShowReuSugestoes(true)}
                      placeholder={draftReu.tipo_pessoa === 'juridica' ? 'Ex.: INSS, União Federal, CEF...' : 'Nome do réu'}
                      autoComplete="off"
                    />
                    {showReuSugestoes && reuSugestoes.length > 0 && (
                      <div style={{
                        position: 'absolute', zIndex: 50, background: '#fff',
                        border: '1px solid #d1d5db', borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        width: '100%', maxHeight: 240, overflowY: 'auto',
                      }}>
                        {reuSugestoes.map(e => (
                          <div
                            key={e.cnpj}
                            onClick={() => selecionarEntidade(e)}
                            style={{
                              padding: '7px 12px', fontSize: 12, cursor: 'pointer',
                              borderBottom: '1px solid #f3f4f6',
                            }}
                            onMouseEnter={ev => (ev.currentTarget.style.background = '#eff6ff')}
                            onMouseLeave={ev => (ev.currentTarget.style.background = '')}
                          >
                            <div style={{ fontWeight: 600, color: '#1e3a5f' }}>{e.nome}</div>
                            <div style={{ fontSize: 11, color: '#6b7280', fontFamily: 'monospace' }}>{e.cnpj}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CNPJ / CPF */}
                  <div>
                    <label className="form-label" style={{ fontSize: 11 }}>
                      {draftReu.tipo_pessoa === 'juridica' ? 'CNPJ' : 'CPF'}
                    </label>
                    <input
                      type="text"
                      className="form-field"
                      value={draftReu.cpf_cnpj}
                      onChange={e => setDraftReu(d => ({ ...d, cpf_cnpj: formatCpfCnpj(e.target.value) }))}
                      placeholder={draftReu.tipo_pessoa === 'juridica' ? '00.000.000/0000-00' : '000.000.000-00'}
                      maxLength={18}
                    />
                  </div>
                </div>

                <button
                  style={{ ...TOOLBAR_BTN, marginTop: 12, background: '#1e40af', color: '#fff', borderColor: '#1e3a8a', height: 36, padding: '0 20px', fontSize: 13 }}
                  onClick={incluirReu}
                >
                  <Plus size={14} /> Incluir Parte Ré
                </button>
              </div>

              {/* Table of included réus */}
              {form.partesReus.length > 0 && (
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1e3a5f', marginBottom: 6 }}>
                    Partes rés incluídas ({form.partesReus.length}):
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nome / Razão Social</th>
                        <th>CNPJ / CPF</th>
                        <th>Tipo</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.partesReus.map((p, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td style={{ fontWeight: 600 }}>{p.nome}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{p.cpf_cnpj || '—'}</td>
                          <td>{p.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</td>
                          <td>
                            <button onClick={() => removerReu(i)} style={{ color: '#dc2626', cursor: 'pointer', background: 'none', border: 'none' }}>
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </StepPanel>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP 5 — Documentos
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 5 && (
          <div style={{ margin: 16 }}>
            <StepPanel>
              <div style={SECT_HEADER}>Documentos e Petição</div>

              {tarefa && (tarefa.documentos_obrigatorios as string[])?.length > 0 && (
                <div style={{ padding: '8px 12px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe', fontSize: 12, color: '#1e40af' }}>
                  <strong>Documentos exigidos pelo professor:</strong>{' '}
                  {(tarefa.documentos_obrigatorios as string[]).join(', ')}
                </div>
              )}

              {errors.peticao_inicial && (
                <div style={{ padding: '6px 12px', background: '#fef2f2', color: '#dc2626', fontSize: 12, borderBottom: '1px solid #fecaca' }}>
                  {errors.peticao_inicial}
                </div>
              )}

              {/* Documents list */}
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {form.documentos.map((doc, idx) => (
                  <div key={idx} style={{ border: '1px solid #d1d5db', borderRadius: 4, background: '#fff' }}>
                    {/* Doc header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 10px', background: idx === 0 ? '#f0fdf4' : '#f9fafb',
                      borderBottom: doc.collapsed ? 'none' : '1px solid #e5e7eb',
                      borderRadius: doc.collapsed ? 4 : '4px 4px 0 0',
                    }}>
                      <button
                        onClick={() => updateDoc(idx, 'collapsed', !doc.collapsed)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', flexShrink: 0 }}
                        title={doc.collapsed ? 'Expandir' : 'Recolher'}
                      >
                        {doc.collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1e3a5f', flex: 1 }}>
                        {idx === 0 ? 'PETIÇÃO INICIAL (obrigatório)' : `ANEXO ${idx}`}
                        {doc.nomeArquivo && (
                          <span style={{ fontWeight: 400, color: '#16a34a', marginLeft: 8 }}>
                            ✓ {doc.nomeArquivo}
                          </span>
                        )}
                      </span>
                      {/* Sigilo badge */}
                      <select
                        value={doc.sigilo}
                        onChange={e => updateDoc(idx, 'sigilo', e.target.value)}
                        onClick={e => e.stopPropagation()}
                        style={{ fontSize: 11, border: '1px solid #d1d5db', borderRadius: 3, padding: '2px 4px', background: '#fff', cursor: 'pointer' }}
                      >
                        <option value="publico">Público</option>
                        <option value="sigiloso">Sigiloso</option>
                      </select>
                      {idx > 0 && (
                        <button
                          onClick={() => removeDoc(idx)}
                          style={{ color: '#dc2626', cursor: 'pointer', background: 'none', border: 'none', flexShrink: 0 }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Doc body */}
                    {!doc.collapsed && (
                      <div style={{ padding: '10px 12px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: 10, alignItems: 'start' }}>
                        <div>
                          <label className="form-label" style={{ fontSize: 11 }}>Tipo do Documento</label>
                          <select
                            className="form-field"
                            value={doc.tipo}
                            onChange={e => updateDoc(idx, 'tipo', e.target.value)}
                            disabled={idx === 0}
                          >
                            {tiposDocumento.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: 11 }}>
                            Arquivo (PDF ou DOCX, máx. 10 MB){idx === 0 && ' *'}
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <label style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                              padding: '5px 14px', fontSize: 12, fontWeight: 600,
                              border: `1px solid ${errors.peticao_inicial && idx === 0 ? '#dc2626' : '#d1d5db'}`,
                              borderRadius: 4, background: '#fff', color: '#374151',
                            }}>
                              <Upload size={13} />
                              {doc.nomeArquivo ? 'Alterar' : 'Selecionar arquivo'}
                              <input
                                type="file"
                                style={{ display: 'none' }}
                                accept=".pdf,.docx"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  if (file.size > 10 * 1024 * 1024) { alert('Arquivo muito grande (máx 10 MB).'); return; }
                                  updateDoc(idx, 'arquivo', file);
                                  updateDoc(idx, 'nomeArquivo', file.name);
                                  if (idx === 0) setErrors(err => { const n = { ...err }; delete n.peticao_inicial; return n; });
                                }}
                              />
                            </label>
                            {doc.nomeArquivo && (
                              <span style={{ fontSize: 11, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <CheckCircle size={12} /> {doc.nomeArquivo}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {form.documentos.length < 10 && (
                  <button
                    style={{ ...TOOLBAR_BTN, alignSelf: 'flex-start', height: 34, padding: '0 16px', fontSize: 12 }}
                    onClick={addDoc}
                  >
                    <Plus size={13} /> Adicionar Anexo
                  </button>
                )}
              </div>

              {/* Informações Adicionais */}
              <div style={{ margin: '0 12px 12px', border: '1px solid #d1d5db', borderRadius: 4 }}>
                <div style={{ ...SECT_HEADER, borderRadius: '4px 4px 0 0', fontSize: 11, padding: '5px 10px' }}>
                  Informações Adicionais (marque o que se aplica)
                </div>
                <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 6 }}>
                  {(Object.keys(INFO_ADICIONAIS_LABELS) as Array<keyof InfoAdicionais>).map(key => (
                    <label key={key} className="pje-checkbox" style={{ fontSize: 12 }}>
                      <input
                        type="checkbox"
                        checked={form.infoAdicionais[key]}
                        onChange={() => toggleInfoAdic(key)}
                      />
                      <span>{INFO_ADICIONAIS_LABELS[key]}</span>
                    </label>
                  ))}
                </div>
              </div>
            </StepPanel>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP 6 — Confirmar Ajuizamento
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 6 && (
          <div style={{ margin: 16 }}>
            <StepPanel>
              <div style={SECT_HEADER}>Resumo do Peticionamento</div>
              <div style={{ padding: '8px 12px', fontSize: 12, color: '#374151', background: '#fffbeb', borderBottom: '1px solid #e5e7eb' }}>
                Revise todas as informações antes de confirmar. Após o ajuizamento, a petição será enviada ao sistema para distribuição.
              </div>

              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Processo */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'hsl(210,100%,20%)', marginBottom: 4, textTransform: 'uppercase' }}>
                    Informações do Processo
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
                    <tbody>
                      <SumRow label="Foro" value={forosJFMG.find(f => f.codigo === form.foro)?.descricao ?? form.foro} />
                      <SumRow label="Rito / Procedimento" value={form.rito} />
                      <SumRow label="Classe Processual" value={form.classe} />
                      <SumRow label="Valor da Causa" value={`R$ ${form.valorCausa}`} />
                      <SumRow label="Nível de Sigilo" value={niveisSigno.find(n => n.codigo === form.nivelSigilo)?.descricao ?? form.nivelSigilo} />
                      {form.prioridade && <SumRow label="Prioridade" value={form.prioridade} />}
                      {form.renunciaExcedente && <SumRow label="Renúncia ao excedente" value="Sim" />}
                      <SumRow label="Distribuição" value="Automática — vara será sorteada pelo sistema" />
                    </tbody>
                  </table>
                </div>

                {/* Assuntos */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'hsl(210,100%,20%)', marginBottom: 4, textTransform: 'uppercase' }}>
                    Assuntos ({form.assuntos.length})
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
                    <tbody>
                      {form.assuntos.map((a, i) => (
                        <SumRow
                          key={a.codigo}
                          label={i === 0 ? 'Assunto Principal' : `Assunto ${i + 1}`}
                          value={`${a.descricao} (${a.codigo})`}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Polo ativo */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'hsl(210,100%,20%)', marginBottom: 4, textTransform: 'uppercase' }}>
                    Polo Ativo — Autores ({form.partesAutoras.length})
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
                    <tbody>
                      {form.partesAutoras.map((p, i) => (
                        <SumRow key={i} label={`Autor ${i + 1}`} value={`${p.nome}${p.cpf_cnpj ? ` — ${p.cpf_cnpj}` : ''}`} />
                      ))}
                      <SumRow label="Advogado(a)" value={`${user?.nome_completo} — ${user?.oab_simulado}`} />
                    </tbody>
                  </table>
                </div>

                {/* Polo passivo */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'hsl(210,100%,20%)', marginBottom: 4, textTransform: 'uppercase' }}>
                    Polo Passivo — Réus ({form.partesReus.length})
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
                    <tbody>
                      {form.partesReus.map((p, i) => (
                        <SumRow key={i} label={`Réu ${i + 1}`} value={`${p.nome}${p.cpf_cnpj ? ` — ${p.cpf_cnpj}` : ''}`} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Documentos */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'hsl(210,100%,20%)', marginBottom: 4, textTransform: 'uppercase' }}>
                    Documentos ({form.documentos.length})
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
                    <tbody>
                      {form.documentos.map((d, i) => (
                        <SumRow
                          key={i}
                          label={i === 0 ? 'Petição Inicial' : `Anexo ${i}`}
                          value={d.nomeArquivo || '(sem arquivo)'}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Informações Adicionais marcadas */}
                {Object.values(form.infoAdicionais).some(Boolean) && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'hsl(210,100%,20%)', marginBottom: 4, textTransform: 'uppercase' }}>
                      Informações Adicionais
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
                      <tbody>
                        {(Object.entries(form.infoAdicionais) as Array<[keyof InfoAdicionais, boolean]>)
                          .filter(([, v]) => v)
                          .map(([k]) => (
                            <SumRow key={k} label="Marcado" value={INFO_ADICIONAIS_LABELS[k]} />
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Declarations */}
                <div style={{ border: '1px solid #d1d5db', padding: '10px 14px', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label className="pje-checkbox" style={{ fontSize: 12 }}>
                    <input type="checkbox" id="decl1" />
                    <span>Declaro, sob as penas da lei, que as informações prestadas são verdadeiras e de minha inteira responsabilidade.</span>
                  </label>
                  <label className="pje-checkbox" style={{ fontSize: 12 }}>
                    <input type="checkbox" id="decl2" />
                    <span>Estou ciente de que este é um <strong>sistema de simulação educacional</strong> sem vínculo com a Justiça Federal real.</span>
                  </label>
                </div>
              </div>
            </StepPanel>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP 7 — Comprovante (Receipt)
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 7 && (
          <div style={{ maxWidth: 700, margin: '24px auto', padding: '0 16px' }}>
            <div style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 4, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ background: 'hsl(210,100%,20%)', color: '#fff', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
                <CheckCircle size={16} />
                PETIÇÃO PROTOCOLADA COM SUCESSO
              </div>

              <div style={{ padding: 24 }}>
                {/* Icon and title */}
                <div style={{ textAlign: 'center', paddingBottom: 20, borderBottom: '1px solid #e5e7eb', marginBottom: 20 }}>
                  <CheckCircle size={56} style={{ color: '#16a34a', margin: '0 auto 12px' }} />
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'hsl(210,100%,20%)' }}>
                    Petição Distribuída com Sucesso!
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>
                    Sua petição inicial foi protocolada e encaminhada para distribuição automática.
                  </div>
                </div>

                {/* Receipt table */}
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 4, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.04em' }}>
                    Comprovante de Protocolo
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <tbody>
                      {[
                        ['Número do Processo', <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'hsl(210,100%,20%)', fontSize: 13 }}>{form.numeroProcesso}</span>],
                        ['Vara Distribuída', form.varaProtocolo],
                        ['Classe Processual', form.classe],
                        ['Assunto Principal', form.assuntos[0]?.descricao ?? '—'],
                        ['Valor da Causa', `R$ ${form.valorCausa}`],
                        ['Advogado(a)', `${user?.nome_completo} — ${user?.oab_simulado}`],
                        ['Data / Hora', form.dataProtocolo ? new Date(form.dataProtocolo).toLocaleString('pt-BR') : '—'],
                      ].map(([label, value], i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #bfdbfe' }}>
                          <td style={{ padding: '6px 10px', fontWeight: 600, width: 180, color: '#1e3a5f' }}>{label}</td>
                          <td style={{ padding: '6px 10px', color: '#374151' }}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Alert */}
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 4, padding: '10px 14px', fontSize: 12, color: '#92400e', marginBottom: 20 }}>
                  Acompanhe as movimentações e intimações pelo painel do sistema.
                  Você será notificado(a) quando o professor/juízo emitir despachos ou intimações.
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button
                    style={{ ...TOOLBAR_BTN, height: 44, padding: '0 24px', fontSize: 13 }}
                    onClick={() => navigate('/meus-processos')}
                  >
                    Ver Meus Processos
                  </button>
                  <button
                    style={{ ...TOOLBAR_BTN, height: 44, padding: '0 24px', fontSize: 13, background: 'hsl(210,100%,20%)', color: '#fff', borderColor: 'hsl(210,100%,15%)' }}
                    onClick={() => navigate('/dashboard')}
                  >
                    Voltar ao Painel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom padding */}
        <div style={{ height: 40 }} />
      </div>
    </EprocLayout>
  );
}
