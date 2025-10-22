import { AnimatedOption } from '@/components/AnimatedOption';
import { AnimatedProgressDot } from '@/components/AnimatedProgressDot';
import Character from '@/components/Character';
import ComicBackground from '@/components/ComicBackground';
import SpeechBubble from '@/components/SpeechBubble';
import { spacing } from '@/constants/themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { StorageService } from '@/utils/storage';
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

// 🚨 IMPORTANTE: Asegúrate de que estas rutas a tus assets sean correctas
const TRADITIONAL_PHOTO = require('@/assets/images/kia-full.png');
const MODERN_PHOTO = require('@/assets/images/kai-vegan.png');

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isLargeDevice = width >= 768;

export default function OnboardingScreen() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const { theme, isDark } = useTheme();

    // --- Estados de la Aplicación ---
    const [currentStep, setCurrentStep] = useState(0);
    const [measurementPreference, setMeasurementPreference] = useState<string>('');
    const [dietPreference, setDietPreference] = useState<string>('');
    const [showDialogue, setShowDialogue] = useState(false);

    // --- Reanimated Shared Values ---
    const buttonScale = useSharedValue(1);
    const opacityValue = useSharedValue(1);
    const slideValue = useSharedValue(0);
    const progressAnimation = useSharedValue(0);

    // Diálogo para el Paso 0
    const DIALOGUE = {
        char: 'Heroe',
        text: t('chefIntro'),
        side: 'left' as const,
    };

    // Hook para mostrar la burbuja de diálogo
    useEffect(() => {
        // Solo se aplica en el primer paso (Diálogo)
        if (currentStep === 0 && opacityValue.value === 1) {
            const timer = setTimeout(() => {
                // Muestra la burbuja una vez que el paso está completamente visible
                setShowDialogue(true);
            }, 700);
            return () => clearTimeout(timer);
        } else {
            setShowDialogue(false);
        }
    }, [currentStep, opacityValue.value]);

    // --- Lógica de Animaciones ---
    const animateButton = () => {
        buttonScale.value = withSequence(
            withSpring(0.92, { damping: 15, stiffness: 300 }),
            withSpring(1.02, { damping: 12, stiffness: 250 }),
            withSpring(1, { damping: 10, stiffness: 200 })
        );
    };

    const fadeOut = (callback: () => void) => {
        opacityValue.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) });
        slideValue.value = withTiming(-30, { duration: 300, easing: Easing.inOut(Easing.ease) });
        // Ejecutar callback después de la animación
        setTimeout(callback, 300);
    };

    const fadeIn = () => {
        slideValue.value = 30;
        opacityValue.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
        slideValue.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) });
    };

    // Animación del progreso
    useEffect(() => {
        progressAnimation.value = withSpring(currentStep, {
            damping: 20,
            stiffness: 90,
        });
    }, [currentStep]);

    // Estilos Animados
    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const animatedContentStyle = useAnimatedStyle(() => ({
        opacity: opacityValue.value,
        transform: [{ translateY: slideValue.value }],
    }));

    // --- Manejadores de Navegación ---
    const handleNext = async () => {
        animateButton();

        const changeStepLogic = async () => {
            if (currentStep === 0) { // Paso 0: Diálogo
                setCurrentStep(1);
            } else if (currentStep === 1 && measurementPreference) { // Paso 1: Pref. Medidas
                setCurrentStep(2);
            } else if (currentStep === 2 && dietPreference) { // Paso 2: Pref. Dieta (FIN)

                // Final: Guardar preferencias y navegar
                await StorageService.saveOnboardingPreferences({
                    language,
                    measurementPreference,
                    dietPreference,
                });
                router.replace('/home');
                return;
            }
            fadeIn();
        };

        if (currentStep === 0) setShowDialogue(false);

        fadeOut(changeStepLogic);
    };

    const handleBack = () => {
        animateButton();

        if (currentStep === 0) {
            // Si estamos en el paso 0, volver al index para cambiar idioma
            setTimeout(() => {
                router.replace('/');
            }, 100);
        } else if (currentStep > 0) {
            fadeOut(() => {
                const newStep = currentStep - 1;
                setCurrentStep(newStep);
                // Mostrar diálogo si volvemos al paso 0
                if (newStep === 0) {
                    setTimeout(() => setShowDialogue(true), 700);
                }
                fadeIn();
            });
        }
    };

    const canProceed = () => {
        if (currentStep === 0) return true;
        if (currentStep === 1) return measurementPreference;
        if (currentStep === 2) return dietPreference;
        return false;
    };

    // --- Renderizado ---
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#18171c' : '#FFE5B4',
        },
        stepContentWrapper: {
            flex: 1,
            padding: spacing.lg,
            paddingVertical: isSmallDevice ? spacing.lg : spacing.xl,
        },
        stepContent: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            fontSize: isSmallDevice ? 22 : isMediumDevice ? 26 : 32,
            fontWeight: '900',
            color: theme.text,
            marginBottom: spacing.xl,
            textAlign: 'center',
            paddingHorizontal: spacing.lg,
            textShadowColor: isDark ? 'rgba(30, 144, 255, 0.3)' : 'rgba(255, 153, 0, 0.2)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
        },
        optionsContainer: {
            width: '100%',
            maxWidth: isLargeDevice ? 500 : 400,
            gap: spacing.md,
            paddingHorizontal: spacing.sm,
        },
        cardsContainer: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isSmallDevice ? spacing.sm : spacing.md,
            paddingHorizontal: spacing.md,
            flexWrap: isSmallDevice ? 'wrap' : 'nowrap',
        },
        card: {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#FFF',
            padding: isSmallDevice ? spacing.md : spacing.lg,
            borderRadius: 20,
            borderWidth: 3,
            borderColor: isDark ? 'rgba(30, 144, 255, 0.3)' : 'rgba(0, 0, 0, 0.8)',
            shadowColor: isDark ? '#1e90ff' : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.5 : 1,
            shadowRadius: isDark ? 8 : 0,
            elevation: 8,
            alignItems: 'center',
            justifyContent: 'center',
            width: isSmallDevice ? '45%' : isLargeDevice ? 200 : 160,
            minHeight: isSmallDevice ? 180 : 200,
        },
        cardActive: {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.6,
            shadowRadius: 12,
            elevation: 12,
            transform: [{ scale: 1.05 }],
        },
        cardCharacter: {
            marginBottom: spacing.md,
            width: '100%',
            alignItems: 'center',
        },
        avatarPhoto: {
            width: isSmallDevice ? 100 : 130,
            height: isSmallDevice ? 100 : 130,
            borderRadius: isSmallDevice ? 50 : 65,
            overflow: 'hidden',
        },
        cardText: {
            fontSize: isSmallDevice ? 14 : 16,
            fontWeight: '800',
            color: isDark ? '#fff' : '#000',
            textAlign: 'center',
        },
        cardTextActive: {
            color: '#FFF',
        },
        navigation: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            marginBottom: isSmallDevice ? spacing.xxxl : 100,
            marginTop: spacing.sm,
            gap: spacing.md,
            paddingBottom: spacing.lg,
        },
        backButton: {
            flex: 1,
        },
        nextButton: {
            flex: 1,
        },
        navButton: {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#FFF',
            paddingVertical: isSmallDevice ? 12 : 14,
            paddingHorizontal: isSmallDevice ? spacing.lg : spacing.xl,
            borderRadius: 30,
            borderWidth: 3,
            borderColor: isDark ? 'rgba(30, 144, 255, 0.3)' : 'rgba(0, 0, 0, 0.8)',
            shadowColor: isDark ? '#1e90ff' : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.4 : 1,
            shadowRadius: isDark ? 6 : 0,
            elevation: 6,
        },
        navButtonText: {
            fontSize: isSmallDevice ? 14 : 16,
            fontWeight: '900',
            color: isDark ? '#fff' : '#000',
            textAlign: 'center',
        },
        continueButton: {
            backgroundColor: isDark ? '#1e90ff' : '#ff9900',
            paddingVertical: isSmallDevice ? 12 : 14,
            paddingHorizontal: isSmallDevice ? spacing.lg : spacing.xl,
            borderRadius: 30,
            borderWidth: 3,
            borderColor: isDark ? '#1e90ff' : '#ff9900',
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 12,
            elevation: 8,
        },
        continueButtonText: {
            fontSize: isSmallDevice ? 14 : 16,
            fontWeight: '900',
            color: '#FFF',
            textAlign: 'center',
        },
        startButton: {
            backgroundColor: isDark ? '#1e90ff' : '#ff9900',
            paddingVertical: isSmallDevice ? 14 : 16,
            paddingHorizontal: isSmallDevice ? spacing.xl : 32,
            borderRadius: 30,
            borderWidth: 3,
            borderColor: isDark ? '#1e90ff' : '#ff9900',
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.6,
            shadowRadius: 16,
            elevation: 12,
        },
        startButtonText: {
            fontSize: isSmallDevice ? 16 : 18,
            fontWeight: '900',
            color: '#FFF',
            textAlign: 'center',
        },
        progressContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: spacing.sm,
            marginBottom: spacing.xl,
            paddingVertical: spacing.sm,
        },
    });

    return (
        <View style={styles.container}>
            <ComicBackground useThemeColors={true} />

            {/* El componente Character debe estar fuera de animatedContentStyle 
                o en un View separado para que su GIF sea persistente y no desaparezca 
                con el fadeOut/fadeIn del contenido. Pero si el paso 0 es el único 
                que lo usa, podemos dejarlo dentro y simplemente no hacer fade-out al salir.
                Lo mantendremos dentro por simplicidad, pero ajustando la lógica de animación. */}

            <Animated.View style={[styles.stepContentWrapper, animatedContentStyle]}>

                {/* Paso 0: Diálogo de Introducción */}
                {currentStep === 0 && (
                    <View style={styles.stepContent}>
                        {DIALOGUE && (
                            <>
                                {/* El componente Character ahora renderiza el GIF */}
                                <Character char={DIALOGUE.char} side={DIALOGUE.side} />
                                {showDialogue && (
                                    <SpeechBubble text={DIALOGUE.text} side={DIALOGUE.side} />
                                )}
                            </>
                        )}
                    </View>
                )}

                {/* Paso 1: Preferencia de Medidas */}
                {currentStep === 1 && (
                    <View style={styles.stepContent}>
                        <Text style={styles.title}>{t('measurementPreferenceTitle')}</Text>
                        <View style={styles.optionsContainer}>
                            {['metric', 'imperial'].map((pref, index) => (
                                <AnimatedOption
                                    key={pref}
                                    value={pref}
                                    label={t(`measurementOption${pref === 'metric' ? 1 : 2}`)}
                                    isSelected={measurementPreference === pref}
                                    onSelect={() => setMeasurementPreference(pref)}
                                    index={index}
                                />
                            ))}
                        </View>
                    </View>
                )}

                {/* Paso 2: Preferencia de Dieta */}
                {currentStep === 2 && (
                    <View style={styles.stepContent}>
                        <Text style={styles.title}>{t('dietPreferenceTitle')}</Text>
                        <View style={styles.cardsContainer}>
                            {['omnivore', 'vegan'].map((pref) => (
                                <Pressable
                                    key={pref}
                                    style={[
                                        styles.card,
                                        dietPreference === pref && styles.cardActive,
                                    ]}
                                    onPress={() => setDietPreference(pref)}
                                >
                                    <View style={styles.cardCharacter}>
                                        <ImageBackground
                                            source={pref === 'omnivore' ? TRADITIONAL_PHOTO : MODERN_PHOTO}
                                            style={styles.avatarPhoto}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <Text style={[styles.cardText, dietPreference === pref && styles.cardTextActive]}>
                                        {t(`dietOption${pref === 'omnivore' ? 1 : 2}`)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}
            </Animated.View>

            {/* Indicador de Progreso (3 puntos) */}
            <View style={styles.progressContainer}>
                {[0, 1, 2].map((step) => (
                    <AnimatedProgressDot
                        key={step}
                        step={step}
                        currentStep={currentStep}
                    />
                ))}
            </View>

            {/* Navegación (ESTÁTICA) */}
            <View style={styles.navigation}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <Animated.View style={[styles.navButton, buttonAnimatedStyle]}>
                        <Text style={styles.navButtonText}>← {t('back')}</Text>
                    </Animated.View>
                </Pressable>

                {canProceed() && (
                    <Pressable onPress={handleNext} style={styles.nextButton}>
                        <Animated.View
                            style={[
                                currentStep === 2 ? styles.startButton : styles.continueButton,
                                buttonAnimatedStyle,
                            ]}
                        >
                            <Text
                                style={currentStep === 2 ? styles.startButtonText : styles.continueButtonText}
                            >
                                {currentStep === 2 ? t('start') : t('continue')}
                            </Text>
                        </Animated.View>
                    </Pressable>
                )}
            </View>
        </View>
    );
}