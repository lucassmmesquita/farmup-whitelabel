// src/screens/dashboard/DashboardScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { Card } from '@components/common/Card';
import { KPIBox } from '@components/common/KPIBox';
import { Button } from '@components/common/Button';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';

// Importações dos novos componentes (agora com default)
import MetricChart from '../../components/dashboard/MetricChart';
import TimeRangeFilter from '../../components/dashboard/TimeRangeFilter';
import MetricSelector from '../../components/dashboard/MetricSelector';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';


// Componentes estilizados
const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const DashboardContent = styled(ScrollView)`
  flex: 1;
  padding: ${props => props.theme.spacing.md}px;
`;

const SectionTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md}px;
  margin-top: ${props => props.theme.spacing.lg}px;
`;

const KPIGrid = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const KPIItem = styled(View)`
  width: 48%;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xl}px;
`;

const PeriodContainer = styled(View)`
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const HeaderDateText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

export const DashboardScreen: React.FC = () => {
  const theme = useTheme();
  const {
    metrics,
    isLoading,
    timeRange,
    setTimeRange,
    selectedMetric,
    setSelectedMetric,
    graphData,
    metricOptions,
    timeRangeOptions
  } = useDashboardMetrics();
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Função para refrescar dados
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    
    // Simular atualização de dados
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  
  // Obter nome legível da métrica selecionada
  const getSelectedMetricName = () => {
    const option = metricOptions.find(opt => opt.id === selectedMetric);
    return option ? option.label : '';
  };
  
  // Se estiver carregando e não estiver apenas refrescando, mostrar loader
  if (isLoading && !refreshing) {
    return (
      <Container theme={theme}>
        <AppHeader title="Dashboard" rightIcon="bell" onRightIconPress={() => {}} />
        <LoadingContainer theme={theme}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: theme.spacing.md, color: theme.colors.subtext }}>
            Carregando indicadores...
          </Text>
        </LoadingContainer>
      </Container>
    );
  }
  
  // Obter data atual para exibição
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <Container theme={theme}>
      <AppHeader title="Dashboard" rightIcon="bell" onRightIconPress={() => {}} />
      
      <DashboardContent 
        theme={theme}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]} 
          />
        }
      >
        {/* Data atual */}
        <HeaderDateText theme={theme}>
          {getCurrentDate()}
        </HeaderDateText>
        
        {/* Filtro de período */}
        <PeriodContainer theme={theme}>
          <TimeRangeFilter
            selectedRange={timeRange}
            onRangeChange={setTimeRange}
            options={timeRangeOptions}
          />
        </PeriodContainer>
        
        {/* Grid de KPIs */}
        <KPIGrid theme={theme}>
          {metrics && (
            <>
              <KPIItem theme={theme}>
                <KPIBox 
                  title="UVC"
                  value={metrics.uvc.value}
                  icon="package"
                  trend={metrics.uvc.trend}
                  trendValue={metrics.uvc.trendValue}
                />
              </KPIItem>
              <KPIItem theme={theme}>
                <KPIBox 
                  title="Ticket Médio"
                  value={metrics.ticketMedio.value}
                  icon="shopping-cart"
                  trend={metrics.ticketMedio.trend}
                  trendValue={metrics.ticketMedio.trendValue}
                />
              </KPIItem>
              <KPIItem theme={theme}>
                <KPIBox 
                  title="Preço Médio"
                  value={metrics.precoMedio.value}
                  icon="dollar-sign"
                  trend={metrics.precoMedio.trend}
                  trendValue={metrics.precoMedio.trendValue}
                />
              </KPIItem>
              <KPIItem theme={theme}>
                <KPIBox 
                  title="Ruptura Estoque"
                  value={metrics.rupturaEstoque.value}
                  icon="alert-triangle"
                  trend={metrics.rupturaEstoque.trend}
                  trendValue={metrics.rupturaEstoque.trendValue}
                />
              </KPIItem>
              <KPIItem theme={theme}>
                <KPIBox 
                  title="Cupons"
                  value={metrics.quantidadeCupons.value}
                  icon="file-text"
                  trend={metrics.quantidadeCupons.trend}
                  trendValue={metrics.quantidadeCupons.trendValue}
                />
              </KPIItem>
              <KPIItem theme={theme}>
                <KPIBox 
                  title="Capilaridade"
                  value={metrics.capilaridadeProdutos.value}
                  icon="grid"
                  trend={metrics.capilaridadeProdutos.trend}
                  trendValue={metrics.capilaridadeProdutos.trendValue}
                />
              </KPIItem>
            </>
          )}
        </KPIGrid>
        
        {/* Seletor de métricas para o gráfico */}
        <SectionTitle theme={theme}>Análise de Desempenho</SectionTitle>
        <MetricSelector
          options={metricOptions}
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
        />
        
        {/* Gráfico da métrica selecionada */}
        {graphData && (
          <MetricChart
            data={graphData}
            title={`Evolução de ${getSelectedMetricName()}`}
            color={theme.colors.primary}
          />
        )}
        
        {/* Seção de Ações Sugeridas */}
        <SectionTitle theme={theme}>Ações Sugeridas</SectionTitle>
        
        {/* Aqui mantemos as ações sugeridas existentes, mas podemos melhorá-las para serem relacionadas aos KPIs */}
        <Card elevation="light" style={{ marginBottom: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md }}>
            <View style={{ 
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${theme.colors.warning}20`,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: theme.spacing.md
            }}>
              <Feather name="alert-triangle" size={20} color={theme.colors.warning} />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{ 
                fontFamily: theme.typography.fontFamily.semiBold,
                fontSize: theme.typography.fontSize.md,
                color: theme.colors.text,
                marginBottom: theme.spacing.xs
              }}>
                Ruptura de estoque alta
              </Text>
              <Text style={{ 
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.subtext 
              }}>
                5 produtos com estoque abaixo do mínimo
              </Text>
            </View>
            
            <Button 
              title="Ver" 
              variant="outline"
              size="small"
              onPress={() => {}}
            />
          </View>
        </Card>
        
        <Card elevation="light" style={{ marginBottom: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md }}>
            <View style={{ 
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${theme.colors.success}20`,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: theme.spacing.md
            }}>
              <Feather name="trending-up" size={20} color={theme.colors.success} />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{ 
                fontFamily: theme.typography.fontFamily.semiBold,
                fontSize: theme.typography.fontSize.md,
                color: theme.colors.text,
                marginBottom: theme.spacing.xs
              }}>
                Oportunidade de cross-selling
              </Text>
              <Text style={{ 
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.subtext 
              }}>
                Aumente seu ticket médio com ofertas combinadas
              </Text>
            </View>
            
            <Button 
              title="Ver" 
              variant="outline"
              size="small"
              onPress={() => {}}
            />
          </View>
        </Card>
      </DashboardContent>
    </Container>
  );
};