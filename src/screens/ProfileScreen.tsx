// src/screens/profile/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { useTheme } from '@hooks/useTheme';
import { useClientConfig } from '@hooks/useClientConfig';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import { clientConfigs } from '@config/theme/themeConfig';

// Mock de dados do usuário
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  photo?: string;
}

// Componentes estilizados
const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ProfileContent = styled(ScrollView)`
  flex: 1;
  padding: ${props => props.theme.spacing.md}px;
`;

const ProfileHeader = styled(View)`
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

const ProfileAvatar = styled(View)`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: ${props => `${props.theme.colors.primary}15`};
  justify-content: center;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const ProfileName = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.bold};
  font-size: ${props => props.theme.typography.fontSize.xl}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const ProfileEmail = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.subtext};
`;

const ProfileRole = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.primary};
  margin-top: ${props => props.theme.spacing.xs}px;
`;

const SectionTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md}px;
  margin-top: ${props => props.theme.spacing.lg}px;
`;

const SettingItem = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${props => props.theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const SettingLabel = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
`;

const ThemeRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const ThemeCard = styled(TouchableOpacity)<{ selected: boolean }>`
  width: 48%;
  padding: ${props => props.theme.spacing.md}px;
  border-radius: ${props => props.theme.roundness.md}px;
  border-width: 2px;
  border-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  align-items: center;
`;

const ThemeName = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-top: ${props => props.theme.spacing.sm}px;
`;

const ColorCircle = styled(View)<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${props => props.color};
  margin-horizontal: ${props => props.theme.spacing.xs}px;
`;

const ColorsRow = styled(View)`
  flex-direction: row;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const ButtonContainer = styled(View)`
  margin-top: ${props => props.theme.spacing.xl}px;
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { name, logoUrl } = useClientConfig();
  const [user, setUser] = useState<UserData | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState('default');
  
  useEffect(() => {
    // Carregar dados do usuário
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('@FarmApp:user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);
  
  const handleChangeClient = async (clientId: string) => {
    try {
      setSelectedClientId(clientId);
      
      // Na implementação real, isso seria feito através do hook useClientConfig
      alert(`Tema alterado para: ${clientConfigs[clientId].name}`);
    } catch (error) {
      console.error('Error changing client theme:', error);
      Alert.alert('Erro', 'Não foi possível alterar o tema.');
    }
  };
  
  const handleLogout = async () => {
    try {
      // Limpar dados de autenticação
      await AsyncStorage.removeItem('@FarmApp:token');
      await AsyncStorage.removeItem('@FarmApp:refreshToken');
      await AsyncStorage.removeItem('@FarmApp:user');
      
      // Na implementação real, um evento seria disparado para atualizar o estado de autenticação
      alert('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout.');
    }
  };
  
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'operator': return 'Operador';
      default: return 'Usuário';
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <Container theme={theme}>
      <AppHeader title="Perfil" />
      
      <ProfileContent theme={theme}>
        <ProfileHeader theme={theme}>
          <ProfileAvatar theme={theme}>
            <Feather name="user" size={48} color={theme.colors.primary} />
          </ProfileAvatar>
          <ProfileName theme={theme}>{user.name}</ProfileName>
          <ProfileEmail theme={theme}>{user.email}</ProfileEmail>
          <ProfileRole theme={theme}>{getRoleLabel(user.role)}</ProfileRole>
        </ProfileHeader>
        
        <Card elevation="light">
          <SectionTitle theme={theme}>Configurações</SectionTitle>
          
          <SettingItem theme={theme}>
            <SettingLabel theme={theme}>Notificações push</SettingLabel>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.inactive, true: `${theme.colors.primary}50` }}
              thumbColor={notificationsEnabled ? theme.colors.primary : '#f4f3f4'}
            />
          </SettingItem>
        </Card>
        
        <SectionTitle theme={theme}>Personalização</SectionTitle>
        
        <Card elevation="light">
          <ThemeRow theme={theme}>
            <ThemeCard 
              selected={selectedClientId === 'default'}
              onPress={() => handleChangeClient('default')}
              theme={theme}
            >
              <Feather 
                name="check-circle" 
                size={24} 
                color={selectedClientId === 'default' ? theme.colors.primary : theme.colors.inactive} 
              />
              <ThemeName theme={theme}>FarmApp</ThemeName>
              <ColorsRow theme={theme}>
                <ColorCircle color={clientConfigs.default.theme.colors?.primary || ''} theme={theme} />
                <ColorCircle color={clientConfigs.default.theme.colors?.secondary || ''} theme={theme} />
              </ColorsRow>
            </ThemeCard>
            
            <ThemeCard 
              selected={selectedClientId === 'clientA'}
              onPress={() => handleChangeClient('clientA')}
              theme={theme}
            >
              <Feather 
                name="check-circle" 
                size={24} 
                color={selectedClientId === 'clientA' ? theme.colors.primary : theme.colors.inactive} 
              />
              <ThemeName theme={theme}>Saúde Farma</ThemeName>
              <ColorsRow theme={theme}>
                <ColorCircle color={clientConfigs.clientA.theme.colors?.primary || ''} theme={theme} />
                <ColorCircle color={clientConfigs.clientA.theme.colors?.secondary || ''} theme={theme} />
              </ColorsRow>
            </ThemeCard>
          </ThemeRow>
          
          <ThemeRow theme={theme}>
            <ThemeCard 
              selected={selectedClientId === 'clientB'}
              onPress={() => handleChangeClient('clientB')}
              theme={theme}
            >
              <Feather 
                name="check-circle" 
                size={24} 
                color={selectedClientId === 'clientB' ? theme.colors.primary : theme.colors.inactive} 
              />
              <ThemeName theme={theme}>Vida Farma</ThemeName>
              <ColorsRow theme={theme}>
                <ColorCircle color={clientConfigs.clientB.theme.colors?.primary || ''} theme={theme} />
                <ColorCircle color={clientConfigs.clientB.theme.colors?.secondary || ''} theme={theme} />
              </ColorsRow>
            </ThemeCard>
            
            <View style={{ width: '48%' }} />
          </ThemeRow>
        </Card>
        
        <ButtonContainer theme={theme}>
          <Button 
            title="Sair" 
            variant="outline" 
            onPress={handleLogout}
            fullWidth
          />
        </ButtonContainer>
      </ProfileContent>
    </Container>
  );
};