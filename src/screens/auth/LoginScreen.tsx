// src/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthNavigator';
import { Button } from '@components/common/Button';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@hooks/useTheme';
import { useClientConfig } from '@hooks/useClientConfig';
import styled from 'styled-components/native';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

const ContentContainer = styled(View)`
  flex: 1;
  padding: ${props => props.theme.spacing.xl}px;
  justify-content: center;
`;

const LogoContainer = styled(View)`
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl}px;
  margin-top: ${props => props.theme.spacing.xl}px;
`;

const Logo = styled(Image)`
  width: 200px;
  height: 80px;
  resize-mode: contain;
`;

const Title = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.bold};
  font-size: ${props => props.theme.typography.fontSize.xxl}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg}px;
  text-align: center;
`;

const InputContainer = styled(View)`
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const InputLabel = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const StyledInput = styled(TextInput)`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.roundness.md}px;
  padding: ${props => props.theme.spacing.md}px;
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const PasswordContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.roundness.md}px;
  padding-right: ${props => props.theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const PasswordInput = styled(TextInput)`
  flex: 1;
  padding: ${props => props.theme.spacing.md}px;
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
`;

const ButtonContainer = styled(View)`
  margin-top: ${props => props.theme.spacing.xl}px;
`;

const ForgotPasswordText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.primary};
  text-align: right;
  margin-top: ${props => props.theme.spacing.sm}px;
`;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const theme = useTheme();
  const { name, logoUrl } = useClientConfig();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulação de login (substituir por chamada real à API)
      setTimeout(async () => {
        // Simular token de autenticação
        await AsyncStorage.setItem('@FarmApp:token', 'dummy-auth-token');
        await AsyncStorage.setItem('@FarmApp:refreshToken', 'dummy-refresh-token');
        
        // Simular dados do usuário
        const userDataMock = {
          id: '123',
          name: 'Usuário de Teste',
          email: email,
          role: 'manager',
        };
        
        await AsyncStorage.setItem('@FarmApp:user', JSON.stringify(userDataMock));
        
        // Recarregar o aplicativo para mostrar a tela principal
        // Na implementação real, um evento seria disparado para atualizar o estado de autenticação
        setLoading(false);
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente.');
    }
  };
  
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };
  
  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'} theme={theme}>
      <ScrollContainer contentContainerStyle={{ flexGrow: 1 }}>
        <ContentContainer theme={theme}>
          <LogoContainer theme={theme}>
            {logoUrl ? (
              <Logo source={logoUrl} />
            ) : (
              <Title theme={theme}>{name}</Title>
            )}
          </LogoContainer>
          
          <InputContainer theme={theme}>
            <InputLabel theme={theme}>E-mail</InputLabel>
            <StyledInput
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              theme={theme}
            />
          </InputContainer>
          
          <InputContainer theme={theme}>
            <InputLabel theme={theme}>Senha</InputLabel>
            <PasswordContainer theme={theme}>
              <PasswordInput
                placeholder="Digite sua senha"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                theme={theme}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.colors.subtext} />
              </TouchableOpacity>
            </PasswordContainer>
            
            <TouchableOpacity onPress={handleForgotPassword}>
              <ForgotPasswordText theme={theme}>Esqueceu a senha?</ForgotPasswordText>
            </TouchableOpacity>
          </InputContainer>
          
          <ButtonContainer theme={theme}>
            <Button
              title="Entrar"
              onPress={handleLogin}
              fullWidth
              loading={loading}
            />
          </ButtonContainer>
        </ContentContainer>
      </ScrollContainer>
    </Container>
  );
};