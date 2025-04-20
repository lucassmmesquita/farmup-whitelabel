// src/services/api/hierarchyService.ts
import { IndicatorTree, Indicator, IndicatorStatus } from '@/types/metrics';

export const getIndicatorStatus = (value: number, target: number): IndicatorStatus => {
  const variation = ((value - target) / target) * 100;
  if (variation >= 0) return 'above';
  if (variation < 0) return 'below';
  return 'neutral';
};

const calculateIndicatorStatus = (indicator: Partial<Indicator>): IndicatorStatus => {
  if (!indicator.value || !indicator.target) return 'neutral';
  
  const value = typeof indicator.value === 'number' ? indicator.value : parseFloat(indicator.value);
  const target = typeof indicator.target === 'number' ? indicator.target : parseFloat(indicator.target);
  
  if (isNaN(value) || isNaN(target)) return 'neutral';
  
  return getIndicatorStatus(value, target);
};

// Dados mock para a árvore de indicadores - Faturamento e Cupons
export const getIndicatorTree = (): IndicatorTree => {
  // Fluxo 1: Diagnóstico por Faturamento
  const faturamento = {
    id: 'faturamento',
    name: 'Faturamento',
    value: 56789.50,
    formattedValue: 'R$ 56.789,50',
    target: 60000,
    formattedTarget: 'R$ 60.000,00',
    variation: '-5.35%',
    icon: 'dollar-sign',
    isPrimary: false,
    description: 'Valor total de vendas no período selecionado.',
    flowType: 'faturamento'
  };
  
  const ticketMedio = {
    id: 'ticketMedio',
    name: 'Ticket Médio',
    value: 91.15,
    formattedValue: 'R$ 91,15',
    target: 100,
    formattedTarget: 'R$ 100,00',
    variation: '-8.85%',
    icon: 'shopping-cart',
    parentId: 'faturamento',
    isPrimary: false,
    description: 'Valor médio gasto por cliente em cada compra.',
    flowType: 'faturamento'
  };
  
  const uvc = {
    id: 'uvc',
    name: 'UVC',
    value: 3.2,
    formattedValue: '3,2',
    target: 3.5,
    formattedTarget: '3,5',
    variation: '-8.57%',
    icon: 'package',
    parentId: 'ticketMedio',
    isPrimary: true,
    description: 'Unidades de venda por cupom. Representa quantos itens cada cliente leva em média.',
    flowType: 'faturamento'
  };
  
  const precoMedio = {
    id: 'precoMedio',
    name: 'Preço Médio',
    value: 28.48,
    formattedValue: 'R$ 28,48',
    target: 28.57,
    formattedTarget: 'R$ 28,57',
    variation: '-0.31%',
    icon: 'tag',
    parentId: 'ticketMedio',
    isPrimary: true,
    description: 'Preço médio dos produtos vendidos.',
    flowType: 'faturamento'
  };
  
  const aderenciaEstoque = {
    id: 'aderenciaEstoque',
    name: 'Aderência ao Estoque Ideal',
    value: 68.5,
    formattedValue: '68,5%',
    target: 85,
    formattedTarget: '85%',
    variation: '-19.41%',
    icon: 'bar-chart-2',
    parentId: 'uvc',
    isPrimary: true,
    description: 'Percentual de aderência ao estoque ideal para produtos recorrentes.',
    flowType: 'faturamento'
  };
  
  const proporcaoGenericos = {
    id: 'proporcaoGenericos',
    name: 'Proporção Genéricos/Referência',
    value: 42.3,
    formattedValue: '42,3%',
    target: 50,
    formattedTarget: '50%',
    variation: '-15.40%',
    icon: 'pie-chart',
    parentId: 'uvc',
    isPrimary: true,
    description: 'Proporção entre medicamentos genéricos e de referência vendidos.',
    flowType: 'faturamento'
  };
  
  const indiceCompetitividade = {
    id: 'indiceCompetitividade',
    name: 'Índice Competitividade',
    value: 89.7,
    formattedValue: '89,7%',
    target: 95,
    formattedTarget: '95%',
    variation: '-5.58%',
    icon: 'trending-up',
    parentId: 'precoMedio',
    isPrimary: true,
    description: 'Comparação dos preços praticados com os preços do mercado local.',
    flowType: 'faturamento'
  };
  
  // Fluxo 2: Diagnóstico por Cupom
  const qtdCupons = {
    id: 'qtdCupons',
    name: 'Qtd. Cupons',
    value: 623,
    formattedValue: '623',
    target: 650,
    formattedTarget: '650',
    variation: '-4.15%',
    icon: 'file-text',
    isPrimary: false,
    description: 'Número total de cupons fiscais emitidos.',
    flowType: 'cupom'
  };
  
  const fluxoPessoas = {
    id: 'fluxoPessoas',
    name: 'Fluxo de Pessoas',
    value: 960,
    formattedValue: '960',
    target: 1000,
    formattedTarget: '1000',
    variation: '-4.00%',
    icon: 'users',
    parentId: 'qtdCupons',
    isPrimary: false,
    description: 'Total de pessoas que entraram na loja.',
    flowType: 'cupom'
  };
  
  const taxaConversao = {
    id: 'taxaConversao',
    name: 'Taxa de Conversão',
    value: 64.9,
    formattedValue: '64,9%',
    target: 70,
    formattedTarget: '70%',
    variation: '-7.29%',
    icon: 'percent',
    parentId: 'qtdCupons',
    isPrimary: false,
    description: 'Percentual de entrantes que efetivamente realizaram compras.',
    flowType: 'cupom'
  };
  
  const entrantes = {
    id: 'entrantes',
    name: 'Entrantes',
    value: 960,
    formattedValue: '960',
    target: 1000,
    formattedTarget: '1000',
    variation: '-4.00%',
    icon: 'log-in',
    parentId: 'fluxoPessoas',
    isPrimary: false,
    description: 'Pessoas que entraram na loja no período.',
    flowType: 'cupom'
  };
  
  const cronicos = {
    id: 'cronicos',
    name: 'Crônicos',
    value: 420,
    formattedValue: '420',
    target: 450,
    formattedTarget: '450',
    variation: '-6.67%',
    icon: 'activity',
    parentId: 'entrantes',
    isPrimary: true,
    description: 'Clientes que buscam medicamentos de uso contínuo.',
    flowType: 'cupom'
  };
  
  const idosos = {
    id: 'idosos',
    name: 'Idosos',
    value: 310,
    formattedValue: '310',
    target: 300,
    formattedTarget: '300',
    variation: '+3.33%',
    icon: 'user',
    parentId: 'entrantes',
    isPrimary: true,
    description: 'Clientes idosos que entraram na loja, detectados por IA de câmeras.',
    flowType: 'cupom'
  };
  
  const percentualSortimento = {
    id: 'percentualSortimento',
    name: '% Sortimento',
    value: 82.5,
    formattedValue: '82,5%',
    target: 90,
    formattedTarget: '90%',
    variation: '-8.33%',
    icon: 'grid',
    parentId: 'taxaConversao',
    isPrimary: true,
    description: 'Percentual de adequação do sortimento de produtos ao perfil da loja.',
    flowType: 'cupom'
  };
  
  const deixeiDeVender = {
    id: 'deixeiDeVender',
    name: '% Evolução "Deixei de Vender"',
    value: 8.7,
    formattedValue: '8,7%',
    target: 5,
    formattedTarget: '5%',
    variation: '-74.00%',
    icon: 'x-circle',
    parentId: 'taxaConversao',
    isPrimary: true,
    description: 'Percentual de vendas perdidas por falta de produtos.',
    flowType: 'cupom'
  };
  
  const percentualRuptura = {
    id: 'percentualRuptura',
    name: '% Ruptura',
    value: 5.2,
    formattedValue: '5,2%',
    target: 3,
    formattedTarget: '3%',
    variation: '-73.33%',
    icon: 'alert-triangle',
    parentId: 'taxaConversao',
    isPrimary: true,
    description: 'Percentual de produtos não disponíveis devido à ruptura de estoque.',
    flowType: 'cupom'
  };
  
  const disponibilidadePBM = {
    id: 'disponibilidadePBM',
    name: '% Disponibilidade PBM',
    value: 91.5,
    formattedValue: '91,5%',
    target: 95,
    formattedTarget: '95%',
    variation: '-3.68%',
    icon: 'credit-card',
    parentId: 'taxaConversao',
    isPrimary: true,
    description: 'Disponibilidade de Programa de Benefício em Medicamentos.',
    flowType: 'cupom'
  };
  
  const conversaoPBM = {
    id: 'conversaoPBM',
    name: '% Conversão Produto PBM',
    value: 76.3,
    formattedValue: '76,3%',
    target: 85,
    formattedTarget: '85%',
    variation: '-10.24%',
    icon: 'repeat',
    parentId: 'taxaConversao',
    isPrimary: true,
    description: 'Taxa de conversão específica para produtos do Programa de Benefício em Medicamentos.',
    flowType: 'cupom'
  };
  
  // Atualizar status com base nos valores e metas
  const indicators = [
    // Fluxo de Faturamento
    { ...faturamento, status: calculateIndicatorStatus(faturamento) },
    { ...ticketMedio, status: calculateIndicatorStatus(ticketMedio) },
    { ...uvc, status: calculateIndicatorStatus(uvc) },
    { ...precoMedio, status: calculateIndicatorStatus(precoMedio) },
    { ...aderenciaEstoque, status: calculateIndicatorStatus(aderenciaEstoque) },
    { ...proporcaoGenericos, status: calculateIndicatorStatus(proporcaoGenericos) },
    { ...indiceCompetitividade, status: calculateIndicatorStatus(indiceCompetitividade) },
    
    // Fluxo de Cupom
    { ...qtdCupons, status: calculateIndicatorStatus(qtdCupons) },
    { ...fluxoPessoas, status: calculateIndicatorStatus(fluxoPessoas) },
    { ...taxaConversao, status: calculateIndicatorStatus(taxaConversao) },
    { ...entrantes, status: calculateIndicatorStatus(entrantes) },
    { ...cronicos, status: calculateIndicatorStatus(cronicos) },
    { ...idosos, status: calculateIndicatorStatus(idosos) },
    { ...percentualSortimento, status: calculateIndicatorStatus(percentualSortimento) },
    { ...deixeiDeVender, status: calculateIndicatorStatus(deixeiDeVender) },
    { ...percentualRuptura, status: calculateIndicatorStatus(percentualRuptura) },
    { ...disponibilidadePBM, status: calculateIndicatorStatus(disponibilidadePBM) },
    { ...conversaoPBM, status: calculateIndicatorStatus(conversaoPBM) },
  ];
  
  // Definir as relações entre os indicadores
  const relations = [
    // Fluxo de Faturamento
    { sourceId: 'ticketMedio', targetId: 'faturamento', impact: 0.6, flowType: 'faturamento' },
    { sourceId: 'uvc', targetId: 'ticketMedio', impact: 0.5, flowType: 'faturamento' },
    { sourceId: 'precoMedio', targetId: 'ticketMedio', impact: 0.5, flowType: 'faturamento' },
    { sourceId: 'aderenciaEstoque', targetId: 'uvc', impact: 0.6, flowType: 'faturamento' },
    { sourceId: 'proporcaoGenericos', targetId: 'uvc', impact: 0.4, flowType: 'faturamento' },
    { sourceId: 'indiceCompetitividade', targetId: 'precoMedio', impact: 0.7, flowType: 'faturamento' },
    
    // Fluxo de Cupom
    { sourceId: 'fluxoPessoas', targetId: 'qtdCupons', impact: 0.5, flowType: 'cupom' },
    { sourceId: 'taxaConversao', targetId: 'qtdCupons', impact: 0.5, flowType: 'cupom' },
    { sourceId: 'entrantes', targetId: 'fluxoPessoas', impact: 1.0, flowType: 'cupom' },
    { sourceId: 'cronicos', targetId: 'entrantes', impact: 0.5, flowType: 'cupom' },
    { sourceId: 'idosos', targetId: 'entrantes', impact: 0.5, flowType: 'cupom' },
    { sourceId: 'percentualSortimento', targetId: 'taxaConversao', impact: 0.2, flowType: 'cupom' },
    { sourceId: 'deixeiDeVender', targetId: 'taxaConversao', impact: 0.2, flowType: 'cupom' },
    { sourceId: 'percentualRuptura', targetId: 'taxaConversao', impact: 0.2, flowType: 'cupom' },
    { sourceId: 'disponibilidadePBM', targetId: 'taxaConversao', impact: 0.2, flowType: 'cupom' },
    { sourceId: 'conversaoPBM', targetId: 'taxaConversao', impact: 0.2, flowType: 'cupom' },
  ];
  
  return { indicators, relations };
};

// Obter recomendações para indicadores primários
export const getRecommendations = (indicatorId: string) => {
  const recommendations = {
    // Fluxo de Faturamento - UVC
    'uvc': [
      {
        id: '1',
        title: 'Reduzir ruptura de estoque',
        description: 'Ajuste automatizado de parâmetros de compra para produtos com alta demanda nos últimos 30 dias',
        impact: 'Potencial aumento de 12% em UVC',
        icon: 'trending-up',
        action: 'Ajustar parâmetros de compra',
        actionId: 'ajuste-estoque-001',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Implementar sugestão de produtos complementares',
        description: 'Configure cross-selling para os 20 produtos mais vendidos, como pacotes de medicamento + vitamina C',
        impact: 'Potencial aumento de 8% em UVC',
        icon: 'shuffle',
        action: 'Configurar cross-selling',
        actionId: 'cross-selling-002',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Ativar pacotes promocionais',
        description: 'Criar combos para dermocosméticos com baixa conversão, oferecendo desconto na compra conjunta',
        impact: 'Potencial aumento de 15% em UVC',
        icon: 'package',
        action: 'Criar combos',
        actionId: 'pacotes-promo-003',
        priority: 'high'
      }
    ],
    
    // Fluxo de Faturamento - Preço Médio
    'precoMedio': [
      {
        id: '1',
        title: 'Ampliar mix de produtos premium',
        description: 'Aumentar visibilidade de dermocosméticos e produtos premium nas gôndolas principais',
        impact: 'Potencial aumento de 7% no preço médio',
        icon: 'arrow-up-right',
        action: 'Ajustar exposição',
        actionId: 'mix-premium-001',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Rever política de descontos',
        description: 'Ajustar descontos em produtos com alta elasticidade de preço para otimizar margem',
        impact: 'Potencial aumento de 5% no preço médio',
        icon: 'percent',
        action: 'Ajustar descontos',
        actionId: 'ajuste-desconto-002',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Expandir categorias de dermocosméticos',
        description: 'Aumentar capilaridade em categorias de maior valor agregado como anti-idade e proteção solar',
        impact: 'Potencial aumento de 9% no preço médio',
        icon: 'plus-circle',
        action: 'Expandir categorias',
        actionId: 'expansao-categorias-003',
        priority: 'high'
      }
    ],
    
    // Novos indicadores do Fluxo de Faturamento
    'aderenciaEstoque': [
      {
        id: '1',
        title: 'Otimizar estoque para produtos recorrentes',
        description: 'Analisar histórico de compras e definir estoque mínimo para medicamentos de uso contínuo',
        impact: 'Aumento de 15% na aderência ao estoque ideal',
        icon: 'bar-chart-2',
        action: 'Otimizar estoque',
        actionId: 'estoque-recorrentes-001',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Implementar alertas de reposição',
        description: 'Configurar alertas automáticos quando produtos recorrentes atingirem nível crítico',
        impact: 'Redução de 30% em ruptura de produtos recorrentes',
        icon: 'bell',
        action: 'Configurar alertas',
        actionId: 'alertas-reposicao-002',
        priority: 'medium'
      }
    ],
    
    'proporcaoGenericos': [
      {
        id: '1',
        title: 'Campanha de substituição de referência por genérico',
        description: 'Treinar equipe para oferecer opções de genéricos quando cliente solicitar medicamento de referência',
        impact: 'Aumento de 12% na proporção de genéricos',
        icon: 'pie-chart',
        action: 'Treinar equipe',
        actionId: 'treinar-genericos-001',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Melhorar exposição de genéricos',
        description: 'Reorganizar gôndolas para destacar genéricos próximos aos medicamentos de referência',
        impact: 'Aumento de 8% nas vendas de genéricos',
        icon: 'layout',
        action: 'Reorganizar gôndolas',
        actionId: 'exposicao-genericos-002',
        priority: 'medium'
      }
    ],
    
    'indiceCompetitividade': [
      {
        id: '1',
        title: 'Análise de preços da concorrência',
        description: 'Realizar pesquisa de preços em concorrentes locais para os 100 produtos mais vendidos',
        impact: 'Identificação de oportunidades de ajuste de preços',
        icon: 'search',
        action: 'Realizar pesquisa',
        actionId: 'pesquisa-precos-001',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Ajustar preços em itens estratégicos',
        description: 'Revisar precificação de itens-chave com base na concorrência local',
        impact: 'Melhoria de 5% no índice de competitividade',
        icon: 'edit',
        action: 'Ajustar preços',
        actionId: 'ajuste-precos-002',
        priority: 'high'
      }
    ],
    
    // Fluxo de Cupom - Indicadores primários
    'cronicos': [
      {
        id: '1',
        title: 'Programa de fidelidade para pacientes crônicos',
        description: 'Criar programa de benefícios para clientes com uso contínuo de medicamentos',
        impact: 'Aumento de 20% em clientes recorrentes',
        icon: 'heart',
        action: 'Implementar programa',
        actionId: 'fidelidade-cronicos-001',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Alerta de recompra para medicamentos contínuos',
        description: 'Configurar sistema de alertas para contatar clientes próximo à data de recompra',
        impact: 'Aumento de 15% na retenção de pacientes crônicos',
        icon: 'calendar',
        action: 'Configurar alertas',
        actionId: 'alerta-recompra-002',
        priority: 'medium'
      }
    ],
    
    'idosos': [
      {
        id: '1',
        title: 'Melhorar acessibilidade da loja',
        description: 'Adequar espaços para melhor circulação e acesso de clientes idosos',
        impact: 'Aumento de 10% na satisfação de clientes idosos',
        icon: 'user',
        action: 'Adequar espaço',
        actionId: 'acessibilidade-001',
        priority: 'medium'
      },
      {
        id: '2',
        title: 'Treinamento para atendimento ao público idoso',
        description: 'Capacitar equipe com técnicas de atendimento específicas para idosos',
        impact: 'Aumento de 15% na conversão de clientes idosos',
        icon: 'users',
        action: 'Treinar equipe',
        actionId: 'treinamento-idosos-002',
        priority: 'high'
      }
    ],
    
    'percentualSortimento': [
      {
        id: '1',
        title: 'Análise de cluster para adequação do mix',
        description: 'Analisar perfil de consumo da loja e adequar mix de produtos',
        impact: 'Aumento de 8% no sortimento adequado',
        icon: 'grid',
        action: 'Analisar mix',
        actionId: 'analise-mix-001',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Implementar produtos regionais',
        description: 'Incluir produtos com alta demanda regional no mix da loja',
        impact: 'Aumento de 5% nas vendas locais',
        icon: 'map-pin',
        action: 'Incluir produtos',
        actionId: 'produtos-regionais-002',
        priority: 'medium'
      }
    ],
    
    'deixeiDeVender': [
      {
        id: '1',
        title: 'Reduzir eventos "Deixei de Vender"',
        description: 'Implementar sistema de acompanhamento das vendas perdidas e ações corretivas',
        impact: 'Redução de 30% em vendas perdidas',
        icon: 'x-circle',
        action: 'Implementar sistema',
        actionId: 'sistema-ddv-001',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Análise de causas de "Deixei de Vender"',
        description: 'Identificar principais motivos de vendas perdidas e criar plano de ação',
        impact: 'Redução de 20% em eventos DDV',
        icon: 'search',
        action: 'Analisar causas',
        actionId: 'analise-ddv-002',
        priority: 'medium'
      }
    ],
    
    'percentualRuptura': [
      {
        id: '1',
        title: 'Reduzir ruptura dos 100 principais itens',
        description: 'Criar processo de gestão diária de estoque para top 100 produtos',
        impact: 'Redução de 50% em ruptura de itens principais',
        icon: 'alert-triangle',
        action: 'Implementar gestão',
        actionId: 'gestao-ruptura-001',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Otimizar parâmetros de pedido automático',
        description: 'Ajustar estoque mínimo e ponto de pedido para reduzir rupturas',
        impact: 'Redução de 30% na ruptura geral',
        icon: 'sliders',
        action: 'Ajustar parâmetros',
        actionId: 'parametros-pedido-002',
        priority: 'high'
      }
    ],
    
    'disponibilidadePBM': [
      {
        id: '1',
        title: 'Ampliar cobertura de PBMs',
        description: 'Implementar novos convênios e programas de benefícios',
        impact: 'Aumento de 15% na disponibilidade de PBM',
        icon: 'credit-card',
        action: 'Implementar convênios',
        actionId: 'novos-pbm-001',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Treinamento em PBMs',
        description: 'Capacitar equipe para melhor uso dos sistemas de PBM',
        impact: 'Redução de 25% em erros de PBM',
        icon: 'book',
        action: 'Treinar equipe',
        actionId: 'treinar-pbm-002',
        priority: 'medium'
      }
    ],
    
    'conversaoPBM': [
      {
        id: '1',
        title: 'Aumentar conversão de vendas com PBM',
        description: 'Aprimorar processo de oferta e cadastro de clientes em PBMs',
        impact: 'Aumento de 20% na conversão PBM',
        icon: 'repeat',
        action: 'Aprimorar processo',
        actionId: 'processo-pbm-001',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Campanha de benefícios PBM',
        description: 'Divulgar ativamente os programas de benefícios disponíveis',
        impact: 'Aumento de 15% no uso de PBM',
        icon: 'megaphone',
        action: 'Realizar campanha',
        actionId: 'campanha-pbm-002',
        priority: 'medium'
      }
    ]
  };
  
  return recommendations[indicatorId as keyof typeof recommendations] || [];
};

// Histórico de indicadores (mock para exibição de gráficos)
export const getIndicatorHistory = (indicatorId: string, days: number = 30) => {
  // Criar array de datas para o período solicitado
  const dates = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    return date.toISOString().split('T')[0]; // formato YYYY-MM-DD
  });
  
  // Função para gerar dados aleatórios com tendência
  const generateTrendData = (baseValue: number, variation: number, trend: number) => {
    return dates.map((_, index) => {
      // Adicionar tendência ao longo do tempo + variação aleatória
      const trendFactor = 1 + (trend * index / days);
      const randomVariation = 1 + ((Math.random() - 0.5) * variation);
      return baseValue * trendFactor * randomVariation;
    });
  };
  
  // Valores base e tendências para cada indicador
  const indicatorBaseValues: Record<string, {base: number, variation: number, trend: number}> = {
    // Fluxo de Faturamento
    'faturamento': { base: 2000, variation: 0.1, trend: 0.08 },  // crescimento de 8%
    'ticketMedio': { base: 100, variation: 0.05, trend: 0.03 },  // crescimento de 3%
    'uvc': { base: 3, variation: 0.08, trend: -0.02 },           // queda de 2%
    'precoMedio': { base: 30, variation: 0.03, trend: 0.06 },    // crescimento de 6%
    'aderenciaEstoque': { base: 70, variation: 0.1, trend: 0.05 }, // crescimento de 5%
    'proporcaoGenericos': { base: 40, variation: 0.1, trend: 0.04 }, // crescimento de 4%
    'indiceCompetitividade': { base: 90, variation: 0.05, trend: -0.02 }, // queda de 2%
    
    // Fluxo de Cupom
    'qtdCupons': { base: 20, variation: 0.15, trend: 0.05 },     // crescimento de 5%
    'fluxoPessoas': { base: 1000, variation: 0.15, trend: 0.03 }, // crescimento de 3% 
    'taxaConversao': { base: 65, variation: 0.08, trend: 0.02 },  // crescimento de 2%
    'entrantes': { base: 1000, variation: 0.15, trend: 0.03 },    // crescimento de 3%
    'cronicos': { base: 400, variation: 0.1, trend: 0.04 },      // crescimento de 4%
    'idosos': { base: 300, variation: 0.1, trend: 0.05 },        // crescimento de 5%
    'percentualSortimento': { base: 80, variation: 0.05, trend: 0.03 }, // crescimento de 3%
    'deixeiDeVender': { base: 9, variation: 0.2, trend: -0.05 },  // queda de 5% (positivo)
    'percentualRuptura': { base: 5, variation: 0.2, trend: -0.03 }, // queda de 3% (positivo)
    'disponibilidadePBM': { base: 90, variation: 0.05, trend: 0.02 }, // crescimento de 2%
    'conversaoPBM': { base: 75, variation: 0.1, trend: 0.04 }     // crescimento de 4%
  };
  
  const config = indicatorBaseValues[indicatorId] || { base: 100, variation: 0.1, trend: 0 };
  
  return {
    dates,
    values: generateTrendData(config.base, config.variation, config.trend)
  };
};

// Causas possíveis para os problemas em cada indicador
export const getPossibleCauses = (indicatorId: string) => {
  const causes = {
    // Fluxo de Faturamento
    'uvc': [
      'Alta ruptura de estoque em produtos de alta demanda',
      'Falta de estratégia efetiva de cross-selling',
      'Ausência de combos e pacotes promocionais',
      'Layout da loja não favorece compras por impulso',
      'Atendentes não treinados para sugerir produtos complementares'
    ],
    'precoMedio': [
      'Mix de produtos com predominância de itens de baixo valor',
      'Política de descontos muito agressiva',
      'Baixa capilaridade em categorias premium',
      'Precificação inadequada frente à concorrência',
      'Falta de destaque visual para produtos de maior valor'
    ],
    'ticketMedio': [
      'Combinação de baixo UVC e preço médio reduzido',
      'Clientes buscando apenas itens específicos',
      'Ausência de estratégias para aumentar o valor da compra',
      'Falta de segmentação de clientes para ofertas personalizadas',
      'Experiência de compra não estimula adição de itens'
    ],
    'aderenciaEstoque': [
      'Parâmetros de estoque inadequados para produtos recorrentes',
      'Falta de análise do histórico de demanda',
      'Previsão incorreta de sazonalidade',
      'Falta de categorização adequada dos produtos',
      'Ausência de monitoramento específico para produtos de uso contínuo'
    ],
    'proporcaoGenericos': [
      'Treinamento insuficiente da equipe para oferecer genéricos',
      'Baixa exposição de genéricos nas gôndolas',
      'Cliente não informado sobre opções de genéricos',
      'Desconhecimento da equipe sobre bioequivalência',
      'Falta de incentivo para substituição por genéricos'
    ],
    'indiceCompetitividade': [
      'Falta de pesquisa regular de preços da concorrência',
      'Política de preços desalinhada com o mercado local',
      'Custos operacionais elevados impactando as margens',
      'Ausência de precificação dinâmica',
      'Não consideração do perfil socioeconômico da região'
    ],
    
    // Fluxo de Cupom
    'qtdCupons': [
      'Baixo fluxo de pessoas na loja',
      'Taxa de conversão abaixo do esperado',
      'Alta incidência de desistência na fila',
      'Localização ou horário de funcionamento inadequados',
      'Dificuldade de acesso à loja'
    ],
    'fluxoPessoas': [
      'Estratégia de marketing local insuficiente',
      'Baixa visibilidade da loja',
      'Concorrência com melhor localização',
      'Horário de funcionamento não otimizado',
      'Eventos externos reduzindo circulação de pessoas'
    ],
    'taxaConversao': [
      'Alto tempo de espera no atendimento',
      'Falta de produtos buscados pelos clientes',
      'Atendimento inadequado',
      'Preços não competitivos',
      'Baixa disponibilidade de formas de pagamento'
    ],
    'entrantes': [
      'Visibilidade externa da loja prejudicada',
      'Baixa atratividade da vitrine',
      'Comunicação visual externa insuficiente',
      'Acesso físico à loja dificultado',
      'Falta de campanhas para atrair novos clientes'
    ],
    'cronicos': [
      'Falta de programa de fidelidade para pacientes crônicos',
      'Ausência de estoque regular para medicamentos contínuos',
      'Preços não competitivos em medicamentos de uso contínuo',
      'Falta de serviços específicos para pacientes crônicos',
      'Comunicação ineficaz sobre programas de benefícios'
    ],
    'idosos': [
      'Falta de acessibilidade adequada',
      'Ausência de atendimento preferencial eficiente',
      'Falta de comunicação visual adequada para idosos',
      'Equipe não treinada para atendimento ao público idoso',
      'Ausência de serviços específicos para idosos'
    ],
    'percentualSortimento': [
      'Mix de produtos inadequado ao perfil de clientes',
      'Ausência de análise de cluster para definição de mix',
      'Falta de produtos regionalmente relevantes',
      'Baixa adaptação do mix à sazonalidade',
      'Ausência de produtos complementares estratégicos'
    ],
    'deixeiDeVender': [
      'Falta de registro adequado de vendas perdidas',
      'Ausência de análise sistemática de causas',
      'Falha no processo de reposição baseado nas vendas perdidas',
      'Comunicação ineficiente entre balcão e estoque',
      'Falta de alternativas para produtos em falta'
    ],
    'percentualRuptura': [
      'Parâmetros de estoque mínimo mal configurados',
      'Falhas no processo de reposição',
      'Demanda sazonal não prevista adequadamente',
      'Problemas logísticos com fornecedores',
      'Falta de análise de ciclo de vida dos produtos'
    ],
    'disponibilidadePBM': [
      'Poucos convênios e programas de benefícios implementados',
      'Falhas no sistema de autorização de PBM',
      'Equipe não treinada adequadamente',
      'Falta de suporte técnico para resolução de problemas',
      'Demora no cadastramento de novos convênios'
    ],
    'conversaoPBM': [
      'Processo de oferta de PBM não padronizado',
      'Falta de divulgação dos benefícios aos clientes',
      'Dificuldade no processo de cadastro de clientes',
      'Comunicação visual insuficiente sobre PBMs disponíveis',
      'Problemas técnicos frequentes no sistema de PBM'
    ]
  };
  
  return causes[indicatorId as keyof typeof causes] || [];
};

export default {
  getIndicatorTree,
  getRecommendations,
  getIndicatorHistory,
  getPossibleCauses
};