// src/services/api/actionPlanService.ts
import { ActionPlan } from '@/types/metrics';

// Mock de dados para Planos de Ação
const actionPlansData: ActionPlan[] = [
  {
    id: 'ajuste-estoque-001',
    indicatorId: 'uvc',
    title: 'Reduzir ruptura de estoque',
    description: 'Ajuste automatizado de parâmetros de compra para produtos com alta demanda nos últimos 30 dias',
    steps: [
      'Identificar os 20 produtos com maior venda nos últimos 30 dias',
      'Verificar o estoque atual e ponto de pedido configurado',
      'Ajustar o estoque mínimo para garantir cobertura de 15 dias',
      'Realizar pedidos emergenciais para itens em ruptura',
      'Implementar alerta automático para rupturas potenciais'
    ],
    products: [
      'Dipirona 500mg - 20 comprimidos',
      'Dorflex - 36 comprimidos',
      'Amoxicilina 500mg - 21 cápsulas',
      'Soro fisiológico 500ml',
      'Loratadina 10mg - 12 comprimidos'
    ],
    deadline: '7 dias',
    priority: 'high',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cross-selling-002',
    indicatorId: 'uvc',
    title: 'Implementar cross-selling',
    description: 'Configure sugestões de produtos complementares para os 20 produtos mais vendidos',
    steps: [
      'Identificar os 20 produtos com maior venda nos últimos 30 dias',
      'Listar produtos complementares para cada item (ex: Dipirona + Água)',
      'Treinar equipe para sugerir os produtos complementares',
      'Colocar comunicação visual de sugestão próximo aos produtos',
      'Criar combos com desconto para aumentar conversão'
    ],
    products: [
      'Dipirona 500mg + Água mineral',
      'Protetor solar + Hidratante pós-sol',
      'Shampoo + Condicionador da mesma linha',
      'Medicamentos para pressão + Ômega 3',
      'Escovas de dente + Cremes dentais'
    ],
    deadline: '15 dias',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pacotes-promo-003',
    indicatorId: 'uvc',
    title: 'Pacotes promocionais',
    description: 'Criar combos para dermocosméticos com baixa conversão, oferecendo desconto na compra conjunta',
    steps: [
      'Identificar dermocosméticos com baixa conversão e margem interessante',
      'Definir descontos para compras em conjunto (ex: facial + corporal)',
      'Criar material de comunicação visual destacando a promoção',
      'Treinar equipe sobre benefícios dos produtos em conjunto',
      'Montar displays especiais nas áreas de maior circulação da loja'
    ],
    products: [
      'Hidratante facial + Protetor solar',
      'Shampoo + Condicionador + Máscara',
      'Sérum anti-idade + Creme para os olhos',
      'Sabonete facial + Tônico + Hidratante',
      'Protetor solar corporal + Protetor solar facial'
    ],
    deadline: '10 dias',
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mix-premium-001',
    indicatorId: 'precoMedio',
    title: 'Ampliar mix premium',
    description: 'Aumentar visibilidade de dermocosméticos e produtos premium nas gôndolas principais',
    steps: [
      'Realocar produtos premium para áreas de maior visibilidade',
      'Criar ilhas promocionais com produtos de maior valor agregado',
      'Treinar equipe sobre diferenciais dos produtos premium',
      'Implementar materiais de comunicação visual destacando benefícios',
      'Criar experiência de teste para clientes (amostras, demonstrações)'
    ],
    products: [
      'Linha La Roche-Posay',
      'Linha Vichy',
      'Linha Avène',
      'Suplementos premium',
      'Dermocosméticos anti-idade'
    ],
    deadline: '7 dias',
    priority: 'high',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ajuste-desconto-002',
    indicatorId: 'precoMedio',
    title: 'Revisar política de descontos',
    description: 'Ajustar descontos em produtos com alta elasticidade de preço para otimizar margem',
    steps: [
      'Identificar produtos com alta elasticidade de preço',
      'Analisar histórico de vendas com diferentes níveis de desconto',
      'Estabelecer limites máximos de desconto por categoria',
      'Criar regras para aprovação de exceções',
      'Treinar equipe sobre nova política'
    ],
    products: [
      'Medicamentos genéricos de alta concorrência',
      'Produtos de higiene pessoal',
      'Vitaminas e suplementos',
      'Produtos sazonais',
      'Produtos com alta elasticidade de preço'
    ],
    deadline: '15 dias',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expansao-categorias-003',
    indicatorId: 'precoMedio',
    title: 'Expandir dermocosméticos',
    description: 'Aumentar capilaridade em categorias de maior valor agregado como anti-idade e proteção solar',
    steps: [
      'Analisar mix atual vs mix ideal de dermocosméticos',
      'Identificar produtos de alto giro e alta margem',
      'Negociar condições especiais com fornecedores',
      'Criar área exclusiva para dermocosméticos',
      'Implementar treinamento especializado para atendentes'
    ],
    products: [
      'Protetores solares fator 50+',
      'Séruns anti-idade',
      'Produtos para manchas',
      'Hidratantes premium',
      'Produtos para pele sensível'
    ],
    deadline: '30 dias',
    priority: 'high',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const actionPlanService = {
  // Obter todos os planos de ação
  getAllActionPlans: (): ActionPlan[] => {
    return actionPlansData;
  },
  
  // Obter planos de ação por indicador
  getActionPlansByIndicator: (indicatorId: string): ActionPlan[] => {
    return actionPlansData.filter(plan => plan.indicatorId === indicatorId);
  },
  
  // Obter plano de ação por ID
  getActionPlanById: (actionId: string): ActionPlan | undefined => {
    return actionPlansData.find(plan => plan.id === actionId);
  },
  
  // Atualizar status do plano de ação
  updateActionPlanStatus: (actionId: string, status: ActionPlan['status']): ActionPlan | undefined => {
    const planIndex = actionPlansData.findIndex(plan => plan.id === actionId);
    if (planIndex === -1) return undefined;
    
    actionPlansData[planIndex] = {
      ...actionPlansData[planIndex],
      status,
      updatedAt: new Date().toISOString()
    };
    
    return actionPlansData[planIndex];
  },
  
  // Enviar foto de validação
  submitValidationPhoto: (actionId: string, photoUri: string, location?: {lat: number, lng: number}): ActionPlan | undefined => {
    const planIndex = actionPlansData.findIndex(plan => plan.id === actionId);
    if (planIndex === -1) return undefined;
    
    actionPlansData[planIndex] = {
      ...actionPlansData[planIndex],
      executionPhoto: photoUri,
      status: 'pending',
      validationStatus: 'pending',
      updatedAt: new Date().toISOString()
    };
    
    return actionPlansData[planIndex];
  },
  
  // Validar execução (para o backoffice)
  validateExecution: (actionId: string, approved: boolean, feedback?: string): ActionPlan | undefined => {
    const planIndex = actionPlansData.findIndex(plan => plan.id === actionId);
    if (planIndex === -1) return undefined;
    
    actionPlansData[planIndex] = {
      ...actionPlansData[planIndex],
      status: approved ? 'validated' : 'rejected',
      validationStatus: approved ? 'approved' : 'rejected',
      validationFeedback: feedback,
      updatedAt: new Date().toISOString()
    };
    
    return actionPlansData[planIndex];
  }
};

export default actionPlanService;