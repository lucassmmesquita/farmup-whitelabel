// src/screens/sellers/SellersListScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { useTheme } from '@hooks/useTheme';
import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { TimeRange } from '@services/api/metricsService';
import TimeRangeFilter from '@components/dashboard/TimeRangeFilter';
import sellersService from '@services/api/sellersService';
import { useNavigation } from '@react-navigation/native';
import { Seller } from '@/types/sellers';

// Componentes estilizados
const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const FiltersContainer = styled(View)`
  padding: ${props => props.theme.spacing.md}px;
`;

const SortButtonsContainer = styled(View)`
  flex-direction: row;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const SortButton = styled(TouchableOpacity)<{ active: boolean }>`
  padding-vertical: ${props => props.theme.spacing.xs}px;
  padding-horizontal: ${props => props.theme.spacing.md}px;
  border-radius: ${props => props.theme.roundness.full}px;
  margin-right: ${props => props.theme.spacing.sm}px;
  background-color: ${props => props.active ? props.theme.colors.primary : `${props.theme.colors.primary}10`};
`;

const SortButtonText = styled(Text)<{ active: boolean }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.active ? '#FFFFFF' : props.theme.colors.primary};
`;

const TableContainer = styled(View)`
  margin-horizontal: ${props => props.theme.spacing.md}px;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.roundness.md}px;
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

const TableHeader = styled(View)`
  flex-direction: row;
  background-color: ${props => props.theme.colors.background};
  padding-vertical: ${props => props.theme.spacing.sm}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const HeaderCell = styled(View)<{ width: string; alignRight?: boolean }>`
  width: ${props => props.width};
  justify-content: center;
  align-items: ${props => props.alignRight ? 'flex-end' : 'flex-start'};
  padding-horizontal: ${props => props.theme.spacing.sm}px;
`;

const HeaderText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
`;

const TableRow = styled(TouchableOpacity)`
  flex-direction: row;
  padding-vertical: ${props => props.theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const Cell = styled(View)<{ width: string; alignRight?: boolean }>`
  width: ${props => props.width};
  justify-content: center;
  align-items: ${props => props.alignRight ? 'flex-end' : 'flex-start'};
  padding-horizontal: ${props => props.theme.spacing.sm}px;
`;

const CellText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
`;

const TotalRow = styled(View)`
  flex-direction: row;
  padding-vertical: ${props => props.theme.spacing.md}px;
  background-color: ${props => `${props.theme.colors.background}60`};
  border-top-width: 2px;
  border-top-color: ${props => props.theme.colors.border};
`;

const TotalText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.bold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
`;

const DifferenceCell = styled(View)<{ value: number }>`
  background-color: ${props => {
    const value = props.value;
    if (value <= -0.15) return '#c94a4a'; // Vermelho escuro
    if (value < 0) return '#e88e8e';      // Vermelho claro
    if (value < 0.15) return '#8ecfca';   // Verde claro
    return '#46b3aa';                     // Verde escuro
  }};
  padding-horizontal: ${props => props.theme.spacing.sm}px;
  padding-vertical: ${props => props.theme.spacing.xs}px;
  border-radius: ${props => props.theme.roundness.sm}px;
  align-items: center;
  justify-content: center;
  min-width: 60px;
`;

const DifferenceText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: white;
`;

const StatusIndicator = styled(View)<{ status: string }>`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${props => {
    switch (props.status) {
      case 'above_target': return props.theme.colors.success;
      case 'on_target': return props.theme.colors.primary;
      case 'below_target': return props.theme.colors.warning;
      case 'critical': return props.theme.colors.error;
      default: return props.theme.colors.inactive;
    }
  }};
  margin-right: ${props => props.theme.spacing.sm}px;
`;

const NameContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xl}px;
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

const ColorKey = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-vertical: ${props => props.theme.spacing.md}px;
  padding-horizontal: ${props => props.theme.spacing.md}px;
`;

const ColorLabel = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
`;

const ColorScale = styled(View)`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-horizontal: ${props => props.theme.spacing.md}px;
`;

const ColorBlock = styled(View)<{ color: string }>`
  width: 30px;
  height: 20px;
  background-color: ${props => props.color};
`;

// Tipos de ordenação
type SortType = 'revenue' | 'uvc' | 'avgTicket' | 'status';
type MetricType = 'uvc' | 'avgTicket' | 'revenue' | 'ticketCount';

export const SellersListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [sortBy, setSortBy] = useState<SortType>('uvc'); // Padrão UVC
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('uvc'); // Métrica selecionada
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Carregar vendedores
  useEffect(() => {
    const loadSellers = async () => {
      setLoading(true);
      try {
        const data = sellersService.getAllSellers(timeRange);
        setSellers(data);
      } catch (error) {
        console.error('Erro ao carregar dados de vendedores:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSellers();
  }, [timeRange]);
  
  // Ordenar vendedores
  const sortedSellers = React.useMemo(() => {
    if (!sellers.length) return [];
    
    return [...sellers].sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.metrics.revenue - a.metrics.revenue;
        case 'uvc':
          return b.metrics.uvc - a.metrics.uvc;
        case 'avgTicket':
          return b.metrics.avgTicket - a.metrics.avgTicket;
        case 'status':
          const statusPriority = {
            critical: 0,
            below_target: 1,
            on_target: 2,
            above_target: 3
          };
          return statusPriority[b.status] - statusPriority[a.status];
        default:
          return 0;
      }
    });
  }, [sellers, sortBy]);
  
  // Obter meta adequada para a métrica selecionada
  const getTargetForMetric = (metric: MetricType): number => {
    switch (metric) {
      case 'uvc':
        return 2.10; // Meta fixa de UVC conforme imagem
      case 'avgTicket':
        return 95.00;
      case 'revenue':
        return 12000;
      case 'ticketCount':
        return 140;
      default:
        return 0;
    }
  };
  
  // Obter o título da métrica selecionada
  const getMetricTitle = (metric: MetricType): string => {
    switch (metric) {
      case 'uvc':
        return 'UVC';
      case 'avgTicket':
        return 'Ticket Médio';
      case 'revenue':
        return 'Faturamento';
      case 'ticketCount':
        return 'Qtd. Cupons';
      default:
        return '';
    }
  };
  
  // Formatar o valor da métrica selecionada
  const formatMetricValue = (seller: Seller, metric: MetricType): string => {
    switch (metric) {
      case 'uvc':
        return seller.metrics.uvc.toFixed(2).replace('.', ',');
      case 'avgTicket':
        return `R$ ${seller.metrics.avgTicket.toFixed(2).replace('.', ',')}`;
      case 'revenue':
        return `R$ ${seller.metrics.revenue.toFixed(2).replace('.', ',')}`;
      case 'ticketCount':
        return seller.metrics.ticketCount.toString();
      default:
        return '';
    }
  };
  
  // Calcular a média da métrica selecionada
  const calculateAverageMetric = (): number => {
    if (!sellers.length) return 0;
    
    const sum = sellers.reduce((total, seller) => {
      switch (selectedMetric) {
        case 'uvc':
          return total + seller.metrics.uvc;
        case 'avgTicket':
          return total + seller.metrics.avgTicket;
        case 'revenue':
          return total + seller.metrics.revenue;
        case 'ticketCount':
          return total + seller.metrics.ticketCount;
        default:
          return total;
      }
    }, 0);
    
    return sum / sellers.length;
  };
  
  const handleSellerPress = (seller: Seller) => {
    navigation.navigate('SellerDetails', { sellerId: seller.id });
  };
  
  // Opções de período
  const timeRangeOptions = [
    { id: 'day', label: 'Hoje' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mês' }
  ];
  
  const target = getTargetForMetric(selectedMetric);
  const avgMetric = calculateAverageMetric();
  
  return (
    <Container theme={theme}>
      <AppHeader 
        title="Análise de Vendedores" 
        showBack
      />
      
      <FiltersContainer theme={theme}>
        <TimeRangeFilter
          selectedRange={timeRange}
          onRangeChange={setTimeRange}
          options={timeRangeOptions}
        />
        
        <SortButtonsContainer theme={theme}>
          <SortButton 
            active={selectedMetric === 'uvc'} 
            onPress={() => setSelectedMetric('uvc')}
            theme={theme}
          >
            <SortButtonText active={selectedMetric === 'uvc'} theme={theme}>
              UVC
            </SortButtonText>
          </SortButton>
          
          <SortButton 
            active={selectedMetric === 'avgTicket'} 
            onPress={() => setSelectedMetric('avgTicket')}
            theme={theme}
          >
            <SortButtonText active={selectedMetric === 'avgTicket'} theme={theme}>
              Ticket Médio
            </SortButtonText>
          </SortButton>
          
          <SortButton 
            active={selectedMetric === 'revenue'} 
            onPress={() => setSelectedMetric('revenue')}
            theme={theme}
          >
            <SortButtonText active={selectedMetric === 'revenue'} theme={theme}>
              Faturamento
            </SortButtonText>
          </SortButton>
          
          <SortButton 
            active={selectedMetric === 'ticketCount'} 
            onPress={() => setSelectedMetric('ticketCount')}
            theme={theme}
          >
            <SortButtonText active={selectedMetric === 'ticketCount'} theme={theme}>
              Cupons
            </SortButtonText>
          </SortButton>
        </SortButtonsContainer>
      </FiltersContainer>
      
      <ColorKey theme={theme}>
        <ColorLabel theme={theme}>Abaixo da meta</ColorLabel>
        <ColorScale theme={theme}>
          <ColorBlock color="#c94a4a" theme={theme} />
          <ColorBlock color="#e88e8e" theme={theme} />
          <ColorBlock color="#f2baba" theme={theme} />
          <ColorBlock color="#a3dbd7" theme={theme} />
          <ColorBlock color="#8ecfca" theme={theme} />
          <ColorBlock color="#46b3aa" theme={theme} />
        </ColorScale>
        <ColorLabel theme={theme}>Acima da</ColorLabel>
      </ColorKey>
      
      {loading ? (
        <LoadingContainer theme={theme}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingContainer>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <TableContainer theme={theme}>
            <TableHeader theme={theme}>
              <HeaderCell width="40%" theme={theme}>
                <HeaderText theme={theme}>Vendedor</HeaderText>
              </HeaderCell>
              <HeaderCell width="20%" theme={theme} alignRight>
                <HeaderText theme={theme}>Realizado</HeaderText>
              </HeaderCell>
              <HeaderCell width="20%" theme={theme} alignRight>
                <HeaderText theme={theme}>Meta</HeaderText>
              </HeaderCell>
              <HeaderCell width="20%" theme={theme} alignRight>
                <HeaderText theme={theme}>Diferença</HeaderText>
              </HeaderCell>
            </TableHeader>
            
            {sortedSellers.map((seller) => {
              let metricValue = 0;
              
              switch (selectedMetric) {
                case 'uvc':
                  metricValue = seller.metrics.uvc;
                  break;
                case 'avgTicket':
                  metricValue = seller.metrics.avgTicket;
                  break;
                case 'revenue':
                  metricValue = seller.metrics.revenue;
                  break;
                case 'ticketCount':
                  metricValue = seller.metrics.ticketCount;
                  break;
              }
              
              const difference = metricValue - target;
              const normalizedDiff = selectedMetric === 'uvc' 
                ? difference 
                : difference / target; // Normalizar para escala percentual
              
              return (
                <TableRow 
                  key={seller.id}
                  onPress={() => handleSellerPress(seller)}
                  theme={theme}
                >
                  <Cell width="40%" theme={theme}>
                    <NameContainer>
                      <StatusIndicator status={seller.status} theme={theme} />
                      <CellText theme={theme}>{seller.name}</CellText>
                    </NameContainer>
                  </Cell>
                  <Cell width="20%" theme={theme} alignRight>
                    <CellText theme={theme}>
                      {formatMetricValue(seller, selectedMetric)}
                    </CellText>
                  </Cell>
                  <Cell width="20%" theme={theme} alignRight>
                    <CellText theme={theme}>
                      {selectedMetric === 'uvc' 
                        ? target.toFixed(2).replace('.', ',')
                        : selectedMetric === 'revenue' || selectedMetric === 'avgTicket'
                          ? `R$ ${target.toFixed(2).replace('.', ',')}`
                          : target.toString()
                      }
                    </CellText>
                  </Cell>
                  <Cell width="20%" theme={theme} alignRight>
                    <DifferenceCell 
                      value={selectedMetric === 'uvc' ? difference : normalizedDiff}
                      theme={theme}
                    >
                      <DifferenceText theme={theme}>
                        {selectedMetric === 'uvc'
                          ? difference.toFixed(2).replace('.', ',')
                          : selectedMetric === 'revenue' || selectedMetric === 'avgTicket'
                            ? `R$ ${difference.toFixed(2).replace('.', ',')}`
                            : difference.toString()
                        }
                      </DifferenceText>
                    </DifferenceCell>
                  </Cell>
                </TableRow>
              );
            })}
            
            <TotalRow theme={theme}>
              <Cell width="40%" theme={theme}>
                <TotalText theme={theme}>Total</TotalText>
              </Cell>
              <Cell width="20%" theme={theme} alignRight>
                <TotalText theme={theme}>
                  {selectedMetric === 'uvc' 
                    ? avgMetric.toFixed(2).replace('.', ',')
                    : selectedMetric === 'revenue' || selectedMetric === 'avgTicket'
                      ? `R$ ${avgMetric.toFixed(2).replace('.', ',')}`
                      : Math.round(avgMetric).toString()
                  }
                </TotalText>
              </Cell>
              <Cell width="20%" theme={theme} alignRight>
                <TotalText theme={theme}>
                  {selectedMetric === 'uvc' 
                    ? target.toFixed(2).replace('.', ',')
                    : selectedMetric === 'revenue' || selectedMetric === 'avgTicket'
                      ? `R$ ${target.toFixed(2).replace('.', ',')}`
                      : target.toString()
                  }
                </TotalText>
              </Cell>
              <Cell width="20%" theme={theme} alignRight>
                <DifferenceCell 
                  value={selectedMetric === 'uvc' ? (avgMetric - target) : (avgMetric - target) / target}
                  theme={theme}
                >
                  <DifferenceText theme={theme}>
                    {selectedMetric === 'uvc'
                      ? (avgMetric - target).toFixed(2).replace('.', ',')
                      : selectedMetric === 'revenue' || selectedMetric === 'avgTicket'
                        ? `R$ ${(avgMetric - target).toFixed(2).replace('.', ',')}`
                        : Math.round(avgMetric - target).toString()
                    }
                  </DifferenceText>
                </DifferenceCell>
              </Cell>
            </TotalRow>
          </TableContainer>
        </ScrollView>
      )}
    </Container>
  );
};

export default SellersListScreen;