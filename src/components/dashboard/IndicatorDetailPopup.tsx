// src/components/dashboard/IndicatorDetailPopup.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';
import { Indicator } from '@/types/metrics';
import { Button } from '@components/common/Button';

interface IndicatorDetailPopupProps {
  indicator: Indicator | null;
  visible: boolean;
  onClose: () => void;
  onViewAction?: () => void;
}

const ModalContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled(View)`
  width: 90%;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.roundness.md}px;
  padding: ${props => props.theme.spacing.lg}px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const HeaderRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const Title = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.bold};
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const CloseButton = styled(TouchableOpacity)`
  padding: ${props => props.theme.spacing.xs}px;
`;

const Description = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const MetricRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const MetricLabel = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
`;

const MetricValue = styled(Text)<{ status?: string }>`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => {
    if (!props.status) return props.theme.colors.text;
    switch (props.status) {
      case 'above': return props.theme.colors.success;
      case 'below': return props.theme.colors.error;
      default: return props.theme.colors.text;
    }
  }};
`;

const StatusBadge = styled(View)<{ status?: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${props => {
    if (!props.status) return props.theme.colors.inactive + '20';
    switch (props.status) {
      case 'above': return props.theme.colors.success + '20';
      case 'below': return props.theme.colors.error + '20';
      default: return props.theme.colors.inactive + '20';
    }
  }};
  padding: ${props => props.theme.spacing.xs}px ${props => props.theme.spacing.sm}px;
  border-radius: ${props => props.theme.roundness.full}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const StatusText = styled(Text)<{ status?: string }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => {
    if (!props.status) return props.theme.colors.inactive;
    switch (props.status) {
      case 'above': return props.theme.colors.success;
      case 'below': return props.theme.colors.error;
      default: return props.theme.colors.inactive;
    }
  }};
  margin-left: ${props => props.theme.spacing.xs}px;
`;

const ButtonsContainer = styled(View)`
  margin-top: ${props => props.theme.spacing.md}px;
`;

const IndicatorDetailPopup: React.FC<IndicatorDetailPopupProps> = ({
  indicator,
  visible,
  onClose,
  onViewAction
}) => {
  const theme = useTheme();
  
  if (!indicator) return null;
  
  const getStatusIcon = (status?: string): keyof typeof Feather.glyphMap => {
    if (!status) return 'minus';
    switch (status) {
      case 'above': return 'trending-up';
      case 'below': return 'trending-down';
      default: return 'minus';
    }
  };
  
  const getStatusText = (status?: string): string => {
    if (!status) return 'Neutro';
    switch (status) {
      case 'above': return 'Acima da meta';
      case 'below': return 'Abaixo da meta';
      default: return 'Neutro';
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <ModalContainer>
        <ModalContent theme={theme}>
          <HeaderRow theme={theme}>
            <Title theme={theme}>{indicator.name}</Title>
            <CloseButton onPress={onClose} theme={theme}>
              <Feather name="x" size={24} color={theme.colors.text} />
            </CloseButton>
          </HeaderRow>
          
          <StatusBadge status={indicator.status} theme={theme}>
            <Feather 
              name={getStatusIcon(indicator.status)} 
              size={16} 
              color={
                indicator.status === 'above'
                  ? theme.colors.success
                  : indicator.status === 'below'
                    ? theme.colors.error
                    : theme.colors.inactive
              }
            />
            <StatusText status={indicator.status} theme={theme}>
              {getStatusText(indicator.status)}
            </StatusText>
          </StatusBadge>
          
          {indicator.description && (
            <Description theme={theme}>{indicator.description}</Description>
          )}
          
          <MetricRow theme={theme}>
            <MetricLabel theme={theme}>Realizado:</MetricLabel>
            <MetricValue theme={theme}>{indicator.formattedValue}</MetricValue>
          </MetricRow>
          
          <MetricRow theme={theme}>
            <MetricLabel theme={theme}>Meta:</MetricLabel>
            <MetricValue theme={theme}>{indicator.formattedTarget}</MetricValue>
          </MetricRow>
          
          <MetricRow theme={theme}>
            <MetricLabel theme={theme}>Variação:</MetricLabel>
            <MetricValue status={indicator.status} theme={theme}>
              <Feather 
                name={getStatusIcon(indicator.status)} 
                size={16}
                color={
                  indicator.status === 'above'
                    ? theme.colors.success
                    : indicator.status === 'below'
                      ? theme.colors.error
                      : theme.colors.inactive
                }
              /> {indicator.variation}
            </MetricValue>
          </MetricRow>
          
          <ButtonsContainer theme={theme}>
            {indicator.isPrimary && onViewAction && (
              <Button
                title="Ver plano de ação"
                onPress={onViewAction}
                icon={<Feather name="file-text" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />}
                fullWidth
              />
            )}
            
            <Button
              title="Ver detalhes completos"
              variant="outline"
              onPress={onClose}
              fullWidth
              style={{ marginTop: theme.spacing.sm }}
            />
          </ButtonsContainer>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default IndicatorDetailPopup;