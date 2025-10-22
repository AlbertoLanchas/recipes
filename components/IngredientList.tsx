import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useIngredients } from '@/hooks/useIngredients';
import { RecipeIngredient } from '@/types/recipe-new';
import { UnitSystem } from '@/utils/unitConversion';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IngredientListProps {
    ingredients: RecipeIngredient[];
    servings: number;
    originalServings: number;
    unitSystem?: UnitSystem;
}

export const IngredientList: React.FC<IngredientListProps> = ({
    ingredients,
    servings,
    originalServings,
    unitSystem,
}) => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const { getIngredientsDisplay, calculateIngredientAmount, formatAmount } = useIngredients(unitSystem);

    const ingredientsDisplay = getIngredientsDisplay(ingredients);

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'column',
            marginBottom: 20,
        },
        ingredientRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            marginBottom: 8,
            backgroundColor: theme.background,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border + '20',
            shadowColor: theme.text,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        ingredientEmoji: {
            fontSize: 24,
            marginRight: 16,
            width: 30,
            textAlign: 'center',
        },
        ingredientContent: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        ingredientName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.text,
            flex: 1,
        },
        ingredientAmount: {
            fontSize: 14,
            color: theme.primary,
            fontWeight: '500',
            minWidth: 80,
            textAlign: 'right',
        },
        emptyState: {
            padding: 20,
            alignItems: 'center',
        },
        emptyText: {
            fontSize: 16,
            color: theme.textSecondary,
            textAlign: 'center',
        },
    });

    if (ingredientsDisplay.length === 0) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>{t('noIngredientsAvailable')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {ingredientsDisplay.map((ingredient, index) => {
                const adjustedAmount = calculateIngredientAmount(
                    ingredient.amount,
                    originalServings,
                    servings
                );
                const formattedAmount = formatAmount(adjustedAmount, ingredient.unit);

                return (
                    <View key={`${ingredient.id}-${index}`} style={styles.ingredientRow}>
                        <Text style={styles.ingredientEmoji}>{ingredient.emoji}</Text>
                        <View style={styles.ingredientContent}>
                            <Text style={styles.ingredientName}>{ingredient.name}</Text>
                            <Text style={styles.ingredientAmount}>{formattedAmount}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};
