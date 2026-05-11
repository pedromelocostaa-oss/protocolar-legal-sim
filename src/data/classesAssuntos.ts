// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface ClasseProcessual {
  codigo: string;
  descricao: string;
  grupo: string;
}

export interface AssuntoCNJ {
  codigo: string;
  descricao: string;
  area: string;
}

export interface NodoAssunto {
  codigo: string;
  descricao: string;
  area: string;
  podePrincipal?: boolean;
  norma?: string;
  artigo?: string;
  glossario?: string;
  subitens?: NodoAssunto[];
}

export interface EntidadeFederal {
  cnpj: string;
  nome: string;
}

export interface AreaTJMG {
  codigo: string;
  descricao: string;
  classes: string[];
}

// Kept for backwards compatibility — not used in TJMG flow
export interface NivelSigilo {
  codigo: string;
  descricao: string;
}

// ─── TJMG — Tribunal ─────────────────────────────────────────────────────────

export const tribunaisTJMG: string[] = [
  'TJMG - Tribunal de Justiça do Estado de Minas Gerais',
];

// ─── TJMG — Áreas e Classes ──────────────────────────────────────────────────

export const areasTJMG: AreaTJMG[] = [
  {
    codigo: 'CIVEL',
    descricao: 'Cível',
    classes: [
      'Procedimento Comum Cível',
      'Ação Civil Pública',
      'Consignação em Pagamento',
      'Ação Rescisória',
      'Busca e Apreensão em Alienação Fiduciária',
      'Embargos de Terceiro',
      'Interdito Proibitório',
      'Mandado de Segurança Cível',
      'Habeas Data',
      'Cumprimento de Sentença',
      'Execução de Título Extrajudicial',
    ],
  },
  {
    codigo: 'FAMILIA',
    descricao: 'Família e Sucessões',
    classes: [
      'Ação de Alimentos',
      'Regulamentação de Visitas',
      'Guarda e Responsabilidade',
      'Divórcio Litigioso',
      'Divórcio Consensual',
      'Inventário e Partilha',
      'Alvará Judicial',
      'Tutela',
      'União Estável — Dissolução',
    ],
  },
  {
    codigo: 'INFANCIA',
    descricao: 'Infância e Juventude',
    classes: [
      'Procedimento da Infância e Juventude — Cível',
      'Adoção',
      'Destituição do Poder Familiar',
      'Guarda (ECA)',
      'Representação — Ato Infracional',
    ],
  },
  {
    codigo: 'CRIMINAL',
    descricao: 'Criminal',
    classes: [
      'Ação Penal — Procedimento Ordinário',
      'Ação Penal — Procedimento Sumário',
      'Habeas Corpus Criminal',
      'Mandado de Segurança Criminal',
      'Inquérito Policial',
    ],
  },
  {
    codigo: 'EXEC_CRIMINAL',
    descricao: 'Execuções Criminais',
    classes: [
      'Execução de Pena Privativa de Liberdade',
      'Execução de Pena Restritiva de Direito',
      'Execução de Medida de Segurança',
    ],
  },
  {
    codigo: 'FAZENDA',
    descricao: 'Fazenda Pública',
    classes: [
      'Procedimento Comum — Fazenda Pública',
      'Mandado de Segurança — Fazenda Pública',
      'Ação Popular',
      'Ação Civil Pública — Fazenda Pública',
      'Cumprimento de Sentença contra a Fazenda Pública',
    ],
  },
  {
    codigo: 'FALENCIAS',
    descricao: 'Falências e Recuperações Judiciais',
    classes: [
      'Falência',
      'Recuperação Judicial',
      'Recuperação Extrajudicial',
      'Insolvência Civil',
    ],
  },
  {
    codigo: 'REGISTROS',
    descricao: 'Registros Públicos e Notarial',
    classes: [
      'Retificação de Registro',
      'Usucapião',
      'Procedimento Especial — Registros Públicos',
    ],
  },
  {
    codigo: 'JE',
    descricao: 'Juizados Especiais',
    classes: [
      'Procedimento do Juizado Especial Cível',
      'Procedimento do Juizado Especial Criminal',
      'Procedimento do Juizado Especial da Fazenda Pública',
    ],
  },
];

// ─── Níveis de Sigilo (TJMG — string[]) ──────────────────────────────────────

export const niveisSigno: string[] = [
  'Público',
  'Segredo de Justiça',
  'Segredo de Justiça – Somente para as Partes',
  'Sigiloso',
  'Absolutamente Sigiloso',
];

// ─── Sigilo de Documentos ─────────────────────────────────────────────────────

export const siglosDocumento: string[] = [
  'Público',
  'Segredo de Justiça',
  'Restrito às Partes',
  'Restrito ao Juízo',
  'Sigiloso',
  'Restrito Juiz Nível 5',
];

// ─── Pessoas e Documentos ────────────────────────────────────────────────────

export const tiposPessoa: string[] = [
  'Pessoa Física',
  'Pessoa Jurídica',
  'Órgão Público',
  'Ente Despersonalizado',
];

export const tiposDocOutros: string[] = [
  'RG',
  'CNH',
  'Passaporte',
  'CTPS',
  'Certidão de Nascimento',
  'Certidão de Casamento',
  'Título de Eleitor',
  'Outro',
];

// ─── Dados Pessoais ───────────────────────────────────────────────────────────

export const sexos: string[] = [
  'Masculino',
  'Feminino',
  'Não informado',
];

export const estadosCivis: string[] = [
  'Solteiro(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viúvo(a)',
  'União Estável',
  'Separado(a)',
  'Não informado',
];

export const identidadesGenero: string[] = [
  'Cisgênero',
  'Transgênero',
  'Não-binário',
  'Outro',
  'Prefiro não informar',
];

export const orientacoesSexuais: string[] = [
  'Heterossexual',
  'Homossexual',
  'Bissexual',
  'Outro',
  'Prefiro não informar',
];

export const racasEtnia: string[] = [
  'Branca',
  'Preta',
  'Parda',
  'Amarela',
  'Indígena',
  'Não informado',
];

export const tiposDeficiencia: string[] = [
  'Auditiva',
  'Visual',
  'Motora',
  'Mental/Intelectual',
  'Múltipla',
  'Outra',
];

export const niveisEscolaridade: string[] = [
  'Sem escolaridade',
  'Fundamental incompleto',
  'Fundamental completo',
  'Médio incompleto',
  'Médio completo',
  'Superior incompleto',
  'Superior completo',
  'Pós-graduação',
  'Não informado',
];

// ─── Justiça Gratuita ─────────────────────────────────────────────────────────

export const justicaGratuitaOpcoes: string[] = [
  'Não',
  'Sim',
  'Parcial',
  'Deferida pelo Juízo',
];

// ─── Classes Processuais (mantidas — compatibilidade) ────────────────────────

export const classesProcessuais: ClasseProcessual[] = [
  { codigo: '7',     descricao: 'Procedimento Comum Cível',                              grupo: 'CÍVEL' },
  { codigo: '120',   descricao: 'Mandado de Segurança Cível',                            grupo: 'CONSTITUCIONAL' },
  { codigo: '65',    descricao: 'Ação Civil Pública',                                    grupo: 'CÍVEL' },
  { codigo: '436',   descricao: 'Procedimento do Juizado Especial Cível',                grupo: 'JUIZADO' },
  { codigo: '32',    descricao: 'Consignação em Pagamento',                              grupo: 'CÍVEL' },
  { codigo: '156',   descricao: 'Cumprimento de Sentença',                               grupo: 'EXECUÇÃO' },
  { codigo: '159',   descricao: 'Execução de Título Extrajudicial',                      grupo: 'EXECUÇÃO' },
  { codigo: '281',   descricao: 'Ação Rescisória',                                       grupo: 'CÍVEL' },
  { codigo: '1028',  descricao: 'Habeas Data',                                           grupo: 'CONSTITUCIONAL' },
  { codigo: '58',    descricao: 'Interdito Proibitório',                                 grupo: 'CÍVEL' },
  { codigo: '1116',  descricao: 'Ação de Alimentos',                                     grupo: 'FAMÍLIA' },
  { codigo: '475',   descricao: 'Inventário e Partilha',                                 grupo: 'SUCESSÕES' },
  { codigo: '48',    descricao: 'Embargos de Terceiro',                                  grupo: 'CÍVEL' },
  { codigo: '12078', descricao: 'Cumprimento de Sentença contra a Fazenda Pública',      grupo: 'EXECUÇÃO' },
  { codigo: '81',    descricao: 'Busca e Apreensão em Alienação Fiduciária',             grupo: 'CÍVEL' },
  { codigo: '1117',  descricao: 'Regulamentação de Visitas',                             grupo: 'FAMÍLIA' },
  { codigo: '1118',  descricao: 'Guarda e Responsabilidade',                             grupo: 'FAMÍLIA' },
];

// ─── Assuntos CNJ (mantidos — compatibilidade) ───────────────────────────────

export const assuntosCNJ: AssuntoCNJ[] = [
  { codigo: '10431', descricao: 'Responsabilidade Civil',                               area: 'DIREITO CIVIL' },
  { codigo: '10433', descricao: 'Indenização por Dano Moral',                           area: 'DIREITO CIVIL' },
  { codigo: '10434', descricao: 'Indenização por Dano Material',                        area: 'DIREITO CIVIL' },
  { codigo: '10435', descricao: 'Indenização por Dano Moral – Acidente de Trânsito',   area: 'DIREITO CIVIL' },
  { codigo: '10445', descricao: 'Erro Médico',                                          area: 'DIREITO CIVIL' },
  { codigo: '10450', descricao: 'Obrigação de Fazer / Não Fazer',                      area: 'DIREITO CIVIL' },
  { codigo: '10455', descricao: 'Contratos em Geral',                                   area: 'DIREITO CIVIL' },
  { codigo: '10470', descricao: 'Dano Estético',                                        area: 'DIREITO CIVIL' },
  { codigo: '10460', descricao: 'Responsabilidade do Fornecedor',                       area: 'DIREITO DO CONSUMIDOR' },
  { codigo: '10461', descricao: 'Defeito / Vício do Produto',                           area: 'DIREITO DO CONSUMIDOR' },
  { codigo: '10462', descricao: 'Práticas Abusivas',                                    area: 'DIREITO DO CONSUMIDOR' },
  { codigo: '9991',  descricao: 'Responsabilidade da Administração',                    area: 'DIREITO ADMINISTRATIVO' },
  { codigo: '9992',  descricao: 'Indenização por Dano Moral – Responsabilidade Pública', area: 'DIREITO ADMINISTRATIVO' },
  { codigo: '10219', descricao: 'Servidor Público Civil',                               area: 'DIREITO ADMINISTRATIVO' },
  { codigo: '10288', descricao: 'Sistema Remuneratório e Benefícios',                   area: 'DIREITO ADMINISTRATIVO' },
  { codigo: '7769',  descricao: 'Abatimento Proporcional do Preço',                     area: 'DIREITO DO CONSUMIDOR' },
  { codigo: '1156',  descricao: 'Direito do Consumidor – Geral',                        area: 'DIREITO DO CONSUMIDOR' },
];

// ─── Prioridades (mantidas) ───────────────────────────────────────────────────

export const prioridades: string[] = [
  'Idoso (60 a 80 anos)',
  'Idoso (acima de 80 anos)',
  'Portador de doença grave',
  'Pessoa com deficiência',
  'Violência doméstica e familiar',
  'Estatuto da Criança e do Adolescente',
  'Medida de urgência',
  'Juízo 100% Digital',
];

// ─── Tipos de Documento (mantidos) ───────────────────────────────────────────

export const tiposDocumento: string[] = [
  'Petição Inicial',
  'Procuração',
  'Documento de Identidade',
  'CPF',
  'Comprovante de Residência',
  'Laudo Médico/Pericial',
  'Contrato',
  'Nota Fiscal / Recibo',
  'Boletim de Ocorrência',
  'Certidão',
  'Declaração',
  'Fotografias',
  'Extrato Bancário',
  'Prontuário Médico',
  'Outros',
];

// ─── Tipos de Petição Incidental (mantidos) ───────────────────────────────────

export const tiposPeticaoIncidental: string[] = [
  'Contestação',
  'Réplica',
  'Agravo de Instrumento',
  'Apelação',
  'Embargos de Declaração',
  'Impugnação ao Cumprimento de Sentença',
  'Exceção de Incompetência',
  'Reconvenção',
  'Manifestação',
  'Petição (genérica)',
  'Juntada de Documentos',
  'Substabelecimento',
  'Renúncia ao Prazo',
  'Ciência',
  'Memorial',
  'Recurso – Agravo Interno',
  'Requerimento de Provas',
  'Informações Complementares',
  'Desistência',
  'Acordo / Homologação',
];

// ─── Entidades (mantidas — compatibilidade) ───────────────────────────────────

export const entidadesFederais: EntidadeFederal[] = [
  { cnpj: '17.590.929/0001-59', nome: 'Estado de Minas Gerais' },
  { cnpj: '18.715.532/0001-90', nome: 'Município de Belo Horizonte' },
  { cnpj: '16.831.369/0001-78', nome: 'Município de Uberlândia' },
  { cnpj: '18.599.533/0001-82', nome: 'Município de Contagem' },
  { cnpj: '49.247.646/0001-50', nome: 'Companhia Energética de Minas Gerais — CEMIG' },
  { cnpj: '07.155.811/0001-19', nome: 'Companhia de Saneamento de Minas Gerais — COPASA' },
  { cnpj: '00.360.305/0001-04', nome: 'Caixa Econômica Federal — CEF' },
  { cnpj: '00.000.000/0001-91', nome: 'Banco do Brasil S.A.' },
  { cnpj: '29.979.036/0001-40', nome: 'Instituto Nacional do Seguro Social — INSS' },
  { cnpj: '00.394.460/0001-41', nome: 'União Federal (AGU)' },
  { cnpj: '60.746.948/0001-12', nome: 'Banco Bradesco S.A.' },
  { cnpj: '60.701.190/0001-04', nome: 'Itaú Unibanco S.A.' },
  { cnpj: '33.172.537/0001-98', nome: 'Claro S.A.' },
  { cnpj: '02.558.157/0001-62', nome: 'TIM S.A.' },
  { cnpj: '02.449.992/0001-17', nome: 'Vivo — Telefônica Brasil S.A.' },
  { cnpj: '10.563.000/0001-31', nome: 'Azul Linhas Aéreas Brasileiras S.A.' },
  { cnpj: '07.975.010/0001-44', nome: 'GOL Linhas Aéreas Inteligentes S.A.' },
  { cnpj: '02.012.862/0001-60', nome: 'LATAM Airlines Brasil S.A.' },
];

// ─── Árvore de Assuntos — TJMG ───────────────────────────────────────────────

const A = 'DIREITO À EDUCAÇÃO';
const CI = 'DIREITO CIVIL';
const SA = 'DIREITO DA SAÚDE';
const CO = 'DIREITO DO CONSUMIDOR';
const PR = 'DIREITO PREVIDENCIÁRIO';
const FA = 'DIREITO DE FAMÍLIA';
const AD = 'DIREITO ADMINISTRATIVO';
const PC = 'DIREITO PROCESSUAL CIVIL E DO TRABALHO';
const QA = 'QUESTÕES DE ALTA COMPLEXIDADE, GRANDE IMPACTO E REPERCUSSÃO';

export const arvoreAssuntos: NodoAssunto[] = [
  // ── DIREITO À EDUCAÇÃO ─────────────────────────────────────────────────────
  {
    codigo: '16', descricao: 'DIREITO À EDUCAÇÃO', area: A,
    subitens: [
      {
        codigo: '1601', descricao: 'Acesso', area: A,
        subitens: [
          {
            codigo: '160101', descricao: 'Vaga', area: A,
            subitens: [
              { codigo: '16010101', descricao: 'Ausência de Vaga', area: A, podePrincipal: true },
              { codigo: '16010102', descricao: 'Corte Etário', area: A, podePrincipal: true },
              { codigo: '16010103', descricao: 'Acesso Próximo do Domicílio', area: A, podePrincipal: true },
              { codigo: '16010104', descricao: 'Matrícula de Irmãos na Mesma Escola', area: A, podePrincipal: true },
              { codigo: '16010105', descricao: 'Prioridade de Matrícula para Alunos com Deficiência', area: A, podePrincipal: true },
            ],
          },
          {
            codigo: '160102', descricao: 'Processo Seletivo', area: A,
            subitens: [
              {
                codigo: '16010201', descricao: 'Vestibular', area: A,
                subitens: [
                  { codigo: '1601020101', descricao: 'Acessibilidade', area: A, podePrincipal: true },
                  { codigo: '1601020102', descricao: 'Outros', area: A, podePrincipal: true },
                  { codigo: '1601020103', descricao: 'Taxa de Inscrição', area: A, podePrincipal: true },
                ],
              },
              {
                codigo: '16010202', descricao: 'Exames Oficiais para Ingresso - Enem', area: A,
                subitens: [
                  { codigo: '1601020201', descricao: 'Acessibilidade', area: A, podePrincipal: true },
                  { codigo: '1601020202', descricao: 'Outros', area: A, podePrincipal: true },
                  { codigo: '1601020203', descricao: 'Taxa de Inscrição', area: A, podePrincipal: true },
                ],
              },
              {
                codigo: '16010203', descricao: 'Outros', area: A,
                subitens: [
                  { codigo: '1601020301', descricao: 'Acessibilidade', area: A, podePrincipal: true },
                  { codigo: '1601020302', descricao: 'Outros', area: A, podePrincipal: true },
                  { codigo: '1601020303', descricao: 'Taxa de Inscrição', area: A, podePrincipal: true },
                ],
              },
            ],
          },
          { codigo: '160103', descricao: 'Acesso sem Conclusão do Ensino Médio', area: A, podePrincipal: true },
          { codigo: '160104', descricao: 'Convalidação de Estudos e Reconhecimento de Diploma', area: A, podePrincipal: true },
          {
            codigo: '160105', descricao: 'Transferência Discente', area: A,
            subitens: [
              { codigo: '16010501', descricao: 'Militar', area: A, podePrincipal: true },
              { codigo: '16010502', descricao: 'Outras', area: A, podePrincipal: true },
            ],
          },
          { codigo: '160106', descricao: 'Cobrança de Taxa de Matrícula', area: A, podePrincipal: true },
          { codigo: '160107', descricao: 'Cota para Ingresso - Ações Afirmativas', area: A, podePrincipal: true },
          {
            codigo: '160108', descricao: 'Itinerários Formativos', area: A,
            subitens: [
              { codigo: '16010801', descricao: 'Formação Técnica e Profissional', area: A, podePrincipal: true },
              { codigo: '16010802', descricao: 'Itinerários Formativos do Ensino Médio', area: A, podePrincipal: true },
            ],
          },
          { codigo: '160109', descricao: 'Renovação de Matrícula - Inadimplência', area: A, podePrincipal: true },
          { codigo: '160110', descricao: 'Perda de Prazo de Matrícula', area: A, podePrincipal: true },
          { codigo: '160111', descricao: 'Matrícula - Ausência de Pré-Requisito', area: A, podePrincipal: true },
        ],
      },
      {
        codigo: '1602', descricao: 'Avaliação e Controle', area: A,
        subitens: [
          { codigo: '160201', descricao: 'Autorização e Reconhecimento de Cursos', area: A, podePrincipal: true },
          { codigo: '160202', descricao: 'Credenciamento e Recredenciamento', area: A, podePrincipal: true },
          { codigo: '160203', descricao: 'Enade', area: A, podePrincipal: true },
          { codigo: '160204', descricao: 'Autorização de Funcionamento/Fiscalização de Estabelecimentos de Ensino', area: A, podePrincipal: true },
        ],
      },
      {
        codigo: '1604', descricao: 'Educação Especial', area: A,
        subitens: [
          { codigo: '160401', descricao: 'Acessibilidade Física', area: A, podePrincipal: true },
          { codigo: '160402', descricao: 'Institucionalização Pedagógica do Atendimento Educacional Especializado', area: A, podePrincipal: true },
          { codigo: '160403', descricao: 'Material Didático Especializado, Tecnologias Assistivas e Suporte', area: A, podePrincipal: true },
          { codigo: '160404', descricao: 'Profissionais de Apoio', area: A, podePrincipal: true },
          { codigo: '160405', descricao: 'Sala de Recursos Multifuncionais', area: A, podePrincipal: true },
        ],
      },
      {
        codigo: '1607', descricao: 'Financiamento', area: A,
        subitens: [
          {
            codigo: '160701', descricao: 'Despesa', area: A,
            subitens: [
              { codigo: '16070101', descricao: 'Manutenção e Desenvolvimento do Ensino', area: A, podePrincipal: true },
            ],
          },
          { codigo: '160702', descricao: 'Financiamento Privado do Ensino Superior e/ou Pesquisa', area: A, podePrincipal: true },
        ],
      },
      {
        codigo: '1608', descricao: 'Gestão', area: A,
        subitens: [
          { codigo: '160801', descricao: 'Estatutos e Regimentos - Regras de Convivência e Sanções Disciplinares', area: A, podePrincipal: true },
          { codigo: '160802', descricao: 'Autonomia da Instituição de Ensino', area: A, podePrincipal: true },
          { codigo: '160803', descricao: 'Penalidades Disciplinares', area: A, podePrincipal: true },
          { codigo: '160804', descricao: 'Jubilamento de Aluno', area: A, podePrincipal: true },
        ],
      },
      {
        codigo: '1609', descricao: 'Permanência', area: A,
        subitens: [
          { codigo: '160901', descricao: 'Mensalidades', area: A, podePrincipal: true },
          { codigo: '160902', descricao: 'Expedição de Diplomas e Omissão na Entrega das Notas', area: A, podePrincipal: true },
          {
            codigo: '160903', descricao: 'Programas de Bolsas e Financiamento Estudantil com Recursos Públicos', area: A,
            subitens: [
              { codigo: '16090301', descricao: 'Fies', area: A, podePrincipal: true },
              { codigo: '16090302', descricao: 'Prouni', area: A, podePrincipal: true },
              { codigo: '16090303', descricao: 'Outros', area: A, podePrincipal: true },
            ],
          },
          { codigo: '160904', descricao: 'Evasão e Abandono', area: A, podePrincipal: true },
          { codigo: '160905', descricao: 'Programas de Assistência Estudantil - Alimentação, Moradia, Creche, Transporte', area: A, podePrincipal: true },
          { codigo: '160906', descricao: 'Colação de Grau', area: A, podePrincipal: true },
        ],
      },
      {
        codigo: '1610', descricao: 'Planos Decenais', area: A,
        subitens: [
          { codigo: '161001', descricao: 'Plano Municipal de Educação', area: A, subitens: [{ codigo: '16100101', descricao: 'Processo de Elaboração', area: A, podePrincipal: true }] },
          { codigo: '161002', descricao: 'Plano Estadual de Educação', area: A, subitens: [{ codigo: '16100201', descricao: 'Processo de Elaboração', area: A, podePrincipal: true }] },
          { codigo: '161003', descricao: 'Plano Nacional de Educação', area: A, subitens: [{ codigo: '16100301', descricao: 'Processo de Elaboração', area: A, podePrincipal: true }] },
        ],
      },
      {
        codigo: '1611', descricao: 'Qualidade', area: A,
        subitens: [
          { codigo: '161101', descricao: 'Distorção de Série/Idade', area: A, podePrincipal: true },
          { codigo: '161102', descricao: 'Exames de Certificação - Diploma', area: A, podePrincipal: true },
          { codigo: '161103', descricao: 'Infrequência Escolar', area: A, podePrincipal: true },
          { codigo: '161104', descricao: 'Transporte', area: A, podePrincipal: true },
          { codigo: '161105', descricao: 'Material Didático', area: A, podePrincipal: true },
          { codigo: '161106', descricao: 'Bullying, Violência e Discriminação', area: A, podePrincipal: true },
          { codigo: '161107', descricao: 'Formação Técnica Profissional', area: A, podePrincipal: true },
          { codigo: '161108', descricao: 'Quantidade de Alunos por Sala', area: A, podePrincipal: true },
          { codigo: '161109', descricao: 'Relações Étnico-Raciais', area: A, podePrincipal: true },
          { codigo: '161110', descricao: 'Alimentação Escolar', area: A, podePrincipal: true },
          { codigo: '161111', descricao: 'Regime Hospitalar ou Domiciliar durante Período de Internação', area: A, podePrincipal: true },
          { codigo: '161112', descricao: 'Infraestrutura', area: A, podePrincipal: true },
          { codigo: '161113', descricao: 'Estudos de Recuperação', area: A, podePrincipal: true },
          { codigo: '161114', descricao: 'Residência Médica', area: A, podePrincipal: true },
          { codigo: '161115', descricao: 'Omissão na Entrega de Notas', area: A, podePrincipal: true },
          { codigo: '161116', descricao: 'Exigência de Estágio Profissionalizante', area: A, podePrincipal: true },
          { codigo: '161117', descricao: 'Currículo Escolar', area: A, podePrincipal: true },
          { codigo: '161118', descricao: 'Colisão de Horário', area: A, podePrincipal: true },
        ],
      },
      {
        codigo: '1612', descricao: 'Valorização do Magistério e dos Profissionais da Educação', area: A,
        subitens: [
          {
            codigo: '161201', descricao: 'Jornada de Trabalho', area: A,
            subitens: [
              { codigo: '16120101', descricao: 'Carga Horária de Aulas/Processo de Atribuição de Aulas e Classes', area: A, podePrincipal: true },
            ],
          },
          {
            codigo: '161202', descricao: 'Absenteísmo Docente', area: A,
            subitens: [
              {
                codigo: '16120201', descricao: 'Licenças', area: A,
                subitens: [
                  { codigo: '1612020101', descricao: 'Licença Saúde', area: A, podePrincipal: true },
                  { codigo: '1612020102', descricao: 'Outras Licenças', area: A, podePrincipal: true },
                ],
              },
              {
                codigo: '16120202', descricao: 'Faltas', area: A,
                subitens: [
                  { codigo: '1612020201', descricao: 'Faltas Justificadas', area: A, podePrincipal: true },
                  { codigo: '1612020202', descricao: 'Faltas não Justificadas', area: A, podePrincipal: true },
                ],
              },
            ],
          },
          { codigo: '161203', descricao: 'Aposentadoria Especial', area: A, podePrincipal: true },
          {
            codigo: '161204', descricao: 'Espécies de Vínculo de Trabalho', area: A,
            subitens: [
              { codigo: '16120401', descricao: 'Contrato Temporário', area: A, podePrincipal: true },
              { codigo: '16120402', descricao: 'Estatutário', area: A, podePrincipal: true },
            ],
          },
          {
            codigo: '161205', descricao: 'Ensino à Distância', area: A,
            subitens: [
              { codigo: '16120501', descricao: 'Certificação', area: A, podePrincipal: true },
            ],
          },
          {
            codigo: '161206', descricao: 'Plano de Carreira', area: A,
            subitens: [
              { codigo: '16120601', descricao: 'Progressão', area: A, podePrincipal: true },
              { codigo: '16120602', descricao: 'Certificação', area: A, podePrincipal: true },
              { codigo: '16120603', descricao: 'Concurso de Ingresso', area: A, podePrincipal: true },
            ],
          },
          {
            codigo: '161207', descricao: 'Remuneração', area: A,
            subitens: [
              { codigo: '16120701', descricao: 'Piso Salarial', area: A, podePrincipal: true },
            ],
          },
          {
            codigo: '161208', descricao: 'Greve', area: A,
            subitens: [
              { codigo: '16120801', descricao: 'Contrato Temporário', area: A, podePrincipal: true },
              { codigo: '16120802', descricao: 'Outros', area: A, podePrincipal: true },
            ],
          },
          {
            codigo: '161209', descricao: 'Formação', area: A,
            subitens: [
              { codigo: '16120901', descricao: 'Continuada', area: A, podePrincipal: true },
            ],
          },
        ],
      },
    ],
  },

  // ── DIREITO CIVIL ──────────────────────────────────────────────────────────
  {
    codigo: '02', descricao: 'DIREITO CIVIL', area: CI,
    subitens: [
      { codigo: '0227', descricao: 'Bem de Família Legal', area: CI, podePrincipal: true },
      {
        codigo: '0216', descricao: 'Coisas', area: CI,
        subitens: [
          { codigo: '021601', descricao: 'Hipoteca', area: CI, podePrincipal: true },
          {
            codigo: '021602', descricao: 'Penhor', area: CI,
            subitens: [
              { codigo: '02160201', descricao: 'Direitos e Títulos de Crédito', area: CI, podePrincipal: true },
              { codigo: '02160202', descricao: 'Industrial / Mercantil', area: CI, podePrincipal: true },
              { codigo: '02160203', descricao: 'Rural - Agrícola/Pecuário', area: CI, podePrincipal: true },
              { codigo: '02160204', descricao: 'Veículos', area: CI, podePrincipal: true },
              { codigo: '02160205', descricao: 'Legal', area: CI, podePrincipal: true },
            ],
          },
          {
            codigo: '021603', descricao: 'Posse', area: CI,
            subitens: [
              { codigo: '02160301', descricao: 'Aquisição', area: CI, podePrincipal: true },
              { codigo: '02160302', descricao: 'Esbulho / Turbação / Ameaça', area: CI, podePrincipal: true },
              { codigo: '02160303', descricao: 'Imissão', area: CI, podePrincipal: true },
            ],
          },
          {
            codigo: '021604', descricao: 'Propriedade', area: CI,
            subitens: [
              {
                codigo: '02160401', descricao: 'Aquisição', area: CI,
                subitens: [
                  { codigo: '0216040101', descricao: 'Acessão', area: CI, podePrincipal: true },
                  { codigo: '0216040102', descricao: 'Usucapião da L 6.969/1981', area: CI, podePrincipal: true },
                  { codigo: '0216040103', descricao: 'Usucapião Especial (Constitucional)', area: CI, podePrincipal: true },
                  { codigo: '0216040104', descricao: 'Usucapião Especial Coletiva', area: CI, podePrincipal: true },
                  { codigo: '0216040105', descricao: 'Usucapião Extraordinária', area: CI, podePrincipal: true },
                  { codigo: '0216040106', descricao: 'Usucapião Ordinária', area: CI, podePrincipal: true },
                  { codigo: '0216040107', descricao: 'Usucapião Conjugal', area: CI, podePrincipal: true },
                  { codigo: '0216040108', descricao: 'Usucapião de bem móvel', area: CI, podePrincipal: true },
                ],
              },
              { codigo: '02160402', descricao: 'Condomínio', area: CI, podePrincipal: true },
              {
                codigo: '02160403', descricao: 'Condomínio em Edifício', area: CI,
                subitens: [
                  { codigo: '0216040301', descricao: 'Multa', area: CI, podePrincipal: true },
                  { codigo: '0216040302', descricao: 'Administração', area: CI, podePrincipal: true },
                  { codigo: '0216040303', descricao: 'Alteração de Coisa Comum', area: CI, podePrincipal: true },
                  { codigo: '0216040304', descricao: 'Assembléia', area: CI, podePrincipal: true },
                  { codigo: '0216040305', descricao: 'Despesas Condominiais', area: CI, podePrincipal: true },
                  { codigo: '0216040306', descricao: 'Direitos / Deveres do Condômino', area: CI, podePrincipal: true },
                  { codigo: '0216040307', descricao: 'Vaga de garagem', area: CI, podePrincipal: true },
                ],
              },
              { codigo: '02160404', descricao: 'Perda da Propriedade', area: CI, podePrincipal: true },
              {
                codigo: '02160405', descricao: 'Propriedade Intelectual / Industrial', area: CI,
                subitens: [
                  { codigo: '0216040501', descricao: 'Desenho Industrial', area: CI, podePrincipal: true },
                  { codigo: '0216040502', descricao: 'Direito Autoral', area: CI, podePrincipal: true },
                  { codigo: '0216040503', descricao: 'Marca', area: CI, podePrincipal: true },
                  { codigo: '0216040504', descricao: 'Patente', area: CI, podePrincipal: true },
                  { codigo: '0216040505', descricao: 'Programa de Computador', area: CI, podePrincipal: true },
                ],
              },
              { codigo: '02160406', descricao: 'Adjudicação Compulsória', area: CI, podePrincipal: true },
              { codigo: '02160407', descricao: 'Alienação Judicial', area: CI, podePrincipal: true },
              { codigo: '02160408', descricao: 'Retificação de Área de Imóvel', area: CI, podePrincipal: true },
              { codigo: '02160409', descricao: 'Propriedade Fiduciária', area: CI, podePrincipal: true },
              { codigo: '02160410', descricao: 'Direito de Vizinhança', area: CI, podePrincipal: true },
              { codigo: '02160411', descricao: 'Divisão e Demarcação', area: CI, podePrincipal: true },
              { codigo: '02160412', descricao: 'Incorporação Imobiliária', area: CI, podePrincipal: true },
              { codigo: '02160413', descricao: 'Propriedade Resolúvel', area: CI, podePrincipal: true },
              { codigo: '02160414', descricao: 'Reivindicação', area: CI, podePrincipal: true },
            ],
          },
          { codigo: '021607', descricao: 'Usufruto', area: CI, podePrincipal: true },
          { codigo: '021608', descricao: 'Anticrese', area: CI, podePrincipal: true },
          { codigo: '021609', descricao: 'Enfiteuse', area: CI, podePrincipal: true },
          { codigo: '021610', descricao: 'Habitação', area: CI, podePrincipal: true },
          { codigo: '021611', descricao: 'Promessa de Compra e Venda', area: CI, podePrincipal: true },
          { codigo: '021612', descricao: 'Servidão', area: CI, podePrincipal: true },
          { codigo: '021613', descricao: 'Superfície', area: CI, podePrincipal: true },
          { codigo: '021614', descricao: 'Uso', area: CI, podePrincipal: true },
        ],
      },
      { codigo: '0226', descricao: 'Direitos da Personalidade', area: CI, podePrincipal: true },
      {
        codigo: '0223', descricao: 'Empresas', area: CI,
        subitens: [
          {
            codigo: '022301', descricao: 'Espécies de Sociedades', area: CI,
            subitens: [
              { codigo: '02230101', descricao: 'Anônima', area: CI, podePrincipal: true },
              { codigo: '02230102', descricao: 'Coligadas', area: CI, podePrincipal: true },
              { codigo: '02230103', descricao: 'Comandita por Ações', area: CI, podePrincipal: true },
              { codigo: '02230104', descricao: 'Comandita Simples', area: CI, podePrincipal: true },
              { codigo: '02230105', descricao: 'Conta de Participação', area: CI, podePrincipal: true },
              { codigo: '02230106', descricao: 'Cooperativa', area: CI, podePrincipal: true },
              { codigo: '02230107', descricao: 'Dependente de Autorização', area: CI, podePrincipal: true },
              { codigo: '02230108', descricao: 'Em comum / De fato', area: CI, podePrincipal: true },
              { codigo: '02230109', descricao: 'Estrangeira', area: CI, podePrincipal: true },
              { codigo: '02230110', descricao: 'Limitada', area: CI, podePrincipal: true },
              { codigo: '02230111', descricao: 'Nome Coletivo', area: CI, podePrincipal: true },
              { codigo: '02230112', descricao: 'Simples', area: CI, podePrincipal: true },
            ],
          },
          {
            codigo: '022302', descricao: 'Mercado de Capitais', area: CI,
            subitens: [
              { codigo: '02230201', descricao: 'Bolsa de Valores', area: CI, podePrincipal: true },
            ],
          },
          {
            codigo: '022303', descricao: 'Recuperação judicial e Falência', area: CI,
            subitens: [
              { codigo: '02230301', descricao: 'Administração judicial', area: CI, podePrincipal: true },
              { codigo: '02230302', descricao: 'Autofalência', area: CI, podePrincipal: true },
              { codigo: '02230303', descricao: 'Classificação de créditos', area: CI, podePrincipal: true },
              { codigo: '02230304', descricao: 'Concurso de Credores', area: CI, podePrincipal: true },
              { codigo: '02230305', descricao: 'Convolação de recuperação judicial em falência', area: CI, podePrincipal: true },
              { codigo: '02230306', descricao: 'Depósito Elisivo', area: CI, podePrincipal: true },
              { codigo: '02230307', descricao: 'Extinção das Obrigações do Falido', area: CI, podePrincipal: true },
              { codigo: '02230308', descricao: 'Ineficácia de atos em relação à massa', area: CI, podePrincipal: true },
              { codigo: '02230309', descricao: 'Liquidação', area: CI, podePrincipal: true },
              { codigo: '02230310', descricao: 'Recuperação extrajudicial', area: CI, podePrincipal: true },
              { codigo: '02230311', descricao: 'Revogação de atos praticados em prejuízo de credores e da massa', area: CI, podePrincipal: true },
            ],
          },
          {
            codigo: '022304', descricao: 'Sociedade', area: CI,
            subitens: [
              { codigo: '02230401', descricao: 'Alteração de capital', area: CI, podePrincipal: true },
              { codigo: '02230402', descricao: 'Apuração de haveres', area: CI, podePrincipal: true },
              { codigo: '02230403', descricao: 'Cisão', area: CI, podePrincipal: true },
              { codigo: '02230404', descricao: 'Coligação', area: CI, podePrincipal: true },
              { codigo: '02230405', descricao: 'Constituição', area: CI, podePrincipal: true },
              { codigo: '02230406', descricao: 'Desconsideração da Personalidade Jurídica', area: CI, podePrincipal: true },
              { codigo: '02230407', descricao: 'Dissolução', area: CI, podePrincipal: true },
              { codigo: '02230408', descricao: 'Fusão', area: CI, podePrincipal: true },
              { codigo: '02230409', descricao: 'Incorporação', area: CI, podePrincipal: true },
              { codigo: '02230410', descricao: 'Ingresso e Exclusão dos Sócios na Sociedade', area: CI, podePrincipal: true },
              { codigo: '02230411', descricao: 'Liquidação', area: CI, podePrincipal: true },
              { codigo: '02230412', descricao: 'Responsabilidade dos sócios e administradores', area: CI, podePrincipal: true },
              { codigo: '02230413', descricao: 'Transferência de cotas', area: CI, podePrincipal: true },
              { codigo: '02230414', descricao: 'Transformação', area: CI, podePrincipal: true },
            ],
          },
        ],
      },
      {
        codigo: '0217', descricao: 'Família', area: CI,
        subitens: [
          { codigo: '021714', descricao: 'Investigação de Paternidade Pós Morte', area: CI, podePrincipal: true },
          { codigo: '021715', descricao: 'Reconhecimento/Dissolução Sócio Afetivo Pós Morte', area: CI, podePrincipal: true },
        ],
      },
      {
        codigo: '0218', descricao: 'Fatos Jurídicos', area: CI,
        subitens: [
          {
            codigo: '021802', descricao: 'Ato / Negócio Jurídico', area: CI,
            subitens: [
              { codigo: '02180201', descricao: 'Defeito, nulidade ou anulação', area: CI, podePrincipal: true },
              { codigo: '02180202', descricao: 'Evicção ou Vicio Redibitório', area: CI, podePrincipal: true },
            ],
          },
        ],
      },
      {
        codigo: '0219', descricao: 'Obrigações', area: CI,
        subitens: [
          {
            codigo: '021901', descricao: 'Adimplemento e Extinção', area: CI,
            subitens: [
              { codigo: '02190102', descricao: 'Confusão', area: CI, podePrincipal: true },
              { codigo: '02190104', descricao: 'Desconto em Folha de Pagamento/Benefício Previdenciário', area: CI, podePrincipal: true },
              { codigo: '02190107', descricao: 'Pagamento', area: CI, podePrincipal: true },
              { codigo: '02190108', descricao: 'Pagamento com Sub-rogação', area: CI, podePrincipal: true },
              { codigo: '02190109', descricao: 'Pagamento em Consignação', area: CI, podePrincipal: true },
              { codigo: '02190110', descricao: 'Remissão das Dívidas', area: CI, podePrincipal: true },
            ],
          },
          {
            codigo: '021902', descricao: 'Atos Unilaterais', area: CI,
            subitens: [
              { codigo: '02190201', descricao: 'Enriquecimento sem Causa', area: CI, podePrincipal: true },
              { codigo: '02190202', descricao: 'Gestão de Negócios', area: CI, podePrincipal: true },
              { codigo: '02190203', descricao: 'Pagamento Indevido', area: CI, podePrincipal: true },
              { codigo: '02190204', descricao: 'Promessa de Recompensa', area: CI, podePrincipal: true },
            ],
          },
          {
            codigo: '021903', descricao: 'Espécies de Contratos', area: CI,
            subitens: [
              { codigo: '02190301', descricao: 'Agência e Distribuição', area: CI, podePrincipal: true },
              { codigo: '02190302', descricao: 'Alienação Fiduciária', area: CI, podePrincipal: true },
              { codigo: '02190303', descricao: 'Arrendamento mercantil', area: CI, podePrincipal: true },
              { codigo: '02190304', descricao: 'Arrendamento Rural', area: CI, podePrincipal: true },
              { codigo: '02190305', descricao: 'Câmbio', area: CI, podePrincipal: true },
              { codigo: '02190307', descricao: 'Comissão', area: CI, podePrincipal: true },
              { codigo: '02190308', descricao: 'Comodato', area: CI, podePrincipal: true },
              { codigo: '02190309', descricao: 'Compra e venda', area: CI, podePrincipal: true },
              { codigo: '02190310', descricao: 'Compromisso', area: CI, podePrincipal: true },
              { codigo: '02190311', descricao: 'Constituição de Renda', area: CI, podePrincipal: true },
              { codigo: '02190313', descricao: 'Corretagem', area: CI, podePrincipal: true },
              { codigo: '02190314', descricao: 'Crédito Rural', area: CI, podePrincipal: true },
              { codigo: '02190315', descricao: 'Depósito', area: CI, podePrincipal: true },
              { codigo: '02190316', descricao: 'Doação', area: CI, podePrincipal: true },
              { codigo: '02190317', descricao: 'Edição', area: CI, podePrincipal: true },
              { codigo: '02190318', descricao: 'Empreitada', area: CI, podePrincipal: true },
              { codigo: '02190319', descricao: 'Estimatório', area: CI, podePrincipal: true },
              { codigo: '02190320', descricao: 'Fiança', area: CI, podePrincipal: true },
              { codigo: '02190321', descricao: 'Franquia', area: CI, podePrincipal: true },
              { codigo: '02190322', descricao: 'Jogo e Aposta', area: CI, podePrincipal: true },
              {
                codigo: '02190323', descricao: 'Locação de Imóvel', area: CI,
                subitens: [
                  { codigo: '0219032301', descricao: 'Benfeitorias', area: CI, podePrincipal: true },
                  { codigo: '0219032302', descricao: 'Despejo para Uso de Ascendentes e Descendentes', area: CI, podePrincipal: true },
                  { codigo: '0219032303', descricao: 'Despejo para Uso Próprio', area: CI, podePrincipal: true },
                  { codigo: '0219032304', descricao: 'Despejo por Denúncia Vazia', area: CI, podePrincipal: true },
                  { codigo: '0219032305', descricao: 'Direito de Preferência', area: CI, podePrincipal: true },
                  { codigo: '0219032306', descricao: 'Cobrança de Aluguéis - Sem despejo', area: CI, podePrincipal: true },
                  { codigo: '0219032307', descricao: 'Despejo por Inadimplemento', area: CI, podePrincipal: true },
                  { codigo: '0219032308', descricao: 'Consignação de Chaves', area: CI, podePrincipal: true },
                ],
              },
              { codigo: '02190324', descricao: 'Locação de Móvel', area: CI, podePrincipal: true },
              { codigo: '02190325', descricao: 'Mandato', area: CI, podePrincipal: true },
              { codigo: '02190326', descricao: 'Mútuo', area: CI, podePrincipal: true },
              { codigo: '02190327', descricao: 'Parceria Agrícola e/ou pecuária', area: CI, podePrincipal: true },
              { codigo: '02190328', descricao: 'Prestação de serviços', area: CI, podePrincipal: true },
              {
                codigo: '02190329', descricao: 'Previdência privada', area: CI,
                subitens: [
                  { codigo: '0219032901', descricao: 'Resgate de Contribuição', area: CI, podePrincipal: true },
                ],
              },
              { codigo: '02190330', descricao: 'Representação comercial', area: CI, podePrincipal: true },
              { codigo: '02190331', descricao: 'Seguro', area: CI, podePrincipal: true },
              {
                codigo: '02190332', descricao: 'Sistema Financeiro da Habitação', area: CI,
                subitens: [
                  { codigo: '0219033201', descricao: 'Equivalência salarial', area: CI, podePrincipal: true },
                  { codigo: '0219033202', descricao: 'Quitação', area: CI, podePrincipal: true },
                  { codigo: '0219033203', descricao: 'Reajuste de Prestações', area: CI, podePrincipal: true },
                  { codigo: '0219033204', descricao: 'Revisão do Saldo Devedor', area: CI, podePrincipal: true },
                  { codigo: '0219033205', descricao: 'Seguro', area: CI, podePrincipal: true },
                  { codigo: '0219033206', descricao: 'Sustação/Alteração de Leilão', area: CI, podePrincipal: true },
                  { codigo: '0219033207', descricao: 'Transferência de Financiamento (contrato de gaveta)', area: CI, podePrincipal: true },
                  { codigo: '0219033208', descricao: 'Vícios de Construção', area: CI, podePrincipal: true },
                  { codigo: '0219033209', descricao: 'Programas de Arrendamento Residencial PAR', area: CI, podePrincipal: true },
                  { codigo: '0219033210', descricao: 'Tabela Price', area: CI, podePrincipal: true },
                  { codigo: '0219033211', descricao: 'Sistema Financeiro Imobiliário', area: CI, podePrincipal: true },
                ],
              },
              { codigo: '02190333', descricao: 'Transação', area: CI, podePrincipal: true },
              { codigo: '02190334', descricao: 'Transporte de Coisas', area: CI, podePrincipal: true },
              { codigo: '02190335', descricao: 'Transporte de Pessoas', area: CI, podePrincipal: true },
              { codigo: '02190336', descricao: 'Troca ou Permuta', area: CI, podePrincipal: true },
              { codigo: '02190337', descricao: 'Cartão de Crédito', area: CI, podePrincipal: true },
              { codigo: '02190338', descricao: 'Contratos Bancários', area: CI, podePrincipal: true },
              { codigo: '02190346', descricao: 'Fornecimento', area: CI, podePrincipal: true },
              { codigo: '02190347', descricao: 'Cessão de Direitos', area: CI, podePrincipal: true },
              { codigo: '02190348', descricao: 'Confissão/Composição de Dívida', area: CI, podePrincipal: true },
            ],
          },
          {
            codigo: '021904', descricao: 'Espécies de títulos de crédito', area: CI,
            subitens: [
              { codigo: '02190401', descricao: 'Cédula de Crédito à Exportação', area: CI, podePrincipal: true },
              { codigo: '02190402', descricao: 'Cédula de Crédito Bancário', area: CI, podePrincipal: true },
              { codigo: '02190403', descricao: 'Cédula de Crédito Comercial', area: CI, podePrincipal: true },
              { codigo: '02190404', descricao: 'Cédula de Crédito Industrial', area: CI, podePrincipal: true },
              { codigo: '02190405', descricao: 'Cédula de Crédito Rural', area: CI, podePrincipal: true },
              { codigo: '02190406', descricao: 'Cédula de Produto Rural', area: CI, podePrincipal: true },
              { codigo: '02190407', descricao: 'Cédula Hipotecária', area: CI, podePrincipal: true },
              { codigo: '02190408', descricao: 'Cheque', area: CI, podePrincipal: true },
              { codigo: '02190409', descricao: 'Debêntures', area: CI, podePrincipal: true },
              { codigo: '02190410', descricao: 'Duplicata', area: CI, podePrincipal: true },
              { codigo: '02190411', descricao: 'Letra de Câmbio', area: CI, podePrincipal: true },
              { codigo: '02190412', descricao: 'Nota de Crédito Comercial', area: CI, podePrincipal: true },
              { codigo: '02190413', descricao: 'Nota de Crédito Industrial', area: CI, podePrincipal: true },
              { codigo: '02190414', descricao: 'Nota de Crédito Rural', area: CI, podePrincipal: true },
              { codigo: '02190415', descricao: 'Nota Promissória', area: CI, podePrincipal: true },
              { codigo: '02190416', descricao: 'Warrant', area: CI, podePrincipal: true },
              { codigo: '02190417', descricao: 'Espécies de Títulos de Crédito', area: CI, podePrincipal: true },
            ],
          },
          {
            codigo: '021905', descricao: 'Inadimplemento', area: CI,
            subitens: [
              { codigo: '02190505', descricao: 'Perdas e Danos', area: CI, podePrincipal: true },
              { codigo: '02190506', descricao: 'Rescisão / Resolução', area: CI, podePrincipal: true },
            ],
          },
          {
            codigo: '021907', descricao: 'Títulos de Crédito', area: CI,
            subitens: [
              { codigo: '02190704', descricao: 'Protesto de CDA', area: CI, podePrincipal: true },
            ],
          },
          { codigo: '021908', descricao: 'Transmissão', area: CI, podePrincipal: true },
        ],
      },
      {
        codigo: '0224', descricao: 'Pessoas Jurídicas', area: CI,
        subitens: [
          {
            codigo: '022401', descricao: 'Associação', area: CI,
            subitens: [
              { codigo: '02240101', descricao: 'Assembléia', area: CI, podePrincipal: true },
              { codigo: '02240102', descricao: 'Eleição', area: CI, podePrincipal: true },
              { codigo: '02240103', descricao: 'Exclusão de associado', area: CI, podePrincipal: true },
              { codigo: '02240104', descricao: 'Extinção', area: CI, podePrincipal: true },
              { codigo: '02240105', descricao: 'Inclusão de associado', area: CI, podePrincipal: true },
            ],
          },
          {
            codigo: '022402', descricao: 'Fundação de Direito Privado', area: CI,
            subitens: [
              { codigo: '02240201', descricao: 'Assembléia', area: CI, podePrincipal: true },
              { codigo: '02240202', descricao: 'Eleição', area: CI, podePrincipal: true },
              { codigo: '02240203', descricao: 'Extinção', area: CI, podePrincipal: true },
              { codigo: '02240204', descricao: 'Fiscalização', area: CI, podePrincipal: true },
            ],
          },
          { codigo: '022403', descricao: 'Organizações Religiosas', area: CI, podePrincipal: true },
        ],
      },
      {
        codigo: '0222', descricao: 'Pessoas naturais', area: CI,
        subitens: [
          { codigo: '022201', descricao: 'Capacidade', area: CI, podePrincipal: true },
          { codigo: '022202', descricao: 'Curadoria dos bens do ausente', area: CI, podePrincipal: true },
          { codigo: '022203', descricao: 'Direitos da Personalidade', area: CI, podePrincipal: true },
          { codigo: '022204', descricao: 'Sucessão Provisória', area: CI, podePrincipal: true },
        ],
      },
      { codigo: '0228', descricao: 'Prestação de Contas', area: CI, podePrincipal: true },
      {
        codigo: '0220', descricao: 'Responsabilidade Civil', area: CI,
        subitens: [
          { codigo: '022004', descricao: 'DPVAT', area: CI, podePrincipal: true },
          {
            codigo: '022002', descricao: 'Indenização por Dano Material', area: CI,
            subitens: [
              { codigo: '02200201', descricao: 'Acidente de Trânsito', area: CI, podePrincipal: true },
              { codigo: '02200202', descricao: 'Direito de Imagem', area: CI, podePrincipal: true },
              { codigo: '02200203', descricao: 'Serviços de Saúde', area: CI, podePrincipal: true },
              { codigo: '02200204', descricao: 'Lei de Imprensa', area: CI, podePrincipal: true },
              { codigo: '02200206', descricao: 'Direito Autoral', area: CI, podePrincipal: true },
              { codigo: '02200207', descricao: 'Atraso na Entrega do Imóvel', area: CI, podePrincipal: true },
            ],
          },
          {
            codigo: '022003', descricao: 'Indenização por Dano Moral', area: CI,
            subitens: [
              { codigo: '02200301', descricao: 'Acidente de Trânsito', area: CI, podePrincipal: true },
              { codigo: '02200302', descricao: 'Direito de Imagem', area: CI, podePrincipal: true },
              { codigo: '02200303', descricao: 'Serviços de Saúde', area: CI, podePrincipal: true },
              { codigo: '02200304', descricao: 'Lei de Imprensa', area: CI, podePrincipal: true },
              { codigo: '02200305', descricao: 'Direito Autoral', area: CI, podePrincipal: true },
              { codigo: '02200306', descricao: 'Atraso na Entrega do Imóvel', area: CI, podePrincipal: true },
            ],
          },
        ],
      },
      {
        codigo: '0221', descricao: 'Sucessões', area: CI,
        subitens: [
          { codigo: '022111', descricao: 'Inventário Negativo', area: CI, podePrincipal: true },
          { codigo: '022112', descricao: 'Indignidade', area: CI, podePrincipal: true },
        ],
      },
    ],
  },

  // ── DIREITO DA SAÚDE ───────────────────────────────────────────────────────
  {
    codigo: '15', descricao: 'DIREITO DA SAÚDE', area: SA,
    subitens: [
      { codigo: '1501', descricao: 'Doação e transplante de órgãos, tecidos ou partes', area: SA, podePrincipal: true },
      { codigo: '1502', descricao: 'Genética / Células Tronco', area: SA, podePrincipal: true },
      {
        codigo: '1503', descricao: 'Mental', area: SA,
        subitens: [
          { codigo: '150301', descricao: 'Internação compulsória', area: SA, podePrincipal: true },
          { codigo: '150302', descricao: 'Internação involuntária', area: SA, podePrincipal: true },
          { codigo: '150303', descricao: 'Internação voluntária', area: SA, podePrincipal: true },
        ],
      },
      {
        codigo: '1504', descricao: 'Pública', area: SA,
        subitens: [
          {
            codigo: '150401', descricao: 'Fornecimento de insumos', area: SA,
            subitens: [
              { codigo: '15040101', descricao: 'Cadeira de rodas / cadeira de banho / cama hospitalar', area: SA, podePrincipal: true },
              { codigo: '15040102', descricao: 'Curativos/Bandagem', area: SA, podePrincipal: true },
              { codigo: '15040103', descricao: 'Fraldas', area: SA, podePrincipal: true },
            ],
          },
          {
            codigo: '150403', descricao: 'Internação/Transferência Hospitalar', area: SA,
            subitens: [
              { codigo: '15040301', descricao: 'Leito de enfermaria / leito oncológico', area: SA, podePrincipal: true },
              { codigo: '15040302', descricao: 'Unidade de terapia intensiva (UTI) / unidade de cuidados intensivos (UCI)', area: SA, podePrincipal: true },
            ],
          },
          {
            codigo: '150404', descricao: 'Sistema Único de Saúde (SUS)', area: SA,
            subitens: [
              { codigo: '15040401', descricao: 'Controle Social e Conselhos de Saúde', area: SA, podePrincipal: true },
              { codigo: '15040402', descricao: 'Convênio médico com o SUS', area: SA, podePrincipal: true },
              { codigo: '15040403', descricao: 'Financiamento do SUS', area: SA, podePrincipal: true },
              { codigo: '15040404', descricao: 'Reajuste da tabela do SUS', area: SA, podePrincipal: true },
              { codigo: '15040405', descricao: 'Repasse de verbas do SUS', area: SA, podePrincipal: true },
              { codigo: '15040406', descricao: 'Ressarcimento do SUS', area: SA, podePrincipal: true },
              { codigo: '15040407', descricao: 'Terceirização do SUS', area: SA, podePrincipal: true },
            ],
          },
          {
            codigo: '150405', descricao: 'Tratamento médico-hospitalar', area: SA,
            subitens: [
              {
                codigo: '15040501', descricao: 'Cirurgia', area: SA,
                subitens: [
                  { codigo: '1504050101', descricao: 'Eletiva', area: SA, podePrincipal: true },
                  { codigo: '1504050102', descricao: 'Urgência', area: SA, podePrincipal: true },
                ],
              },
              { codigo: '15040502', descricao: 'Consulta', area: SA, podePrincipal: true },
              { codigo: '15040503', descricao: 'Diálise/Hemodiálise', area: SA, podePrincipal: true },
            ],
          },
          { codigo: '150406', descricao: 'Vigilância Sanitária e Epidemológica', area: SA, podePrincipal: true },
          { codigo: '150407', descricao: 'Tratamento Domiciliar (Home Care)', area: SA, podePrincipal: true },
        ],
      },
      {
        codigo: '1505', descricao: 'Suplementar', area: SA,
        subitens: [
          {
            codigo: '150501', descricao: 'Planos de saúde', area: SA,
            subitens: [
              { codigo: '15050101', descricao: 'Fornecimento de insumos', area: SA, podePrincipal: true },
              { codigo: '15050102', descricao: 'Fornecimento de medicamentos', area: SA, podePrincipal: true },
              { codigo: '15050103', descricao: 'Reajuste contratual', area: SA, podePrincipal: true },
              { codigo: '15050104', descricao: 'Tratamento médico-hospitalar', area: SA, podePrincipal: true },
            ],
          },
          { codigo: '150502', descricao: 'Tratamento Domiciliar (Home Care)', area: SA, podePrincipal: true },
        ],
      },
      { codigo: '1506', descricao: 'Autorização para Interrupção de Gravidez (Aborto)', area: SA, podePrincipal: true },
      { codigo: '1507', descricao: 'Doença Rara', area: SA, podePrincipal: true },
    ],
  },

  // ── DIREITO DO CONSUMIDOR ──────────────────────────────────────────────────
  {
    codigo: '06', descricao: 'DIREITO DO CONSUMIDOR', area: CO,
    subitens: [
      {
        codigo: '0604', descricao: 'Contratos de Consumo', area: CO,
        subitens: [
          {
            codigo: '060401', descricao: 'Bancários', area: CO,
            subitens: [
              { codigo: '06040101', descricao: 'Expurgos Inflacionários / Planos Econômicos', area: CO, podePrincipal: true },
              { codigo: '06040102', descricao: 'Empréstimo consignado', area: CO, podePrincipal: true },
              { codigo: '06040103', descricao: 'Tarifas', area: CO, podePrincipal: true },
              { codigo: '06040104', descricao: 'Crédito Direto ao Consumidor - CDC', area: CO, podePrincipal: true },
              { codigo: '06040105', descricao: 'Crédito Rotativo', area: CO, podePrincipal: true },
              { codigo: '06040107', descricao: 'Revisão de Juros Remuneratórios, Capitalização/Anatocismo', area: CO, podePrincipal: true },
            ],
          },
          { codigo: '060402', descricao: 'Cartão de Crédito', area: CO, podePrincipal: true },
          { codigo: '060403', descricao: 'Consórcio', area: CO, podePrincipal: true },
          { codigo: '060404', descricao: 'Estabelecimentos de Ensino', area: CO, podePrincipal: true },
          { codigo: '060405', descricao: 'Financiamento de Produto', area: CO, podePrincipal: true },
          { codigo: '060406', descricao: 'Fornecimento de Água', area: CO, podePrincipal: true },
          { codigo: '060407', descricao: 'Fornecimento de Energia Elétrica', area: CO, podePrincipal: true },
          { codigo: '060409', descricao: 'Seguro', area: CO, podePrincipal: true },
          { codigo: '060410', descricao: 'Serviços Hospitalares', area: CO, podePrincipal: true },
          { codigo: '060411', descricao: 'Serviços Profissionais', area: CO, podePrincipal: true },
          {
            codigo: '060412', descricao: 'Telefonia', area: CO,
            subitens: [
              { codigo: '06041201', descricao: 'Assinatura Básica Mensal', area: CO, podePrincipal: true },
              { codigo: '06041202', descricao: 'Cobrança indevida de ligações', area: CO, podePrincipal: true },
              { codigo: '06041203', descricao: 'Pulsos Excedentes', area: CO, podePrincipal: true },
            ],
          },
          {
            codigo: '060413', descricao: 'Transporte Aéreo', area: CO,
            subitens: [
              { codigo: '06041301', descricao: 'Acidente Aéreo', area: CO, podePrincipal: true },
              { codigo: '06041302', descricao: 'Atraso de vôo', area: CO, podePrincipal: true },
              { codigo: '06041303', descricao: 'Cancelamento de vôo', area: CO, podePrincipal: true },
              { codigo: '06041304', descricao: 'Extravio de bagagem', area: CO, podePrincipal: true },
              { codigo: '06041305', descricao: 'Overbooking', area: CO, podePrincipal: true },
            ],
          },
          {
            codigo: '060414', descricao: 'Transporte Terrestre', area: CO,
            subitens: [
              { codigo: '06041401', descricao: 'Transporte Ferroviário', area: CO, podePrincipal: true },
              { codigo: '06041402', descricao: 'Transporte Rodoviário', area: CO, podePrincipal: true },
            ],
          },
          { codigo: '060415', descricao: 'Turismo', area: CO, podePrincipal: true },
          { codigo: '060416', descricao: 'Capitalização e Previdência Privada', area: CO, podePrincipal: true },
          { codigo: '060418', descricao: 'Transporte Aquaviário', area: CO, podePrincipal: true },
        ],
      },
      {
        codigo: '0605', descricao: 'Responsabilidade do Fornecedor', area: CO,
        subitens: [
          { codigo: '060501', descricao: 'Abatimento proporcional do preço', area: CO, podePrincipal: true },
          { codigo: '060502', descricao: 'Indenização por Dano Material', area: CO, podePrincipal: true },
          {
            codigo: '060503', descricao: 'Indenização por Dano Moral', area: CO,
            subitens: [
              { codigo: '06050301', descricao: 'Inclusão Indevida em Cadastro de Inadimplentes', area: CO, podePrincipal: true },
              { codigo: '06050302', descricao: 'Protesto Indevido de Título', area: CO, podePrincipal: true },
            ],
          },
          { codigo: '060505', descricao: 'Rescisão do contrato e devolução do dinheiro', area: CO, podePrincipal: true },
          { codigo: '060506', descricao: 'Substituição do Produto', area: CO, podePrincipal: true },
          { codigo: '060507', descricao: 'Produto Impróprio', area: CO, podePrincipal: true },
          {
            codigo: '060508', descricao: 'Registro em Cadastro', area: CO,
            subitens: [
              { codigo: '06050801', descricao: 'Análise de Crédito', area: CO, podePrincipal: true },
            ],
          },
          { codigo: '060509', descricao: 'Repetição do Indébito', area: CO, podePrincipal: true },
        ],
      },
      { codigo: '0606', descricao: 'Dever de Informação', area: CO, podePrincipal: true },
      { codigo: '0607', descricao: 'Irregularidade no atendimento', area: CO, podePrincipal: true },
      { codigo: '0608', descricao: 'Jogos / Sorteios / Promoções comerciais', area: CO, podePrincipal: true },
      { codigo: '0609', descricao: 'Oferta e Publicidade', area: CO, podePrincipal: true },
      { codigo: '0610', descricao: 'Práticas Abusivas', area: CO, podePrincipal: true },
      { codigo: '0611', descricao: 'Vendas casadas', area: CO, podePrincipal: true },
      { codigo: '0612', descricao: 'Cláusulas Abusivas', area: CO, podePrincipal: true },
      { codigo: '0614', descricao: 'Direito Coletivo', area: CO, podePrincipal: true },
      {
        codigo: '0615', descricao: 'Cursos Extracurriculares', area: CO,
        subitens: [
          {
            codigo: '061501', descricao: 'Cobrança', area: CO,
            subitens: [
              { codigo: '06150101', descricao: 'Mensalidades', area: CO, podePrincipal: true },
            ],
          },
        ],
      },
      { codigo: '0616', descricao: 'Superendividamento', area: CO, podePrincipal: true },
    ],
  },

  // ── DIREITO PREVIDENCIÁRIO ─────────────────────────────────────────────────
  {
    codigo: '04', descricao: 'DIREITO PREVIDENCIÁRIO', area: PR,
    subitens: [
      {
        codigo: '0401', descricao: 'Benefícios em Espécie', area: PR,
        subitens: [
          { codigo: '040101', descricao: 'Aposentadoria por Incapacidade Permanente', area: PR, podePrincipal: true },
          {
            codigo: '040102', descricao: 'Aposentadoria por Idade (Art. 48/51)', area: PR,
            subitens: [
              { codigo: '04010201', descricao: 'Aposentadoria Urbana (Art. 48/51)', area: PR, podePrincipal: true },
              { codigo: '04010202', descricao: 'Aposentadoria Rural (Art. 48/51)', area: PR, podePrincipal: true },
            ],
          },
          { codigo: '040104', descricao: 'Aposentadoria Especial (Art. 57/8)', area: PR, podePrincipal: true },
          { codigo: '040105', descricao: 'Auxílio por Incapacidade Temporária', area: PR, podePrincipal: true },
          { codigo: '040106', descricao: 'Salário-Família (Art. 65/70)', area: PR, podePrincipal: true },
          { codigo: '040107', descricao: 'Salário-Maternidade (Art. 71/73)', area: PR, podePrincipal: true },
          { codigo: '040108', descricao: 'Pensão por Morte (Art. 74/9)', area: PR, podePrincipal: true },
          { codigo: '040109', descricao: 'Auxílio-Reclusão (Art. 80)', area: PR, podePrincipal: true },
          { codigo: '040110', descricao: 'Pecúlios (Art. 81/5)', area: PR, podePrincipal: true },
          {
            codigo: '040111', descricao: 'Auxílio-Acidente (Art. 86)', area: PR,
            subitens: [
              { codigo: '04011101', descricao: 'Incapacidade Laborativa Parcial', area: PR, podePrincipal: true },
              { codigo: '04011102', descricao: 'Incapacidade Laborativa Permanente', area: PR, podePrincipal: true },
              { codigo: '04011103', descricao: 'Incapacidade Laborativa Temporária', area: PR, podePrincipal: true },
              { codigo: '04011104', descricao: 'Movimentos Repetitivos/Tenossinovite/LER/DORT', area: PR, podePrincipal: true },
              { codigo: '04011105', descricao: 'Redução da Capacidade Auditiva', area: PR, podePrincipal: true },
            ],
          },
          { codigo: '040112', descricao: 'Abono de Permanência em Serviço (Art. 87)', area: PR, podePrincipal: true },
          { codigo: '040115', descricao: 'Ferroviário', area: PR, podePrincipal: true },
          { codigo: '040116', descricao: 'Ex-combatentes', area: PR, podePrincipal: true },
          { codigo: '040117', descricao: 'Renda Mensal Vitalícia', area: PR, podePrincipal: true },
          { codigo: '040118', descricao: 'Aposentadoria por Tempo de Serviço (Art. 52/4)', area: PR, podePrincipal: true },
          { codigo: '040119', descricao: 'Aposentadoria por Tempo de Contribuição (Art. 55/6)', area: PR, podePrincipal: true },
          { codigo: '040120', descricao: 'Auxílio-Doença Acidentário', area: PR, podePrincipal: true },
          { codigo: '040122', descricao: 'Aposentadoria por Invalidez Acidentária', area: PR, podePrincipal: true },
        ],
      },
      {
        codigo: '0402', descricao: 'RMI - Renda Mensal Inicial, Reajustes e Revisões Específicas', area: PR,
        subitens: [
          {
            codigo: '040201', descricao: 'RMI - Renda Mensal Inicial', area: PR,
            subitens: [
              { codigo: '04020101', descricao: 'RMI pelo art. 202 CF/88 (média dos 36 últimos salários-de-contribuição)', area: PR, podePrincipal: true },
              { codigo: '04020102', descricao: 'RMI pelo art. 1º da Lei 6.423/77 - índices de atualização dos 24 primeiros salários-de-contribuição', area: PR, podePrincipal: true },
              { codigo: '04020103', descricao: 'RMI pela equivalência entre Salário-de-Benefício e Salário-de-Contribuição', area: PR, podePrincipal: true },
              { codigo: '04020104', descricao: 'RMI sem incidência de Teto Limitador', area: PR, podePrincipal: true },
              { codigo: '04020105', descricao: 'RMI da pensão de dependente de ex-combatente', area: PR, podePrincipal: true },
              { codigo: '04020106', descricao: 'Benefício mínimo a partir da CF/88 (art. 201, § 2º CF/88)', area: PR, podePrincipal: true },
              {
                codigo: '04020107', descricao: 'Parcelas e índices de correção do salário-de-contribuição', area: PR,
                subitens: [
                  { codigo: '0402010701', descricao: 'Inclusão do 13º salário (gratificação natalina) no PBC', area: PR, podePrincipal: true },
                ],
              },
              { codigo: '04020108', descricao: 'Limitação do salário-de-benefício e da renda mensal inicial', area: PR, podePrincipal: true },
              { codigo: '04020109', descricao: 'RMI cuja salário-de-benefício supera menor valor teto', area: PR, podePrincipal: true },
              { codigo: '04020110', descricao: 'Escala de Salário-Base', area: PR, podePrincipal: true },
              { codigo: '04020111', descricao: 'Contribuição sobre vinte salários mínimos', area: PR, podePrincipal: true },
              { codigo: '04020112', descricao: 'Cálculo do Benefício de acordo com a Sistemática anterior à Lei 9.876/99', area: PR, podePrincipal: true },
              { codigo: '04020113', descricao: 'IRSM de Fevereiro de 1994 (39,67%)', area: PR, podePrincipal: true },
              { codigo: '04020115', descricao: 'Alteração do coeficiente de cálculo de pensão', area: PR, podePrincipal: true },
              { codigo: '04020116', descricao: 'Alteração do coeficiente de cálculo do benefício', area: PR, podePrincipal: true },
              { codigo: '04020117', descricao: 'Cálculo do benefício de segurado especial de acordo com a Lei 9.876/99', area: PR, podePrincipal: true },
              { codigo: '04020118', descricao: 'Cálculo do fator previdenciário - Lei 9.876/99', area: PR, podePrincipal: true },
              { codigo: '04020119', descricao: 'Alteração do teto máximo para o valor do benefício previdenciário do RGPS (EC 20 e 41)', area: PR, podePrincipal: true },
              { codigo: '04020120', descricao: 'Art. 26 da Lei 8.870/1994', area: PR, podePrincipal: true },
              { codigo: '04020121', descricao: 'Art. 29, II, da Lei 8.213/1991', area: PR, podePrincipal: true },
              { codigo: '04020122', descricao: 'Art. 29, § 5º, da Lei 8.213/1991', area: PR, podePrincipal: true },
            ],
          },
          {
            codigo: '040203', descricao: 'Reajustes e Revisões Específicos', area: PR,
            subitens: [
              { codigo: '04020301', descricao: 'Reajuste pela Súmula 260 do TFR', area: PR, podePrincipal: true },
              { codigo: '04020302', descricao: 'Art. 58 ADCT da CF/88', area: PR, podePrincipal: true },
              { codigo: '04020303', descricao: 'Utilização do PNS no Reajuste de Benefícios', area: PR, podePrincipal: true },
              { codigo: '04020304', descricao: 'Manutenção do Benefício pela equivalência salarial', area: PR, podePrincipal: true },
              { codigo: '04020305', descricao: 'Expurgos inflacionários sobre os benefícios', area: PR, podePrincipal: true },
              { codigo: '04020306', descricao: 'Salário Mínimo de Ncz$ 120,00 para junho/89', area: PR, podePrincipal: true },
              { codigo: '04020307', descricao: 'Reajuste de 147%', area: PR, podePrincipal: true },
              { codigo: '04020308', descricao: 'Reajustamento pelo IGP-DI', area: PR, podePrincipal: true },
              { codigo: '04020317', descricao: 'Reajuste aplicado ao salário mínimo em setembro/94', area: PR, podePrincipal: true },
              {
                codigo: '04020318', descricao: 'Sistemática de conversão dos benefícios previdenciários em URVs', area: PR,
                subitens: [
                  { codigo: '0402031801', descricao: 'Revisão do valor do benefício no primeiro reajuste após a concessão (Art. 21, § 3º, da Lei 8.880/1994)', area: PR, podePrincipal: true },
                ],
              },
              { codigo: '04020319', descricao: 'Reajustamento pelo INPC', area: PR, podePrincipal: true },
              { codigo: '04020320', descricao: 'Art. 144 da Lei 8.213/91 e/ou diferenças decorrentes', area: PR, podePrincipal: true },
              { codigo: '04020321', descricao: 'Gratificação Natalina a partir da CF/88 (Art. 201, § 6º CF/88)', area: PR, podePrincipal: true },
              { codigo: '04020322', descricao: 'Abono da Lei 8.178/91', area: PR, podePrincipal: true },
              { codigo: '04020323', descricao: 'Índice de 4,02% da Lei 8.222/91', area: PR, podePrincipal: true },
              { codigo: '04020324', descricao: 'Desconto do DL 1.910/81', area: PR, podePrincipal: true },
              { codigo: '04020325', descricao: 'Descontos dos benefícios', area: PR, podePrincipal: true },
              { codigo: '04020326', descricao: 'Correção Monetária pela Súmula 71 TFR', area: PR, podePrincipal: true },
              { codigo: '04020327', descricao: 'Correção Monetária de Benefício pago com atraso', area: PR, podePrincipal: true },
              { codigo: '04020328', descricao: 'Reajuste conforme Portaria MPAS 714/1993', area: PR, podePrincipal: true },
            ],
          },
        ],
      },
      {
        codigo: '0403', descricao: 'Disposições Diversas Relativas às Prestações', area: PR,
        subitens: [
          { codigo: '040310', descricao: 'Renúncia ao benefício', area: PR, podePrincipal: true },
        ],
      },
      {
        codigo: '0405', descricao: 'Tempo de serviço', area: PR,
        subitens: [
          { codigo: '040501', descricao: 'Averbação/Cômputo/Conversão de tempo de serviço especial', area: PR, podePrincipal: true },
          { codigo: '040502', descricao: 'Averbação/Cômputo de tempo de serviço de segurado especial (regime de economia familiar)', area: PR, podePrincipal: true },
          { codigo: '040503', descricao: 'Averbação/Cômputo de tempo de serviço rural (empregado/empregador)', area: PR, podePrincipal: true },
          { codigo: '040504', descricao: 'Averbação/Cômputo do tempo de serviço como aluno aprendiz', area: PR, podePrincipal: true },
          { codigo: '040505', descricao: 'Averbação/Cômputo do tempo de serviço militar', area: PR, podePrincipal: true },
          { codigo: '040506', descricao: 'Averbação/Cômputo de tempo de serviço de empregado doméstico', area: PR, podePrincipal: true },
          { codigo: '040507', descricao: 'Averbação/Cômputo de tempo de serviço urbano', area: PR, podePrincipal: true },
          { codigo: '040508', descricao: 'Certidão de Tempo de Serviço', area: PR, podePrincipal: true },
          { codigo: '040509', descricao: 'Contagem Recíproca de Tempo de Serviço', area: PR, podePrincipal: true },
        ],
      },
    ],
  },

  // ── DIREITO DE FAMÍLIA (mantido) ───────────────────────────────────────────
  {
    codigo: 'FAM', descricao: 'DIREITO DE FAMÍLIA', area: FA,
    subitens: [
      {
        codigo: 'FAM-ALIM', descricao: 'Alimentos', area: FA,
        subitens: [
          { codigo: '1116', descricao: 'Fixação de Alimentos', area: FA, podePrincipal: true, norma: 'CC/2002', artigo: 'Art. 1.694' },
          { codigo: '1115', descricao: 'Revisão de Alimentos', area: FA, podePrincipal: true, norma: 'CC/2002', artigo: 'Art. 1.699' },
          { codigo: '1114', descricao: 'Execução de Alimentos', area: FA, podePrincipal: true, norma: 'CPC/2015', artigo: 'Art. 528' },
        ],
      },
      {
        codigo: 'FAM-GUARD', descricao: 'Guarda e Visitas', area: FA,
        subitens: [
          { codigo: '1118', descricao: 'Guarda e Responsabilidade', area: FA, podePrincipal: true, norma: 'CC/2002', artigo: 'Art. 1.583' },
          { codigo: '1117', descricao: 'Regulamentação de Visitas', area: FA, podePrincipal: true, norma: 'CC/2002', artigo: 'Art. 1.589' },
        ],
      },
      {
        codigo: 'FAM-DISS', descricao: 'Dissolução da Entidade Familiar', area: FA,
        subitens: [
          { codigo: '1120', descricao: 'Divórcio Litigioso', area: FA, podePrincipal: true, norma: 'CC/2002', artigo: 'Art. 1.571' },
          { codigo: '1122', descricao: 'União Estável — Dissolução', area: FA, podePrincipal: true, norma: 'CC/2002', artigo: 'Art. 1.723' },
        ],
      },
      {
        codigo: 'FAM-SUC', descricao: 'Sucessões', area: FA,
        subitens: [
          { codigo: '475', descricao: 'Inventário e Partilha', area: FA, podePrincipal: true, norma: 'CC/2002', artigo: 'Art. 1.784' },
          { codigo: '476', descricao: 'Testamento — Abertura / Cumprimento', area: FA, podePrincipal: true, norma: 'CC/2002', artigo: 'Art. 1.857' },
        ],
      },
    ],
  },

  // ── DIREITO ADMINISTRATIVO (mantido) ──────────────────────────────────────
  {
    codigo: 'ADM', descricao: 'DIREITO ADMINISTRATIVO', area: AD,
    subitens: [
      {
        codigo: 'ADM-SERV', descricao: 'Servidor Público', area: AD,
        subitens: [
          { codigo: '10219', descricao: 'Servidor Público Civil — Geral', area: AD, podePrincipal: true, norma: 'Lei Estadual nº 869/1952', artigo: 'Estatuto dos Servidores de MG' },
          { codigo: '10288', descricao: 'Sistema Remuneratório e Benefícios', area: AD, podePrincipal: true, norma: 'CF/88', artigo: 'Art. 37, X' },
          { codigo: '10291', descricao: 'Concurso Público', area: AD, podePrincipal: true, norma: 'CF/88', artigo: 'Art. 37, II' },
        ],
      },
      {
        codigo: 'ADM-RESP', descricao: 'Responsabilidade do Estado', area: AD,
        subitens: [
          { codigo: '9991', descricao: 'Responsabilidade da Administração — Geral', area: AD, podePrincipal: true, norma: 'CF/88', artigo: 'Art. 37, §6º' },
          { codigo: '9992', descricao: 'Indenização por Dano Moral — Responsabilidade Pública', area: AD, podePrincipal: true, norma: 'CF/88', artigo: 'Art. 37, §6º' },
        ],
      },
      {
        codigo: 'ADM-ATO', descricao: 'Atos e Contratos Administrativos', area: AD,
        subitens: [
          { codigo: '9994', descricao: 'Licitação e Contratos Administrativos', area: AD, podePrincipal: true, norma: 'Lei nº 14.133/2021', artigo: 'NLLC' },
        ],
      },
    ],
  },

  // ── DIREITO PROCESSUAL CIVIL E DO TRABALHO ────────────────────────────────
  {
    codigo: '08', descricao: 'DIREITO PROCESSUAL CIVIL E DO TRABALHO', area: PC,
    subitens: [
      {
        codigo: '0801', descricao: 'Partes e Procuradores', area: PC,
        subitens: [
          { codigo: '080105', descricao: 'Assistência Judiciária Gratuita', area: PC, podePrincipal: true },
          { codigo: '080106', descricao: 'Capacidade Processual', area: PC, podePrincipal: true },
          { codigo: '080107', descricao: 'Honorários Periciais', area: PC, podePrincipal: true },
          {
            codigo: '080108', descricao: 'Intervenção de Terceiros', area: PC,
            subitens: [
              { codigo: '08010801', descricao: 'Chamamento ao Processo', area: PC, podePrincipal: true },
              { codigo: '08010802', descricao: 'Denunciação da Lide', area: PC, podePrincipal: true },
              { codigo: '08010803', descricao: 'Nomeação à Autoria', area: PC, podePrincipal: true },
              { codigo: '08010804', descricao: 'Oposição', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '080109', descricao: 'Litigância de Má-Fé', area: PC, podePrincipal: true },
          { codigo: '080110', descricao: 'Litisconsórcio', area: PC, podePrincipal: true },
          {
            codigo: '080111', descricao: 'Procuração', area: PC,
            subitens: [
              { codigo: '08011101', descricao: 'Assinatura Eletrônica / Digital', area: PC, podePrincipal: true },
              { codigo: '08011102', descricao: 'Estatuto Social da Empresa', area: PC, podePrincipal: true },
              { codigo: '08011103', descricao: 'Procurador de Entes Públicos / Autárquicos / Fundacionais', area: PC, podePrincipal: true },
              { codigo: '08011104', descricao: 'Tácito', area: PC, podePrincipal: true },
            ],
          },
          {
            codigo: '080112', descricao: 'Representação em Juízo', area: PC,
            subitens: [
              { codigo: '08011201', descricao: 'Preposto', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '080113', descricao: 'Substituição da Parte', area: PC, podePrincipal: true },
          {
            codigo: '080114', descricao: 'Sucumbência', area: PC,
            subitens: [
              { codigo: '08011401', descricao: 'Custas', area: PC, podePrincipal: true },
              {
                codigo: '08011402', descricao: 'Honorários Advocatícios', area: PC,
                subitens: [
                  { codigo: '0801140201', descricao: 'Sucumbenciais', area: PC, podePrincipal: true },
                  { codigo: '0801140202', descricao: 'Suspensão da Cobrança - Devedor Beneficiário de Assistência Judiciária Gratuita', area: PC, podePrincipal: true },
                  { codigo: '0801140203', descricao: 'Defensores Dativos ou Ad Hoc', area: PC, podePrincipal: true },
                  { codigo: '0801140205', descricao: 'Contratuais', area: PC, podePrincipal: true },
                ],
              },
              { codigo: '08011403', descricao: 'Honorários Advocatícios em Execução Contra a Fazenda Pública', area: PC, podePrincipal: true },
              { codigo: '08011405', descricao: 'Honorários Periciais', area: PC, podePrincipal: true },
            ],
          },
        ],
      },
      {
        codigo: '0802', descricao: 'Atos Processuais', area: PC,
        subitens: [
          {
            codigo: '080204', descricao: 'Prazo', area: PC,
            subitens: [
              { codigo: '08020401', descricao: 'Contagem - Dias Úteis', area: PC, podePrincipal: true },
              { codigo: '08020402', descricao: 'Prorrogação', area: PC, podePrincipal: true },
              { codigo: '08020403', descricao: 'Suspensão / Interrupção', area: PC, podePrincipal: true },
            ],
          },
          {
            codigo: '080205', descricao: 'Nulidade', area: PC,
            subitens: [
              { codigo: '08020501', descricao: 'Nulidade - Ausência de Citação', area: PC, podePrincipal: true },
              { codigo: '08020502', descricao: 'Nulidade - Ausência de Fundamentação de Decisão', area: PC, podePrincipal: true },
              { codigo: '08020503', descricao: 'Nulidade - Ausência de Identificação de Advogado ou de Sociedade de Advogados', area: PC, podePrincipal: true },
              { codigo: '08020504', descricao: 'Nulidade - Ausência de Intimação do Ministério Público', area: PC, podePrincipal: true },
              { codigo: '08020505', descricao: 'Nulidade - Ausência de Nome das Partes', area: PC, podePrincipal: true },
              { codigo: '08020506', descricao: 'Nulidade - Ausência de publicidade de decisão', area: PC, podePrincipal: true },
              { codigo: '08020507', descricao: 'Nulidade - Citação Sem Observância das Prescrições Legais', area: PC, podePrincipal: true },
              { codigo: '08020508', descricao: 'Nulidade - Execução Instaurada Antes de Condição ou Termo', area: PC, podePrincipal: true },
              { codigo: '08020509', descricao: 'Nulidade - Impedimento', area: PC, podePrincipal: true },
              { codigo: '08020510', descricao: 'Nulidade - Intimação Sem Observância das Prescrições Legais', area: PC, podePrincipal: true },
              { codigo: '08020511', descricao: 'Nulidade - Não Observância da Reserva de Plenário', area: PC, podePrincipal: true },
              { codigo: '08020512', descricao: 'Nulidade - Suspeição', area: PC, podePrincipal: true },
              { codigo: '08020513', descricao: 'Nulidade - Título Extrajudicial Não Correspondente a Obrigação Certa, Líquida e Exigível', area: PC, podePrincipal: true },
              { codigo: '08020514', descricao: 'Cerceamento de Defesa', area: PC, podePrincipal: true },
              { codigo: '08020515', descricao: 'Julgamento Extra / Ultra / Citra Petita', area: PC, podePrincipal: true },
              { codigo: '08020516', descricao: 'Negativa de Prestação Jurisdicional', area: PC, podePrincipal: true },
            ],
          },
          {
            codigo: '080206', descricao: 'Valor da Causa', area: PC,
            subitens: [
              { codigo: '08020601', descricao: 'Arbitramento / Majoração', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '080207', descricao: 'Citação', area: PC, podePrincipal: true },
          { codigo: '080208', descricao: 'Intimação / Notificação', area: PC, podePrincipal: true },
        ],
      },
      {
        codigo: '0803', descricao: 'Formação, Suspensão e Extinção do Processo', area: PC,
        subitens: [
          {
            codigo: '080301', descricao: 'Suspensão do Processo', area: PC,
            subitens: [
              { codigo: '08030101', descricao: 'Falência', area: PC, podePrincipal: true },
              { codigo: '08030102', descricao: 'Recuperação Judicial', area: PC, podePrincipal: true },
              { codigo: '08030103', descricao: 'Temas repetitivos / Repercussão Geral', area: PC, podePrincipal: true },
            ],
          },
          {
            codigo: '080302', descricao: 'Extinção do Processo Sem Resolução de Mérito', area: PC,
            subitens: [
              { codigo: '08030201', descricao: 'Ausência de Interesse Processual', area: PC, podePrincipal: true },
              { codigo: '08030202', descricao: 'Ausência de Pressupostos de Constituição e Desenvolvimento', area: PC, podePrincipal: true },
              {
                codigo: '08030203', descricao: 'Legitimidade para a Causa', area: PC,
                subitens: [
                  { codigo: '0803020301', descricao: 'Ausência de Legitimidade para a Causa', area: PC, podePrincipal: true },
                  { codigo: '0803020302', descricao: 'Ausência de Legitimidade para propositura de Ação Civil Pública', area: PC, podePrincipal: true },
                ],
              },
              { codigo: '08030204', descricao: 'Inépcia da Inicial', area: PC, podePrincipal: true },
              { codigo: '08030205', descricao: 'Perempção', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '080303', descricao: 'Modificação ou Alteração do Pedido', area: PC, podePrincipal: true },
          { codigo: '080304', descricao: 'Arquivamento', area: PC, podePrincipal: true },
          {
            codigo: '080305', descricao: 'Condições da Ação', area: PC,
            subitens: [
              { codigo: '08030501', descricao: 'Adequação da Ação / Procedimento', area: PC, podePrincipal: true },
              { codigo: '08030502', descricao: 'Interesse Processual', area: PC, podePrincipal: true },
              { codigo: '08030503', descricao: 'Legitimidade Ativa e Passiva', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '080306', descricao: 'Desistência da Ação', area: PC, podePrincipal: true },
          {
            codigo: '080307', descricao: 'Pressupostos Processuais', area: PC,
            subitens: [
              { codigo: '08030701', descricao: 'Arbitragem', area: PC, podePrincipal: true },
              { codigo: '08030702', descricao: 'Coisa Julgada', area: PC, podePrincipal: true },
              { codigo: '08030703', descricao: 'Litispendência', area: PC, podePrincipal: true },
            ],
          },
        ],
      },
      {
        codigo: '0804', descricao: 'Jurisdição e Competência', area: PC,
        subitens: [
          {
            codigo: '080401', descricao: 'Competência', area: PC,
            subitens: [
              { codigo: '08040101', descricao: 'Competência da Justiça Estadual', area: PC, podePrincipal: true },
              { codigo: '08040102', descricao: 'Competência dos Juizados Especiais', area: PC, podePrincipal: true },
              { codigo: '08040103', descricao: 'Competência por Prerrogativa de Função', area: PC, podePrincipal: true },
              {
                codigo: '08040108', descricao: 'Competência Funcional', area: PC,
                subitens: [
                  { codigo: '0804010801', descricao: 'Interdito Proibitório', area: PC, podePrincipal: true },
                  { codigo: '0804010802', descricao: 'Precatório', area: PC, podePrincipal: true },
                ],
              },
              { codigo: '08040110', descricao: 'Conexão', area: PC, podePrincipal: true },
              { codigo: '08040111', descricao: 'Prevenção', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '080403', descricao: 'Conflito de Competência', area: PC, podePrincipal: true },
          { codigo: '080404', descricao: 'Exceção de Incompetência Territorial', area: PC, podePrincipal: true },
        ],
      },
      {
        codigo: '0805', descricao: 'Liquidação / Cumprimento / Execução', area: PC,
        subitens: [
          { codigo: '080501', descricao: 'Ato Atentatório à Dignidade da Justiça', area: PC, podePrincipal: true },
          { codigo: '080502', descricao: 'Benefício de Ordem', area: PC, podePrincipal: true },
          { codigo: '080503', descricao: 'Causas Supervenientes à Sentença', area: PC, podePrincipal: true },
          { codigo: '080504', descricao: 'Concurso de Credores', area: PC, podePrincipal: true },
          {
            codigo: '080505', descricao: 'Penhora / Depósito / Avaliação', area: PC,
            subitens: [
              { codigo: '08050501', descricao: 'Avaliação / Reavaliação', area: PC, podePrincipal: true },
              { codigo: '08050502', descricao: 'Dispensa de Penhora - Entidades Filantrópicas e Seus Diretores', area: PC, podePrincipal: true },
              { codigo: '08050503', descricao: 'Excesso de Penhora', area: PC, podePrincipal: true },
              {
                codigo: '08050504', descricao: 'Impenhorabilidade', area: PC,
                subitens: [
                  { codigo: '0805050401', descricao: 'Bem de Família', area: PC, podePrincipal: true },
                  { codigo: '0805050402', descricao: 'Bem Público', area: PC, podePrincipal: true },
                  { codigo: '0805050403', descricao: 'Instrumentos de Trabalho', area: PC, podePrincipal: true },
                  { codigo: '0805050404', descricao: 'Remuneração / Proventos / Pensões e Outros Rendimentos', area: PC, podePrincipal: true },
                ],
              },
              { codigo: '08050505', descricao: 'Ordem de Preferência', area: PC, podePrincipal: true },
              { codigo: '08050506', descricao: 'Penhora no Rosto dos Autos', area: PC, podePrincipal: true },
              { codigo: '08050507', descricao: 'Penhora Online / BACEN JUD', area: PC, podePrincipal: true },
              { codigo: '08050508', descricao: 'Reforço de Penhora', area: PC, podePrincipal: true },
              { codigo: '08050509', descricao: 'Seguro-Garantia Judicial', area: PC, podePrincipal: true },
              { codigo: '08050510', descricao: 'Substituição de Penhora', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '080506', descricao: 'Efeito Suspensivo / Impugnação / Embargos à Execução', area: PC, podePrincipal: true },
          { codigo: '080507', descricao: 'Fato Superveniente ao Término do Prazo para Impugnação', area: PC, podePrincipal: true },
          {
            codigo: '080509', descricao: 'Expropriação de Bens', area: PC,
            subitens: [
              { codigo: '08050901', descricao: 'Adjudicação', area: PC, podePrincipal: true },
              { codigo: '08050902', descricao: 'Arrematação', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '080510', descricao: 'Extinção da Execução', area: PC, podePrincipal: true },
          { codigo: '080511', descricao: 'Fraude à Execução', area: PC, podePrincipal: true },
          { codigo: '080512', descricao: 'Imunidade de Execução', area: PC, podePrincipal: true },
          { codigo: '080513', descricao: 'Inexequibilidade do Título / Inexigibilidade da Obrigação', area: PC, podePrincipal: true },
          { codigo: '080514', descricao: 'Levantamento de Valor', area: PC, podePrincipal: true },
          { codigo: '080515', descricao: 'Multa Cominatória / Astreintes', area: PC, podePrincipal: true },
          { codigo: '080516', descricao: 'Multa de 10%', area: PC, podePrincipal: true },
          {
            codigo: '080517', descricao: 'Obrigação de Entregar', area: PC,
            subitens: [
              { codigo: '08051701', descricao: 'Busca e Apreensão', area: PC, podePrincipal: true },
              { codigo: '08051702', descricao: 'Imissão na Posse', area: PC, podePrincipal: true },
              { codigo: '08051703', descricao: 'Requerimento de Apreensão de Veículo', area: PC, podePrincipal: true },
              { codigo: '08051704', descricao: 'Requerimento de Reintegração de Posse', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '080518', descricao: 'Obrigação de Fazer / Não Fazer', area: PC, podePrincipal: true },
          {
            codigo: '080519', descricao: 'Precatório', area: PC,
            subitens: [
              { codigo: '08051901', descricao: 'Crédito Complementar', area: PC, podePrincipal: true },
              { codigo: '08051902', descricao: 'Fracionamento', area: PC, podePrincipal: true },
              { codigo: '08051903', descricao: 'Sequestro de Verbas Públicas', area: PC, podePrincipal: true },
              { codigo: '08051904', descricao: 'Fraude / Quebra de ordem cronológica', area: PC, podePrincipal: true },
              { codigo: '08051905', descricao: 'Liquidação Parcelada', area: PC, podePrincipal: true },
              { codigo: '08051906', descricao: 'Pagamento', area: PC, podePrincipal: true },
              { codigo: '08051907', descricao: 'Parcela Incontroversa', area: PC, podePrincipal: true },
              { codigo: '08051908', descricao: 'Juros de Mora', area: PC, podePrincipal: true },
              { codigo: '08051909', descricao: 'Período de Graça', area: PC, podePrincipal: true },
              { codigo: '08051910', descricao: 'Cessão de Créditos', area: PC, podePrincipal: true },
            ],
          },
          {
            codigo: '080520', descricao: 'Prisão Civil', area: PC,
            subitens: [
              { codigo: '08052001', descricao: 'Alimentos', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '080521', descricao: 'Remição', area: PC, podePrincipal: true },
          {
            codigo: '080522', descricao: 'Requisição de Pequeno Valor - RPV', area: PC,
            subitens: [
              { codigo: '08052201', descricao: 'Renúncia Parcial', area: PC, podePrincipal: true },
              { codigo: '08052202', descricao: 'Parte Incontroversa', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '080523', descricao: 'Sucessão', area: PC, podePrincipal: true },
          {
            codigo: '080524', descricao: 'Valor da Execução / Cálculo / Atualização', area: PC,
            subitens: [
              {
                codigo: '08052401', descricao: 'Correção Monetária', area: PC,
                subitens: [
                  { codigo: '0805240101', descricao: 'Taxa Referencial - TR x IPCA-E', area: PC, podePrincipal: true },
                  { codigo: '0805240102', descricao: 'Taxa SELIC', area: PC, podePrincipal: true },
                ],
              },
              {
                codigo: '08052402', descricao: 'Juros', area: PC,
                subitens: [
                  { codigo: '0805240201', descricao: 'Fazenda Pública', area: PC, podePrincipal: true },
                ],
              },
              { codigo: '08052403', descricao: 'Taxa SELIC', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '080525', descricao: 'Cumprimento Provisório de Sentença', area: PC, podePrincipal: true },
          { codigo: '080526', descricao: 'Execução Provisória', area: PC, podePrincipal: true },
          { codigo: '080527', descricao: 'Hipoteca Judiciária', area: PC, podePrincipal: true },
          { codigo: '080528', descricao: 'Obrigação de Dar', area: PC, podePrincipal: true },
          { codigo: '080536', descricao: 'Preclusão / Coisa Julgada', area: PC, podePrincipal: true },
        ],
      },
      {
        codigo: '0806', descricao: 'Tutela Provisória', area: PC,
        subitens: [
          { codigo: '080601', descricao: 'Caução', area: PC, podePrincipal: true },
          { codigo: '080602', descricao: 'Indenização do Prejuízo', area: PC, podePrincipal: true },
          { codigo: '080603', descricao: 'Liminar', area: PC, podePrincipal: true },
          { codigo: '080604', descricao: 'Separação de Corpos', area: PC, podePrincipal: true },
          { codigo: '080605', descricao: 'Revisão de Tutela Antecipada Antecedente', area: PC, podePrincipal: true },
          { codigo: '080606', descricao: 'Tutela de Evidência', area: PC, podePrincipal: true },
          { codigo: '080607', descricao: 'Tutela de Urgência', area: PC, podePrincipal: true },
        ],
      },
      {
        codigo: '0807', descricao: 'Ministério Público', area: PC,
        subitens: [
          { codigo: '080701', descricao: 'Intimação', area: PC, podePrincipal: true },
          { codigo: '080702', descricao: 'Legitimidade', area: PC, podePrincipal: true },
          { codigo: '080703', descricao: 'Prazo / Contagem do Prazo', area: PC, podePrincipal: true },
        ],
      },
      {
        codigo: '0808', descricao: 'Órgãos Judiciários e Auxiliares da Justiça', area: PC,
        subitens: [
          {
            codigo: '080801', descricao: 'Do Juiz', area: PC,
            subitens: [
              { codigo: '08080101', descricao: 'Impedimento', area: PC, podePrincipal: true },
              { codigo: '08080102', descricao: 'Suspeição', area: PC, podePrincipal: true },
              { codigo: '08080103', descricao: 'Poderes, Deveres e Responsabilidades do Juiz', area: PC, podePrincipal: true },
            ],
          },
          {
            codigo: '080802', descricao: 'Dos Auxiliares da Justiça', area: PC,
            subitens: [
              { codigo: '08080201', descricao: 'Impedimento', area: PC, podePrincipal: true },
              { codigo: '08080202', descricao: 'Suspeição', area: PC, podePrincipal: true },
            ],
          },
        ],
      },
      {
        codigo: '0809', descricao: 'Processo e Procedimento', area: PC,
        subitens: [
          {
            codigo: '080901', descricao: 'Antecipação de Tutela / Tutela Específica', area: PC,
            subitens: [
              { codigo: '08090101', descricao: 'Bloqueio / Desbloqueio de Valores', area: PC, podePrincipal: true },
              { codigo: '08090102', descricao: 'Efeito Suspensivo a Recurso', area: PC, podePrincipal: true },
              { codigo: '08090103', descricao: 'Suspensão da Execução', area: PC, podePrincipal: true },
              { codigo: '08090104', descricao: 'Perda de Eficácia', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '080902', descricao: 'Erro de Procedimento', area: PC, podePrincipal: true },
          {
            codigo: '080903', descricao: 'Provas', area: PC,
            subitens: [
              { codigo: '08090301', descricao: 'Depoimento', area: PC, podePrincipal: true },
              { codigo: '08090302', descricao: 'Provas em geral', area: PC, podePrincipal: true },
              {
                codigo: '08090303', descricao: 'Ônus da Prova', area: PC,
                subitens: [
                  { codigo: '0809030301', descricao: 'Distribuição Dinâmica - Inversão', area: PC, podePrincipal: true },
                ],
              },
              { codigo: '08090304', descricao: 'Repetição da Prova', area: PC, podePrincipal: true },
              { codigo: '08090305', descricao: 'Prova Ilícita', area: PC, podePrincipal: true },
              { codigo: '08090306', descricao: 'Alteração da Ordem de Produção', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '080904', descricao: 'Revelia', area: PC, podePrincipal: true },
          { codigo: '080905', descricao: 'Vícios Formais da Sentença', area: PC, podePrincipal: true },
          { codigo: '080906', descricao: 'Peticionamento Eletrônico', area: PC, podePrincipal: true },
          {
            codigo: '080907', descricao: 'Processo Judicial Eletrônico - PJe', area: PC,
            subitens: [
              { codigo: '08090701', descricao: 'Classificação e Organização de Documentos no Sistema', area: PC, podePrincipal: true },
              { codigo: '08090702', descricao: 'Conversão dos Autos Físicos em Eletrônicos - Responsabilidade', area: PC, podePrincipal: true },
              { codigo: '08090703', descricao: 'Indisponibilidade do Sistema - Devolução de Prazo', area: PC, podePrincipal: true },
              { codigo: '08090704', descricao: 'Uso de Sistema de Peticionamento Diverso - Petição Juridicamente Inexistente', area: PC, podePrincipal: true },
            ],
          },
        ],
      },
      {
        codigo: '0810', descricao: 'Recurso', area: PC,
        subitens: [
          {
            codigo: '081001', descricao: 'Cabimento', area: PC,
            subitens: [
              {
                codigo: '08100101', descricao: 'Pressupostos Extrínsecos', area: PC,
                subitens: [
                  { codigo: '0810010101', descricao: 'Tempestividade', area: PC, podePrincipal: true },
                  { codigo: '0810010102', descricao: 'Regularidade de Representação', area: PC, podePrincipal: true },
                ],
              },
            ],
          },
          { codigo: '081002', descricao: 'Efeitos', area: PC, podePrincipal: true },
          { codigo: '081003', descricao: 'Preparo/Deserção', area: PC, podePrincipal: true },
          { codigo: '081004', descricao: 'Regularidade Formal', area: PC, podePrincipal: true },
          {
            codigo: '081005', descricao: 'Prazo', area: PC,
            subitens: [
              { codigo: '08100501', descricao: 'Fac-símile', area: PC, podePrincipal: true },
              { codigo: '08100502', descricao: 'Protocolo Integrado / Descentralizado', area: PC, podePrincipal: true },
              { codigo: '08100503', descricao: 'Tempestividade', area: PC, podePrincipal: true },
            ],
          },
        ],
      },
      {
        codigo: '0811', descricao: 'Objetos de cartas precatórias cíveis/de ordem', area: PC,
        subitens: [
          {
            codigo: '081101', descricao: 'Atos executórios', area: PC,
            subitens: [
              { codigo: '08110101', descricao: 'Ação Anulatória', area: PC, podePrincipal: true },
              { codigo: '08110102', descricao: 'Embargos de Terceiro', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '081102', descricao: 'Citação', area: PC, podePrincipal: true },
          { codigo: '081103', descricao: 'Diligências', area: PC, podePrincipal: true },
          { codigo: '081104', descricao: 'Intimação', area: PC, podePrincipal: true },
          { codigo: '081105', descricao: 'Oitiva', area: PC, podePrincipal: true },
        ],
      },
      {
        codigo: '0812', descricao: 'Ação Rescisória', area: PC,
        subitens: [
          { codigo: '081201', descricao: 'Antecipação de Tutela / Recebimento como Cautelar', area: PC, podePrincipal: true },
          {
            codigo: '081202', descricao: 'Cabimento', area: PC,
            subitens: [
              { codigo: '08120201', descricao: 'Decisão Homologatória', area: PC, podePrincipal: true },
              { codigo: '08120202', descricao: 'Sentença de Liquidação', area: PC, podePrincipal: true },
              { codigo: '08120203', descricao: 'Contrariedade a Súmula', area: PC, podePrincipal: true },
              { codigo: '08120204', descricao: 'Rescisória de Rescisória', area: PC, podePrincipal: true },
            ],
          },
          {
            codigo: '081203', descricao: 'Contestação', area: PC,
            subitens: [
              { codigo: '08120301', descricao: 'Prazo / Termo Inicial', area: PC, podePrincipal: true },
            ],
          },
          {
            codigo: '081204', descricao: 'Decadência', area: PC,
            subitens: [
              {
                codigo: '08120401', descricao: 'Termo Inicial do Prazo', area: PC,
                subitens: [
                  { codigo: '0812040101', descricao: 'Ministério Público', area: PC, podePrincipal: true },
                ],
              },
            ],
          },
          { codigo: '081205', descricao: 'Decisão Rescindenda', area: PC, podePrincipal: true },
          { codigo: '081206', descricao: 'Documento Novo', area: PC, podePrincipal: true },
          {
            codigo: '081207', descricao: 'Dolo ou Colusão entre as Partes', area: PC,
            subitens: [
              { codigo: '08120701', descricao: 'Lide Simulada', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '081208', descricao: 'Erro de Fato', area: PC, podePrincipal: true },
          { codigo: '081209', descricao: 'Falsidade de Prova', area: PC, podePrincipal: true },
          { codigo: '081210', descricao: 'Honorários Advocatícios', area: PC, podePrincipal: true },
          { codigo: '081211', descricao: 'Impossibilidade Jurídica do Pedido', area: PC, podePrincipal: true },
          {
            codigo: '081212', descricao: 'Invalidação de Confissão, Desistência ou Transação', area: PC,
            subitens: [
              { codigo: '08121201', descricao: 'Acordo Homologado/Efeitos', area: PC, podePrincipal: true },
              { codigo: '08121202', descricao: 'Processo Fraudulento', area: PC, podePrincipal: true },
              { codigo: '08121203', descricao: 'Vício de Consentimento', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '081213', descricao: 'Juiz Impedido / Absolutamente Incompetente', area: PC, podePrincipal: true },
          {
            codigo: '081214', descricao: 'Legitimidade Ativa', area: PC,
            subitens: [
              { codigo: '08121401', descricao: 'Parte ou Sucessor no Processo da Decisão Rescindenda', area: PC, podePrincipal: true },
              { codigo: '08121402', descricao: 'Terceiro Juridicamente Interessado', area: PC, podePrincipal: true },
            ],
          },
          {
            codigo: '081215', descricao: 'Ofensa à Coisa Julgada', area: PC,
            subitens: [
              { codigo: '08121501', descricao: 'Interpretação e Alcance do Título Executivo', area: PC, podePrincipal: true },
            ],
          },
          {
            codigo: '081216', descricao: 'Pressuposto Processual', area: PC,
            subitens: [
              { codigo: '08121601', descricao: 'Prova do Trânsito em Julgado da Decisão Rescindenda', area: PC, podePrincipal: true },
              { codigo: '08121602', descricao: 'Representação Processual', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '081217', descricao: 'Prevaricação / Concussão / Corrupção do Juiz', area: PC, podePrincipal: true },
          { codigo: '081218', descricao: 'Pronunciamento Explícito (Prequestionamento)', area: PC, podePrincipal: true },
          { codigo: '081219', descricao: 'Reexame de Fatos e Provas', area: PC, podePrincipal: true },
          { codigo: '081220', descricao: 'Revelia / Confissão', area: PC, podePrincipal: true },
          {
            codigo: '081221', descricao: 'Violação Literal à Disposição de Lei', area: PC,
            subitens: [
              { codigo: '08122101', descricao: 'Dupla Fundamentação da Decisão Rescindenda', area: PC, podePrincipal: true },
            ],
          },
        ],
      },
      {
        codigo: '0813', descricao: 'Mandado de Segurança', area: PC,
        subitens: [
          { codigo: '081301', descricao: 'Autenticação', area: PC, podePrincipal: true },
          {
            codigo: '081302', descricao: 'Cabimento', area: PC,
            subitens: [
              { codigo: '08130201', descricao: 'Ação Rescisória', area: PC, podePrincipal: true },
              { codigo: '08130202', descricao: 'Remessa Ex-Officio', area: PC, podePrincipal: true },
              { codigo: '08130203', descricao: 'Tutela Provisória de Urgência', area: PC, podePrincipal: true },
            ],
          },
          { codigo: '081303', descricao: 'Competência', area: PC, podePrincipal: true },
          { codigo: '081304', descricao: 'Depósito Prévio de Multa Administrativa', area: PC, podePrincipal: true },
          { codigo: '081305', descricao: 'Emenda a Inicial', area: PC, podePrincipal: true },
          { codigo: '081306', descricao: 'Legitimidade - Autoridade Coatora', area: PC, podePrincipal: true },
          { codigo: '081307', descricao: 'Penhora de Salário / Proventos', area: PC, podePrincipal: true },
          { codigo: '081308', descricao: 'Prazo Decadencial', area: PC, podePrincipal: true },
          { codigo: '081309', descricao: 'Prova Pré-constituída', area: PC, podePrincipal: true },
          { codigo: '081310', descricao: 'Reiteração', area: PC, podePrincipal: true },
          { codigo: '081311', descricao: 'Transcendência', area: PC, podePrincipal: true },
        ],
      },
      {
        codigo: '0814', descricao: 'Penalidades Processuais', area: PC,
        subitens: [
          { codigo: '081401', descricao: 'Ato Atentatório à Dignidade da Justiça', area: PC, podePrincipal: true },
          { codigo: '081402', descricao: 'Ausência Injustificada de Testemunha', area: PC, podePrincipal: true },
          { codigo: '081403', descricao: 'Descumprimento de Obrigações de Auxiliares da Justiça', area: PC, podePrincipal: true },
          { codigo: '081404', descricao: 'Multa do Art. 475-J do CPC', area: PC, podePrincipal: true },
          { codigo: '081405', descricao: 'Multa por Agravo Inadmissível ou Infundado', area: PC, podePrincipal: true },
          { codigo: '081406', descricao: 'Multa por Descumprimento de Ordem Judicial', area: PC, podePrincipal: true },
          { codigo: '081407', descricao: 'Multa por ED Protelatórios', area: PC, podePrincipal: true },
        ],
      },
      {
        codigo: '0815', descricao: 'Processo Coletivo', area: PC,
        subitens: [
          {
            codigo: '081501', descricao: 'Ação Civil Pública', area: PC,
            subitens: [
              { codigo: '08150101', descricao: 'Astreintes', area: PC, podePrincipal: true },
              { codigo: '08150102', descricao: 'Cabimento / Interesse Processual', area: PC, podePrincipal: true },
              { codigo: '08150103', descricao: 'Competência Territorial', area: PC, podePrincipal: true },
              { codigo: '08150104', descricao: 'Legitimidade Ativa', area: PC, podePrincipal: true },
              { codigo: '08150105', descricao: 'Termo de Ajustamento de Conduta - TAC', area: PC, podePrincipal: true },
              { codigo: '08150106', descricao: 'Tutela Inibitória (Obrigação de Fazer e Não Fazer)', area: PC, podePrincipal: true },
            ],
          },
          {
            codigo: '081502', descricao: 'Mandado de Segurança Coletivo', area: PC,
            subitens: [
              { codigo: '08150201', descricao: 'Autoridade Coatora', area: PC, podePrincipal: true },
              { codigo: '08150202', descricao: 'Cabimento', area: PC, podePrincipal: true },
              { codigo: '08150203', descricao: 'Competência', area: PC, podePrincipal: true },
              { codigo: '08150204', descricao: 'Emenda a Inicial', area: PC, podePrincipal: true },
              { codigo: '08150205', descricao: 'Legitimidade', area: PC, podePrincipal: true },
              { codigo: '08150206', descricao: 'Prazo Decadencial', area: PC, podePrincipal: true },
              { codigo: '08150207', descricao: 'Prova Pré-constituída', area: PC, podePrincipal: true },
            ],
          },
        ],
      },
      { codigo: '0816', descricao: 'Moratórios Comuns', area: PC, podePrincipal: true },
    ],
  },

  // ── QUESTÕES DE ALTA COMPLEXIDADE ─────────────────────────────────────────
  {
    codigo: '14', descricao: 'QUESTÕES DE ALTA COMPLEXIDADE, GRANDE IMPACTO E REPERCUSSÃO', area: QA,
    subitens: [
      { codigo: '1410', descricao: 'Enchentes no Rio Grande do Sul em 2024', area: QA, podePrincipal: true },
    ],
  },
];

