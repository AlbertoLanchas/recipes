import { RecipeCard } from '@/components/RecipeCard';
import { ViewToggle } from '@/components/ViewToggle';
import { spacing } from '@/constants/themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { getAllRecipesLegacy } from '@/data/recipes';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Filter, Heart, Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const { favorites } = useUser();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const allRecipes = getAllRecipesLegacy(language) || [];
  const favoriteRecipes = allRecipes.filter((recipe: any) => favorites.includes(recipe.id));

  const filters = [
    { id: 'All', label: t('all'), icon: '🍽️' },
    { id: 'Quick', label: t('quickFilter'), icon: '⚡' },
    { id: 'Easy', label: t('easyFilter'), icon: '😊' },
    { id: 'Popular', label: t('popular'), icon: '🔥' },
  ];

  const getFilteredRecipes = () => {
    let filtered = favoriteRecipes;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((recipe: any) => {
        const title = (recipe.title || '').toLowerCase();
        const titleEN = (recipe.titleEN || '').toLowerCase();
        const anime = (recipe.anime || '').toLowerCase();
        const animeEN = (recipe.animeEN || '').toLowerCase();
        const q = searchQuery.toLowerCase();
        return title.includes(q) || titleEN.includes(q) || anime.includes(q) || animeEN.includes(q);
      });
    }

    // Apply category filter
    switch (selectedFilter) {
      case 'Quick':
        return filtered.filter((recipe: any) => recipe.time < 30);
      case 'Easy':
        return filtered.filter((recipe: any) => recipe.difficulty <= 2);
      case 'Popular':
        return filtered.filter((recipe: any) => ['1', '2', '3'].includes(recipe.id));
      default:
        return filtered;
    }
  };

  const filteredRecipes = getFilteredRecipes();

  const getImageSource = (image: any) => {
    if (typeof image === 'string') {
      return { uri: image };
    }
    return image;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: insets.top + spacing.sm,
      paddingBottom: spacing.md,
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
      marginBottom: spacing.sm,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(15, 15, 35, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(255, 153, 0, 0.2)',
      shadowColor: isDark ? '#1e90ff' : '#ff9900',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
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
    controlsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 25,
      position: 'relative',
      overflow: 'hidden',
      shadowColor: isDark ? '#1e90ff' : '#ff9900',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    filterButtonContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    filterButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: spacing.xs,
      zIndex: 1,
    },
    filtersContainer: {
      backgroundColor: isDark ? 'rgba(15, 15, 35, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(255, 153, 0, 0.2)',
      shadowColor: isDark ? '#1e90ff' : '#ff9900',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    filtersRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: spacing.xs + 2,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(70, 130, 180, 0.4)' : 'rgba(200, 200, 200, 0.6)',
      backgroundColor: isDark ? 'rgba(30, 30, 50, 0.9)' : 'rgba(248, 249, 250, 0.95)',
    },
    activeFilterChip: {
      backgroundColor: isDark ? '#1e90ff' : '#ff9900',
      borderColor: isDark ? '#1e90ff' : '#ff9900',
    },
    filterChipText: {
      fontSize: 14,
      color: isDark ? '#e8e8e8' : '#2d3748',
      fontWeight: '600',
      marginLeft: spacing.xs,
    },
    activeFilterChipText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingTop: spacing.sm,
    },
    gridItem: {
      width: '48%',
      marginBottom: spacing.md,
    },
    gridCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: isDark ? '#1e90ff' : '#ff9900',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.2,
      shadowRadius: 8,
      elevation: 6,
      position: 'relative',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(30, 144, 255, 0.2)' : 'rgba(255, 153, 0, 0.2)',
    },
    gridImage: {
      width: '100%',
      height: 160,
    },
    gridOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 70,
      justifyContent: 'flex-end',
      padding: spacing.md,
    },
    gridTitle: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: spacing.xs,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
      letterSpacing: -0.2,
      lineHeight: 18,
    },
    gridAnime: {
      fontSize: 12,
      color: '#FFFFFF',
      opacity: 0.9,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      fontWeight: '600',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xxxl,
    },
    emptyIcon: {
      marginBottom: spacing.lg,
      opacity: 0.6,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: spacing.sm,
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    emptyText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: spacing.lg,
    },
    emptyButton: {
      backgroundColor: isDark ? '#1e90ff' : '#ff9900',
      borderRadius: 24,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      shadowColor: isDark ? '#1e90ff' : '#ff9900',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.6 : 0.4,
      shadowRadius: 8,
      elevation: 6,
      // Efectos 3D
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.3)',
      borderBottomWidth: 2,
      borderBottomColor: 'rgba(0, 0, 0, 0.4)',
    },
    emptyButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    noResultsContainer: {
      alignItems: 'center',
      paddingVertical: spacing.xxxl,
    },
    noResultsText: {
      fontSize: 18,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: spacing.md,
    },
  });

  const EmptyFavoritesView = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Heart size={80} color={theme.textSecondary} />
      </View>
      <Text style={styles.emptyTitle}>{t('noFavoritesYet')}</Text>
      <Text style={styles.emptyText}>
        {t('discoverAmazingRecipes')}
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/anime')}>
        <Text style={styles.emptyButtonText}>{t('exploreRecipes')}</Text>
      </TouchableOpacity>
    </View>
  );

  const NoResultsView = () => (
    <View style={styles.noResultsContainer}>
      <Search size={60} color={theme.textSecondary} />
      <Text style={styles.noResultsText}>
        {t('noRecipesFound')}{'\n'}{t('tryAdjustingSearch')}
      </Text>
    </View>
  );

  if (favoriteRecipes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('favorites')}</Text>
          <Text style={styles.subtitle}>Your saved recipes (0)</Text>
        </View>
        <EmptyFavoritesView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('favorites')}</Text>
        <Text style={styles.subtitle}>
          {t('yourSavedRecipes')} ({favoriteRecipes.length})
        </Text>

        <View style={styles.searchContainer}>
          <Search size={20} color={theme.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchYourFavorites')}
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

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <View style={styles.filterButtonContent}>
              <LinearGradient
                colors={isDark ? ['#4A90E2', '#2E5BBA'] : ['#FFB347', '#FF8C00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
            </View>
            <Filter size={16} color="#FFFFFF" />
            <Text style={styles.filterButtonText}>{t('filters')}</Text>
          </TouchableOpacity>

          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </View>

        {showFilters && (
          <View style={styles.filtersContainer}>
            <View style={styles.filtersRow}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterChip,
                    selectedFilter === filter.id && styles.activeFilterChip,
                  ]}
                  onPress={() => setSelectedFilter(filter.id)}
                >
                  <Text style={{ fontSize: 14 }}>{filter.icon}</Text>
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedFilter === filter.id && styles.activeFilterChipText,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredRecipes.length === 0 ? (
          <NoResultsView />
        ) : viewMode === 'grid' ? (
          <View style={styles.gridContainer}>
            {filteredRecipes.map((recipe: any) => (
              <TouchableOpacity
                key={recipe.id}
                style={[styles.gridItem, styles.gridCard]}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
                activeOpacity={0.7}
              >
                <Image source={getImageSource(recipe.image)} style={styles.gridImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                  style={styles.gridOverlay}
                >
                  <View>
                    <Text style={styles.gridTitle} numberOfLines={2}>
                      {recipe.title}
                    </Text>
                    <Text style={styles.gridAnime}>
                      {recipe.anime}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          filteredRecipes.map((recipe: any) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}