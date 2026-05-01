import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EprocLayout from '@/components/layout/EprocLayout';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import {
  getDemoTarefas, getAllDemoProcessos, demoTurmas
} from '@/data/demoStore';
import type { Processo, Tarefa } from '@/integrations/supabase/types';
import { BookOpen, Users, ClipboardList, CheckCircle, Clock } from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

function statusLabel(s: string): { label: string; cls: string } {
  const map: Record<string, { label: string; cls: string }> = {
    em_andamento: { label: 'Aguardando Correção', cls: 'badge-warning' },
    aguardando_resposta: { label: 'Aguardando Resposta', cls: 'badge-info' },
    com_despacho: { label: 'Corrigido', cls: 'badge-success' },
    encerrado: { label: 'Encerrado', cls: 'badge-neutral' },
    devolvido: { label: 'Devolvido', cls: 'badge-danger' },
  };
  return map[s] ?? { label: s, cls: 'badge-neutral' };
}

interface ProcessoComAluno extends Processo {
  nome_aluno?: string;
}

export default function DashboardProfessoraPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processos, setProcessos] = useState<ProcessoComAluno[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (DEMO_MODE) {
      const allProc = getAllDemoProcessos();
      setProcessos(allProc.map(p => ({ ...p, nome_aluno: 'Luiz Cordeiro' })));
      const tarefasProf = getDemoTarefas().filter(t => t.professor_id === user.id);
      setTarefas(tarefasProf);
      setLoading(false);
      return;
    }

    Promise.all([
      supabase!
        .from('processos')
        .select('*, profiles!processos_aluno_id_fkey(nome_completo)')
        .order('created_at', { ascending: false }),
      supabase!
        .from('tarefas')
        .select('*')
        .eq('professor_id', user.id)
        .order('created_at', { ascending: false }),
    ]).then(([pRes, tRes]) => {
      if (pRes.data) {
        setProcessos(pRes.data.map((p: any) => ({
          ...p,
          nome_aluno: p.profiles?.nome_completo ?? 'Aluno',
        })));
      }
      if (tRes.data) setTarefas(tRes.data);
      setLoading(false);
    });
  }, [user]);

  const pendentes = processos.filter(p => p.status === 'em_andamento');
  const corrigidos = processos.filter(p => p.status === 'com_despacho' || p.status === 'encerrado');
  const tarefasAtivas = tarefas.filter(t => t.ativa);

  return (
    <EprocLayout>
      <div className="p-4">
        <div className="breadcrumb mb-4">
          <span>Início</span>
          <span>›</span>
          <span>Painel da Professora</span>
        </div>

        {/* Welcome */}
        <div className="bg-white border border-border p-4 mb-4">
          <div className="text-[14px] font-bold" style={{ color: 'hsl(210,100%,20%)' }}>
            Painel da Magistrada Simulada — {user?.nome_completo}
          </div>
          <div className="text-[12px] text-muted-foreground mt-0.5">
            Gerencie tarefas, corrija petições e forneça feedback aos alunos.
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Turmas: {demoTurmas.map(t => t.nome).join(' · ')}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <SCard icon={<ClipboardList size={18} />} label="Petições Pendentes" value={pendentes.length} color="orange" onClick={() => navigate('/prof/peticoes')} />
          <SCard icon={<CheckCircle size={18} />} label="Corrigidas" value={corrigidos.length} color="green" onClick={() => navigate('/prof/peticoes')} />
          <SCard icon={<BookOpen size={18} />} label="Tarefas Ativas" value={tarefasAtivas.length} color="blue" onClick={() => navigate('/prof/tarefas')} />
          <SCard icon={<Users size={18} />} label="Alunos" value={2} color="blue" onClick={() => navigate('/prof/alunos')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Fila de petições */}
          <div className="bg-white border border-border">
            <div className="panel-header flex items-center justify-between">
              <span>PETIÇÕES RECEBIDAS — AGUARDANDO CORREÇÃO</span>
              <button className="text-[10px] text-white underline" onClick={() => navigate('/prof/peticoes')}>
                Ver todas
              </button>
            </div>
            {loading && <div className="p-4 text-center text-[12px] text-muted-foreground">Carregando...</div>}
            {!loading && pendentes.length === 0 && (
              <div className="p-4 text-center text-[12px] text-muted-foreground">Nenhuma petição pendente.</div>
            )}
            <div className="divide-y divide-border">
              {pendentes.slice(0, 5).map(p => (
                <div key={p.id} className="p-3 hover:bg-muted cursor-pointer" onClick={() => navigate(`/prof/correcao/${p.id}`)}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[12px] font-bold">{p.nome_aluno}</div>
                      <div className="text-[11px] font-mono">{p.numero_processo}</div>
                      <div className="text-[11px] text-muted-foreground">{p.classe_processual}</div>
                    </div>
                    <div className="text-right">
                      <span className="badge-warning">Pendente</span>
                      <div className="text-[10px] text-muted-foreground mt-1">{formatDate(p.created_at)}</div>
                    </div>
                  </div>
                  <button className="btn-primary text-[10px] py-0.5 px-2 mt-2">
                    ✏ Corrigir
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tarefas ativas */}
          <div className="bg-white border border-border">
            <div className="panel-header flex items-center justify-between">
              <span>TAREFAS ATIVAS</span>
              <div className="flex gap-1">
                <button className="text-[10px] text-white underline" onClick={() => navigate('/prof/tarefas/nova')}>+ Nova</button>
                <span className="text-[10px] text-white mx-1">|</span>
                <button className="text-[10px] text-white underline" onClick={() => navigate('/prof/tarefas')}>Ver todas</button>
              </div>
            </div>
            {loading && <div className="p-4 text-center text-[12px] text-muted-foreground">Carregando...</div>}
            {!loading && tarefasAtivas.length === 0 && (
              <div className="p-4 text-center text-[12px] text-muted-foreground">
                Nenhuma tarefa ativa.{' '}
                <button className="underline" style={{ color: 'hsl(210,100%,20%)' }} onClick={() => navigate('/prof/tarefas/nova')}>
                  Criar primeira tarefa
                </button>
              </div>
            )}
            <div className="divide-y divide-border">
              {tarefasAtivas.map(t => {
                const prazoDate = t.prazo ? new Date(t.prazo) : null;
                const vencido = prazoDate && prazoDate < new Date();
                const enviadas = processos.filter(p => p.tarefa_id === t.id).length;
                return (
                  <div key={t.id} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[12px] font-semibold">{t.titulo}</div>
                        <div className="text-[11px] text-muted-foreground">
                          Prazo: {t.prazo ? formatDate(t.prazo) : 'Sem prazo'}
                          {vencido && <span className="ml-2 text-red-500 font-bold">VENCIDO</span>}
                        </div>
                        <div className="text-[11px] mt-0.5">
                          <span className="badge-info">{enviadas} petição(ões) recebida(s)</span>
                        </div>
                      </div>
                      <button
                        className="btn-secondary text-[10px] py-0.5 px-2 shrink-0"
                        onClick={() => navigate('/prof/tarefas')}
                      >
                        Gerenciar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </EprocLayout>
  );
}

function SCard({ icon, label, value, color, onClick }: {
  icon: React.ReactNode; label: string; value: number;
  color: 'blue' | 'green' | 'orange' | 'red'; onClick: () => void;
}) {
  const colors = {
    blue: 'hsl(210,100%,20%)', green: 'hsl(120,40%,36%)',
    orange: 'hsl(40,85%,45%)', red: 'hsl(0,70%,45%)',
  };
  return (
    <div className="bg-white border border-border p-3 cursor-pointer hover:shadow-sm" onClick={onClick}>
      <div className="flex items-center gap-2">
        <div className="text-white rounded-sm p-1.5" style={{ background: colors[color] }}>{icon}</div>
        <div>
          <div className="text-[20px] font-bold" style={{ color: colors[color] }}>{value}</div>
          <div className="text-[10px] text-muted-foreground leading-tight">{label}</div>
        </div>
      </div>
    </div>
  );
}
