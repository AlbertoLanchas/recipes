import { AutoCarousel } from '@/components/AutoCarousel';
import { RecipeCard } from '@/components/RecipeCard';
import { spacing } from '@/constants/themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { allRecipesLegacy, getFeaturedRecipes } from '@/data/recipes';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import React, { useCallback, useMemo, useRef } from 'react';
import { Animated, FlatList, LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const { progress } = useUser();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const [activeFilter, setActiveFilter] = React.useState('All');
  const scrollRef = useRef<FlatList<any>>(null);
  const carouselRef = useRef<any>(null);
  const stickySearchOpacity = useRef(new Animated.Value(0)).current;
  const [showStickySearch, setShowStickySearch] = React.useState(false);

  // Obtener recetas en formato legacy para compatibilidad
  const allRecipes = allRecipesLegacy(language) || [];

  const recipesWithProgress = progress
    .filter(p => p.percentage > 0 && p.percentage < 100)
    .map(p => allRecipes.find(r => r.id === p.recipeId))
    .filter(Boolean)
    .slice(0, 3);

  // Recetas trending (las más populares)
  const trendingRecipes = allRecipes.filter(recipe => ['2', '3', '4', '5'].includes(recipe.id));

  const handleSeeAll = (section: string) => {
    if (section === 'anime') {
      router.push('/anime');
    } else {
      router.push(`/search?filter=${section}`);
    }
  };

  const filteredRecipes = useMemo(() => {
    switch (activeFilter) {
      case 'Quick':
        return allRecipes.filter(recipe => recipe.time < 30);
      case 'Easy':
        return allRecipes.filter(recipe => recipe.difficulty <= 2);
      case 'Popular':
        return allRecipes.filter(recipe => ['2', '3', '4'].includes(recipe.id));
      default:
        return allRecipes;
    }
  }, [activeFilter, allRecipes]);

  const handleFilterChange = (newFilter: string) => {
    if (newFilter === activeFilter) return;

    // Configurar animación de layout nativa
    if (Platform.OS === 'ios') {
      LayoutAnimation.configureNext({
        duration: 400,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.scaleXY,
        },
        delete: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
      });
    }

    setActiveFilter(newFilter);
  };

  // Grid responsive a 2 columnas como en Animes
  const numColumns = 2;
  const sectionHorizontalPadding = spacing.lg; // coincide con styles.section.paddingHorizontal
  const gap = spacing.sm;
  const availableWidth = windowWidth - sectionHorizontalPadding * 2 - gap * (numColumns - 1);
  const cardPixelWidth = Math.floor(availableWidth / numColumns);
  const maxImageHeight = 420;
  const gridImageHeight = Math.min(Math.round(cardPixelWidth * 1.8), maxImageHeight);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    carouselWrapper: {
      marginTop: -insets.top,
      paddingTop: insets.top,
    },
    carouselContainer: {
      marginBottom: spacing.xl,
    },
    section: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      paddingTop: 40,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      letterSpacing: -0.3,
    },
    seeAllText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.primary,
      letterSpacing: -0.1,
    },
    stickySearchContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      paddingHorizontal: spacing.lg,
      paddingTop: insets.top + spacing.sm,
      paddingBottom: spacing.sm,
    },
    stickySearchButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(15, 15, 35, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: 25,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      shadowColor: isDark ? '#1e90ff' : '#ff9900',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      // borderColor: isDark ? 'rgba(30, 144, 255, 0.1)' : 'rgba(255, 153, 0, 0.1)',
    },
    stickySearchText: {
      flex: 1,
      marginLeft: spacing.sm,
      color: theme.textSecondary,
      fontSize: 16,
      fontWeight: '500',
    },
    horizontalScroll: {
      paddingLeft: 0,
    },
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      height: 40,
    },
    filterButton: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm + 2,
      borderRadius: 24,
      backgroundColor: isDark ? 'rgba(30, 30, 50, 0.9)' : 'rgba(248, 249, 250, 0.95)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(70, 130, 180, 0.4)' : 'rgba(200, 200, 200, 0.6)',
      marginRight: spacing.md,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: isDark ? '#4682b4' : '#c8c8c8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.2,
      shadowRadius: 4,
      elevation: 2,
      transform: [{ scale: 1 }],
    },
    activeFilterButton: {
      backgroundColor: isDark ? '#1e90ff' : '#ff9900',
      // borderColor: isDark ? '#1e90ff' : '#ff9900',
      shadowColor: isDark ? '#1e90ff' : '#ff9900',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.7 : 0.5,
      shadowRadius: 12,
      elevation: 8,
      transform: [{ scale: 1.05 }],
    },
    filterText: {
      fontSize: 15,
      color: isDark ? '#e8e8e8' : '#2d3748',
      letterSpacing: -0.2,
      fontWeight: '600',
    },
    activeFilterText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    recipesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      paddingHorizontal: 0,
      gap,
    },
    recipeItem: {
      width: cardPixelWidth,
      marginBottom: gap,
    },
  });

  const renderRecipeItem = useCallback(({ item }: any) => (
    <View style={styles.recipeItem}>
      <RecipeCard recipe={item} showDescriptionText={false} variant="grid" imageHeight={gridImageHeight} />
    </View>
  ), [gridImageHeight, styles.recipeItem]);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    // Manejar animación del carrusel
    if (carouselRef.current?.handleParentScroll) {
      carouselRef.current.handleParentScroll(scrollY);
    }

    // Manejar buscador sticky
    const shouldShowSticky = scrollY > 200;

    if (shouldShowSticky !== showStickySearch) {
      setShowStickySearch(shouldShowSticky);

      Animated.timing(stickySearchOpacity, {
        toValue: shouldShowSticky ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Buscador sticky */}
      <Animated.View
        style={[
          styles.stickySearchContainer,
          {
            opacity: stickySearchOpacity,
            transform: [{
              translateY: stickySearchOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [-60, 0],
              })
            }]
          }
        ]}
        pointerEvents={showStickySearch ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={styles.stickySearchButton}
          onPress={() => router.push('/search')}
        >
          <Search size={20} color={theme.textSecondary} />
          <Text style={styles.stickySearchText}>{t('searchRecipes')}</Text>
        </TouchableOpacity>
      </Animated.View>
      <FlatList
        ref={scrollRef}
        data={filteredRecipes}
        numColumns={2}
        columnWrapperStyle={{ gap, paddingHorizontal: spacing.lg }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        renderItem={renderRecipeItem}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        windowSize={7}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={(
          <>
            <View style={styles.carouselWrapper}>
              <AutoCarousel ref={carouselRef} recipes={getFeaturedRecipes(language)} />
            </View>

            {recipesWithProgress.length > 0 && (
              <View style={styles.section}>
                <View style={{ marginTop: spacing.lg }}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t('continueWatching')}</Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalScroll}
                    decelerationRate="fast"
                  >
                    {recipesWithProgress.map((recipe) => (
                      <RecipeCard key={recipe!.id} recipe={recipe!} horizontal showProgress showDescriptionText={false} />
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('allRecipes') || 'All Recipes'}</Text>
                <TouchableOpacity
                  onPress={() => handleSeeAll('anime')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.seeAllText}>{t('viewMore') || 'View More'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
}