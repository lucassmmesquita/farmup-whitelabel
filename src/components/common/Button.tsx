// src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const ButtonContainer = styled(TouchableOpacity)<{
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  fullWidth: boolean;
  theme: any;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.roundness.md}px;
  width: ${props => (props.fullWidth ? '100%' : 'auto')};
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  
  /* Size styles */
  padding: ${props => {
    switch (props.size) {
      case 'small': return `${props.theme.spacing.xs}px ${props.theme.spacing.md}px`;
      case 'large': return `${props.theme.spacing.md}px ${props.theme.spacing.xl}px`;
      default: return `${props.theme.spacing.sm}px ${props.theme.spacing.lg}px`;
    }
  }};
  
  /* Variant styles */
  background-color: ${props => {
    switch (props.variant) {
      case 'secondary': return props.theme.colors.secondary;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return props.theme.colors.primary;
    }
  }};
  
  border-width: ${props => (props.variant === 'outline' ? 1 : 0)}px;
  border-color: ${props => props.theme.colors.primary};
`;

const ButtonText = styled(Text)<{
  variant: ButtonVariant;
  size: ButtonSize;
  theme: any;
}>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  
  /* Size styles */
  font-size: ${props => {
    switch (props.size) {
      case 'small': return `${props.theme.typography.fontSize.sm}px`;
      case 'large': return `${props.theme.typography.fontSize.lg}px`;
      default: return `${props.theme.typography.fontSize.md}px`;
    }
  }};
  
  /* Variant styles */
  color: ${props => {
    switch (props.variant) {
      case 'outline': 
      case 'ghost': 
        return props.theme.colors.primary;
      default: 
        return '#FFFFFF';
    }
  }};
  
  margin-left: ${props => (props.icon ? props.theme.spacing.xs : 0)}px;
`;

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const theme = useTheme();
  
  return (
    <ButtonContainer
      onPress={onPress}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={style}
      fullWidth={fullWidth}
      theme={theme}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#FFFFFF'} />
      ) : (
        <>
          {icon}
          <ButtonText 
            variant={variant} 
            size={size} 
            style={textStyle}
            theme={theme}
          >
            {title}
          </ButtonText>
        </>
      )}
    </ButtonContainer>
  );
};