// src/hooks/useIndicatorHierarchy.ts
import { useState, useEffect } from 'react';
import hierarchyService from '@/services/api/hierarchyService';
import { IndicatorTree, Indicator, IndicatorRelation } from '@/types/metrics';

export const useIndicatorHierarchy = () => {
  const [loading, setLoading] = useState(true);
  const [indicatorTree, setIndicatorTree] = useState<IndicatorTree | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [relatedIndicators, setRelatedIndicators] = useState<Indicator[]>([]);
  
  useEffect(() => {
    loadIndicatorTree();
  }, []);
  
  useEffect(() => {
    if (selectedIndicator) {
      loadRecommendations(selectedIndicator);
      loadRelatedIndicators(selectedIndicator);
    }
  }, [selectedIndicator]);
  
  const loadIndicatorTree = async () => {
    setLoading(true);
    try {
      // Em produção, seria uma chamada API real
      const tree = hierarchyService.getIndicatorTree();
      setIndicatorTree(tree);
    } catch (error) {
      console.error('Erro ao carregar árvore de indicadores:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadRecommendations = async (indicatorId: string) => {
    try {
      const recs = hierarchyService.getRecommendations(indicatorId);
      setRecommendations(recs);
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
      setRecommendations([]);
    }
  };
  
  const loadRelatedIndicators = (indicatorId: string) => {
    if (!indicatorTree) return;
    
    const related: Indicator[] = [];
    
    // Encontrar relações em que o indicador selecionado é fonte ou alvo
    indicatorTree.relations.forEach(relation => {
      if (relation.sourceId === indicatorId) {
        const targetIndicator = indicatorTree.indicators.find(ind => ind.id === relation.targetId);
        if (targetIndicator) related.push(targetIndicator);
      }
      if (relation.targetId === indicatorId) {
        const sourceIndicator = indicatorTree.indicators.find(ind => ind.id === relation.sourceId);
        if (sourceIndicator) related.push(sourceIndicator);
      }
    });
    
    setRelatedIndicators(related);
  };
  
  const getChildIndicators = (parentId: string, flowType?: 'faturamento' | 'cupom'): Indicator[] => {
    if (!indicatorTree) return [];
    
    if (flowType) {
      return indicatorTree.indicators.filter(i => 
        i.parentId === parentId && i.flowType === flowType
      );
    }
    
    return indicatorTree.indicators.filter(i => i.parentId === parentId);
  };
  
  const getParentIndicator = (childId: string): Indicator | undefined => {
    if (!indicatorTree) return undefined;
    
    const child = indicatorTree.indicators.find(i => i.id === childId);
    if (!child || !child.parentId) return undefined;
    
    return indicatorTree.indicators.find(i => i.id === child.parentId);
  };
  
  const getRelations = (indicatorId: string, flowType?: 'faturamento' | 'cupom') => {
    if (!indicatorTree) return { incoming: [], outgoing: [] };
    
    if (flowType) {
      const incoming = indicatorTree.relations.filter(r => 
        r.targetId === indicatorId && r.flowType === flowType
      );
      const outgoing = indicatorTree.relations.filter(r => 
        r.sourceId === indicatorId && r.flowType === flowType
      );
      return { incoming, outgoing };
    }
    
    const incoming = indicatorTree.relations.filter(r => r.targetId === indicatorId);
    const outgoing = indicatorTree.relations.filter(r => r.sourceId === indicatorId);
    
    return { incoming, outgoing };
  };
  
  // Nova função para obter todas as relações de um indicador (diretas e indiretas)
  const getAllRelatedIndicators = (indicatorId: string, flowType?: 'faturamento' | 'cupom'): Indicator[] => {
    if (!indicatorTree) return [];
    
    const relatedIds = new Set<string>();
    const result: Indicator[] = [];
    
    // Função recursiva para encontrar relações
    const findRelated = (id: string, depth: number = 0, maxDepth: number = 2) => {
      if (depth > maxDepth) return;
      
      // Adicionar relações diretas
      indicatorTree.relations
        .filter(r => (!flowType || r.flowType === flowType))
        .forEach(r => {
          if (r.sourceId === id) {
            relatedIds.add(r.targetId as string);
            findRelated(r.targetId as string, depth + 1, maxDepth);
          }
          if (r.targetId === id) {
            relatedIds.add(r.sourceId as string);
            findRelated(r.sourceId as string, depth + 1, maxDepth);
          }
        });
    };
    
    // Iniciar busca a partir do indicador selecionado
    findRelated(indicatorId);
    
    // Transformar IDs em objetos de indicador
    relatedIds.forEach(id => {
      const indicator = indicatorTree.indicators.find(i => i.id === id);
      if (indicator && (indicator.flowType === flowType || !flowType)) {
        result.push(indicator);
      }
    });
    
    return result;
  };
  
  const getPrimaryIndicators = (flowType?: 'faturamento' | 'cupom'): Indicator[] => {
    if (!indicatorTree) return [];
    
    if (flowType) {
      return indicatorTree.indicators.filter(i => 
        i.isPrimary && i.flowType === flowType
      );
    }
    
    return indicatorTree.indicators.filter(i => i.isPrimary);
  };
  
  const getRootIndicators = (flowType?: 'faturamento' | 'cupom'): Indicator[] => {
    if (!indicatorTree) return [];
    
    if (flowType) {
      return indicatorTree.indicators.filter(i => 
        !i.parentId && i.flowType === flowType
      );
    }
    
    return indicatorTree.indicators.filter(i => !i.parentId);
  };
  
  const isActionable = (indicatorId: string): boolean => {
    if (!indicatorTree) return false;
    const indicator = indicatorTree.indicators.find(i => i.id === indicatorId);
    return indicator?.isPrimary === true;
  };
  
  const getIndicatorsByFlowType = (flowType: 'faturamento' | 'cupom'): Indicator[] => {
    if (!indicatorTree) return [];
    return indicatorTree.indicators.filter(i => i.flowType === flowType);
  };
  
  return {
    loading,
    indicatorTree,
    selectedIndicator,
    setSelectedIndicator,
    recommendations,
    relatedIndicators,
    getChildIndicators,
    getParentIndicator,
    getRelations,
    getAllRelatedIndicators,
    getPrimaryIndicators,
    getRootIndicators,
    isActionable,
    getIndicatorsByFlowType,
    refresh: loadIndicatorTree
  };
};