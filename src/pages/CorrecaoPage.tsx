import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProfLayout from '@/components/layout/ProfLayout';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import {
  getAllDemoProcessos, getDemoPartes, getDemoDocumentos,
  saveDemoProcesso, saveDemoMovimentacao, saveDemoIntimacao
} from '@/data/demoStore';
import type { Processo, Parte, Documento } from '@/integrations/supabase/types';
import { CheckCircle } from 'lucide-react';

function formatDate(iso: string) { return new Date(iso).toLocaleString('pt-BR'); }

type Acao = 'despacho' | 'emenda' | 'encerrar';

export default function CorrecaoPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [processo, setProcesso] = useState<Processo | null>(null);
  const [partes, setPartes] = useState<Parte[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [nomeAluno, setNomeAluno] = useState('Aluno');
  const [loading, setLoading] = useState(true);

  const [feedback, setFeedback] = useState('');
  const [nota, setNota] = useState('');
  const [prazoResposta, setPrazoResposta] = useState('');
  const [acao, setAcao] = useState<Acao>('despacho');
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    if (DEMO_MODE) {
      const p = getAllDemoProcessos().find(p => p.id === id);
      if (p) {
        setProcesso(p);
        setFeedback(p.feedback_professor ?? '');
        setNota(p.nota != null ? String(p.nota) : '');
        setPartes(getDemoPartes(id));
        setDocumentos(getDemoDocumentos(id));
        setNomeAluno('Luiz Cordeiro');
      }
      setLoading(false);
      return;
    }
    Promise.all([
      supabase!.from('processos').select('*, profiles!processos_aluno_id_fkey(nome_completo)').eq('id', id).single(),
      supabase!.from('partes').select('*').eq('processo_id', id),
      supabase!.from('documentos').select('*').eq('processo_id', id),
    ]).then(([pRes, partRes, docRes]) => {
      if (pRes.data) {
        setProcesso(pRes.data);
        setFeedback((pRes.data as any).feedback_professor ?? '');
        setNota(pRes.data.nota != null ? String(pRes.data.nota) : '');
        setNomeAluno((pRes.data as any).profiles?.nome_completo ?? 'Aluno');
      }
      if (partRes.data) setPartes(partRes.data);
      if (docRes.data) setDocumentos(docRes.data);
      setLoading(false);
    });
  }, [id, user]);

  const salvar = async () => {
    if (!feedback.trim()) { alert('Escreva o feedback/despacho.'); return; }
    if (!nota) { alert('Informe a nota.'); return; }
    const notaNum = parseFloat(nota.replace(',', '.'));
    if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) { alert('Nota deve ser entre 0 e 10.'); return; }

    setSalvando(true);
    const now = new Date().toISOString();

    const novoStatus = acao === 'encerrar' ? 'encerrado' : acao === 'emenda' ? 'devolvido' : 'com_despacho';
    const tipoMov = acao === 'despacho' ? 'despacho' : acao === 'emenda' ? 'solicitacao_emenda' : 'encerramento';

    try {
      if (DEMO_MODE) {
        saveDemoProcesso({
          ...processo!,
          status: novoStatus,
          nota: notaNum,
          feedback_professor: feedback,
          updated_at: now,
        });

        saveDemoMovimentacao({
          id: crypto.randomUUID(),
          processo_id: id!,
          tipo: tipoMov,
          descricao: feedback,
          autor_id: user!.id,
          created_at: now,
        });

        const textoIntimacao = acao === 'encerrar'
          ? `Processo encerrado pela professora.\n\nFeedback final:\n${feedback}\n\nNota atribuída: ${notaNum.toFixed(1)}`
          : acao === 'emenda'
          ? `Solicitação de Emenda à Petição:\n\n${feedback}\n\nPrazo para ajuste: ${prazoResposta ? new Date(`${prazoResposta}T00:00:00Z`).toLocaleDateString('pt-BR') : 'a definir'}`
          : `Despacho da Juíza:\n\n${feedback}\n\nNota atribuída: ${notaNum.toFixed(1)}`;

        saveDemoIntimacao({
          id: crypto.randomUUID(),
          processo_id: id!,
          destinatario_id: processo!.aluno_id,
          remetente_id: user!.id,
          texto: textoIntimacao,
          prazo_resposta: prazoResposta ? `${prazoResposta}T23:59:59Z` : null,
          lida: false,
          data_ciencia: null,
          created_at: now,
        });

      } else {
        await supabase!.from('processos').update({
          status: novoStatus, nota: notaNum, feedback_professor: feedback, updated_at: now,
        }).eq('id', id);

        await supabase!.from('movimentacoes').insert({
          processo_id: id, tipo: tipoMov, descricao: feedback, autor_id: user!.id,
        });

        await supabase!.from('intimacoes').insert({
          processo_id: id, destinatario_id: processo!.aluno_id, remetente_id: user!.id,
          texto: `${acao === 'despacho' ? 'Despacho' : acao === 'emenda' ? 'Solicitação de Emenda' : 'Processo Encerrado'}:\n\n${feedback}${notaNum ? `\n\nNota: ${notaNum.toFixed(1)}` : ''}`,
          prazo_resposta: prazoResposta ? `${prazoResposta}T23:59:59Z` : null,
        });
      }

      setSalvo(true);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) return <ProfLayout><div className="p-8 text-center text-muted-foreground">Carregando...</div></ProfLayout>;
  if (!processo) return <ProfLayout><div className="p-8 text-center text-muted-foreground">Processo não encontrado.</div></ProfLayout>;

  if (salvo) {
    return (
      <ProfLayout>
        <div className="p-4 max-w-xl mx-auto">
          <div className="bg-white border border-border">
            <div className="panel-header flex items-center gap-2"><CheckCircle size={16} /> CORREÇÃO SALVA</div>
            <div className="p-6 text-center">
              <div className="text-[36px] mb-3">✅</div>
              <div className="text-[15px] font-bold mb-2" style={{ color: 'hsl(210,100%,20%)' }}>Correção enviada ao aluno!</div>
              <div className="text-[12px] text-muted-foreground mb-6">
                O feedback foi registrado e uma intimação foi enviada automaticamente para <strong>{nomeAluno}</strong>.
              </div>
              <div className="flex gap-3 justify-center">
                <button className="btn-secondary" onClick={() => navigate('/prof/peticoes')}>Voltar à fila</button>
                <button className="btn-primary" onClick={() => navigate('/prof/dashboard')}>Painel</button>
              </div>
            </div>
          </div>
        </div>
      </ProfLayout>
    );
  }

  const poloAtivo = partes.filter(p => p.polo === 'ativo');
  const poloPassivo = partes.filter(p => p.polo === 'passivo');

  return (
    <EprocLayout>
      <div className="p-4">
        <div className="breadcrumb mb-4">
          <button onClick={() => navigate('/prof/dashboard')}>Início</button>
          <span>›</span>
          <button onClick={() => navigate('/prof/peticoes')}>Petições Recebidas</button>
          <span>›</span>
          <span>Correção — {processo.numero_processo}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Process data */}
          <div className="space-y-4">
            <div className="bg-white border border-border">
              <div className="panel-header">DADOS DO PROCESSO</div>
              <div className="p-4 space-y-2">
                <InfoRow label="Aluno" value={nomeAluno} />
                <InfoRow label="Número" value={processo.numero_processo} mono />
                <InfoRow label="Classe" value={processo.classe_processual} />
                <InfoRow label="Assunto" value={processo.assunto} />
                <InfoRow label="Vara" value={processo.vara} />
                <InfoRow label="Valor da Causa" value={`R$ ${(processo.valor_causa ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                <InfoRow label="Distribuído" value={formatDate(processo.created_at)} />
              </div>
            </div>

            <div className="bg-white border border-border">
              <div className="panel-header">PARTES</div>
              <div className="p-4 space-y-2">
                <div className="text-[11px] font-bold text-muted-foreground uppercase">Polo Ativo</div>
                {poloAtivo.map(p => <div key={p.id} className="text-[12px]">{p.nome} — {p.cpf_cnpj}</div>)}
                <div className="text-[11px] font-bold text-muted-foreground uppercase mt-2">Polo Passivo</div>
                {poloPassivo.map(p => <div key={p.id} className="text-[12px]">{p.nome} — {p.cpf_cnpj}</div>)}
              </div>
            </div>

            {documentos.length > 0 && (
              <div className="bg-white border border-border">
                <div className="panel-header">DOCUMENTOS JUNTADOS</div>
                <div className="divide-y divide-border">
                  {documentos.map(d => (
                    <div key={d.id} className="px-4 py-2 flex items-center justify-between">
                      <div>
                        <div className="text-[12px] font-semibold">{d.tipo}</div>
                        <div className="text-[11px] text-muted-foreground">{d.nome_arquivo}</div>
                      </div>
                      <button className="btn-secondary text-[10px] py-0.5 px-2" disabled>Baixar</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Correction panel */}
          <div className="bg-white border border-border">
            <div className="panel-header">CORREÇÃO E FEEDBACK — INTERFACE DO JUÍZO</div>
            <div className="p-4 space-y-4">
              <div>
                <label className="form-label required">Tipo de Ação</label>
                <div className="flex gap-3 mt-1">
                  {([
                    { val: 'despacho', label: 'Enviar Despacho', desc: 'Feedback + nota, mantém processo ativo' },
                    { val: 'emenda', label: 'Solicitar Emenda', desc: 'Devolve para ajuste com prazo' },
                    { val: 'encerrar', label: 'Encerrar Processo', desc: 'Finaliza com nota e feedback' },
                  ] as const).map(opt => (
                    <label key={opt.val} className="pje-radio flex-1 border border-border p-2 cursor-pointer">
                      <input
                        type="radio"
                        name="acao"
                        value={opt.val}
                        checked={acao === opt.val}
                        onChange={() => setAcao(opt.val)}
                      />
                      <div>
                        <div className="font-bold">{opt.label}</div>
                        <div className="text-[10px] text-muted-foreground">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {acao === 'emenda' && (
                <div>
                  <label className="form-label">Prazo para Emenda</label>
                  <input type="date" className="form-field w-48" value={prazoResposta} onChange={e => setPrazoResposta(e.target.value)} />
                </div>
              )}

              <div>
                <label className="form-label required">Feedback / Despacho</label>
                <textarea
                  className="form-field min-h-40"
                  rows={8}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Escreva seu feedback detalhado sobre a petição, pontos de melhoria, erros identificados, elogios..."
                />
              </div>

              <div>
                <label className="form-label required">Nota (0 a 10)</label>
                <input
                  type="number"
                  className="form-field w-32"
                  value={nota}
                  onChange={e => setNota(e.target.value)}
                  min={0}
                  max={10}
                  step={0.5}
                  placeholder="8.5"
                />
              </div>

              <div className="flex gap-3">
                <button className="btn-secondary" onClick={() => navigate('/prof/peticoes')}>Cancelar</button>
                <button className="btn-primary" onClick={salvar} disabled={salvando}>
                  {salvando ? 'SALVANDO...' : acao === 'despacho' ? '📋 Enviar Despacho' : acao === 'emenda' ? '🔄 Solicitar Emenda' : '✅ Encerrar Processo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EprocLayout>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-2 py-1 border-b border-border last:border-b-0">
      <span className="text-[11px] font-bold text-muted-foreground w-28 shrink-0">{label}:</span>
      <span className={`text-[12px] ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
