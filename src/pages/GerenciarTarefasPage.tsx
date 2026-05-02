import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProfLayout from '@/components/layout/ProfLayout';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import { getDemoTarefas, saveDemoTarefa, deleteDemoTarefa, demoTurmas } from '@/data/demoStore';
import type { Tarefa } from '@/integrations/supabase/types';
import { Plus, Trash2, Edit, Eye } from 'lucide-react';

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
    setForm({ titulo: '', descricao: '', turma_id: demoTurmas[0]?.id ?? '', data_inicio: '', prazo: '', documentos_obrigatorios: ['Petição Inicial'], ativa: true, tipo_atividade: 'peticao_inicial', peticao_referencia: '' });
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
    if (!form.titulo.trim()) { alert('Título obrigatório.'); return; }

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

  const excluir = async (id: string) => {
    if (!confirm('Excluir esta tarefa?')) return;
    if (DEMO_MODE) { deleteDemoTarefa(id); loadTarefas(); return; }
    await supabase!.from('tarefas').delete().eq('id', id);
    loadTarefas();
  };

  const addDocObrig = () => {
    const d = prompt('Nome do documento exigido:');
    if (d) setForm(f => ({ ...f, documentos_obrigatorios: [...f.documentos_obrigatorios, d] }));
  };

  const removeDocObrig = (i: number) =>
    setForm(f => ({ ...f, documentos_obrigatorios: f.documentos_obrigatorios.filter((_, idx) => idx !== i) }));

  return (
    <ProfLayout>
      <div className="p-4">
        <div className="breadcrumb mb-4">
          <button onClick={() => navigate('/prof/dashboard')}>Início</button>
          <span>›</span>
          <span>Gerenciar Tarefas</span>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-border mb-4">
            <div className="panel-header">{editingId ? 'EDITAR TAREFA' : 'NOVA TAREFA'}</div>
            <div className="p-4 space-y-3">
              <div>
                <label className="form-label required">Título da Tarefa</label>
                <input type="text" className="form-field" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Ex: Petição Inicial — Responsabilidade Civil" />
              </div>

              <div>
                <label className="form-label">Enunciado / Descrição</label>
                <textarea className="form-field min-h-28" rows={5} value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descreva o caso, instruções e objetivos da tarefa..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="form-label">Turma</label>
                  <select className="form-field" value={form.turma_id} onChange={e => setForm(f => ({ ...f, turma_id: e.target.value }))}>
                    {demoTurmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Data de Início</label>
                  <input type="date" className="form-field" value={form.data_inicio} onChange={e => setForm(f => ({ ...f, data_inicio: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Prazo Final</label>
                  <input type="date" className="form-field" value={form.prazo} onChange={e => setForm(f => ({ ...f, prazo: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="form-label">Documentos Obrigatórios</label>
                <div className="flex flex-wrap gap-1 mb-1">
                  {form.documentos_obrigatorios.map((d, i) => (
                    <span key={i} className="flex items-center gap-1 badge-info text-[10px] px-2 py-0.5">
                      {d}
                      <button onClick={() => removeDocObrig(i)} className="ml-1 text-white hover:opacity-70">×</button>
                    </span>
                  ))}
                </div>
                <button className="btn-secondary text-[11px] flex items-center gap-1" onClick={addDocObrig}>
                  <Plus size={11} /> Adicionar
                </button>
              </div>

              <div>
                <label className="form-label required">Tipo de Atividade</label>
                <div className="flex gap-4 mt-1">
                  <label className="pje-radio">
                    <input
                      type="radio"
                      name="tipo_atividade"
                      value="peticao_inicial"
                      checked={form.tipo_atividade === 'peticao_inicial'}
                      onChange={() => setForm(f => ({ ...f, tipo_atividade: 'peticao_inicial', peticao_referencia: '' }))}
                    />
                    <span>Petição Inicial (autor)</span>
                  </label>
                  <label className="pje-radio">
                    <input
                      type="radio"
                      name="tipo_atividade"
                      value="defesa"
                      checked={form.tipo_atividade === 'defesa'}
                      onChange={() => setForm(f => ({ ...f, tipo_atividade: 'defesa' }))}
                    />
                    <span>Defesa / Contestação (réu)</span>
                  </label>
                </div>
              </div>

              {form.tipo_atividade === 'defesa' && (
                <div>
                  <label className="form-label required">Petição Inicial de Referência</label>
                  <div className="text-[11px] text-muted-foreground mb-1">
                    Cole aqui o texto da petição inicial que o aluno deverá contestar.
                  </div>
                  <textarea
                    className="form-field min-h-40 font-mono text-[11px]"
                    rows={10}
                    value={form.peticao_referencia}
                    onChange={e => setForm(f => ({ ...f, peticao_referencia: e.target.value }))}
                    placeholder="Cole aqui o texto completo da petição inicial (exordial) que servirá de referência..."
                  />
                </div>
              )}

              <div>
                <label className="pje-checkbox">
                  <input type="checkbox" checked={form.ativa} onChange={e => setForm(f => ({ ...f, ativa: e.target.checked }))} />
                  <span>Tarefa ativa (visível para alunos)</span>
                </label>
              </div>

              <div className="flex gap-2">
                <button className="btn-primary" onClick={salvar}>
                  {editingId ? '✓ Salvar Alterações' : '+ Criar Tarefa'}
                </button>
                <button className="btn-secondary" onClick={resetForm}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className="bg-white border border-border">
          <div className="panel-header flex items-center justify-between">
            <span>TAREFAS ({tarefas.length})</span>
            {!showForm && (
              <button className="btn-success text-[10px] py-0.5 px-2 flex items-center gap-1" onClick={() => setShowForm(true)}>
                <Plus size={12} /> Nova Tarefa
              </button>
            )}
          </div>

          {loading && <div className="p-4 text-center text-muted-foreground text-[12px]">Carregando...</div>}

          {!loading && tarefas.length === 0 && (
            <div className="p-6 text-center text-[12px] text-muted-foreground">
              Nenhuma tarefa criada.{' '}
              <button className="underline" style={{ color: 'hsl(210,100%,20%)' }} onClick={() => setShowForm(true)}>
                Criar primeira tarefa
              </button>
            </div>
          )}

          <div className="divide-y divide-border">
            {tarefas.map(t => {
              const prazoDate = t.prazo ? new Date(t.prazo) : null;
              const vencido = prazoDate && prazoDate < new Date();
              return (
                <div key={t.id} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[12px] font-semibold ${!t.ativa ? 'text-muted-foreground line-through' : ''}`}>
                          {t.titulo}
                        </span>
                        {t.ativa ? <span className="badge-success">Ativa</span> : <span className="badge-neutral">Inativa</span>}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {t.prazo ? `Prazo: ${formatDate(t.prazo)}` : 'Sem prazo'}
                        {vencido && <span className="ml-2 text-red-500 font-bold">VENCIDO</span>}
                        {t.turma_id && <span className="ml-2">· {demoTurmas.find(tu => tu.id === t.turma_id)?.nome}</span>}
                      </div>
                      {(t.documentos_obrigatorios as string[])?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(t.documentos_obrigatorios as string[]).map(d => (
                            <span key={d} className="badge-info text-[9px]">{d}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button className="btn-secondary text-[10px] py-0.5 px-2 flex items-center gap-0.5" onClick={() => startEdit(t)}>
                        <Edit size={11} /> Editar
                      </button>
                      <button className="btn-danger text-[10px] py-0.5 px-2" onClick={() => excluir(t.id)}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProfLayout>
  );
}
