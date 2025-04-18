// src/screens/dashboard/DashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, FlatList } from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { Card } from '@components/common/Card';
import { KPIBox } from '@components/common/KPIBox';
import { Button } from '@components/common/Button';
import { useTheme } from '@hooks/useTheme';
import styled from 'styled-components/native';

// Mock de dados para KPIs
const kpiData = [
  { id: '1', title: 'Vendas Hoje', value: 'R$ 5.435,00', icon: 'dollar-sign', trend: 'up', trendValue: '+15%' },
  { id: '2', title: 'Clientes', value: '42', icon: 'users', trend: 'up', trendValue: '+8%' },
  { id: '3', title: 'Ticket Médio', value: 'R$ 129,40', icon: 'shopping-cart', trend: 'down', trendValue: '-3%' },
  { id: '4', title: 'Itens / Venda', value: '3.2', icon: 'package', trend: 'neutral', trendValue: '0%' },
];

// Mock de dados para Ações Sugeridas
const suggestedActions = [
  { id: '1', title: 'Estoque baixo de Dipirona', description: '5 unidades restantes', icon: 'alert-circle', type: 'warning' },
  { id: '2', title: 'Oportunidade de venda cruzada', description: 'Ofereça protetor solar com bronzeador', icon: 'dollar-sign', type: 'opportunity' },
  { id: '3', title: 'Campanha de aniversário', description: 'Ligue para os clientes aniversariantes', icon: 'gift', type: 'reminder' },
];

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

const ActionCard = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacing.md}px;
`;

const ActionIcon = styled(View)<{ type: 'warning' | 'opportunity' | 'reminder', theme: any }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => {
    switch (props.type) {
      case 'warning': return `${props.theme.colors.warning}20`;
      case 'opportunity': return `${props.theme.colors.success}20`;
      case 'reminder': return `${props.theme.colors.primary}20`;
      default: return `${props.theme.colors.primary}20`;
    }
  }};
  justify-content: center;
  align-items: center;
  margin-right: ${props => props.theme.spacing.md}px;
`;

const ActionInfo = styled(View)`
  flex: 1;
`;

const ActionTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const ActionDescription = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
`;

export const DashboardScreen: React.FC = () => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  
  // src/screens/dashboard/DashboardScreen.tsx (continuação)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    // Simulação de atualização de dados
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  
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
        {/* Grid de KPIs */}
        <KPIGrid theme={theme}>
          {kpiData.map(item => (
            <KPIItem key={item.id} theme={theme}>
              <KPIBox 
                title={item.title}
                value={item.value}
                icon={item.icon as any}
                trend={item.trend as any}
                trendValue={item.trendValue}
              />
            </KPIItem>
          ))}
        </KPIGrid>
        
        {/* Seção de Ações Sugeridas */}
        <SectionTitle theme={theme}>Ações Sugeridas</SectionTitle>
        
        {suggestedActions.map(action => (
          <ActionCard key={action.id} elevation="light">
            <ActionIcon type={action.type as any} theme={theme}>
              <Feather name={action.icon as any} size={20} color={
                action.type === 'warning' 
                  ? theme.colors.warning 
                  : action.type === 'opportunity' 
                    ? theme.colors.success 
                    : theme.colors.primary
              } />
            </ActionIcon>
            
            <ActionInfo theme={theme}>
              <ActionTitle theme={theme}>{action.title}</ActionTitle>
              <ActionDescription theme={theme}>{action.description}</ActionDescription>
            </ActionInfo>
            
            <Button 
              title="Ver" 
              variant="outline"
              size="small"
              onPress={() => {}}
            />
          </ActionCard>
        ))}
      </DashboardContent>
    </Container>
  );
};