// src/components/dashboard/RecommendationCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';

interface RecommendationCardProps {
  recommendation: {
    id: string;
    title: string;
    description: string;
    impact: string;
    icon: string;
    action: string;
  };
  onPress: () => void;
}

const CardContainer = styled(View)`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.roundness.md}px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
  elevation: 2;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
`;

const CardHeader = styled(View)`
  flex-direction: row;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const IconContainer = styled(View)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => `${props.theme.colors.primary}15`};
  justify-content: center;
  align-items: center;
  margin-right: ${props => props.theme.spacing.md}px;
`;

const ContentContainer = styled(View)`
  flex: 1;
`;

const Title = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const Description = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
`;

const ImpactContainer = styled(View)`
  background-color: ${props => `${props.theme.colors.success}10`};
  padding: ${props => props.theme.spacing.sm}px;
  border-radius: ${props => props.theme.roundness.sm}px;
  margin-vertical: ${props => props.theme.spacing.sm}px;
`;

const ImpactText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.success};
`;

const ActionButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.roundness.md}px;
  padding-vertical: ${props => props.theme.spacing.sm}px;
  padding-horizontal: ${props => props.theme.spacing.md}px;
  align-items: center;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const ActionText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: white;
`;

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onPress
}) => {
  const theme = useTheme();
  
  return (
    <CardContainer theme={theme}>
      <CardHeader theme={theme}>
        <IconContainer theme={theme}>
          <Feather 
            name={recommendation.icon as any} 
            size={20} 
            color={theme.colors.primary} 
          />
        </IconContainer>
        <ContentContainer>
          <Title theme={theme}>{recommendation.title}</Title>
          <Description theme={theme}>{recommendation.description}</Description>
        </ContentContainer>
      </CardHeader>
      
      <ImpactContainer theme={theme}>
        <ImpactText theme={theme}>
          <Feather name="trending-up" size={14} color={theme.colors.success} /> {recommendation.impact}
        </ImpactText>
      </ImpactContainer>
      
      <ActionButton onPress={onPress} theme={theme}>
        <ActionText theme={theme}>{recommendation.action}</ActionText>
      </ActionButton>
    </CardContainer>
  );
};

export default RecommendationCard;