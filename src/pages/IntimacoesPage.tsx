import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EprocLayout from '@/components/layout/EprocLayout';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import { getDemoIntimacoesAluno, marcarIntimacoesLida } from '@/data/demoStore';
import type { Intimacao } from '@/integrations/supabase/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR');
}

function getDaysLeft(prazo: string): number {
  return Math.ceil((new Date(prazo).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function IntimacoesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [intimacoes, setIntimacoes] = useState<Intimacao[]>([]);
  const [selected, setSelected] = useState<Intimacao | null>(null);
  const [loading, setLoading] = useState(true);

  const loadIntimacooes = () => {
    if (!user) return;
    if (DEMO_MODE) {
      setIntimacoes(getDemoIntimacoesAluno(user.id));
      setLoading(false);
      return;
    }
    supabase!
      .from('intimacoes')
      .select('*')
      .eq('destinatario_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setIntimacoes(data);
        setLoading(false);
      });
  };

  useEffect(loadIntimacooes, [user]);

  const marcarCiencia = async (intimacao: Intimacao) => {
    if (intimacao.lida) return;

    if (DEMO_MODE) {
      marcarIntimacoesLida(intimacao.id);
      loadIntimacooes();
      if (selected?.id === intimacao.id) {
        setSelected({ ...intimacao, lida: true, data_ciencia: new Date().toISOString() });
      }
      return;
    }

    await supabase!
      .from('intimacoes')
      .update({ lida: true, data_ciencia: new Date().toISOString() })
      .eq('id', intimacao.id);
    loadIntimacooes();
  };

  const naoLidas = intimacoes.filter(i => !i.lida).length;

  return (
    <EprocLayout intimacoesCount={naoLidas}>
      <div className="p-4">
        <div className="breadcrumb mb-4">
          <button onClick={() => navigate('/dashboard')}>Início</button>
          <span>›</span>
          <span>Intimações e Citações</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Lista */}
          <div className="bg-white border border-border">
            <div className="panel-header flex items-center justify-between">
              <span>CAIXA DE INTIMAÇÕES</span>
              {naoLidas > 0 && (
                <span className="badge-danger">{naoLidas} não lida(s)</span>
              )}
            </div>

            {loading && <div className="p-6 text-center text-muted-foreground text-[12px]">Carregando...</div>}

            {!loading && intimacoes.length === 0 && (
              <div className="p-6 text-center text-muted-foreground text-[12px]">
                Nenhuma intimação recebida.
              </div>
            )}

            <div className="divide-y divide-border">
              {intimacoes.map(i => (
                <div
                  key={i.id}
                  className={`p-3 cursor-pointer hover:bg-muted ${!i.lida ? 'bg-blue-50' : ''} ${selected?.id === i.id ? 'bg-blue-100' : ''}`}
                  onClick={() => { setSelected(i); if (!i.lida) marcarCiencia(i); }}
                >
                  <div className="flex items-start gap-2">
                    {!i.lida
                      ? <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                      : <CheckCircle size={14} className="text-green-600 mt-0.5 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className={`text-[12px] ${!i.lida ? 'font-bold' : ''} line-clamp-2`}>
                        {i.texto.split('\n')[0]}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {formatDate(i.created_at)}
                      </div>
                      {i.prazo_resposta && !i.lida && (
                        <div className="text-[11px] text-orange-600 font-semibold mt-0.5">
                          ⏰ Prazo: {getDaysLeft(i.prazo_resposta)} dias restantes
                        </div>
                      )}
                    </div>
                    {!i.lida && <span className="badge-danger shrink-0">NOVA</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detalhes */}
          <div className="bg-white border border-border">
            <div className="panel-header">DETALHES DA INTIMAÇÃO</div>
            {!selected && (
              <div className="p-6 text-center text-muted-foreground text-[12px]">
                Selecione uma intimação para visualizar.
              </div>
            )}
            {selected && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[12px] font-bold">
                    {selected.lida ? '✅ Intimação visualizada' : '📬 Nova Intimação'}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{formatDate(selected.created_at)}</div>
                </div>

                <div className="border border-border p-3 bg-blue-50 text-[12px] whitespace-pre-line mb-3">
                  {selected.texto}
                </div>

                {selected.prazo_resposta && (
                  <div className={`text-[12px] font-bold mb-3 ${getDaysLeft(selected.prazo_resposta) <= 3 ? 'text-red-600' : 'text-orange-600'}`}>
                    ⏰ Prazo para resposta: {formatDate(selected.prazo_resposta)}
                    {selected.lida && ` (${getDaysLeft(selected.prazo_resposta)} dias restantes)`}
                  </div>
                )}

                {selected.data_ciencia && (
                  <div className="alert-success text-[11px]">
                    ✅ Ciência registrada em: {formatDate(selected.data_ciencia)}
                  </div>
                )}

                {!selected.lida && (
                  <button
                    className="btn-primary w-full mt-3"
                    onClick={() => marcarCiencia(selected)}
                  >
                    ✓ REGISTRAR CIÊNCIA
                  </button>
                )}

                <button
                  className="btn-secondary w-full mt-2"
                  onClick={() => navigate(`/processo/${selected.processo_id}`)}
                >
                  Ver Processo
                </button>

                {selected.lida && (
                  <button
                    className="btn-primary w-full mt-2"
                    onClick={() => navigate(`/peticao-incidental?processo=${selected.processo_id}`)}
                  >
                    + Protocolar Petição Incidental
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </EprocLayout>
  );
}
