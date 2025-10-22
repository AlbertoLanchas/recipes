import { RecipeCard } from '@/components/RecipeCard';
import { ViewToggle } from '@/components/ViewToggle';
import { spacing } from '@/constants/themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getAllRecipesLegacy } from '@/data/recipes';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Check, ChevronLeft, Filter, Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    difficulty: [] as string[],
    time: [] as string[],
    category: [] as string[],
    anime: [] as string[],
    servings: [] as string[],
    diet: [] as string[],
  });
  const [appliedFilters, setAppliedFilters] = useState({
    difficulty: [] as string[],
    time: [] as string[],
    category: [] as string[],
    anime: [] as string[],
    servings: [] as string[],
    diet: [] as string[],
  });
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('grid');
  const modalScale = React.useRef(new Animated.Value(0)).current;
  const modalOpacity = React.useRef(new Animated.Value(0)).current;

  // Obtener recetas en formato legacy para compatibilidad
  const mockRecipes = getAllRecipesLegacy(language) || [];


  const filterOptions = {
    difficulty: [
      { id: 'easy', label: t('easy') || 'Easy', emoji: '😊', description: '≤ 2 stars' },
      { id: 'medium', label: t('medium') || 'Medium', emoji: '🤔', description: '3 stars' },
      { id: 'hard', label: t('hard') || 'Hard', emoji: '😤', description: '4-5 stars' },
    ],
    time: [
      { id: 'quick', label: t('quick') || 'Quick', emoji: '⚡', description: '< 30 min' },
      { id: 'medium-time', label: t('medium-time') || 'Medium', emoji: '⏰', description: '30-60 min' },
      { id: 'long', label: t('long') || 'Long', emoji: '🕐', description: '> 60 min' },
    ],
    category: [
      { id: 'main', label: t('main') || 'Main Course', emoji: '🍽️', description: 'Plato Principal' },
      { id: 'snack', label: t('snack') || 'Snack', emoji: '🍿', description: 'Aperitivo' },
      { id: 'dessert', label: t('dessert') || 'Dessert', emoji: '🍰', description: 'Postre' },
      { id: 'drink', label: t('drink') || 'Drink', emoji: '🥤', description: 'Bebida' },
      { id: 'soup', label: t('soup') || 'Soup', emoji: '🍲', description: 'Sopa' },
      { id: 'salad', label: t('salad') || 'Salad', emoji: '🥗', description: 'Ensalada' },
    ],
    anime: [
      { id: 'naruto', label: t('naruto') || 'Naruto', emoji: '🍜', description: 'Ramen & More' },
      { id: 'onepiece', label: t('onepiece') || 'One Piece', emoji: '🏴‍☠️', description: 'Pirate Food' },
      { id: 'demonslayer', label: t('demonslayer') || 'Demon Slayer', emoji: '⚔️', description: 'Traditional' },
      { id: 'ghibli', label: t('ghibli') || 'Studio Ghibli', emoji: '🌸', description: 'Magical' },
      { id: 'pokemon', label: t('pokemon') || 'Pokémon', emoji: '⚡', description: 'Adventure Food' },
      { id: 'dragonball', label: t('dragonball') || 'Dragon Ball', emoji: '🐉', description: 'Power Food' },
      { id: 'attackontitan', label: t('attackontitan') || 'Attack on Titan', emoji: '🛡️', description: 'Survival' },
      { id: 'myhero', label: t('myhero') || 'My Hero Academia', emoji: '🦸', description: 'Hero Training' },
    ],
    servings: [
      { id: 'single', label: t('single') || 'Single', emoji: '👤', description: '1 serving' },
      { id: 'couple', label: t('couple') || 'Couple', emoji: '👫', description: '2 servings' },
      { id: 'family', label: t('family') || 'Family', emoji: '👨‍👩‍👧‍👦', description: '4+ servings' },
    ],
    diet: [
      { id: 'vegetarian', label: t('vegetarian') || 'Vegetarian', emoji: '🥬', description: 'Plant-based' },
      { id: 'vegan', label: t('vegan') || 'Vegan', emoji: '🌱', description: 'No animal products' },
      { id: 'gluten-free', label: t('gluten-free') || 'Gluten-Free', emoji: '🌾', description: 'No gluten' },
      { id: 'low-carb', label: t('low-carb') || 'Low-Carb', emoji: '🥗', description: 'Low carbohydrates' },
    ],
  };

  useEffect(() => {
    if (showFilters) {
      // Reset animations first
      modalScale.setValue(0);
      modalOpacity.setValue(0);

      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(modalScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showFilters, modalOpacity, modalScale]);

  const getFilteredRecipes = () => {
    let filtered = mockRecipes;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((recipe: any) => {
        const title = (recipe.title || '').toLowerCase();
        const titleEN = (recipe.titleEN || '').toLowerCase();
        const anime = (recipe.anime || '').toLowerCase();
        const animeEN = (recipe.animeEN || '').toLowerCase();
        const query = searchQuery.toLowerCase();

        return title.includes(query) ||
          titleEN.includes(query) ||
          anime.includes(query) ||
          animeEN.includes(query);
      });
    }

    // Apply difficulty filter
    if (appliedFilters.difficulty.length > 0) {
      filtered = filtered.filter((recipe: any) => {
        if (appliedFilters.difficulty.includes('easy')) return recipe.difficulty <= 2;
        if (appliedFilters.difficulty.includes('medium')) return recipe.difficulty === 3;
        if (appliedFilters.difficulty.includes('hard')) return recipe.difficulty >= 4;
        return true;
      });
    }

    // Apply time filter
    if (appliedFilters.time.length > 0) {
      filtered = filtered.filter((recipe: any) => {
        if (appliedFilters.time.includes('quick')) return recipe.time < 30;
        if (appliedFilters.time.includes('medium-time')) return recipe.time >= 30 && recipe.time <= 60;
        if (appliedFilters.time.includes('long')) return recipe.time > 60;
        return true;
      });
    }

    // Apply category filter
    if (appliedFilters.category.length > 0) {
      filtered = filtered.filter((recipe: any) => {
        const categoryMap: { [key: string]: string } = {
          'main': 'Plato Principal',
          'snack': 'Snack',
          'dessert': 'Postre',
          'drink': 'Bebida',
        };
        return appliedFilters.category.some(cat =>
          recipe.category === categoryMap[cat] || recipe.category === cat
        );
      });
    }

    return filtered;
  };

  const toggleTempFilter = (category: keyof typeof tempFilters, value: string) => {
    setTempFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
    setShowFilters(false);
  };

  const clearTempFilters = () => {
    setTempFilters({
      difficulty: [],
      time: [],
      category: [],
      anime: [],
      servings: [],
      diet: [],
    });
  };


  const getTotalSelectedFilters = () => {
    return Object.values(tempFilters).reduce((total, arr) => total + arr.length, 0);
  };

  const getTotalAppliedFilters = () => {
    return Object.values(appliedFilters).reduce((total, arr) => total + arr.length, 0);
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
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      backgroundColor: theme.background,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    backButton: {
      marginRight: spacing.md,
      padding: spacing.xs,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
      letterSpacing: -0.5,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(15, 15, 35, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: 16,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginBottom: spacing.sm,
      borderWidth: 0,
      shadowColor: isDark ? '#1e90ff' : '#ff9900',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
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
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#1e90ff' : '#ff9900',
      borderRadius: 25,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
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
      fontWeight: '600',
      marginLeft: spacing.xs,
      fontSize: 14,
      zIndex: 1,
    },
    filterBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 10,
      paddingHorizontal: spacing.xs + 2,
      paddingVertical: 2,
      marginLeft: spacing.xs,
      minWidth: 20,
      alignItems: 'center',
    },
    filterBadgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    viewToggle: {
      flexDirection: 'row',
      backgroundColor: isDark ? 'rgba(15, 15, 35, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: 12,
      padding: spacing.xs,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(30, 144, 255, 0.3)' : 'rgba(255, 153, 0, 0.3)',
    },
    viewButton: {
      padding: spacing.sm,
      borderRadius: 8,
    },
    activeViewButton: {
      backgroundColor: isDark ? '#1e90ff' : '#ff9900',
    },
    resultsText: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: '500',
      marginBottom: spacing.sm,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    recipesList: {
      paddingBottom: spacing.xl,
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
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    gridItem: {
      width: '31%',
      marginBottom: spacing.sm,
    },
    gridCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
      borderWidth: 1,
      borderColor: 'transparent',
    },
    gridImage: {
      width: '100%',
      height: 140,
    },
    gridOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
      justifyContent: 'flex-end',
      padding: spacing.sm,
    },
    gridTitle: {
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
    gridAnime: {
      fontSize: 11,
      color: '#FFFFFF',
      opacity: 0.9,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      fontWeight: '500',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
    },
    modalContainer: {
      backgroundColor: isDark ? 'rgba(15, 15, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 24,
      width: '90%',
      height: '80%',
      shadowColor: isDark ? '#1e90ff' : '#ff9900',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(30, 144, 255, 0.1)' : 'rgba(255, 153, 0, 0.1)',
      overflow: 'hidden',
      flexDirection: 'column',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(30, 144, 255, 0.1)' : 'rgba(255, 153, 0, 0.1)',
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
      letterSpacing: -0.3,
      flex: 1,
      textAlign: 'center',
    },
    spacer: {
      width: 32, // Same width as back button to center title
    },
    modalScrollContainer: {
      flex: 1,
    },
    modalScrollContent: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      paddingBottom: spacing.xxxl + spacing.lg,
    },
    filterSection: {
      marginBottom: spacing.lg,
    },
    filterSectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: spacing.sm,
      letterSpacing: -0.2,
    },
    filterChipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      justifyContent: 'flex-start',
    },
    filterChip: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(70, 130, 180, 0.4)' : 'rgba(200, 200, 200, 0.6)',
      backgroundColor: isDark ? 'rgba(30, 30, 50, 0.9)' : 'rgba(248, 249, 250, 0.95)',
      minWidth: 80,
      shadowColor: isDark ? '#4682b4' : '#c8c8c8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    selectedFilterChip: {
      backgroundColor: isDark ? '#1e90ff' : '#ff9900',
      borderColor: isDark ? '#1e90ff' : '#ff9900',
      shadowColor: isDark ? '#1e90ff' : '#ff9900',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.5 : 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    filterChipEmoji: {
      fontSize: 18,
      marginBottom: spacing.xs - 2,
    },
    filterChipText: {
      fontSize: 12,
      color: isDark ? '#e8e8e8' : '#2d3748',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: spacing.xs - 3,
    },
    filterChipDescription: {
      fontSize: 9,
      color: isDark ? '#b0b0b0' : '#6b7280',
      fontWeight: '500',
      textAlign: 'center',
      lineHeight: 11,
    },
    selectedFilterChipText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    selectedFilterChipDescription: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: '600',
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: isDark ? 'rgba(30, 144, 255, 0.1)' : 'rgba(255, 153, 0, 0.1)',
      backgroundColor: isDark ? 'rgba(15, 15, 35, 0.98)' : 'rgba(255, 255, 255, 0.98)',
      gap: spacing.sm,
    },
    clearButton2: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderRadius: 12,
      paddingVertical: spacing.sm + 2,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
    },
    clearButtonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '600',
    },
    applyButton: {
      flex: 1,
      backgroundColor: isDark ? '#1e90ff' : '#ff9900',
      borderRadius: 12,
      paddingVertical: spacing.sm + 2,
      alignItems: 'center',
      shadowColor: isDark ? '#1e90ff' : '#ff9900',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    applyButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('findPerfectRecipe')}</Text>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={theme.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchRecipes')}
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
            onPress={() => setShowFilters(true)}
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
            <Text style={styles.filterButtonText}>
              {t('filters')}
            </Text>
            {getTotalAppliedFilters() > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {getTotalAppliedFilters()}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </View>

        <Text style={styles.resultsText}>
          {filteredRecipes.length} {t('resultsFound')}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredRecipes.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Search size={60} color={theme.textSecondary} />
            <Text style={styles.noResultsText}>
              {t('noRecipesFound')}{'\n'}{t('tryAdjustingSearch')}
            </Text>
          </View>
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
          <View style={styles.recipesList}>
            {filteredRecipes.map((recipe: any) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </View>
        )}
      </ScrollView>

      {showFilters && (
        <Modal
          visible={showFilters}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowFilters(false)}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  opacity: modalOpacity,
                  transform: [{ scale: modalScale }]
                }
              ]}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => setShowFilters(false)}>
                  <ChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{t('filters') || 'Filtros'}</Text>
                <View style={styles.spacer} />
              </View>

              <ScrollView
                style={styles.modalScrollContainer}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {Object.entries(filterOptions).map(([category, options]) => (
                  <View key={category} style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>
                      {category === 'difficulty' ? (t('difficulty') || 'Dificultad') :
                        category === 'time' ? (t('time') || 'Tiempo') :
                          category === 'category' ? (t('category') || 'Categoría') :
                            category === 'anime' ? (t('anime') || 'Anime') :
                              category === 'servings' ? (t('servings') || 'Porciones') :
                                category === 'diet' ? (t('diet') || 'Dieta') :
                                  category}
                    </Text>
                    <View style={styles.filterChipsContainer}>
                      {options.map((option) => {
                        const isSelected = tempFilters[category as keyof typeof tempFilters].includes(option.id);
                        return (
                          <TouchableOpacity
                            key={option.id}
                            style={[
                              styles.filterChip,
                              isSelected && styles.selectedFilterChip,
                            ]}
                            onPress={() => toggleTempFilter(category as keyof typeof tempFilters, option.id)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.filterChipEmoji}>{option.emoji}</Text>
                            <Text
                              style={[
                                styles.filterChipText,
                                isSelected && styles.selectedFilterChipText,
                              ]}
                            >
                              {option.label}
                            </Text>
                            {option.description && (
                              <Text
                                style={[
                                  styles.filterChipDescription,
                                  isSelected && styles.selectedFilterChipDescription,
                                ]}
                              >
                                {option.description}
                              </Text>
                            )}
                            {isSelected && (
                              <View style={{ position: 'absolute', top: spacing.xs, right: spacing.xs }}>
                                <Check size={16} color="#FFFFFF" />
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.clearButton2}
                  onPress={clearTempFilters}
                >
                  <Text style={styles.clearButtonText}>{t('clearAll') || 'Limpiar Todo'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={applyFilters}
                >
                  <LinearGradient
                    colors={isDark ? ['#4A90E2', '#2E5BBA'] : ['#FFB347', '#FF8C00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.applyButtonText}>
                      {t('apply') || 'Aplicar'} {getTotalSelectedFilters() > 0 && `(${getTotalSelectedFilters()})`}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}