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
  subitens?: NodoAssunto[];
}

export interface EntidadeFederal {
  cnpj: string;
  nome: string;
}

export interface NivelSigilo {
  codigo: string;
  descricao: string;
}

export interface ForoJF {
  codigo: string;
  descricao: string;
}

export const classesProcessuais: ClasseProcessual[] = [
  { codigo: '7', descricao: 'Procedimento Comum Cível', grupo: 'CÍVEL' },
  { codigo: '120', descricao: 'Mandado de Segurança Cível', grupo: 'CONSTITUCIONAL' },
  { codigo: '65', descricao: 'Ação Civil Pública', grupo: 'CÍVEL' },
  { codigo: '436', descricao: 'Procedimento do Juizado Especial Cível', grupo: 'JEF' },
  { codigo: '32', descricao: 'Consignação em Pagamento', grupo: 'CÍVEL' },
  { codigo: '156', descricao: 'Cumprimento de Sentença', grupo: 'EXECUÇÃO' },
  { codigo: '159', descricao: 'Execução de Título Extrajudicial', grupo: 'EXECUÇÃO' },
  { codigo: '281', descricao: 'Ação Rescisória', grupo: 'CÍVEL' },
  { codigo: '1028', descricao: 'Habeas Data', grupo: 'CONSTITUCIONAL' },
  { codigo: '58', descricao: 'Interdito Proibitório', grupo: 'CÍVEL' },
  { codigo: '1116', descricao: 'Ação de Alimentos', grupo: 'FAMÍLIA' },
  { codigo: '475', descricao: 'Inventário e Partilha', grupo: 'SUCESSÕES' },
  { codigo: '48', descricao: 'Embargos de Terceiro', grupo: 'CÍVEL' },
  { codigo: '12078', descricao: 'Cumprimento de Sentença contra a Fazenda Pública', grupo: 'EXECUÇÃO' },
  { codigo: '81', descricao: 'Busca e Apreensão em Alienação Fiduciária', grupo: 'CÍVEL' },
  { codigo: '40119', descricao: 'Benefício Previdenciário – Aposentadoria por Invalidez', grupo: 'PREVIDENCIÁRIO' },
  { codigo: '40120', descricao: 'Benefício Previdenciário – Auxílio-Doença', grupo: 'PREVIDENCIÁRIO' },
  { codigo: '40121', descricao: 'Revisão de Benefício Previdenciário', grupo: 'PREVIDENCIÁRIO' },
  { codigo: '1117', descricao: 'Regulamentação de Visitas', grupo: 'FAMÍLIA' },
  { codigo: '1118', descricao: 'Guarda e Responsabilidade', grupo: 'FAMÍLIA' },
];

export const assuntosCNJ: AssuntoCNJ[] = [
  { codigo: '10431', descricao: 'Responsabilidade Civil', area: 'DIREITO CIVIL' },
  { codigo: '10433', descricao: 'Indenização por Dano Moral', area: 'DIREITO CIVIL' },
  { codigo: '10434', descricao: 'Indenização por Dano Material', area: 'DIREITO CIVIL' },
  { codigo: '10435', descricao: 'Indenização por Dano Moral – Acidente de Trânsito', area: 'DIREITO CIVIL' },
  { codigo: '10445', descricao: 'Erro Médico', area: 'DIREITO CIVIL' },
  { codigo: '10450', descricao: 'Obrigação de Fazer / Não Fazer', area: 'DIREITO CIVIL' },
  { codigo: '10455', descricao: 'Contratos em Geral', area: 'DIREITO CIVIL' },
  { codigo: '10470', descricao: 'Dano Estético', area: 'DIREITO CIVIL' },
  { codigo: '10460', descricao: 'Responsabilidade do Fornecedor', area: 'DIREITO DO CONSUMIDOR' },
  { codigo: '10461', descricao: 'Defeito / Vício do Produto', area: 'DIREITO DO CONSUMIDOR' },
  { codigo: '10462', descricao: 'Práticas Abusivas', area: 'DIREITO DO CONSUMIDOR' },
  { codigo: '9991', descricao: 'Responsabilidade da Administração', area: 'DIREITO ADMINISTRATIVO' },
  { codigo: '9992', descricao: 'Indenização por Dano Moral – Responsabilidade Pública', area: 'DIREITO ADMINISTRATIVO' },
  { codigo: '10219', descricao: 'Servidor Público Civil', area: 'DIREITO ADMINISTRATIVO' },
  { codigo: '10288', descricao: 'Sistema Remuneratório e Benefícios', area: 'DIREITO ADMINISTRATIVO' },
  { codigo: '6119', descricao: 'RMI – Renda Mensal Inicial, Reajustes e Revisões', area: 'DIREITO PREVIDENCIÁRIO' },
  { codigo: '6153', descricao: 'Benefício Previdenciário – Revisão', area: 'DIREITO PREVIDENCIÁRIO' },
  { codigo: '7769', descricao: 'Abatimento Proporcional do Preço', area: 'DIREITO DO CONSUMIDOR' },
  { codigo: '15301', descricao: 'Dano Moral Coletivo Decorrente de Dano Ambiental', area: 'DIREITO AMBIENTAL' },
  { codigo: '1156', descricao: 'Direito do Consumidor – Geral', area: 'DIREITO DO CONSUMIDOR' },
];

export const prioridades = [
  'Idoso (60 a 80 anos)',
  'Idoso (acima de 80 anos)',
  'Portador de doença grave',
  'Pessoa com deficiência',
  'Violência doméstica e familiar',
  'Estatuto da Criança e do Adolescente',
  'Medida de urgência',
  'Juízo 100% Digital',
  'Pessoa em situação de rua',
  'Adolescente acautelado',
];

export const tiposDocumento = [
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

export const tiposPeticaoIncidental = [
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

// ─── New data for fidelized PeticaoInicialPage ───

export const ritos: string[] = [
  'Procedimento Comum (CPC, art. 318)',
  'Procedimento Especial (CPC, Livro I, Parte Especial)',
  'Juizado Especial Federal — JEF (Lei 10.259/2001)',
  'Juizado Especial Federal Criminal — JEFC',
  'Turma Recursal dos JEFs',
];

export const tiposAcaoJEF: string[] = [
  'Concessão / Restabelecimento de Benefício Previdenciário',
  'Revisão de Benefício Previdenciário',
  'Auxílio-Doença / BPC-LOAS',
  'Aposentadoria por Invalidez',
  'Pensão por Morte',
  'Seguro Desemprego',
  'FGTS — Fundo de Garantia',
  'Restituição de Imposto de Renda (IRPF)',
  'Servidor Público Federal — remuneração',
  'Outros (JEF Cível — valor até 60 salários mínimos)',
];

export const niveisSigno: NivelSigilo[] = [
  { codigo: 'publico', descricao: 'Público' },
  { codigo: 'segredo', descricao: 'Segredo de Justiça (art. 189, CPC)' },
  { codigo: 'sigiloso', descricao: 'Sigiloso (art. 5º, LX, CF/88)' },
  { codigo: 'absolutamente_sigiloso', descricao: 'Absolutamente Sigiloso (sigilo absoluto)' },
];

export const forosJFMG: ForoJF[] = [
  { codigo: 'SJMG-BH', descricao: 'Seção Judiciária de Minas Gerais — Belo Horizonte (SJMG)' },
  { codigo: 'SJMG-UBL', descricao: 'Subseção Judiciária de Uberlândia' },
  { codigo: 'SJMG-JF', descricao: 'Subseção Judiciária de Juiz de Fora' },
  { codigo: 'SJMG-UBA', descricao: 'Subseção Judiciária de Uberaba' },
  { codigo: 'SJMG-MC', descricao: 'Subseção Judiciária de Montes Claros' },
  { codigo: 'SJMG-GV', descricao: 'Subseção Judiciária de Governador Valadares' },
  { codigo: 'SJMG-PC', descricao: 'Subseção Judiciária de Poços de Caldas' },
  { codigo: 'SJMG-VA', descricao: 'Subseção Judiciária de Varginha' },
  { codigo: 'SJMG-DI', descricao: 'Subseção Judiciária de Divinópolis' },
  { codigo: 'SJMG-PM', descricao: 'Subseção Judiciária de Patos de Minas' },
  { codigo: 'SJMG-IB', descricao: 'Subseção Judiciária de Ipatinga' },
  { codigo: 'SJMG-TE', descricao: 'Subseção Judiciária de Teófilo Otoni' },
];

export const entidadesFederais: EntidadeFederal[] = [
  { cnpj: '29.979.036/0001-40', nome: 'Instituto Nacional do Seguro Social — INSS' },
  { cnpj: '00.394.460/0001-41', nome: 'União Federal (Advocacia-Geral da União)' },
  { cnpj: '00.360.305/0001-04', nome: 'Caixa Econômica Federal — CEF' },
  { cnpj: '00.000.000/0001-91', nome: 'Banco do Brasil S.A.' },
  { cnpj: '10.674.076/0001-05', nome: 'Conselho Regional de Medicina de MG — CRM/MG' },
  { cnpj: '02.697.938/0001-11', nome: 'Conselho Federal de Medicina — CFM' },
  { cnpj: '05.914.970/0001-04', nome: 'Departamento Nacional de Trânsito — DENATRAN' },
  { cnpj: '04.358.088/0001-59', nome: 'Agência Nacional de Vigilância Sanitária — ANVISA' },
  { cnpj: '02.582.601/0001-88', nome: 'Agência Nacional de Saúde Suplementar — ANS' },
  { cnpj: '00.795.906/0001-60', nome: 'Universidade Federal de Minas Gerais — UFMG' },
  { cnpj: '21.944.906/0001-55', nome: 'Hospital das Clínicas da UFMG — HC/UFMG' },
  { cnpj: '03.126.487/0001-06', nome: 'Empresa Brasileira de Correios e Telégrafos — ECT' },
  { cnpj: '33.683.111/0001-07', nome: 'Petróleo Brasileiro S.A. — Petrobrás' },
  { cnpj: '00.489.828/0001-54', nome: 'Empresa Brasileira de Infraestrutura Aeroportuária — INFRAERO' },
  { cnpj: '00.037.116/0001-40', nome: 'Departamento Nacional de Infraestrutura de Transportes — DNIT' },
  { cnpj: '01.798.786/0001-10', nome: 'Agência Nacional de Energia Elétrica — ANEEL' },
  { cnpj: '02.011.671/0001-29', nome: 'Agência Nacional de Telecomunicações — ANATEL' },
  { cnpj: '49.247.646/0001-50', nome: 'Companhia Energética de Minas Gerais — CEMIG' },
  { cnpj: '07.155.811/0001-19', nome: 'Companhia de Saneamento de Minas Gerais — COPASA' },
];

export const arvoreAssuntos: NodoAssunto[] = [
  {
    codigo: 'PREV',
    descricao: 'DIREITO PREVIDENCIÁRIO',
    area: 'DIREITO PREVIDENCIÁRIO',
    subitens: [
      {
        codigo: 'PREV-BEN',
        descricao: 'Benefícios em Espécie',
        area: 'DIREITO PREVIDENCIÁRIO',
        subitens: [
          { codigo: '40119', descricao: 'Aposentadoria por Invalidez', area: 'DIREITO PREVIDENCIÁRIO' },
          { codigo: '40120', descricao: 'Auxílio-Doença', area: 'DIREITO PREVIDENCIÁRIO' },
          { codigo: '40121', descricao: 'Revisão de Benefício Previdenciário', area: 'DIREITO PREVIDENCIÁRIO' },
          { codigo: '6119', descricao: 'RMI – Renda Mensal Inicial, Reajustes e Revisões', area: 'DIREITO PREVIDENCIÁRIO' },
          { codigo: '6153', descricao: 'Benefício Previdenciário – Revisão Geral', area: 'DIREITO PREVIDENCIÁRIO' },
        ],
      },
      {
        codigo: 'PREV-BPC',
        descricao: 'BPC/LOAS',
        area: 'DIREITO PREVIDENCIÁRIO',
        subitens: [
          { codigo: '6120', descricao: 'Benefício de Prestação Continuada (LOAS)', area: 'DIREITO PREVIDENCIÁRIO' },
          { codigo: '6121', descricao: 'BPC – Pessoa com Deficiência', area: 'DIREITO PREVIDENCIÁRIO' },
          { codigo: '6122', descricao: 'BPC – Idoso (art. 203, V, CF/88)', area: 'DIREITO PREVIDENCIÁRIO' },
        ],
      },
    ],
  },
  {
    codigo: 'CIVIL',
    descricao: 'DIREITO CIVIL',
    area: 'DIREITO CIVIL',
    subitens: [
      {
        codigo: 'CIVIL-RESP',
        descricao: 'Responsabilidade Civil',
        area: 'DIREITO CIVIL',
        subitens: [
          { codigo: '10431', descricao: 'Responsabilidade Civil — Geral', area: 'DIREITO CIVIL' },
          { codigo: '10433', descricao: 'Indenização por Dano Moral', area: 'DIREITO CIVIL' },
          { codigo: '10434', descricao: 'Indenização por Dano Material', area: 'DIREITO CIVIL' },
          { codigo: '10435', descricao: 'Indenização por Dano Moral – Acidente de Trânsito', area: 'DIREITO CIVIL' },
          { codigo: '10445', descricao: 'Erro Médico', area: 'DIREITO CIVIL' },
          { codigo: '10470', descricao: 'Dano Estético', area: 'DIREITO CIVIL' },
        ],
      },
      {
        codigo: 'CIVIL-OBR',
        descricao: 'Obrigações',
        area: 'DIREITO CIVIL',
        subitens: [
          { codigo: '10450', descricao: 'Obrigação de Fazer / Não Fazer', area: 'DIREITO CIVIL' },
          { codigo: '10455', descricao: 'Contratos em Geral', area: 'DIREITO CIVIL' },
        ],
      },
    ],
  },
  {
    codigo: 'CONS',
    descricao: 'DIREITO DO CONSUMIDOR',
    area: 'DIREITO DO CONSUMIDOR',
    subitens: [
      {
        codigo: 'CONS-RESP',
        descricao: 'Responsabilidade do Fornecedor',
        area: 'DIREITO DO CONSUMIDOR',
        subitens: [
          { codigo: '10460', descricao: 'Responsabilidade do Fornecedor — Geral', area: 'DIREITO DO CONSUMIDOR' },
          { codigo: '10461', descricao: 'Defeito / Vício do Produto', area: 'DIREITO DO CONSUMIDOR' },
          { codigo: '10462', descricao: 'Práticas Abusivas', area: 'DIREITO DO CONSUMIDOR' },
          { codigo: '7769', descricao: 'Abatimento Proporcional do Preço', area: 'DIREITO DO CONSUMIDOR' },
          { codigo: '1156', descricao: 'Direito do Consumidor – Geral', area: 'DIREITO DO CONSUMIDOR' },
        ],
      },
    ],
  },
  {
    codigo: 'ADM',
    descricao: 'DIREITO ADMINISTRATIVO',
    area: 'DIREITO ADMINISTRATIVO',
    subitens: [
      {
        codigo: 'ADM-RESP',
        descricao: 'Responsabilidade da Administração',
        area: 'DIREITO ADMINISTRATIVO',
        subitens: [
          { codigo: '9991', descricao: 'Responsabilidade da Administração — Geral', area: 'DIREITO ADMINISTRATIVO' },
          { codigo: '9992', descricao: 'Indenização por Dano Moral – Responsabilidade Pública', area: 'DIREITO ADMINISTRATIVO' },
        ],
      },
      {
        codigo: 'ADM-SERV',
        descricao: 'Servidor Público',
        area: 'DIREITO ADMINISTRATIVO',
        subitens: [
          { codigo: '10219', descricao: 'Servidor Público Civil', area: 'DIREITO ADMINISTRATIVO' },
          { codigo: '10288', descricao: 'Sistema Remuneratório e Benefícios', area: 'DIREITO ADMINISTRATIVO' },
        ],
      },
    ],
  },
  {
    codigo: 'AMB',
    descricao: 'DIREITO AMBIENTAL',
    area: 'DIREITO AMBIENTAL',
    subitens: [
      {
        codigo: 'AMB-DANO',
        descricao: 'Dano Ambiental',
        area: 'DIREITO AMBIENTAL',
        subitens: [
          { codigo: '15301', descricao: 'Dano Moral Coletivo Decorrente de Dano Ambiental', area: 'DIREITO AMBIENTAL' },
        ],
      },
    ],
  },
];
