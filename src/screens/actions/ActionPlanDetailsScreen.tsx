// src/screens/actions/ActionPlanDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import { AppHeader } from '@components/layout/AppHeader';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { useTheme } from '@hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { ActionPlan } from '@/types/metrics';
import actionPlanService from '@/services/api/actionPlanService';

type RouteParams = {
  ActionPlanDetails: {
    actionId: string;
  };
};

const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ContentContainer = styled(ScrollView)`
  flex: 1;
  padding: ${props => props.theme.spacing.md}px;
`;

const SectionTitle = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md}px;
  margin-top: ${props => props.theme.spacing.lg}px;
`;

const InfoText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const PriorityBadge = styled(View)<{ priority: string }>`
  padding-vertical: ${props => props.theme.spacing.xs / 2}px;
  padding-horizontal: ${props => props.theme.spacing.sm}px;
  border-radius: ${props => props.theme.roundness.sm}px;
  background-color: ${props => {
    switch (props.priority) {
      case 'high': return `${props.theme.colors.error}15`;
      case 'medium': return `${props.theme.colors.warning}15`;
      default: return `${props.theme.colors.primary}15`;
    }
  }};
  align-self: flex-start;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const PriorityText = styled(Text)<{ priority: string }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => {
    switch (props.priority) {
      case 'high': return props.theme.colors.error;
      case 'medium': return props.theme.colors.warning;
      default: return props.theme.colors.primary;
    }
  }};
`;

const DetailRow = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const DetailIcon = styled(View)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${props => `${props.theme.colors.primary}15`};
  justify-content: center;
  align-items: center;
  margin-right: ${props => props.theme.spacing.md}px;
`;

const DetailText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const StepItem = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const StepNumber = styled(View)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${props => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-right: ${props => props.theme.spacing.sm}px;
`;

const StepNumberText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: #FFFFFF;
`;

const StepText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const ProductItem = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm}px;
  padding: ${props => props.theme.spacing.sm}px;
  background-color: ${props => `${props.theme.colors.primary}05`};
  border-radius: ${props => props.theme.roundness.sm}px;
`;

const ProductIcon = styled(View)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${props => `${props.theme.colors.primary}15`};
  justify-content: center;
  align-items: center;
  margin-right: ${props => props.theme.spacing.sm}px;
`;

const ProductText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const ActionsContainer = styled(View)`
  margin-top: ${props => props.theme.spacing.lg}px;
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

const PhotoMockContainer = styled(View)`
  height: 200px;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.roundness.md}px;
  margin-vertical: ${props => props.theme.spacing.md}px;
  justify-content: center;
  align-items: center;
  border: 1px dashed ${props => props.theme.colors.border};
`;

const PhotoMockText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.subtext};
  text-align: center;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const ValidationStatusContainer = styled(View)<{ status: string }>`
  padding: ${props => props.theme.spacing.md}px;
  margin-vertical: ${props => props.theme.spacing.md}px;
  border-radius: ${props => props.theme.roundness.md}px;
  background-color: ${props => {
    switch (props.status) {
      case 'approved': return `${props.theme.colors.success}15`;
      case 'rejected': return `${props.theme.colors.error}15`;
      default: return `${props.theme.colors.warning}15`;
    }
  }};
`;

const ValidationStatusTitle = styled(Text)<{ status: string }>`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => {
    switch (props.status) {
      case 'approved': return props.theme.colors.success;
      case 'rejected': return props.theme.colors.error;
      default: return props.theme.colors.warning;
    }
  }};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const ValidationFeedback = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
`;

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ActionPlanDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<RouteParams, 'ActionPlanDetails'>>();
  const navigation = useNavigation();
  const { actionId } = route.params;
  
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [photoMock, setPhotoMock] = useState<boolean>(false);
  
  useEffect(() => {
    const loadActionPlan = async () => {
      setLoading(true);
      try {
        const plan = actionPlanService.getActionPlanById(actionId);
        if (plan) {
          setActionPlan(plan);
          if (plan.executionPhoto) {
            setPhotoMock(true);
          }
        } else {
          Alert.alert('Erro', 'Plano de ação não encontrado.');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Erro ao carregar plano de ação:', error);
        Alert.alert('Erro', 'Não foi possível carregar o plano de ação.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    
    loadActionPlan();
  }, [actionId, navigation]);
  
  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'high': return 'Alta Prioridade';
      case 'medium': return 'Média Prioridade';
      default: return 'Baixa Prioridade';
    }
  };
  
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em andamento';
      case 'completed': return 'Concluído';
      case 'validated': return 'Validado';
      case 'rejected': return 'Rejeitado';
      default: return 'Desconhecido';
    }
  };
  
  const handleStartAction = async () => {
    if (!actionPlan) return;
    
    try {
      const updatedPlan = actionPlanService.updateActionPlanStatus(actionPlan.id, 'in_progress');
      if (updatedPlan) {
        setActionPlan(updatedPlan);
        Alert.alert('Sucesso', 'Plano de ação iniciado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao iniciar plano de ação:', error);
      Alert.alert('Erro', 'Não foi possível iniciar o plano de ação.');
    }
  };
  
  const handleCapturePhoto = () => {
    // Simulação de captura de foto
    Alert.alert(
      'Captura de Foto',
      'Em um ambiente de produção, esta ação abriria a câmera para capturar uma foto.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Simular Foto', 
          onPress: () => {
            setPhotoMock(true);
            Alert.alert('Foto capturada com sucesso!');
          }
        }
      ]
    );
  };
  
  const handleSubmitExecution = async () => {
    if (!actionPlan) {
      Alert.alert('Erro', 'Plano de ação não encontrado.');
      return;
    }
    
    if (!photoMock) {
      Alert.alert('Erro', 'É necessário capturar uma foto para finalizar a execução.');
      return;
    }
    
    setSubmitting(true);
    try {
      // Submeter foto
      const mockPhotoUri = 'mock-photo-uri';
      const updatedPlan = actionPlanService.submitValidationPhoto(actionPlan.id, mockPhotoUri);
      if (updatedPlan) {
        setActionPlan(updatedPlan);
        Alert.alert(
          'Sucesso', 
          'Execução registrada com sucesso! Sua foto será revisada pela equipe.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Erro ao submeter execução:', error);
      Alert.alert('Erro', 'Não foi possível submeter a execução.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Container theme={theme}>
        <AppHeader title="Detalhes do Plano" showBack />
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingContainer>
      </Container>
    );
  }
  
  if (!actionPlan) return null;
  
  return (
    <Container theme={theme}>
      <AppHeader 
        title="Plano de Ação" 
        showBack
        subtitle={actionPlan.status ? getStatusLabel(actionPlan.status) : undefined}
      />
      
      <ContentContainer theme={theme}>
        <SectionTitle theme={theme}>{actionPlan.title}</SectionTitle>
        
        <PriorityBadge priority={actionPlan.priority} theme={theme}>
          <PriorityText priority={actionPlan.priority} theme={theme}>
            {getPriorityLabel(actionPlan.priority)}
          </PriorityText>
        </PriorityBadge>
        
        <InfoText theme={theme}>{actionPlan.description}</InfoText>
        
        <DetailRow theme={theme}>
          <DetailIcon theme={theme}>
            <Feather name="calendar" size={16} color={theme.colors.primary} />
          </DetailIcon>
          <DetailText theme={theme}>Prazo recomendado: {actionPlan.deadline}</DetailText>
        </DetailRow>
        
        <SectionTitle theme={theme}>Etapas</SectionTitle>
        
        {actionPlan.steps.map((step, index) => (
          <StepItem key={index} theme={theme}>
            <StepNumber theme={theme}>
              <StepNumberText theme={theme}>{index + 1}</StepNumberText>
            </StepNumber>
            <StepText theme={theme}>{step}</StepText>
          </StepItem>
        ))}
        
        {actionPlan.products && actionPlan.products.length > 0 && (
          <>
            <SectionTitle theme={theme}>Produtos Envolvidos</SectionTitle>
            
            {actionPlan.products.map((product, index) => (
              <ProductItem key={index} theme={theme}>
                <ProductIcon theme={theme}>
                  <Feather name="box" size={14} color={theme.colors.primary} />
                </ProductIcon>
                <ProductText theme={theme}>{product}</ProductText>
              </ProductItem>
            ))}
          </>
        )}
        
        {/* Seção de envio de foto */}
        {actionPlan.status === 'in_progress' && (
          <>
            <SectionTitle theme={theme}>Finalizar Execução</SectionTitle>
            <InfoText theme={theme}>
              Para validar a execução deste plano, você precisa tirar uma foto
              que comprove a implementação das ações recomendadas.
            </InfoText>
            
            {photoMock ? (
              <PhotoMockContainer theme={theme}>
                <Feather name="image" size={48} color={theme.colors.primary} />
                <PhotoMockText theme={theme}>
                  Foto capturada (simulação)
                </PhotoMockText>
              </PhotoMockContainer>
            ) : (
              <PhotoMockContainer theme={theme}>
                <Feather name="camera" size={48} color={theme.colors.inactive} />
                <PhotoMockText theme={theme}>
                  Nenhuma foto capturada
                </PhotoMockText>
              </PhotoMockContainer>
            )}
            
            <Button 
              title="Capturar Foto" 
              onPress={handleCapturePhoto}
              icon={<Feather name="camera" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />}
              fullWidth
              style={{ marginTop: theme.spacing.md }}
            />
            
            <Button 
              title="Enviar e Finalizar Execução" 
              onPress={handleSubmitExecution}
              fullWidth
              loading={submitting}
              disabled={!photoMock || submitting}
              style={{ marginTop: theme.spacing.lg }}
            />
          </>
        )}
        
        {/* Status de validação (após envio da foto) */}
        {actionPlan.validationStatus && (
          <ValidationStatusContainer status={actionPlan.validationStatus} theme={theme}>
            <ValidationStatusTitle status={actionPlan.validationStatus} theme={theme}>
              {actionPlan.validationStatus === 'pending' 
                ? 'Aguardando Validação' 
                : actionPlan.validationStatus === 'approved'
                ? 'Execução Aprovada'
                : 'Execução Rejeitada'
              }
            </ValidationStatusTitle>
            
            {actionPlan.validationFeedback && (
              <ValidationFeedback theme={theme}>
                {actionPlan.validationFeedback}
              </ValidationFeedback>
            )}
          </ValidationStatusContainer>
        )}
        
        {/* Mostrar foto de execução (se existir) */}
        {actionPlan.status !== 'in_progress' && actionPlan.executionPhoto && (
          <>
            <SectionTitle theme={theme}>Comprovação de Execução</SectionTitle>
            <PhotoMockContainer theme={theme}>
              <Feather name="check-circle" size={48} color={theme.colors.success} />
              <PhotoMockText theme={theme}>
                Foto de execução validada
              </PhotoMockText>
            </PhotoMockContainer>
          </>
        )}
        
        {/* Botões de ação dependendo do status */}
        <ActionsContainer theme={theme}>
          {actionPlan.status === 'pending' && (
            <Button 
              title="Iniciar Execução" 
              onPress={handleStartAction}
              fullWidth
              icon={<Feather name="play" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />}
            />
          )}
        </ActionsContainer>
      </ContentContainer>
    </Container>
  );
};

export default ActionPlanDetailsScreen;