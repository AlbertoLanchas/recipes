import { useTheme } from '@/contexts/ThemeContext';
import { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

interface AnimatedProgressDotProps {
    step: number;
    currentStep: number;
}

export function AnimatedProgressDot({ step, currentStep }: AnimatedProgressDotProps) {
    const { theme, isDark } = useTheme();
    const dotScale = useSharedValue(currentStep === step ? 1.2 : 1);
    const dotOpacity = useSharedValue(currentStep === step ? 1 : 0.6);

    useEffect(() => {
        if (currentStep === step) {
            dotScale.value = withSpring(1.2, { damping: 12, stiffness: 200 });
            dotOpacity.value = withTiming(1, { duration: 200 });
        } else {
            dotScale.value = withSpring(1, { damping: 10, stiffness: 150 });
            dotOpacity.value = withTiming(0.6, { duration: 200 });
        }
    }, [currentStep]);

    const animatedDotStyle = useAnimatedStyle(() => ({
        transform: [{ scale: dotScale.value }],
        opacity: dotOpacity.value,
    }));

    const styles = StyleSheet.create({
        progressDot: {
            width: isSmallDevice ? 10 : 12,
            height: isSmallDevice ? 10 : 12,
            borderRadius: isSmallDevice ? 5 : 6,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.6)',
            borderWidth: 2,
            borderColor: isDark ? 'rgba(30, 144, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)',
        },
        progressDotActive: {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 4,
        },
    });

    return (
        <Animated.View
            style={[
                styles.progressDot,
                currentStep === step && styles.progressDotActive,
                animatedDotStyle,
            ]}
        />
    );
}


