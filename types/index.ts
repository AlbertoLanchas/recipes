// Re-export types from recipe.ts for backward compatibility
export type { Ingredient, Recipe, RecipeStep as Step } from './recipe';

// Re-export types from recipe-new.ts for new system
export type {
  Anime as AnimeNew,
  AnimeTranslation, Category,
  CategoryTranslation, CompleteRecipe, Ingredient as IngredientNew,
  IngredientTranslation, RecipeData, RecipeFilters, RecipeIngredient, RecipeSearchParams,
  RecipeStats, RecipeStepTranslation, RecipeTranslation
} from './recipe-new';

export interface UserProgress {
  recipeId: string;
  completedSteps: string[];
  percentage: number;
  lastUpdated: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
}

export interface UserStats {
  recipesStarted: number;
  recipesCompleted: number;
  totalProgress: number;
  favoriteCount: number;
}

export interface AnimeCategory {
  name: string;
  nameEN: string;
  image: string;
  recipeCount: number;
}

export type ThemeColors = {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  border: string;
  tabBarBackground: string;
  tabBarActiveTint: string;
  tabBarInactiveTint: string;
};