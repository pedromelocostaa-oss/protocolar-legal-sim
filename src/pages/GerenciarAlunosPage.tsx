import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EprocLayout from '@/components/layout/EprocLayout';
import { Upload, Users } from 'lucide-react';
import Papa from 'papaparse';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import { cpfToEmail, formatCpf, generateOab } from '@/lib/masks';

interface AlunoCSV {
  cpf: string;
  nome_completo: string;
  matricula: string;
  turma: string;
}

interface ResultadoImport {
  cpf: string;
  nome: string;
  status: 'ok' | 'erro';
  mensagem?: string;
}

const DEMO_ALUNOS = [
  { cpf: '121.572.976-69', nome: 'Luiz Cordeiro', matricula: '2023.1.001234', turma: 'Processo Civil I' },
];

export default function GerenciarAlunosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alunos] = useState(DEMO_ALUNOS);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<AlunoCSV[]>([]);
  const [resultados, setResultados] = useState<ResultadoImport[]>([]);
  const [importing, setImporting] = useState(false);

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setResultados([]);

    Papa.parse<AlunoCSV>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: h => h.trim().toLowerCase()
        .replace('cpf', 'cpf')
        .replace('nome', 'nome_completo')
        .replace('nome_completo', 'nome_completo')
        .replace('matricula', 'matricula')
        .replace('matrícula', 'matricula')
        .replace('turma', 'turma'),
      complete: (results) => setPreview(results.data.slice(0, 20)),
    });
  };

  const importar = async () => {
    if (!preview.length) return;
    setImporting(true);
    const resultList: ResultadoImport[] = [];

    for (const aluno of preview) {
      try {
        if (!aluno.cpf || !aluno.nome_completo) {
          resultList.push({ cpf: aluno.cpf ?? '?', nome: aluno.nome_completo ?? '?', status: 'erro', mensagem: 'CPF ou nome ausente' });
          continue;
        }

        const cpfFormatado = formatCpf(aluno.cpf.replace(/\D/g, ''));
        const oab = generateOab();

        if (DEMO_MODE) {
          resultList.push({ cpf: cpfFormatado, nome: aluno.nome_completo, status: 'ok', mensagem: 'Usuário demo (não persistido em Supabase)' });
          continue;
        }

        const email = cpfToEmail(aluno.cpf);
        const { data: authData, error: authError } = await supabase!.auth.admin.createUser({
          email,
          password: 'Milton@2025',
          email_confirm: true,
        });

        if (authError) throw authError;

        await supabase!.from('profiles').insert({
          id: authData.user.id,
          cpf: cpfFormatado,
          nome_completo: aluno.nome_completo,
          matricula: aluno.matricula,
          turma_id: null,
          perfil: 'aluno',
          oab_simulado: oab,
          primeiro_acesso: true,
          ativo: true,
        });

        resultList.push({ cpf: cpfFormatado, nome: aluno.nome_completo, status: 'ok' });
      } catch (err: any) {
        resultList.push({ cpf: aluno.cpf, nome: aluno.nome_completo, status: 'erro', mensagem: err.message });
      }
    }

    setResultados(resultList);
    setImporting(false);
  };

  return (
    <EprocLayout>
      <div className="p-4">
        <div className="breadcrumb mb-4">
          <button onClick={() => navigate('/prof/dashboard')}>Início</button>
          <span>›</span>
          <span>Gerenciar Alunos</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Alunos cadastrados */}
          <div className="bg-white border border-border">
            <div className="panel-header flex items-center gap-2">
              <Users size={14} /> ALUNOS CADASTRADOS
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Matrícula</th>
                  <th>Turma</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {alunos.map(a => (
                  <tr key={a.cpf}>
                    <td>{a.nome}</td>
                    <td className="font-mono">{a.cpf}</td>
                    <td>{a.matricula}</td>
                    <td>{a.turma}</td>
                    <td><span className="badge-success">Ativo</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 border-t border-border text-[11px] text-muted-foreground">
              Senha padrão para novos alunos: <strong className="font-mono">Milton@2025</strong> (troca obrigatória no primeiro acesso)
            </div>
          </div>

          {/* Import CSV */}
          <div className="bg-white border border-border">
            <div className="panel-header flex items-center gap-2">
              <Upload size={14} /> IMPORTAR ALUNOS VIA PLANILHA (CSV)
            </div>
            <div className="p-4 space-y-4">
              <div className="alert-info text-[11px]">
                <strong>Formato esperado do CSV:</strong><br />
                Colunas: <code>cpf, nome_completo, matricula, turma</code><br />
                Separador: vírgula ou ponto-e-vírgula<br />
                Encoding: UTF-8
              </div>

              <div>
                <label className="form-label">Arquivo CSV ou Excel</label>
                <label className="btn-secondary flex items-center gap-2 cursor-pointer w-fit">
                  <Upload size={14} />
                  {csvFile ? csvFile.name : 'Selecionar arquivo'}
                  <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleCsvChange} />
                </label>
              </div>

              {preview.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold mb-1">Prévia ({preview.length} alunos encontrados):</div>
                  <div className="overflow-x-auto max-h-48 overflow-y-auto border border-border">
                    <table className="data-table text-[10px]">
                      <thead>
                        <tr>
                          <th>CPF</th>
                          <th>Nome</th>
                          <th>Matrícula</th>
                          <th>Turma</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((a, i) => (
                          <tr key={i}>
                            <td className="font-mono">{a.cpf}</td>
                            <td>{a.nome_completo}</td>
                            <td>{a.matricula}</td>
                            <td>{a.turma}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    className="btn-primary mt-3 flex items-center gap-2"
                    onClick={importar}
                    disabled={importing}
                  >
                    <Users size={14} />
                    {importing ? 'Importando...' : `Importar ${preview.length} Alunos`}
                  </button>
                </div>
              )}

              {resultados.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold mb-1">Resultado da importação:</div>
                  <div className="space-y-1">
                    {resultados.map((r, i) => (
                      <div key={i} className={`text-[11px] px-2 py-1 flex items-center justify-between ${r.status === 'ok' ? 'bg-green-50' : 'bg-red-50'}`}>
                        <span>{r.nome} ({r.cpf})</span>
                        <span className={r.status === 'ok' ? 'badge-success' : 'badge-danger'}>
                          {r.status === 'ok' ? '✓ OK' : `✗ ${r.mensagem}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-3">
                <div className="text-[11px] font-bold mb-1">Modelo de CSV para download:</div>
                <button
                  className="btn-secondary text-[11px]"
                  onClick={() => {
                    const csv = 'cpf,nome_completo,matricula,turma\n123.456.789-00,João da Silva,2025.1.000001,Processo Civil I\n987.654.321-00,Maria Santos,2025.1.000002,Processo Civil I';
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'modelo_importacao_alunos.csv';
                    a.click();
                  }}
                >
                  ↓ Baixar Modelo CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EprocLayout>
  );
}
