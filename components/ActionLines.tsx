import { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';

interface ActionLinesProps {
  side: 'left' | 'right';
}

const { width } = Dimensions.get('window');

export default function ActionLines({ side }: ActionLinesProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 300 })
    );

    scale.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(1.3, { duration: 300 })
    );
  }, [side]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const lines = side === 'left'
    ? [
        { x1: 40, y1: 230, x2: 100, y2: 230 },
        { x1: 35, y1: 250, x2: 110, y2: 250 },
        { x1: 45, y1: 270, x2: 105, y2: 270 },
      ]
    : [
        { x1: width - 100, y1: 230, x2: width - 40, y2: 230 },
        { x1: width - 110, y1: 250, x2: width - 35, y2: 250 },
        { x1: width - 105, y1: 270, x2: width - 45, y2: 270 },
      ];

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Svg height="100%" width="100%">
        {lines.map((line, index) => (
          <Line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#000"
            strokeWidth="3"
          />
        ))}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
