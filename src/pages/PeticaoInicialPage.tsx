import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EprocLayout from '@/components/layout/EprocLayout';
import { classesProcessuais, assuntosCNJ, prioridades, tiposDocumento } from '@/data/classesAssuntos';
import { varasFicticias, sortearVara } from '@/data/varas';
import { formatCpfCnpj, formatPhone, formatCep, formatCurrency, parseCurrency } from '@/lib/masks';
import { generateProcessNumber } from '@/lib/cnj';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import { saveDemoProcesso, saveDemoPartes, saveDemoMovimentacao, getDemoTarefas } from '@/data/demoStore';
import { CheckCircle, Upload, X, Plus, Trash2 } from 'lucide-react';
import type { Tarefa } from '@/integrations/supabase/types';

// ────── Types ──────
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

interface Documento {
  tipo: string;
  arquivo: File | null;
  nomeArquivo: string;
}

interface FormData {
  // Step 1
  classe: string;
  assunto: string;
  valorCausa: string;
  segredoJustica: boolean;
  prioridade: string;
  vara: string;
  tarefaId: string;
  // Step 2
  partes: Parte[];
  // Step 3
  documentos: Documento[];
  observacoes: string;
  // Resultado
  numeroProcesso: string;
  varaProtocolo: string;
  dataProtocolo: string;
}

const emptyParte = (polo: 'ativo' | 'passivo'): Parte => ({
  polo, tipo_pessoa: 'fisica', nome: '', cpf_cnpj: '', rg: '',
  data_nascimento: '', email: '', telefone: '', cep: '',
  logradouro: '', numero: '', bairro: '', cidade: '', estado: 'MG',
});

const STEPS = [
  { label: 'DADOS DA AÇÃO', num: 1 },
  { label: 'PARTES', num: 2 },
  { label: 'DOCUMENTOS', num: 3 },
  { label: 'RESUMO', num: 4 },
  { label: 'PROTOCOLO', num: 5 },
];

// ────── Step Bar ──────
function StepBar({ current }: { current: number }) {
  return (
    <div className="step-bar">
      {STEPS.map((s, i) => {
        const state = s.num < current ? 'done' : s.num === current ? 'active' : 'pending';
        return (
          <div key={s.num} className="flex items-center">
            <div className={`step-item ${state}`}>
              <div className="step-number">{state === 'done' ? '✓' : s.num}</div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="step-separator text-muted-foreground mx-2">›</div>}
          </div>
        );
      })}
    </div>
  );
}

// ────── Main ──────
export default function PeticaoInicialPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>({
    classe: '', assunto: '', valorCausa: '', segredoJustica: false,
    prioridade: '', vara: '', tarefaId: searchParams.get('tarefa') ?? '',
    partes: [emptyParte('ativo'), emptyParte('passivo')],
    documentos: [{ tipo: 'Petição Inicial', arquivo: null, nomeArquivo: '' }],
    observacoes: '',
    numeroProcesso: '', varaProtocolo: '', dataProtocolo: '',
  });

  useEffect(() => {
    if (form.tarefaId && DEMO_MODE) {
      const t = getDemoTarefas().find(t => t.id === form.tarefaId);
      if (t) setTarefa(t);
    }
  }, [form.tarefaId]);

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });

  const update = (key: keyof FormData, val: unknown) =>
    setForm(f => ({ ...f, [key]: val }));

  const updateParte = (idx: number, key: keyof Parte, val: string) =>
    setForm(f => {
      const partes = [...f.partes];
      partes[idx] = { ...partes[idx], [key]: val };
      return { ...f, partes };
    });

  const addReu = () =>
    setForm(f => ({ ...f, partes: [...f.partes, emptyParte('passivo')] }));

  const removeParte = (idx: number) =>
    setForm(f => ({ ...f, partes: f.partes.filter((_, i) => i !== idx) }));

  const updateDoc = (idx: number, key: keyof Documento, val: unknown) =>
    setForm(f => {
      const docs = [...f.documentos];
      docs[idx] = { ...docs[idx], [key]: val };
      return { ...f, documentos: docs };
    });

  const addDoc = () => {
    if (form.documentos.length >= 6) return;
    setForm(f => ({ ...f, documentos: [...f.documentos, { tipo: 'Certidão', arquivo: null, nomeArquivo: '' }] }));
  };

  const removeDoc = (idx: number) => {
    if (idx === 0) return;
    setForm(f => ({ ...f, documentos: f.documentos.filter((_, i) => i !== idx) }));
  };

  const buscarCep = async (cep: string, parteIdx: number) => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!data.erro) {
        const f = { ...form };
        f.partes[parteIdx] = {
          ...f.partes[parteIdx],
          logradouro: data.logradouro ?? '',
          bairro: data.bairro ?? '',
          cidade: data.localidade ?? '',
          estado: data.uf ?? 'MG',
        };
        setForm(f);
      }
    } catch { /* ignore */ }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!form.classe) errs.classe = 'Selecione a classe processual.';
      if (!form.assunto) errs.assunto = 'Selecione o assunto.';
      if (!form.valorCausa) errs.valorCausa = 'Informe o valor da causa.';
    }
    if (step === 2) {
      form.partes.forEach((p, i) => {
        if (!p.nome.trim()) errs[`parte_${i}_nome`] = 'Nome obrigatório.';
        if (!p.cpf_cnpj.trim()) errs[`parte_${i}_cpf`] = 'CPF/CNPJ obrigatório.';
      });
    }
    if (step === 3) {
      if (!form.documentos[0].arquivo && !form.documentos[0].nomeArquivo) {
        errs.peticao_inicial = 'A petição inicial é obrigatória.';
      }
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

  const protocolar = async () => {
    setLoading(true);
    try {
      const vara = sortearVara();
      const numeroProcesso = generateProcessNumber(vara.codigo);
      const dataProtocolo = new Date().toISOString();

      const processoId = crypto.randomUUID();

      if (DEMO_MODE) {
        saveDemoProcesso({
          id: processoId,
          numero_processo: numeroProcesso,
          aluno_id: user!.id,
          tarefa_id: form.tarefaId || null,
          classe_processual: form.classe,
          assunto: form.assunto,
          valor_causa: parseCurrency(form.valorCausa),
          vara: vara.nome,
          segredo_justica: form.segredoJustica,
          prioridade: form.prioridade || null,
          status: 'em_andamento',
          nota: null,
          feedback_professor: null,
          created_at: dataProtocolo,
          updated_at: dataProtocolo,
        });

        saveDemoPartes(form.partes.map(p => ({
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
        // Real Supabase insert
        await supabase!.from('processos').insert({
          id: processoId,
          numero_processo: numeroProcesso,
          aluno_id: user!.id,
          tarefa_id: form.tarefaId || null,
          classe_processual: form.classe,
          assunto: form.assunto,
          valor_causa: parseCurrency(form.valorCausa),
          vara: vara.nome,
          segredo_justica: form.segredoJustica,
          prioridade: form.prioridade || null,
          status: 'em_andamento',
        });

        await supabase!.from('partes').insert(
          form.partes.map(p => ({
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

        // Upload documents
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
      setStep(5);
      scrollTop();
    } catch (err) {
      console.error(err);
      alert('Erro ao protocolar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <EprocLayout>
      <div ref={topRef}>
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button onClick={() => navigate('/dashboard')}>Início</button>
          <span>›</span>
          <button onClick={() => navigate('/dashboard')}>Peticionar</button>
          <span>›</span>
          <span>Petição Inicial — Nova Ação</span>
        </div>

        <StepBar current={step} />

        {/* Tarefa info */}
        {tarefa && (
          <div className="alert-info m-4">
            <strong>Tarefa vinculada:</strong> {tarefa.titulo}
            {tarefa.prazo && <span className="ml-2">· Prazo: {new Date(tarefa.prazo).toLocaleDateString('pt-BR')}</span>}
          </div>
        )}

        <div className="p-4">
          {/* STEP 1 — Dados da Ação */}
          {step === 1 && (
            <StepPanel title="DADOS DA AÇÃO">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="form-label required">Classe Processual</label>
                  <select
                    className={`form-field ${errors.classe ? 'form-field-error' : ''}`}
                    value={form.classe}
                    onChange={e => update('classe', e.target.value)}
                  >
                    <option value="">-- Selecione --</option>
                    {classesProcessuais.map(c => (
                      <option key={c.codigo} value={c.descricao}>
                        [{c.grupo}] {c.descricao} ({c.codigo})
                      </option>
                    ))}
                  </select>
                  {errors.classe && <div className="form-error">{errors.classe}</div>}
                </div>

                <div className="md:col-span-2">
                  <label className="form-label required">Assunto Principal</label>
                  <select
                    className={`form-field ${errors.assunto ? 'form-field-error' : ''}`}
                    value={form.assunto}
                    onChange={e => update('assunto', e.target.value)}
                  >
                    <option value="">-- Selecione --</option>
                    {assuntosCNJ.map(a => (
                      <option key={a.codigo} value={a.descricao}>
                        {a.area} › {a.descricao} ({a.codigo})
                      </option>
                    ))}
                  </select>
                  {errors.assunto && <div className="form-error">{errors.assunto}</div>}
                </div>

                <div>
                  <label className="form-label required">Valor da Causa (R$)</label>
                  <input
                    type="text"
                    className={`form-field ${errors.valorCausa ? 'form-field-error' : ''}`}
                    value={form.valorCausa}
                    onChange={e => update('valorCausa', formatCurrency(e.target.value))}
                    placeholder="0,00"
                  />
                  {errors.valorCausa && <div className="form-error">{errors.valorCausa}</div>}
                </div>

                <div>
                  <label className="form-label">Prioridade</label>
                  <select
                    className="form-field"
                    value={form.prioridade}
                    onChange={e => update('prioridade', e.target.value)}
                  >
                    <option value="">Nenhuma</option>
                    {prioridades.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="pje-checkbox">
                    <input
                      type="checkbox"
                      checked={form.segredoJustica}
                      onChange={e => update('segredoJustica', e.target.checked)}
                    />
                    <span>Processo em Segredo de Justiça</span>
                  </label>
                  <div className="text-[11px] text-muted-foreground ml-5 mt-0.5">
                    Processos em segredo não aparecem na consulta pública.
                  </div>
                </div>
              </div>

              <div className="alert-info mt-4 text-[11px]">
                <strong>ℹ️ Distribuição automática:</strong> A vara será sorteada automaticamente pelo sistema ao protocolar.
              </div>
            </StepPanel>
          )}

          {/* STEP 2 — Partes */}
          {step === 2 && (
            <StepPanel title="QUALIFICAÇÃO DAS PARTES">
              {form.partes.map((parte, idx) => (
                <div key={idx} className="pje-fieldset mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <legend className="pje-fieldset-legend">
                      POLO {parte.polo === 'ativo' ? 'ATIVO' : 'PASSIVO'} —{' '}
                      {parte.polo === 'ativo' ? 'AUTOR/REQUERENTE' : `RÉU/REQUERIDO (${idx + 1 - form.partes.filter(p => p.polo === 'ativo').length})`}
                    </legend>
                    {parte.polo === 'passivo' && form.partes.filter(p => p.polo === 'passivo').length > 1 && (
                      <button onClick={() => removeParte(idx)} className="btn-danger text-[10px] py-0.5 px-2">
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="form-label">Tipo de Pessoa</label>
                      <select
                        className="form-field"
                        value={parte.tipo_pessoa}
                        onChange={e => updateParte(idx, 'tipo_pessoa', e.target.value as 'fisica' | 'juridica')}
                      >
                        <option value="fisica">Pessoa Física</option>
                        <option value="juridica">Pessoa Jurídica</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="form-label required">
                        {parte.tipo_pessoa === 'fisica' ? 'Nome Completo' : 'Razão Social'}
                      </label>
                      <input
                        type="text"
                        className={`form-field ${errors[`parte_${idx}_nome`] ? 'form-field-error' : ''}`}
                        value={parte.nome}
                        onChange={e => updateParte(idx, 'nome', e.target.value)}
                      />
                      {errors[`parte_${idx}_nome`] && <div className="form-error">{errors[`parte_${idx}_nome`]}</div>}
                    </div>

                    <div>
                      <label className="form-label required">{parte.tipo_pessoa === 'fisica' ? 'CPF' : 'CNPJ'}</label>
                      <input
                        type="text"
                        className={`form-field ${errors[`parte_${idx}_cpf`] ? 'form-field-error' : ''}`}
                        value={parte.cpf_cnpj}
                        onChange={e => updateParte(idx, 'cpf_cnpj', formatCpfCnpj(e.target.value))}
                        placeholder={parte.tipo_pessoa === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                        maxLength={18}
                      />
                      {errors[`parte_${idx}_cpf`] && <div className="form-error">{errors[`parte_${idx}_cpf`]}</div>}
                    </div>

                    {parte.tipo_pessoa === 'fisica' && (
                      <>
                        <div>
                          <label className="form-label">RG</label>
                          <input type="text" className="form-field" value={parte.rg} onChange={e => updateParte(idx, 'rg', e.target.value)} />
                        </div>
                        <div>
                          <label className="form-label">Data de Nascimento</label>
                          <input type="date" className="form-field" value={parte.data_nascimento} onChange={e => updateParte(idx, 'data_nascimento', e.target.value)} />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="form-label">Telefone</label>
                      <input
                        type="text"
                        className="form-field"
                        value={parte.telefone}
                        onChange={e => updateParte(idx, 'telefone', formatPhone(e.target.value))}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                      />
                    </div>
                    <div>
                      <label className="form-label">E-mail</label>
                      <input type="email" className="form-field" value={parte.email} onChange={e => updateParte(idx, 'email', e.target.value)} />
                    </div>

                    <div>
                      <label className="form-label">CEP</label>
                      <input
                        type="text"
                        className="form-field"
                        value={parte.cep}
                        onChange={e => updateParte(idx, 'cep', formatCep(e.target.value))}
                        onBlur={e => buscarCep(e.target.value, idx)}
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="form-label">Logradouro</label>
                      <input type="text" className="form-field" value={parte.logradouro} onChange={e => updateParte(idx, 'logradouro', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Número</label>
                      <input type="text" className="form-field" value={parte.numero} onChange={e => updateParte(idx, 'numero', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Bairro</label>
                      <input type="text" className="form-field" value={parte.bairro} onChange={e => updateParte(idx, 'bairro', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Cidade</label>
                      <input type="text" className="form-field" value={parte.cidade} onChange={e => updateParte(idx, 'cidade', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Estado</label>
                      <select className="form-field" value={parte.estado} onChange={e => updateParte(idx, 'estado', e.target.value)}>
                        {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Advogado do polo ativo */}
                  {parte.polo === 'ativo' && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 text-[11px]">
                      <strong>Advogado(a) do polo ativo:</strong> {user?.nome_completo} — {user?.oab_simulado}
                    </div>
                  )}
                </div>
              ))}

              <button className="btn-secondary flex items-center gap-2 text-[11px]" onClick={addReu}>
                <Plus size={13} /> Adicionar Réu
              </button>
            </StepPanel>
          )}

          {/* STEP 3 — Documentos */}
          {step === 3 && (
            <StepPanel title="DOCUMENTOS E PETIÇÃO">
              {tarefa && (tarefa.documentos_obrigatorios as string[])?.length > 0 && (
                <div className="alert-info mb-3">
                  <strong>Documentos exigidos pelo professor:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {(tarefa.documentos_obrigatorios as string[]).map(d => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3">
                {form.documentos.map((doc, idx) => (
                  <div key={idx} className="border border-border p-3 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[12px] font-bold">
                        {idx === 0 ? 'PETIÇÃO INICIAL (obrigatório)' : `ANEXO ${idx}`}
                      </div>
                      {idx > 0 && (
                        <button onClick={() => removeDoc(idx)} className="text-destructive hover:opacity-70">
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="form-label">Tipo do Documento</label>
                        <select
                          className="form-field"
                          value={doc.tipo}
                          onChange={e => updateDoc(idx, 'tipo', e.target.value)}
                          disabled={idx === 0}
                        >
                          {tiposDocumento.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="form-label required={idx === 0}">Arquivo (PDF ou DOCX, máx. 10MB)</label>
                        <div className="flex items-center gap-2">
                          <label className={`btn-secondary flex items-center gap-1.5 cursor-pointer text-[11px] ${errors.peticao_inicial && idx === 0 ? 'border-red-500' : ''}`}>
                            <Upload size={13} />
                            {doc.nomeArquivo ? 'Alterar arquivo' : 'Selecionar arquivo'}
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.docx"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 10 * 1024 * 1024) { alert('Arquivo muito grande (máx 10MB).'); return; }
                                updateDoc(idx, 'arquivo', file);
                                updateDoc(idx, 'nomeArquivo', file.name);
                              }}
                            />
                          </label>
                          {doc.nomeArquivo && (
                            <span className="text-[11px] text-green-700 flex items-center gap-1">
                              <CheckCircle size={12} /> {doc.nomeArquivo}
                            </span>
                          )}
                        </div>
                        {errors.peticao_inicial && idx === 0 && (
                          <div className="form-error">{errors.peticao_inicial}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {form.documentos.length < 6 && (
                <button className="btn-secondary flex items-center gap-2 text-[11px] mt-3" onClick={addDoc}>
                  <Plus size={13} /> Adicionar Anexo
                </button>
              )}

              <div className="mt-4">
                <label className="form-label">Observações ao Juízo (opcional)</label>
                <textarea
                  className="form-field min-h-20"
                  value={form.observacoes}
                  onChange={e => update('observacoes', e.target.value)}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>
            </StepPanel>
          )}

          {/* STEP 4 — Resumo */}
          {step === 4 && (
            <StepPanel title="RESUMO E CONFIRMAÇÃO">
              <div className="space-y-4">
                <ResumoSection title="DADOS DA AÇÃO">
                  <ResumoRow label="Classe Processual" value={form.classe} />
                  <ResumoRow label="Assunto" value={form.assunto} />
                  <ResumoRow label="Valor da Causa" value={`R$ ${form.valorCausa}`} />
                  <ResumoRow label="Prioridade" value={form.prioridade || 'Nenhuma'} />
                  <ResumoRow label="Segredo de Justiça" value={form.segredoJustica ? 'Sim' : 'Não'} />
                  <ResumoRow label="Distribuição" value="Automática (vara será sorteada ao protocolar)" />
                </ResumoSection>

                <ResumoSection title="POLO ATIVO">
                  {form.partes.filter(p => p.polo === 'ativo').map((p, i) => (
                    <div key={i} className="mb-2">
                      <ResumoRow label="Nome" value={p.nome} />
                      <ResumoRow label="CPF/CNPJ" value={p.cpf_cnpj} />
                      <ResumoRow label="Telefone" value={p.telefone || '—'} />
                    </div>
                  ))}
                  <ResumoRow label="Advogado(a)" value={`${user?.nome_completo} — ${user?.oab_simulado}`} />
                </ResumoSection>

                <ResumoSection title="POLO PASSIVO">
                  {form.partes.filter(p => p.polo === 'passivo').map((p, i) => (
                    <div key={i} className="mb-2">
                      <ResumoRow label="Nome" value={p.nome} />
                      <ResumoRow label="CPF/CNPJ" value={p.cpf_cnpj} />
                    </div>
                  ))}
                </ResumoSection>

                <ResumoSection title="DOCUMENTOS">
                  {form.documentos.map((d, i) => (
                    <ResumoRow key={i} label={d.tipo} value={d.nomeArquivo || '(nenhum arquivo)'} />
                  ))}
                </ResumoSection>

                <div className="border border-border p-4 space-y-3">
                  <label className="pje-checkbox">
                    <input type="checkbox" id="decl1" required />
                    <span>Declaro, sob as penas da lei, que as informações prestadas são verdadeiras.</span>
                  </label>
                  <label className="pje-checkbox">
                    <input type="checkbox" id="decl2" required />
                    <span>Estou ciente de que este é um <strong>sistema de simulação educacional</strong> sem vínculo com a Justiça Federal.</span>
                  </label>
                </div>
              </div>
            </StepPanel>
          )}

          {/* STEP 5 — Protocolo */}
          {step === 5 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-border">
                <div className="panel-header flex items-center gap-2">
                  <CheckCircle size={16} />
                  PETIÇÃO PROTOCOLADA COM SUCESSO
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-center py-4">
                    <div className="text-[40px] mb-2">✅</div>
                    <div className="text-[16px] font-bold" style={{ color: 'hsl(210,100%,20%)' }}>
                      Petição Distribuída!
                    </div>
                    <div className="text-[12px] text-muted-foreground mt-1">
                      Sua petição inicial foi protocolada e distribuída com sucesso.
                    </div>
                  </div>

                  <div className="border border-border p-4 bg-blue-50">
                    <div className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Comprovante de Protocolo</div>
                    <table className="data-table">
                      <tbody>
                        <tr><td className="font-bold w-48">Número do Processo</td><td className="font-mono font-bold">{form.numeroProcesso}</td></tr>
                        <tr><td className="font-bold">Vara Distribuída</td><td>{form.varaProtocolo}</td></tr>
                        <tr><td className="font-bold">Classe</td><td>{form.classe}</td></tr>
                        <tr><td className="font-bold">Assunto</td><td>{form.assunto}</td></tr>
                        <tr><td className="font-bold">Valor da Causa</td><td>R$ {form.valorCausa}</td></tr>
                        <tr><td className="font-bold">Advogado(a)</td><td>{user?.nome_completo} — {user?.oab_simulado}</td></tr>
                        <tr><td className="font-bold">Data/Hora</td><td>{form.dataProtocolo ? new Date(form.dataProtocolo).toLocaleString('pt-BR') : ''}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="alert-warning text-[11px]">
                    Acompanhe as movimentações e intimações pelo painel do sistema. Você será notificado(a) quando o professor/juízo emitir despachos.
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button className="btn-secondary" onClick={() => navigate('/meus-processos')}>
                      Ver Meus Processos
                    </button>
                    <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                      Voltar ao Painel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          {step < 5 && (
            <div className="flex justify-between mt-4">
              {step > 1
                ? <button className="btn-secondary" onClick={back}>← Anterior</button>
                : <div />}
              {step < 4
                ? <button className="btn-primary" onClick={next}>Próximo →</button>
                : (
                  <button
                    className="btn-success"
                    onClick={protocolar}
                    disabled={loading}
                  >
                    {loading ? 'PROTOCOLANDO...' : '⚖ DISTRIBUIR PETIÇÃO'}
                  </button>
                )}
            </div>
          )}
        </div>
      </div>
    </EprocLayout>
  );
}

// ── Helper components ──
function StepPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-border">
      <div className="panel-header">{title}</div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ResumoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase mb-1" style={{ color: 'hsl(210,100%,20%)' }}>{title}</div>
      <div className="border border-border">{children}</div>
    </div>
  );
}

function ResumoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 px-3 py-1.5 border-b border-border last:border-b-0 even:bg-muted/40">
      <span className="text-[11px] font-bold w-40 shrink-0">{label}:</span>
      <span className="text-[12px]">{value}</span>
    </div>
  );
}
