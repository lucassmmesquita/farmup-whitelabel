// src/screens/dashboard/IndicatorDetailsScreen.tsx
import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { useTheme } from '@hooks/useTheme';
import { useIndicatorHierarchy } from '@hooks/useIndicatorHierarchy';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import IndicatorCard from '@components/dashboard/IndicatorCard';
import RecommendationCard from '@components/dashboard/RecommendationCard';
import styled from 'styled-components/native';
import { Indicator } from '@/types/metrics';

type RouteParams = {
  IndicatorDetails: {
    indicator: Indicator;
  };
};

const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ContentContainer = styled(ScrollView)`
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

const InfoText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const CardRow = styled(View)`
  flex-direction: row;
  margin-horizontal: -${props => props.theme.spacing.xs}px;
`;

const CardColumn = styled(View)`
  flex: 1;
  padding-horizontal: ${props => props.theme.spacing.xs}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const EmptyState = styled(View)`
  padding: ${props => props.theme.spacing.xl}px;
  align-items: center;
  justify-content: center;
`;

const EmptyStateText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.inactive};
  text-align: center;
  margin-top: ${props => props.theme.spacing.md}px;
`;

export const IndicatorDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<RouteParams, 'IndicatorDetails'>>();
  const navigation = useNavigation();
  const { indicator } = route.params;
  
  const {
    recommendations,
    getChildIndicators,
    getParentIndicator,
    isActionable
  } = useIndicatorHierarchy();
  
  const parent = getParentIndicator(indicator.id);
  const children = getChildIndicators(indicator.id);
  
  const handleRecommendationPress = (action: string) => {
    Alert.alert('Ação iniciada', `Executando: ${action}`, [{ text: 'OK' }]);
  };
  
  const handleIndicatorPress = (ind: Indicator) => {
    navigation.navigate('IndicatorDetails', { indicator: ind });
  };
  
  return (
    <Container theme={theme}>
      <AppHeader 
        title={indicator.name}
        showBack
      />
      
      <ContentContainer theme={theme}>
        {/* Card principal do indicador */}
        <IndicatorCard 
          indicator={indicator}
          onPress={() => {}}
          size="large"
        />
        
        {/* Relações causais */}
        {parent && (
          <>
            <SectionTitle theme={theme}>Impacta</SectionTitle>
            <CardRow theme={theme}>
              <CardColumn theme={theme}>
                <IndicatorCard 
                  indicator={parent}
                  onPress={handleIndicatorPress}
                  size="medium"
                />
              </CardColumn>
            </CardRow>
          </>
        )}
        
        {children.length > 0 && (
          <>
            <SectionTitle theme={theme}>Influenciado por</SectionTitle>
            <CardRow theme={theme}>
              {children.map(child => (
                <CardColumn key={child.id} theme={theme}>
                  <IndicatorCard 
                    indicator={child}
                    onPress={handleIndicatorPress}
                    size="medium"
                  />
                </CardColumn>
              ))}
            </CardRow>
          </>
        )}
        
        {/* Recomendações (apenas para indicadores primários) */}
        {isActionable(indicator.id) ? (
          <>
            <SectionTitle theme={theme}>Recomendações</SectionTitle>
            {recommendations.length > 0 ? (
              recommendations.map(rec => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onPress={() => handleRecommendationPress(rec.action)}
                />
              ))
            ) : (
              <EmptyState theme={theme}>
                <EmptyStateText theme={theme}>
                  Nenhuma recomendação disponível no momento
                </EmptyStateText>
              </EmptyState>
            )}
          </>
        ) : (
          <>
            <SectionTitle theme={theme}>Análise Causal</SectionTitle>
            <InfoText theme={theme}>
              {indicator.id === 'ticketMedio' 
                ? 'O Ticket Médio é um indicador composto, resultante da multiplicação de UVC (unidades por cupom) e Preço Médio. Para melhorar este indicador, foque nas ações recomendadas para UVC e Preço Médio.'
                : indicator.id === 'faturamento'
                ? 'O Faturamento é influenciado diretamente pela quantidade de cupons e pelo ticket médio. Analise esses indicadores para identificar oportunidades de melhoria.'
                : 'Este indicador não possui ações diretas recomendadas. Analise os indicadores relacionados para identificar oportunidades de melhoria.'}
            </InfoText>
          </>
        )}
      </ContentContainer>
    </Container>
  );
};

export default IndicatorDetailsScreen;