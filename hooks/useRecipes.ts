import { useLanguage } from '@/contexts/LanguageContext';
import {
    allRecipes,
    getFavoriteRecipes,
    getRecipeById,
    getRecipesByAnime,
    getRecipesByCategory,
    getRecipesByDifficulty,
    getRecipesByTime,
    searchRecipes
} from '@/data/recipes/index';
import { RecipeData, RecipeStats } from '@/types/recipe-new';
import { useEffect, useMemo, useState } from 'react';

// Hook principal para recetas
export const useRecipes = () => {
    const { language } = useLanguage();
    const [loading, setLoading] = useState(false);

    const getRecipe = (id: string): RecipeData | undefined => {
        return getRecipeById(id);
    };

    const getRecipesByAnimeId = (animeId: string): RecipeData[] => {
        return getRecipesByAnime(animeId);
    };

    const getRecipesByCategoryId = (categoryId: string): RecipeData[] => {
        return getRecipesByCategory(categoryId);
    };

    const getRecipesByDifficultyLevel = (difficulty: number): RecipeData[] => {
        return getRecipesByDifficulty(difficulty);
    };

    const getRecipesByTimeLimit = (maxTime: number): RecipeData[] => {
        return getRecipesByTime(maxTime);
    };

    const getFavoriteRecipesList = (): RecipeData[] => {
        return getFavoriteRecipes();
    };

    const searchRecipesList = (query: string): RecipeData[] => {
        return searchRecipes(query, language);
    };

    const getStats = (): RecipeStats => {
        const totalRecipes = allRecipes.length;
        const byAnime: { [anime: string]: number } = {};
        const byCategory: { [category: string]: number } = {};
        const byDifficulty: { [difficulty: string]: number } = {};
        let totalTime = 0;

        allRecipes.forEach((recipe: RecipeData) => {
            // Por anime
            byAnime[recipe.animeId] = (byAnime[recipe.animeId] || 0) + 1;

            // Por categoría
            byCategory[recipe.categoryId] = (byCategory[recipe.categoryId] || 0) + 1;

            // Por dificultad
            byDifficulty[recipe.difficulty.toString()] = (byDifficulty[recipe.difficulty.toString()] || 0) + 1;

            // Tiempo promedio
            totalTime += recipe.time;
        });

        const averageTime = totalRecipes > 0 ? totalTime / totalRecipes : 0;

        return {
            totalRecipes,
            byAnime,
            byCategory,
            byDifficulty,
            averageTime,
            mostPopular: allRecipes.filter(r => r.isFavorite).slice(0, 5)
        };
    };

    return {
        recipes: allRecipes,
        loading,
        getRecipe,
        getRecipesByAnimeId,
        getRecipesByCategoryId,
        getRecipesByDifficultyLevel,
        getRecipesByTimeLimit,
        getFavoriteRecipesList,
        searchRecipesList,
        getStats
    };
};

// Hook para una receta específica
export const useRecipe = (recipeId: string) => {
    const { language } = useLanguage();
    const [recipe, setRecipe] = useState<RecipeData | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (recipeId) {
            const foundRecipe = getRecipeById(recipeId);
            setRecipe(foundRecipe);
            setLoading(false);
        }
    }, [recipeId]);

    return { recipe, loading };
};

// Hook para búsqueda
export const useRecipeSearch = (searchParams?: { query?: string; filters?: any }) => {
    const { language } = useLanguage();
    const [filteredRecipes, setFilteredRecipes] = useState<RecipeData[]>([]);

    const applyFilters = useMemo(() => {
        let filtered = [...allRecipes];

        if (searchParams?.query) {
            const query = searchParams.query.toLowerCase();
            filtered = filtered.filter((recipe: RecipeData) => {
                const translation = recipe.translations[language];
                return translation?.title.toLowerCase().includes(query) ||
                    translation?.description.toLowerCase().includes(query) ||
                    recipe.tags?.some((tag: string) => tag.toLowerCase().includes(query));
            });
        }

        if (searchParams?.filters) {
            const { difficulty, time, category, anime, servings } = searchParams.filters;

            if (difficulty && difficulty.length > 0) {
                filtered = filtered.filter((recipe: RecipeData) =>
                    difficulty.includes(recipe.difficulty.toString())
                );
            }

            if (time && time.length > 0) {
                filtered = filtered.filter((recipe: RecipeData) => {
                    const recipeTime = recipe.time;
                    return time.some((timeFilter: string) => {
                        switch (timeFilter) {
                            case 'quick': return recipeTime <= 15;
                            case 'medium': return recipeTime > 15 && recipeTime <= 30;
                            case 'long': return recipeTime > 30;
                            default: return true;
                        }
                    });
                });
            }

            if (category && category.length > 0) {
                filtered = filtered.filter((recipe: RecipeData) =>
                    category.includes(recipe.categoryId)
                );
            }

            if (anime && anime.length > 0) {
                filtered = filtered.filter((recipe: RecipeData) =>
                    anime.includes(recipe.animeId)
                );
            }

            if (servings && servings.length > 0) {
                filtered = filtered.filter((recipe: RecipeData) =>
                    servings.includes(recipe.servings.toString())
                );
            }
        }

        return filtered;
    }, [searchParams, language]);

    useEffect(() => {
        setFilteredRecipes(applyFilters);
    }, [applyFilters]);

    return {
        filteredRecipes,
        totalResults: filteredRecipes.length
    };
};