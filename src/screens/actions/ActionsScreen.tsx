// src/screens/actions/ActionsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { Card } from '@components/common/Card';
import { useTheme } from '@hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import actionPlanService from '@/services/api/actionPlanService';
import { ActionPlan } from '@/types/metrics';

// Mock de dados para ações
const actionsMock = [
  {
    id: '1',
    title: 'Estoque baixo',
    description: 'Produto Dipirona está com estoque baixo (5 unidades)',
    icon: 'alert-triangle',
    type: 'inventory',
    priority: 'high',
    actions: [
      { label: 'Fazer pedido', action: 'order' },
      { label: 'Verificar estoque', action: 'check_inventory' },
    ],
  },
  {
    id: '2',
    title: 'Venda cruzada',
    description: 'Ofereça protetor solar junto com bronzeador para aumentar ticket médio',
    icon: 'dollar-sign',
    type: 'sales',
    priority: 'medium',
    actions: [
      { label: 'Ver sugestão', action: 'view_suggestion' },
      { label: 'Verificar estoque', action: 'check_inventory' },
    ],
  },
  {
    id: '3',
    title: 'Campanha de aniversariantes',
    description: '15 clientes fazem aniversário esta semana. Envie mensagem personalizada.',
    icon: 'gift',
    type: 'marketing',
    priority: 'medium',
    actions: [
      { label: 'Ver lista', action: 'view_list' },
      { label: 'Enviar mensagem', action: 'send_message' },
    ],
  },
  {
    id: '4',
    title: 'Produtos perto do vencimento',
    description: '12 produtos vencem nos próximos 30 dias',
    icon: 'clock',
    type: 'inventory',
    priority: 'high',
    actions: [
      { label: 'Ver produtos', action: 'view_products' },
      { label: 'Criar promoção', action: 'create_promotion' },
    ],
  },
  {
    id: '5',
    title: 'Meta de vendas',
    description: 'Sua meta diária está 35% abaixo do esperado',
    icon: 'trending-down',
    type: 'sales',
    priority: 'high',
    actions: [
      { label: 'Ver detalhes', action: 'view_details' },
    ],
  },
];

// Filtragem por categorias
const categories = [
  { id: 'all', label: 'Todas', icon: 'grid' },
  { id: 'inventory', label: 'Estoque', icon: 'package' },
  { id: 'sales', label: 'Vendas', icon: 'dollar-sign' },
  { id: 'marketing', label: 'Marketing', icon: 'users' },
  { id: 'plans', label: 'Planos de Ação', icon: 'check-circle' }, // Nova categoria
];

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

const ActionCardContainer = styled(Card)`
  margin-horizontal: ${props => props.theme?.spacing?.md || 16}px;
  margin-bottom: ${props => props.theme?.spacing?.md || 16}px;
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

const ActionButtonsContainer = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const ActionButton = styled(TouchableOpacity)`
  padding-vertical: ${props => props.theme.spacing.xs}px;
  padding-horizontal: ${props => props.theme.spacing.md}px;
  border-radius: ${props => props.theme.roundness.sm}px;
  background-color: ${props => `${props.theme.colors.primary}10`};
  margin-left: ${props => props.theme.spacing.sm}px;
`;

const ActionButtonText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.primary};
`;

const PriorityBadge = styled(View)<{ priority: string }>`
  padding-vertical: ${props => props.theme.spacing.xs / 2}px;
  padding-horizontal: ${props => props.theme.spacing.sm}px;
  border-radius: ${props => props.theme.roundness.sm}px;
  background-color: ${props => {
    switch (props.priority) {
      case 'high': return `${props.theme.colors.error}15`;
      case 'medium': return `${props.theme.colors.warning}15`;
      default: return `${props.theme.colors.primary}15`;
    }
  }};
  align-self: flex-start;
`;

const PriorityText = styled(Text)<{ priority: string }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => {
    switch (props.priority) {
      case 'high': return props.theme.colors.error;
      case 'medium': return props.theme.colors.warning;
      default: return props.theme.colors.primary;
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

const PlanCardContainer = styled(TouchableOpacity)`
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
  elevation: 2;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
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

export const ActionsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  
  useEffect(() => {
    // Carregar planos de ação ao iniciar
    loadActionPlans();
  }, []);
  
  const loadActionPlans = () => {
    try {
      const plans = actionPlanService.getAllActionPlans();
      setActionPlans(plans);
    } catch (error) {
      console.error('Erro ao carregar planos de ação:', error);
    }
  };
  
  // Filtra as ações com base na categoria selecionada
  const filteredActions = selectedCategory === 'all'
    ? actionsMock
    : selectedCategory === 'plans'
    ? [] // Quando a categoria é 'plans', usamos o estado de planos de ação
    : actionsMock.filter(action => action.type === selectedCategory);
  
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta prioridade';
      case 'medium': return 'Média prioridade';
      default: return 'Baixa prioridade';
    }
  };
  
  const getIconColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.warning;
      default: return theme.colors.primary;
    }
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
  
  const handleActionButton = (actionType: string, itemId: string) => {
    // Implementar ações específicas aqui
    console.log(`Action: ${actionType} for item ${itemId}`);
  };
  
  const handleActionPlanPress = (plan: ActionPlan) => {
    navigation.navigate('ActionPlanDetails', { actionId: plan.id });
  };
  
  const renderActionCard = ({ item }: { item: typeof actionsMock[0] }) => (
    <ActionCardContainer elevation="light">
      <ActionHeader theme={theme}>
        <ActionIcon priority={item.priority} theme={theme}>
          <Feather 
            name={item.icon as any} 
            size={20} 
            color={getIconColor(item.priority)} 
          />
        </ActionIcon>
        
        <ActionInfo theme={theme}>
          <ActionTitle theme={theme}>{item.title}</ActionTitle>
          <ActionDescription theme={theme}>{item.description}</ActionDescription>
        </ActionInfo>
      </ActionHeader>
      
      <PriorityBadge priority={item.priority} theme={theme}>
        <PriorityText priority={item.priority} theme={theme}>
          {getPriorityLabel(item.priority)}
        </PriorityText>
      </PriorityBadge>
      
      <ActionButtonsContainer theme={theme}>
        {item.actions.map((action, index) => (
          <ActionButton 
            key={index} 
            onPress={() => handleActionButton(action.action, item.id)}
            theme={theme}
          >
            <ActionButtonText theme={theme}>{action.label}</ActionButtonText>
          </ActionButton>
        ))}
      </ActionButtonsContainer>
    </ActionCardContainer>
  );
  
  const renderPlanCard = ({ item }: { item: ActionPlan }) => (
    <PlanCardContainer 
      onPress={() => handleActionPlanPress(item)}
      theme={theme}
      priority={item.priority}
    >
      <ActionHeader theme={theme}>
        <ActionIcon priority={item.priority} theme={theme}>
          <Feather 
            name={
              item.indicatorId === 'uvc' 
                ? 'package' 
                : item.indicatorId === 'precoMedio' 
                  ? 'dollar-sign' 
                  : 'activity'
            } 
            size={20} 
            color={getIconColor(item.priority)} 
          />
        </ActionIcon>
        
        <ActionInfo theme={theme}>
          <ActionTitle theme={theme}>{item.title}</ActionTitle>
          <ActionDescription theme={theme}>
            {item.description.length > 80 
              ? item.description.substring(0, 80) + '...' 
              : item.description}
          </ActionDescription>
        </ActionInfo>
      </ActionHeader>
      
      <StatusBadge status={item.status} theme={theme}>
        <StatusText status={item.status} theme={theme}>
          {getStatusLabel(item.status)}
        </StatusText>
      </StatusBadge>
    </PlanCardContainer>
  );
  
  const renderEmptyList = () => (
    <EmptyContainer theme={theme}>
      <Feather name="check-circle" size={48} color={theme.colors.inactive} />
      <EmptyText theme={theme}>Nenhuma ação necessária no momento</EmptyText>
    </EmptyContainer>
  );
  
  // Determinar qual renderizador e dados usar com base na categoria selecionada
  const renderItem = selectedCategory === 'plans' ? renderPlanCard : renderActionCard;
  const data = selectedCategory === 'plans' ? actionPlans : filteredActions;
  
  return (
    <Container theme={theme}>
      <AppHeader 
        title="Ações Sugeridas" 
        rightIcon={selectedCategory === 'plans' ? 'list' : undefined}
        onRightIconPress={selectedCategory === 'plans' ? () => navigation.navigate('ActionList') : undefined}
      />
      
      <FiltersContainer theme={theme}>
        {categories.map(category => (
          <FilterButton 
            key={category.id} 
            active={selectedCategory === category.id}
            onPress={() => setSelectedCategory(category.id)}
            theme={theme}
          >
            <Feather 
              name={category.icon as any} 
              size={16} 
              color={selectedCategory === category.id ? '#FFFFFF' : theme.colors.text} 
            />
            <FilterText active={selectedCategory === category.id} theme={theme}>
              {category.label}
            </FilterText>
          </FilterButton>
        ))}
      </FiltersContainer>
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xl }}
        ListEmptyComponent={renderEmptyList}
      />
    </Container>
  );
};