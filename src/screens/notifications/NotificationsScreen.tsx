// src/screens/notifications/NotificationsScreen.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { useTheme } from '@hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { Button } from '@components/common/Button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock de dados para notificações
const notificationsMock = [
  { 
    id: '1', 
    title: 'Estoque baixo de produtos', 
    message: 'Alguns produtos estão com estoque abaixo do mínimo necessário.', 
    type: 'alert',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
  },
  { 
    id: '2', 
    title: 'Relatório diário disponível', 
    message: 'O relatório de vendas de hoje já está disponível para visualização.', 
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
  },
  { 
    id: '3', 
    title: 'Meta de vendas atingida', 
    message: 'Parabéns! Sua equipe atingiu a meta de vendas do dia.', 
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 horas atrás
  },
  { 
    id: '4', 
    title: 'Novo produto cadastrado', 
    message: 'Um novo produto foi adicionado ao catálogo.', 
    type: 'info',
    read: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
  },
  { 
    id: '5', 
    title: 'Vendas abaixo do esperado', 
    message: 'As vendas de hoje estão 15% abaixo do esperado para o período.', 
    type: 'warning',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
  },
];

// Componentes estilizados
const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
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

const NotificationItem = styled(TouchableOpacity)<{ read: boolean }>`
  background-color: ${props => props.read ? props.theme.colors.background : `${props.theme.colors.primary}05`};
  padding: ${props => props.theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const NotificationHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const NotificationTitle = styled(Text)<{ read: boolean }>`
  font-family: ${props => props.read ? props.theme.typography.fontFamily.regular : props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const NotificationDate = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.subtext};
`;

const NotificationMessage = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
  margin-top: ${props => props.theme.spacing.xs}px;
`;

const NotificationTypeIcon = styled(View)<{ type: string }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${props => {
    switch (props.type) {
      case 'alert': return `${props.theme.colors.error}15`;
      case 'warning': return `${props.theme.colors.warning}15`;
      case 'success': return `${props.theme.colors.success}15`;
      default: return `${props.theme.colors.primary}15`;
    }
  }};
  justify-content: center;
  align-items: center;
  margin-right: ${props => props.theme.spacing.md}px;
`;

const NotificationContent = styled(View)`
  flex-direction: row;
`;

const TextContainer = styled(View)`
  flex: 1;
`;

const HiddenItemContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
`;

const DeleteButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.error};
  width: 80px;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const MarkButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.primary};
  width: 80px;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ActionButtonText = styled(Text)`
  color: #FFFFFF;
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  text-align: center;
  margin-top: ${props => props.theme.spacing.xs}px;
`;

const HeaderButtons = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

export const NotificationsScreen: React.FC = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState(notificationsMock);
  
  const formatNotificationDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return format(date, "'Hoje,' HH:mm", { locale: ptBR });
    } else if (diffInHours < 48) {
      return format(date, "'Ontem,' HH:mm", { locale: ptBR });
    } else {
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    }
  };
  
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(item => 
        item.id === id ? { ...item, read: true } : item
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(item => ({ ...item, read: true }))
    );
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(
      notifications.filter(item => item.id !== id)
    );
  };
  
  const clearAll = () => {
    setNotifications([]);
  };
  
  const getIconForType = (type: string): keyof typeof Feather.glyphMap => {
    switch (type) {
      case 'alert': return 'alert-circle';
      case 'warning': return 'alert-triangle';
      case 'success': return 'check-circle';
      default: return 'info';
    }
  };
  
  const getColorForType = (type: string) => {
    switch (type) {
      case 'alert': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'success': return theme.colors.success;
      default: return theme.colors.primary;
    }
  };
  
  const renderHiddenItem = ({ item }: { item: typeof notificationsMock[0] }) => (
    <HiddenItemContainer theme={theme}>
      <MarkButton 
        onPress={() => markAsRead(item.id)} 
        style={{ display: item.read ? 'none' : 'flex' }}
        theme={theme}
      >
        <Feather name="check" size={20} color="#FFFFFF" />
        <ActionButtonText theme={theme}>Lido</ActionButtonText>
      </MarkButton>
      <DeleteButton onPress={() => deleteNotification(item.id)} theme={theme}>
        <Feather name="trash-2" size={20} color="#FFFFFF" />
        <ActionButtonText theme={theme}>Excluir</ActionButtonText>
      </DeleteButton>
    </HiddenItemContainer>
  );
  
  const renderItem = ({ item }: { item: typeof notificationsMock[0] }) => (
    <SwipeRow
      rightOpenValue={-160}
      disableRightSwipe
      rightActivationValue={-200}
      onRightAction={() => deleteNotification(item.id)}
    >
      {renderHiddenItem({ item })}
      <NotificationItem 
        onPress={() => markAsRead(item.id)} 
        read={item.read}
        theme={theme}
      >
        <NotificationHeader theme={theme}>
          <NotificationTitle read={item.read} theme={theme}>
            {item.title}
          </NotificationTitle>
          <NotificationDate theme={theme}>
            {formatNotificationDate(item.createdAt)}
          </NotificationDate>
        </NotificationHeader>
        
        <NotificationContent>
          <NotificationTypeIcon type={item.type} theme={theme}>
            <Feather 
              name={getIconForType(item.type)} 
              size={20} 
              color={getColorForType(item.type)} 
            />
          </NotificationTypeIcon>
          
          <TextContainer>
            <NotificationMessage theme={theme}>
              {item.message}
            </NotificationMessage>
          </TextContainer>
        </NotificationContent>
      </NotificationItem>
    </SwipeRow>
  );
  
  const renderEmptyList = () => (
    <EmptyContainer theme={theme}>
      <Feather name="bell-off" size={48} color={theme.colors.inactive} />
      <EmptyText theme={theme}>Não há notificações para exibir</EmptyText>
    </EmptyContainer>
  );
  
  return (
    <Container theme={theme}>
      <AppHeader title="Notificações" />
      
      {notifications.length > 0 && (
        <HeaderButtons theme={theme}>
          <Button 
            title="Marcar todas como lidas" 
            variant="ghost" 
            size="small" 
            onPress={markAllAsRead} 
          />
          <Button 
            title="Limpar todas" 
            variant="ghost" 
            size="small" 
            onPress={clearAll} 
          />
        </HeaderButtons>
      )}
      
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
      />
    </Container>
  );
};