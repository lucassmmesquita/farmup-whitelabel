// src/screens/dashboard/HierarchyDashboardScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { useTheme } from '@hooks/useTheme';
import { useIndicatorHierarchy } from '@hooks/useIndicatorHierarchy';
import HierarchyTree from '@components/dashboard/HierarchyTree';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Indicator } from '@/types/metrics';

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

export const HierarchyDashboardScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  
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
    setSelectedIndicator(indicator.id);
    navigation.navigate('IndicatorDetails', { indicator });
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
        
        {indicatorTree && (
          <HierarchyTree
            indicatorTree={indicatorTree}
            onSelectIndicator={handleSelectIndicator}
          />
        )}
      </ContentContainer>
    </Container>
  );
};

export default HierarchyDashboardScreen;