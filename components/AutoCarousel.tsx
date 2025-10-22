// using expo-router, no React Navigation types needed here
import { spacing } from '@/constants/themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { recipeTranslations } from '@/data/translations/recipes';
import { Recipe } from '@/types';
import * as Haptics from 'expo-haptics';
// import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Search } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface AutoCarouselProps {
  recipes: Recipe[];
  showFps?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const isWeb = screenWidth > 768;
const slideWidth = screenWidth;

const getCarouselImageSource = (image: any) => {
  if (typeof image === 'string') {
    return { uri: image };
  }
  return image;
};

export const AutoCarousel = React.forwardRef<FlatList<any>, AutoCarouselProps>(({ recipes, showFps = false }, ref) => {
  // Mapeos de assets del carrusel (front image y background video) deben declararse antes de usarlos
  const frontImageById: Record<string, any> = {
    'saiyans-takoyaki': require('@/assets/carousel/front/takoyaki-front.png'),
    'meat': require('@/assets/carousel/front/meat-front.png'),
    'sopa-udon': require('@/assets/carousel/front/ramen-front.png'),
    'caprese-salad': require('@/assets/carousel/front/salad-front.png'),
    'spirits-bollos-rellenos': require('@/assets/carousel/front/bun-front.png'),
    'scientists-pan': require('@/assets/carousel/front/bread-front.png'),
  };

  const backgroundVideoById: Record<string, any> = {
    'saiyans-takoyaki': require('@/assets/carousel/video/takoyaki-video.mp4'),
    'meat': require('@/assets/carousel/video/meat-video.mp4'),
    'sopa-udon': require('@/assets/carousel/video/ramen-video.mp4'),
    'caprese-salad': require('@/assets/carousel/video/salad-video.mp4'),
    'spirits-bollos-rellenos': require('@/assets/carousel/video/bun-video.mp4'),
    'scientists-pan': require('@/assets/carousel/video/bread-video.mp4'),
  };

  const backgroundBlurById: Record<string, any> = {
    'saiyans-takoyaki': require('@/assets/carousel/background/takoyaki-background.png'),
    'meat': require('@/assets/carousel/background/meat-background.png'),
    'sopa-udon': require('@/assets/carousel/background/ramen-background.png'),
    'caprese-salad': require('@/assets/carousel/background/salad-background.jpg'),
    'spirits-bollos-rellenos': require('@/assets/carousel/background/buns-background.jpeg'),
    'scientists-pan': require('@/assets/carousel/background/bread-background.png'),
  };
  const scrollRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchOpacity = useRef(new Animated.Value(1)).current;
  const searchScale = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const lastScrollX = useRef(0);
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  // Player único y estable; reemplazamos la fuente al cambiar el slide
  const player = Platform.OS !== 'web'
    ? useVideoPlayer(null, (p) => {
      p.loop = true;
      p.muted = true;
    })
    : null;

  const currentVideoSource = (recipes[currentIndex] ? backgroundVideoById[recipes[currentIndex].id] : null) as any;

  const translationsById = React.useMemo(() => {
    const transByLang = (recipeTranslations as any)[language];
    const transEN = (recipeTranslations as any)['en'];
    const transES = (recipeTranslations as any)['es'];
    const map: Record<string, { title: string; description: string }> = {};
    for (const r of recipes) {
      const byId = transByLang?.[r.id] || transEN?.[r.id] || transES?.[r.id];
      const title = byId?.title || (language === 'en' ? (r as any).titleEN : (r as any).title) || (r as any).titleEN || (r as any).title || r.id;
      const description = byId?.description || (language === 'en' ? (r as any).descriptionEN : (r as any).description) || (r as any).descriptionEN || (r as any).description || '';
      map[r.id] = { title, description };
    }
    return map;
  }, [language, recipes]);

  useEffect(() => {
    if (Platform.OS === 'web' || !player) return;
    if (currentVideoSource) {
      try {
        player.replace(currentVideoSource);
        player.play();
      } catch (e) {
        // No-op: evitar crash si la instancia está transicionando
      }
    }
  }, [currentVideoSource, player]);
  const frontImageScale = useRef(new Animated.Value(1)).current;
  const textScale = useRef(new Animated.Value(1)).current;

  // Mapeos de assets del carrusel (front image y background video)

  const handleParentScroll = (scrollY: number) => {
    const shouldBeScrolled = scrollY > 80;
    if (shouldBeScrolled !== isScrolled) {
      setIsScrolled(shouldBeScrolled);
      Animated.parallel([
        Animated.timing(searchOpacity, {
          toValue: shouldBeScrolled ? 0 : 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(searchScale, {
          toValue: shouldBeScrolled ? 0.9 : 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  React.useImperativeHandle(ref, () => ({
    handleParentScroll: handleParentScroll,
  } as any));

  useEffect(() => {
    if (recipes.length === 0) return;
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % recipes.length;
      try {
        scrollRef.current?.scrollToOffset({ offset: nextIndex * slideWidth, animated: true });
      } catch { }
    }, 5500);
    return () => clearInterval(interval);
  }, [currentIndex, recipes.length]);

  const handleScroll = React.useCallback((event: any) => {
    const x = event.nativeEvent.contentOffset.x || 0;
    lastScrollX.current = x;
  }, []);

  const handleMomentumScrollEnd = React.useCallback((event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / slideWidth);
    if (index !== currentIndex && index >= 0 && index < recipes.length) {
      setCurrentIndex(index);
    }
    // Micro-bounce sutil
    frontImageScale.setValue(0.985);
    textScale.setValue(0.99);
    Animated.parallel([
      Animated.timing(frontImageScale, { toValue: 1, duration: 140, useNativeDriver: true }),
      Animated.timing(textScale, { toValue: 1, duration: 140, useNativeDriver: true }),
    ]).start();
    // texto siempre visible; sin transiciones que añadan latencia
    textOpacity.setValue(1);
  }, [currentIndex, recipes.length]);

  const handleSearchPress = () => {
    Haptics.selectionAsync();
    router.push('/search');
  };

  const handleRecipePress = (recipeId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/recipe/${recipeId}` as any);
  };

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      width: '100%',
      backgroundColor: 'transparent',
      height: isWeb ? 650 : 550,
    },
    backgroundBlurImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: 0,
    },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      backgroundColor: 'transparent',
      zIndex: 1,
    },
    backgroundVideo: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      backgroundColor: 'transparent',
      zIndex: 2,
    },
    // overlays eliminados
    searchContainer: {
      position: 'absolute',
      top: isWeb ? 60 : 40,
      left: spacing.lg,
      right: spacing.lg,
      zIndex: 4,
      opacity: searchOpacity,
      transform: [{ scale: searchScale }],
    },
    searchButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: 25,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    searchText: {
      flex: 1,
      marginLeft: spacing.sm + 4,
      color: theme.textSecondary,
      fontSize: 16,
      fontWeight: '500',
    },
    carousel: {
      flex: 1,
      zIndex: 4,
      paddingTop: isWeb ? 50 : 40,
      paddingHorizontal: 0,
    },
    slide: {
      width: slideWidth,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 0,
      paddingTop: 0,
      overflow: 'hidden',
    },
    recipeImage: {
      width: 300,
      height: 350,
      borderRadius: 20,
      resizeMode: 'contain',
      backgroundColor: 'transparent',
      zIndex: 3,
      marginTop: 10,
      marginHorizontal: 0,

    },
    textContainer: {
      position: 'absolute',
      bottom: spacing.lg,
      left: spacing.lg,
      right: spacing.lg,
      alignItems: 'center',
      alignSelf: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 16,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.32)' : 'rgba(255, 255, 255, 0.22)',
      maxWidth: isWeb ? 520 : 340,
      zIndex: 4,
    },
    recipeTitle: {
      fontSize: isWeb ? 30 : 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.6)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      marginBottom: spacing.md,
      lineHeight: isWeb ? 32 : 24,
      letterSpacing: -0.5,
    },
    recipeDescription: {
      fontSize: isWeb ? 15 : 14,
      color: '#FFFFFF',
      textAlign: 'center',
      opacity: 0.88,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      lineHeight: isWeb ? 20 : 18,
      maxWidth: isWeb ? 520 : 340,
      fontWeight: '500',
    },
  });
  const [fps, setFps] = useState(0);
  useEffect(() => {
    if (!showFps) return;
    let frame = 0;
    let lastTime = Date.now();
    let rafId: number;
    let acc = 0;
    let samples = 0;
    const loop = () => {
      frame++;
      const now = Date.now();
      const delta = now - lastTime;
      if (delta >= 500) {
        const currentFps = (frame / delta) * 1000;
        acc += currentFps;
        samples += 1;
        setFps(Math.round((acc / samples) * 10) / 10);
        frame = 0;
        lastTime = now;
      }
      rafId = requestAnimationFrame(loop) as unknown as number;
    };
    rafId = requestAnimationFrame(loop) as unknown as number;
    return () => cancelAnimationFrame(rafId as unknown as number);
  }, [showFps]);

  const ImageGradientOverlay = () => null;

  if (recipes.length === 0) {
    return null;
  }


  const AnimatedImage = Animated.createAnimatedComponent(Image);
  return (
    <View style={styles.container}>
      {(() => {
        const current = recipes[currentIndex];
        const blurSrc = current ? (backgroundBlurById as any)[current.id] : undefined;
        const fallback = getCarouselImageSource(current?.backgroundImage || current?.image);
        return (
          <Image
            source={blurSrc || fallback}
            style={styles.backgroundBlurImage}
            blurRadius={30}
          />
        );
      })()}
      {Platform.OS !== 'web' && player ? (
        <View style={styles.backgroundVideo} pointerEvents="none">
          <VideoView
            player={player}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            contentFit="contain"
            nativeControls={false}
            allowsPictureInPicture={false}
          />
        </View>
      ) : (
        (() => {
          const current = recipes[currentIndex];
          return (
            <Image
              source={getCarouselImageSource(current?.backgroundImage || current?.image)}
              style={styles.backgroundImage}
            />
          );
        })()
      )}
      {/* Overlays retirados para evitar cualquier caja/transparencia visible */}
      <ImageGradientOverlay />
      <FlatList
        ref={scrollRef}
        horizontal
        pagingEnabled
        data={recipes}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        style={styles.carousel}
        decelerationRate="fast"
        snapToInterval={slideWidth}
        snapToAlignment="center"
        disableIntervalMomentum
        removeClippedSubviews
        windowSize={3}
        maxToRenderPerBatch={2}
        initialNumToRender={2}
        getItemLayout={(_, index) => ({ length: slideWidth, offset: slideWidth * index, index })}
        renderItem={({ item }) => {
          const transByLang = (recipeTranslations as any)[language];
          const transEN = (recipeTranslations as any)['en'];
          const transES = (recipeTranslations as any)['es'];
          const byId = transByLang?.[item.id] || transEN?.[item.id] || transES?.[item.id];
          const title = byId?.title || (language === 'en' ? item.titleEN : item.title) || item.titleEN || item.title;
          const description = byId?.description || (language === 'en' ? item.descriptionEN : item.description) || item.descriptionEN || item.description;
          const frontImage = frontImageById[item.id] || item.image;
          return (
            <TouchableOpacity
              style={styles.slide}
              onPress={() => handleRecipePress(item.id)}
              activeOpacity={0.8}
            >
              <Animated.Image
                source={getCarouselImageSource(frontImage)}
                style={[styles.recipeImage, { transform: [{ scale: frontImageScale }] }]}
              />
              <View style={styles.textContainer}>
                <Animated.Text style={[styles.recipeTitle, { transform: [{ scale: textScale }] }]}>{title}</Animated.Text>
                <Text style={styles.recipeDescription} numberOfLines={isWeb ? 4 : 3}>
                  {description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      {showFps && (
        <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, zIndex: 10 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{fps} FPS</Text>
        </View>
      )}
      <Animated.View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
          <Search size={20} color={theme.textSecondary} />
          <Text style={styles.searchText}>{t('searchRecipes')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
});

AutoCarousel.displayName = 'AutoCarousel';
