import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EprocLayout from '@/components/layout/EprocLayout';
import {
  FileText, Bell, FolderOpen, PlusCircle, CheckCircle,
  Clock, AlertCircle, ArrowRight
} from 'lucide-react';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import {
  getDemoProcessos, getDemoIntimacoesAluno, getDemoTarefas,
  getDemoIntimacoesNaoLidas
} from '@/data/demoStore';
import type { Processo, Tarefa, Intimacao } from '@/integrations/supabase/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function statusLabel(s: string): { label: string; cls: string } {
  const map: Record<string, { label: string; cls: string }> = {
    em_andamento: { label: 'Em andamento', cls: 'badge-info' },
    aguardando_resposta: { label: 'Aguardando resposta', cls: 'badge-warning' },
    com_despacho: { label: 'Com despacho', cls: 'badge-warning' },
    encerrado: { label: 'Encerrado', cls: 'badge-neutral' },
    devolvido: { label: 'Devolvido p/ ajuste', cls: 'badge-danger' },
  };
  return map[s] ?? { label: s, cls: 'badge-neutral' };
}

export default function DashboardAlunoPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [intimacoes, setIntimacoes] = useState<Intimacao[]>([]);
  const [intimacoesNaoLidas, setIntimacoesNaoLidas] = useState(0);

  useEffect(() => {
    if (!user) return;

    if (DEMO_MODE) {
      setProcessos(getDemoProcessos(user.id));
      setIntimacoes(getDemoIntimacoesAluno(user.id));
      setIntimacoesNaoLidas(getDemoIntimacoesNaoLidas(user.id));
      const tarefasAll = getDemoTarefas();
      setTarefas(tarefasAll.filter(t => t.turma_id === user.turma_id && t.ativa));
      return;
    }

    Promise.all([
      supabase!.from('processos').select('*').eq('aluno_id', user.id).order('created_at', { ascending: false }),
      supabase!.from('intimacoes').select('*').eq('destinatario_id', user.id).order('created_at', { ascending: false }),
      supabase!.from('tarefas').select('*').eq('turma_id', user.turma_id ?? '').eq('ativa', true),
    ]).then(([pRes, iRes, tRes]) => {
      if (pRes.data) setProcessos(pRes.data);
      if (iRes.data) {
        setIntimacoes(iRes.data);
        setIntimacoesNaoLidas(iRes.data.filter(i => !i.lida).length);
      }
      if (tRes.data) setTarefas(tRes.data);
    });
  }, [user]);

  const processosAtivos = processos.filter(p => p.status !== 'encerrado');
  const tarefasPendentes = tarefas.filter(t => {
    const hasProcesso = processos.some(p => p.tarefa_id === t.id);
    return !hasProcesso;
  });

  return (
    <EprocLayout intimacoesCount={intimacoesNaoLidas}>
      <div className="p-4">
        {/* Breadcrumb */}
        <div className="breadcrumb mb-4">
          <span>Início</span>
          <span>›</span>
          <span>Painel do Advogado</span>
        </div>

        {/* Welcome */}
        <div className="bg-white border border-border p-4 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[14px] font-bold" style={{ color: 'hsl(210, 100%, 20%)' }}>
                Bem-vindo(a), {user?.nome_completo}
              </div>
              <div className="text-[12px] text-muted-foreground mt-0.5">
                <span className="font-semibold">Advogado(a) Simulado(a)</span> ·
                <span className="ml-1">{user?.oab_simulado}</span> ·
                <span className="ml-1">Matrícula: {user?.matricula}</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                Faculdade Milton Campos · Grupo Anima Educação
              </div>
            </div>
            <button
              className="btn-primary flex items-center gap-2"
              onClick={() => navigate('/peticao-inicial')}
            >
              <PlusCircle size={14} />
              Nova Petição
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <SummaryCard
            icon={<FolderOpen size={20} />}
            label="Processos em Andamento"
            value={processosAtivos.length}
            color="blue"
            onClick={() => navigate('/meus-processos')}
          />
          <SummaryCard
            icon={<Bell size={20} />}
            label="Intimações Não Lidas"
            value={intimacoesNaoLidas}
            color={intimacoesNaoLidas > 0 ? 'red' : 'green'}
            onClick={() => navigate('/intimacoes')}
          />
          <SummaryCard
            icon={<Clock size={20} />}
            label="Tarefas Pendentes"
            value={tarefasPendentes.length}
            color={tarefasPendentes.length > 0 ? 'orange' : 'green'}
            onClick={() => navigate('/meus-processos')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tarefas pendentes */}
          <div className="bg-white border border-border">
            <div className="panel-header flex items-center justify-between">
              <span>TAREFAS DO PROFESSOR</span>
            </div>
            <div className="divide-y divide-border">
              {tarefas.length === 0 && (
                <div className="p-4 text-[12px] text-muted-foreground text-center">
                  Nenhuma tarefa ativa no momento.
                </div>
              )}
              {tarefas.map(t => {
                const hasProcesso = processos.some(p => p.tarefa_id === t.id);
                const prazoDate = t.prazo ? new Date(t.prazo) : null;
                const vencido = prazoDate && prazoDate < new Date();
                return (
                  <div key={t.id} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[13px] font-semibold">{t.titulo}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          Prazo: {t.prazo ? formatDate(t.prazo) : 'Sem prazo'}
                          {vencido && <span className="ml-2 text-red-500 font-bold">VENCIDO</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasProcesso
                          ? <span className="badge-success">Protocolado</span>
                          : <span className="badge-warning">Pendente</span>}
                        {!hasProcesso && (
                          <button
                            className="btn-primary text-[11px] px-2 py-1 flex items-center gap-1"
                            onClick={() => navigate(`/peticao-inicial?tarefa=${t.id}`)}
                          >
                            <ArrowRight size={11} /> Peticionar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Últimas movimentações */}
          <div className="bg-white border border-border">
            <div className="panel-header">ÚLTIMAS MOVIMENTAÇÕES</div>
            <div className="divide-y divide-border">
              {processos.length === 0 && (
                <div className="p-4 text-[12px] text-muted-foreground text-center">
                  Nenhum processo protocolado ainda.
                </div>
              )}
              {processos.slice(0, 5).map(p => {
                const st = statusLabel(p.status);
                return (
                  <div
                    key={p.id}
                    className="p-3 cursor-pointer hover:bg-muted"
                    onClick={() => navigate(`/processo/${p.id}`)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[12px] font-semibold font-mono">{p.numero_processo}</div>
                        <div className="text-[11px] text-muted-foreground">{p.classe_processual}</div>
                        <div className="text-[11px] text-muted-foreground">{p.vara}</div>
                      </div>
                      <div className="text-right">
                        <span className={st.cls}>{st.label}</span>
                        {p.nota != null && (
                          <div className="text-[11px] mt-1 font-bold" style={{ color: 'hsl(210,100%,20%)' }}>
                            Nota: {p.nota.toFixed(1)}
                          </div>
                        )}
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {formatDate(p.updated_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {processos.length > 0 && (
                <div className="p-2 text-center">
                  <button
                    className="text-[11px] hover:underline"
                    style={{ color: 'hsl(210,100%,20%)' }}
                    onClick={() => navigate('/meus-processos')}
                  >
                    Ver todos os processos →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Intimações recentes */}
          <div className="bg-white border border-border lg:col-span-2">
            <div className="panel-header flex items-center justify-between">
              <span>INTIMAÇÕES RECENTES</span>
              <button
                className="text-[10px] text-white underline"
                onClick={() => navigate('/intimacoes')}
              >
                Ver todas
              </button>
            </div>
            <div className="divide-y divide-border">
              {intimacoes.length === 0 && (
                <div className="p-4 text-[12px] text-muted-foreground text-center">
                  Nenhuma intimação recebida.
                </div>
              )}
              {intimacoes.slice(0, 3).map(i => (
                <div
                  key={i.id}
                  className={`p-3 cursor-pointer hover:bg-muted flex items-start gap-3 ${!i.lida ? 'bg-blue-50' : ''}`}
                  onClick={() => navigate('/intimacoes')}
                >
                  {!i.lida
                    ? <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                    : <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />}
                  <div className="flex-1">
                    <div className="text-[12px] line-clamp-2">{i.texto.split('\n')[0]}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {formatDate(i.created_at)} · Processo: {i.processo_id.includes('demo') ? '1000042-33.2025.4.01.3800' : i.processo_id}
                    </div>
                    {i.prazo_resposta && (
                      <div className="text-[11px] text-orange-600">
                        Prazo: {formatDate(i.prazo_resposta)}
                      </div>
                    )}
                  </div>
                  {!i.lida && <span className="badge-danger">NÃO LIDA</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EprocLayout>
  );
}

function SummaryCard({
  icon, label, value, color, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'blue' | 'red' | 'green' | 'orange';
  onClick: () => void;
}) {
  const colors = {
    blue: 'hsl(210,100%,20%)',
    red: 'hsl(0,70%,45%)',
    green: 'hsl(120,40%,36%)',
    orange: 'hsl(40,85%,45%)',
  };
  return (
    <div
      className="bg-white border border-border p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="text-white rounded-sm p-2" style={{ background: colors[color] }}>
          {icon}
        </div>
        <div>
          <div className="text-[22px] font-bold" style={{ color: colors[color] }}>{value}</div>
          <div className="text-[11px] text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}
