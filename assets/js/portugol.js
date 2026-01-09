/**
 * Definição de linguagem Portugol para highlight.js
 * Baseado no portugol.xml (formato Kate)
 */
window.hljsPortugol = function(hljs) {
  // Palavras-chave de estrutura
  const STRUCTURE = [
    'Algoritmo', 'Inicio', 'Fim', 'Entrada', 'Saida', 
    'Var', 'Procedimento', 'Funcao', 'FimFuncao', 
    'FimProcedimento', 'Retorne'
  ];

  // Palavras-chave de controle de fluxo
  const CONTROL_FLOW = [
    'Se', 'Senao', 'SenaoSe', 'Entao', 'FimSe',
    'Enquanto', 'FimEnquanto',
    'Para', 'FimPara', 'De', 'Ate', 'Passo', 'Faca',
    'ParaCada', 'Em', 'FimParaCada',
    'Repita', 'AteQue',
    'Escolha', 'Caso', 'FimEscolha', 'Caso Outro',
    'Pare', 'Continue'
  ];

  // Funções de entrada/saída
  const IO = [
    'Leia', 'Escreva', 'Informe', 'Imprima', 
    'Mostre', 'Inicialize', 'Atualize'
  ];

  // Tipos de dados
  const TYPES = [
    'Inteiro', 'Real', 'Caractere', 'Logico', 
    'Vetor', 'Matriz', 'Texto'
  ];

  // Literais e operadores lógicos
  const LITERALS = ['verdadeiro', 'falso', 'nulo'];
  const LOGICAL_OPS = ['E', 'OU', 'NAO', 'Mod', 'Div'];

  return {
    name: 'Portugol',
    aliases: ['portugol', 'ptg'],
    case_insensitive: false,
    keywords: {
      keyword: CONTROL_FLOW.join(' '),
      built_in: IO.join(' '),
      type: TYPES.join(' '),
      literal: LITERALS.join(' ')
    },
    contains: [
      // Nome do algoritmo após "Algoritmo:"
      {
        className: 'title',
        begin: /Algoritmo\s*:\s*/,
        end: /$/,
        contains: [
          {
            className: 'string',
            begin: /"/,
            end: /"/
          }
        ]
      },
      // Palavras de estrutura (em negrito/destaque especial)
      {
        className: 'keyword',
        begin: '\\b(' + STRUCTURE.join('|') + ')\\b'
      },
      // Operadores lógicos
      {
        className: 'operator',
        begin: '\\b(' + LOGICAL_OPS.join('|') + ')\\b'
      },
      // Operador de atribuição <-
      {
        className: 'operator',
        begin: /<-/
      },
       // Operador de concatenação <<
       {
        className: 'operator',
        begin: /<</
      },
      // Strings
      {
        className: 'string',
        begin: /"/,
        end: /"/,
        contains: [hljs.BACKSLASH_ESCAPE]
      },
      // Comentários de linha //
      hljs.C_LINE_COMMENT_MODE,
      // Comentários de bloco /* */
      hljs.C_BLOCK_COMMENT_MODE,
      // Números
      {
        className: 'number',
        begin: /\b\d+(\.\d+)?\b/
      },
      // Variáveis após declaração de tipo
      {
        className: 'variable',
        begin: /\b(Inteiro|Real|Caractere|Logico|Vetor|Matriz)\s+/,
        end: /\s|$/,
        excludeBegin: true,
        contains: [
          {
            className: 'variable',
            begin: /\w+/
          }
        ]
      },
      // Índices de array [x]
      {
        className: 'number',
        begin: /\[/,
        end: /\]/,
        contains: [
          {
            className: 'number',
            begin: /\d+/
          },
          {
            className: 'variable',
            begin: /\w+/
          }
        ]
      }
    ]
  };
};

