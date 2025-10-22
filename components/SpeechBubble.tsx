import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import TypewriterText from './TypewriterText';

interface SpeechBubbleProps {
  text: string;
  side: 'left' | 'right';
}

const { width } = Dimensions.get('window');

export default function SpeechBubble({ text, side }: SpeechBubbleProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacity.setValue(0);

    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [text]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
        },
      ]}
    >
      <View style={styles.bubble}>
        <View style={styles.innerBubble}>
          <TypewriterText text={text} />
        </View>

        <View style={styles.comicLines}>
          <View style={styles.comicLine1} />
          <View style={styles.comicLine2} />
        </View>
      </View>

      {/* Burbujas de pensamiento - a la izquierda */}
      <View style={styles.thoughtBubbles}>
        <Svg width="65" height="75" viewBox="0 0 65 75">
          {/* Burbuja grande (cerca del bocadillo) */}
          <Circle cx="12" cy="12" r="11" fill="#FFF" stroke="#000" strokeWidth="3.5" />
          {/* Burbuja mediana */}
          <Circle cx="18" cy="38" r="7.5" fill="#FFF" stroke="#000" strokeWidth="3" />
          {/* Burbuja pequeña */}
          <Circle cx="8" cy="62" r="5" fill="#FFF" stroke="#000" strokeWidth="2.5" />
        </Svg>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 30,
    right: 30,
    alignSelf: 'center',
    width: width - 80,
    maxWidth: 380,
    zIndex: 2,
  },
  bubble: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#000',
    padding: 22,
    minHeight: 100,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  innerBubble: {
    zIndex: 2,
  },
  comicLines: {
    position: 'absolute',
    top: 12,
    right: 12,
    opacity: 0.1,
    alignItems: 'flex-end',
  },
  comicLine1: {
    width: 40,
    height: 3,
    backgroundColor: '#000',
    marginBottom: 4,
    transform: [{ rotate: '-12deg' }],
  },
  comicLine2: {
    width: 30,
    height: 3,
    backgroundColor: '#000',
    transform: [{ rotate: '8deg' }],
  },
  thoughtBubbles: {
    position: 'absolute',
    bottom: -68,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    paddingRight: 15,
  },
});
