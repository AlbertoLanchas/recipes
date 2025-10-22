export interface Ingredient {
    name: string;
    nameEN: string;
    amount: string;
    amountEN: string;
    emoji: string;
}

export interface RecipeStep {
    id: string;
    instruction: string;
    instructionEN: string;
    completed: boolean;
}

export interface RecipePhase {
    id: string;
    title: string;
    titleEN: string;
    description?: string;
    descriptionEN?: string;
    steps: RecipeStep[];
    order: number;
}

export interface RecipeCategory {
    id: string;
    name: string;
    nameEN: string;
    emoji: string;
}

export interface AnimeInfo {
    id: string;
    name: string;
    nameEN: string;
    emoji: string;
    color: string;
}

export interface Recipe {
    id: string;
    title: string;
    titleEN: string;
    description: string;
    descriptionEN: string;
    image: any;
    backgroundImage?: any;
    backgroundVideo?: any;
    ingredients: Ingredient[];
    phases: RecipePhase[];
    difficulty: number;
    time: number;
    servings: number;
    anime: string;
    animeEN: string;
    isFavorite: boolean;
    category: string;
    tags?: string[];
    nutritionInfo?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface RecipeFilters {
    difficulty: string[];
    time: string[];
    category: string[];
    anime: string[];
    servings: string[];
    diet: string[];
}

export interface RecipeSearchParams {
    query?: string;
    filters?: RecipeFilters;
    sortBy?: 'title' | 'difficulty' | 'time' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface RecipeStats {
    totalRecipes: number;
    byAnime: { [anime: string]: number };
    byCategory: { [category: string]: number };
    byDifficulty: { [difficulty: string]: number };
    averageTime: number;
    mostPopular: Recipe[];
}
