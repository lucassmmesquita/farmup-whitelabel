// src/screens/sellers/SellerDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { useTheme } from '@hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import styled from 'styled-components/native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import sellersService from '@services/api/sellersService';
import { Seller } from '@/types/sellers';

type RouteParams = {
  SellerDetails: {
    sellerId: string;
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

const ProfileSection = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

const AvatarContainer = styled(View)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${props => props.theme.colors.inactive + '30'};
  justify-content: center;
  align-items: center;
  margin-right: ${props => props.theme.spacing.xl}px;
  overflow: hidden;
`;

const Avatar = styled(Image)`
  width: 80px;
  height: 80px;
`;

const ProfileInfo = styled(View)`
  flex: 1;
`;

const SellerName = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.bold};
  font-size: ${props => props.theme.typography.fontSize.xl}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const StatusBadge = styled(View)<{ status: string }>`
  background-color: ${props => {
    switch (props.status) {
      case 'above_target': return `${props.theme.colors.success}15`;
      case 'on_target': return `${props.theme.colors.primary}15`;
      case 'below_target': return `${props.theme.colors.warning}15`;
      case 'critical': return `${props.theme.colors.error}15`;
      default: return `${props.theme.colors.inactive}15`;
    }
  }};
  padding-horizontal: ${props => props.theme.spacing.sm}px;
  padding-vertical: ${props => props.theme.spacing.xs / 2}px;
  border-radius: ${props => props.theme.roundness.full}px;
  align-self: flex-start;
`;

const StatusText = styled(Text)<{ status: string }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => {
    switch (props.status) {
      case 'above_target': return props.theme.colors.success;
      case 'on_target': return props.theme.colors.primary;
      case 'below_target': return props.theme.colors.warning;
      case 'critical': return props.theme.colors.error;
      default: return props.theme.colors.inactive;
    }
  }};
`;

const SectionTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md}px;
  margin-top: ${props => props.theme.spacing.lg}px;
`;

const MetricsGrid = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const MetricCard = styled(Card)`
  width: 48%;
  margin-bottom: ${props => props.theme?.spacing?.xl || 32}px;
`;

const MetricCardContent = styled(View)`
  padding: ${props => props.theme.spacing.md}px;
  align-items: center;
`;

const MetricLabel = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const MetricValue = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.bold};
  font-size: ${props => props.theme.typography.fontSize.xl}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const MetricTrend = styled(Text)<{ trend: string }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => {
    switch (props.trend) {
      case 'up': return props.theme.colors.success;
      case 'down': return props.theme.colors.error;
      default: return props.theme.colors.subtext;
    }
  }};
`;

const ChartContainer = styled(View)`
  margin-top: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.xl}px;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.roundness.md}px;
  padding: ${props => props.theme.spacing.md}px;
  overflow: hidden;
`;

const ChartTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md}px;
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

const ActionPlanCard = styled(TouchableOpacity)`
  background-color: ${props => `${props.theme.colors.warning}15`};
  border-radius: ${props => props.theme.roundness.md}px;
  padding: ${props => props.theme.spacing.md}px;
  margin-vertical: ${props => props.theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
`;

const ActionPlanIcon = styled(View)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => `${props.theme.colors.warning}30`};
  justify-content: center;
  align-items: center;
  margin-right: ${props => props.theme.spacing.md}px;
`;

const ActionPlanContent = styled(View)`
  flex: 1;
`;

const ActionPlanTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const ActionPlanDescription = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
`;

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const InfoText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.subtext};
  margin-top: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

export const SellerDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<RouteParams, 'SellerDetails'>>();
  const navigation = useNavigation();
  const { sellerId } = route.params;
  const screenWidth = Dimensions.get('window').width - (theme.spacing.md * 2);
  
  const [seller, setSeller] = useState<Seller | null>(null);
  const [actionPlan, setActionPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [historyPeriod, setHistoryPeriod] = useState(7);
  const [historyData, setHistoryData] = useState<any | null>(null);
  
  useEffect(() => {
    const loadSellerData = async () => {
      setLoading(true);
      try {
        // Carregar dados do vendedor
        const sellerData = sellersService.getSellerById(sellerId);
        if (sellerData) {
          setSeller(sellerData);
          
          // Carregar plano de ação se existir
          if (sellerData.actionPlanId) {
            const plan = sellersService.getSellerActionPlan(sellerData.id);
            setActionPlan(plan);
          }
          
          // Carregar histórico
          const history = sellersService.getSellerHistory(sellerData.id, historyPeriod);
          setHistoryData(history);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do vendedor:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSellerData();
  }, [sellerId, historyPeriod]);
  
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'above_target': return 'Acima da meta';
      case 'on_target': return 'Na meta';
      case 'below_target': return 'Abaixo da meta';
      case 'critical': return 'Performance crítica';
      default: return 'Status desconhecido';
    }
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
  
  const handleActionPlanPress = () => {
    if (actionPlan) {
      navigation.navigate('ActionPlanDetails', { actionId: actionPlan.id });
    }
  };
  
  if (loading) {
    return (
      <Container theme={theme}>
        <AppHeader title="Detalhes do Vendedor" showBack />
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingContainer>
      </Container>
    );
  }
  
  if (!seller) {
    return (
      <Container theme={theme}>
        <AppHeader title="Detalhes do Vendedor" showBack />
        <LoadingContainer>
          <Text>Vendedor não encontrado</Text>
        </LoadingContainer>
      </Container>
    );
  }
  
  const formattedMetrics = sellersService.formatSellerMetrics(seller);
  
  return (
    <Container theme={theme}>
      <AppHeader 
        title="Detalhes do Vendedor" 
        showBack
      />
      
      <ContentContainer theme={theme}>
        <ProfileSection theme={theme}>
          <AvatarContainer theme={theme}>
            {seller.avatar ? (
              <Avatar source={{ uri: seller.avatar }} />
            ) : (
              <Feather name="user" size={40} color={theme.colors.inactive} />
            )}
          </AvatarContainer>
          
          <ProfileInfo>
            <SellerName theme={theme}>{seller.name}</SellerName>
            <StatusBadge status={seller.status} theme={theme}>
              <StatusText status={seller.status} theme={theme}>
                {getStatusLabel(seller.status)}
              </StatusText>
            </StatusBadge>
          </ProfileInfo>
        </ProfileSection>
        
        <InfoText theme={theme}>
          {seller.status === 'above_target' && `Vendedor com excelente performance. Está acima da meta há ${seller.daysOnTarget} dias consecutivos.`}
          {seller.status === 'on_target' && `Vendedor com boa performance. Está na meta ou acima dela há ${seller.daysOnTarget} dias.`}
          {seller.status === 'below_target' && `Vendedor com performance abaixo do esperado. Está abaixo da meta há ${seller.daysOffTarget} dias.`}
          {seller.status === 'critical' && `Vendedor com performance crítica. Está significativamente abaixo da meta há ${seller.daysOffTarget} dias consecutivos.`}
        </InfoText>
        
        <SectionTitle theme={theme}>Métricas Atuais</SectionTitle>
        
        <MetricsGrid>
          <MetricCard elevation="light">
            <MetricCardContent theme={theme}>
              <MetricLabel theme={theme}>Faturamento</MetricLabel>
              <MetricValue theme={theme}>{formattedMetrics.revenue}</MetricValue>
              <MetricTrend theme={theme} trend={seller.trend}>
                <Feather 
                  name={seller.trend === 'up' ? 'trending-up' : seller.trend === 'down' ? 'trending-down' : 'minus'} 
                  size={14}
                /> {seller.trend === 'up' ? '+12%' : seller.trend === 'down' ? '-8%' : '0%'}
              </MetricTrend>
            </MetricCardContent>
          </MetricCard>
          
          <MetricCard elevation="light">
            <MetricCardContent theme={theme}>
              <MetricLabel theme={theme}>UVC</MetricLabel>
              <MetricValue theme={theme}>{formattedMetrics.uvc}</MetricValue>
              <MetricTrend theme={theme} trend={seller.trend}>
                <Feather 
                  name={seller.trend === 'up' ? 'trending-up' : seller.trend === 'down' ? 'trending-down' : 'minus'} 
                  size={14}
                /> {seller.trend === 'up' ? '+10%' : seller.trend === 'down' ? '-5%' : '0%'}
              </MetricTrend>
            </MetricCardContent>
          </MetricCard>
          
          <MetricCard elevation="light">
            <MetricCardContent theme={theme}>
              <MetricLabel theme={theme}>Ticket Médio</MetricLabel>
              <MetricValue theme={theme}>{formattedMetrics.avgTicket}</MetricValue>
              <MetricTrend theme={theme} trend={seller.trend}>
                <Feather 
                  name={seller.trend === 'up' ? 'trending-up' : seller.trend === 'down' ? 'trending-down' : 'minus'} 
                  size={14}
                /> {seller.trend === 'up' ? '+7%' : seller.trend === 'down' ? '-3%' : '0%'}
              </MetricTrend>
            </MetricCardContent>
          </MetricCard>
          
          <MetricCard elevation="light">
            <MetricCardContent theme={theme}>
              <MetricLabel theme={theme}>Qtd. Cupons</MetricLabel>
              <MetricValue theme={theme}>{formattedMetrics.ticketCount}</MetricValue>
              <MetricTrend theme={theme} trend={seller.trend}>
                <Feather 
                  name={seller.trend === 'up' ? 'trending-up' : seller.trend === 'down' ? 'trending-down' : 'minus'} 
                  size={14}
                /> {seller.trend === 'up' ? '+15%' : seller.trend === 'down' ? '-10%' : '0%'}
              </MetricTrend>
            </MetricCardContent>
          </MetricCard>
        </MetricsGrid>
        
        <SectionTitle theme={theme}>Evolução no Período</SectionTitle>
        
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
        
        {historyData && (
          <>
            <ChartContainer theme={theme}>
              <ChartTitle theme={theme}>Faturamento</ChartTitle>
              <LineChart
                data={{
                  labels: historyData.dates.map(formatDate),
                  datasets: [
                    {
                      data: historyData.metrics.revenue,
                      color: () => theme.colors.primary,
                      strokeWidth: 2
                    }
                  ]
                }}
                width={screenWidth - theme.spacing.md * 2}
                height={200}
                chartConfig={chartConfig}
                bezier
                style={{ borderRadius: theme.roundness.md }}
              />
            </ChartContainer>
            
            <ChartContainer theme={theme}>
              <ChartTitle theme={theme}>UVC</ChartTitle>
              <LineChart
                data={{
                  labels: historyData.dates.map(formatDate),
                  datasets: [
                    {
                      data: historyData.metrics.uvc,
                      color: () => theme.colors.primary,
                      strokeWidth: 2
                    }
                  ]
                }}
                width={screenWidth - theme.spacing.md * 2}
                height={200}
                chartConfig={chartConfig}
                bezier
                style={{ borderRadius: theme.roundness.md }}
              />
            </ChartContainer>
          </>
        )}
        
        {actionPlan && (
          <>
            <SectionTitle theme={theme}>Plano de Ação Recomendado</SectionTitle>
            
            <ActionPlanCard onPress={handleActionPlanPress} theme={theme}>
              <ActionPlanIcon theme={theme}>
                <Feather name="target" size={20} color={theme.colors.warning} />
              </ActionPlanIcon>
              
              <ActionPlanContent>
                <ActionPlanTitle theme={theme}>{actionPlan.title}</ActionPlanTitle>
                <ActionPlanDescription theme={theme}>{actionPlan.description}</ActionPlanDescription>
              </ActionPlanContent>
              
              <Feather name="chevron-right" size={20} color={theme.colors.subtext} />
            </ActionPlanCard>
            
            <Button 
              title="Ver plano de ação detalhado" 
              onPress={handleActionPlanPress} 
              fullWidth
              icon={<Feather name="clipboard" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />}
            />
          </>
        )}
        
        {(seller.status === 'below_target' || seller.status === 'critical') && !actionPlan && (
          <>
            <SectionTitle theme={theme}>Recomendação</SectionTitle>
            
            <Button 
              title="Criar plano de ação para este vendedor" 
              variant="outline"
              onPress={() => {}} 
              fullWidth
              icon={<Feather name="plus-circle" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />}
            />
          </>
        )}
      </ContentContainer>
    </Container>
  );
};

export default SellerDetailsScreen;