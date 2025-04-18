// src/services/api/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.farmapp.com';

// Tipo de configuração para o cliente API
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// Configuração padrão para o cliente API
const defaultConfig: ApiClientConfig = {
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Cliente API com Axios
class ApiClient {
  private client: AxiosInstance;

  constructor(config: ApiClientConfig = defaultConfig) {
    this.client = axios.create(config);

    // Interceptor para adicionar token nas requisições
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('@FarmApp:token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para tratamento de erros nas respostas
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        // Se o erro for 401 (Unauthorized), tenta renovar o token
        if (error.response?.status === 401 && originalRequest) {
          try {
            const refreshToken = await AsyncStorage.getItem('@FarmApp:refreshToken');
            if (refreshToken) {
              // Solicitar novo token
              const newTokenResponse = await axios.post(`${API_URL}/refresh-token`, {
                refreshToken,
              });
              
              // Salvar novo token
              await AsyncStorage.setItem('@FarmApp:token', newTokenResponse.data.token);
              await AsyncStorage.setItem('@FarmApp:refreshToken', newTokenResponse.data.refreshToken);
              
              // Repetir a requisição original com o novo token
              originalRequest.headers.Authorization = `Bearer ${newTokenResponse.data.token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Se não conseguir renovar o token, limpa os dados da sessão
            await AsyncStorage.removeItem('@FarmApp:token');
            await AsyncStorage.removeItem('@FarmApp:refreshToken');
            await AsyncStorage.removeItem('@FarmApp:user');
            
            // Aqui poderia disparar um evento para redirecionar para a tela de login
            // EventEmitter.emit('logout');
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Métodos para requisições HTTP
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();