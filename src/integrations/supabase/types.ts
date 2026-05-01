export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          cpf: string;
          nome_completo: string;
          matricula: string | null;
          turma_id: string | null;
          perfil: 'aluno' | 'professor' | 'admin';
          oab_simulado: string | null;
          primeiro_acesso: boolean;
          ativo: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          cpf: string;
          nome_completo: string;
          matricula?: string | null;
          turma_id?: string | null;
          perfil?: 'aluno' | 'professor' | 'admin';
          oab_simulado?: string | null;
          primeiro_acesso?: boolean;
          ativo?: boolean;
          created_at?: string;
        };
        Update: {
          cpf?: string;
          nome_completo?: string;
          matricula?: string | null;
          turma_id?: string | null;
          perfil?: 'aluno' | 'professor' | 'admin';
          oab_simulado?: string | null;
          primeiro_acesso?: boolean;
          ativo?: boolean;
        };
      };
      turmas: {
        Row: {
          id: string;
          nome: string;
          professor_id: string;
          semestre: string | null;
          ano: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          professor_id: string;
          semestre?: string | null;
          ano?: number | null;
          created_at?: string;
        };
        Update: {
          nome?: string;
          professor_id?: string;
          semestre?: string | null;
          ano?: number | null;
        };
      };
      tarefas: {
        Row: {
          id: string;
          titulo: string;
          descricao: string | null;
          turma_id: string;
          professor_id: string;
          data_inicio: string | null;
          prazo: string | null;
          documentos_obrigatorios: Json | null;
          ativa: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          descricao?: string | null;
          turma_id: string;
          professor_id: string;
          data_inicio?: string | null;
          prazo?: string | null;
          documentos_obrigatorios?: Json | null;
          ativa?: boolean;
          created_at?: string;
        };
        Update: {
          titulo?: string;
          descricao?: string | null;
          turma_id?: string;
          data_inicio?: string | null;
          prazo?: string | null;
          documentos_obrigatorios?: Json | null;
          ativa?: boolean;
        };
      };
      processos: {
        Row: {
          id: string;
          numero_processo: string;
          aluno_id: string;
          tarefa_id: string | null;
          classe_processual: string;
          assunto: string;
          valor_causa: number | null;
          vara: string;
          segredo_justica: boolean;
          prioridade: string | null;
          status: string;
          nota: number | null;
          feedback_professor: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          numero_processo: string;
          aluno_id: string;
          tarefa_id?: string | null;
          classe_processual: string;
          assunto: string;
          valor_causa?: number | null;
          vara: string;
          segredo_justica?: boolean;
          prioridade?: string | null;
          status?: string;
          nota?: number | null;
          feedback_professor?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          classe_processual?: string;
          assunto?: string;
          valor_causa?: number | null;
          vara?: string;
          segredo_justica?: boolean;
          prioridade?: string | null;
          status?: string;
          nota?: number | null;
          feedback_professor?: string | null;
          updated_at?: string;
        };
      };
      partes: {
        Row: {
          id: string;
          processo_id: string;
          polo: 'ativo' | 'passivo';
          tipo_pessoa: 'fisica' | 'juridica';
          nome: string;
          cpf_cnpj: string | null;
          rg: string | null;
          data_nascimento: string | null;
          endereco: Json | null;
          email: string | null;
          telefone: string | null;
        };
        Insert: {
          id?: string;
          processo_id: string;
          polo: 'ativo' | 'passivo';
          tipo_pessoa: 'fisica' | 'juridica';
          nome: string;
          cpf_cnpj?: string | null;
          rg?: string | null;
          data_nascimento?: string | null;
          endereco?: Json | null;
          email?: string | null;
          telefone?: string | null;
        };
        Update: {
          nome?: string;
          cpf_cnpj?: string | null;
          endereco?: Json | null;
          email?: string | null;
          telefone?: string | null;
        };
      };
      documentos: {
        Row: {
          id: string;
          processo_id: string;
          aluno_id: string;
          tipo: string;
          nome_arquivo: string;
          storage_path: string;
          tamanho_bytes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          processo_id: string;
          aluno_id: string;
          tipo: string;
          nome_arquivo: string;
          storage_path: string;
          tamanho_bytes?: number | null;
          created_at?: string;
        };
        Update: {
          tipo?: string;
          nome_arquivo?: string;
          storage_path?: string;
        };
      };
      movimentacoes: {
        Row: {
          id: string;
          processo_id: string;
          tipo: string;
          descricao: string;
          autor_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          processo_id: string;
          tipo: string;
          descricao: string;
          autor_id?: string | null;
          created_at?: string;
        };
        Update: {
          descricao?: string;
        };
      };
      intimacoes: {
        Row: {
          id: string;
          processo_id: string;
          destinatario_id: string;
          remetente_id: string;
          texto: string;
          prazo_resposta: string | null;
          lida: boolean;
          data_ciencia: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          processo_id: string;
          destinatario_id: string;
          remetente_id: string;
          texto: string;
          prazo_resposta?: string | null;
          lida?: boolean;
          data_ciencia?: string | null;
          created_at?: string;
        };
        Update: {
          lida?: boolean;
          data_ciencia?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Turma = Database['public']['Tables']['turmas']['Row'];
export type Tarefa = Database['public']['Tables']['tarefas']['Row'];
export type Processo = Database['public']['Tables']['processos']['Row'];
export type Parte = Database['public']['Tables']['partes']['Row'];
export type Documento = Database['public']['Tables']['documentos']['Row'];
export type Movimentacao = Database['public']['Tables']['movimentacoes']['Row'];
export type Intimacao = Database['public']['Tables']['intimacoes']['Row'];
