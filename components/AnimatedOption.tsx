import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { spacing } from '@/constants/themes';
import { useTheme } from '@/contexts/ThemeContext';

interface AnimatedOptionProps {
    value: string;
    label: string;
    isSelected: boolean;
    onSelect: () => void;
    index: number;
}

export function AnimatedOption({ value, label, isSelected, onSelect, index }: AnimatedOptionProps) {
    const { theme, isDark } = useTheme();
    const optionScale = useSharedValue(0);
    const optionOpacity = useSharedValue(0);

    useEffect(() => {
        optionScale.value = withDelay(
            index * 100,
            withSpring(1, { damping: 15, stiffness: 200 })
        );
        optionOpacity.value = withDelay(
            index * 100,
            withTiming(1, { duration: 300 })
        );
    }, []);

    const animatedOptionStyle = useAnimatedStyle(() => ({
        transform: [{ scale: optionScale.value }],
        opacity: optionOpacity.value,
    }));

    const handlePress = () => {
        onSelect();
        optionScale.value = withSequence(
            withSpring(0.95, { damping: 10 }),
            withSpring(1, { damping: 8 })
        );
    };

    const isSmallDevice = false; // Se puede pasar como prop si es necesario

    const styles = StyleSheet.create({
        textOption: {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#FFF',
            padding: isSmallDevice ? spacing.lg : spacing.xl,
            borderRadius: 20,
            borderWidth: 3,
            borderColor: isDark ? 'rgba(30, 144, 255, 0.3)' : 'rgba(0, 0, 0, 0.8)',
            shadowColor: isDark ? '#1e90ff' : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.5 : 1,
            shadowRadius: isDark ? 8 : 0,
            elevation: 8,
        },
        textOptionActive: {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.6,
            shadowRadius: 12,
            elevation: 12,
            transform: [{ scale: 1.02 }],
        },
        textOptionText: {
            fontSize: isSmallDevice ? 16 : 18,
            fontWeight: '700',
            color: isDark ? '#fff' : '#000',
            textAlign: 'center',
        },
        textOptionTextActive: {
            color: '#FFF',
            fontWeight: '900',
        },
    });

    return (
        <Animated.View style={animatedOptionStyle}>
            <Pressable
                style={[
                    styles.textOption,
                    isSelected && styles.textOptionActive,
                ]}
                onPress={handlePress}
            >
                <Text
                    style={[
                        styles.textOptionText,
                        isSelected && styles.textOptionTextActive,
                    ]}
                >
                    {label}
                </Text>
            </Pressable>
        </Animated.View>
    );
}


