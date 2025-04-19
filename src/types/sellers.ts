// src/types/sellers.ts
export interface Seller {
    id: string;
    name: string;
    avatar?: string;
    metrics: {
      revenue: number;
      uvc: number;
      avgTicket: number;
      avgPrice: number;
      ticketCount: number;
    };
    status: 'above_target' | 'on_target' | 'below_target' | 'critical';
    trend: 'up' | 'down' | 'neutral';
    daysOnTarget: number;
    daysOffTarget: number;
    history: {
      date: string;
      revenue: number;
      uvc: number;
      avgTicket: number;
      avgPrice: number;
      ticketCount: number;
    }[];
    actionPlanId?: string;
  }
  
  export interface SellerSummary {
    topPerformer?: Seller;
    needsAttention?: Seller;
    critical?: Seller;
    averageRevenue: number;
    averageUvc: number;
    averageTicket: number;
    sellers?: Record<string, Seller>; // Adicionar esta propriedade
  }