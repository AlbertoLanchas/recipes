import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface TypewriterTextProps {
  text: string;
}

export default function TypewriterText({ text }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const cursorOpacity = useSharedValue(1);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    let currentIndex = 0;
    let intervalId: ReturnType<typeof setInterval>;

    cursorOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );

    // Agregar un pequeño delay inicial para una transición más suave
    const startDelay = setTimeout(() => {
      intervalId = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsComplete(true);
          clearInterval(intervalId);
        }
      }, 40); // Un poco más lento para mayor suavidad
    }, 200); // Delay inicial de 200ms

    return () => {
      clearTimeout(startDelay);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text]);

  const cursorStyle = useAnimatedStyle(() => ({
    opacity: isComplete ? 0 : cursorOpacity.value,
  }));

  return (
    <Text style={styles.text}>
      {displayedText}
      <Animated.Text style={[styles.cursor, cursorStyle]}>|</Animated.Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    lineHeight: 22,
  },
  cursor: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
});
