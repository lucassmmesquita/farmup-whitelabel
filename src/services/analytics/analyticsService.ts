// src/services/analytics/analyticsService.ts
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface para eventos de analytics
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

// Interface para usuário identificado
export interface IdentifiedUser {
  id: string;
  properties?: Record<string, any>;
}

// Classe base para serviços de analytics
abstract class BaseAnalyticsService {
  abstract initialize(): Promise<void>;
  abstract trackEvent(event: AnalyticsEvent): void;
  abstract identifyUser(user: IdentifiedUser): void;
  abstract reset(): void;
}

// Implementação para Amplitude
class AmplitudeAnalytics extends BaseAnalyticsService {
  private apiKey: string;
  private initialized: boolean = false;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Aqui seria implementada a inicialização da SDK do Amplitude
    console.log('Amplitude initialized with key:', this.apiKey);
    this.initialized = true;
  }

  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) {
      console.warn('Amplitude not initialized');
      return;
    }
    
    // Aqui seria implementado o rastreamento de eventos via Amplitude
    console.log('Amplitude track event:', event.name, event.properties);
  }

  identifyUser(user: IdentifiedUser): void {
    if (!this.initialized) {
      console.warn('Amplitude not initialized');
      return;
    }
    
    // Aqui seria implementada a identificação de usuário via Amplitude
    console.log('Amplitude identify user:', user.id, user.properties);
  }

  reset(): void {
    if (!this.initialized) {
      console.warn('Amplitude not initialized');
      return;
    }
    
    // Aqui seria implementado o reset da sessão via Amplitude
    console.log('Amplitude reset');
  }
}

// Implementação para Mixpanel
class MixpanelAnalytics extends BaseAnalyticsService {
  private token: string;
  private initialized: boolean = false;

  constructor(token: string) {
    super();
    this.token = token;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Aqui seria implementada a inicialização da SDK do Mixpanel
    console.log('Mixpanel initialized with token:', this.token);
    this.initialized = true;
  }

  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) {
      console.warn('Mixpanel not initialized');
      return;
    }
    
    // Aqui seria implementado o rastreamento de eventos via Mixpanel
    console.log('Mixpanel track event:', event.name, event.properties);
  }

  identifyUser(user: IdentifiedUser): void {
    if (!this.initialized) {
      console.warn('Mixpanel not initialized');
      return;
    }
    
    // Aqui seria implementada a identificação de usuário via Mixpanel
    console.log('Mixpanel identify user:', user.id, user.properties);
  }

  reset(): void {
    if (!this.initialized) {
      console.warn('Mixpanel not initialized');
      return;
    }
    
    // Aqui seria implementado o reset da sessão via Mixpanel
    console.log('Mixpanel reset');
  }
}

// Factory para criação do serviço de analytics baseado na configuração
class AnalyticsServiceFactory {
  static createService(type: 'amplitude' | 'mixpanel', config: { key: string }): BaseAnalyticsService {
    switch (type) {
      case 'amplitude':
        return new AmplitudeAnalytics(config.key);
      case 'mixpanel':
        return new MixpanelAnalytics(config.key);
      default:
        throw new Error(`Unsupported analytics service: ${type}`);
    }
  }
}

// Serviço principal de analytics
export class AnalyticsService {
  private static instance: AnalyticsService;
  private service: BaseAnalyticsService | null = null;
  private pendingEvents: AnalyticsEvent[] = [];
  private userId: string | null = null;

  private constructor() {}

  // Singleton pattern
  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Inicializar o serviço
  public async initialize(type: 'amplitude' | 'mixpanel', config: { key: string }): Promise<void> {
    if (this.service) return;
    
    this.service = AnalyticsServiceFactory.createService(type, config);
    await this.service.initialize();
    
    // Processar eventos pendentes
    this.processPendingEvents();
    
    // Restaurar usuário identificado, se houver
    await this.restoreIdentifiedUser();
  }

  // Rastrear evento
  public trackEvent(event: AnalyticsEvent): void {
    if (!this.service) {
      // Armazenar evento para processamento posterior
      this.pendingEvents.push(event);
      return;
    }
    
    // Adicionar propriedades comuns
    const eventWithCommonProps = {
      ...event,
      properties: {
        ...event.properties,
        platform: Platform.OS,
        appVersion: '1.0.0', // Obter dinamicamente
        deviceId: 'unknown', // Implementar obtenção do ID do dispositivo
      },
    };
    
    this.service.trackEvent(eventWithCommonProps);
  }

  // Identificar usuário
  public async identifyUser(user: IdentifiedUser): Promise<void> {
    this.userId = user.id;
    
    // Armazenar ID do usuário para restauração
    await AsyncStorage.setItem('@FarmApp:analyticsUserId', user.id);
    if (user.properties) {
      await AsyncStorage.setItem('@FarmApp:analyticsUserProps', JSON.stringify(user.properties));
    }
    
    if (!this.service) return;
    
    this.service.identifyUser(user);
  }

  // Resetar sessão
  public async reset(): Promise<void> {
    this.userId = null;
    
    // Limpar dados armazenados
    await AsyncStorage.removeItem('@FarmApp:analyticsUserId');
    await AsyncStorage.removeItem('@FarmApp:analyticsUserProps');
    
    if (!this.service) return;
    
    this.service.reset();
  }

  // Processar eventos pendentes
  private processPendingEvents(): void {
    if (!this.service) return;
    
    this.pendingEvents.forEach(event => {
      this.trackEvent(event);
    });
    
    this.pendingEvents = [];
  }

  // Restaurar usuário identificado
  private async restoreIdentifiedUser(): Promise<void> {
    try {
      const userId = await AsyncStorage.getItem('@FarmApp:analyticsUserId');
      if (!userId) return;
      
      const userPropsStr = await AsyncStorage.getItem('@FarmApp:analyticsUserProps');
      const userProps = userPropsStr ? JSON.parse(userPropsStr) : undefined;
      
      this.identifyUser({ id: userId, properties: userProps });
    } catch (error) {
      console.error('Error restoring analytics user:', error);
    }
  }
}

// Exportar instância singleton
export const analyticsService = AnalyticsService.getInstance();