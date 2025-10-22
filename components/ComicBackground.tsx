import { useTheme } from '@/contexts/ThemeContext';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

interface ComicBackgroundProps {
  useThemeColors?: boolean;
}

export default function ComicBackground({ useThemeColors = false }: ComicBackgroundProps) {
  const { theme, isDark } = useTheme();

  // Colores según el tema
  const lineColor = useThemeColors
    ? (isDark ? '#1e90ff' : '#ff9900')
    : '#FFD700';

  const circleColors = useThemeColors
    ? (isDark
      ? ['#1e90ff', '#4FD1C7', '#48BB78', '#F6E05E']
      : ['#ff9900', '#FFB347', '#FFA500', '#FFD700'])
    : ['#FF6B6B', '#4ECDC4', '#FFD93D', '#FF6B6B'];

  const dotColor = useThemeColors
    ? (isDark ? '#1e90ff' : '#ff9900')
    : '#000';

  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" style={styles.svg}>
        <Line x1="20" y1="50" x2="80" y2="50" stroke={lineColor} strokeWidth="3" opacity="0.2" />
        <Line x1="100" y1="100" x2="180" y2="80" stroke={lineColor} strokeWidth="3" opacity="0.2" />
        <Line x1="250" y1="120" x2="320" y2="100" stroke={lineColor} strokeWidth="3" opacity="0.2" />

        <Circle cx="50" cy="200" r="5" fill={circleColors[0]} opacity="0.3" />
        <Circle cx="320" cy="180" r="6" fill={circleColors[1]} opacity="0.3" />
        <Circle cx="150" cy="300" r="4" fill={circleColors[2]} opacity="0.3" />
        <Circle cx="280" cy="350" r="5" fill={circleColors[3]} opacity="0.3" />

        <Line x1="30" y1="400" x2="60" y2="420" stroke={lineColor} strokeWidth="2" opacity="0.15" />
        <Line x1="300" y1="450" x2="340" y2="470" stroke={lineColor} strokeWidth="2" opacity="0.15" />
      </Svg>

      <View style={styles.dots}>
        {Array.from({ length: 15 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * (useThemeColors ? 0.2 : 0.3) + 0.05,
                backgroundColor: dotColor,
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  svg: {
    position: 'absolute',
  },
  dots: {
    ...StyleSheet.absoluteFillObject,
  },
  dot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
});
