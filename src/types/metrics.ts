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
  description?: string;
  children?: Indicator[];
  parentId?: string;
  isPrimary?: boolean;
  flowType?: 'faturamento' | 'cupom'; // Novo campo para diferenciar os fluxos
}

export interface IndicatorRelation {
  sourceId: string;
  targetId: string;
  impact: number; // 0 a 1 para representar o peso da relação
  flowType?: 'faturamento' | 'cupom'; // Novo campo para diferenciar os fluxos
}

export interface IndicatorTree {
  indicators: Indicator[];
  relations: IndicatorRelation[];
}

export interface IndicatorHistory {
  dates: string[];
  values: number[];
}

export interface ActionPlan {
  id: string;
  indicatorId: string;
  title: string;
  description: string;
  steps: string[];
  products?: string[];
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'validated' | 'rejected';
  createdAt: string;
  updatedAt: string;
  executionPhoto?: string;
  validationStatus?: 'pending' | 'approved' | 'rejected';
  validationFeedback?: string;
}