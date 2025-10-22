import { spacing } from '@/constants/themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { animeCategories } from '@/data/recipes';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Responsive: calcula tamaños basados en el ancho de ventana

export default function AnimeScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = React.useState('');
  const { width: windowWidth } = useWindowDimensions();

  const handleAnimePress = (animeName: string) => {
    router.push(`/anime/${encodeURIComponent(animeName)}`);
  };

  const getImageSource = (image: any) => {
    // Si es una URL string, devolver como objeto uri
    if (typeof image === 'string') {
      return { uri: image };
    }
    // Si es un require() local, devolverlo directamente
    return image;
  };

  const filteredAnime = animeCategories.filter((anime: any) => {
    if (!searchQuery.trim()) return true;
    const animeName = (anime.translations?.[language]?.name) || anime.name || anime.nameEN;
    return (animeName || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Cálculo de 2 columnas: anchura disponible = ancho ventana - padding horizontal - gaps entre columnas
  const numColumns = 2;
  const gridHorizontalPadding = spacing.md; // padding de ScrollView grid (reducido)
  const horizontalPadding = gridHorizontalPadding * 2;
  const gap = spacing.sm; // coincide con styles.gridContent.gap
  const availableWidth = windowWidth - horizontalPadding - gap * (numColumns - 1);
  const cardWidth = Math.floor(availableWidth / numColumns);
  // Mantener altura controlada: proporción más contenida + tope máximo
  const maxImageHeight = 420;
  const imageHeight = Math.min(Math.round(cardWidth * 1.8), maxImageHeight);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: insets.top + spacing.xs,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xs,
      paddingBottom: spacing.sm,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: spacing.xs - 2,
      letterSpacing: -0.3,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      // Aumenta el margen inferior para más espacio entre el título y el buscador
      marginBottom: spacing.md,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
      borderRadius: 16,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginBottom: spacing.sm,
      borderWidth: 0,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      marginLeft: spacing.sm,
    },
    clearButton: {
      padding: spacing.xs,
    },
    grid: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.lg,
    },
    gridContent: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      // 'gap' maneja la separación horizontal y vertical de manera uniforme
      gap: spacing.sm,
    },
    animeCard: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
      borderRadius: 12,
      // Se recalcula el ancho para que siempre quepan 3 tarjetas correctamente
      width: cardWidth,
      overflow: 'hidden',
      position: 'relative',
      borderWidth: 1,
      borderColor: 'transparent',
    },
    animeImage: {
      width: '100%',
      height: imageHeight,
    },
    overlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 80,
    },
    overlayContent: {
      justifyContent: 'flex-end',
      padding: spacing.sm,
      flex: 1,
    },
    animeName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: spacing.xs - 2,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
      letterSpacing: -0.2,
      lineHeight: 16,
    },
    recipeCount: {
      fontSize: 11,
      color: '#FFFFFF',
      opacity: 0.9,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      fontWeight: '500',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('animeCollection')}</Text>
        <Text style={styles.subtitle}>
          {t('browseRecipesByAnime')} ({filteredAnime.length})
        </Text>
        <View style={styles.searchContainer}>
          <Search size={20} color={theme.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchAnime')}
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView
        style={styles.grid}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredAnime.map((anime: any) => {
          const animeName = (anime.translations?.[language]?.name) || anime.name || anime.nameEN;
          return (
            <TouchableOpacity
              key={anime.id || anime.name}
              style={styles.animeCard}
              onPress={() => handleAnimePress(animeName)}
              activeOpacity={0.7}
            >
              <Image source={getImageSource(anime.image)} style={styles.animeImage} />
              <View style={styles.overlay}>
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.overlayContent}>
                  <Text style={styles.animeName} numberOfLines={2}>{animeName}</Text>
                  <Text style={styles.recipeCount}>
                    {anime.recipeCount} {t('recipes')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}