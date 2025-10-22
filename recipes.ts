// Archivo de compatibilidad simple - sin duplicaciones
import { getAllRecipesLegacy, getRecipeByIdLegacy, getRecipesByAnime } from './recipes/index';

// Importar animeCategories directamente - Basadas en las recetas reales disponibles
// Añadimos soporte de traducciones para todos los idiomas soportados
const supportedLanguages = ['es', 'en', 'it', 'de', 'fr', 'pt', 'ja', 'hi', 'zh', 'ru', 'ko', 'ar', 'tr', 'th', 'id'];

const animeCategories = [
  {
    id: 'saiyans',
    name: 'Saiyans',
    nameEN: 'Saiyans',
    translations: {
      es: { name: 'Saiyans' },
      en: { name: 'Saiyans' },
      it: { name: 'Saiyan' },
      de: { name: 'Saiyajin' },
      fr: { name: 'Saiyans' },
      pt: { name: 'Saiyajin' },
      ja: { name: 'サイヤ人' },
      hi: { name: 'सैयान' },
      zh: { name: '赛亚人' },
      ru: { name: 'Сайяны' },
      ko: { name: '사이어인' },
      ar: { name: 'سايان' },
      tr: { name: 'Saiyan' },
      th: { name: 'ไซย่า' },
      id: { name: 'Saiyan' },
    },
    image: require('@/assets/optimized/wallpapers/saiyans.jpg'),
    // Cuenta real basada en animeId
    recipeCount: getRecipesByAnime('saiyans').length,
  },
  {
    id: 'ninjas',
    name: 'Ninjas',
    nameEN: 'Ninjas',
    translations: {
      es: { name: 'Ninjas' },
      en: { name: 'Ninjas' },
      it: { name: 'Ninja' },
      de: { name: 'Ninja' },
      fr: { name: 'Ninja' },
      pt: { name: 'Ninja' },
      ja: { name: '忍者' },
      hi: { name: 'निंजा' },
      zh: { name: '忍者' },
      ru: { name: 'Ниндзя' },
      ko: { name: '닌자' },
      ar: { name: 'نينجا' },
      tr: { name: 'Ninja' },
      th: { name: 'นินจา' },
      id: { name: 'Ninja' },
    },
    image: require('@/assets/optimized/wallpapers/ninjas.jpg'),
    recipeCount: getRecipesByAnime('ninjas').length,
  },
  {
    id: 'pirates',
    name: 'Piratas',
    nameEN: 'Pirates',
    translations: {
      es: { name: 'Piratas' },
      en: { name: 'Pirates' },
      it: { name: 'Pirati' },
      de: { name: 'Piraten' },
      fr: { name: 'Pirates' },
      pt: { name: 'Piratas' },
      ja: { name: '海賊' },
      hi: { name: 'समुद्री डाकू' },
      zh: { name: '海盗' },
      ru: { name: 'Пираты' },
      ko: { name: '해적' },
      ar: { name: 'قراصنة' },
      tr: { name: 'Korsanlar' },
      th: { name: 'โจรสลัด' },
      id: { name: 'Bajak Laut' },
    },
    image: require('@/assets/optimized/wallpapers/pirates.jpg'),
    recipeCount: getRecipesByAnime('pirates').length,
  },
  {
    id: 'slayers',
    name: 'Slayers',
    nameEN: 'Slayers',
    translations: {
      es: { name: 'Slayers' },
      en: { name: 'Slayers' },
      it: { name: 'Slayers' },
      de: { name: 'Slayers' },
      fr: { name: 'Slayers' },
      pt: { name: 'Slayers' },
      ja: { name: 'スレイヤーズ' },
      hi: { name: 'स्लेयर्ज़' },
      zh: { name: 'Slayers' },
      ru: { name: 'Slayers' },
      ko: { name: '슬레이어즈' },
      ar: { name: 'سلايرز' },
      tr: { name: 'Slayers' },
      th: { name: 'สเลเยอร์ส' },
      id: { name: 'Slayers' },
    },
    image: require('@/assets/optimized/wallpapers/slayers.jpg'),
    recipeCount: getRecipesByAnime('slayers').length,
  },
  {
    id: 'spirits',
    name: 'Spirits',
    nameEN: 'Spirits',
    translations: {
      es: { name: 'Espíritus' },
      en: { name: 'Spirits' },
      it: { name: 'Spiriti' },
      de: { name: 'Geister' },
      fr: { name: 'Esprits' },
      pt: { name: 'Espíritos' },
      ja: { name: '精霊' },
      hi: { name: 'आत्माएं' },
      zh: { name: '灵魂' },
      ru: { name: 'Духи' },
      ko: { name: '영혼' },
      ar: { name: 'أرواح' },
      tr: { name: 'Ruhlar' },
      th: { name: 'วิญญาณ' },
      id: { name: 'Roh' },
    },
    image: require('@/assets/optimized/wallpapers/spirits.jpg'),
    recipeCount: getRecipesByAnime('spirits').length,
  },
  {
    id: 'scientists',
    name: 'Scientists',
    nameEN: 'Scientists',
    translations: {
      es: { name: 'Científicos' },
      en: { name: 'Scientists' },
      it: { name: 'Scienziati' },
      de: { name: 'Wissenschaftler' },
      fr: { name: 'Scientifiques' },
      pt: { name: 'Cientistas' },
      ja: { name: '科学者' },
      hi: { name: 'वैज्ञानिक' },
      zh: { name: '科学家' },
      ru: { name: 'Учёные' },
      ko: { name: '과학자들' },
      ar: { name: 'علماء' },
      tr: { name: 'Bilim insanları' },
      th: { name: 'นักวิทยาศาสตร์' },
      id: { name: 'Ilmuwan' },
    },
    image: require('@/assets/optimized/wallpapers/scientist.png'),
    recipeCount: getRecipesByAnime('scientists').length,
  },
  {
    id: 'stands',
    name: 'Stands',
    nameEN: 'Stands',
    translations: {
      es: { name: 'Stands' },
      en: { name: 'Stands' },
      it: { name: 'Stand' },
      de: { name: 'Stands' },
      fr: { name: 'Stands' },
      pt: { name: 'Stands' },
      ja: { name: 'スタンド' },
      hi: { name: 'स्टैंड' },
      zh: { name: '替身' },
      ru: { name: 'Стенд' },
      ko: { name: '스탠드' },
      ar: { name: 'ستاند' },
      tr: { name: 'Stand' },
      th: { name: 'สแตนด์' },
      id: { name: 'Stand' },
    },
    image: require('@/assets/optimized/wallpapers/stands.jpeg'),
    recipeCount: getRecipesByAnime('stands').length,
  },
] as any[];

// Completar traducciones para todos los idiomas soportados usando EN/ES como base
animeCategories.forEach((cat) => {
  const base = (cat.translations && (cat.translations['en'] || cat.translations['es'])) || { name: cat.nameEN || cat.name };
  if (!cat.translations) cat.translations = {};
  supportedLanguages.forEach((lang) => {
    if (!cat.translations[lang]) {
      cat.translations[lang] = { name: base.name || cat.name || cat.nameEN };
    }
  });
});

// Exportar funciones de compatibilidad
export const allRecipes = getAllRecipesLegacy('es');
export const trendingRecipes = getAllRecipesLegacy('es').slice(0, 3);
// Carousel: limitar a las 6 recetas específicas (Bread/Scientists, Buns/Spirits, Meat/Pirates, Ramen/Slayers, Salad/Stands, Takoyaki/Saiyans)
export const featuredRecipes = [
  // Orden requerido: saiyans, meat, sopa, caprese, spirits, scientists
  getRecipeByIdLegacy('saiyans-takoyaki', 'es'),
  getRecipeByIdLegacy('meat', 'es'),
  getRecipeByIdLegacy('sopa-udon', 'es'),
  getRecipeByIdLegacy('caprese-salad', 'es'),
  getRecipeByIdLegacy('spirits-bollos-rellenos', 'es'),
  getRecipeByIdLegacy('scientists-pan', 'es'),
].filter(Boolean) as any;
export const mockRecipes = getAllRecipesLegacy('es');

// Versión localizada del carrusel destacado
export const getFeaturedRecipes = (language: string = 'es') => (
  [
    getRecipeByIdLegacy('saiyans-takoyaki', language),
    getRecipeByIdLegacy('meat', language),
    getRecipeByIdLegacy('sopa-udon', language),
    getRecipeByIdLegacy('caprese-salad', language),
    getRecipeByIdLegacy('spirits-bollos-rellenos', language),
    getRecipeByIdLegacy('scientists-pan', language),
  ].filter(Boolean) as any
);

// Exportar allRecipesLegacy como función para compatibilidad
export const allRecipesLegacy = getAllRecipesLegacy;

// Exportar categorías de anime
export { animeCategories };

// Re-exportar funciones principales
export {
  getAllRecipesLegacy, getFavoriteRecipes, getRecipeById, getRecipeByIdLegacy, getRecipesByAnime, getRecipesByAnimeLegacy, getRecipesByCategory, getRecipesByCategoryLegacy, getRecipesByDifficulty,
  getRecipesByTime, searchRecipes
} from './recipes/index';

