// src/types/metrics.ts
export type IndicatorStatus = 'above' | 'below' | 'neutral';

export interface Indicator {
  id: string;
  name: string;
  value: string | number;
  formattedValue: string;
  target: string | number;
  formattedTarget: string;
  variation: string;
  status: IndicatorStatus;
  icon: string;
  children?: Indicator[];
  parentId?: string;
  isPrimary?: boolean;
}

export interface IndicatorRelation {
  sourceId: string;
  targetId: string;
  impact: number; // 0 a 1 para representar o peso da relação
}

export interface IndicatorTree {
  indicators: Indicator[];
  relations: IndicatorRelation[];
}