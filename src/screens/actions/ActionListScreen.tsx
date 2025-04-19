// src/screens/actions/ActionListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { Card } from '@components/common/Card';
import { useTheme } from '@hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { ActionPlan } from '@/types/metrics';
import actionPlanService from '@/services/api/actionPlanService';

type RouteParams = {
  ActionList: {
    indicatorId?: string;
  };
};

const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const FiltersContainer = styled(View)`
  padding: ${props => props.theme.spacing.md}px;
  flex-direction: row;
`;

const FilterButton = styled(TouchableOpacity)<{ active: boolean }>`
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.card};
  border-radius: ${props => props.theme.roundness.full}px;
  padding-horizontal: ${props => props.theme.spacing.md}px;
  padding-vertical: ${props => props.theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
  margin-right: ${props => props.theme.spacing.sm}px;
`;

const FilterText = styled(Text)<{ active: boolean }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.active ? '#FFFFFF' : props.theme.colors.text};
  margin-left: ${props => props.theme.spacing.xs}px;
`;

const ActionCardContainer = styled(TouchableOpacity)`
  margin-horizontal: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.roundness.md}px;
  padding: ${props => props.theme.spacing.md}px;
  border-left-width: 4px;
  border-left-color: ${props => {
    switch (props.priority) {
      case 'high': return props.theme.colors.error;
      case 'medium': return props.theme.colors.warning;
      default: return props.theme.colors.primary;
    }
  }};
`;

const ActionHeader = styled(View)`
  flex-direction: row;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const ActionIcon = styled(View)<{ priority: string }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => {
    switch (props.priority) {
      case 'high': return `${props.theme.colors.error}15`;
      case 'medium': return `${props.theme.colors.warning}15`;
      default: return `${props.theme.colors.primary}15`;
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

const StatusBadge = styled(View)<{ status: string }>`
  padding-vertical: ${props => props.theme.spacing.xs / 2}px;
  padding-horizontal: ${props => props.theme.spacing.sm}px;
  border-radius: ${props => props.theme.roundness.sm}px;
  background-color: ${props => {
    switch (props.status) {
      case 'completed': return `${props.theme.colors.success}15`;
      case 'in_progress': return `${props.theme.colors.warning}15`;
      case 'validated': return `${props.theme.colors.success}15`;
      case 'rejected': return `${props.theme.colors.error}15`;
      default: return `${props.theme.colors.inactive}15`;
    }
  }};
  align-self: flex-start;
  margin-top: ${props => props.theme.spacing.sm}px;
`;

// src/screens/actions/ActionListScreen.tsx (continuação)
const StatusText = styled(Text)<{ status: string }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => {
    switch (props.status) {
      case 'completed': return props.theme.colors.success;
      case 'in_progress': return props.theme.colors.warning;
      case 'validated': return props.theme.colors.success;
      case 'rejected': return props.theme.colors.error;
      default: return props.theme.colors.inactive;
    }
  }};
`;

const EmptyContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xl}px;
`;

const EmptyText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.subtext};
  text-align: center;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ActionListScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<RouteParams, 'ActionList'>>();
  const navigation = useNavigation();
  const { indicatorId } = route.params || {};
  
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [actions, setActions] = useState<ActionPlan[]>([]);
  
  useEffect(() => {
    const loadActions = async () => {
      setLoading(true);
      try {
        // Carregar planos de ação
        const plans = indicatorId 
          ? actionPlanService.getActionPlansByIndicator(indicatorId)
          : actionPlanService.getAllActionPlans();
        
        setActions(plans);
      } catch (error) {
        console.error('Erro ao carregar planos de ação:', error);
        Alert.alert('Erro', 'Não foi possível carregar os planos de ação.');
      } finally {
        setLoading(false);
      }
    };
    
    loadActions();
  }, [indicatorId]);
  
  // Filtrar ações
  const filteredActions = filter === 'all' 
    ? actions 
    : actions.filter(action => {
        if (filter === 'pending') return action.status === 'pending';
        if (filter === 'in_progress') return action.status === 'in_progress';
        if (filter === 'completed') return action.status === 'completed' || action.status === 'validated';
        return true;
      });
  
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em andamento';
      case 'completed': return 'Concluído';
      case 'validated': return 'Validado';
      case 'rejected': return 'Rejeitado';
      default: return 'Desconhecido';
    }
  };
  
  const getIconForPriority = (priority: string): keyof typeof Feather.glyphMap => {
    switch (priority) {
      case 'high': return 'alert-circle';
      case 'medium': return 'alert-triangle';
      default: return 'info';
    }
  };
  
  const handleActionPress = (action: ActionPlan) => {
    navigation.navigate('ActionPlanDetails', { actionId: action.id });
  };
  
  const renderActionCard = ({ item }: { item: ActionPlan }) => (
    <ActionCardContainer 
      onPress={() => handleActionPress(item)}
      theme={theme}
      priority={item.priority}
    >
      <ActionHeader theme={theme}>
        <ActionIcon priority={item.priority} theme={theme}>
          <Feather 
            name={getIconForPriority(item.priority)} 
            size={20} 
            color={
              item.priority === 'high' 
                ? theme.colors.error 
                : item.priority === 'medium' 
                  ? theme.colors.warning 
                  : theme.colors.primary
            } 
          />
        </ActionIcon>
        
        <ActionInfo theme={theme}>
          <ActionTitle theme={theme}>{item.title}</ActionTitle>
          <ActionDescription theme={theme}>{item.description}</ActionDescription>
        </ActionInfo>
      </ActionHeader>
      
      <StatusBadge status={item.status} theme={theme}>
        <StatusText status={item.status} theme={theme}>
          {getStatusLabel(item.status)}
        </StatusText>
      </StatusBadge>
    </ActionCardContainer>
  );
  
  const renderEmptyList = () => (
    <EmptyContainer theme={theme}>
      <Feather name="clipboard" size={48} color={theme.colors.inactive} />
      <EmptyText theme={theme}>Nenhum plano de ação disponível</EmptyText>
    </EmptyContainer>
  );
  
  if (loading) {
    return (
      <Container theme={theme}>
        <AppHeader 
          title={indicatorId ? "Planos para Indicador" : "Planos de Ação"} 
          showBack
        />
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingContainer>
      </Container>
    );
  }
  
  return (
    <Container theme={theme}>
      <AppHeader 
        title={indicatorId ? "Planos para Indicador" : "Planos de Ação"} 
        showBack
      />
      
      <FiltersContainer theme={theme}>
        <FilterButton 
          active={filter === 'all'} 
          onPress={() => setFilter('all')}
          theme={theme}
        >
          <Feather 
            name="list" 
            size={16} 
            color={filter === 'all' ? '#FFFFFF' : theme.colors.text} 
          />
          <FilterText active={filter === 'all'} theme={theme}>
            Todos
          </FilterText>
        </FilterButton>
        
        <FilterButton 
          active={filter === 'pending'} 
          onPress={() => setFilter('pending')}
          theme={theme}
        >
          <Feather 
            name="clock" 
            size={16} 
            color={filter === 'pending' ? '#FFFFFF' : theme.colors.text} 
          />
          <FilterText active={filter === 'pending'} theme={theme}>
            Pendentes
          </FilterText>
        </FilterButton>
        
        <FilterButton 
          active={filter === 'in_progress'} 
          onPress={() => setFilter('in_progress')}
          theme={theme}
        >
          <Feather 
            name="trending-up" 
            size={16} 
            color={filter === 'in_progress' ? '#FFFFFF' : theme.colors.text} 
          />
          <FilterText active={filter === 'in_progress'} theme={theme}>
            Em andamento
          </FilterText>
        </FilterButton>
        
        <FilterButton 
          active={filter === 'completed'} 
          onPress={() => setFilter('completed')}
          theme={theme}
        >
          <Feather 
            name="check-circle" 
            size={16} 
            color={filter === 'completed' ? '#FFFFFF' : theme.colors.text} 
          />
          <FilterText active={filter === 'completed'} theme={theme}>
            Concluídos
          </FilterText>
        </FilterButton>
      </FiltersContainer>
      
      <FlatList
        data={filteredActions}
        renderItem={renderActionCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingTop: theme.spacing.md, 
          paddingBottom: theme.spacing.xl 
        }}
        ListEmptyComponent={renderEmptyList}
      />
    </Container>
  );
};

export default ActionListScreen;