import { spacing } from '@/constants/themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Check, ChevronDown, Clock } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View
} from 'react-native';

// Habilitar LayoutAnimation en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface RecipePhase {
    id: string;
    title: string;
    titleEN: string;
    description?: string;
    descriptionEN?: string;
    steps: {
        id: string;
        instruction: string;
        instructionEN: string;
        tips?: string;
        tipsEN?: string;
        completed: boolean;
    }[];
    order: number;
}

interface PhaseAccordionProps {
    phase: RecipePhase;
    isExpanded: boolean;
    isCompleted: boolean;
    onToggle: () => void;
    onStepToggle: (stepId: string) => void;
    completedSteps: string[];
}

export default function PhaseAccordion({
    phase,
    isExpanded,
    isCompleted,
    onToggle,
    onStepToggle,
    completedSteps,
}: PhaseAccordionProps) {
    const { theme, isDark } = useTheme();
    const { language } = useLanguage();
    const [rotationValue] = useState(new Animated.Value(isExpanded ? 1 : 0));
    const { width: screenWidth } = Dimensions.get('window');

    const title = language === 'es' ? phase.title : phase.titleEN;
    const description = language === 'es' ? phase.description : phase.descriptionEN;

    // Animación del chevron
    useEffect(() => {
        Animated.timing(rotationValue, {
            toValue: isExpanded ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isExpanded]);

    const rotateInterpolate = rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const styles = React.useMemo(() => StyleSheet.create({
        phaseContainer: {
            backgroundColor: isDark ? 'rgba(30, 30, 50, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: 20,
            marginBottom: spacing.lg,
            borderWidth: 2,
            borderColor: isCompleted
                ? theme.success + '60'
                : isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(200, 200, 200, 0.4)',
            shadowColor: isDark ? '#000' : '#c8c8c8',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.4 : 0.15,
            shadowRadius: 8,
            elevation: 6,
            overflow: 'hidden',
            minHeight: 80,
        },
        phaseHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.lg,
            backgroundColor: isCompleted
                ? theme.success + '15'
                : isDark ? 'rgba(40, 40, 60, 0.8)' : 'rgba(248, 249, 250, 0.9)',
            minHeight: 80,
        },
        phaseInfo: {
            flex: 1,
            marginRight: spacing.lg,
            paddingRight: spacing.sm,
        },
        phaseTitle: {
            fontSize: screenWidth < 400 ? 16 : 18,
            fontWeight: 'bold',
            color: isCompleted ? theme.success : theme.text,
            marginBottom: spacing.xs,
            letterSpacing: -0.5,
            lineHeight: screenWidth < 400 ? 20 : 22,
        },
        phaseDescription: {
            fontSize: screenWidth < 400 ? 12 : 14,
            color: isCompleted ? theme.success + 'CC' : theme.textSecondary,
            lineHeight: screenWidth < 400 ? 16 : 20,
            marginTop: spacing.xs,
        },
        phaseStatus: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: spacing.md,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            borderRadius: 12,
            backgroundColor: isCompleted
                ? theme.success + '20'
                : isDark ? 'rgba(60, 60, 80, 0.6)' : 'rgba(240, 240, 240, 0.8)',
        },
        statusIcon: {
            marginRight: spacing.xs,
        },
        statusText: {
            fontSize: screenWidth < 400 ? 10 : 12,
            fontWeight: '700',
            color: isCompleted ? theme.success : theme.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
        },
        chevronContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: isDark ? 'rgba(60, 60, 80, 0.9)' : 'rgba(240, 240, 240, 0.95)',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(200, 200, 200, 0.3)',
        },
        stepsContainer: {
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.lg,
            paddingBottom: spacing.xl,
        },
        stepItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.md,
            marginBottom: spacing.md,
            borderRadius: 16,
            backgroundColor: isDark ? 'rgba(20, 20, 35, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(200, 200, 200, 0.3)',
            shadowColor: isDark ? '#000' : '#c8c8c8',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.2 : 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        completedStep: {
            opacity: 0.8,
            backgroundColor: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.08)',
            borderColor: theme.success + '40',
        },
        stepCheckbox: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: theme.textSecondary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacing.lg,
            marginTop: 2,
            backgroundColor: isDark ? 'rgba(30, 30, 50, 0.6)' : 'rgba(255, 255, 255, 0.8)',
        },
        completedCheckbox: {
            backgroundColor: theme.success,
            borderColor: theme.success,
        },
        stepContent: {
            flex: 1,
            paddingRight: spacing.sm,
        },
        stepNumber: {
            fontSize: screenWidth < 400 ? 10 : 11,
            fontWeight: 'bold',
            color: theme.primary,
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
        },
        stepText: {
            fontSize: screenWidth < 400 ? 14 : 15,
            color: theme.text,
            lineHeight: screenWidth < 400 ? 20 : 22,
            fontWeight: '500',
            marginBottom: spacing.sm,
        },
        completedStepText: {
            color: theme.textSecondary,
            textDecorationLine: 'line-through',
        },
        stepTips: {
            fontSize: screenWidth < 400 ? 12 : 13,
            color: theme.textSecondary,
            fontStyle: 'italic',
            lineHeight: screenWidth < 400 ? 16 : 18,
            backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)',
            padding: spacing.md,
            borderRadius: 12,
            marginTop: spacing.sm,
            borderLeftWidth: 3,
            borderLeftColor: theme.primary,
        },
        progressBar: {
            height: 6,
            backgroundColor: isDark ? 'rgba(159, 122, 234, 0.2)' : 'rgba(49, 130, 206, 0.2)',
            borderRadius: 3,
            marginTop: spacing.lg,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(200, 200, 200, 0.2)',
        },
        progressFill: {
            height: '100%',
            backgroundColor: theme.primary,
            borderRadius: 3,
        },
        progressText: {
            fontSize: screenWidth < 400 ? 11 : 12,
            color: theme.textSecondary,
            textAlign: 'center',
            marginTop: spacing.xs,
            fontWeight: '600',
        },
    }), [theme, isDark, isCompleted, screenWidth]);

    const completedStepsCount = phase.steps.filter(step => completedSteps.includes(step.id)).length;
    const progressPercentage = phase.steps.length > 0 ? (completedStepsCount / phase.steps.length) * 100 : 0;

    return (
        <View style={styles.phaseContainer}>
            <TouchableOpacity
                style={styles.phaseHeader}
                onPress={onToggle}
                activeOpacity={0.8}
            >
                <View style={styles.phaseInfo}>
                    <Text style={styles.phaseTitle}>{title}</Text>
                    {description && (
                        <Text style={styles.phaseDescription}>{description}</Text>
                    )}
                </View>

                <View style={styles.phaseStatus}>
                    {isCompleted ? (
                        <>
                            <View style={styles.statusIcon}>
                                <Check size={screenWidth < 400 ? 14 : 16} color={theme.success} />
                            </View>
                            <Text style={styles.statusText}>Completada</Text>
                        </>
                    ) : (
                        <>
                            <View style={styles.statusIcon}>
                                <Clock size={screenWidth < 400 ? 14 : 16} color={theme.textSecondary} />
                            </View>
                            <Text style={styles.statusText}>
                                {completedStepsCount}/{phase.steps.length}
                            </Text>
                        </>
                    )}
                </View>

                <Animated.View
                    style={[
                        styles.chevronContainer,
                        { transform: [{ rotate: rotateInterpolate }] }
                    ]}
                >
                    <ChevronDown size={screenWidth < 400 ? 16 : 18} color={theme.textSecondary} />
                </Animated.View>
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.stepsContainer}>
                    {phase.steps.map((step, index) => {
                        const isStepCompleted = completedSteps.includes(step.id);
                        const stepInstruction = language === 'es' ? step.instruction : step.instructionEN;
                        const stepTips = language === 'es' ? step.tips : step.tipsEN;

                        return (
                            <TouchableOpacity
                                key={step.id}
                                style={[
                                    styles.stepItem,
                                    isStepCompleted && styles.completedStep
                                ]}
                                onPress={() => onStepToggle(step.id)}
                                activeOpacity={0.8}
                            >
                                <View style={[
                                    styles.stepCheckbox,
                                    isStepCompleted && styles.completedCheckbox
                                ]}>
                                    {isStepCompleted && <Check size={screenWidth < 400 ? 14 : 16} color="#FFFFFF" />}
                                </View>
                                <View style={styles.stepContent}>
                                    <Text style={styles.stepNumber}>
                                        Paso {index + 1}
                                    </Text>
                                    <Text style={[
                                        styles.stepText,
                                        isStepCompleted && styles.completedStepText
                                    ]}>
                                        {stepInstruction}
                                    </Text>
                                    {stepTips && (
                                        <Text style={styles.stepTips}>
                                            💡 {stepTips}
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    {/* Progress bar for the phase */}
                    <View style={styles.progressBar}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                {
                                    width: isExpanded ? `${progressPercentage}%` : '0%'
                                }
                            ]}
                        />
                    </View>

                    {/* Progress text */}
                    <Text style={styles.progressText}>
                        {Math.round(progressPercentage)}% completado
                    </Text>
                </View>
            )}
        </View>
    );
}
