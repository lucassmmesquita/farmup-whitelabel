// src/screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthNavigator';
import { Button } from '@components/common/Button';
import { useTheme } from '@hooks/useTheme';
import styled from 'styled-components/native';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

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

const Title = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.bold};
  font-size: ${props => props.theme.typography.fontSize.xl}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md}px;
  text-align: center;
`;

const Subtitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: ${props => props.theme.spacing.xl}px;
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

const ButtonContainer = styled(View)`
  margin-top: ${props => props.theme.spacing.xl}px;
`;

const BackToLoginText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-top: ${props => props.theme.spacing.lg}px;
`;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const theme = useTheme();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleResetPassword = () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu e-mail.');
      return;
    }
    
    setLoading(true);
    
    // Simulação de envio de e-mail de recuperação (substituir por chamada real à API)
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'E-mail enviado',
        'Verifique sua caixa de entrada para instruções de recuperação de senha.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 1500);
  };
  
  const handleBackToLogin = () => {
    navigation.goBack();
  };
  
  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'} theme={theme}>
      <ScrollContainer contentContainerStyle={{ flexGrow: 1 }}>
        <ContentContainer theme={theme}>
          <Title theme={theme}>Recuperar Senha</Title>
          <Subtitle theme={theme}>
            Informe seu e-mail para receber instruções de recuperação de senha.
          </Subtitle>
          
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
          
          <ButtonContainer theme={theme}>
            <Button
              title="Enviar instruções"
              onPress={handleResetPassword}
              fullWidth
              loading={loading}
            />
          </ButtonContainer>
          
          <TouchableOpacity onPress={handleBackToLogin}>
            <BackToLoginText theme={theme}>Voltar para o login</BackToLoginText>
          </TouchableOpacity>
        </ContentContainer>
      </ScrollContainer>
    </Container>
  );
};