// src/components/dashboard/MetricSelector.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';
import { Feather } from '@expo/vector-icons';

interface MetricOption {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

interface MetricSelectorProps {
  options: MetricOption[];
  selectedMetric: string;
  onMetricChange: (metricId: string) => void;
}

const SelectorContainer = styled(View)`
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const SelectorTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const OptionsScroll = styled(ScrollView)`
  padding-bottom: ${props => props.theme.spacing.sm}px;
`;

const MetricOption = styled(TouchableOpacity)<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacing.sm}px ${props => props.theme.spacing.md}px;
  background-color: ${props => props.isSelected ? props.theme.colors.primary : `${props.theme.colors.primary}10`};
  border-radius: ${props => props.theme.roundness.full}px;
  margin-right: ${props => props.theme.spacing.sm}px;
`;

const OptionText = styled(Text)<{ isSelected: boolean }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.isSelected ? '#FFFFFF' : props.theme.colors.primary};
  margin-left: ${props => props.theme.spacing.xs}px;
`;

// Atenção aqui: estamos usando export default agora
const MetricSelector: React.FC<MetricSelectorProps> = ({
  options,
  selectedMetric,
  onMetricChange
}) => {
  const theme = useTheme();
  
  return (
    <SelectorContainer theme={theme}>
      <SelectorTitle theme={theme}>Indicadores</SelectorTitle>
      <OptionsScroll
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: theme.spacing.sm }}
        theme={theme}
      >
        {options.map(option => (
          <MetricOption
            key={option.id}
            isSelected={selectedMetric === option.id}
            onPress={() => onMetricChange(option.id)}
            theme={theme}
          >
            <Feather
              name={option.icon}
              size={16}
              color={selectedMetric === option.id ? '#FFFFFF' : theme.colors.primary}
            />
            <OptionText isSelected={selectedMetric === option.id} theme={theme}>
              {option.label}
            </OptionText>
          </MetricOption>
        ))}
      </OptionsScroll>
    </SelectorContainer>
  );
};

export default MetricSelector;