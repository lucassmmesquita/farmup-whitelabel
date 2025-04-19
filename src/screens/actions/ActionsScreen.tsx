// src/screens/actions/ActionsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { Card } from '@components/common/Card';
import { useTheme } from '@hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import actionPlanService from '@/services/api/actionPlanService';
import hierarchyService from '@/services/api/hierarchyService';
import { ActionPlan } from '@/types/metrics';

// Componentes estilizados
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

const TypeFilterContainer = styled(View)`
  padding-horizontal: ${props => props.theme.spacing.md}px;
  padding-bottom: ${props => props.theme.spacing.md}px;
  flex-direction: row;
  flex-wrap: wrap;
`;

const TypeFilterChip = styled(TouchableOpacity)<{ active: boolean }>`
  background-color: ${props => props.active ? props.theme.colors.primary : `${props.theme.colors.primary}10`};
  border-radius: ${props => props.theme.roundness.full}px;
  padding-horizontal: ${props => props.theme.spacing.md}px;
  padding-vertical: ${props => props.theme.spacing.xs}px;
  margin-right: ${props => props.theme.spacing.sm}px;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const TypeFilterText = styled(Text)<{ active: boolean }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.active ? '#FFFFFF' : props.theme.colors.primary};
`;

const SectionTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  padding-horizontal: ${props => props.theme.spacing.md}px;
  padding-top: ${props => props.theme.spacing.md}px;
  padding-bottom: ${props => props.theme.spacing.sm}px;
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

const DiagnosticTag = styled(View)`
  background-color: ${props => `${props.theme.colors.primary}15`};
  padding-horizontal: ${props => props.theme.spacing.xs}px;
  padding-vertical: 2px;
  border-radius: ${props => props.theme.roundness.sm}px;
  margin-right: ${props => props.theme.spacing.sm}px;
`;

const DiagnosticTagText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.primary};
`;

const TagsContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-top: ${props => props.theme.spacing.xs}px;
`;

// Tipos de filtros
type ActionFilter = 'all' | 'pending' | 'in_progress' | 'completed';
type ActionTypeFilter = 'all' | 'operational' | 'diagnostic' | 'team';

// Interface estendida para incluir as propriedades adicionais
interface ExtendedActionPlan extends ActionPlan {
  source?: 'operational' | 'diagnostic';
  indicatorName?: string;
}

export const ActionsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  
  const [filter, setFilter] = useState<ActionFilter>('all');
  const [typeFilter, setTypeFilter] = useState<ActionTypeFilter>('all');
  const [actions, setActions] = useState<ExtendedActionPlan[]>([]);
  const [diagnosticActions, setDiagnosticActions] = useState<ExtendedActionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const loadActions = async () => {
      setLoading(true);
      try {
        // Carregar planos de ação operacionais
        const operationalPlans = actionPlanService.getAllActionPlans();
        
        // Marcar os planos operacionais com a fonte
        const markedOperationalPlans = operationalPlans.map(plan => ({
          ...plan,
          source: 'operational' as const
        }));
        
        // Carregar recomendações do diagnóstico
        const uvcRecommendations = hierarchyService.getRecommendations('uvc');
        const priceRecommendations = hierarchyService.getRecommendations('precoMedio');
        
        // Formatar recomendações para o mesmo formato de planos de ação
        // Garantir que cada recomendação tenha um ID único prefixando com "diag-"
        const formattedRecommendations = [...uvcRecommendations, ...priceRecommendations].map(rec => ({
          id: `diag-${rec.actionId}`, // Prefixo para evitar colisões de ID
          indicatorId: rec.id.includes('uvc') ? 'uvc' : 'precoMedio',
          title: rec.title,
          description: rec.description,
          steps: [rec.impact],
          priority: rec.priority,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          source: 'diagnostic' as const,
          indicatorName: rec.id.includes('uvc') ? 'UVC' : 'Preço Médio',
          originalActionId: rec.actionId // Mantemos o ID original para referência
        }));
        
        setActions(markedOperationalPlans);
        setDiagnosticActions(formattedRecommendations);
      } catch (error) {
        console.error('Erro ao carregar ações:', error);
        Alert.alert('Erro', 'Não foi possível carregar as ações disponíveis.');
      } finally {
        setLoading(false);
      }
    };
    
    loadActions();
  }, []);
  
  // Combinar ações baseadas nos filtros
  const combinedActions = () => {
    let filteredActions = [...actions];
    let filteredDiagnosticActions = [...diagnosticActions];
    
    // Aplicar filtro de status
    if (filter !== 'all') {
      filteredActions = filteredActions.filter(action => action.status === filter);
      filteredDiagnosticActions = filteredDiagnosticActions.filter(action => action.status === filter);
    }
    
    // Aplicar filtro de tipo
    if (typeFilter === 'operational') {
      return filteredActions;
    } else if (typeFilter === 'diagnostic') {
      return filteredDiagnosticActions;
    }
    
    // Combinar as ações se estivermos mostrando 'todos'
    return [...filteredActions, ...filteredDiagnosticActions];
  };
  
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
  
  const handleActionPress = (action: ExtendedActionPlan) => {
    // Se for ação de diagnóstico, usamos o ID original, senão usamos o ID normal
    const actionId = action.source === 'diagnostic' ? action.originalActionId : action.id;
    navigation.navigate('ActionPlanDetails', { actionId });
  };
  
  const renderActionCard = ({ item }: { item: ExtendedActionPlan }) => (
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
          
          {item.source === 'diagnostic' && (
            <TagsContainer theme={theme}>
              <DiagnosticTag theme={theme}>
                <DiagnosticTagText theme={theme}>Diagnóstico</DiagnosticTagText>
              </DiagnosticTag>
              {item.indicatorName && (
                <DiagnosticTag theme={theme}>
                  <DiagnosticTagText theme={theme}>{item.indicatorName}</DiagnosticTagText>
                </DiagnosticTag>
              )}
            </TagsContainer>
          )}
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
      <EmptyText theme={theme}>Nenhuma ação disponível com os filtros selecionados</EmptyText>
    </EmptyContainer>
  );
  
  const filteredActions = combinedActions();
  
  return (
    <Container theme={theme}>
      <AppHeader 
        title="Ações Sugeridas"
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
      
      <TypeFilterContainer theme={theme}>
        <TypeFilterChip 
          active={typeFilter === 'all'} 
          onPress={() => setTypeFilter('all')}
          theme={theme}
        >
          <TypeFilterText active={typeFilter === 'all'} theme={theme}>
            Todas as Ações
          </TypeFilterText>
        </TypeFilterChip>
        
        <TypeFilterChip 
          active={typeFilter === 'operational'} 
          onPress={() => setTypeFilter('operational')}
          theme={theme}
        >
          <TypeFilterText active={typeFilter === 'operational'} theme={theme}>
            Operacionais
          </TypeFilterText>
        </TypeFilterChip>
        
        <TypeFilterChip 
          active={typeFilter === 'diagnostic'} 
          onPress={() => setTypeFilter('diagnostic')}
          theme={theme}
        >
          <TypeFilterText active={typeFilter === 'diagnostic'} theme={theme}>
            Diagnóstico
          </TypeFilterText>
        </TypeFilterChip>
      </TypeFilterContainer>
      
      {/* Título da seção */}
      <SectionTitle theme={theme}>
        {typeFilter === 'all' 
          ? 'Todas as Ações' 
          : typeFilter === 'operational' 
            ? 'Ações Operacionais' 
            : 'Ações de Diagnóstico'
        }
      </SectionTitle>
      
      <FlatList
        data={filteredActions}
        renderItem={renderActionCard}
        keyExtractor={item => item.id} // Agora usando IDs únicos para cada item
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingBottom: theme.spacing.xl 
        }} 
        ListEmptyComponent={renderEmptyList}
      />
    </Container>
  );
};