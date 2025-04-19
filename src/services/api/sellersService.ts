// src/services/api/sellersService.ts
import { Seller, SellerSummary } from '@/types/sellers';
import { TimeRange } from './metricsService';
import { formatCurrency } from '@/utils/formatters';

// Dados simulados para vendedores de acordo com a imagem
const sellersData: Seller[] = [
  {
    id: '1',
    name: 'CARLA TAMIRES FARIAS DE LIMA',
    metrics: {
      revenue: 12450.75,
      uvc: 1.93, // Valores da imagem
      avgTicket: 92.30,
      avgPrice: 47.82,
      ticketCount: 135
    },
    status: 'below_target',
    trend: 'down',
    daysOnTarget: 3,
    daysOffTarget: 5,
    history: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      revenue: 12450.75 * (0.9 + Math.random() * 0.2),
      uvc: 1.93 * (0.9 + Math.random() * 0.2),
      avgTicket: 92.30 * (0.9 + Math.random() * 0.2),
      avgPrice: 47.82 * (0.9 + Math.random() * 0.2),
      ticketCount: Math.floor(135 * (0.9 + Math.random() * 0.2))
    })),
    actionPlanId: 'seller-training-001'
  },
  {
    id: '2',
    name: 'FRANCISCA ELIVANE DA SILVA',
    metrics: {
      revenue: 13250.80,
      uvc: 2.09, // Valores da imagem
      avgTicket: 97.80,
      avgPrice: 46.79,
      ticketCount: 128
    },
    status: 'below_target',
    trend: 'down',
    daysOnTarget: 2,
    daysOffTarget: 2,
    history: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      revenue: 13250.80 * (0.9 + Math.random() * 0.2),
      uvc: 2.09 * (0.9 + Math.random() * 0.2),
      avgTicket: 97.80 * (0.9 + Math.random() * 0.2),
      avgPrice: 46.79 * (0.9 + Math.random() * 0.2),
      ticketCount: Math.floor(128 * (0.9 + Math.random() * 0.2))
    }))
  },
  {
    id: '3',
    name: 'LEIDIANE GOMES RODRIGUES',
    metrics: {
      revenue: 15780.50,
      uvc: 2.28, // Valores da imagem
      avgTicket: 105.20,
      avgPrice: 46.14,
      ticketCount: 150
    },
    status: 'above_target',
    trend: 'up',
    daysOnTarget: 15,
    daysOffTarget: 0,
    history: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      revenue: 15780.50 * (0.9 + Math.random() * 0.2),
      uvc: 2.28 * (0.9 + Math.random() * 0.2),
      avgTicket: 105.20 * (0.9 + Math.random() * 0.2),
      avgPrice: 46.14 * (0.9 + Math.random() * 0.2),
      ticketCount: Math.floor(150 * (0.9 + Math.random() * 0.2))
    }))
  },
  {
    id: '4',
    name: 'LUANA ARAUJO MELO',
    metrics: {
      revenue: 14320.40,
      uvc: 2.18, // Valores da imagem
      avgTicket: 99.10,
      avgPrice: 45.46,
      ticketCount: 142
    },
    status: 'above_target',
    trend: 'up',
    daysOnTarget: 10,
    daysOffTarget: 0,
    history: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      revenue: 14320.40 * (0.9 + Math.random() * 0.2),
      uvc: 2.18 * (0.9 + Math.random() * 0.2),
      avgTicket: 99.10 * (0.9 + Math.random() * 0.2),
      avgPrice: 45.46 * (0.9 + Math.random() * 0.2),
      ticketCount: Math.floor(142 * (0.9 + Math.random() * 0.2))
    }))
  },
  {
    id: '5',
    name: 'MARIA JAIRLA DE SOUSA PAULA',
    metrics: {
      revenue: 14150.80,
      uvc: 2.18, // Valores da imagem
      avgTicket: 98.80,
      avgPrice: 45.32,
      ticketCount: 143
    },
    status: 'above_target',
    trend: 'up',
    daysOnTarget: 12,
    daysOffTarget: 0,
    history: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      revenue: 14150.80 * (0.9 + Math.random() * 0.2),
      uvc: 2.18 * (0.9 + Math.random() * 0.2),
      avgTicket: 98.80 * (0.9 + Math.random() * 0.2),
      avgPrice: 45.32 * (0.9 + Math.random() * 0.2),
      ticketCount: Math.floor(143 * (0.9 + Math.random() * 0.2))
    }))
  }
];

// Planos de ação para vendedores que precisam de desenvolvimento
const sellerActionPlans = [
  {
    id: 'seller-training-001',
    sellerId: '1',
    title: 'Treinamento em UVC e Cross-selling',
    description: 'Treinamento focado em aumentar o número de itens por venda através de técnicas de venda cruzada',
    steps: [
      'Realizar treinamento de 2 horas sobre produtos complementares',
      'Acompanhar atendimentos por 3 dias',
      'Estabelecer metas diárias de UVC',
      'Revisar progresso após 7 dias'
    ],
    status: 'pending'
  },
  {
    id: 'seller-training-002',
    sellerId: '2',
    title: 'Desenvolvimento de Técnicas de Abordagem',
    description: 'Plano para melhorar a abordagem ao cliente e aumentar conversão de vendas',
    steps: [
      'Treinamento sobre técnicas de abordagem',
      'Revisão de script de atendimento',
      'Acompanhamento de atendimentos por 2 dias',
      'Feedback sobre pontos de melhoria',
      'Revisão após 5 dias'
    ],
    status: 'pending'
  }
];

// No método calculateSellerSummary, adicionar a lista completa:
const calculateSellerSummary = (sellers: Seller[]): SellerSummary => {
    // Ordenar por UVC (conforme a imagem)
    const sortedByUVC = [...sellers].sort((a, b) => b.metrics.uvc - a.metrics.uvc);
    const topPerformer = sortedByUVC[0]; // Leidiane com UVC 2,28
    
    // Vendedores abaixo da meta (UVC < 2,10)
    const needsAttention = sellers.find(s => s.metrics.uvc < 2.10);
    const critical = sellers.find(s => s.metrics.uvc <= 1.93); // Carla com o menor UVC
    
    const totalUVC = sellers.reduce((sum, seller) => sum + seller.metrics.uvc, 0);
    const avgUVC = totalUVC / sellers.length;
    
    const averageRevenue = sellers.reduce((sum, seller) => sum + seller.metrics.revenue, 0) / sellers.length;
    const averageTicket = sellers.reduce((sum, seller) => sum + seller.metrics.avgTicket, 0) / sellers.length;
    
    // Criar um objeto com os vendedores indexados por ID para fácil acesso
    const sellersById: Record<string, Seller> = {};
    sellers.forEach(seller => {
      sellersById[seller.id] = seller;
    });
    
    return {
      topPerformer,
      needsAttention,
      critical,
      averageRevenue,
      averageUvc: avgUVC,
      averageTicket,
      sellers: sellersById // Adicionar todos os vendedores ao resumo
    };
  };

const sellersService = {
  // Obter todos os vendedores
  getAllSellers: (timeRange: TimeRange = 'day'): Seller[] => {
    // Em uma implementação real, filtraríamos por período
    return sellersData;
  },
  
  // Obter resumo dos vendedores (top, em atenção, crítico)
  getSellersSummary: (timeRange: TimeRange = 'day'): SellerSummary => {
    const sellers = sellersService.getAllSellers(timeRange);
    return calculateSellerSummary(sellers);
  },
  
  // Obter vendedor por ID
  getSellerById: (sellerId: string): Seller | undefined => {
    return sellersData.find(seller => seller.id === sellerId);
  },
  
  // Obter plano de ação para vendedor
  getSellerActionPlan: (sellerId: string) => {
    return sellerActionPlans.find(plan => plan.sellerId === sellerId);
  },
  
  // Obter histórico de métricas do vendedor
  getSellerHistory: (sellerId: string, days: number = 7) => {
    const seller = sellersService.getSellerById(sellerId);
    
    if (!seller) return { dates: [], metrics: {} };
    
    // Limitamos ao número de dias solicitados
    const history = seller.history.slice(-days);
    
    return {
      dates: history.map(h => h.date),
      metrics: {
        revenue: history.map(h => h.revenue),
        uvc: history.map(h => h.uvc),
        avgTicket: history.map(h => h.avgTicket),
        avgPrice: history.map(h => h.avgPrice),
        ticketCount: history.map(h => h.ticketCount)
      }
    };
  },
  
  // Formatar métricas para exibição
  formatSellerMetrics: (seller: Seller) => {
    return {
      revenue: formatCurrency(seller.metrics.revenue),
      uvc: seller.metrics.uvc.toFixed(2).replace('.', ','),
      avgTicket: formatCurrency(seller.metrics.avgTicket),
      avgPrice: formatCurrency(seller.metrics.avgPrice),
      ticketCount: seller.metrics.ticketCount.toString()
    };
  }
};

export default sellersService;