// src/services/api/metricsService.ts
import { apiClient } from './apiClient';

// Tipos para as métricas
export interface MetricData {
  value: number | string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  comparisonPeriod?: string;
}

export interface DashboardMetrics {
  uvc: MetricData;
  ticketMedio: MetricData;
  precoMedio: MetricData;
  rupturaEstoque: MetricData;
  quantidadeCupons: MetricData;
  capilaridadeProdutos: MetricData;
}

export interface GraphData {
  labels: string[];
  datasets: {
    data: number[];
    color?: string;
  }[];
}

export type TimeRange = 'day' | 'week' | 'month';

// Serviço de métricas
const metricsService = {
  // Obter métricas do dashboard
  getDashboardMetrics: async (timeRange: TimeRange = 'day'): Promise<DashboardMetrics> => {
    try {
      // Em produção, usaríamos:
      // return await apiClient.get<DashboardMetrics>(`/metrics/dashboard?timeRange=${timeRange}`);
      
      // Mock data baseado no período selecionado
      return mockDashboardMetrics(timeRange);
    } catch (error) {
      console.error('Erro ao buscar métricas do dashboard:', error);
      throw error;
    }
  },
  
  // Obter dados para gráficos
  getGraphData: async (metric: string, timeRange: TimeRange = 'day'): Promise<GraphData> => {
    try {
      // Em produção, usaríamos:
      // return await apiClient.get<GraphData>(`/metrics/graph/${metric}?timeRange=${timeRange}`);
      
      // Mock data
      return mockGraphData(metric, timeRange);
    } catch (error) {
      console.error(`Erro ao buscar dados para gráfico de ${metric}:`, error);
      throw error;
    }
  }
};

// Dados simulados para o dashboard
const mockDashboardMetrics = (timeRange: TimeRange): DashboardMetrics => {
  // Simulação de dados diferentes baseados no período
  const metrics: Record<TimeRange, DashboardMetrics> = {
    day: {
      uvc: { value: '237', trend: 'up', trendValue: '+12%' },
      ticketMedio: { value: 'R$ 87,35', trend: 'up', trendValue: '+5%' },
      precoMedio: { value: 'R$ 32,18', trend: 'down', trendValue: '-3%' },
      rupturaEstoque: { value: '5%', trend: 'down', trendValue: '-2%' },
      quantidadeCupons: { value: '156', trend: 'up', trendValue: '+8%' },
      capilaridadeProdutos: { value: '83%', trend: 'neutral', trendValue: '0%' }
    },
    week: {
      uvc: { value: '1.562', trend: 'up', trendValue: '+8%' },
      ticketMedio: { value: 'R$ 92,47', trend: 'up', trendValue: '+4%' },
      precoMedio: { value: 'R$ 34,25', trend: 'up', trendValue: '+1%' },
      rupturaEstoque: { value: '7%', trend: 'up', trendValue: '+1%' },
      quantidadeCupons: { value: '983', trend: 'up', trendValue: '+15%' },
      capilaridadeProdutos: { value: '79%', trend: 'down', trendValue: '-3%' }
    },
    month: {
      uvc: { value: '6.845', trend: 'up', trendValue: '+18%' },
      ticketMedio: { value: 'R$ 95,12', trend: 'up', trendValue: '+7%' },
      precoMedio: { value: 'R$ 35,50', trend: 'up', trendValue: '+4%' },
      rupturaEstoque: { value: '6%', trend: 'down', trendValue: '-1%' },
      quantidadeCupons: { value: '4.230', trend: 'up', trendValue: '+22%' },
      capilaridadeProdutos: { value: '86%', trend: 'up', trendValue: '+5%' }
    }
  };
  
  return metrics[timeRange];
};

// Dados simulados para gráficos
const mockGraphData = (metric: string, timeRange: TimeRange): GraphData => {
  // Labels baseados no período
  const labels: Record<TimeRange, string[]> = {
    day: ['8h', '10h', '12h', '14h', '16h', '18h', '20h'],
    week: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    month: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
  };
  
  // Gera dados aleatórios para o gráfico
  const generateRandomData = (length: number, min: number, max: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  };
  
  // Dados específicos para cada métrica
  const dataByMetric: Record<string, number[]> = {
    uvc: generateRandomData(labels[timeRange].length, 50, 300),
    ticketMedio: generateRandomData(labels[timeRange].length, 70, 120),
    precoMedio: generateRandomData(labels[timeRange].length, 25, 45),
    rupturaEstoque: generateRandomData(labels[timeRange].length, 2, 15),
    quantidadeCupons: generateRandomData(labels[timeRange].length, 30, 200),
    capilaridadeProdutos: generateRandomData(labels[timeRange].length, 65, 95)
  };
  
  return {
    labels: labels[timeRange],
    datasets: [
      {
        data: dataByMetric[metric] || generateRandomData(labels[timeRange].length, 0, 100)
      }
    ]
  };
};

export default metricsService;