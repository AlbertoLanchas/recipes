import { ImageBackground } from 'expo-image';
import { useEffect } from 'react';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface CharacterProps {
  char: string;
  side: 'left' | 'right';
  imageSource?: ImageSourcePropType; // Nueva prop para la imagen del personaje
}

export default function Character({ char, side, imageSource }: CharacterProps) {
  // Usar imagen personalizada o GIF por defecto
  const defaultGif = require('@/assets/images/kai-presentation.gif');
  const characterImage = imageSource || defaultGif;

  const translateX = useSharedValue(0);
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // 1. Establecer el valor inicial fuera de la vista (sin animación)
    // Esto asegura que la animación SIEMPRE comience desde el lado correcto.
    translateX.value = side === 'left'
      ? withTiming(-300, { duration: 0 })
      : withTiming(300, { duration: 0 });

    // 2. Ejecutar la secuencia de aparición - Más suave y gradual

    // Animación de traslación (slide-in) - Más suave
    translateX.value = withSequence(
      withTiming(side === 'left' ? -30 : 30, { duration: 250 }),
      withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) })
    );

    // Animación de escala (aparecer con rebote suave)
    scale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1.12, { duration: 400, easing: Easing.out(Easing.back(0.8)) }),
      withTiming(1, { duration: 200, easing: Easing.inOut(Easing.ease) })
    );

    // Animar la rotación muy sutil
    rotation.value = withSequence(
      withTiming(side === 'left' ? -3 : 3, { duration: 300 }),
      withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) })
    );

  }, [char, side]); // Dependencias: se ejecuta al cambiar el personaje o el lado

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
      // La rotación en `withSequence` ya usa grados, aquí se aplica la sintaxis de string.
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        side === 'left' ? styles.left : styles.right,
        animatedStyle,
      ]}
    >
      <ImageBackground
        source={characterImage}
        style={styles.image}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    zIndex: 1,
  },
  left: {
    left: 5,
  },
  right: {
    right: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
});