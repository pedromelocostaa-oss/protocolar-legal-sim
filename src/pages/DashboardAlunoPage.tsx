import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EprocLayout from '@/components/layout/EprocLayout';
import { PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import {
  getDemoProcessos, getDemoIntimacoesAluno, getDemoTarefas,
  getDemoIntimacoesNaoLidas, getDemoTarefasDefesa,
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
  const [tarefasDefesa, setTarefasDefesa] = useState<Tarefa[]>([]);
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
      setTarefasDefesa(getDemoTarefasDefesa(user.turma_id ?? ''));
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

  const tarefasPendentes = tarefas.filter(t => !processos.some(p => p.tarefa_id === t.id));

  // Counters for CITAÇÕES/INTIMAÇÕES section
  const now = new Date();
  const intimacoesComPrazo = intimacoes.filter(i =>
    i.prazo_resposta && new Date(i.prazo_resposta) >= now
  );
  const intimacoesUrgentes = intimacoes.filter(i => {
    if (!i.prazo_resposta) return false;
    const prazo = new Date(i.prazo_resposta);
    const diffDays = (prazo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 5;
  });
  const intimacoesLidasComPrazo = intimacoes.filter(i =>
    i.lida && i.prazo_resposta && new Date(i.prazo_resposta) >= now
  );

  return (
    <EprocLayout intimacoesCount={intimacoesNaoLidas}>
      <div className="p-4">
        {/* Breadcrumb */}
        <div className="breadcrumb mb-4">
          <span>Início</span>
          <span>›</span>
          <span>Painel do Advogado</span>
        </div>

        {/* Welcome bar */}
        <div className="bg-white border border-border p-3 mb-4 flex items-center justify-between">
          <div>
            <span className="text-[13px] font-bold" style={{ color: 'hsl(210, 100%, 20%)' }}>
              {user?.nome_completo}
            </span>
            <span className="text-[11px] text-muted-foreground ml-2">
              {user?.oab_simulado} · Matrícula: {user?.matricula}
            </span>
          </div>
          <button
            className="btn-primary flex items-center gap-1.5 text-[11px]"
            onClick={() => navigate('/peticao-inicial')}
          >
            <PlusCircle size={13} />
            Nova Petição
          </button>
        </div>

        {/* SEÇÃO 1 — CITAÇÕES/INTIMAÇÕES */}
        <div className="eproc-painel-section">
          <div className="eproc-painel-section-header">CITAÇÕES/INTIMAÇÕES</div>
          <div className="eproc-painel-row">
            <span className="eproc-painel-row-label">Processos pendentes de citação/intimação</span>
            <button
              className="eproc-painel-counter"
              onClick={() => navigate('/intimacoes')}
            >
              {intimacoesNaoLidas}
            </button>
          </div>
          <div className="eproc-painel-row">
            <span className="eproc-painel-row-label">Processos com prazo em aberto</span>
            <button
              className="eproc-painel-counter"
              onClick={() => navigate('/intimacoes')}
            >
              {intimacoesComPrazo.length}
            </button>
          </div>
          <div className="eproc-painel-row">
            <span className="eproc-painel-row-label">Processos com prazo em aberto — urgente</span>
            <button
              className="eproc-painel-counter-urgent"
              onClick={() => navigate('/intimacoes')}
            >
              {intimacoesUrgentes.length}
            </button>
          </div>
          <div className="eproc-painel-row">
            <span className="eproc-painel-row-label">Visualizados com prazo em aberto</span>
            <button
              className="eproc-painel-counter"
              onClick={() => navigate('/intimacoes')}
            >
              {intimacoesLidasComPrazo.length}
            </button>
          </div>
        </div>

        {/* SEÇÃO 1b — CITAÇÃO / DEFESA */}
        {tarefasDefesa.length > 0 && (
          <div className="eproc-painel-section">
            <div className="eproc-painel-section-header">CITAÇÃO — AÇÃO EM QUE FOI CITADO(A)</div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Processo</th>
                    <th>Tarefa / Enunciado</th>
                    <th>Prazo para Contestar</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tarefasDefesa.map(t => {
                    const vencido = t.prazo && new Date(t.prazo) < now;
                    return (
                      <tr key={t.id}>
                        <td className="font-mono text-[11px]">1000099-01.2025.4.01.3800</td>
                        <td className="font-semibold">{t.titulo}</td>
                        <td className={`font-bold ${vencido ? 'text-red-600' : 'text-orange-600'}`}>
                          {t.prazo ? formatDate(t.prazo) : '—'}
                          {vencido && <span className="ml-1 text-[10px]">VENCIDO</span>}
                        </td>
                        <td>
                          <div className="flex gap-3">
                            <button
                              className="text-[11px] hover:underline cursor-pointer"
                              style={{ color: 'hsl(210,100%,20%)' }}
                              onClick={() => navigate(`/peticao-referencia/${t.id}`)}
                            >
                              [Ver Petição Inicial]
                            </button>
                            <button
                              className="text-[11px] hover:underline cursor-pointer"
                              style={{ color: 'hsl(210,100%,20%)' }}
                              onClick={() => navigate(`/peticao-incidental?tarefa=${t.id}&tipo=Contesta%C3%A7%C3%A3o`)}
                            >
                              [Protocolar Contestação]
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEÇÃO 2 — RELAÇÃO DE PROCESSOS */}
        <div className="eproc-painel-section">
          <div className="eproc-painel-section-header">RELAÇÃO DE PROCESSOS</div>
          <div className="px-3 py-2 border-b border-border flex gap-2">
            <button
              className="btn-primary text-[11px] py-0.5 px-3"
              onClick={() => navigate('/peticao-inicial')}
            >
              Petição Inicial
            </button>
            <button
              className="btn-secondary text-[11px] py-0.5 px-3"
              onClick={() => navigate('/meus-processos')}
            >
              Últimas Movimentações
            </button>
            <button
              className="btn-secondary text-[11px] py-0.5 px-3"
              onClick={() => navigate('/meus-processos')}
            >
              Relação de Processos
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nº Processo</th>
                  <th>Classe</th>
                  <th>Vara</th>
                  <th>Situação</th>
                  <th>Último Evento</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {processos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhum processo protocolado. Clique em "Petição Inicial" para começar.
                    </td>
                  </tr>
                )}
                {processos.slice(0, 8).map(p => {
                  const st = statusLabel(p.status);
                  return (
                    <tr
                      key={p.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/processo/${p.id}`)}
                    >
                      <td className="font-mono text-[11px] font-semibold">{p.numero_processo}</td>
                      <td>{p.classe_processual}</td>
                      <td>{p.vara}</td>
                      <td><span className={st.cls}>{st.label}</span></td>
                      <td className="text-muted-foreground">{p.status === 'em_andamento' ? 'Distribuição' : 'Movimentação'}</td>
                      <td>{formatDate(p.updated_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {processos.length > 8 && (
            <div className="px-3 py-2 border-t border-border text-[11px] text-center">
              <button
                className="hover:underline"
                style={{ color: 'hsl(210,100%,20%)' }}
                onClick={() => navigate('/meus-processos')}
              >
                Ver todos os {processos.length} processos →
              </button>
            </div>
          )}
        </div>

        {/* SEÇÃO 3 — TAREFAS DO PROFESSOR */}
        <div className="eproc-painel-section">
          <div className="eproc-painel-section-header">TAREFAS DO PROFESSOR</div>
          {tarefas.length === 0 && (
            <div className="px-3 py-4 text-[12px] text-muted-foreground text-center">
              Nenhuma tarefa ativa no momento.
            </div>
          )}
          {tarefas.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tarefa</th>
                  <th>Prazo</th>
                  <th>Situação</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {tarefas.map(t => {
                  const hasProcesso = processos.some(p => p.tarefa_id === t.id);
                  const prazoDate = t.prazo ? new Date(t.prazo) : null;
                  const vencido = prazoDate && prazoDate < now;
                  return (
                    <tr key={t.id}>
                      <td className="font-semibold">{t.titulo}</td>
                      <td>
                        {t.prazo ? formatDate(t.prazo) : '—'}
                        {vencido && <span className="ml-2 text-red-600 font-bold text-[10px]">VENCIDO</span>}
                      </td>
                      <td>
                        {hasProcesso
                          ? <span className="badge-success">Protocolado</span>
                          : <span className="badge-warning">Pendente</span>}
                      </td>
                      <td>
                        {!hasProcesso && (
                          <button
                            className="btn-primary text-[10px] py-0.5 px-2 flex items-center gap-1"
                            onClick={() => navigate(`/peticao-inicial?tarefa=${t.id}`)}
                          >
                            <ArrowRight size={11} /> Peticionar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* INTIMAÇÕES RECENTES */}
        <div className="eproc-painel-section">
          <div className="eproc-painel-section-header flex items-center justify-between">
            <span>INTIMAÇÕES RECENTES</span>
            <button className="text-[10px] text-white underline opacity-80" onClick={() => navigate('/intimacoes')}>
              Ver todas
            </button>
          </div>
          {intimacoes.length === 0 && (
            <div className="px-3 py-4 text-[12px] text-muted-foreground text-center">
              Nenhuma intimação recebida.
            </div>
          )}
          {intimacoes.slice(0, 3).map(i => (
            <div
              key={i.id}
              className={`eproc-painel-row cursor-pointer hover:bg-muted flex items-start gap-3 ${!i.lida ? 'bg-blue-50' : ''}`}
              onClick={() => navigate('/intimacoes')}
            >
              {!i.lida
                ? <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                : <CheckCircle size={14} className="text-green-600 mt-0.5 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="text-[12px] truncate">{i.texto.split('\n')[0]}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {formatDate(i.created_at)}
                  {i.prazo_resposta && (
                    <span className="ml-2 text-orange-600">Prazo: {formatDate(i.prazo_resposta)}</span>
                  )}
                </div>
              </div>
              {!i.lida && <span className="badge-danger shrink-0">NÃO LIDA</span>}
            </div>
          ))}
        </div>
      </div>
    </EprocLayout>
  );
}
