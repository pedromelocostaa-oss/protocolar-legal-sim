import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EprocLayout from '@/components/layout/EprocLayout';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import { getDemoTarefas } from '@/data/demoStore';
import type { Tarefa } from '@/integrations/supabase/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function PeticaoReferenciaPage() {
  const { tarefaId } = useParams<{ tarefaId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tarefaId || !user) return;

    if (DEMO_MODE) {
      const t = getDemoTarefas().find(t => t.id === tarefaId) ?? null;
      setTarefa(t);
      setLoading(false);
      return;
    }

    supabase!
      .from('tarefas')
      .select('*')
      .eq('id', tarefaId)
      .single()
      .then(({ data }) => {
        if (data) setTarefa(data);
        setLoading(false);
      });
  }, [tarefaId, user]);

  if (loading) {
    return (
      <EprocLayout>
        <div className="p-8 text-center text-muted-foreground">Carregando...</div>
      </EprocLayout>
    );
  }

  if (!tarefa || !tarefa.peticao_referencia) {
    return (
      <EprocLayout>
        <div className="p-8 text-center text-muted-foreground">
          Petição de referência não encontrada ou não disponível.
        </div>
      </EprocLayout>
    );
  }

  const dataDistribuicao = new Date().toLocaleDateString('pt-BR');
  const prazoStr = tarefa.prazo ? formatDate(tarefa.prazo) : 'Não definido';

  return (
    <EprocLayout>
      <div>
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button onClick={() => navigate('/dashboard')}>Início</button>
          <span>›</span>
          <button onClick={() => navigate('/dashboard')}>Citações</button>
          <span>›</span>
          <span>Petição Inicial — {tarefa.titulo}</span>
        </div>

        <div className="p-4 space-y-4 max-w-4xl">
          {/* Dados da Citação */}
          <div className="bg-white border border-border">
            <div className="panel-header">DADOS DA CITAÇÃO</div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <CellInfo label="Processo" value="1000099-01.2025.4.01.3800" mono />
              <CellInfo label="Classe" value="Procedimento Comum Cível" />
              <CellInfo label="Vara" value="1ª Vara Federal de Belo Horizonte" />
              <CellInfo label="Data de Citação" value={dataDistribuicao} />
              <CellInfo label="Prazo para Contestar" value={prazoStr} urgent />
              <CellInfo label="Assunto" value={tarefa.titulo} />
            </div>
          </div>

          {/* Teor da Petição */}
          <div className="bg-white border border-border">
            <div className="panel-header flex items-center justify-between">
              <span>TEOR DA PETIÇÃO INICIAL</span>
              {tarefa.peticao_referencia_arquivo_nome && (
                <span className="text-[10px] text-white opacity-80">
                  📎 {tarefa.peticao_referencia_arquivo_nome}
                </span>
              )}
            </div>
            <div className="p-6">
              <pre
                className="whitespace-pre-wrap text-[12px] leading-relaxed"
                style={{ fontFamily: "'Courier New', Courier, monospace", lineHeight: '1.8' }}
              >
                {tarefa.peticao_referencia}
              </pre>
            </div>
          </div>

          {/* Action */}
          <div className="flex gap-3">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
              ← Voltar ao Painel
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate(`/peticao-incidental?tarefa=${tarefaId}&tipo=Contesta%C3%A7%C3%A3o`)}
            >
              ⚖ Protocolar Contestação
            </button>
          </div>
        </div>
      </div>
    </EprocLayout>
  );
}

function CellInfo({ label, value, mono, urgent }: { label: string; value: string; mono?: boolean; urgent?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-bold text-muted-foreground uppercase">{label}</div>
      <div
        className={`text-[12px] ${mono ? 'font-mono' : ''}`}
        style={urgent ? { color: 'hsl(0,70%,40%)', fontWeight: 700 } : undefined}
      >
        {value}
      </div>
    </div>
  );
}
