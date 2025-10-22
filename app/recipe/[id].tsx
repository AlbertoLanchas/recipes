import { IngredientList } from '@/components/IngredientList';
import { spacing } from '@/constants/themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { getRecipeByIdAndDiet, hasMultipleDietVersions, isRecipeVegan } from '@/data/recipes/index';
import { RecipeData } from '@/types/recipe-new';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Heart, Minus, Plus, RotateCcw, Share, TrendingUp, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Platform,
  Share as RNShare,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const recipeId = Array.isArray(id) ? id[0] : (id as string);
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { language, t } = useLanguage();
  const { isFavorite, addFavorite, removeFavorite, getRecipeProgress, updateProgress } = useUser();
  const [selectedServings, setSelectedServings] = useState(4);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const progressBarWidth = React.useRef(new Animated.Value(0)).current;
  const [showResetButton, setShowResetButton] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);

  // Inicializar preferencias desde UserContext
  const { measurementUnit: defaultMeasurementUnit, dietPreference: defaultDietPreference } = useUser();
  const [isVegan, setIsVegan] = useState(false);
  const [currentMeasurementUnit, setCurrentMeasurementUnit] = useState<'metric' | 'imperial'>('metric');

  const recipe: RecipeData | undefined = getRecipeByIdAndDiet(recipeId, isVegan);

  const switchAnimation = React.useRef(new Animated.Value(0)).current;
  const unitSwitchAnimation = React.useRef(new Animated.Value(0)).current;

  // Sincronizar con las preferencias del contexto al cargar
  useEffect(() => {
    // Si la receta tiene múltiples versiones, usar preferencia del usuario
    // Si no tiene múltiples versiones, usar si la receta es inherentemente vegana
    const shouldBeVegan = hasMultipleDietVersions(recipeId)
      ? defaultDietPreference === 'vegan'
      : isRecipeVegan(recipeId);

    setIsVegan(shouldBeVegan);
    setCurrentMeasurementUnit(defaultMeasurementUnit);
    switchAnimation.setValue(shouldBeVegan ? 1 : 0);
    unitSwitchAnimation.setValue(defaultMeasurementUnit === 'imperial' ? 1 : 0);
  }, [defaultDietPreference, defaultMeasurementUnit, recipeId]);

  // Recargar receta cuando cambie la dieta seleccionada
  useEffect(() => {
    // Esto forzará la recarga de la receta con la nueva dieta
    setCompletedSteps([]);
    setShowResetButton(false);
    setExpandedPhases([]);
    if (recipe?.servings) {
      setSelectedServings(recipe.servings);
    }
  }, [isVegan]);

  useEffect(() => {
    if (recipe) {
      const progress = getRecipeProgress(recipe.id);
      if (progress) {
        setCompletedSteps(progress.completedSteps);
        const percentage = progress.percentage;
        setShowResetButton(percentage > 0);

        // Find first incomplete phase and expand it
        const firstIncompletePhase = recipe.phases.find(phase => {
          const phaseTranslation = phase.translations[language] || phase.translations['es'];
          return !phaseTranslation?.steps.every((_, stepIndex) =>
            progress.completedSteps.includes(`${phase.id}-step-${stepIndex}`)
          );
        });
        if (firstIncompletePhase) {
          setExpandedPhases([firstIncompletePhase.id]);
        }

        // Animate progress bar
        Animated.timing(progressBarWidth, {
          toValue: percentage,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      } else {
        // If no progress, expand first phase
        if (recipe.phases.length > 0) {
          setExpandedPhases([recipe.phases[0].id]);
        }
      }
    }
  }, [recipe]);

  if (!recipe) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <Text>{t('recipeNotFound')}</Text>
      </SafeAreaView>
    );
  }

  const title = (recipe.translations[language]?.title)
    || (recipe.translations['en']?.title)
    || (recipe.translations['es']?.title)
    || recipe.id;
  const description = (recipe.translations[language]?.description)
    || (recipe.translations['en']?.description)
    || (recipe.translations['es']?.description)
    || '';

  // Imagen de detalle: para recetas del carrusel usar las imágenes de background del carrusel (sin blur);
  // para el resto usar la imagen de la card. Debe ser estable aunque cambie la dieta/unidades.
  const carouselDetailImageById: Record<string, any> = {
    'saiyans-takoyaki': require('@/assets/carousel/background/takoyaki-background.png'),
    'meat': require('@/assets/carousel/background/meat-background.png'),
    'sopa-udon': require('@/assets/carousel/background/ramen-background.png'),
    'caprese-salad': require('@/assets/carousel/background/salad-background.jpg'),
    'spirits-bollos-rellenos': require('@/assets/carousel/background/buns-background.jpeg'),
    'scientists-pan': require('@/assets/carousel/background/bread-background.png'),
  };
  // Fijar la imagen del héroe basada en el id de la ruta (estable),
  // evitando que cambie al alternar switches que puedan devolver otra variante de la receta.
  const initialHeroImage = carouselDetailImageById[recipeId] || recipe?.image;
  const heroImageRef = React.useRef<any>(initialHeroImage);
  useEffect(() => {
    // Si venimos de navegación y no se inicializó aún, capturar la imagen inicial
    if (!heroImageRef.current && initialHeroImage) {
      heroImageRef.current = initialHeroImage;
    }
    // No actualizar en cambios de dieta/unidades; sólo se fija por id de ruta
  }, [recipeId]);
  const heroImageSource = heroImageRef.current;

  const handleFavoritePress = () => {
    if (isFavorite(recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe.id);
    }
  };

  const getImageSource = (image: any) => {
    if (typeof image === 'string') {
      return { uri: image };
    }
    return image;
  };


  const adjustServings = (increment: boolean) => {
    const newServings = increment
      ? Math.min(selectedServings + 1, 12)
      : Math.max(selectedServings - 1, 1);
    setSelectedServings(newServings);
  };

  const toggleDietType = () => {
    // Solo permitir cambio si la receta tiene versiones múltiples
    if (!hasMultipleDietVersions(recipeId)) {
      return;
    }

    const newIsVegan = !isVegan;
    setIsVegan(newIsVegan);

    Animated.timing(switchAnimation, {
      toValue: newIsVegan ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleMeasurementUnit = () => {
    const newUnit = currentMeasurementUnit === 'metric' ? 'imperial' : 'metric';
    setCurrentMeasurementUnit(newUnit);

    Animated.timing(unitSwitchAnimation, {
      toValue: newUnit === 'imperial' ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleStepCompletion = (stepId: string) => {
    const newCompletedSteps = completedSteps.includes(stepId)
      ? completedSteps.filter(id => id !== stepId)
      : [...completedSteps, stepId];

    setCompletedSteps(newCompletedSteps);

    // Calculate total steps from all phases
    const totalSteps = recipe.phases.reduce((total, phase) => {
      const phaseTranslation = phase.translations[language] || phase.translations['es'];
      return total + (phaseTranslation?.steps.length || 0);
    }, 0);
    const percentage = Math.round((newCompletedSteps.length / totalSteps) * 100);

    // Update progress in context
    updateProgress(recipe.id, newCompletedSteps, percentage);

    // Check if current phase is completed and handle expansion
    const currentPhase = recipe.phases.find(phase => {
      const phaseTranslation = phase.translations[language] || phase.translations['es'];
      return phaseTranslation?.steps.some((_, stepIndex) =>
        `${phase.id}-step-${stepIndex}` === stepId
      );
    });

    if (currentPhase) {
      const phaseTranslation = currentPhase.translations[language] || currentPhase.translations['es'];
      const phaseCompleted = phaseTranslation?.steps.every((_, stepIndex) =>
        newCompletedSteps.includes(`${currentPhase.id}-step-${stepIndex}`)
      ) || false;

      if (phaseCompleted) {
        // Close current phase and open next incomplete phase
        const nextIncompletePhase = recipe.phases.find(phase => {
          if (phase.id === currentPhase.id) return false;
          const phaseTranslation = phase.translations[language] || phase.translations['es'];
          return !phaseTranslation?.steps.every((_, stepIndex) =>
            newCompletedSteps.includes(`${phase.id}-step-${stepIndex}`)
          );
        });

        if (nextIncompletePhase) {
          setExpandedPhases([nextIncompletePhase.id]);
        } else {
          // All phases completed, collapse all
          setExpandedPhases([]);
        }
      }
    }

    // Animate progress bar
    Animated.timing(progressBarWidth, {
      toValue: percentage,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setShowResetButton(percentage > 0);
  };

  const togglePhaseExpansion = (phaseId: string) => {
    setExpandedPhases(prev =>
      prev.includes(phaseId)
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };
  const resetProgress = () => {
    setCompletedSteps([]);
    updateProgress(recipe.id, [], 0);
    setShowResetButton(false);
    // Reset to first phase expanded
    if (recipe.phases.length > 0) {
      setExpandedPhases([recipe.phases[0].id]);
    }

    // Animate progress bar to 0
    Animated.timing(progressBarWidth, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const handleShare = async () => {
    const appLink = 'https://play.google.com/store/apps/details?id=com.bydark.animefoodrecipe';
    const recipeName = title;
    const localized = t('shareRecipeMessage')
      .replace('{recipe}', recipeName)
      .replace('{link}', appLink);
    const webRecipeUrl = `https://animerecipes.app/recipe/${recipe.id}`;
    const composedMessage = `${localized}\n\n${webRecipeUrl}`;

    if (Platform.OS === 'web') {
      // Web Share API si disponible
      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        try {
          await (navigator as any).share({
            title: recipeName,
            text: composedMessage,
            url: appLink,
          });
          return;
        } catch {
          // continúa con fallback
        }
      }

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(composedMessage);
          alert(t('linkCopied'));
        } else {
          window.prompt(t('copyLinkBelow'), composedMessage);
        }
      } catch (error) {
        window.prompt(t('copyLinkBelow'), composedMessage);
      }
    } else {
      // Nativo
      try {
        await RNShare.share({
          message: composedMessage,
          title: recipeName,
          url: appLink,
        });
      } catch (error) {
        console.error('Error sharing recipe:', error);
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      position: 'relative',
      height: 400,
    },
    heroImage: {
      width: '100%',
      height: '100%',
    },
    imageOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
    },
    topActions: {
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      paddingHorizontal: spacing.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 10,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? 'rgba(26, 32, 56, 0.9)' : 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.3)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.5,
      shadowRadius: 4,
      elevation: 4,
    },
    favoriteButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? 'rgba(26, 32, 56, 0.9)' : 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.3)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.5,
      shadowRadius: 4,
      elevation: 4,
    },
    bottomInfo: {
      position: 'absolute',
      bottom: spacing.xl,
      left: spacing.lg,
      right: spacing.lg,
      zIndex: 10,
    },
    recipeTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
      marginBottom: spacing.sm,
      letterSpacing: -0.8,
      lineHeight: 36,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: spacing.xs,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    description: {
      fontSize: 16,
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.xl,
      fontWeight: '400',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      letterSpacing: -0.5,
    },
    dietSwitchContainer: {
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    dietSwitch: {
      alignItems: 'center',
      gap: spacing.xs,
    },
    switchTrack: {
      width: 70,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    switchThumb: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#FFFFFF',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    switchIcon: {
      fontSize: 18,
    },
    disabledSwitch: {
      opacity: 0.5,
    },
    dietLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      textAlign: 'center',
      marginTop: spacing.xs,
      letterSpacing: -0.1,
    },
    servingSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 18,
      paddingHorizontal: spacing.xs,
      paddingVertical: 4,
      overflow: 'hidden',
      minHeight: 36,
      flexShrink: 1,
    },
    servingButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    servingText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
      marginHorizontal: spacing.sm,
      minWidth: 20,
      textAlign: 'center',
    },
    servingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginHorizontal: spacing.sm,
      flexShrink: 1,
    },
    servingNumberSmall: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '700',
    },
    servingUnitSmall: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '600',
    },
    stepsSection: {
      marginTop: spacing.xl,
    },
    phaseHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDark ? 'rgba(15, 15, 35, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    phaseHeaderCompleted: {
      backgroundColor: isDark ? 'rgba(72, 187, 120, 0.2)' : 'rgba(56, 161, 105, 0.15)',
    },
    phaseHeaderExpanded: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(255, 153, 0, 0.2)',
    },
    phaseHeaderCollapsed: {
      borderRadius: 12,
    },
    phaseContainer: {
      borderRadius: 12,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(30, 144, 255, 1)' : 'rgba(255, 153, 0, 1)',
      backgroundColor: 'white',

      elevation: 2,
      overflow: 'hidden',

    },
    completedPhaseContainer: {
      borderColor: isDark ? 'rgba(72, 187, 120, 0.5)' : 'rgba(56, 161, 105, 0.4)',
    },
    phaseTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    phaseTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,

    },
    completedPhaseTitle: {
      color: theme.success,

    },
    phaseCheckIcon: {
      marginLeft: spacing.xs,
    },
    phaseProgress: {
      fontSize: 12,
      color: theme.textSecondary,
      marginRight: spacing.sm,
    },
    completedPhaseProgress: {
      color: theme.success,
      fontWeight: '600',
    },
    stepsContainer: {
      marginBottom: spacing.lg,
    },
    phaseStepsContainer: {
      backgroundColor: isDark ? 'black' : 'white',
      // padding: spacing.sm,
      // borderBottomLeftRadius: 12,
      // borderBottomRightRadius: 12,

    },
    mainStepsTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: spacing.md,
      letterSpacing: -0.5,
    },
    stepItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      marginBottom: spacing.md,
      borderBottomWidth: 0,
    },
    completedStep: {
      opacity: 0.6,
    },
    stepCheckbox: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.textSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
      marginTop: 2,
    },
    completedCheckbox: {
      backgroundColor: theme.success,
      borderColor: theme.success,
    },
    stepContent: {
      flex: 1,
    },
    stepNumber: {
      fontSize: 11,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    stepText: {
      fontSize: 15,
      color: theme.text,
      lineHeight: 22,
      fontWeight: '400',
    },
    completedStepText: {
      color: theme.textSecondary,
      textDecorationLine: 'line-through',
    },
    progressSection: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: isDark ? 'rgba(15, 15, 35, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      borderTopWidth: 1,
      borderTopColor: theme.border + '40',
      backdropFilter: 'blur(10px)',
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      letterSpacing: -0.2,
    },
    progressPercentage: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.primary,
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: isDark ? 'rgba(159, 122, 234, 0.2)' : 'rgba(49, 130, 206, 0.2)',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: spacing.sm,
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 4,
    },
    progressActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    progressStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressStatsText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginLeft: spacing.xs,
    },
    resetButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 69, 58, 0.3)',
      overflow: 'hidden',
    },
    resetButtonText: {
      fontSize: 14,
      color: '#FFFFFF',
      marginLeft: spacing.xs,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={getImageSource(heroImageSource)} style={styles.heroImage} />

          <View style={styles.imageOverlay}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
              style={{ flex: 1 }}
            />
          </View>

          <View style={styles.topActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
              <ChevronLeft size={22} color={isDark ? "#FFFFFF" : "#FFFFFF"} />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Share size={18} color={isDark ? "#FFFFFF" : "#FFFFFF"} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
                <Heart
                  size={18}
                  color={isFavorite(recipe.id) ? '#FF4444' : '#FFFFFF'}
                  fill={isFavorite(recipe.id) ? '#FF4444' : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomInfo}>
            <Text style={styles.recipeTitle}>{title}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Clock size={14} color="#FFFFFF" />
                <Text style={styles.statText}>{recipe.time} min</Text>
              </View>

              {/* Eliminado: porciones se mostrarán dentro del selector de ingredientes */}
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>{description}</Text>

          {/* Switch Vegan/Omnivore y Switch de Unidades */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md }}>
            {/* Switch de Unidades a la izquierda */}
            <TouchableOpacity
              style={styles.dietSwitch}
              onPress={toggleMeasurementUnit}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.switchTrack,
                  {
                    backgroundColor: unitSwitchAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [isDark ? '#8B5CF6' : '#F59E0B', isDark ? '#3B82F6' : '#10B981'],
                    }),
                  }
                ]}
              >
                <Animated.View
                  style={[
                    styles.switchThumb,
                    {
                      transform: [{
                        translateX: unitSwitchAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [2, 36],
                        })
                      }]
                    }
                  ]}
                >
                  <Text style={styles.switchIcon}>
                    {currentMeasurementUnit === 'metric' ? '📏' : '📐'}
                  </Text>
                </Animated.View>
              </Animated.View>
              <Text style={styles.dietLabel}>
                {t(currentMeasurementUnit)}
              </Text>
            </TouchableOpacity>

            {/* Switch Vegan/Omnivore a la derecha */}
            <TouchableOpacity
              style={[
                styles.dietSwitch,
                !hasMultipleDietVersions(recipeId) && styles.disabledSwitch
              ]}
              onPress={toggleDietType}
              activeOpacity={hasMultipleDietVersions(recipeId) ? 0.8 : 1}
              disabled={!hasMultipleDietVersions(recipeId)}
            >
              <Animated.View
                style={[
                  styles.switchTrack,
                  {
                    backgroundColor: switchAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [isDark ? '#4A90E2' : '#ff9900', '#22C55E'],
                    }),
                  }
                ]}
              >
                <Animated.View
                  style={[
                    styles.switchThumb,
                    {
                      transform: [{
                        translateX: switchAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [2, 36],
                        })
                      }]
                    }
                  ]}
                >
                  <Text style={styles.switchIcon}>
                    {isVegan ? '🌱' : '🥩'}
                  </Text>
                </Animated.View>
              </Animated.View>
              <Text style={styles.dietLabel}>
                {isVegan ? t('vegan') : t('omnivore')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Header con título de ingredientes y selector de porciones */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('ingredients')}</Text>
            <View style={[styles.servingSelector, { maxWidth: 220 }]}>
              <LinearGradient
                colors={isDark ? ['#4A90E2', '#2E5BBA'] : ['#FFB347', '#FF8C00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              <TouchableOpacity
                style={styles.servingButton}
                onPress={() => adjustServings(false)}
              >
                <Minus size={16} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.servingInfo}>
                <Users size={12} color="#FFFFFF" />
                <Text style={styles.servingNumberSmall}>{selectedServings}</Text>
                <Text style={styles.servingUnitSmall}>{t('serve')}</Text>
              </View>

              <TouchableOpacity
                style={styles.servingButton}
                onPress={() => adjustServings(true)}
              >
                <Plus size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <IngredientList
            ingredients={recipe.ingredients}
            servings={selectedServings}
            originalServings={recipe.servings}
            unitSystem={currentMeasurementUnit}
          />

          <View style={styles.stepsSection}>
            <Text style={styles.mainStepsTitle}>{t('instructions')}</Text>
            {recipe.phases.map((phase) => {
              const phaseTranslation = phase.translations[language] || phase.translations['es'];
              const phaseTitle = phaseTranslation?.title || phase.id;
              const isExpanded = expandedPhases.includes(phase.id);
              const completedStepsInPhase = phaseTranslation?.steps.filter((_, stepIndex) =>
                completedSteps.includes(`${phase.id}-step-${stepIndex}`)
              ).length || 0;
              const isPhaseCompleted = phaseTranslation?.steps.every((_, stepIndex) =>
                completedSteps.includes(`${phase.id}-step-${stepIndex}`)
              ) || false;

              return (
                <View key={phase.id} style={[
                  styles.phaseContainer,
                  isPhaseCompleted && styles.completedPhaseContainer
                ]}>
                  <TouchableOpacity
                    style={[
                      styles.phaseHeader,
                      isPhaseCompleted && styles.phaseHeaderCompleted,
                      isExpanded ? styles.phaseHeaderExpanded : styles.phaseHeaderCollapsed
                    ]}
                    onPress={() => togglePhaseExpansion(phase.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.phaseTitleContainer}>
                      <Text style={[
                        styles.phaseTitle,
                        isPhaseCompleted && styles.completedPhaseTitle
                      ]}>
                        {phaseTitle}
                      </Text>
                      {isPhaseCompleted && (
                        <View style={styles.phaseCheckIcon}>
                          <Check size={16} color={theme.success} />
                        </View>
                      )}
                    </View>
                    <Text style={[
                      styles.phaseProgress,
                      isPhaseCompleted && styles.completedPhaseProgress
                    ]}>
                      {completedStepsInPhase}/{phaseTranslation?.steps.length || 0}
                    </Text>
                    {isExpanded ? (
                      <ChevronRight size={20} color={isPhaseCompleted ? theme.success : theme.text} />
                    ) : (
                      <ChevronDown size={20} color={isPhaseCompleted ? theme.success : theme.text} />
                    )}
                  </TouchableOpacity>

                  {isExpanded && phaseTranslation?.steps.map((step, stepIndex) => {
                    const stepText = step.instruction;
                    const stepId = `${phase.id}-step-${stepIndex}`;
                    const isCompleted = completedSteps.includes(stepId);

                    return (
                      <View key={stepId} style={styles.phaseStepsContainer}>
                        <TouchableOpacity
                          style={[styles.stepItem, isCompleted && styles.completedStep]}
                          onPress={() => toggleStepCompletion(stepId)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.stepCheckbox, isCompleted && styles.completedCheckbox]}>
                            {isCompleted && <Check size={12} color="#FFFFFF" />}
                          </View>
                          <View style={styles.stepContent}>
                            <Text style={styles.stepNumber}>{t('step')} {stepIndex + 1}</Text>
                            <Text style={[styles.stepText, isCompleted && styles.completedStepText]}>
                              {stepText}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>{t('cookingProgress')}</Text>
          <Text style={styles.progressPercentage}>
            {Math.round((completedSteps.length / recipe.phases.reduce((total, phase) => {
              const phaseTranslation = phase.translations[language] || phase.translations['es'];
              return total + (phaseTranslation?.steps.length || 0);
            }, 0)) * 100)}%
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressBarWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                })
              }
            ]}
          />
        </View>

        <View style={styles.progressActions}>
          <View style={styles.progressStats}>
            <TrendingUp size={16} color={theme.textSecondary} />
            <Text style={styles.progressStatsText}>
              {completedSteps.length} / {recipe.phases.reduce((total, phase) => {
                const phaseTranslation = phase.translations[language] || phase.translations['es'];
                return total + (phaseTranslation?.steps.length || 0);
              }, 0)} {t('steps')}
            </Text>
          </View>

          {showResetButton && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetProgress}
              activeOpacity={0.7}
            >
              {Platform.OS !== 'web' ? (
                <LinearGradient
                  colors={['#FF6B6B', '#FF5252']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
              ) : (
                <View
                  style={[
                    StyleSheet.absoluteFillObject,
                    {
                      backgroundImage: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)'
                    }
                  ]}
                />
              )}
              <RotateCcw size={16} color="#FFFFFF" />
              <Text style={styles.resetButtonText}>{t('reset')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
