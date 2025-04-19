// src/components/dashboard/MetricChart.tsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';
import { GraphData } from '@services/api/metricsService';

interface MetricChartProps {
  data: GraphData;
  title: string;
  color?: string;
  showLabels?: boolean;
}

const ChartContainer = styled(View)`
  margin-vertical: ${props => props.theme.spacing.md}px;
  border-radius: ${props => props.theme.roundness.md}px;
  background-color: ${props => props.theme.colors.card};
  padding: ${props => props.theme.spacing.md}px;
`;

const ChartTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

export const MetricChart: React.FC<MetricChartProps> = ({
  data,
  title,
  color,
  showLabels = true
}) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width - (theme.spacing.md * 4);
  
  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return (
      <ChartContainer theme={theme}>
        <ChartTitle theme={theme}>{title}</ChartTitle>
        <Text>Dados insuficientes para exibir o gráfico</Text>
      </ChartContainer>
    );
  }
  
  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: () => color || theme.colors.primary,
    labelColor: () => theme.colors.subtext,
    style: {
      borderRadius: theme.roundness.md
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: color || theme.colors.primary
    }
  };
  
  return (
    <ChartContainer theme={theme}>
      <ChartTitle theme={theme}>{title}</ChartTitle>
      <LineChart
        data={{
          labels: showLabels ? data.labels : [],
          datasets: data.datasets
        }}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: theme.spacing.sm,
          borderRadius: theme.roundness.md
        }}
      />
    </ChartContainer>
  );
};

export default MetricChart;