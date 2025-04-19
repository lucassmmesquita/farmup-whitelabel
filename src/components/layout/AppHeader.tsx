// src/components/layout/AppHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';
import { useClientConfig } from '@hooks/useClientConfig';

interface BreadcrumbItem {
  label: string;
  screen: string;
  params?: Record<string, any>;
}

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightIconPress?: () => void;
  showLogo?: boolean;
  subtitle?: string;
  showNotifications?: boolean;
  breadcrumbs?: BreadcrumbItem[];
}

const HeaderContainer = styled(View)`
  background-color: ${props => props.theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
  padding-top: ${props => props.theme.spacing.sm}px;
`;

const HeaderTop = styled(View)`
  height: 56px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${props => props.theme.spacing.md}px;
`;

const HeaderTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  color: ${props => props.theme.colors.text};
  flex: 1;
  text-align: center;
`;

const HeaderSubtitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
  text-align: center;
  margin-top: -${props => props.theme.spacing.xs}px;
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const LogoImage = styled(Image)`
  height: 30px;
  width: 120px;
  resize-mode: contain;
`;

const IconButton = styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const NotificationBadge = styled(View)`
  position: absolute;
  top: 0;
  right: 0;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.notification};
  justify-content: center;
  align-items: center;
`;

const BadgeText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: 10px;
  color: white;
`;

// Componentes de Breadcrumbs
const BreadcrumbsContainer = styled(ScrollView)`
  padding-horizontal: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const BreadcrumbsInnerContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const BreadcrumbItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
`;

const BreadcrumbText = styled(Text)<{ isLast: boolean }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.isLast ? props.theme.colors.primary : props.theme.colors.subtext};
`;

const BreadcrumbSeparator = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
  margin-horizontal: ${props => props.theme.spacing.xs}px;
`;

// Mapear rotas para breadcrumbs
// Em uma implementação real, seria melhor mover isso para um utilitário separado
const getBreadcrumbsForRoute = (routeName: string) => {
  // Implementação simplificada - em um caso real, isso seria mais dinâmico
  switch (routeName) {
    case 'IndicatorDetails':
      return [
        { label: 'Dashboard', screen: 'Dashboard' },
        { label: 'Diagnóstico', screen: 'Diagnostic' },
        { label: 'Indicador', screen: '' }
      ];
    case 'ActionPlanDetails':
      return [
        { label: 'Dashboard', screen: 'Dashboard' },
        { label: 'Ações', screen: 'Actions' },
        { label: 'Plano de Ação', screen: '' }
      ];
    case 'SellerDetails':
      return [
        { label: 'Dashboard', screen: 'Dashboard' },
        { label: 'Equipe', screen: 'Team' },
        { label: 'Vendedor', screen: '' }
      ];
    default:
      return [];
  }
};

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  rightIcon,
  onRightIconPress,
  showLogo = false,
  subtitle,
  showNotifications = true,
  breadcrumbs,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { name, logoUrl } = useClientConfig();
  const route = useRoute();
  
  // Obter breadcrumbs automaticamente se não forem fornecidos
  const routeBreadcrumbs = breadcrumbs || getBreadcrumbsForRoute(route.name);
  const hasBreadcrumbs = routeBreadcrumbs && routeBreadcrumbs.length > 0;
  
  const handleNotificationsPress = () => {
    navigation.navigate('NotificationsMain' as never);
  };
  
  const handleBreadcrumbPress = (item: BreadcrumbItem) => {
    if (item.screen) {
      navigation.navigate(item.screen as never, item.params as never);
    }
  };
  
  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={theme.colors.background} 
      />
      <HeaderContainer theme={theme}>
        <HeaderTop theme={theme}>
          <IconButton
            onPress={showBack ? () => navigation.goBack() : undefined}
            disabled={!showBack}
            activeOpacity={0.7}
          >
            {showBack && <Feather name="arrow-left" size={24} color={theme.colors.text} />}
          </IconButton>
          
          {showLogo ? (
            <View style={{ flex: 1, alignItems: 'center' }}>
              <LogoImage source={logoUrl} />
            </View>
          ) : (
            <HeaderTitle theme={theme}>{title || name}</HeaderTitle>
          )}
          
          {/* Ícone personalizado à direita, se fornecido */}
          {rightIcon && (
            <IconButton
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
              activeOpacity={0.7}
            >
              <Feather name={rightIcon} size={24} color={theme.colors.text} />
            </IconButton>
          )}
          
          {/* Ícone de notificações, se não houver outro ícone à direita */}
          {showNotifications && !rightIcon && (
            <IconButton
              onPress={handleNotificationsPress}
              activeOpacity={0.7}
            >
              <Feather name="bell" size={24} color={theme.colors.text} />
              {/* Badge para indicar notificações não lidas */}
              <NotificationBadge theme={theme}>
                <BadgeText theme={theme}>3</BadgeText>
              </NotificationBadge>
            </IconButton>
          )}
        </HeaderTop>
        
        {subtitle && (
          <HeaderSubtitle theme={theme}>{subtitle}</HeaderSubtitle>
        )}
        
        {/* Breadcrumbs */}
        {hasBreadcrumbs && (
          <BreadcrumbsContainer 
            horizontal 
            showsHorizontalScrollIndicator={false}
            theme={theme}
          >
            <BreadcrumbsInnerContainer>
              {routeBreadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <BreadcrumbSeparator theme={theme}>
                      /
                    </BreadcrumbSeparator>
                  )}
                  <BreadcrumbItem 
                    onPress={() => handleBreadcrumbPress(item)}
                    disabled={!item.screen || index === routeBreadcrumbs.length - 1}
                  >
                    <BreadcrumbText 
                      isLast={index === routeBreadcrumbs.length - 1}
                      theme={theme}
                    >
                      {item.label}
                    </BreadcrumbText>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbsInnerContainer>
          </BreadcrumbsContainer>
        )}
      </HeaderContainer>
    </>
  );
};

export default AppHeader;