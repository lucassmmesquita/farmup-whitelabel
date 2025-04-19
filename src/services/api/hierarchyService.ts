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

// Dados mock para a árvore de indicadores
export const getIndicatorTree = (): IndicatorTree => {
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
    description: 'Valor total de vendas no período selecionado.'
  };
  
  const qtdCupons = {
    id: 'qtdCupons',
    name: 'Qtd. Cupons',
    value: 623,
    formattedValue: '623',
    target: 600,
    formattedTarget: '600',
    variation: '+3.83%',
    icon: 'file-text',
    parentId: 'faturamento',
    isPrimary: false,
    description: 'Número total de cupons fiscais emitidos.'
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
    description: 'Valor médio gasto por cliente em cada compra.'
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
    description: 'Unidades de venda por cupom. Representa quantos itens cada cliente leva em média.'
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
    description: 'Preço médio dos produtos vendidos.'
  };
  
  const rupturaEstoque = {
    id: 'rupturaEstoque',
    name: 'Ruptura',
    value: 5.2,
    formattedValue: '5,2%',
    target: 3,
    formattedTarget: '3%',
    variation: '+73.33%',
    icon: 'alert-triangle',
    parentId: 'uvc',
    isPrimary: false,
    description: 'Percentual de produtos não disponíveis para venda devido a falta de estoque.'
  };
  
  const capilaridade = {
    id: 'capilaridade',
    name: 'Capilaridade',
    value: 65,
    formattedValue: '65%',
    target: 75,
    formattedTarget: '75%',
    variation: '-13.33%',
    icon: 'grid',
    parentId: 'precoMedio',
    isPrimary: false,
    description: 'Percentual de produtos em exposição em relação ao mix ideal definido.'
  };
  
  // Atualizar status com base nos valores e metas
  const indicators = [
    { ...faturamento, status: calculateIndicatorStatus(faturamento) },
    { ...qtdCupons, status: calculateIndicatorStatus(qtdCupons) },
    { ...ticketMedio, status: calculateIndicatorStatus(ticketMedio) },
    { ...uvc, status: calculateIndicatorStatus(uvc) },
    { ...precoMedio, status: calculateIndicatorStatus(precoMedio) },
    { ...rupturaEstoque, status: calculateIndicatorStatus(rupturaEstoque) },
    { ...capilaridade, status: calculateIndicatorStatus(capilaridade) }
  ];
  
  // Definir as relações entre os indicadores
  const relations = [
    { sourceId: 'qtdCupons', targetId: 'faturamento', impact: 0.4 },
    { sourceId: 'ticketMedio', targetId: 'faturamento', impact: 0.6 },
    { sourceId: 'uvc', targetId: 'ticketMedio', impact: 0.5 },
    { sourceId: 'precoMedio', targetId: 'ticketMedio', impact: 0.5 },
    { sourceId: 'rupturaEstoque', targetId: 'uvc', impact: 0.7 },
    { sourceId: 'capilaridade', targetId: 'precoMedio', impact: 0.6 }
  ];
  
  return { indicators, relations };
};

// Obter recomendações para indicadores primários
export const getRecommendations = (indicatorId: string) => {
  const recommendations = {
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
    'faturamento': { base: 2000, variation: 0.1, trend: 0.08 },  // crescimento de 8%
    'qtdCupons': { base: 20, variation: 0.15, trend: 0.05 },     // crescimento de 5%
    'ticketMedio': { base: 100, variation: 0.05, trend: 0.03 },  // crescimento de 3%
    'uvc': { base: 3, variation: 0.08, trend: -0.02 },           // queda de 2%
    'precoMedio': { base: 30, variation: 0.03, trend: 0.06 },    // crescimento de 6%
    'rupturaEstoque': { base: 3, variation: 0.2, trend: 0.1 },   // crescimento de 10% (negativo)
    'capilaridade': { base: 70, variation: 0.05, trend: -0.02 }  // queda de 2%
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
    'rupturaEstoque': [
      'Parâmetros de estoque mínimo mal configurados',
      'Falhas no processo de reposição',
      'Demanda sazonal não prevista adequadamente',
      'Problemas logísticos com fornecedores',
      'Falta de análise de ciclo de vida dos produtos'
    ],
    'capilaridade': [
      'Espaço limitado nas gôndolas para exposição',
      'Falta de planejamento do mix ideal de produtos',
      'Baixa rotatividade de estoque em algumas categorias',
      'Ausência de análise de rentabilidade por categoria',
      'Gerenciamento ineficiente de categorias'
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