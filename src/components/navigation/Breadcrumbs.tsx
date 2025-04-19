// src/components/navigation/Breadcrumbs.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';
import { useNavigation } from '@react-navigation/native';

interface BreadcrumbItem {
  label: string;
  screen: string;
  params?: Record<string, any>;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Container = styled(ScrollView)`
  flex-direction: row;
  margin-top: ${props => props.theme.spacing.xs}px;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const BreadcrumbItemContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const BreadcrumbText = styled(Text)<{ isLast: boolean }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.isLast ? props.theme.colors.primary : props.theme.colors.subtext};
`;

const Separator = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
  margin-horizontal: ${props => props.theme.spacing.xs}px;
`;

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleItemPress = (item: BreadcrumbItem, index: number) => {
    if (index < items.length - 1) {
      navigation.navigate(item.screen as never, item.params as never);
    }
  };

  return (
    <Container 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={{ paddingRight: theme.spacing.md }}
      theme={theme}
    >
      {items.map((item, index) => (
        <BreadcrumbItemContainer key={index} theme={theme}>
          {index > 0 && <Separator theme={theme}>/</Separator>}
          <TouchableOpacity 
            onPress={() => handleItemPress(item, index)}
            disabled={index === items.length - 1}
          >
            <BreadcrumbText isLast={index === items.length - 1} theme={theme}>
              {item.label}
            </BreadcrumbText>
          </TouchableOpacity>
        </BreadcrumbItemContainer>
      ))}
    </Container>
  );
};

export default Breadcrumbs;