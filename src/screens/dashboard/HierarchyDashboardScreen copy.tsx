// src/screens/dashboard/HierarchyDashboardScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { useTheme } from '@hooks/useTheme';
import { useIndicatorHierarchy } from '@hooks/useIndicatorHierarchy';
import HierarchyTree from '@components/dashboard/HierarchyTree';
import styled from 'styled-components/native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Indicator } from '@/types/metrics';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamList } from '@navigation/DashboardNavigator';

// Definir o tipo de navegação
type HierarchyScreenNavigationProp = StackNavigationProp<DashboardStackParamList>;

const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled(ScrollView)`
  flex: 1;
`;

const HeaderDateText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: ${props => props.theme.spacing.sm}px;
  padding-horizontal: ${props => props.theme.spacing.md}px;
  padding-top: ${props => props.theme.spacing.md}px;
`;

const TabsContainer = styled(View)`
  flex-direction: row;
  padding-horizontal: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const TabButton = styled(TouchableOpacity)<{ active: boolean }>`
  padding-vertical: ${props => props.theme.spacing.sm}px;
  padding-horizontal: ${props => props.theme.spacing.lg}px;
  border-radius: ${props => props.theme.roundness.md}px;
  background-color: ${props => props.active ? props.theme.colors.primary : `${props.theme.colors.primary}10`};
  margin-right: ${props => props.theme.spacing.md}px;
`;

const TabText = styled(Text)<{ active: boolean }>`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.active ? '#FFFFFF' : props.theme.colors.primary};
`;

export const HierarchyDashboardScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<HierarchyScreenNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'faturamento' | 'cupom'>('faturamento');
  
  const {
    loading,
    indicatorTree,
    setSelectedIndicator,
    refresh
  } = useIndicatorHierarchy();
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };
  
  const handleSelectIndicator = (indicator: Indicator) => {
    try {
      setSelectedIndicator(indicator.id);
      
      // Usando CommonActions para navegação mais robusta entre navegadores aninhados
      navigation.dispatch(
        CommonActions.navigate({
          name: 'IndicatorDetails',
          params: { indicator },
        })
      );
    } catch (error) {
      console.error('Erro na navegação:', error);
      
      // Alternativa em caso de falha
      try {
        // Tentativa direta
        navigation.navigate('IndicatorDetails', { indicator });
      } catch (secondError) {
        console.error('Segunda tentativa de navegação falhou:', secondError);
      }
    }
  };
  
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
  
  if (loading && !refreshing) {
    return (
      <Container theme={theme}>
        <AppHeader title="Dashboard de KPIs" rightIcon="bell" onRightIconPress={() => {}} />
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: theme.colors.subtext }}>
            Carregando indicadores...
          </Text>
        </LoadingContainer>
      </Container>
    );
  }
  
  return (
    <Container theme={theme}>
      <AppHeader title="Dashboard de KPIs" rightIcon="bell" onRightIconPress={() => {}} />
      
      <ContentContainer
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        <HeaderDateText theme={theme}>
          {getCurrentDate()}
        </HeaderDateText>
        
        <TabsContainer theme={theme}>
          <TabButton 
            active={activeTab === 'faturamento'} 
            onPress={() => setActiveTab('faturamento')}
            theme={theme}
          >
            <TabText active={activeTab === 'faturamento'} theme={theme}>
              Faturamento
            </TabText>
          </TabButton>
          
          <TabButton 
            active={activeTab === 'cupom'} 
            onPress={() => setActiveTab('cupom')}
            theme={theme}
          >
            <TabText active={activeTab === 'cupom'} theme={theme}>
              Cupons
            </TabText>
          </TabButton>
        </TabsContainer>
        
        {indicatorTree && (
          <HierarchyTree
            indicatorTree={indicatorTree}
            onSelectIndicator={handleSelectIndicator}
            activeFlowType={activeTab}
          />
        )}
      </ContentContainer>
    </Container>
  );
};

export default HierarchyDashboardScreen;