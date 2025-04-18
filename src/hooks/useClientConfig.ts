// src/hooks/useClientConfig.ts
import { useContext } from 'react';
import { ClientConfigContext } from '@config/theme/ThemeContext';
import { ClientConfig, clientConfigs } from '@config/theme';

export const useClientConfig = (): ClientConfig => {
  const clientConfig = useContext(ClientConfigContext);
  return clientConfig || clientConfigs.default;
};