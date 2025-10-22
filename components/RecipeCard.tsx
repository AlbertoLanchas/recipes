import { spacing } from '@/constants/themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { recipeTranslations } from '@/data/translations/recipes';
import { Recipe as LegacyRecipe } from '@/types';
import { RecipeData } from '@/types/recipe-new';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Clock, Heart, Users } from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecipeCardProps {
  recipe: LegacyRecipe | RecipeData;
  horizontal?: boolean;
  showProgress?: boolean;
  showDescriptionText?: boolean;
  variant?: 'default' | 'grid';
  imageHeight?: number;
}

export const RecipeCard: React.FC<RecipeCardProps> = React.memo(({ recipe, horizontal = false, showProgress = false, showDescriptionText = false, variant = 'default', imageHeight }) => {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { language } = useLanguage();
  const { isFavorite, addFavorite, removeFavorite, getRecipeProgress } = useUser();

  const progressPercentage = getRecipeProgress(recipe.id)?.percentage || 0;

  const handleFavoritePress = useCallback(() => {
    if (isFavorite(recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe.id);
    }
  }, [addFavorite, removeFavorite, isFavorite, recipe.id]);

  const handlePress = useCallback(() => {
    router.push(`/recipe/${recipe.id}` as any);
  }, [recipe.id, router]);

  const { title, description } = useMemo(() => {
    const hasNewTranslations = (recipe as any).translations && typeof (recipe as any).translations === 'object';
    if (hasNewTranslations) {
      const t = (recipe as RecipeData).translations[language]?.title
        || (recipe as RecipeData).translations['en']?.title
        || (recipe as RecipeData).translations['es']?.title
        || (recipe as any).id;
      const d = (recipe as RecipeData).translations[language]?.description
        || (recipe as RecipeData).translations['en']?.description
        || (recipe as RecipeData).translations['es']?.description
        || '';
      return { title: t, description: d };
    }
    const transByLang = (recipeTranslations as any)[language];
    const transEN = (recipeTranslations as any)['en'];
    const transES = (recipeTranslations as any)['es'];
    const id = (recipe as LegacyRecipe).id;
    const byId = transByLang?.[id] || transEN?.[id] || transES?.[id];
    const t = byId?.title || (recipe as LegacyRecipe).title || (recipe as LegacyRecipe).titleEN || (recipe as LegacyRecipe).title;
    const d = byId?.description || (recipe as LegacyRecipe).description || (recipe as LegacyRecipe).descriptionEN || (recipe as LegacyRecipe).description;
    return { title: t, description: d };
  }, [language, recipe]);

  const getImageSource = (image: any) => {
    // Si es una URL string, devolver como objeto uri
    if (typeof image === 'string') {
      return { uri: image };
    }
    // Si es un require() local, devolverlo directamente
    return image;
  };

  const styles = StyleSheet.create({
    container: {
      borderRadius: variant === 'grid' ? 12 : 20,
      overflow: 'hidden',
      marginBottom: spacing.md,
      width: horizontal ? 200 : '100%',
      marginRight: horizontal ? spacing.md : 0,
      position: 'relative',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(30, 144, 255, 0.1)' : 'rgba(255, 153, 0, 0.1)',
    },
    image: {
      width: '100%',
      height: horizontal ? 220 : (variant === 'grid' ? 170 : 140),
    },
    overlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: horizontal ? 80 : (variant === 'grid' ? 70 : 60),
    },
    content: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: horizontal ? spacing.md : spacing.sm,
    },
    title: {
      fontSize: horizontal ? 18 : 14,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: horizontal ? spacing.sm : spacing.xs,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
      letterSpacing: -0.3,
      lineHeight: horizontal ? 20 : 16,
    },
    description: {
      fontSize: horizontal ? 13 : 12,
      color: '#FFFFFF',
      marginBottom: horizontal ? spacing.sm - 2 : spacing.xs,
      opacity: 0.9,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      lineHeight: horizontal ? 16 : 14,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: horizontal ? spacing.sm + 4 : spacing.sm,
    },
    infoContainer: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      zIndex: 2,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoText: {
      fontSize: horizontal ? 14 : 12,
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: horizontal ? spacing.xs : spacing.xs - 2,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    progressBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 1.5,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <ImageBackground
        source={getImageSource(recipe.image)}
        style={[styles.image, imageHeight ? { height: imageHeight } : null]}
        resizeMode="cover"
      >
        <View style={styles.infoContainer}>
          <TouchableOpacity onPress={handleFavoritePress}>
            <Heart
              size={20}
              color={isFavorite(recipe.id) ? theme.error : '#FFFFFF'}
              fill={isFavorite(recipe.id) ? theme.error : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.overlay}>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
            }}
          />
          <View style={[styles.content, {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: spacing.md,
            zIndex: 1,
          }]}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            {!!description && showDescriptionText && (
              <Text style={styles.description} numberOfLines={2}>
                {description}
              </Text>
            )}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Clock size={12} color="#FFFFFF" />
                <Text style={styles.infoText}>{recipe.time}m</Text>
              </View>

              <View style={styles.infoItem}>
                <Users size={12} color="#FFFFFF" />
                <Text style={styles.infoText}>{recipe.servings}</Text>
              </View>
            </View>
          </View>
        </View>

        {showProgress && progressPercentage > 0 && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
});

RecipeCard.displayName = 'RecipeCard';
