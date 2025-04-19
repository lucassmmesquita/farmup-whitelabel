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
    isPrimary: false
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
    isPrimary: false
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
    isPrimary: false
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
    isPrimary: true
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
    isPrimary: true
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
    isPrimary: false
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
    isPrimary: false
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
        description: 'Ajuste automatizado de parâmetros de compra para produtos com alta demanda',
        impact: 'Potencial aumento de 12% em UVC',
        icon: 'trending-up',
        action: 'Ajustar parâmetros de compra'
      },
      {
        id: '2',
        title: 'Implementar sugestão de produtos complementares',
        description: 'Configure cross-selling para os 20 produtos mais vendidos',
        impact: 'Potencial aumento de 8% em UVC',
        icon: 'shuffle',
        action: 'Configurar cross-selling'
      },
      {
        id: '3',
        title: 'Ativar pacotes promocionais',
        description: 'Criar combos para categorias com baixa conversão',
        impact: 'Potencial aumento de 15% em UVC',
        icon: 'package',
        action: 'Criar combos'
      }
    ],
    'precoMedio': [
      {
        id: '1',
        title: 'Ampliar mix de produtos premium',
        description: 'Aumentar visibilidade de produtos com maior margem nas gôndolas principais',
        impact: 'Potencial aumento de 7% no preço médio',
        icon: 'arrow-up-right',
        action: 'Ajustar exposição'
      },
      {
        id: '2',
        title: 'Rever política de descontos',
        description: 'Ajustar descontos em produtos com alta elasticidade de preço',
        impact: 'Potencial aumento de 5% no preço médio',
        icon: 'percent',
        action: 'Ajustar descontos'
      },
      {
        id: '3',
        title: 'Expandir categorias de dermocosméticos',
        description: 'Aumentar capilaridade em categorias de maior valor agregado',
        impact: 'Potencial aumento de 9% no preço médio',
        icon: 'plus-circle',
        action: 'Expandir categorias'
      }
    ]
  };
  
  return recommendations[indicatorId as keyof typeof recommendations] || [];
};

export default {
  getIndicatorTree,
  getRecommendations
};