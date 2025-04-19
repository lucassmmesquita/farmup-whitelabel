// src/hooks/useIndicatorHierarchy.ts
import { useState, useEffect } from 'react';
import hierarchyService from '@/services/api/hierarchyService';
import { IndicatorTree, Indicator } from '@/types/metrics';

export const useIndicatorHierarchy = () => {
  const [loading, setLoading] = useState(true);
  const [indicatorTree, setIndicatorTree] = useState<IndicatorTree | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  
  useEffect(() => {
    loadIndicatorTree();
  }, []);
  
  useEffect(() => {
    if (selectedIndicator) {
      loadRecommendations(selectedIndicator);
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
  
  const getChildIndicators = (parentId: string): Indicator[] => {
    if (!indicatorTree) return [];
    return indicatorTree.indicators.filter(i => i.parentId === parentId);
  };
  
  const getParentIndicator = (childId: string): Indicator | undefined => {
    if (!indicatorTree) return undefined;
    
    const child = indicatorTree.indicators.find(i => i.id === childId);
    if (!child || !child.parentId) return undefined;
    
    return indicatorTree.indicators.find(i => i.id === child.parentId);
  };
  
  const getRelations = (indicatorId: string) => {
    if (!indicatorTree) return { incoming: [], outgoing: [] };
    
    const incoming = indicatorTree.relations.filter(r => r.targetId === indicatorId);
    const outgoing = indicatorTree.relations.filter(r => r.sourceId === indicatorId);
    
    return { incoming, outgoing };
  };
  
  const getPrimaryIndicators = (): Indicator[] => {
    if (!indicatorTree) return [];
    return indicatorTree.indicators.filter(i => i.isPrimary);
  };
  
  const isActionable = (indicatorId: string): boolean => {
    if (!indicatorTree) return false;
    const indicator = indicatorTree.indicators.find(i => i.id === indicatorId);
    return indicator?.isPrimary === true;
  };
  
  return {
    loading,
    indicatorTree,
    selectedIndicator,
    setSelectedIndicator,
    recommendations,
    getChildIndicators,
    getParentIndicator,
    getRelations,
    getPrimaryIndicators,
    isActionable,
    refresh: loadIndicatorTree
  };
};