// src/components/dashboard/IndicatorGraph.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, PanResponder, GestureResponderEvent } from 'react-native';
import Svg, { G, Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';
import { Indicator, IndicatorRelation } from '@/types/metrics';
import IndicatorDetailPopup from './IndicatorDetailPopup';
import * as d3 from 'd3';

interface IndicatorGraphProps {
  indicators: Indicator[];
  relations: IndicatorRelation[];
  centralIndicatorId: string;
  onIndicatorSelect: (indicator: Indicator) => void;
  flowType: 'faturamento' | 'cupom';
}

// Tipos de nós
type NodeType = 'central' | 'primary' | 'secondary' | 'context';

// Interface para nós do grafo
interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  value: string | number;
  target: string | number;
  status: string;
  type: NodeType;
  icon: string;
  indicator: Indicator;
  x?: number;
  y?: number;
}

// Interface para arestas do grafo
interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
  type: 'direct' | 'indirect';
}

// Estilos e cores para os nós
const NODE_COLORS = {
  central: '#F57C00', // Laranja (mantido para o nó central)
  primary: '#4CAF50', // Verde
  secondary: '#4CAF50', // Verde (mesma cor do primário)
  context: '#F44336' // Vermelho
};

// Tamanhos para os nós
const NODE_SIZES = {
  central: 70,
  primary: 60,
  secondary: 50,
  context: 40
};

// Container para o botão de reset de zoom
const ZoomButtonContainer = styled(TouchableOpacity)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.roundness.full}px;
  padding: ${props => props.theme.spacing.sm}px;
  z-index: 10;
  flex-direction: row;
  align-items: center;
`;

const LegendTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const LegendItem = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const LegendColorIndicator = styled(View)<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${props => props.color};
  margin-right: ${props => props.theme.spacing.xs}px;
`;

const LegendText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.text};
`;

// Container para o botão de reset
const ResetButtonContainer = styled(TouchableOpacity)`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.roundness.full}px;
  padding: ${props => props.theme.spacing.sm}px;
  z-index: 10;
  flex-direction: row;
  align-items: center;
`;

const ResetButtonText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: white;
  margin-left: ${props => props.theme.spacing.xs}px;
`;

// Container para detalhes do nó selecionado
const NodeDetailContainer = styled(View)`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.roundness.md}px;
  padding: ${props => props.theme.spacing.md}px;
  margin: ${props => props.theme.spacing.md}px;
  elevation: 4;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
`;

const NodeDetailTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const NodeDetailRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const NodeDetailLabel = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
`;

const NodeDetailValue = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
`;

const NodeDetailButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.roundness.md}px;
  padding: ${props => props.theme.spacing.sm}px;
  align-items: center;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const NodeDetailButtonText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: white;
`;

const IndicatorGraph: React.FC<IndicatorGraphProps> = ({
  indicators,
  relations,
  centralIndicatorId,
  onIndicatorSelect,
  flowType
}) => {
  const theme = useTheme();
  const svgRef = useRef<Svg>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  
  // Estado para o nó selecionado
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  
  // Estado para controle de zoom e pan
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  
  // Dimensões da tela
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height * 0.7; // Altura do grafo aumentada
  
  // Preparar nós e links do grafo
  const [graphData, setGraphData] = useState<{
    nodes: GraphNode[], 
    links: GraphLink[]
  }>({ nodes: [], links: [] });
  
  // Identificar se um indicador é raiz para o fluxo atual
  const isRootIndicator = (id: string) => {
    return indicators.find(ind => ind.id === id && !ind.parentId && ind.flowType === flowType);
  };
  
  // Função para determinar o tipo de nó com base na relação com o nó central
  const determineNodeType = (nodeId: string, centralId: string): NodeType => {
    if (nodeId === centralId) return 'central';
    
    // Verificar se o nó tem relação direta com o central
    const directRelation = relations.find(rel => 
      (rel.sourceId === nodeId && rel.targetId === centralId) || 
      (rel.sourceId === centralId && rel.targetId === nodeId)
    );
    
    if (directRelation) return 'primary';
    
    // Verificar se o nó tem relação indireta (via nó primário)
    const primaryNodes = relations
      .filter(rel => rel.targetId === centralId || rel.sourceId === centralId)
      .map(rel => rel.targetId === centralId ? rel.sourceId : rel.targetId);
    
    const indirectRelation = relations.find(rel => 
      primaryNodes.includes(rel.targetId as string) && rel.sourceId === nodeId ||
      primaryNodes.includes(rel.sourceId as string) && rel.targetId === nodeId
    );
    
    if (indirectRelation) return 'secondary';
    
    return 'context';
  };
  
  // Preparar dados do grafo quando mudar o indicador central
  useEffect(() => {
    // Filtrar indicadores e relações para o fluxo atual
    const flowIndicators = indicators.filter(ind => ind.flowType === flowType);
    const flowRelations = relations.filter(rel => rel.flowType === flowType);
    
    // Encontrar o indicador central
    const centralIndicator = flowIndicators.find(ind => ind.id === centralIndicatorId);
    if (!centralIndicator) return;
    
    // Construir conjunto de nós relacionados (diretos e indiretos)
    const relatedNodeIds = new Set<string>();
    relatedNodeIds.add(centralIndicatorId);
    
    // Adicionar nós diretamente relacionados
    flowRelations.forEach(rel => {
      if (rel.sourceId === centralIndicatorId) relatedNodeIds.add(rel.targetId as string);
      if (rel.targetId === centralIndicatorId) relatedNodeIds.add(rel.sourceId as string);
    });
    
    // Adicionar nós indiretamente relacionados (2º nível)
    const directNodes = Array.from(relatedNodeIds);
    directNodes.forEach(nodeId => {
      flowRelations.forEach(rel => {
        if (rel.sourceId === nodeId && nodeId !== centralIndicatorId) 
          relatedNodeIds.add(rel.targetId as string);
        if (rel.targetId === nodeId && nodeId !== centralIndicatorId) 
          relatedNodeIds.add(rel.sourceId as string);
      });
    });
    
    // Criar nós do grafo
    const nodes: GraphNode[] = Array.from(relatedNodeIds).map(id => {
      const indicator = flowIndicators.find(ind => ind.id === id);
      if (!indicator) return null;
      
      return {
        id,
        name: indicator.name,
        value: indicator.value,
        target: indicator.target,
        status: indicator.status,
        type: determineNodeType(id, centralIndicatorId),
        icon: indicator.icon,
        indicator
      };
    }).filter(Boolean) as GraphNode[];
    
    // Criar links do grafo
    const links: GraphLink[] = flowRelations
      .filter(rel => 
        relatedNodeIds.has(rel.sourceId as string) && 
        relatedNodeIds.has(rel.targetId as string)
      )
      .map(rel => {
        const source = rel.sourceId;
        const target = rel.targetId;
        
        // Determinar se a relação é direta ou indireta com o nó central
        const type = source === centralIndicatorId || target === centralIndicatorId
          ? 'direct'
          : 'indirect';
        
        return {
          source,
          target,
          value: rel.impact,
          type
        };
      });
    
    setGraphData({ nodes, links });
    
    // Resetar nó selecionado ao trocar o nó central
    setSelectedNode(null);
    
    // Resetar zoom e pan ao trocar o nó central
    resetZoom();
  }, [indicators, relations, centralIndicatorId, flowType]);
  
  // Configurar e iniciar simulação D3 quando os dados do grafo mudam
  useEffect(() => {
    if (graphData.nodes.length === 0) return;
    
    // Center position
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    
    // Criar simulação de forças
    const simulation = d3.forceSimulation<GraphNode, GraphLink>(graphData.nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(graphData.links)
        .id(d => d.id)
        .distance(link => {
          // Distâncias menores para aproximar os nós
          if (link.type === 'direct') return 150;
          return 180;
        })
        .strength(link => {
          // Forças maiores para manter os nós conectados mais próximos
          if (link.type === 'direct') return 0.5;
          return 0.3;
        })
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(centerX, centerY))
      .force('collision', d3.forceCollide().radius(d => {
        return NODE_SIZES[d.type] * 0.6;
      }));
    
    // Posicionar nó central no meio
    const centralNode = graphData.nodes.find(node => node.type === 'central');
    if (centralNode) {
      centralNode.fx = centerX;
      centralNode.fy = centerY;
    }
    
    // Armazenar simulação na ref
    simulationRef.current = simulation;
    
    // Executar simulação por um tempo e então paralisar para melhor desempenho
    simulation.on('tick', () => {
      setGraphData(prevData => ({
        ...prevData,
        nodes: [...prevData.nodes]
      }));
    });
    
    // Parar simulação após 2 segundos para economizar bateria
    setTimeout(() => {
      simulation.stop();
    }, 2000);
    
    // Limpar simulação ao desmontar
    return () => {
      simulation.stop();
    };
  }, [graphData.nodes, graphData.links, screenWidth, screenHeight]);
  
  // Estado para controlar a visibilidade do popup
  const [detailPopupVisible, setDetailPopupVisible] = useState(false);
  
  // Implementação do PanResponder para gestos de zoom e pan
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      // Para manipular o gesto de pinça (zoom)
      onPanResponderMove: (event: GestureResponderEvent, gestureState: any) => {
        if (event.nativeEvent.touches.length === 2) {
          // Calcular distância entre os dois toques
          const touch1 = event.nativeEvent.touches[0];
          const touch2 = event.nativeEvent.touches[1];
          
          const dx = touch1.pageX - touch2.pageX;
          const dy = touch1.pageY - touch2.pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Comparar com a distância anterior para determinar o zoom
          if (panResponder.current.lastDistance) {
            const change = distance / panResponder.current.lastDistance;
            // Limitar o zoom entre 0.5 e 3
            const newScale = Math.min(Math.max(scale * change, 0.5), 3);
            setScale(newScale);
          }
          
          // Salvar a distância atual para comparação
          panResponder.current.lastDistance = distance;
        } else if (event.nativeEvent.touches.length === 1) {
          // Para pan (arrastar)
          setTranslateX(translateX + gestureState.dx);
          setTranslateY(translateY + gestureState.dy);
        }
      },
      
      onPanResponderRelease: () => {
        // Resetar a distância quando os dedos são levantados
        panResponder.current.lastDistance = 0;
      }
    })
  ).current;
  
  // Resetar zoom
  const resetZoom = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  // Manipulador para clique em nó
  const handleNodeClick = (node: GraphNode) => {
    // Definir o nó selecionado e mostrar o popup
    setSelectedNode(node);
    setDetailPopupVisible(true);
  };
  
  // Manipulador para o botão "Ver plano de ação" no popup
  const handleViewAction = () => {
    if (selectedNode) {
      // Fechar o popup e navegar para a tela de plano de ação
      setDetailPopupVisible(false);
      onIndicatorSelect(selectedNode.indicator);
    }
  };
  
  // Manipulador quando o usuário fecha o popup
  const handleClosePopup = () => {
    setDetailPopupVisible(false);
  };
  
  // Manipulador para mudança de nó central (sem navegar)
  const handleChangeCenter = (indicator: Indicator) => {
    // Fechar o popup e tornar o nó selecionado o novo centro
    setDetailPopupVisible(false);
    onIndicatorSelect(indicator);
  };
  
  // Manipulador para resetar a visualização (voltar para o nó raiz)
  const handleReset = () => {
    // Encontrar o nó raiz para o fluxo atual
    const rootIndicator = flowType === 'faturamento' 
      ? indicators.find(ind => ind.id === 'faturamento')
      : indicators.find(ind => ind.id === 'qtdCupons');
    
    if (rootIndicator) {
      onIndicatorSelect(rootIndicator);
    }
  };
  
  return (
    <View style={{ height: screenHeight + 200 }}>
      {/* Popup de detalhes do indicador */}
      {selectedNode && (
        <IndicatorDetailPopup
          indicator={selectedNode.indicator}
          visible={detailPopupVisible}
          onClose={handleClosePopup}
          onViewAction={selectedNode.indicator.isPrimary ? handleViewAction : undefined}
        />
      )}
      
      {/* Botão de reset */}
      <ResetButtonContainer onPress={handleReset} theme={theme}>
        <Feather name="refresh-cw" size={16} color="white" />
        <ResetButtonText theme={theme}>
          {flowType === 'faturamento' ? 'Voltar para Faturamento' : 'Voltar para Qtd. Cupons'}
        </ResetButtonText>
      </ResetButtonContainer>
      
      {/* Botão de reset de zoom */}
      <ZoomButtonContainer onPress={resetZoom} theme={theme}>
        <Feather name="maximize" size={16} color="white" />
        <ResetButtonText theme={theme}>
          Resetar Zoom
        </ResetButtonText>
      </ZoomButtonContainer>
      
      {/* SVG para o grafo */}
      <View 
        style={{ height: screenHeight }}
        {...panResponder.panHandlers}
      >
        <Svg
          ref={svgRef}
          width={screenWidth}
          height={screenHeight}
          style={{ backgroundColor: theme.colors.background }}
        >
          <G
            transform={`translate(${translateX}, ${translateY}) scale(${scale})`}
          >
            {/* Links (arestas) */}
            <G>
              {graphData.links.map((link, i) => {
                const sourceNode = typeof link.source === 'string' 
                  ? graphData.nodes.find(n => n.id === link.source) 
                  : link.source;
                
                const targetNode = typeof link.target === 'string'
                  ? graphData.nodes.find(n => n.id === link.target) 
                  : link.target;
                
                if (!sourceNode || !targetNode || !sourceNode.x || !sourceNode.y || !targetNode.x || !targetNode.y) {
                  return null;
                }
                
                // Determinar a espessura com base no valor do link (impacto)
                const strokeWidth = link.type === 'direct' ? 2 : 1;
                const strokeDash = link.type === 'direct' ? '' : '5,5';
                
                return (
                  <Line
                    key={`link-${i}`}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={theme.colors.border}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                  />
                );
              })}
            </G>
            
            {/* Nós */}
            <G>
              {graphData.nodes.map((node, i) => {
                if (!node.x || !node.y) return null;
                
                const nodeSize = NODE_SIZES[node.type];
                const nodeColor = NODE_COLORS[node.type];
                
                return (
                  <G key={`node-${i}`}>
                    {/* Círculo do nó */}
                    <Circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeSize / 2}
                      fill={node.type === 'central' ? NODE_COLORS.central : 
                           node.status === 'above' ? NODE_COLORS.primary : NODE_COLORS.context}
                      opacity={0.9}
                      onPress={() => handleNodeClick(node)}
                    />
                    
                    {/* Texto do nó (nome abreviado) */}
                    <SvgText
                      x={node.x}
                      y={node.y}
                      fontSize={node.type === 'central' ? 16 : 14}
                      fill="#FFFFFF"
                      fontWeight="bold"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {node.name.length > 12 ? `${node.name.substring(0, 12)}...` : node.name}
                    </SvgText>
                    
                    {/* Texto abaixo do nó (nome completo) */}
                    <SvgText
                      x={node.x}
                      y={node.y + (nodeSize / 2) + 16}
                      fontSize={12}
                      fill={theme.colors.text}
                      textAnchor="middle"
                    >
                      {node.name}
                    </SvgText>
                    
                    {/* Ícone de ação para indicadores primários */}
                    {node.indicator.isPrimary && (
                      <G>
                        <Circle
                          cx={node.x + (nodeSize / 2) - 5}
                          cy={node.y - (nodeSize / 2) + 5}
                          r={8}
                          fill={theme.colors.accent}
                          opacity={0.9}
                        />
                        <SvgText
                          x={node.x + (nodeSize / 2) - 5}
                          y={node.y - (nodeSize / 2) + 5}
                          fontSize={8}
                          fill="#FFFFFF"
                          textAnchor="middle"
                          alignmentBaseline="middle"
                        >
                          !
                        </SvgText>
                      </G>
                    )}
                  </G>
                );
              })}
            </G>
          </G>
        </Svg>
      </View>
    </View>
  );
};

export default IndicatorGraph;