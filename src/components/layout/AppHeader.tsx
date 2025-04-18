// src/components/layout/AppHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';
import { useClientConfig } from '@hooks/useClientConfig';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightIconPress?: () => void;
  showLogo?: boolean;
}

const HeaderContainer = styled(View)`
  height: 60px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${props => props.theme.spacing.md}px;
  background-color: ${props => props.theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const HeaderTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  color: ${props => props.theme.colors.text};
  flex: 1;
  text-align: center;
`;

const LogoImage = styled(Image)`
  height: 30px;
  width: 120px;
  resize-mode: contain;
`;

const IconButton = styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  rightIcon,
  onRightIconPress,
  showLogo = false,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { name, logoUrl } = useClientConfig();
  
  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={theme.colors.background} 
      />
      <HeaderContainer theme={theme}>
        <IconButton
          onPress={showBack ? () => navigation.goBack() : undefined}
          disabled={!showBack}
          activeOpacity={0.7}
        >
          {showBack && <Feather name="arrow-left" size={24} color={theme.colors.text} />}
        </IconButton>
        
        {showLogo ? (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <LogoImage source={logoUrl} />
          </View>
        ) : (
          <HeaderTitle theme={theme}>{title || name}</HeaderTitle>
        )}
        
        <IconButton
          onPress={onRightIconPress}
          disabled={!rightIcon || !onRightIconPress}
          activeOpacity={0.7}
        >
          {rightIcon && <Feather name={rightIcon} size={24} color={theme.colors.text} />}
        </IconButton>
      </HeaderContainer>
    </>
  );
};