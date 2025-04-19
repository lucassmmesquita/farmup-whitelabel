// src/components/dashboard/TimeRangeFilter.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';
import { TimeRange } from '@services/api/metricsService';

interface TimeRangeFilterProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  options: { id: TimeRange; label: string }[];
}

const FilterContainer = styled(View)`
  flex-direction: row;
  background-color: ${props => `${props.theme.colors.primary}10`};
  border-radius: ${props => props.theme.roundness.full}px;
  padding: ${props => props.theme.spacing.xs}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const FilterOption = styled(TouchableOpacity)<{ isSelected: boolean }>`
  flex: 1;
  padding-vertical: ${props => props.theme.spacing.sm}px;
  background-color: ${props => props.isSelected ? props.theme.colors.primary : 'transparent'};
  border-radius: ${props => props.theme.roundness.full}px;
  align-items: center;
  justify-content: center;
`;

const OptionText = styled(Text)<{ isSelected: boolean }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.isSelected ? '#FFFFFF' : props.theme.colors.primary};
`;

export const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({
  selectedRange,
  onRangeChange,
  options
}) => {
  const theme = useTheme();
  
  return (
    <FilterContainer theme={theme}>
      {options.map(option => (
        <FilterOption
          key={option.id}
          isSelected={selectedRange === option.id}
          onPress={() => onRangeChange(option.id)}
          theme={theme}
        >
          <OptionText isSelected={selectedRange === option.id} theme={theme}>
            {option.label}
          </OptionText>
        </FilterOption>
      ))}
    </FilterContainer>
  );
};

export default TimeRangeFilter;