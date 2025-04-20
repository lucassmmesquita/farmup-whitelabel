// src/screens/dashboard/IndicatorDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity, 
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

// Definir tipos para a navegação e a rota
type IndicatorDetailsRouteProp = RouteProp<DashboardStackParamList, 'IndicatorDetails'>;
type IndicatorDetailsNavigationProp = StackNavigationProp<DashboardStackParamList, 'IndicatorDetails'>;


type RouteParams = {
  IndicatorDetails: {
    indicator: Indicator;
  };
};

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

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

const FlowTypeTag = styled(View)`
  background-color: ${props => props.theme.colors.primary}15;
  padding-horizontal: ${props => props.theme.spacing.md}px;
  padding-vertical: ${props => props.theme.spacing.xs}px;
  border-radius: ${props => props.theme.roundness.full}px;
  align-self: flex-start;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const FlowTypeText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.primary};
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
  
  const getFlowTypeLabel = (flowType?: string) => {
    switch(flowType) {
      case 'faturamento': return 'Diagnóstico por Faturamento';
      case 'cupom': return 'Diagnóstico por Cupom';
      default: return 'Diagnóstico';
    }
  };
  
  // Obter texto explicativo específico por indicador
  const getIndicatorExplanation = (indicator: Indicator) => {
    const explanations: {[key: string]: string} = {
      // Fluxo de Faturamento
      'faturamento': 'O faturamento total da loja é influenciado pelo ticket médio multiplicado pelo número de cupons emitidos. Para melhorar esse indicador, foque nas ações recomendadas para ticket médio.',
      'ticketMedio': 'O Ticket Médio é um indicador composto, resultante da multiplicação de UVC (unidades por cupom) e Preço Médio. Para melhorar este indicador, foque nas ações recomendadas para UVC e Preço Médio.',
      'uvc': 'A Unidade Vendida por Cliente (UVC) representa quantos itens cada cliente leva em média. É influenciada diretamente pela aderência ao estoque ideal e pela proporção de genéricos versus referência.',
      'precoMedio': 'O Preço Médio é o valor médio dos produtos vendidos. É influenciado principalmente pelo índice de competitividade em relação ao mercado local.',
      'aderenciaEstoque': 'A Aderência ao Estoque Ideal mede quanto o estoque atual está alinhado com o mix ideal para produtos recorrentes. Melhorar esse indicador pode aumentar significativamente o UVC.',
      'proporcaoGenericos': 'A Proporção entre Medicamentos Genéricos e de Referência afeta diretamente o UVC. Oferecer opções de genéricos pode aumentar a quantidade de itens que o cliente adquire.',
      'indiceCompetitividade': 'O Índice de Competitividade compara os preços praticados com os do mercado local. Um índice maior significa preços mais atraentes em relação à concorrência.',
      
      // Fluxo de Cupom
      'qtdCupons': 'A quantidade de cupons emitidos é influenciada pelo fluxo de pessoas na loja e pela taxa de conversão. Melhorar esses dois indicadores aumentará o número de vendas realizadas.',
      'fluxoPessoas': 'O fluxo de pessoas representa quantos clientes entram na loja. É o primeiro passo do funil de vendas e pode ser melhorado com ações de marketing local.',
      'taxaConversao': 'A taxa de conversão mede quantos entrantes efetivamente realizaram compras. É influenciada por diversos fatores operacionais como sortimento, ruptura e disponibilidade de PBM.',
      'entrantes': 'Representa as pessoas que entram na loja, classificadas em segmentos específicos. Conhecer esses públicos permite estratégias direcionadas.',
      'cronicos': 'Os clientes crônicos são aqueles que buscam medicamentos de uso contínuo. Representam uma oportunidade de fidelização e aumento de receita recorrente.',
      'idosos': 'Os clientes idosos são identificados pela IA de câmeras. São um público importante que requer estratégias específicas de atendimento e acessibilidade.',
      'percentualSortimento': 'O percentual de sortimento mede o quanto o mix de produtos está adequado ao perfil da loja. Um sortimento otimizado aumenta a taxa de conversão.',
      'deixeiDeVender': 'O indicador "Deixei de Vender" mede as vendas perdidas por diversos motivos. Reduzir esse percentual impacta diretamente a taxa de conversão.',
      'percentualRuptura': 'O percentual de ruptura indica produtos indisponíveis devido à falta de estoque. Reduzir a ruptura melhora a taxa de conversão e a satisfação dos clientes.',
      'disponibilidadePBM': 'A disponibilidade de Programas de Benefício em Medicamentos (PBM) afeta a decisão de compra. Ampliar a cobertura de PBMs aumenta a conversão.',
      'conversaoPBM': 'A conversão de produtos PBM mede o sucesso na oferta desses programas aos clientes elegíveis. Melhorar esse processo aumenta as vendas com benefícios.'
    };
    
    return explanations[indicator.id] || indicator.description || '';
  };
  
  if (loading) {
    return (
      <Container theme={theme}>
        <AppHeader 
          title={indicator.name}
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
        title={indicator.name}
        showBack
      />
      
      <ContentContainer theme={theme}>
        {/* Tag do tipo de fluxo */}
        {indicator.flowType && (
          <FlowTypeTag theme={theme}>
            <FlowTypeText theme={theme}>
              {getFlowTypeLabel(indicator.flowType)}
            </FlowTypeText>
          </FlowTypeTag>
        )}
        
        {/* Card principal do indicador */}
        <IndicatorCard 
          indicator={indicator}
          onPress={() => {}}
          size="large"
        />
        
        <InfoText theme={theme}>
          {getIndicatorExplanation(indicator)}
        </InfoText>
        
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
        
        {/* Explicações para diferentes tipos de indicadores */}
        {!isActionable(indicator.id) && indicator.id === 'ticketMedio' && (
          <>
            <SectionTitle theme={theme}>Análise Causal</SectionTitle>
            <InfoText theme={theme}>
              O Ticket Médio é um indicador composto, resultante da multiplicação de UVC (unidades por cupom) e Preço Médio. 
              Para melhorar este indicador, foque nas ações recomendadas para UVC e Preço Médio.
            </InfoText>
          </>
        )}
        
        {!isActionable(indicator.id) && indicator.id === 'faturamento' && (
          <>
            <SectionTitle theme={theme}>Análise Causal</SectionTitle>
            <InfoText theme={theme}>
              O Faturamento é influenciado diretamente pela quantidade de cupons e pelo ticket médio. 
              Analise esses indicadores para identificar oportunidades de melhoria.
            </InfoText>
          </>
        )}
        
        {!isActionable(indicator.id) && indicator.id === 'qtdCupons' && (
          <>
            <SectionTitle theme={theme}>Análise Causal</SectionTitle>
            <InfoText theme={theme}>
              A quantidade de cupons emitidos é influenciada pelo fluxo de pessoas na loja e pela taxa de conversão. 
              Melhorar esses dois indicadores aumentará o número de vendas realizadas.
            </InfoText>
          </>
        )}
        
        {!isActionable(indicator.id) && indicator.id !== 'faturamento' && indicator.id !== 'ticketMedio' && indicator.id !== 'qtdCupons' && (
          <>
            <SectionTitle theme={theme}>Análise Causal</SectionTitle>
            <InfoText theme={theme}>
              Este indicador não possui ações diretas recomendadas. Analise os indicadores relacionados 
              para identificar oportunidades de melhoria.
            </InfoText>
          </>
        )}
      </ContentContainer>
    </Container>
  );
};

export default IndicatorDetailsScreen;