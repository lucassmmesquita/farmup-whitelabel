// src/screens/common/LoadingScreen.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Animated, Easing } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { useClientConfig } from '@hooks/useClientConfig';
import LottieView from 'lottie-react-native';
import styled from 'styled-components/native';

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
`;

const Logo = styled(Animated.Image)`
  width: 200px;
  height: 80px;
  resize-mode: contain;
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

const LoadingText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.subtext};
  margin-top: ${props => props.theme.spacing.lg}px;
`;

const LottieContainer = styled(View)`
  width: 100px;
  height: 100px;
`;

export const LoadingScreen: React.FC = () => {
  const theme = useTheme();
  const { name, logoUrl } = useClientConfig();
  const fadeAnim = new Animated.Value(0);
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    <Container theme={theme}>
      <Logo 
        source={logoUrl} 
        style={{ opacity: fadeAnim }} 
        theme={theme}
      />
      
      <LottieContainer>
        {/* Nota: Na implementação real, seria usado um arquivo Lottie de loading */}
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LottieContainer>
      
      <LoadingText theme={theme}>Carregando...</LoadingText>
    </Container>
  );
};