/**
 * Utilidad para convertir unidades entre sistemas métrico e imperial
 * Factores de conversión basados en estándares internacionales
 */

export type UnitSystem = 'metric' | 'imperial';

export interface UnitConversion {
    from: string;
    to: string;
    factor: number;
    offset?: number;
}

// Factores de conversión oficiales
const CONVERSION_FACTORS: Record<string, UnitConversion> = {
    // Volumen
    'cups_to_ml': { from: 'cups', to: 'ml', factor: 236.588 },
    'ml_to_cups': { from: 'ml', to: 'cups', factor: 0.00422675 },
    'tbsp_to_ml': { from: 'tbsp', to: 'ml', factor: 14.7868 },
    'ml_to_tbsp': { from: 'ml', to: 'tbsp', factor: 0.067628 },
    'tsp_to_ml': { from: 'tsp', to: 'ml', factor: 4.92892 },
    'ml_to_tsp': { from: 'ml', to: 'tsp', factor: 0.202884 },

    // Peso
    'kg_to_lb': { from: 'kg', to: 'lb', factor: 2.20462 },
    'lb_to_kg': { from: 'lb', to: 'kg', factor: 0.453592 },
    'g_to_oz': { from: 'g', to: 'oz', factor: 0.035274 },
    'oz_to_g': { from: 'oz', to: 'g', factor: 28.3495 },

    // Temperatura
    'celsius_to_fahrenheit': { from: '°C', to: '°F', factor: 1.8, offset: 32 },
    'fahrenheit_to_celsius': { from: '°F', to: '°C', factor: 0.556, offset: -32 },
};

// Mapeo de unidades por sistema
const UNIT_SYSTEM_MAP: Record<string, { metric: string; imperial: string }> = {
    // Volumen líquido
    'cups': { metric: 'ml', imperial: 'cups' },
    'ml': { metric: 'ml', imperial: 'cups' },
    'tbsp': { metric: 'ml', imperial: 'tbsp' },
    'tsp': { metric: 'ml', imperial: 'tsp' },
    'l': { metric: 'l', imperial: 'cups' },

    // Peso
    'kg': { metric: 'kg', imperial: 'lb' },
    'g': { metric: 'g', imperial: 'oz' },
    'lb': { metric: 'kg', imperial: 'lb' },
    'oz': { metric: 'g', imperial: 'oz' },

    // Unidades que no cambian
    'piece': { metric: 'piece', imperial: 'piece' },
    'pieces': { metric: 'pieces', imperial: 'pieces' },
    'cloves': { metric: 'cloves', imperial: 'cloves' },
    'clove': { metric: 'clove', imperial: 'clove' },
    'unit': { metric: 'unit', imperial: 'unit' },
    'units': { metric: 'units', imperial: 'units' },
    'slice': { metric: 'slice', imperial: 'slice' },
    'slices': { metric: 'slices', imperial: 'slices' },
    'pinch': { metric: 'pinch', imperial: 'pinch' },
    'to taste': { metric: 'to taste', imperial: 'to taste' },
    'sheet': { metric: 'sheet', imperial: 'sheet' },
    'sheets': { metric: 'sheets', imperial: 'sheets' },
    'can': { metric: 'can', imperial: 'can' },
    'cans': { metric: 'cans', imperial: 'cans' },
    'stalk': { metric: 'stalk', imperial: 'stalk' },
    'stalks': { metric: 'stalks', imperial: 'stalks' },
};

/**
 * Convierte una cantidad de una unidad a otra
 */
export function convertUnit(
    amount: number,
    fromUnit: string,
    toUnit: string
): number {
    // Si las unidades son iguales, no convertir
    if (fromUnit === toUnit) {
        return amount;
    }

    // Buscar la conversión directa
    const conversionKey = `${fromUnit}_to_${toUnit}`;
    const conversion = CONVERSION_FACTORS[conversionKey];

    if (conversion) {
        const offset = (conversion as any).offset || 0;
        if (offset !== 0) {
            // Para temperatura
            return (amount + offset) * conversion.factor;
        }
        return amount * conversion.factor;
    }

    // Si no se encuentra conversión, devolver el valor original
    console.warn(`No se encontró conversión de ${fromUnit} a ${toUnit}`);
    return amount;
}

/**
 * Obtiene la unidad apropiada según el sistema de medida
 */
export function getUnitForSystem(unit: string, system: UnitSystem): string {
    const unitMap = UNIT_SYSTEM_MAP[unit.toLowerCase()];

    if (!unitMap) {
        // Si no está en el mapa, devolver la unidad original
        return unit;
    }

    return system === 'metric' ? unitMap.metric : unitMap.imperial;
}

/**
 * Convierte una cantidad y unidad al sistema especificado
 */
export function convertToSystem(
    amount: number,
    currentUnit: string,
    targetSystem: UnitSystem
): { amount: number; unit: string } {
    const targetUnit = getUnitForSystem(currentUnit, targetSystem);

    // Si la unidad no cambió, devolver valores originales
    if (targetUnit === currentUnit) {
        return { amount, unit: currentUnit };
    }

    const convertedAmount = convertUnit(amount, currentUnit, targetUnit);

    return {
        amount: convertedAmount,
        unit: targetUnit,
    };
}

/**
 * Determina si una unidad necesita conversión entre sistemas
 */
export function needsConversion(unit: string): boolean {
    const unitMap = UNIT_SYSTEM_MAP[unit.toLowerCase()];
    return unitMap ? unitMap.metric !== unitMap.imperial : false;
}

/**
 * Obtiene el sistema de medida de una unidad
 */
export function getUnitSystem(unit: string): UnitSystem {
    const imperialUnits = ['cups', 'tbsp', 'tsp', 'lb', 'oz', 'fl oz', 'gal', 'qt', 'pt'];
    const metricUnits = ['ml', 'l', 'g', 'kg'];

    const unitLower = unit.toLowerCase();

    if (imperialUnits.includes(unitLower)) {
        return 'imperial';
    }

    if (metricUnits.includes(unitLower)) {
        return 'metric';
    }

    // Por defecto, asumir métrico
    return 'metric';
}

/**
 * Formatea un número de cantidad para mostrar
 */
export function formatAmount(amount: number): number {
    // Redondear a 2 decimales
    const rounded = Math.round(amount * 100) / 100;

    // Si es muy cercano a un número entero, redondear
    if (Math.abs(rounded - Math.round(rounded)) < 0.01) {
        return Math.round(rounded);
    }

    return rounded;
}

// Traducciones de unidades para todos los idiomas
const UNIT_TRANSLATIONS: Record<string, Record<string, string>> = {
    // Español
    es: {
        'cup': 'taza',
        'cups': 'tazas',
        'tbsp': 'cda',
        'tsp': 'cdta',
        'ml': 'ml',
        'l': 'l',
        'g': 'g',
        'kg': 'kg',
        'lb': 'lb',
        'oz': 'oz',
        'piece': 'pieza',
        'pieces': 'piezas',
        'clove': 'diente',
        'cloves': 'dientes',
        'unit': 'unidad',
        'units': 'unidades',
        'slice': 'rodaja',
        'slices': 'rodajas',
        'pinch': 'pizca',
        'to taste': 'al gusto',
        'sheet': 'hoja',
        'sheets': 'hojas',
        'can': 'lata',
        'cans': 'latas',
        'stalk': 'tallo',
        'stalks': 'tallos',
        '°C': '°C',
        '°F': '°F',
    },
    // English
    en: {
        'cup': 'cup',
        'cups': 'cups',
        'tbsp': 'tbsp',
        'tsp': 'tsp',
        'ml': 'ml',
        'l': 'l',
        'g': 'g',
        'kg': 'kg',
        'lb': 'lb',
        'oz': 'oz',
        'piece': 'piece',
        'pieces': 'pieces',
        'clove': 'clove',
        'cloves': 'cloves',
        'unit': 'unit',
        'units': 'units',
        'slice': 'slice',
        'slices': 'slices',
        'pinch': 'pinch',
        'to taste': 'to taste',
        'sheet': 'sheet',
        'sheets': 'sheets',
        'can': 'can',
        'cans': 'cans',
        'stalk': 'stalk',
        'stalks': 'stalks',
        '°C': '°C',
        '°F': '°F',
    },
    // Italiano
    it: {
        'cup': 'tazza',
        'cups': 'tazze',
        'tbsp': 'cucchiaio',
        'tsp': 'cucchiaino',
        'ml': 'ml',
        'l': 'l',
        'g': 'g',
        'kg': 'kg',
        'lb': 'lb',
        'oz': 'oz',
        'piece': 'pezzo',
        'pieces': 'pezzi',
        'clove': 'spicchio',
        'cloves': 'spicchi',
        'unit': 'unità',
        'units': 'unità',
        'slice': 'fetta',
        'slices': 'fette',
        'pinch': 'pizzico',
        'to taste': 'q.b.',
        'sheet': 'foglio',
        'sheets': 'fogli',
        'can': 'lattina',
        'cans': 'lattine',
        'stalk': 'gambo',
        'stalks': 'gambi',
        '°C': '°C',
        '°F': '°F',
    },
    // Deutsch
    de: {
        'cup': 'Tasse',
        'cups': 'Tassen',
        'tbsp': 'EL',
        'tsp': 'TL',
        'ml': 'ml',
        'l': 'l',
        'g': 'g',
        'kg': 'kg',
        'lb': 'lb',
        'oz': 'oz',
        'piece': 'Stück',
        'pieces': 'Stück',
        'clove': 'Zehe',
        'cloves': 'Zehen',
        'unit': 'Einheit',
        'units': 'Einheiten',
        'slice': 'Scheibe',
        'slices': 'Scheiben',
        'pinch': 'Prise',
        'to taste': 'nach Geschmack',
        'sheet': 'Blatt',
        'sheets': 'Blätter',
        'can': 'Dose',
        'cans': 'Dosen',
        'stalk': 'Stängel',
        'stalks': 'Stängel',
        '°C': '°C',
        '°F': '°F',
    },
    // Français
    fr: {
        'cup': 'tasse',
        'cups': 'tasses',
        'tbsp': 'c. à s.',
        'tsp': 'c. à c.',
        'ml': 'ml',
        'l': 'l',
        'g': 'g',
        'kg': 'kg',
        'lb': 'lb',
        'oz': 'oz',
        'piece': 'pièce',
        'pieces': 'pièces',
        'clove': 'gousse',
        'cloves': 'gousses',
        'unit': 'unité',
        'units': 'unités',
        'slice': 'tranche',
        'slices': 'tranches',
        'pinch': 'pincée',
        'to taste': 'au goût',
        'sheet': 'feuille',
        'sheets': 'feuilles',
        'can': 'boîte',
        'cans': 'boîtes',
        'stalk': 'tige',
        'stalks': 'tiges',
        '°C': '°C',
        '°F': '°F',
    },
    // Português
    pt: {
        'cup': 'xícara',
        'cups': 'xícaras',
        'tbsp': 'colher sopa',
        'tsp': 'colher chá',
        'ml': 'ml',
        'l': 'l',
        'g': 'g',
        'kg': 'kg',
        'lb': 'lb',
        'oz': 'oz',
        'piece': 'peça',
        'pieces': 'peças',
        'clove': 'dente',
        'cloves': 'dentes',
        'unit': 'unidade',
        'units': 'unidades',
        'slice': 'fatia',
        'slices': 'fatias',
        'pinch': 'pitada',
        'to taste': 'a gosto',
        'sheet': 'folha',
        'sheets': 'folhas',
        'can': 'lata',
        'cans': 'latas',
        'stalk': 'talo',
        'stalks': 'talos',
        '°C': '°C',
        '°F': '°F',
    },
    // 日本語
    ja: {
        'cup': 'カップ',
        'cups': 'カップ',
        'tbsp': '大さじ',
        'tsp': '小さじ',
        'ml': 'ml',
        'l': 'l',
        'g': 'g',
        'kg': 'kg',
        'lb': 'lb',
        'oz': 'oz',
        'piece': '個',
        'pieces': '個',
        'clove': '片',
        'cloves': '片',
        'unit': '個',
        'units': '個',
        'slice': '枚',
        'slices': '枚',
        'pinch': 'ひとつまみ',
        'to taste': 'お好みで',
        'sheet': '枚',
        'sheets': '枚',
        'can': '缶',
        'cans': '缶',
        'stalk': '本',
        'stalks': '本',
        '°C': '°C',
        '°F': '°F',
    },
    // हिन्दी
    hi: {
        'cup': 'कप',
        'cups': 'कप',
        'tbsp': 'बड़ा चम्मच',
        'tsp': 'छोटा चम्मच',
        'ml': 'मिली',
        'l': 'लीटर',
        'g': 'ग्राम',
        'kg': 'किलो',
        'lb': 'पौंड',
        'oz': 'औंस',
        'piece': 'टुकड़ा',
        'pieces': 'टुकड़े',
        'clove': 'कली',
        'cloves': 'कलियाँ',
        'unit': 'इकाई',
        'units': 'इकाइयाँ',
        'slice': 'स्लाइस',
        'slices': 'स्लाइस',
        'pinch': 'चुटकी',
        'to taste': 'स्वादानुसार',
        'sheet': 'शीट',
        'sheets': 'शीट्स',
        'can': 'डिब्बा',
        'cans': 'डिब्बे',
        'stalk': 'डंठल',
        'stalks': 'डंठल',
        '°C': '°C',
        '°F': '°F',
    },
    // 中文
    zh: {
        'cup': '杯',
        'cups': '杯',
        'tbsp': '汤匙',
        'tsp': '茶匙',
        'ml': '毫升',
        'l': '升',
        'g': '克',
        'kg': '千克',
        'lb': '磅',
        'oz': '盎司',
        'piece': '个',
        'pieces': '个',
        'clove': '瓣',
        'cloves': '瓣',
        'unit': '个',
        'units': '个',
        'slice': '片',
        'slices': '片',
        'pinch': '少许',
        'to taste': '适量',
        'sheet': '张',
        'sheets': '张',
        'can': '罐',
        'cans': '罐',
        'stalk': '根',
        'stalks': '根',
        '°C': '°C',
        '°F': '°F',
    },
    // Русский
    ru: {
        'cup': 'чашка',
        'cups': 'чашки',
        'tbsp': 'ст.л.',
        'tsp': 'ч.л.',
        'ml': 'мл',
        'l': 'л',
        'g': 'г',
        'kg': 'кг',
        'lb': 'фунт',
        'oz': 'унция',
        'piece': 'шт',
        'pieces': 'шт',
        'clove': 'зубчик',
        'cloves': 'зубчика',
        'unit': 'единица',
        'units': 'единицы',
        'slice': 'ломтик',
        'slices': 'ломтики',
        'pinch': 'щепотка',
        'to taste': 'по вкусу',
        'sheet': 'лист',
        'sheets': 'листа',
        'can': 'банка',
        'cans': 'банки',
        'stalk': 'стебель',
        'stalks': 'стебля',
        '°C': '°C',
        '°F': '°F',
    },
    // 한국어
    ko: {
        'cup': '컵',
        'cups': '컵',
        'tbsp': '큰술',
        'tsp': '작은술',
        'ml': 'ml',
        'l': 'l',
        'g': 'g',
        'kg': 'kg',
        'lb': '파운드',
        'oz': '온스',
        'piece': '개',
        'pieces': '개',
        'clove': '쪽',
        'cloves': '쪽',
        'unit': '개',
        'units': '개',
        'slice': '조각',
        'slices': '조각',
        'pinch': '한 꼬집',
        'to taste': '기호에 맞게',
        'sheet': '장',
        'sheets': '장',
        'can': '캔',
        'cans': '캔',
        'stalk': '대',
        'stalks': '대',
        '°C': '°C',
        '°F': '°F',
    },
    // العربية
    ar: {
        'cup': 'كوب',
        'cups': 'أكواب',
        'tbsp': 'ملعقة كبيرة',
        'tsp': 'ملعقة صغيرة',
        'ml': 'مل',
        'l': 'لتر',
        'g': 'جم',
        'kg': 'كجم',
        'lb': 'رطل',
        'oz': 'أونصة',
        'piece': 'قطعة',
        'pieces': 'قطع',
        'clove': 'فص',
        'cloves': 'فصوص',
        'unit': 'وحدة',
        'units': 'وحدات',
        'slice': 'شريحة',
        'slices': 'شرائح',
        'pinch': 'رشة',
        'to taste': 'حسب الذوق',
        'sheet': 'ورقة',
        'sheets': 'أوراق',
        'can': 'علبة',
        'cans': 'علب',
        'stalk': 'ساق',
        'stalks': 'سيقان',
        '°C': '°م',
        '°F': '°ف',
    },
    // Türkçe
    tr: {
        'cup': 'su bardağı',
        'cups': 'su bardağı',
        'tbsp': 'yemek kaşığı',
        'tsp': 'çay kaşığı',
        'ml': 'ml',
        'l': 'l',
        'g': 'g',
        'kg': 'kg',
        'lb': 'libre',
        'oz': 'ons',
        'piece': 'adet',
        'pieces': 'adet',
        'clove': 'diş',
        'cloves': 'diş',
        'unit': 'birim',
        'units': 'birim',
        'slice': 'dilim',
        'slices': 'dilim',
        'pinch': 'tutam',
        'to taste': 'damak tadına göre',
        'sheet': 'yaprak',
        'sheets': 'yaprak',
        'can': 'kutu',
        'cans': 'kutu',
        'stalk': 'sap',
        'stalks': 'sap',
        '°C': '°C',
        '°F': '°F',
    },
    // ไทย
    th: {
        'cup': 'ถ้วย',
        'cups': 'ถ้วย',
        'tbsp': 'ช้อนโต๊ะ',
        'tsp': 'ช้อนชา',
        'ml': 'มล.',
        'l': 'ลิตร',
        'g': 'กรัม',
        'kg': 'กก.',
        'lb': 'ปอนด์',
        'oz': 'ออนซ์',
        'piece': 'ชิ้น',
        'pieces': 'ชิ้น',
        'clove': 'กลีบ',
        'cloves': 'กลีบ',
        'unit': 'หน่วย',
        'units': 'หน่วย',
        'slice': 'แผ่น',
        'slices': 'แผ่น',
        'pinch': 'เล็กน้อย',
        'to taste': 'ตามชอบ',
        'sheet': 'แผ่น',
        'sheets': 'แผ่น',
        'can': 'กระป๋อง',
        'cans': 'กระป๋อง',
        'stalk': 'ต้น',
        'stalks': 'ต้น',
        '°C': '°C',
        '°F': '°F',
    },
    // Bahasa Indonesia
    id: {
        'cup': 'cangkir',
        'cups': 'cangkir',
        'tbsp': 'sdm',
        'tsp': 'sdt',
        'ml': 'ml',
        'l': 'l',
        'g': 'g',
        'kg': 'kg',
        'lb': 'pon',
        'oz': 'ons',
        'piece': 'buah',
        'pieces': 'buah',
        'clove': 'siung',
        'cloves': 'siung',
        'unit': 'unit',
        'units': 'unit',
        'slice': 'iris',
        'slices': 'iris',
        'pinch': 'sejumput',
        'to taste': 'sesuai selera',
        'sheet': 'lembar',
        'sheets': 'lembar',
        'can': 'kaleng',
        'cans': 'kaleng',
        'stalk': 'batang',
        'stalks': 'batang',
        '°C': '°C',
        '°F': '°F',
    },
};

/**
 * Traduce una unidad al idioma especificado
 */
export function translateUnit(unit: string, language: string = 'es'): string {
    const translations = UNIT_TRANSLATIONS[language];

    if (!translations) {
        // Si no existe el idioma, devolver la unidad en inglés
        return UNIT_TRANSLATIONS['en'][unit.toLowerCase()] || unit;
    }

    return translations[unit.toLowerCase()] || unit;
}

