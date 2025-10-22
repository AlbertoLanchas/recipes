// Tipos para el sistema final de recetas

export interface RecipeTranslation {
    title: string;
    description: string;
    phases: RecipePhaseTranslation[];
}

export interface RecipeStepTranslation {
    instruction: string;
    tips?: string;
}

export interface RecipePhaseTranslation {
    title: string;
    description?: string;
    steps: RecipeStepTranslation[];
}

export interface RecipePhase {
    id: string;
    translations: {
        [language: string]: RecipePhaseTranslation;
    };
    order: number;
}

export interface RecipeIngredient {
    ingredientId: string;
    amount: number;
    unit?: string;
    notes?: string;
}

// Tipo principal de receta
export interface Recipe {
    // Datos comunes (no requieren traducción)
    id: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
    time: number; // en minutos
    servings: number;
    isFavorite: boolean;
    createdAt?: string;
    updatedAt?: string;

    // Referencias por ID (no duplicación)
    categoryId: string;
    animeId: string;

    // Datos específicos de la receta
    image: any;
    backgroundImage?: any;

    // Ingredientes con cantidades
    ingredients: RecipeIngredient[];

    // Fases de la receta
    phases: RecipePhase[];

    // Traducciones
    translations: {
        [language: string]: RecipeTranslation;
    };

    // Metadatos adicionales
    tags?: string[];
    nutritionInfo?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
}

// Tipo para receta completa con todas las referencias resueltas
export interface CompleteRecipe extends Recipe {
    category: Category;
    anime: Anime;
    ingredients: (RecipeIngredient & { ingredient: Ingredient })[];
}

// Compatibilidad con el sistema anterior - mantiene la interfaz antigua
export interface RecipeData extends Recipe { }

// Tipos para el sistema de ingredientes
export interface IngredientTranslation {
    name: string;
    description?: string;
    category?: string;
}

export interface Ingredient {
    id: string;
    emoji: string;
    unit: string;
    translations: {
        [language: string]: IngredientTranslation;
    };
    tags?: string[];
}

// Tipos para el sistema de categorías
export interface CategoryTranslation {
    name: string;
    description?: string;
}

export interface Category {
    id: string;
    emoji: string;
    color: string;
    translations: {
        [language: string]: CategoryTranslation;
    };
    tags?: string[];
}

// Tipos para el sistema de animes
export interface AnimeTranslation {
    name: string;
    description?: string;
}

export interface Anime {
    id: string;
    emoji: string;
    color: string;
    image: string;
    recipeCount: number;
    translations: {
        [language: string]: AnimeTranslation;
    };
    tags?: string[];
    year?: number;
    genre?: string[];
}

// Tipos para filtros y búsquedas
export interface RecipeFilters {
    difficulty: string[];
    time: string[];
    category: string[];
    anime: string[];
    servings: string[];
    diet: string[];
    tags?: string[];
}

export interface RecipeSearchParams {
    query?: string;
    filters?: RecipeFilters;
    sortBy?: 'title' | 'difficulty' | 'time' | 'createdAt' | 'popularity';
    sortOrder?: 'asc' | 'desc';
}

export interface RecipeStats {
    totalRecipes: number;
    byAnime: { [anime: string]: number };
    byCategory: { [category: string]: number };
    byDifficulty: { [difficulty: string]: number };
    averageTime: number;
    mostPopular: RecipeData[];
}
