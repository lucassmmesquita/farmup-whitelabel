// src/components/dashboard/SellerSummaryCard.tsx (com texto maior)
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';
import { SellerSummary } from '@/types/sellers';
import { Button } from '@components/common/Button';

interface SellerSummaryCardProps {
  summary: SellerSummary;
  onViewAll: () => void;
}

const CardContainer = styled(View)`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.roundness.md}px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const CardHeader = styled(View)`
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const Title = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  color: ${props => props.theme.colors.text};
`;

const TableContainer = styled(View)`
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const TableHeader = styled(View)`
  flex-direction: row;
  padding-vertical: ${props => props.theme.spacing.xs}px;
  padding-horizontal: ${props => props.theme.spacing.xs}px;
`;

const HeaderCell = styled(View)<{ flex?: number; alignRight?: boolean }>`
  flex: ${props => props.flex || 1};
  justify-content: center;
  align-items: ${props => props.alignRight ? 'flex-end' : 'flex-start'};
`;

const HeaderText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
`;

const TableRow = styled(TouchableOpacity)`
  flex-direction: row;
  padding-vertical: ${props => props.theme.spacing.xs}px;
  padding-horizontal: ${props => props.theme.spacing.xs}px;
`;

const Cell = styled(View)<{ flex?: number; alignRight?: boolean }>`
  flex: ${props => props.flex || 1};
  justify-content: center;
  align-items: ${props => props.alignRight ? 'flex-end' : 'flex-start'};
`;

const CellText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
`;

const SellerNameText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  flex-shrink: 1;
`;

const TotalRow = styled(View)`
  flex-direction: row;
  padding-vertical: ${props => props.theme.spacing.xs}px;
  padding-horizontal: ${props => props.theme.spacing.xs}px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.colors.border};
`;

const TotalText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
`;

const ColorKey = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-vertical: ${props => props.theme.spacing.xs}px;
`;

const ColorLabel = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
`;

const ColorScale = styled(View)`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-horizontal: ${props => props.theme.spacing.xs}px;
`;

const ColorBlock = styled(View)<{ color: string }>`
  width: 25px;
  height: 15px;
  background-color: ${props => props.color};
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

const ViewMoreButton = styled(TouchableOpacity)`
  background-color: #4285f4;
  border-radius: ${props => props.theme.roundness.md}px;
  padding-vertical: ${props => props.theme.spacing.sm}px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: white;
  margin-left: ${props => props.theme.spacing.xs}px;
`;

const SellerSummaryCard: React.FC<SellerSummaryCardProps> = ({ summary, onViewAll }) => {
  const theme = useTheme();
  
  // Obter dados de todos os vendedores ordenados pelo nome
  const allSellers = Object.values(summary.sellers || {}).sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  // Calcular a média do UVC (para a linha de total)
  const totalUVC = allSellers.reduce((sum, seller) => sum + seller.metrics.uvc, 0);
  const avgUVC = allSellers.length > 0 ? totalUVC / allSellers.length : 0;
  
  // Valor da meta para UVC (fixo conforme a imagem)
  const targetUVC = 2.10;
  
  return (
    <CardContainer theme={theme}>
      <CardHeader theme={theme}>
        <Title theme={theme}>Vendedores</Title>
      </CardHeader>
      
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
      
      <TableContainer theme={theme}>
        <TableHeader theme={theme}>
          <HeaderCell theme={theme} flex={4}>
            <HeaderText theme={theme}>Vendedor</HeaderText>
          </HeaderCell>
          <HeaderCell theme={theme} flex={2} alignRight>
            <HeaderText theme={theme}>Realizad.</HeaderText>
          </HeaderCell>
          <HeaderCell theme={theme} flex={1.5} alignRight>
            <HeaderText theme={theme}>Meta</HeaderText>
          </HeaderCell>
          <HeaderCell theme={theme} flex={2.5} alignRight>
            <HeaderText theme={theme}>Diferença</HeaderText>
          </HeaderCell>
        </TableHeader>
        
        {allSellers.map((seller) => {
          const difference = seller.metrics.uvc - targetUVC;
          
          return (
            <TableRow key={seller.id} theme={theme} onPress={() => {}}>
              <Cell theme={theme} flex={4}>
                <SellerNameText theme={theme} numberOfLines={2}>
                  {seller.name}
                </SellerNameText>
              </Cell>
              <Cell theme={theme} flex={2} alignRight>
                <CellText theme={theme}>{seller.metrics.uvc.toFixed(2).replace('.', ',')}</CellText>
              </Cell>
              <Cell theme={theme} flex={1.5} alignRight>
                <CellText theme={theme}>{targetUVC.toFixed(1)}</CellText>
              </Cell>
              <Cell theme={theme} flex={2.5} alignRight>
                <DifferenceCell value={difference} theme={theme}>
                  <DifferenceText theme={theme}>
                    {difference.toFixed(2).replace('.', ',')}
                  </DifferenceText>
                </DifferenceCell>
              </Cell>
            </TableRow>
          );
        })}
        
        <TotalRow theme={theme}>
          <Cell theme={theme} flex={4}>
            <TotalText theme={theme}>Total</TotalText>
          </Cell>
          <Cell theme={theme} flex={2} alignRight>
            <TotalText theme={theme}>{avgUVC.toFixed(2).replace('.', ',')}</TotalText>
          </Cell>
          <Cell theme={theme} flex={1.5} alignRight>
            <TotalText theme={theme}>{targetUVC.toFixed(1)}</TotalText>
          </Cell>
          <Cell theme={theme} flex={2.5} alignRight>
            <DifferenceCell value={avgUVC - targetUVC} theme={theme}>
              <DifferenceText theme={theme}>
                {(avgUVC - targetUVC).toFixed(2).replace('.', ',')}
              </DifferenceText>
            </DifferenceCell>
          </Cell>
        </TotalRow>
      </TableContainer>
      
      <ViewMoreButton onPress={onViewAll} theme={theme}>
        <Feather name="users" size={18} color="white" />
        <ButtonText theme={theme}>Ver mais detalhes dos Vendedores</ButtonText>
      </ViewMoreButton>
    </CardContainer>
  );
};

export default SellerSummaryCard;