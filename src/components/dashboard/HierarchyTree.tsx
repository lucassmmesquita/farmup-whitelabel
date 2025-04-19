// src/components/dashboard/HierarchyTree.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';
import { Indicator } from '@/types/metrics';
import IndicatorCard from './IndicatorCard';
import Svg, { Line } from 'react-native-svg';

interface HierarchyTreeProps {
  indicatorTree: {
    indicators: Indicator[];
    relations: {
      sourceId: string;
      targetId: string;
      impact: number;
    }[];
  };
  onSelectIndicator: (indicator: Indicator) => void;
}

const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

const TreeContainer = styled(View)`
  padding: ${props => props.theme.spacing.md}px;
`;

const LevelContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.xl}px;
  position: relative;
`;

const IndicatorContainer = styled(View)`
  flex: 1;
  margin-horizontal: ${props => props.theme.spacing.xs}px;
`;

const SectionTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md}px;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const ConnectionsContainer = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
`;

export const HierarchyTree: React.FC<HierarchyTreeProps> = ({
  indicatorTree,
  onSelectIndicator
}) => {
  const theme = useTheme();
  
  // Organizar indicadores por níveis
  const getRootIndicators = () => {
    return indicatorTree.indicators.filter(i => !i.parentId);
  };
  
  const getChildrenByParentId = (parentId: string) => {
    return indicatorTree.indicators.filter(i => i.parentId === parentId);
  };
  
  // Encontrar um indicador pelo ID
  const getIndicatorById = (id: string) => {
    return indicatorTree.indicators.find(i => i.id === id);
  };

  // Encontrar todos os indicadores que impactam um determinado indicador
  const getImpactingIndicators = (targetId: string) => {
    const relationships = indicatorTree.relations.filter(r => r.targetId === targetId);
    return relationships.map(r => getIndicatorById(r.sourceId)).filter(Boolean) as Indicator[];
  };
  
  // Renderizar uma visualização hierárquica
  return (
    <Container theme={theme}>
      <ScrollContainer>
        <TreeContainer theme={theme}>
          <SectionTitle theme={theme}>Árvore de Diagnóstico</SectionTitle>
          
          {/* Nível 1: Faturamento (Topo da hierarquia) */}
          <LevelContainer theme={theme}>
            {getRootIndicators().map(indicator => (
              <IndicatorContainer key={indicator.id} theme={theme}>
                <IndicatorCard 
                  indicator={indicator}
                  onPress={onSelectIndicator}
                  size="large"
                />
              </IndicatorContainer>
            ))}
          </LevelContainer>
          
          {/* Nível 2: Tickey Médio e Qtd Cupons (Nível do meio) */}
          <LevelContainer theme={theme}>
            {getRootIndicators().length > 0 && 
              getRootIndicators().flatMap(root => 
                getImpactingIndicators(root.id).map(indicator => (
                  <IndicatorContainer key={indicator.id} theme={theme}>
                    <IndicatorCard 
                      indicator={indicator}
                      onPress={onSelectIndicator}
                      size="medium"
                    />
                  </IndicatorContainer>
                ))
            )}
          </LevelContainer>
          
          {/* Nível 3: UVC e Preço Médio (Último nível - indicadores primários) */}
          <LevelContainer theme={theme}>
            {getRootIndicators().length > 0 && 
              getRootIndicators().flatMap(root => 
                getImpactingIndicators(root.id).flatMap(level2 =>
                  getImpactingIndicators(level2.id).map(indicator => (
                    <IndicatorContainer key={indicator.id} theme={theme}>
                      <IndicatorCard 
                        indicator={indicator}
                        onPress={onSelectIndicator}
                        size="medium"
                      />
                    </IndicatorContainer>
                  ))
              )
            )}
          </LevelContainer>
        </TreeContainer>
      </ScrollContainer>
    </Container>
  );
};

export default HierarchyTree;