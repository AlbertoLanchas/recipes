export interface CategoryTranslation {
    name: string;
    description?: string;
}

export interface Category {
    id: string;
    emoji: string;
    color: string; // color hexadecimal para UI
    translations: {
        [language: string]: CategoryTranslation;
    };
    tags?: string[]; // para filtros: ["hot", "cold", "sweet", "savory", etc.]
}

export const categories: Category[] = [
    {
        id: 'main-course',
        emoji: '🍽️',
        color: '#FF6B6B',
        translations: {
            es: { name: 'Plato Principal', description: 'Platos principales y comidas completas' },
            en: { name: 'Main Course', description: 'Main dishes and complete meals' }
        },
        tags: ['savory', 'filling', 'protein-rich']
    },
    {
        id: 'snack',
        emoji: '🍿',
        color: '#4ECDC4',
        translations: {
            es: { name: 'Snack', description: 'Aperitivos y bocadillos' },
            en: { name: 'Snack', description: 'Appetizers and light bites' }
        },
        tags: ['quick', 'portable', 'light']
    },
    {
        id: 'dessert',
        emoji: '🍰',
        color: '#FFE66D',
        translations: {
            es: { name: 'Postre', description: 'Dulces y postres' },
            en: { name: 'Dessert', description: 'Sweets and desserts' }
        },
        tags: ['sweet', 'indulgent', 'special-occasion']
    },
    {
        id: 'drink',
        emoji: '🥤',
        color: '#A8E6CF',
        translations: {
            es: { name: 'Bebida', description: 'Bebidas y líquidos' },
            en: { name: 'Drink', description: 'Beverages and liquids' }
        },
        tags: ['refreshing', 'hydrating']
    },
    {
        id: 'soup',
        emoji: '🍲',
        color: '#FFB347',
        translations: {
            es: { name: 'Sopa', description: 'Sopas y caldos' },
            en: { name: 'Soup', description: 'Soups and broths' }
        },
        tags: ['warm', 'comforting', 'liquid']
    },
    {
        id: 'salad',
        emoji: '🥗',
        color: '#98D8C8',
        translations: {
            es: { name: 'Ensalada', description: 'Ensaladas y platos frescos' },
            en: { name: 'Salad', description: 'Fresh salads and dishes' }
        },
        tags: ['fresh', 'healthy', 'cold', 'light']
    },
    {
        id: 'side-dish',
        emoji: '🥔',
        color: '#F7DC6F',
        translations: {
            es: { name: 'Acompañamiento', description: 'Guarniciones y acompañamientos' },
            en: { name: 'Side Dish', description: 'Side dishes and accompaniments' }
        },
        tags: ['complementary', 'supporting']
    },
    {
        id: 'breakfast',
        emoji: '🥞',
        color: '#FF9FF3',
        translations: {
            es: { name: 'Desayuno', description: 'Platos para el desayuno' },
            en: { name: 'Breakfast', description: 'Morning dishes' }
        },
        tags: ['morning', 'energizing']
    },
    {
        id: 'street-food',
        emoji: '🌭',
        color: '#54A0FF',
        translations: {
            es: { name: 'Comida Callejera', description: 'Comida típica de puestos callejeros' },
            en: { name: 'Street Food', description: 'Typical street vendor food' }
        },
        tags: ['casual', 'quick', 'authentic']
    }
];

// Funciones de utilidad para categorías
export const getCategoryById = (id: string): Category | undefined => {
    return categories.find(category => category.id === id);
};

export const getCategoryTranslation = (id: string, language: string): CategoryTranslation | undefined => {
    const category = getCategoryById(id);
    return category?.translations[language];
};

export const searchCategories = (query: string, language: string = 'es'): Category[] => {
    const lowercaseQuery = query.toLowerCase();
    return categories.filter(category => {
        const translation = category.translations[language];
        return translation?.name.toLowerCase().includes(lowercaseQuery) ||
            translation?.description?.toLowerCase().includes(lowercaseQuery) ||
            category.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery));
    });
};
