import { useLanguage } from '@/contexts/LanguageContext';
import { getIngredientById, getIngredientTranslation } from '@/data/core/ingredients';
import { RecipeIngredient } from '@/types/recipe-new';
import { convertToSystem, formatAmount as formatAmountUtil, translateUnit, UnitSystem } from '@/utils/unitConversion';

export interface IngredientDisplay {
    id: string;
    emoji: string;
    name: string;
    amount: number;
    unit: string;
    notes?: string;
}

export const useIngredients = (unitSystem?: UnitSystem) => {
    const { language } = useLanguage();

    const getIngredientDisplay = (recipeIngredient: RecipeIngredient): IngredientDisplay | null => {
        const ingredient = getIngredientById(recipeIngredient.ingredientId);
        if (!ingredient) {
            console.warn(`Ingrediente no encontrado: ${recipeIngredient.ingredientId}`);
            return null;
        }

        const translation = getIngredientTranslation(recipeIngredient.ingredientId, language);
        if (!translation) {
            console.warn(`Traducción no encontrada para ingrediente: ${recipeIngredient.ingredientId} en idioma: ${language}`);
            return null;
        }

        // Aplicar conversión de unidades si se especificó un sistema
        let amount = recipeIngredient.amount;
        let unit = recipeIngredient.unit || ingredient.unit;

        if (unitSystem) {
            const converted = convertToSystem(amount, unit, unitSystem);
            amount = converted.amount;
            unit = converted.unit;
        }

        // Traducir la unidad al idioma actual
        const translatedUnit = translateUnit(unit, language);

        return {
            id: ingredient.id,
            emoji: ingredient.emoji,
            name: translation.name,
            amount,
            unit: translatedUnit,
            notes: recipeIngredient.notes,
        };
    };

    const getIngredientsDisplay = (ingredients: RecipeIngredient[]): IngredientDisplay[] => {
        return ingredients
            .map(getIngredientDisplay)
            .filter((ingredient): ingredient is IngredientDisplay => ingredient !== null);
    };

    const calculateIngredientAmount = (
        originalAmount: number,
        originalServings: number,
        newServings: number
    ): number => {
        return (originalAmount * newServings) / originalServings;
    };

    const formatAmount = (amount: number, unit: string): string => {
        // Usar la utilidad de formateo de cantidad
        const formattedAmount = formatAmountUtil(amount);

        // Si es un número entero, no mostrar decimales
        if (formattedAmount % 1 === 0) {
            return `${Math.round(formattedAmount)} ${unit}`;
        }

        return `${formattedAmount} ${unit}`;
    };

    return {
        getIngredientDisplay,
        getIngredientsDisplay,
        calculateIngredientAmount,
        formatAmount,
    };
};
