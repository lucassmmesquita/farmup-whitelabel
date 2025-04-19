// src/hooks/useDashboardMetrics.ts
import { useState, useEffect } from 'react';
import metricsService, { DashboardMetrics, TimeRange, GraphData } from '@services/api/metricsService';
import { useTheme } from '@hooks/useTheme';

export const useDashboardMetrics = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('ticketMedio');
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  
  // Carregar métricas do dashboard
  useEffect(() => {
    const loadMetrics = async () => {
      setIsLoading(true);
      try {
        const data = await metricsService.getDashboardMetrics(timeRange);
        setMetrics(data);
      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMetrics();
  }, [timeRange]);
  
  // Carregar dados do gráfico quando a métrica selecionada ou o período mudar
  useEffect(() => {
    const loadGraphData = async () => {
      if (!selectedMetric) return;
      
      try {
        const data = await metricsService.getGraphData(selectedMetric, timeRange);
        setGraphData(data);
      } catch (error) {
        console.error('Erro ao carregar dados do gráfico:', error);
      }
    };
    
    loadGraphData();
  }, [selectedMetric, timeRange]);
  
  // Lista de métricas disponíveis para exibição
  const metricOptions = [
    { id: 'uvc', label: 'UVC', icon: 'package' },
    { id: 'ticketMedio', label: 'Ticket Médio', icon: 'shopping-cart' },
    { id: 'precoMedio', label: 'Preço Médio', icon: 'dollar-sign' },
    { id: 'rupturaEstoque', label: 'Ruptura Estoque', icon: 'alert-triangle' },
    { id: 'quantidadeCupons', label: 'Qtd. Cupons', icon: 'file-text' },
    { id: 'capilaridadeProdutos', label: 'Capilaridade', icon: 'grid' }
  ];
  
  // Opções de períodos
  const timeRangeOptions = [
    { id: 'day', label: 'Hoje' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mês' }
  ];
  
  return {
    metrics,
    isLoading,
    timeRange,
    setTimeRange,
    selectedMetric,
    setSelectedMetric,
    graphData,
    metricOptions,
    timeRangeOptions
  };
};