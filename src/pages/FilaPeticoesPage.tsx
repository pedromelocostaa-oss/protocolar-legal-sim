import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EprocLayout from '@/components/layout/EprocLayout';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import { getAllDemoProcessos } from '@/data/demoStore';
import type { Processo } from '@/integrations/supabase/types';
import { Search } from 'lucide-react';

function formatDate(iso: string) { return new Date(iso).toLocaleDateString('pt-BR'); }

interface ProcessoComAluno extends Processo {
  nome_aluno?: string;
}

function statusLabel(s: string): { label: string; cls: string } {
  const map: Record<string, { label: string; cls: string }> = {
    em_andamento: { label: 'Pendente de Correção', cls: 'badge-warning' },
    aguardando_resposta: { label: 'Aguardando Resposta', cls: 'badge-info' },
    com_despacho: { label: 'Corrigido', cls: 'badge-success' },
    encerrado: { label: 'Encerrado', cls: 'badge-neutral' },
    devolvido: { label: 'Devolvido p/ Ajuste', cls: 'badge-danger' },
  };
  return map[s] ?? { label: s, cls: 'badge-neutral' };
}

export default function FilaPeticoesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processos, setProcessos] = useState<ProcessoComAluno[]>([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (DEMO_MODE) {
      setProcessos(getAllDemoProcessos().map(p => ({ ...p, nome_aluno: 'Luiz Cordeiro' })));
      setLoading(false);
      return;
    }
    supabase!
      .from('processos')
      .select('*, profiles!processos_aluno_id_fkey(nome_completo)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setProcessos(data.map((p: any) => ({ ...p, nome_aluno: p.profiles?.nome_completo ?? 'Aluno' })));
        setLoading(false);
      });
  }, [user]);

  const filtered = processos.filter(p => {
    const matchStatus = !statusFilter || p.status === statusFilter;
    const matchSearch = !filter || (
      p.numero_processo.toLowerCase().includes(filter.toLowerCase()) ||
      p.nome_aluno?.toLowerCase().includes(filter.toLowerCase()) ||
      p.classe_processual.toLowerCase().includes(filter.toLowerCase())
    );
    return matchStatus && matchSearch;
  });

  const pendentes = processos.filter(p => p.status === 'em_andamento').length;

  return (
    <EprocLayout>
      <div className="p-4">
        <div className="breadcrumb mb-4">
          <button onClick={() => navigate('/prof/dashboard')}>Início</button>
          <span>›</span>
          <span>Petições Recebidas</span>
        </div>

        <div className="bg-white border border-border">
          <div className="panel-header flex items-center justify-between">
            <span>FILA DE PETIÇÕES ({filtered.length})</span>
            {pendentes > 0 && <span className="badge-danger">{pendentes} pendente(s)</span>}
          </div>

          <div className="p-3 border-b border-border">
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-48">
                <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  className="form-field pl-7"
                  placeholder="Buscar por aluno, processo, classe..."
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                />
              </div>
              <div className="flex gap-1 flex-wrap">
                {[
                  { val: '', label: 'Todos' },
                  { val: 'em_andamento', label: 'Pendentes' },
                  { val: 'com_despacho', label: 'Corrigidos' },
                  { val: 'encerrado', label: 'Encerrados' },
                ].map(b => (
                  <button
                    key={b.val}
                    className={statusFilter === b.val ? 'btn-primary text-[11px] py-1 px-2' : 'btn-secondary text-[11px] py-1 px-2'}
                    onClick={() => setStatusFilter(b.val)}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading && <div className="p-8 text-center text-muted-foreground text-[12px]">Carregando...</div>}

          {!loading && (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Número do Processo</th>
                    <th>Classe</th>
                    <th>Vara</th>
                    <th>Data Envio</th>
                    <th>Situação</th>
                    <th>Nota</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-6 text-muted-foreground">Nenhuma petição encontrada.</td></tr>
                  )}
                  {filtered.map(p => {
                    const st = statusLabel(p.status);
                    return (
                      <tr key={p.id}>
                        <td className="font-semibold">{p.nome_aluno}</td>
                        <td className="font-mono text-[11px]">{p.numero_processo}</td>
                        <td>{p.classe_processual}</td>
                        <td>{p.vara}</td>
                        <td>{formatDate(p.created_at)}</td>
                        <td><span className={st.cls}>{st.label}</span></td>
                        <td className="text-center font-bold">{p.nota != null ? p.nota.toFixed(1) : '—'}</td>
                        <td>
                          <button
                            className={`${p.status === 'em_andamento' ? 'btn-primary' : 'btn-secondary'} text-[10px] py-0.5 px-2`}
                            onClick={() => navigate(`/prof/correcao/${p.id}`)}
                          >
                            {p.status === 'em_andamento' ? '✏ Corrigir' : '👁 Ver'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </EprocLayout>
  );
}
