// src/utils/navigationUtils.ts
import { RouteProp } from '@react-navigation/native';

// Mapeamento de rotas para definições de breadcrumbs
interface RouteDefinition {
  label: string;
  parent?: string;
}

const routeMap: Record<string, RouteDefinition> = {
  // Dashboard principal
  'DashboardMain': { label: 'Dashboard' },
  
  // Diagnóstico
  'HierarchyDashboard': { label: 'Diagnóstico', parent: 'DashboardMain' },
  'IndicatorDetails': { label: 'Indicador', parent: 'HierarchyDashboard' },
  
  // Ações
  'ActionsMain': { label: 'Ações' },
  'ActionList': { label: 'Lista de Ações', parent: 'ActionsMain' },
  'ActionPlanDetails': { label: 'Plano de Ação', parent: 'ActionList' },
  
  // Perfil
  'ProfileMain': { label: 'Perfil' },
  
  // Notificações
  'NotificationsMain': { label: 'Notificações' },
  
  // Vendedores
  'SellersList': { label: 'Vendedores', parent: 'DashboardMain' },
  'SellerDetails': { label: 'Detalhes do Vendedor', parent: 'SellersList' },
};

// Obter título para uma rota
export const getTitleForRoute = (routeName: string, params?: Record<string, any>): string => {
  const route = routeMap[routeName];
  if (!route) return routeName;
  
  // Verificar se há parâmetros específicos para personalizar o título
  if (params) {
    if (routeName === 'IndicatorDetails' && params.indicator) {
      return params.indicator.name || route.label;
    }
    if (routeName === 'SellerDetails' && params.sellerName) {
      return params.sellerName;
    }
    if (routeName === 'ActionPlanDetails' && params.actionName) {
      return params.actionName;
    }
  }
  
  return route.label;
};

// Obter breadcrumbs para uma rota
export const getBreadcrumbsForRoute = (route: RouteProp<any, any>) => {
  const routeName = route.name;
  const params = route.params || {};
  
  // Se não temos essa rota no mapa, não temos breadcrumbs
  if (!routeMap[routeName]) return [];
  
  const breadcrumbs = [];
  let currentRoute = routeName;
  
  // Construir breadcrumbs recursivamente
  while (currentRoute) {
    const routeInfo = routeMap[currentRoute];
    if (!routeInfo) break;
    
    // Adicionar ao início do array para manter a ordem correta
    breadcrumbs.unshift({
      label: getTitleForRoute(currentRoute, currentRoute === routeName ? params : undefined),
      screen: currentRoute,
      params: currentRoute === routeName ? params : undefined
    });
    
    // Seguir para a rota pai
    currentRoute = routeInfo.parent || '';
  }
  
  return breadcrumbs;
};

// Obter visibilidade de items do menu por perfil de usuário
export const getMenuVisibilityForRole = (role: string) => {
  const baseVisibility = {
    dashboard: true,
    team: false,
    actions: true,
    profile: true,
  };
  
  switch (role) {
    case 'admin':
    case 'manager':
      return {
        ...baseVisibility,
        team: true
      };
    case 'owner':
      return {
        ...baseVisibility,
        team: true
      };
    default:
      return baseVisibility;
  }
};

export default {
  getTitleForRoute,
  getBreadcrumbsForRoute,
  getMenuVisibilityForRole
};