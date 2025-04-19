// src/screens/dashboard/IndicatorDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity, // Adicionar esta importação
  Dimensions 
} from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { useTheme } from '@hooks/useTheme';
import { useIndicatorHierarchy } from '@hooks/useIndicatorHierarchy';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import IndicatorCard from '@components/dashboard/IndicatorCard';
import RecommendationCard from '@components/dashboard/RecommendationCard';
import styled from 'styled-components/native';
import { Indicator } from '@/types/metrics';
import { Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import hierarchyService from '@/services/api/hierarchyService';
import { Button } from '@components/common/Button';

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

const SectionSubtitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm}px;
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

const ChartContainer = styled(View)`
  margin-top: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.xl}px;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.roundness.md}px;
  padding: ${props => props.theme.spacing.md}px;
  overflow: hidden;
`;

const CauseItem = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacing.sm}px;
  background-color: ${props => `${props.theme.colors.primary}10`};
  border-radius: ${props => props.theme.roundness.md}px;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const CauseText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  margin-left: ${props => props.theme.spacing.sm}px;
  flex: 1;
`;

const CauseIcon = styled(View)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${props => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
`;

const ActionButton = styled(Button)`
  margin-top: ${props => props.theme?.spacing?.md || 16}px;
  margin-bottom: ${props => props.theme?.spacing?.xl || 32}px;
`;

const HistoryPeriodSelector = styled(View)`
  flex-direction: row;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const PeriodButton = styled(TouchableOpacity)<{ active: boolean }>`
  padding-vertical: ${props => props.theme.spacing.xs}px;
  padding-horizontal: ${props => props.theme.spacing.md}px;
  background-color: ${props => props.active ? props.theme.colors.primary : `${props.theme.colors.primary}10`};
  border-radius: ${props => props.theme.roundness.full}px;
  margin-right: ${props => props.theme.spacing.sm}px;
`;

const PeriodButtonText = styled(Text)<{ active: boolean }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.active ? '#FFFFFF' : props.theme.colors.primary};
`;

export const IndicatorDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<RouteParams, 'IndicatorDetails'>>();
  const navigation = useNavigation();
  const { indicator } = route.params;
  const screenWidth = Dimensions.get('window').width - (theme.spacing.md * 2);
  
  const [historyPeriod, setHistoryPeriod] = useState<number>(7);
  const [historyData, setHistoryData] = useState<{dates: string[], values: number[]}>({dates: [], values: []});
  const [causes, setCauses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const {
    recommendations,
    getChildIndicators,
    getParentIndicator,
    isActionable
  } = useIndicatorHierarchy();
  
  const parent = getParentIndicator(indicator.id);
  const children = getChildIndicators(indicator.id);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Carregar histórico do indicador
        const history = hierarchyService.getIndicatorHistory(indicator.id, historyPeriod);
        setHistoryData(history);
        
        // Carregar causas possíveis
        const possibleCauses = hierarchyService.getPossibleCauses(indicator.id);
        setCauses(possibleCauses);
      } catch (error) {
        console.error('Erro ao carregar dados do indicador:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [indicator.id, historyPeriod]);
  
  const handleRecommendationPress = (actionId: string) => {
    // Navegar para a tela de detalhe do plano de ação
    navigation.navigate('ActionPlanDetails', { actionId });
  };
  
  const handleIndicatorPress = (ind: Indicator) => {
    navigation.navigate('IndicatorDetails', { indicator: ind });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };
  
  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 1,
    color: () => theme.colors.primary,
    labelColor: () => theme.colors.subtext,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: theme.colors.primary
    },
    propsForLabels: {
      fontSize: 10,
    }
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
        
        {indicator.description && (
          <InfoText theme={theme}>
            {indicator.description}
          </InfoText>
        )}
        
        {/* Histórico do indicador */}
        <SectionTitle theme={theme}>Histórico</SectionTitle>
        
        <HistoryPeriodSelector theme={theme}>
          <PeriodButton 
            active={historyPeriod === 7} 
            onPress={() => setHistoryPeriod(7)}
            theme={theme}
          >
            <PeriodButtonText active={historyPeriod === 7} theme={theme}>7 dias</PeriodButtonText>
          </PeriodButton>
          <PeriodButton 
            active={historyPeriod === 15} 
            onPress={() => setHistoryPeriod(15)}
            theme={theme}
          >
            <PeriodButtonText active={historyPeriod === 15} theme={theme}>15 dias</PeriodButtonText>
          </PeriodButton>
          <PeriodButton 
            active={historyPeriod === 30} 
            onPress={() => setHistoryPeriod(30)}
            theme={theme}
          >
            <PeriodButtonText active={historyPeriod === 30} theme={theme}>30 dias</PeriodButtonText>
          </PeriodButton>
        </HistoryPeriodSelector>
        
        <ChartContainer theme={theme}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <LineChart
              data={{
                labels: historyData.dates.map(d => formatDate(d)),
                datasets: [
                  {
                    data: historyData.values,
                    color: () => theme.colors.primary,
                    strokeWidth: 2
                  },
                  // Linha para a meta
                  {
                    data: Array(historyData.dates.length).fill(
                      typeof indicator.target === 'number' 
                        ? indicator.target 
                        : parseFloat(indicator.target.toString())
                    ),
                    color: () => theme.colors.inactive,
                    strokeWidth: 1,
                    withDots: false
                  }
                ]
              }}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                borderRadius: 16
              }}
              fromZero={false}
              segments={5}
            />
          )}
        </ChartContainer>
        
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
        
        {/* Causas possíveis */}
        <SectionTitle theme={theme}>Causas Possíveis</SectionTitle>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : causes.length > 0 ? (
          causes.map((cause, index) => (
            <CauseItem key={index} theme={theme}>
              <CauseIcon theme={theme}>
                <Feather name="alert-circle" size={14} color="#FFFFFF" />
              </CauseIcon>
              <CauseText theme={theme}>{cause}</CauseText>
            </CauseItem>
          ))
        ) : (
          <EmptyState theme={theme}>
            <EmptyStateText theme={theme}>
              Não há causas identificadas para este indicador
            </EmptyStateText>
          </EmptyState>
        )}
        
        {/* Recomendações (apenas para indicadores primários) */}
        {isActionable(indicator.id) && (
          <>
            <SectionTitle theme={theme}>Recomendações</SectionTitle>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : recommendations.length > 0 ? (
              recommendations.map(rec => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onPress={() => handleRecommendationPress(rec.actionId)}
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
        )}
        
        {/* Plano de ação - só para indicadores primários */}
        {isActionable(indicator.id) && (
          <>
            <SectionTitle theme={theme}>Plano de Ação</SectionTitle>
            <InfoText theme={theme}>
              Acesse o plano de ação personalizado para melhorar este indicador. 
              Nossa análise baseada em dados sugere as ações com maior potencial de impacto.
            </InfoText>
            <ActionButton 
              title="Ver Plano de Ação" 
              onPress={() => navigation.navigate('ActionList', { indicatorId: indicator.id })}
              icon={<Feather name="play-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />}
              fullWidth
            />
          </>
        )}
        
        {/* Texto explicativo para indicadores não primários */}
        {!isActionable(indicator.id) && (
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