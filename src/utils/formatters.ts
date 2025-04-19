// src/utils/formatters.ts
export const formatCurrency = (value: number): string => {
    return `R$ ${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };
  
  export const formatPercentage = (value: number): string => {
    return `${value.toFixed(2).replace('.', ',')}%`;
  };
  
  export const formatNumber = (value: number, decimalPlaces: number = 0): string => {
    return value.toFixed(decimalPlaces).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };