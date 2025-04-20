// src/components/dashboard/CameraAIInsight.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { Card } from '@components/common/Card';

interface CameraAIInsightProps {
  title: string;
  value: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  peopleCount?: number;
  imageSource?: any;
}

const Container = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const ContentContainer = styled(View)`
  padding: ${props => props.theme.spacing.md}px;
`;

const HeaderRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const Title = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
`;

const AITag = styled(View)`
  background-color: ${props => `${props.theme.colors.secondary}15`};
  border-radius: ${props => props.theme.roundness.sm}px;
  padding-horizontal: ${props => props.theme.spacing.sm}px;
  padding-vertical: ${props => props.theme.spacing.xs / 2}px;
`;

const AITagText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.secondary};
`;

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const MetricColumn = styled(View)`
  flex: 1;
`;

const ValueText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.bold};
  font-size: ${props => props.theme.typography.fontSize.xl}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const TrendContainer = styled(View)<{ trend: 'up' | 'down' | 'neutral' }>`
  flex-direction: row;
  align-items: center;
  background-color: ${props => {
    switch (props.trend) {
      case 'up': return `${props.theme.colors.success}15`;
      case 'down': return `${props.theme.colors.error}15`;
      default: return `${props.theme.colors.inactive}15`;
    }
  }};
  padding-horizontal: ${props => props.theme.spacing.sm}px;
  padding-vertical: ${props => props.theme.spacing.xs}px;
  border-radius: ${props => props.theme.roundness.sm}px;
  align-self: flex-start;
`;

const TrendText = styled(Text)<{ trend: 'up' | 'down' | 'neutral' }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => {
    switch (props.trend) {
      case 'up': return props.theme.colors.success;
      case 'down': return props.theme.colors.error;
      default: return props.theme.colors.inactive;
    }
  }};
  margin-left: ${props => props.theme.spacing.xs}px;
`;

const ImageContainer = styled(View)`
  width: 120px;
  height: 80px;
  border-radius: ${props => props.theme.roundness.md}px;
  background-color: ${props => props.theme.colors.card};
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const CountText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
  margin-top: ${props => props.theme.spacing.sm}px;
`;

const PeopleIcon = styled(View)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${props => `${props.theme.colors.primary}15`};
  justify-content: center;
  align-items: center;
  margin-right: ${props => props.theme.spacing.sm}px;
`;

const CameraAIInsight: React.FC<CameraAIInsightProps> = ({
  title,
  value,
  trend,
  trendValue,
  peopleCount,
  imageSource
}) => {
  const theme = useTheme();
  
  return (
    <Container elevation="light" theme={theme}>
      <ContentContainer theme={theme}>
        <HeaderRow theme={theme}>
          <Title theme={theme}>{title}</Title>
          <AITag theme={theme}>
            <AITagText theme={theme}>IA de Câmeras</AITagText>
          </AITag>
        </HeaderRow>
        
        <Row theme={theme}>
          <MetricColumn theme={theme}>
            <ValueText theme={theme}>{value}</ValueText>
            <TrendContainer trend={trend} theme={theme}>
              <Feather 
                name={trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'minus'} 
                size={14} 
                color={
                  trend === 'up' 
                    ? theme.colors.success 
                    : trend === 'down' 
                      ? theme.colors.error 
                      : theme.colors.inactive
                } 
              />
              <TrendText trend={trend} theme={theme}>{trendValue}</TrendText>
            </TrendContainer>
            
            {peopleCount !== undefined && (
              <Row theme={theme} style={{ marginTop: theme.spacing.md }}>
                <PeopleIcon theme={theme}>
                  <Feather name="users" size={14} color={theme.colors.primary} />
                </PeopleIcon>
                <CountText theme={theme}>{peopleCount} pessoas detectadas hoje</CountText>
              </Row>
            )}
          </MetricColumn>
          
          {imageSource && (
            <ImageContainer theme={theme}>
              <Image 
                source={imageSource} 
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }} 
              />
            </ImageContainer>
          )}
        </Row>
      </ContentContainer>
    </Container>
  );
};

export default CameraAIInsight;