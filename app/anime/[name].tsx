import { RecipeCard } from '@/components/RecipeCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { allRecipesLegacy, animeCategories } from '@/data/recipes';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AnimeRecipesScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { t, language } = useLanguage();

  const decodedName = decodeURIComponent(name as string);
  const animeCategory = animeCategories.find((a: any) => (a.translations?.[language]?.name || a.name || a.nameEN) === decodedName);
  const allRecipes = allRecipesLegacy(language) || [];
  const animeRecipes = allRecipes.filter(recipe => recipe.anime === decodedName);

  const animeName = animeCategory
    ? ((animeCategory.translations?.[language]?.name) || animeCategory.name || animeCategory.nameEN)
    : decodedName;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      marginRight: 16,
      padding: 8,
    },
    headerText: {
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    emptyText: {
      fontSize: 18,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>{animeName}</Text>
          <Text style={styles.subtitle}>
            {animeRecipes.length} {animeRecipes.length === 1 ? t('recipe') : t('recipes')}
          </Text>
        </View>
      </View>

      {animeRecipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {t('noRecipesAvailable')}{'\n'}
            {t('checkBackSoon')}
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {animeRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} showDescriptionText={false} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}