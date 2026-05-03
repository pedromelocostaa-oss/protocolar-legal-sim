import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProfLayout from '@/components/layout/ProfLayout';
import { HelpTooltip } from '@/components/prof/HelpTooltip';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import { getDemoTarefas, saveDemoTarefa, deleteDemoTarefa, demoTurmas } from '@/data/demoStore';
import type { Tarefa } from '@/integrations/supabase/types';
import { Plus, Trash2, Edit, X } from 'lucide-react';

function formatDate(iso: string) { return new Date(iso).toLocaleDateString('pt-BR'); }

interface TarefaForm {
  titulo: string;
  descricao: string;
  turma_id: string;
  data_inicio: string;
  prazo: string;
  documentos_obrigatorios: string[];
  ativa: boolean;
  tipo_atividade: 'peticao_inicial' | 'defesa';
  peticao_referencia: string;
}

export default function GerenciarTarefasPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [docInput, setDocInput] = useState('');
  const [form, setForm] = useState<TarefaForm>({
    titulo: '', descricao: '', turma_id: demoTurmas[0]?.id ?? '',
    data_inicio: '', prazo: '', documentos_obrigatorios: ['Petição Inicial'], ativa: true,
    tipo_atividade: 'peticao_inicial', peticao_referencia: '',
  });

  const loadTarefas = () => {
    if (!user) return;
    if (DEMO_MODE) {
      setTarefas(getDemoTarefas().filter(t => t.professor_id === user.id));
      setLoading(false);
      return;
    }
    supabase!.from('tarefas').select('*').eq('professor_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setTarefas(data); setLoading(false); });
  };

  useEffect(loadTarefas, [user]);

  const resetForm = () => {
    setForm({
      titulo: '', descricao: '', turma_id: demoTurmas[0]?.id ?? '',
      data_inicio: '', prazo: '', documentos_obrigatorios: ['Petição Inicial'], ativa: true,
      tipo_atividade: 'peticao_inicial', peticao_referencia: '',
    });
    setDocInput('');
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (t: Tarefa) => {
    setForm({
      titulo: t.titulo, descricao: t.descricao ?? '',
      turma_id: t.turma_id, data_inicio: t.data_inicio?.split('T')[0] ?? '',
      prazo: t.prazo?.split('T')[0] ?? '',
      documentos_obrigatorios: (t.documentos_obrigatorios as string[]) ?? ['Petição Inicial'],
      ativa: t.ativa,
      tipo_atividade: (t.tipo_atividade as 'peticao_inicial' | 'defesa') ?? 'peticao_inicial',
      peticao_referencia: t.peticao_referencia ?? '',
    });
    setEditingId(t.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const salvar = async () => {
    if (!form.titulo.trim()) {
      alert('O título da atividade é obrigatório.');
      return;
    }

    const tarefaData: Tarefa = {
      id: editingId ?? crypto.randomUUID(),
      titulo: form.titulo,
      descricao: form.descricao || null,
      turma_id: form.turma_id,
      professor_id: user!.id,
      data_inicio: form.data_inicio ? `${form.data_inicio}T00:00:00Z` : null,
      prazo: form.prazo ? `${form.prazo}T23:59:59Z` : null,
      documentos_obrigatorios: form.documentos_obrigatorios,
      ativa: form.ativa,
      tipo_atividade: form.tipo_atividade,
      peticao_referencia: form.tipo_atividade === 'defesa' ? (form.peticao_referencia || null) : null,
      peticao_referencia_arquivo_nome: null,
      created_at: new Date().toISOString(),
    };

    if (DEMO_MODE) {
      saveDemoTarefa(tarefaData);
      loadTarefas();
      resetForm();
      return;
    }

    if (editingId) {
      await supabase!.from('tarefas').update({
        titulo: tarefaData.titulo, descricao: tarefaData.descricao,
        data_inicio: tarefaData.data_inicio, prazo: tarefaData.prazo,
        documentos_obrigatorios: tarefaData.documentos_obrigatorios, ativa: tarefaData.ativa,
      }).eq('id', editingId);
    } else {
      await supabase!.from('tarefas').insert(tarefaData);
    }
    loadTarefas();
    resetForm();
  };

  const excluir = async (id: string, titulo: string) => {
    if (!confirm(`Tem certeza que deseja excluir a atividade "${titulo}"?\n\nEsta ação não pode ser desfeita.`)) return;
    if (DEMO_MODE) { deleteDemoTarefa(id); loadTarefas(); return; }
    await supabase!.from('tarefas').delete().eq('id', id);
    loadTarefas();
  };

  const addDoc = () => {
    const d = docInput.trim();
    if (!d) return;
    if (!form.documentos_obrigatorios.includes(d)) {
      setForm(f => ({ ...f, documentos_obrigatorios: [...f.documentos_obrigatorios, d] }));
    }
    setDocInput('');
  };

  const removeDoc = (i: number) =>
    setForm(f => ({ ...f, documentos_obrigatorios: f.documentos_obrigatorios.filter((_, idx) => idx !== i) }));

  return (
    <ProfLayout>
      <div style={{ padding: 24, maxWidth: 1100 }}>

        {/* ── 4.1 Header + New Task Button ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div className="prof-page-title">Gerenciar Atividades</div>
            <div style={{ fontSize: 15, color: '#6b7280' }}>
              Crie e gerencie as atividades para os seus alunos.
            </div>
          </div>
          {!showForm && (
            <button
              className="prof-btn-primary"
              style={{ height: 48, fontSize: 16, padding: '0 24px' }}
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} />
              Criar nova atividade para os alunos
              <HelpTooltip text={'Crie uma atividade para que os alunos possam praticar.\nVocê pode criar atividades de Petição Inicial (aluno cria do zero)\nou de Defesa (aluno responde uma petição que você fornecer).'} />
            </button>
          )}
        </div>

        {/* ── 4.2 Form ── */}
        {showForm && (
          <div className="prof-card" style={{ marginBottom: 24 }}>
            <div className="prof-card-header">
              {editingId ? 'Editar Atividade' : 'Nova Atividade'}
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Título */}
              <div>
                <label className="prof-label">
                  Título da Atividade <span style={{ color: '#dc2626' }}>*</span>
                  <HelpTooltip text="Nome da atividade que aparecerá para os alunos. Ex: 'Petição Inicial — Acidente de Trânsito'." />
                </label>
                <input
                  type="text"
                  className="prof-input"
                  value={form.titulo}
                  onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                  placeholder="Ex: Petição Inicial — Responsabilidade Civil"
                />
              </div>

              {/* Enunciado */}
              <div>
                <label className="prof-label">
                  Enunciado / Descrição
                  <HelpTooltip text="Descreva o caso que o aluno deverá trabalhar. Quanto mais detalhes, melhor será o exercício." />
                </label>
                <textarea
                  className="prof-textarea"
                  rows={6}
                  style={{ minHeight: 140 }}
                  value={form.descricao}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  placeholder="Descreva o caso, instruções e objetivos da atividade..."
                />
              </div>

              {/* Tipo de Atividade */}
              <div>
                <label className="prof-label">
                  Tipo de Atividade <span style={{ color: '#dc2626' }}>*</span>
                  <HelpTooltip text={'Petição Inicial: o aluno cria um processo do zero.\nDefesa: o aluno recebe uma petição e precisa responder.'} />
                </label>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  {([
                    { val: 'peticao_inicial', label: 'Petição Inicial (autor)' },
                    { val: 'defesa', label: 'Defesa / Contestação (réu)' },
                  ] as const).map(opt => (
                    <label
                      key={opt.val}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '12px 20px', border: '2px solid',
                        borderColor: form.tipo_atividade === opt.val ? '#1e40af' : '#d1d5db',
                        borderRadius: 8, cursor: 'pointer', fontSize: 15,
                        background: form.tipo_atividade === opt.val ? '#eff6ff' : '#fff',
                        fontWeight: form.tipo_atividade === opt.val ? 600 : 400,
                        color: form.tipo_atividade === opt.val ? '#1e40af' : '#374151',
                      }}
                    >
                      <input
                        type="radio"
                        name="tipo_atividade"
                        value={opt.val}
                        checked={form.tipo_atividade === opt.val}
                        onChange={() => setForm(f => ({ ...f, tipo_atividade: opt.val, peticao_referencia: '' }))}
                        style={{ width: 16, height: 16 }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Turma / Datas */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <label className="prof-label">
                    Turma
                    <HelpTooltip text="Selecione qual turma de alunos receberá esta atividade." />
                  </label>
                  <select
                    className="prof-input"
                    value={form.turma_id}
                    onChange={e => setForm(f => ({ ...f, turma_id: e.target.value }))}
                  >
                    {demoTurmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="prof-label">
                    Data de Início
                    <HelpTooltip text="A partir desta data, os alunos conseguirão ver e enviar a atividade." />
                  </label>
                  <input
                    type="date"
                    className="prof-input"
                    value={form.data_inicio}
                    onChange={e => setForm(f => ({ ...f, data_inicio: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="prof-label">
                    Prazo Final
                    <HelpTooltip text="Após esta data, o sistema marcará a atividade como vencida." />
                  </label>
                  <input
                    type="date"
                    className="prof-input"
                    value={form.prazo}
                    onChange={e => setForm(f => ({ ...f, prazo: e.target.value }))}
                  />
                </div>
              </div>

              {/* Documentos obrigatórios */}
              <div>
                <label className="prof-label">
                  Documentos Obrigatórios
                  <HelpTooltip text="Liste quais documentos o aluno deve anexar ao enviar. Ex: Petição Inicial, Procuração." />
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  {form.documentos_obrigatorios.map((d, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: '#dbeafe', color: '#1e40af',
                        padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 600,
                      }}
                    >
                      {d}
                      <button
                        type="button"
                        onClick={() => removeDoc(i)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#1e40af', display: 'flex', alignItems: 'center', padding: 0,
                        }}
                        aria-label="Remover"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    className="prof-input"
                    style={{ flex: 1, maxWidth: 360 }}
                    placeholder="Digite o nome do documento..."
                    value={docInput}
                    onChange={e => setDocInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDoc(); } }}
                  />
                  <button
                    type="button"
                    className="prof-btn-secondary"
                    style={{ height: 44, padding: '0 20px', whiteSpace: 'nowrap' }}
                    onClick={addDoc}
                  >
                    <Plus size={16} /> Adicionar
                  </button>
                </div>
              </div>

              {/* Petição de referência (defesa) */}
              {form.tipo_atividade === 'defesa' && (
                <div>
                  <label className="prof-label">
                    Petição de Referência (para Defesa) <span style={{ color: '#dc2626' }}>*</span>
                    <HelpTooltip text="Cole aqui o texto da petição inicial que os alunos irão defender. O aluno conseguirá ler este texto antes de fazer a contestação." />
                  </label>
                  <textarea
                    className="prof-textarea"
                    rows={12}
                    style={{ minHeight: 200, fontFamily: 'monospace', fontSize: 13 }}
                    value={form.peticao_referencia}
                    onChange={e => setForm(f => ({ ...f, peticao_referencia: e.target.value }))}
                    placeholder="Cole aqui o texto completo da petição inicial que servirá de referência..."
                  />
                </div>
              )}

              {/* Ativa */}
              <div>
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    checked={form.ativa}
                    onChange={e => setForm(f => ({ ...f, ativa: e.target.checked }))}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>
                    Tarefa ativa (visível para os alunos)
                    <HelpTooltip text="Quando marcado, os alunos conseguem ver e enviar esta atividade. Desmarque para ocultar temporariamente." />
                  </span>
                </label>
              </div>

              {/* Botões */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="prof-btn-primary" style={{ height: 48, fontSize: 15 }} onClick={salvar}>
                  {editingId ? 'Salvar Alterações' : 'Criar Atividade'}
                </button>
                <button className="prof-btn-secondary" style={{ height: 48, fontSize: 15 }} onClick={resetForm}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 4.3 Task list as cards ── */}
        <div>
          <div className="prof-section-title" style={{ marginBottom: 16 }}>
            Atividades Criadas ({tarefas.length})
          </div>

          {loading && (
            <div style={{ padding: 32, textAlign: 'center', color: '#6b7280', fontSize: 15 }}>
              Carregando...
            </div>
          )}

          {!loading && tarefas.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: '#6b7280', fontSize: 15 }}>
              Nenhuma atividade criada ainda.{' '}
              <button
                style={{ color: '#1e40af', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }}
                onClick={() => setShowForm(true)}
              >
                Criar primeira atividade
              </button>
            </div>
          )}

          {tarefas.map(t => {
            const prazoDate = t.prazo ? new Date(t.prazo) : null;
            const vencido = prazoDate && prazoDate < new Date();
            return (
              <div key={t.id} className="prof-card" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    {/* Title + status badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <span
                        style={{
                          fontSize: 17, fontWeight: 700,
                          color: t.ativa ? '#1e3a5f' : '#9ca3af',
                          textDecoration: t.ativa ? 'none' : 'line-through',
                        }}
                      >
                        {t.titulo}
                      </span>
                      <span
                        style={{
                          fontSize: 14, fontWeight: 700,
                          padding: '3px 12px', borderRadius: 20,
                          background: t.ativa ? '#dcfce7' : '#f3f4f6',
                          color: t.ativa ? '#166534' : '#6b7280',
                        }}
                      >
                        {t.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>

                    {/* Prazo */}
                    <div style={{ fontSize: 15, color: vencido ? '#dc2626' : '#6b7280', marginBottom: 8 }}>
                      {t.prazo ? `Prazo: ${formatDate(t.prazo)}` : 'Sem prazo definido'}
                      {vencido && <strong style={{ marginLeft: 8 }}>— VENCIDO</strong>}
                      {t.turma_id && (
                        <span style={{ marginLeft: 12, color: '#9ca3af' }}>
                          · {demoTurmas.find(tu => tu.id === t.turma_id)?.nome}
                        </span>
                      )}
                    </div>

                    {/* Docs */}
                    {(t.documentos_obrigatorios as string[])?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(t.documentos_obrigatorios as string[]).map(d => (
                          <span
                            key={d}
                            style={{
                              fontSize: 13, padding: '2px 10px', borderRadius: 12,
                              background: '#dbeafe', color: '#1e40af', fontWeight: 600,
                            }}
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                    <button
                      className="prof-btn-secondary"
                      style={{ height: 40, padding: '0 16px', fontSize: 14 }}
                      onClick={() => startEdit(t)}
                    >
                      <Edit size={15} /> Editar
                    </button>
                    <button
                      className="prof-btn-danger"
                      style={{ height: 40, padding: '0 16px', fontSize: 14 }}
                      onClick={() => excluir(t.id, t.titulo)}
                    >
                      <Trash2 size={15} /> Excluir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ProfLayout>
  );
}
