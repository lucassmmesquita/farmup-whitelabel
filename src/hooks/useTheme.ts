// src/hooks/useTheme.ts
import { useContext } from 'react';
import { ThemeContext } from '@config/theme/ThemeContext';
import { ThemeType, defaultTheme } from '@config/theme';

export const useTheme = (): ThemeType => {
  const theme = useContext(ThemeContext);
  return theme || defaultTheme;
};