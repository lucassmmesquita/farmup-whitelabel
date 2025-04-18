// src/screens/actions/ActionsScreen.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { Card } from '@components/common/Card';
import { useTheme } from '@hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';

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
  margin-horizontal: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
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

export const ActionsScreen: React.FC = () => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Filtra as ações com base na categoria selecionada
  const filteredActions = selectedCategory === 'all'
    ? actionsMock
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
  
  const handleActionButton = (actionType: string, itemId: string) => {
    // Implementar ações específicas aqui
    console.log(`Action: ${actionType} for item ${itemId}`);
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
  
  const renderEmptyList = () => (
    <EmptyContainer theme={theme}>
      <Feather name="check-circle" size={48} color={theme.colors.inactive} />
      <EmptyText theme={theme}>Nenhuma ação necessária no momento</EmptyText>
    </EmptyContainer>
  );
  
  return (
    <Container theme={theme}>
      <AppHeader title="Ações Sugeridas" />
      
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
        data={filteredActions}
        renderItem={renderActionCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xl }}
        ListEmptyComponent={renderEmptyList}
      />
    </Container>
  );
};