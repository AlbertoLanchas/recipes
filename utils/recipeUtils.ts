import { recipeTranslations } from '@/data/translations/recipes';
import { Recipe, RecipeFilters, RecipeSearchParams, RecipeStats } from '@/types/recipe';

export class RecipeManager {
    private recipes: Recipe[] = [];

    constructor(recipes: Recipe[]) {
        this.recipes = recipes;
    }

    // Obtener todas las recetas
    getAllRecipes(): Recipe[] {
        return this.recipes;
    }

    // Obtener receta por ID
    getRecipeById(id: string): Recipe | undefined {
        return this.recipes.find(recipe => recipe.id === id);
    }

    // Buscar recetas
    searchRecipes(params: RecipeSearchParams): Recipe[] {
        let results = [...this.recipes];

        // Aplicar filtro de búsqueda por texto
        if (params.query) {
            const query = params.query.toLowerCase();
            results = results.filter(recipe =>
                recipe.title.toLowerCase().includes(query) ||
                recipe.titleEN.toLowerCase().includes(query) ||
                recipe.description.toLowerCase().includes(query) ||
                recipe.descriptionEN.toLowerCase().includes(query) ||
                recipe.anime.toLowerCase().includes(query) ||
                recipe.animeEN.toLowerCase().includes(query)
            );
        }

        // Aplicar filtros
        if (params.filters) {
            results = this.applyFilters(results, params.filters);
        }

        // Aplicar ordenamiento
        if (params.sortBy) {
            results = this.sortRecipes(results, params.sortBy, params.sortOrder || 'asc');
        }

        return results;
    }

    // Aplicar filtros a las recetas
    private applyFilters(recipes: Recipe[], filters: RecipeFilters): Recipe[] {
        return recipes.filter(recipe => {
            // Filtro por dificultad
            if (filters.difficulty.length > 0) {
                const difficultyMatch = filters.difficulty.some(diff => {
                    switch (diff) {
                        case 'easy': return recipe.difficulty <= 2;
                        case 'medium': return recipe.difficulty === 3;
                        case 'hard': return recipe.difficulty >= 4;
                        default: return false;
                    }
                });
                if (!difficultyMatch) return false;
            }

            // Filtro por tiempo
            if (filters.time.length > 0) {
                const timeMatch = filters.time.some(time => {
                    switch (time) {
                        case 'quick': return recipe.time < 30;
                        case 'medium-time': return recipe.time >= 30 && recipe.time <= 60;
                        case 'long': return recipe.time > 60;
                        default: return false;
                    }
                });
                if (!timeMatch) return false;
            }

            // Filtro por categoría
            if (filters.category.length > 0) {
                if (!filters.category.includes(recipe.category.toLowerCase())) return false;
            }

            // Filtro por anime
            if (filters.anime.length > 0) {
                if (!filters.anime.includes(recipe.anime.toLowerCase())) return false;
            }

            // Filtro por porciones
            if (filters.servings.length > 0) {
                const servingsMatch = filters.servings.some(serving => {
                    switch (serving) {
                        case 'single': return recipe.servings === 1;
                        case 'couple': return recipe.servings === 2;
                        case 'family': return recipe.servings >= 4;
                        default: return false;
                    }
                });
                if (!servingsMatch) return false;
            }

            return true;
        });
    }

    // Ordenar recetas
    private sortRecipes(recipes: Recipe[], sortBy: string, order: 'asc' | 'desc'): Recipe[] {
        return recipes.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'difficulty':
                    aValue = a.difficulty;
                    bValue = b.difficulty;
                    break;
                case 'time':
                    aValue = a.time;
                    bValue = b.time;
                    break;
                case 'createdAt':
                    aValue = new Date(a.createdAt || '');
                    bValue = new Date(b.createdAt || '');
                    break;
                default:
                    return 0;
            }

            if (order === 'desc') {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            } else {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            }
        });
    }

    // Obtener estadísticas de recetas
    getRecipeStats(): RecipeStats {
        const byAnime: { [anime: string]: number } = {};
        const byCategory: { [category: string]: number } = {};
        const byDifficulty: { [difficulty: string]: number } = {};
        let totalTime = 0;

        this.recipes.forEach(recipe => {
            // Por anime
            byAnime[recipe.anime] = (byAnime[recipe.anime] || 0) + 1;

            // Por categoría
            byCategory[recipe.category] = (byCategory[recipe.category] || 0) + 1;

            // Por dificultad
            const difficultyLevel = recipe.difficulty <= 2 ? 'easy' :
                recipe.difficulty === 3 ? 'medium' : 'hard';
            byDifficulty[difficultyLevel] = (byDifficulty[difficultyLevel] || 0) + 1;

            totalTime += recipe.time;
        });

        // Recetas más populares (basado en favoritos)
        const mostPopular = this.recipes
            .filter(recipe => recipe.isFavorite)
            .slice(0, 5);

        return {
            totalRecipes: this.recipes.length,
            byAnime,
            byCategory,
            byDifficulty,
            averageTime: Math.round(totalTime / this.recipes.length),
            mostPopular,
        };
    }

    // Obtener recetas por anime
    getRecipesByAnime(anime: string): Recipe[] {
        return this.recipes.filter(recipe =>
            recipe.anime.toLowerCase() === anime.toLowerCase() ||
            recipe.animeEN.toLowerCase() === anime.toLowerCase()
        );
    }

    // Obtener recetas favoritas
    getFavoriteRecipes(): Recipe[] {
        return this.recipes.filter(recipe => recipe.isFavorite);
    }

    // Marcar/desmarcar como favorita
    toggleFavorite(recipeId: string): Recipe | null {
        const recipe = this.getRecipeById(recipeId);
        if (recipe) {
            recipe.isFavorite = !recipe.isFavorite;
            return recipe;
        }
        return null;
    }

    // Obtener recetas similares
    getSimilarRecipes(recipeId: string, limit: number = 3): Recipe[] {
        const targetRecipe = this.getRecipeById(recipeId);
        if (!targetRecipe) return [];

        return this.recipes
            .filter(recipe =>
                recipe.id !== recipeId &&
                (recipe.anime === targetRecipe.anime ||
                    recipe.category === targetRecipe.category)
            )
            .slice(0, limit);
    }
}

// Utilidades de traducción
export class RecipeTranslationManager {
    static getTranslatedRecipe(recipe: Recipe, language: string): Recipe {
        const translations = recipeTranslations[language];
        if (!translations || !translations[recipe.id]) {
            return recipe;
        }

        const translation = translations[recipe.id];

        return {
            ...recipe,
            title: language === 'es' ? translation.title : recipe.titleEN,
            description: language === 'es' ? translation.description : recipe.descriptionEN,
            ingredients: recipe.ingredients.map((ingredient, index) => ({
                ...ingredient,
                name: language === 'es' ? translation.ingredients[index]?.name || ingredient.name : ingredient.nameEN,
                amount: language === 'es' ? translation.ingredients[index]?.amount || ingredient.amount : ingredient.amountEN,
            })),
            steps: recipe.steps.map((step, index) => ({
                ...step,
                instruction: language === 'es' ? translation.steps[index]?.instruction || step.instruction : step.instructionEN,
            })),
        };
    }

    static getAvailableLanguages(): string[] {
        return Object.keys(recipeTranslations);
    }
}

// Utilidades de validación
export class RecipeValidator {
    static validateRecipe(recipe: Recipe): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!recipe.id) errors.push('ID is required');
        if (!recipe.title) errors.push('Title is required');
        if (!recipe.titleEN) errors.push('English title is required');
        if (!recipe.description) errors.push('Description is required');
        if (!recipe.descriptionEN) errors.push('English description is required');
        if (!recipe.image) errors.push('Image is required');
        if (!recipe.ingredients || recipe.ingredients.length === 0) errors.push('Ingredients are required');
        if (!recipe.steps || recipe.steps.length === 0) errors.push('Steps are required');
        if (recipe.difficulty < 1 || recipe.difficulty > 5) errors.push('Difficulty must be between 1 and 5');
        if (recipe.time <= 0) errors.push('Time must be greater than 0');
        if (recipe.servings <= 0) errors.push('Servings must be greater than 0');
        if (!recipe.anime) errors.push('Anime is required');
        if (!recipe.category) errors.push('Category is required');

        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}
