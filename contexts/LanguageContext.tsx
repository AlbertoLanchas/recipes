import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'es' | 'en' | 'it' | 'de' | 'fr' | 'pt' | 'ja' | 'hi' | 'zh' | 'ru' | 'ko' | 'ar' | 'tr' | 'th' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getLanguageInfo: (lang: Language) => { name: string; flag: string };
}

const translations = {
  es: {
    // Navigation
    home: 'Inicio',
    anime: 'Anime',
    favorites: 'Favoritos',
    profile: 'Perfil',
    timers: 'Temporizadores',

    // Welcome Screen
    welcome: 'Bienvenido a',
    animeRecipes: 'Recetas Anime',
    discoverNewRecipes: 'Descubre nuevas recetas inspiradas en tus animes favoritos',
    getStarted: 'Comenzar',

    // Home Screen
    continueWatching: 'Continuar Cocinando',
    trends: 'Tendencias',
    allRecipes: 'Todas las Recetas',
    viewMore: 'Ver más',
    browseAnime: 'Explorar Anime',
    searchRecipes: 'Buscar recetas...',
    all: 'Todo',
    quickFilter: 'Rápido',
    easyFilter: 'Fácil',
    popular: 'Popular',

    // Search Screen
    findPerfectRecipe: 'Encuentra la receta perfecta',
    filters: 'Filtros',
    clearAll: 'Limpiar Todo',
    recentSearches: 'Búsquedas Recientes',
    clear: 'Limpiar',
    suggestedRecipes: 'Recetas Sugeridas',
    resultsFound: 'resultados encontrados',
    noRecipesFound: 'No se encontraron recetas',
    tryAdjustingSearch: 'Intenta ajustar tu búsqueda o filtros',

    // Filter Categories
    difficulty: 'Dificultad',
    time: 'Tiempo',
    category: 'Categoría',
    easy: 'Fácil (1-2 ⭐)',
    medium: 'Medio (3 ⭐)',
    hard: 'Difícil (4-5 ⭐)',
    quick: 'Rápido (< 30min)',
    'medium-time': 'Medio (30-60min)',
    long: 'Largo (> 60min)',
    main: 'Plato Principal',
    snack: 'Snack',
    dessert: 'Postre',
    drink: 'Bebida',
    naruto: 'Naruto',
    onepiece: 'One Piece',
    demonslayer: 'Demon Slayer',
    ghibli: 'Studio Ghibli',
    pokemon: 'Pokémon',
    dragonball: 'Dragon Ball',

    // Recipe Detail
    recipeNotFound: 'Receta no encontrada',
    ingredients: 'Ingredientes',
    instructions: 'Instrucciones',
    step: 'Paso',
    serve: 'porciones',

    // Anime Screen
    animeCollection: 'Colección Anime',
    browseRecipesByAnime: 'Explora recetas por anime',
    searchAnime: 'Buscar anime...',
    recipes: 'recetas',
    recipe: 'receta',
    noRecipesAvailable: 'No hay recetas disponibles para este anime',
    noIngredientsAvailable: 'No hay ingredientes disponibles',
    checkBackSoon: 'Vuelve pronto para más contenido',

    // Favorites Screen
    yourSavedRecipes: 'Tus recetas guardadas',
    searchYourFavorites: 'Buscar en tus favoritos...',
    noFavoritesYet: '¡Aún no tienes favoritos!',
    discoverAmazingRecipes: 'Descubre recetas increíbles y guárdalas aquí para acceso rápido',
    exploreRecipes: 'Explorar Recetas',

    // Profile Screen
    animeChef: 'Chef Anime',
    preferences: 'Preferencias',
    theme: 'Tema',
    language: 'Idioma',
    notifications: 'Notificaciones',
    enabled: 'Habilitado',
    toolsSupport: 'Herramientas y Soporte',
    shareApp: 'Compartir App',
    helpSupport: 'Ayuda y Soporte',
    privacyPolicy: 'Política de Privacidad',
    dataManagement: 'Gestión de Datos',
    clearAllData: 'Limpiar Todos los Datos',
    chooseLanguage: 'Elegir Idioma',
    selectLanguage: 'Seleccionar Idioma',
    close: 'Cerrar',
    light: 'Claro',
    dark: 'Oscuro',
    auto: 'Automático',

    // Achievement Levels
    'master chef': 'Chef Maestro',
    'expert cook': 'Cocinero Experto',
    'home cook': 'Cocinero Casero',
    apprentice: 'Aprendiz',
    beginner: 'Principiante',

    // Share Messages
    shareMessage: '¡He completado {count} recetas increíbles en Anime Recipes! 🍜✨',
    shareTitle: 'Anime Recipes - ¡Cocina como en el anime!',
    shareRecipeMessage: 'Me encanta {recipe} 😍 Si quieres probarla, descarga la app aquí: {link} 🍜',

    // Help & Privacy
    helpSupportTitle: 'Ayuda y Soporte',
    helpContent: 'Para obtener ayuda, visita nuestra página de soporte o contáctanos por email. Estamos aquí para ayudarte con cualquier pregunta sobre las recetas.',
    gotIt: 'Entendido',
    privacyPolicyTitle: 'Política de Privacidad',
    privacyContent: 'Respetamos tu privacidad. Todos los datos se almacenan localmente en tu dispositivo. No compartimos información personal con terceros.',
    understood: 'Comprendido',
    clearDataTitle: 'Limpiar Datos',
    clearDataMessage: '¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.',
    cancel: 'Cancelar',
    clearData: 'Limpiar Datos',
    success: 'Éxito',
    allDataCleared: 'Todos los datos han sido eliminados',
    error: 'Error',
    errorClearingData: 'No se pudieron limpiar los datos. Por favor, inténtalo de nuevo.',

    // Search filters
    linkCopied: 'Enlace copiado al portapapeles',
    copyLinkBelow: 'Copia el enlace a continuación:',
    apply: 'Aplicar',
    selected: 'seleccionado',

    // Recipe progress
    cookingProgress: 'Progreso de Cocción',
    reset: 'Restablecer',

    // Units
    measurementSystem: 'Sistema de Unidades',
    metric: 'Métrico',
    imperial: 'Imperial',
    steps: 'pasos',

    // Diet types
    vegan: 'Vegano',
    omnivore: 'Omnívoro',
    dietPreference: 'Preferencia de Dieta',

    // Timers
    manageTimers: 'Gestiona tus temporizadores de cocina',
    quickStartTimers: 'Temporizadores Rápidos',
    customTimer: 'Temporizador Personalizado',
    createCustomTimer: 'Crear Temporizador Personalizado',
    timerName: 'Nombre del temporizador',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    create: 'Crear',
    activeTimers: 'Temporizadores Activos',
    noActiveTimers: 'No hay temporizadores activos',
    createOneAbove: 'Crea uno arriba',
    completed: 'Completado',
    running: 'En marcha',
    paused: 'Pausado',
    timerCompleted: '¡Temporizador Completado!',
    timerReady: '¡{name} está listo!',
    ok: 'OK',

    // Timer Presets
    boileggs: 'Hervir Huevos',
    steamrice: 'Cocer Arroz',
    marinate: 'Marinar',
    restdough: 'Reposar Masa',
    simmerbroth: 'Hervir Caldo',

    // Onboarding
    chefIntro: '¡Gatunos días! Soy el Chef Kai, aspirante a cocinero. Seré tu guía en este viaje culinario. Antes de empezar a picar y saltear, necesito conocer un par de detalles para asegurarme de que la cocina sea perfecta para ti.',
    measurementPreferenceTitle: '¿Cómo prefieres que te dé las medidas de los ingredientes?',
    measurementOption1: 'Métrico (kg/g, L/ml)',
    measurementOption2: 'Imperial (lb/oz, Gal/qt)',
    dietPreferenceTitle: '¿Cuál es tu estilo de dieta principal?',
    dietOption1: 'Omnívoro',
    dietOption2: 'Vegano',
    continue: 'Continuar',
    back: 'Atrás',
    start: 'Empezar',
  },
  en: {
    // Navigation
    home: 'Home',
    anime: 'Anime',
    favorites: 'Favorites',
    profile: 'Profile',
    timers: 'Timers',

    // Welcome Screen
    welcome: 'Welcome to',
    animeRecipes: 'Anime Recipes',
    discoverNewRecipes: 'Discover new recipes inspired by your favorite anime',
    getStarted: 'Get Started',

    // Home Screen
    continueWatching: 'Continue Cooking',
    trends: 'Trending',
    allRecipes: 'All Recipes',
    viewMore: 'View More',
    browseAnime: 'Browse Anime',
    searchRecipes: 'Search recipes...',
    all: 'All',
    quickFilter: 'Quick',
    easyFilter: 'Easy',
    popular: 'Popular',

    // Search Screen
    findPerfectRecipe: 'Find the perfect recipe',
    filters: 'Filters',
    clearAll: 'Clear All',
    recentSearches: 'Recent Searches',
    clear: 'Clear',
    suggestedRecipes: 'Suggested Recipes',
    resultsFound: 'results found',
    noRecipesFound: 'No recipes found',
    tryAdjustingSearch: 'Try adjusting your search or filters',

    // Filter Categories
    difficulty: 'Difficulty',
    time: 'Time',
    category: 'Category',
    easy: 'Easy (1-2 ⭐)',
    medium: 'Medium (3 ⭐)',
    hard: 'Hard (4-5 ⭐)',
    quick: 'Quick (< 30min)',
    'medium-time': 'Medium (30-60min)',
    long: 'Long (> 60min)',
    main: 'Main Course',
    snack: 'Snack',
    dessert: 'Dessert',
    drink: 'Drink',
    naruto: 'Naruto',
    onepiece: 'One Piece',
    demonslayer: 'Demon Slayer',
    ghibli: 'Studio Ghibli',
    pokemon: 'Pokémon',
    dragonball: 'Dragon Ball',

    // Recipe Detail
    recipeNotFound: 'Recipe not found',
    ingredients: 'Ingredients',
    instructions: 'Instructions',
    step: 'Step',
    serve: 'servings',

    // Anime Screen
    animeCollection: 'Anime Collection',
    browseRecipesByAnime: 'Browse recipes by anime',
    searchAnime: 'Search anime...',
    recipes: 'recipes',
    recipe: 'recipe',
    noRecipesAvailable: 'No recipes available for this anime',
    noIngredientsAvailable: 'No ingredients available',
    checkBackSoon: 'Check back soon for more content',

    // Favorites Screen
    yourSavedRecipes: 'Your saved recipes',
    searchYourFavorites: 'Search your favorites...',
    noFavoritesYet: 'No favorites yet!',
    discoverAmazingRecipes: 'Discover amazing recipes and save them here for quick access',
    exploreRecipes: 'Explore Recipes',

    // Profile Screen
    animeChef: 'Anime Chef',
    preferences: 'Preferences',
    theme: 'Theme',
    language: 'Language',
    notifications: 'Notifications',
    enabled: 'Enabled',
    toolsSupport: 'Tools & Support',
    shareApp: 'Share App',
    helpSupport: 'Help & Support',
    privacyPolicy: 'Privacy Policy',
    dataManagement: 'Data Management',
    clearAllData: 'Clear All Data',
    chooseLanguage: 'Choose Language',
    selectLanguage: 'Select Language',
    close: 'Close',
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto',

    // Achievement Levels
    'master chef': 'Master Chef',
    'expert cook': 'Expert Cook',
    'home cook': 'Home Cook',
    apprentice: 'Apprentice',
    beginner: 'Beginner',

    // Share Messages
    shareMessage: 'I\'ve completed {count} amazing recipes in Anime Recipes! 🍜✨',
    shareTitle: 'Anime Recipes - Cook like in anime!',
    shareRecipeMessage: 'I\'m loving {recipe} 😍 Want to try it? Get the app: {link} 🍜',

    // Help & Privacy
    helpSupportTitle: 'Help & Support',
    helpContent: 'For help, visit our support page or contact us via email. We\'re here to help with any questions about recipes.',
    gotIt: 'Got It',
    privacyPolicyTitle: 'Privacy Policy',
    privacyContent: 'We respect your privacy. All data is stored locally on your device. We don\'t share personal information with third parties.',
    understood: 'Understood',
    clearDataTitle: 'Clear Data',
    clearDataMessage: 'Are you sure you want to delete all your data? This action cannot be undone.',
    cancel: 'Cancel',
    clearData: 'Clear Data',
    success: 'Success',
    allDataCleared: 'All data has been cleared',
    error: 'Error',
    errorClearingData: 'Could not clear data. Please try again.',

    // Search filters
    linkCopied: 'Link copied to clipboard',
    copyLinkBelow: 'Copy the link below:',
    apply: 'Apply',
    selected: 'selected',

    // Recipe progress
    cookingProgress: 'Cooking Progress',
    reset: 'Reset',

    // Units
    measurementSystem: 'Measurement System',
    metric: 'Metric',
    imperial: 'Imperial',
    steps: 'steps',

    // Diet types
    vegan: 'Vegan',
    omnivore: 'Omnivore',
    dietPreference: 'Diet Preference',

    // Timers
    manageTimers: 'Manage your cooking timers',
    quickStartTimers: 'Quick Start Timers',
    customTimer: 'Custom Timer',
    createCustomTimer: 'Create Custom Timer',
    timerName: 'Timer name',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    create: 'Create',
    activeTimers: 'Active Timers',
    noActiveTimers: 'No active timers',
    createOneAbove: 'Create one above',
    completed: 'Completed',
    running: 'Running',
    paused: 'Paused',
    timerCompleted: 'Timer Completed!',
    timerReady: '{name} is ready!',
    ok: 'OK',

    // Timer Presets
    boileggs: 'Boil Eggs',
    steamrice: 'Steam Rice',
    marinate: 'Marinate',
    restdough: 'Rest Dough',
    simmerbroth: 'Simmer Broth',

    // Onboarding
    chefIntro: 'Meow-velous day! I\'m Chef Kai, aspiring cook. I\'ll be your guide on this culinary journey. Before we start chopping and sautéing, I need to know a couple of details to make sure the kitchen is perfect for you.',
    measurementPreferenceTitle: 'How would you like me to give you the ingredient measurements?',
    measurementOption1: 'Metric (kg/g, L/ml)',
    measurementOption2: 'Imperial (lb/oz, Gal/qt)',
    dietPreferenceTitle: 'What is your main diet style?',
    dietOption1: 'Omnivore',
    dietOption2: 'Vegan',
    continue: 'Continue',
    back: 'Back',
    start: 'Start',
  },
  it: {
    // Navigation
    home: 'Casa',
    anime: 'Anime',
    favorites: 'Preferiti',
    profile: 'Profilo',
    timers: 'Timer',

    // Welcome Screen
    welcome: 'Benvenuto in',
    animeRecipes: 'Ricette Anime',
    discoverNewRecipes: 'Scopri nuove ricette ispirate ai tuoi anime preferiti',
    getStarted: 'Inizia',

    // Home Screen
    continueWatching: 'Continua a Cucinare',
    trends: 'Tendenze',
    allRecipes: 'Tutte le Ricette',
    viewMore: 'Vedi altro',
    browseAnime: 'Sfoglia Anime',
    searchRecipes: 'Cerca ricette...',
    all: 'Tutto',
    quickFilter: 'Veloce',
    easyFilter: 'Facile',
    popular: 'Popolare',

    // Search Screen
    findPerfectRecipe: 'Trova la ricetta perfetta',
    filters: 'Filtri',
    clearAll: 'Cancella Tutto',
    recentSearches: 'Ricerche Recenti',
    clear: 'Cancella',
    suggestedRecipes: 'Ricette Suggerite',
    resultsFound: 'risultati trovati',
    noRecipesFound: 'Nessuna ricetta trovata',
    tryAdjustingSearch: 'Prova ad aggiustare la ricerca o i filtri',

    // Filter Categories
    difficulty: 'Difficoltà',
    time: 'Tempo',
    category: 'Categoria',
    easy: 'Facile (1-2 ⭐)',
    medium: 'Medio (3 ⭐)',
    hard: 'Difficile (4-5 ⭐)',
    quick: 'Veloce (< 30min)',
    'medium-time': 'Medio (30-60min)',
    long: 'Lungo (> 60min)',
    main: 'Piatto Principale',
    snack: 'Spuntino',
    dessert: 'Dolce',
    drink: 'Bevanda',
    naruto: 'Naruto',
    onepiece: 'One Piece',
    demonslayer: 'Demon Slayer',
    ghibli: 'Studio Ghibli',
    pokemon: 'Pokémon',
    dragonball: 'Dragon Ball',

    // Recipe Detail
    recipeNotFound: 'Ricetta non trovata',
    ingredients: 'Ingredienti',
    instructions: 'Istruzioni',
    step: 'Passo',
    serve: 'porzioni',

    // Anime Screen
    animeCollection: 'Collezione Anime',
    browseRecipesByAnime: 'Sfoglia ricette per anime',
    searchAnime: 'Cerca anime...',
    recipes: 'ricette',
    recipe: 'ricetta',
    noRecipesAvailable: 'Nessuna ricetta disponibile per questo anime',
    noIngredientsAvailable: 'Nessun ingrediente disponibile',
    checkBackSoon: 'Torna presto per più contenuti',

    // Favorites Screen
    yourSavedRecipes: 'Le tue ricette salvate',
    searchYourFavorites: 'Cerca nei tuoi preferiti...',
    noFavoritesYet: 'Nessun preferito ancora!',
    discoverAmazingRecipes: 'Scopri ricette incredibili e salvale qui per un accesso rapido',
    exploreRecipes: 'Esplora Ricette',

    // Profile Screen
    animeChef: 'Chef Anime',
    preferences: 'Preferenze',
    theme: 'Tema',
    language: 'Lingua',
    notifications: 'Notifiche',
    enabled: 'Abilitato',
    toolsSupport: 'Strumenti e Supporto',
    shareApp: 'Condividi App',
    helpSupport: 'Aiuto e Supporto',
    privacyPolicy: 'Politica Privacy',
    dataManagement: 'Gestione Dati',
    clearAllData: 'Cancella Tutti i Dati',
    chooseLanguage: 'Scegli Lingua',
    selectLanguage: 'Seleziona Lingua',
    close: 'Chiudi',
    light: 'Chiaro',
    dark: 'Scuro',
    auto: 'Automatico',

    // Achievement Levels
    'master chef': 'Chef Maestro',
    'expert cook': 'Cuoco Esperto',
    'home cook': 'Cuoco Casalingo',
    apprentice: 'Apprendista',
    beginner: 'Principiante',

    // Share Messages
    shareMessage: 'Ho completato {count} ricette incredibili in Anime Recipes! 🍜✨',
    shareTitle: 'Anime Recipes - Cucina come negli anime!',
    shareRecipeMessage: 'Adoro {recipe} 😍 Vuoi provarla? Scarica l\'app: {link} 🍜',

    // Help & Privacy
    helpSupportTitle: 'Aiuto e Supporto',
    helpContent: 'Per aiuto, visita la nostra pagina di supporto o contattaci via email. Siamo qui per aiutarti con qualsiasi domanda sulle ricette.',
    gotIt: 'Capito',
    privacyPolicyTitle: 'Politica Privacy',
    privacyContent: 'Rispettiamo la tua privacy. Tutti i dati sono memorizzati localmente sul tuo dispositivo. Non condividiamo informazioni personali con terze parti.',
    understood: 'Compreso',
    clearDataTitle: 'Cancella Dati',
    clearDataMessage: 'Sei sicuro di voler eliminare tutti i tuoi dati? Questa azione non può essere annullata.',
    cancel: 'Annulla',
    clearData: 'Cancella Dati',
    success: 'Successo',
    allDataCleared: 'Tutti i dati sono stati cancellati',
    error: 'Errore',
    errorClearingData: 'Impossibile cancellare i dati. Riprova.',
    apply: 'Applica',
    selected: 'selezionato',

    // Recipe progress
    cookingProgress: 'Progresso di Cottura',
    reset: 'Ripristina',

    // Units
    measurementSystem: 'Sistema di Misura',
    metric: 'Metrico',
    imperial: 'Imperiale',
    steps: 'passaggi',

    // Diet types
    vegan: 'Vegano',
    omnivore: 'Onnivoro',
    dietPreference: 'Preferenza Dieta',

    // Timers
    manageTimers: 'Gestisci i tuoi timer da cucina',
    quickStartTimers: 'Timer Avvio Rapido',
    customTimer: 'Timer Personalizzato',
    createCustomTimer: 'Crea Timer Personalizzato',
    timerName: 'Nome timer',
    hours: 'Ore',
    minutes: 'Minuti',
    seconds: 'Secondi',
    create: 'Crea',
    activeTimers: 'Timer Attivi',
    noActiveTimers: 'Nessun timer attivo',
    createOneAbove: 'Creane uno sopra',
    completed: 'Completato',
    running: 'In corso',
    paused: 'In pausa',
    timerCompleted: 'Timer Completato!',
    timerReady: '{name} è pronto!',
    ok: 'OK',

    // Timer Presets
    boileggs: 'Bollire Uova',
    steamrice: 'Cuocere Riso',
    marinate: 'Marinare',
    restdough: 'Riposare Impasto',
    simmerbroth: 'Sobbollire Brodo',

    // Onboarding
    chefIntro: 'Gatto-rnata! Sono lo Chef Kai, cuoco aspirante. Sarò la tua guida in questo viaggio culinario. Prima di iniziare a tagliare e rosolare, devo conoscere un paio di dettagli per assicurarmi che la cucina sia perfetta per te.',
    measurementPreferenceTitle: 'Come preferisci che ti dia le misure degli ingredienti?',
    measurementOption1: 'Metrico (kg/g, L/ml)',
    measurementOption2: 'Imperiale (lb/oz, Gal/qt)',
    dietPreferenceTitle: 'Qual è il tuo stile alimentare principale?',
    dietOption1: 'Onnivoro',
    dietOption2: 'Vegano',
    continue: 'Continua',
    back: 'Indietro',
    start: 'Inizia',
  },
  de: {
    // Navigation
    home: 'Startseite',
    anime: 'Anime',
    favorites: 'Favoriten',
    profile: 'Profil',
    timers: 'Timer',

    // Welcome Screen
    welcome: 'Willkommen bei',
    animeRecipes: 'Anime Rezepte',
    discoverNewRecipes: 'Entdecke neue Rezepte inspiriert von deinen Lieblings-Anime',
    getStarted: 'Loslegen',

    // Home Screen
    continueWatching: 'Weiter Kochen',
    trends: 'Trends',
    allRecipes: 'Alle Rezepte',
    viewMore: 'Mehr anzeigen',
    browseAnime: 'Anime durchsuchen',
    searchRecipes: 'Rezepte suchen...',
    all: 'Alle',
    quickFilter: 'Schnell',
    easyFilter: 'Einfach',
    popular: 'Beliebt',

    // Search Screen
    findPerfectRecipe: 'Finde das perfekte Rezept',
    filters: 'Filter',
    clearAll: 'Alle löschen',
    recentSearches: 'Letzte Suchen',
    clear: 'Löschen',
    suggestedRecipes: 'Vorgeschlagene Rezepte',
    resultsFound: 'Ergebnisse gefunden',
    noRecipesFound: 'Keine Rezepte gefunden',
    tryAdjustingSearch: 'Versuche deine Suche oder Filter anzupassen',

    // Filter Categories
    difficulty: 'Schwierigkeit',
    time: 'Zeit',
    category: 'Kategorie',
    easy: 'Einfach (1-2 ⭐)',
    medium: 'Mittel (3 ⭐)',
    hard: 'Schwer (4-5 ⭐)',
    quick: 'Schnell (< 30min)',
    'medium-time': 'Mittel (30-60min)',
    long: 'Lang (> 60min)',
    main: 'Hauptgericht',
    snack: 'Snack',
    dessert: 'Dessert',
    drink: 'Getränk',
    naruto: 'Naruto',
    onepiece: 'One Piece',
    demonslayer: 'Demon Slayer',
    ghibli: 'Studio Ghibli',
    pokemon: 'Pokémon',
    dragonball: 'Dragon Ball',

    // Recipe Detail
    recipeNotFound: 'Rezept nicht gefunden',
    ingredients: 'Zutaten',
    instructions: 'Anweisungen',
    step: 'Schritt',
    serve: 'Portionen',

    // Anime Screen
    animeCollection: 'Anime Sammlung',
    browseRecipesByAnime: 'Rezepte nach Anime durchsuchen',
    searchAnime: 'Anime suchen...',
    recipes: 'Rezepte',
    recipe: 'Rezept',
    noRecipesAvailable: 'Keine Rezepte für diesen Anime verfügbar',
    noIngredientsAvailable: 'Keine Zutaten verfügbar',
    checkBackSoon: 'Schau bald wieder für mehr Inhalte vorbei',

    // Favorites Screen
    yourSavedRecipes: 'Deine gespeicherten Rezepte',
    searchYourFavorites: 'In deinen Favoriten suchen...',
    noFavoritesYet: 'Noch keine Favoriten!',
    discoverAmazingRecipes: 'Entdecke tolle Rezepte und speichere sie hier für schnellen Zugriff',
    exploreRecipes: 'Rezepte erkunden',

    // Profile Screen
    animeChef: 'Anime Koch',
    preferences: 'Einstellungen',
    theme: 'Design',
    language: 'Sprache',
    notifications: 'Benachrichtigungen',
    enabled: 'Aktiviert',
    toolsSupport: 'Tools & Support',
    shareApp: 'App teilen',
    helpSupport: 'Hilfe & Support',
    privacyPolicy: 'Datenschutz',
    dataManagement: 'Datenverwaltung',
    clearAllData: 'Alle Daten löschen',
    chooseLanguage: 'Sprache wählen',
    selectLanguage: 'Sprache auswählen',
    close: 'Schließen',
    light: 'Hell',
    dark: 'Dunkel',
    auto: 'Automatisch',

    // Achievement Levels
    'master chef': 'Meisterkoch',
    'expert cook': 'Experten Koch',
    'home cook': 'Hobbykoch',
    apprentice: 'Lehrling',
    beginner: 'Anfänger',

    // Share Messages
    shareMessage: 'Ich habe {count} tolle Rezepte in Anime Recipes abgeschlossen! 🍜✨',
    shareTitle: 'Anime Recipes - Koche wie im Anime!',
    shareRecipeMessage: 'Ich liebe {recipe} 😍 Lust es zu kochen? Hol dir die App: {link} 🍜',

    // Help & Privacy
    helpSupportTitle: 'Hilfe & Support',
    helpContent: 'Für Hilfe besuche unsere Support-Seite oder kontaktiere uns per E-Mail. Wir helfen gerne bei Fragen zu Rezepten.',
    gotIt: 'Verstanden',
    privacyPolicyTitle: 'Datenschutz',
    privacyContent: 'Wir respektieren deine Privatsphäre. Alle Daten werden lokal auf deinem Gerät gespeichert. Wir teilen keine persönlichen Informationen mit Dritten.',
    understood: 'Verstanden',
    clearDataTitle: 'Daten löschen',
    clearDataMessage: 'Bist du sicher, dass du alle deine Daten löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.',
    cancel: 'Abbrechen',
    clearData: 'Daten löschen',
    success: 'Erfolg',
    allDataCleared: 'Alle Daten wurden gelöscht',
    error: 'Fehler',
    errorClearingData: 'Daten konnten nicht gelöscht werden. Bitte versuche es erneut.',
    apply: 'Anwenden',
    selected: 'ausgewählt',

    // Recipe progress
    cookingProgress: 'Kochfortschritt',
    reset: 'Zurücksetzen',

    // Units
    measurementSystem: 'Maßsystem',
    metric: 'Metrisch',
    imperial: 'Imperial',
    steps: 'Schritte',

    // Diet types
    vegan: 'Vegan',
    omnivore: 'Allesfresser',
    dietPreference: 'Diätpräferenz',

    // Timers
    manageTimers: 'Verwalte deine Koch-Timer',
    quickStartTimers: 'Schnellstart Timer',
    customTimer: 'Benutzerdefinierter Timer',
    createCustomTimer: 'Benutzerdefinierten Timer erstellen',
    timerName: 'Timer Name',
    hours: 'Stunden',
    minutes: 'Minuten',
    seconds: 'Sekunden',
    create: 'Erstellen',
    activeTimers: 'Aktive Timer',
    noActiveTimers: 'Keine aktiven Timer',
    createOneAbove: 'Erstelle einen oben',
    completed: 'Abgeschlossen',
    running: 'Läuft',
    paused: 'Pausiert',
    timerCompleted: 'Timer Abgeschlossen!',
    timerReady: '{name} ist fertig!',
    ok: 'OK',

    // Timer Presets
    boileggs: 'Eier kochen',
    steamrice: 'Reis dämpfen',
    marinate: 'Marinieren',
    restdough: 'Teig ruhen',
    simmerbroth: 'Brühe köcheln',

    // Onboarding
    chefIntro: 'Katzen-Tag! Ich bin Chef Kai, angehender Koch. Ich werde dein Führer auf dieser kulinarischen Reise sein. Bevor wir mit dem Schneiden und Anbraten beginnen, muss ich ein paar Details wissen, um sicherzustellen, dass die Küche perfekt für dich ist.',
    measurementPreferenceTitle: 'Wie möchtest du die Zutatenmengen erhalten?',
    measurementOption1: 'Metrisch (kg/g, L/ml)',
    measurementOption2: 'Imperial (lb/oz, Gal/qt)',
    dietPreferenceTitle: 'Was ist dein hauptsächlicher Ernährungsstil?',
    dietOption1: 'Allesesser',
    dietOption2: 'Vegan',
    continue: 'Weiter',
    back: 'Zurück',
    start: 'Start',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    anime: 'Anime',
    favorites: 'Favoris',
    profile: 'Profil',
    timers: 'Minuteurs',

    // Welcome Screen
    welcome: 'Bienvenue dans',
    animeRecipes: 'Recettes Anime',
    discoverNewRecipes: 'Découvrez de nouvelles recettes inspirées de vos anime préférés',
    getStarted: 'Commencer',

    // Home Screen
    continueWatching: 'Continuer à Cuisiner',
    trends: 'Tendances',
    allRecipes: 'Toutes les Recettes',
    viewMore: 'Voir plus',
    browseAnime: 'Parcourir Anime',
    searchRecipes: 'Rechercher recettes...',
    all: 'Tout',
    quickFilter: 'Rapide',
    easyFilter: 'Facile',
    popular: 'Populaire',

    // Search Screen
    findPerfectRecipe: 'Trouvez la recette parfaite',
    filters: 'Filtres',
    clearAll: 'Tout effacer',
    recentSearches: 'Recherches Récentes',
    clear: 'Effacer',
    suggestedRecipes: 'Recettes Suggérées',
    resultsFound: 'résultats trouvés',
    noRecipesFound: 'Aucune recette trouvée',
    tryAdjustingSearch: 'Essayez d\'ajuster votre recherche ou filtres',

    // Filter Categories
    difficulty: 'Difficulté',
    time: 'Temps',
    category: 'Catégorie',
    easy: 'Facile (1-2 ⭐)',
    medium: 'Moyen (3 ⭐)',
    hard: 'Difficile (4-5 ⭐)',
    quick: 'Rapide (< 30min)',
    'medium-time': 'Moyen (30-60min)',
    long: 'Long (> 60min)',
    main: 'Plat Principal',
    snack: 'Collation',
    dessert: 'Dessert',
    drink: 'Boisson',
    naruto: 'Naruto',
    onepiece: 'One Piece',
    demonslayer: 'Demon Slayer',
    ghibli: 'Studio Ghibli',
    pokemon: 'Pokémon',
    dragonball: 'Dragon Ball',

    // Recipe Detail
    recipeNotFound: 'Recette non trouvée',
    ingredients: 'Ingrédients',
    instructions: 'Instructions',
    step: 'Étape',
    serve: 'portions',

    // Anime Screen
    animeCollection: 'Collection Anime',
    browseRecipesByAnime: 'Parcourir recettes par anime',
    searchAnime: 'Rechercher anime...',
    recipes: 'recettes',
    recipe: 'recette',
    noRecipesAvailable: 'Aucune recette disponible pour cet anime',
    noIngredientsAvailable: 'Aucun ingrédient disponible',
    checkBackSoon: 'Revenez bientôt pour plus de contenu',

    // Favorites Screen
    yourSavedRecipes: 'Vos recettes sauvegardées',
    searchYourFavorites: 'Rechercher dans vos favoris...',
    noFavoritesYet: 'Pas encore de favoris!',
    discoverAmazingRecipes: 'Découvrez des recettes incroyables et sauvegardez-les ici pour un accès rapide',
    exploreRecipes: 'Explorer Recettes',

    // Profile Screen
    animeChef: 'Chef Anime',
    preferences: 'Préférences',
    theme: 'Thème',
    language: 'Langue',
    notifications: 'Notifications',
    enabled: 'Activé',
    toolsSupport: 'Outils et Support',
    shareApp: 'Partager App',
    helpSupport: 'Aide et Support',
    privacyPolicy: 'Politique de Confidentialité',
    dataManagement: 'Gestion des Données',
    clearAllData: 'Effacer Toutes les Données',
    chooseLanguage: 'Choisir Langue',
    selectLanguage: 'Sélectionner la Langue',
    close: 'Fermer',
    light: 'Clair',
    dark: 'Sombre',
    auto: 'Automatique',

    // Achievement Levels
    'master chef': 'Chef Maître',
    'expert cook': 'Cuisinier Expert',
    'home cook': 'Cuisinier Maison',
    apprentice: 'Apprenti',
    beginner: 'Débutant',

    // Share Messages
    shareMessage: 'J\'ai terminé {count} recettes incroyables dans Anime Recipes! 🍜✨',
    shareTitle: 'Anime Recipes - Cuisinez comme dans les anime!',
    shareRecipeMessage: 'J\'adore {recipe} 😍 Envie d\'essayer ? Télécharge l\'appli : {link} 🍜',

    // Help & Privacy
    helpSupportTitle: 'Aide et Support',
    helpContent: 'Pour de l\'aide, visitez notre page de support ou contactez-nous par email. Nous sommes là pour vous aider avec toute question sur les recettes.',
    gotIt: 'Compris',
    privacyPolicyTitle: 'Politique de Confidentialité',
    privacyContent: 'Nous respectons votre vie privée. Toutes les données sont stockées localement sur votre appareil. Nous ne partageons pas d\'informations personnelles avec des tiers.',
    understood: 'Compris',
    clearDataTitle: 'Effacer Données',
    clearDataMessage: 'Êtes-vous sûr de vouloir supprimer toutes vos données? Cette action ne peut pas être annulée.',
    cancel: 'Annuler',
    clearData: 'Effacer Données',
    success: 'Succès',
    allDataCleared: 'Toutes les données ont été effacées',
    error: 'Erreur',
    errorClearingData: 'Impossible d\'effacer les données. Veuillez réessayer.',
    apply: 'Appliquer',
    selected: 'sélectionné',

    // Recipe progress
    cookingProgress: 'Progrès de Cuisson',
    reset: 'Réinitialiser',

    // Units
    measurementSystem: 'Système de Mesure',
    metric: 'Métrique',
    imperial: 'Impérial',
    steps: 'étapes',

    // Diet types
    vegan: 'Végétalien',
    omnivore: 'Omnivore',
    dietPreference: 'Préférence Alimentaire',

    // Timers
    manageTimers: 'Gérez vos minuteurs de cuisine',
    quickStartTimers: 'Minuteurs Démarrage Rapide',
    customTimer: 'Minuteur Personnalisé',
    createCustomTimer: 'Créer Minuteur Personnalisé',
    timerName: 'Nom du minuteur',
    hours: 'Heures',
    minutes: 'Minutes',
    seconds: 'Secondes',
    create: 'Créer',
    activeTimers: 'Minuteurs Actifs',
    noActiveTimers: 'Aucun minuteur actif',
    createOneAbove: 'Créez-en un ci-dessus',
    completed: 'Terminé',
    running: 'En cours',
    paused: 'En pause',
    timerCompleted: 'Minuteur Terminé!',
    timerReady: '{name} est prêt!',
    ok: 'OK',

    // Timer Presets
    boileggs: 'Bouillir Œufs',
    steamrice: 'Cuire Riz',
    marinate: 'Mariner',
    restdough: 'Reposer Pâte',
    simmerbroth: 'Mijoter Bouillon',

    // Onboarding
    chefIntro: 'Miaou-gnifique journée! Je suis le Chef Kai, cuisinier aspirant. Je serai votre guide dans ce voyage culinaire. Avant de commencer à hacher et à faire sauter, j\'ai besoin de connaître quelques détails pour m\'assurer que la cuisine est parfaite pour vous.',
    measurementPreferenceTitle: 'Comment préférez-vous que je vous donne les mesures des ingrédients?',
    measurementOption1: 'Métrique (kg/g, L/ml)',
    measurementOption2: 'Impérial (lb/oz, Gal/qt)',
    dietPreferenceTitle: 'Quel est votre style alimentaire principal?',
    dietOption1: 'Omnivore',
    dietOption2: 'Végétalien',
    continue: 'Continuer',
    back: 'Retour',
    start: 'Commencer',
  },
  pt: {
    // Navigation
    home: 'Início',
    anime: 'Anime',
    favorites: 'Favoritos',
    profile: 'Perfil',
    timers: 'Temporizadores',

    // Welcome Screen
    welcome: 'Bem-vindo ao',
    animeRecipes: 'Receitas Anime',
    discoverNewRecipes: 'Descubra novas receitas inspiradas nos seus anime favoritos',
    getStarted: 'Começar',

    // Home Screen
    continueWatching: 'Continuar Cozinhando',
    trends: 'Tendências',
    allRecipes: 'Todas as Receitas',
    viewMore: 'Ver mais',
    browseAnime: 'Explorar Anime',
    searchRecipes: 'Buscar receitas...',
    all: 'Tudo',
    quickFilter: 'Rápido',
    easyFilter: 'Fácil',
    popular: 'Popular',

    // Search Screen
    findPerfectRecipe: 'Encontre a receita perfeita',
    filters: 'Filtros',
    clearAll: 'Limpar Tudo',
    recentSearches: 'Buscas Recentes',
    clear: 'Limpar',
    suggestedRecipes: 'Receitas Sugeridas',
    resultsFound: 'resultados encontrados',
    noRecipesFound: 'Nenhuma receita encontrada',
    tryAdjustingSearch: 'Tente ajustar sua busca ou filtros',

    // Filter Categories
    difficulty: 'Dificuldade',
    time: 'Tempo',
    category: 'Categoria',
    easy: 'Fácil (1-2 ⭐)',
    medium: 'Médio (3 ⭐)',
    hard: 'Difícil (4-5 ⭐)',
    quick: 'Rápido (< 30min)',
    'medium-time': 'Médio (30-60min)',
    long: 'Longo (> 60min)',
    main: 'Prato Principal',
    snack: 'Lanche',
    dessert: 'Sobremesa',
    drink: 'Bebida',
    naruto: 'Naruto',
    onepiece: 'One Piece',
    demonslayer: 'Demon Slayer',
    ghibli: 'Studio Ghibli',
    pokemon: 'Pokémon',
    dragonball: 'Dragon Ball',

    // Recipe Detail
    recipeNotFound: 'Receita não encontrada',
    ingredients: 'Ingredientes',
    instructions: 'Instruções',
    step: 'Passo',
    serve: 'porções',

    // Anime Screen
    animeCollection: 'Coleção Anime',
    browseRecipesByAnime: 'Explorar receitas por anime',
    searchAnime: 'Buscar anime...',
    recipes: 'receitas',
    recipe: 'receita',
    noRecipesAvailable: 'Nenhuma receita disponível para este anime',
    noIngredientsAvailable: 'Nenhum ingrediente disponível',
    checkBackSoon: 'Volte em breve para mais conteúdo',

    // Favorites Screen
    yourSavedRecipes: 'Suas receitas salvas',
    searchYourFavorites: 'Buscar nos seus favoritos...',
    noFavoritesYet: 'Nenhum favorito ainda!',
    discoverAmazingRecipes: 'Descubra receitas incríveis e salve-as aqui para acesso rápido',
    exploreRecipes: 'Explorar Receitas',

    // Profile Screen
    animeChef: 'Chef Anime',
    preferences: 'Preferências',
    theme: 'Tema',
    language: 'Idioma',
    notifications: 'Notificações',
    enabled: 'Habilitado',
    toolsSupport: 'Ferramentas e Suporte',
    shareApp: 'Compartilhar App',
    helpSupport: 'Ajuda e Suporte',
    privacyPolicy: 'Política de Privacidade',
    dataManagement: 'Gerenciamento de Dados',
    clearAllData: 'Limpar Todos os Dados',
    chooseLanguage: 'Escolher Idioma',
    selectLanguage: 'Selecionar Idioma',
    close: 'Fechar',
    light: 'Claro',
    dark: 'Escuro',
    auto: 'Automático',

    // Achievement Levels
    'master chef': 'Chef Mestre',
    'expert cook': 'Cozinheiro Especialista',
    'home cook': 'Cozinheiro Caseiro',
    apprentice: 'Aprendiz',
    beginner: 'Iniciante',

    // Share Messages
    shareMessage: 'Completei {count} receitas incríveis no Anime Recipes! 🍜✨',
    shareTitle: 'Anime Recipes - Cozinhe como no anime!',
    shareRecipeMessage: 'Tô amando {recipe} 😍 Quer provar? Baixe o app: {link} 🍜',

    // Help & Privacy
    helpSupportTitle: 'Ajuda e Suporte',
    helpContent: 'Para ajuda, visite nossa página de suporte ou entre em contato por email. Estamos aqui para ajudar com qualquer dúvida sobre receitas.',
    gotIt: 'Entendi',
    privacyPolicyTitle: 'Política de Privacidade',
    privacyContent: 'Respeitamos sua privacidade. Todos os dados são armazenados localmente no seu dispositivo. Não compartilhamos informações pessoais com terceiros.',
    understood: 'Compreendido',
    clearDataTitle: 'Limpar Dados',
    clearDataMessage: 'Tem certeza de que deseja excluir todos os seus dados? Esta ação não pode ser desfeita.',
    cancel: 'Cancelar',
    clearData: 'Limpar Dados',
    success: 'Sucesso',
    allDataCleared: 'Todos os dados foram limpos',
    error: 'Erro',
    errorClearingData: 'Não foi possível limpar os dados. Por favor, tente novamente.',
    apply: 'Aplicar',
    selected: 'selecionado',

    // Recipe progress
    cookingProgress: 'Progresso de Cozimento',
    reset: 'Redefinir',

    // Units
    measurementSystem: 'Sistema de Medição',
    metric: 'Métrico',
    imperial: 'Imperial',
    steps: 'passos',

    // Diet types
    vegan: 'Vegano',
    omnivore: 'Onívoro',
    dietPreference: 'Preferência de Dieta',

    // Timers
    manageTimers: 'Gerencie seus temporizadores de cozinha',
    quickStartTimers: 'Temporizadores Início Rápido',
    customTimer: 'Temporizador Personalizado',
    createCustomTimer: 'Criar Temporizador Personalizado',
    timerName: 'Nome do temporizador',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    create: 'Criar',
    activeTimers: 'Temporizadores Ativos',
    noActiveTimers: 'Nenhum temporizador ativo',
    createOneAbove: 'Crie um acima',
    completed: 'Concluído',
    running: 'Executando',
    paused: 'Pausado',
    timerCompleted: 'Temporizador Concluído!',
    timerReady: '{name} está pronto!',
    ok: 'OK',

    // Timer Presets
    boileggs: 'Ferver Ovos',
    steamrice: 'Cozinhar Arroz',
    marinate: 'Marinar',
    restdough: 'Descansar Massa',
    simmerbroth: 'Ferver Caldo',

    // Onboarding
    chefIntro: 'Miau-níficos dias! Sou o Chef Kai, cozinheiro aspirante. Serei seu guia nesta jornada culinária. Antes de começarmos a picar e refogar, preciso conhecer alguns detalhes para garantir que a cozinha seja perfeita para você.',
    measurementPreferenceTitle: 'Como você prefere que eu dê as medidas dos ingredientes?',
    measurementOption1: 'Métrico (kg/g, L/ml)',
    measurementOption2: 'Imperial (lb/oz, Gal/qt)',
    dietPreferenceTitle: 'Qual é o seu estilo de dieta principal?',
    dietOption1: 'Onívoro',
    dietOption2: 'Vegano',
    continue: 'Continuar',
    back: 'Voltar',
    start: 'Começar',
  },
  ja: {
    // Navigation
    home: 'ホーム',
    anime: 'アニメ',
    favorites: 'お気に入り',
    profile: 'プロフィール',
    timers: 'タイマー',

    // Welcome Screen
    welcome: 'ようこそ',
    animeRecipes: 'アニメレシピ',
    discoverNewRecipes: 'お気に入りのアニメからインスピレーションを得た新しいレシピを発見しよう',
    getStarted: '始める',

    // Home Screen
    continueWatching: '料理を続ける',
    trends: 'トレンド',
    allRecipes: 'すべてのレシピ',
    viewMore: 'もっと見る',
    browseAnime: 'アニメを見る',
    searchRecipes: 'レシピを検索...',
    all: 'すべて',
    quickFilter: '早い',
    easyFilter: '簡単',
    popular: '人気',

    // Search Screen
    findPerfectRecipe: '完璧なレシピを見つけよう',
    filters: 'フィルター',
    clearAll: 'すべてクリア',
    recentSearches: '最近の検索',
    clear: 'クリア',
    suggestedRecipes: 'おすすめレシピ',
    resultsFound: '件の結果が見つかりました',
    noRecipesFound: 'レシピが見つかりません',
    tryAdjustingSearch: '検索やフィルターを調整してみてください',

    // Filter Categories
    difficulty: '難易度',
    time: '時間',
    category: 'カテゴリー',
    easy: '簡単 (1-2 ⭐)',
    medium: '普通 (3 ⭐)',
    hard: '難しい (4-5 ⭐)',
    quick: '早い (< 30分)',
    'medium-time': '普通 (30-60分)',
    long: '長い (> 60分)',
    main: 'メイン料理',
    snack: 'スナック',
    dessert: 'デザート',
    drink: '飲み物',
    naruto: 'ナルト',
    onepiece: 'ワンピース',
    demonslayer: '鬼滅の刃',
    ghibli: 'スタジオジブリ',
    pokemon: 'ポケモン',
    dragonball: 'ドラゴンボール',

    // Recipe Detail
    recipeNotFound: 'レシピが見つかりません',
    ingredients: '材料',
    instructions: '作り方',
    step: 'ステップ',
    serve: '人分',

    // Anime Screen
    animeCollection: 'アニメコレクション',
    browseRecipesByAnime: 'アニメ別レシピを見る',
    searchAnime: 'アニメを検索...',
    recipes: 'レシピ',
    recipe: 'レシピ',
    noRecipesAvailable: 'このアニメのレシピはありません',
    noIngredientsAvailable: '材料がありません',
    checkBackSoon: 'もっとコンテンツをお楽しみに',

    // Favorites Screen
    yourSavedRecipes: '保存したレシピ',
    searchYourFavorites: 'お気に入りを検索...',
    noFavoritesYet: 'まだお気に入りがありません！',
    discoverAmazingRecipes: '素晴らしいレシピを発見して、ここに保存して素早くアクセスしよう',
    exploreRecipes: 'レシピを探す',

    // Profile Screen
    animeChef: 'アニメシェフ',
    preferences: '設定',
    theme: 'テーマ',
    language: '言語',
    notifications: '通知',
    enabled: '有効',
    toolsSupport: 'ツールとサポート',
    shareApp: 'アプリを共有',
    helpSupport: 'ヘルプとサポート',
    privacyPolicy: 'プライバシーポリシー',
    dataManagement: 'データ管理',
    clearAllData: 'すべてのデータを削除',
    chooseLanguage: '言語を選択',
    selectLanguage: '言語を選択',
    close: '閉じる',
    light: 'ライト',
    dark: 'ダーク',
    auto: '自動',

    // Achievement Levels
    'master chef': 'マスターシェフ',
    'expert cook': 'エキスパートクック',
    'home cook': 'ホームクック',
    apprentice: '見習い',
    beginner: '初心者',

    // Share Messages
    shareMessage: 'アニメレシピで{count}個の素晴らしいレシピを完成させました！🍜✨',
    shareTitle: 'アニメレシピ - アニメのように料理しよう！',
    shareRecipeMessage: '{recipe}が大好き😍 作ってみたい？アプリをダウンロード：{link} 🍜',

    // Help & Privacy
    helpSupportTitle: 'ヘルプとサポート',
    helpContent: 'ヘルプについては、サポートページをご覧いただくか、メールでお問い合わせください。レシピに関するご質問にお答えします。',
    gotIt: '分かりました',
    privacyPolicyTitle: 'プライバシーポリシー',
    privacyContent: 'プライバシーを尊重します。すべてのデータはお使いのデバイスにローカルに保存されます。個人情報を第三者と共有することはありません。',
    understood: '理解しました',
    clearDataTitle: 'データを削除',
    clearDataMessage: 'すべてのデータを削除してもよろしいですか？この操作は元に戻せません。',
    cancel: 'キャンセル',
    clearData: 'データを削除',
    success: '成功',
    allDataCleared: 'すべてのデータが削除されました',
    error: 'エラー',
    errorClearingData: 'データを削除できませんでした。もう一度お試しください。',
    apply: '適用',
    selected: '選択済み',

    // Recipe progress
    cookingProgress: '料理の進捗',
    reset: 'リセット',

    // Units
    measurementSystem: '測定システム',
    metric: 'メートル法',
    imperial: 'ヤード・ポンド法',
    steps: 'ステップ',

    // Diet types
    vegan: 'ビーガン',
    omnivore: '雑食',
    dietPreference: '食事の好み',

    // Timers
    manageTimers: '料理タイマーを管理',
    quickStartTimers: 'クイックスタートタイマー',
    customTimer: 'カスタムタイマー',
    createCustomTimer: 'カスタムタイマーを作成',
    timerName: 'タイマー名',
    hours: '時間',
    minutes: '分',
    seconds: '秒',
    create: '作成',
    activeTimers: 'アクティブタイマー',
    noActiveTimers: 'アクティブなタイマーがありません',
    createOneAbove: '上で作成してください',
    completed: '完了',
    running: '実行中',
    paused: '一時停止',
    timerCompleted: 'タイマー完了！',
    timerReady: '{name}の準備ができました！',
    ok: 'OK',

    // Timer Presets
    boileggs: '卵を茹でる',
    steamrice: 'ご飯を炊く',
    marinate: 'マリネ',
    restdough: '生地を休ませる',
    simmerbroth: 'だしを煮る',

    // Onboarding
    chefIntro: 'にゃんこの日！シェフ・カイです、見習いコックです。この料理の旅のガイドになります。刻んだり炒めたりする前に、あなたにぴったりのキッチンにするために、いくつか詳細を知る必要があります。',
    measurementPreferenceTitle: '材料の測定をどのように提供しますか？',
    measurementOption1: 'メートル法 (kg/g, L/ml)',
    measurementOption2: 'ヤード・ポンド法 (lb/oz, Gal/qt)',
    dietPreferenceTitle: 'あなたの主な食事スタイルは何ですか？',
    dietOption1: '雑食',
    dietOption2: 'ビーガン',
    continue: '続ける',
    back: '戻る',
    start: '始める',
  },
  hi: {
    // Navigation
    home: 'होम',
    anime: 'एनीमे',
    favorites: 'पसंदीदा',
    profile: 'प्रोफाइल',
    timers: 'टाइमर',

    // Welcome Screen
    welcome: 'स्वागत है',
    animeRecipes: 'एनीमे रेसिपी',
    discoverNewRecipes: 'अपने पसंदीदा एनीमे से प्रेरित नई रेसिपी खोजें',
    getStarted: 'शुरू करें',

    // Home Screen
    continueWatching: 'खाना बनाना जारी रखें',
    trends: 'ट्रेंडिंग',
    allRecipes: 'सभी रेसिपी',
    viewMore: 'और देखें',
    browseAnime: 'एनीमे ब्राउज़ करें',
    searchRecipes: 'रेसिपी खोजें...',
    all: 'सभी',
    quickFilter: 'तेज़',
    easyFilter: 'आसान',
    popular: 'लोकप्रिय',

    // Search Screen
    findPerfectRecipe: 'परफेक्ट रेसिपी खोजें',
    filters: 'फिल्टर',
    clearAll: 'सभी साफ़ करें',
    recentSearches: 'हाल की खोजें',
    clear: 'साफ़ करें',
    suggestedRecipes: 'सुझाई गई रेसिपी',
    resultsFound: 'परिणाम मिले',
    noRecipesFound: 'कोई रेसिपी नहीं मिली',
    tryAdjustingSearch: 'अपनी खोज या फिल्टर को समायोजित करने का प्रयास करें',

    // Filter Categories
    difficulty: 'कठिनाई',
    time: 'समय',
    category: 'श्रेणी',
    easy: 'आसान (1-2 ⭐)',
    medium: 'मध्यम (3 ⭐)',
    hard: 'कठिन (4-5 ⭐)',
    quick: 'तेज़ (< 30मिनट)',
    'medium-time': 'मध्यम (30-60मिनट)',
    long: 'लंबा (> 60मिनट)',
    main: 'मुख्य व्यंजन',
    snack: 'स्नैक',
    dessert: 'मिठाई',
    drink: 'पेय',
    naruto: 'नारुतो',
    onepiece: 'वन पीस',
    demonslayer: 'डेमन स्लेयर',
    ghibli: 'स्टूडियो घिब्ली',
    pokemon: 'पोकेमॉन',
    dragonball: 'ड्रैगन बॉल',

    // Recipe Detail
    recipeNotFound: 'रेसिपी नहीं मिली',
    ingredients: 'सामग्री',
    instructions: 'निर्देश',
    step: 'चरण',
    serve: 'सर्विंग',

    // Anime Screen
    animeCollection: 'एनीमे संग्रह',
    browseRecipesByAnime: 'एनीमे के अनुसार रेसिपी ब्राउज़ करें',
    searchAnime: 'एनीमे खोजें...',
    recipes: 'रेसिपी',
    recipe: 'रेसिपी',
    noRecipesAvailable: 'इस एनीमे के लिए कोई रेसिपी उपलब्ध नहीं',
    noIngredientsAvailable: 'कोई सामग्री उपलब्ध नहीं',
    checkBackSoon: 'अधिक सामग्री के लिए जल्द ही वापस आएं',

    // Favorites Screen
    yourSavedRecipes: 'आपकी सहेजी गई रेसिपी',
    searchYourFavorites: 'अपने पसंदीदा में खोजें...',
    noFavoritesYet: 'अभी तक कोई पसंदीदा नहीं!',
    discoverAmazingRecipes: 'अद्भुत रेसिपी खोजें और त्वरित पहुंच के लिए उन्हें यहां सहेजें',
    exploreRecipes: 'रेसिपी एक्सप्लोर करें',

    // Profile Screen
    animeChef: 'एनीमे शेफ',
    preferences: 'प्राथमिकताएं',
    theme: 'थीम',
    language: 'भाषा',
    notifications: 'सूचनाएं',
    enabled: 'सक्षम',
    toolsSupport: 'टूल्स और सपोर्ट',
    shareApp: 'ऐप शेयर करें',
    helpSupport: 'सहायता और सपोर्ट',
    privacyPolicy: 'गोपनीयता नीति',
    dataManagement: 'डेटा प्रबंधन',
    clearAllData: 'सभी डेटा साफ़ करें',
    chooseLanguage: 'भाषा चुनें',
    selectLanguage: 'भाषा चुनें',
    close: 'बंद करें',
    light: 'हल्का',
    dark: 'गहरा',
    auto: 'ऑटो',

    // Achievement Levels
    'master chef': 'मास्टर शेफ',
    'expert cook': 'एक्सपर्ट कुक',
    'home cook': 'होम कुक',
    apprentice: 'शिक्षु',
    beginner: 'शुरुआती',

    // Share Messages
    shareMessage: 'मैंने एनीमे रेसिपी में {count} अद्भुत रेसिपी पूरी की हैं! 🍜✨',
    shareTitle: 'एनीमे रेसिपी - एनीमे की तरह खाना बनाएं!',
    shareRecipeMessage: 'मुझे {recipe} बहुत पसंद है 😍 आज़माना चाहोगे? ऐप डाउनलोड करो: {link} 🍜',

    // Help & Privacy
    helpSupportTitle: 'सहायता और सपोर्ट',
    helpContent: 'सहायता के लिए, हमारे सपोर्ट पेज पर जाएं या ईमेल के माध्यम से संपर्क करें। हम रेसिपी के बारे में किसी भी प्रश्न में आपकी सहायता के लिए यहां हैं।',
    gotIt: 'समझ गया',
    privacyPolicyTitle: 'गोपनीयता नीति',
    privacyContent: 'हम आपकी गोपनीयता का सम्मान करते हैं। सभी डेटा आपके डिवाइस पर स्थानीय रूप से संग्रहीत है। हम तीसरे पक्ष के साथ व्यक्तिगत जानकारी साझा नहीं करते।',
    understood: 'समझ गया',
    clearDataTitle: 'डेटा साफ़ करें',
    clearDataMessage: 'क्या आप वाकई अपना सारा डेटा हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
    cancel: 'रद्द करें',
    clearData: 'डेटा साफ़ करें',
    success: 'सफलता',
    allDataCleared: 'सभी डेटा साफ़ कर दिया गया है',
    error: 'त्रुटि',
    errorClearingData: 'डेटा साफ़ नहीं किया जा सका। कृपया पुनः प्रयास करें।',
    apply: 'लागू करें',
    selected: 'चयनित',

    // Recipe progress
    cookingProgress: 'खाना पकाने की प्रगति',
    reset: 'रीसेट करें',

    // Units
    measurementSystem: 'माप प्रणाली',
    metric: 'मीट्रिक',
    imperial: 'इंपीरियल',
    steps: 'चरण',

    // Diet types
    vegan: 'शाकाहारी',
    omnivore: 'सर्वाहारी',
    dietPreference: 'आहार वरीयता',

    // Timers
    manageTimers: 'अपने खाना पकाने के टाइमर प्रबंधित करें',
    quickStartTimers: 'क्विक स्टार्ट टाइमर',
    customTimer: 'कस्टम टाइमर',
    createCustomTimer: 'कस्टम टाइमर बनाएं',
    timerName: 'टाइमर का नाम',
    hours: 'घंटे',
    minutes: 'मिनट',
    seconds: 'सेकंड',
    create: 'बनाएं',
    activeTimers: 'सक्रिय टाइमर',
    noActiveTimers: 'कोई सक्रिय टाइमर नहीं',
    createOneAbove: 'ऊपर एक बनाएं',
    completed: 'पूर्ण',
    running: 'चल रहा',
    paused: 'रोका गया',
    timerCompleted: 'टाइमर पूर्ण!',
    timerReady: '{name} तैयार है!',
    ok: 'ठीक है',

    // Timer Presets
    boileggs: 'अंडे उबालें',
    steamrice: 'चावल पकाएं',
    marinate: 'मैरिनेट',
    restdough: 'आटा आराम',
    simmerbroth: 'शोरबा उबालें',

    // Onboarding
    chefIntro: 'म्याऊ-शुभ दिन! मैं शेफ काई हूं, इच्छुक रसोइया। मैं इस पाक यात्रा में आपका मार्गदर्शक बनूंगा। काटने और भूनने से पहले, मुझे कुछ विवरण जानने की जरूरत है ताकि यह सुनिश्चित हो सके कि रसोई आपके लिए एकदम सही है।',
    measurementPreferenceTitle: 'आप सामग्री के माप कैसे पसंद करेंगे?',
    measurementOption1: 'मीट्रिक (kg/g, L/ml)',
    measurementOption2: 'इंपीरियल (lb/oz, Gal/qt)',
    dietPreferenceTitle: 'आपकी मुख्य आहार शैली क्या है?',
    dietOption1: 'सर्वाहारी',
    dietOption2: 'शाकाहारी',
    continue: 'जारी रखें',
    back: 'पीछे',
    start: 'शुरू करें',
  },
  zh: {
    // Navigation
    home: '首页',
    anime: '动漫',
    favorites: '收藏',
    profile: '个人资料',
    timers: '计时器',

    // Welcome Screen
    welcome: '欢迎来到',
    animeRecipes: '动漫食谱',
    discoverNewRecipes: '发现受您最喜爱动漫启发的新食谱',
    getStarted: '开始',

    // Home Screen
    continueWatching: '继续烹饪',
    trends: '热门',
    allRecipes: '所有食谱',
    viewMore: '查看更多',
    browseAnime: '浏览动漫',
    searchRecipes: '搜索食谱...',
    all: '全部',
    quickFilter: '快速',
    easyFilter: '简单',
    popular: '热门',

    // Search Screen
    findPerfectRecipe: '找到完美的食谱',
    filters: '筛选',
    clearAll: '清除全部',
    recentSearches: '最近搜索',
    clear: '清除',
    suggestedRecipes: '推荐食谱',
    resultsFound: '找到结果',
    noRecipesFound: '未找到食谱',
    tryAdjustingSearch: '尝试调整您的搜索或筛选条件',

    // Filter Categories
    difficulty: '难度',
    time: '时间',
    category: '类别',
    easy: '简单 (1-2 ⭐)',
    medium: '中等 (3 ⭐)',
    hard: '困难 (4-5 ⭐)',
    quick: '快速 (< 30分钟)',
    'medium-time': '中等 (30-60分钟)',
    long: '较长 (> 60分钟)',
    main: '主菜',
    snack: '小食',
    dessert: '甜点',
    drink: '饮品',
    naruto: '火影忍者',
    onepiece: '海贼王',
    demonslayer: '鬼灭之刃',
    ghibli: '吉卜力工作室',
    pokemon: '宝可梦',
    dragonball: '龙珠',

    // Recipe Detail
    recipeNotFound: '未找到食谱',
    ingredients: '食材',
    instructions: '制作步骤',
    step: '步骤',
    serve: '人份',

    // Anime Screen
    animeCollection: '动漫收藏',
    browseRecipesByAnime: '按动漫浏览食谱',
    searchAnime: '搜索动漫...',
    recipes: '食谱',
    recipe: '食谱',
    noRecipesAvailable: '此动漫暂无可用食谱',
    noIngredientsAvailable: '无可用食材',
    checkBackSoon: '请稍后查看更多内容',

    // Favorites Screen
    yourSavedRecipes: '您保存的食谱',
    searchYourFavorites: '在收藏中搜索...',
    noFavoritesYet: '还没有收藏！',
    discoverAmazingRecipes: '发现精彩食谱并保存在这里以便快速访问',
    exploreRecipes: '探索食谱',

    // Profile Screen
    animeChef: '动漫厨师',
    preferences: '偏好设置',
    theme: '主题',
    language: '语言',
    notifications: '通知',
    enabled: '已启用',
    toolsSupport: '工具和支持',
    shareApp: '分享应用',
    helpSupport: '帮助和支持',
    privacyPolicy: '隐私政策',
    dataManagement: '数据管理',
    clearAllData: '清除所有数据',
    chooseLanguage: '选择语言',
    selectLanguage: '选择语言',
    close: '关闭',
    light: '浅色',
    dark: '深色',
    auto: '自动',

    // Achievement Levels
    'master chef': '大厨',
    'expert cook': '专业厨师',
    'home cook': '家庭厨师',
    apprentice: '学徒',
    beginner: '初学者',

    // Share Messages
    shareMessage: '我在动漫食谱中完成了{count}道精彩食谱！🍜✨',
    shareTitle: '动漫食谱 - 像动漫中一样烹饪！',
    shareRecipeMessage: '我超喜欢{recipe} 😍 想试试吗？下载应用：{link} 🍜',

    // Help & Privacy
    helpSupportTitle: '帮助和支持',
    helpContent: '如需帮助，请访问我们的支持页面或通过电子邮件联系我们。我们随时为您解答有关食谱的任何问题。',
    gotIt: '知道了',
    privacyPolicyTitle: '隐私政策',
    privacyContent: '我们尊重您的隐私。所有数据都本地存储在您的设备上。我们不会与第三方分享个人信息。',
    understood: '明白了',
    clearDataTitle: '清除数据',
    clearDataMessage: '您确定要删除所有数据吗？此操作无法撤销。',
    cancel: '取消',
    clearData: '清除数据',
    success: '成功',
    allDataCleared: '所有数据已清除',
    error: '错误',
    errorClearingData: '无法清除数据。请重试。',
    apply: '应用',
    selected: '已选择',

    // Recipe progress
    cookingProgress: '烹饪进度',
    reset: '重置',

    // Units
    measurementSystem: '测量系统',
    metric: '公制',
    imperial: '英制',
    steps: '步骤',

    // Diet types
    vegan: '纯素',
    omnivore: '杂食',
    dietPreference: '饮食偏好',

    // Timers
    manageTimers: '管理您的烹饪计时器',
    quickStartTimers: '快速启动计时器',
    customTimer: '自定义计时器',
    createCustomTimer: '创建自定义计时器',
    timerName: '计时器名称',
    hours: '小时',
    minutes: '分钟',
    seconds: '秒',
    create: '创建',
    activeTimers: '活动计时器',
    noActiveTimers: '没有活动计时器',
    createOneAbove: '在上方创建一个',
    completed: '已完成',
    running: '运行中',
    paused: '已暂停',
    timerCompleted: '计时器完成！',
    timerReady: '{name}已准备好！',
    ok: '确定',

    // Timer Presets
    boileggs: '煮鸡蛋',
    steamrice: '蒸米饭',
    marinate: '腌制',
    restdough: '醒面',
    simmerbroth: '煨汤',

    // Onboarding
    chefIntro: '喵-美好的一天！我是凯厨师，有抱负的厨师。我将成为您这次烹饪之旅的向导。在我们开始切菜和炒菜之前，我需要了解一些细节，以确保厨房对您来说是完美的。',
    measurementPreferenceTitle: '您希望我如何提供食材的测量？',
    measurementOption1: '公制 (kg/g, L/ml)',
    measurementOption2: '英制 (lb/oz, Gal/qt)',
    dietPreferenceTitle: '您的主要饮食风格是什么？',
    dietOption1: '杂食',
    dietOption2: '纯素',
    continue: '继续',
    back: '返回',
    start: '开始',
  },
  ru: {
    // Navigation
    home: 'Главная',
    anime: 'Аниме',
    favorites: 'Избранное',
    profile: 'Профиль',
    timers: 'Таймеры',

    // Welcome Screen
    welcome: 'Добро пожаловать в',
    animeRecipes: 'Аниме Рецепты',
    discoverNewRecipes: 'Откройте новые рецепты, вдохновленные вашими любимыми аниме',
    getStarted: 'Начать',

    // Home Screen
    continueWatching: 'Продолжить Готовку',
    trends: 'Тренды',
    allRecipes: 'Все Рецепты',
    viewMore: 'Смотреть больше',
    browseAnime: 'Просмотр Аниме',
    searchRecipes: 'Поиск рецептов...',
    all: 'Все',
    quickFilter: 'Быстро',
    easyFilter: 'Легко',
    popular: 'Популярное',

    // Search Screen
    findPerfectRecipe: 'Найдите идеальный рецепт',
    filters: 'Фильтры',
    clearAll: 'Очистить Все',
    recentSearches: 'Недавние Поиски',
    clear: 'Очистить',
    suggestedRecipes: 'Рекомендуемые Рецепты',
    resultsFound: 'результатов найдено',
    noRecipesFound: 'Рецепты не найдены',
    tryAdjustingSearch: 'Попробуйте изменить поиск или фильтры',

    // Filter Categories
    difficulty: 'Сложность',
    time: 'Время',
    category: 'Категория',
    easy: 'Легко (1-2 ⭐)',
    medium: 'Средне (3 ⭐)',
    hard: 'Сложно (4-5 ⭐)',
    quick: 'Быстро (< 30мин)',
    'medium-time': 'Средне (30-60мин)',
    long: 'Долго (> 60мин)',
    main: 'Основное Блюдо',
    snack: 'Закуска',
    dessert: 'Десерт',
    drink: 'Напиток',
    naruto: 'Наруто',
    onepiece: 'Ван Пис',
    demonslayer: 'Истребитель Демонов',
    ghibli: 'Студия Гибли',
    pokemon: 'Покемон',
    dragonball: 'Драгон Болл',

    // Recipe Detail
    recipeNotFound: 'Рецепт не найден',
    ingredients: 'Ингредиенты',
    instructions: 'Инструкции',
    step: 'Шаг',
    serve: 'порций',

    // Anime Screen
    animeCollection: 'Коллекция Аниме',
    browseRecipesByAnime: 'Просмотр рецептов по аниме',
    searchAnime: 'Поиск аниме...',
    recipes: 'рецептов',
    recipe: 'рецепт',
    noRecipesAvailable: 'Нет доступных рецептов для этого аниме',
    noIngredientsAvailable: 'Нет доступных ингредиентов',
    checkBackSoon: 'Загляните позже за новым контентом',

    // Favorites Screen
    yourSavedRecipes: 'Ваши сохраненные рецепты',
    searchYourFavorites: 'Поиск в избранном...',
    noFavoritesYet: 'Пока нет избранного!',
    discoverAmazingRecipes: 'Откройте удивительные рецепты и сохраните их здесь для быстрого доступа',
    exploreRecipes: 'Исследовать Рецепты',

    // Profile Screen
    animeChef: 'Аниме Шеф',
    preferences: 'Настройки',
    theme: 'Тема',
    language: 'Язык',
    notifications: 'Уведомления',
    enabled: 'Включено',
    toolsSupport: 'Инструменты и Поддержка',
    shareApp: 'Поделиться Приложением',
    helpSupport: 'Помощь и Поддержка',
    privacyPolicy: 'Политика Конфиденциальности',
    dataManagement: 'Управление Данными',
    clearAllData: 'Очистить Все Данные',
    chooseLanguage: 'Выбрать Язык',
    selectLanguage: 'Выбрать Язык',
    close: 'Закрыть',
    light: 'Светлая',
    dark: 'Темная',
    auto: 'Авто',

    // Achievement Levels
    'master chef': 'Мастер Шеф',
    'expert cook': 'Эксперт Повар',
    'home cook': 'Домашний Повар',
    apprentice: 'Ученик',
    beginner: 'Новичок',

    // Share Messages
    shareMessage: 'Я завершил {count} удивительных рецептов в Аниме Рецепты! 🍜✨',
    shareTitle: 'Аниме Рецепты - Готовьте как в аниме!',
    shareRecipeMessage: 'Мне очень нравится {recipe} 😍 Хотите попробовать? Скачайте приложение: {link} 🍜',

    // Help & Privacy
    helpSupportTitle: 'Помощь и Поддержка',
    helpContent: 'Для получения помощи посетите нашу страницу поддержки или свяжитесь с нами по электронной почте. Мы здесь, чтобы помочь с любыми вопросами о рецептах.',
    gotIt: 'Понятно',
    privacyPolicyTitle: 'Политика Конфиденциальности',
    privacyContent: 'Мы уважаем вашу конфиденциальность. Все данные хранятся локально на вашем устройстве. Мы не делимся личной информацией с третьими сторонами.',
    understood: 'Понятно',
    clearDataTitle: 'Очистить Данные',
    clearDataMessage: 'Вы уверены, что хотите удалить все свои данные? Это действие нельзя отменить.',
    cancel: 'Отмена',
    clearData: 'Очистить Данные',
    success: 'Успех',
    allDataCleared: 'Все данные были очищены',
    error: 'Ошибка',
    errorClearingData: 'Не удалось очистить данные. Пожалуйста, попробуйте снова.',
    apply: 'Применить',
    selected: 'выбрано',

    // Recipe progress
    cookingProgress: 'Прогресс Приготовления',
    reset: 'Сбросить',

    // Units
    measurementSystem: 'Система Измерения',
    metric: 'Метрическая',
    imperial: 'Имперская',
    steps: 'шагов',

    // Diet types
    vegan: 'Веган',
    omnivore: 'Всеядный',
    dietPreference: 'Диетическое Предпочтение',

    // Timers
    manageTimers: 'Управляйте вашими кухонными таймерами',
    quickStartTimers: 'Быстрый Старт Таймеры',
    customTimer: 'Пользовательский Таймер',
    createCustomTimer: 'Создать Пользовательский Таймер',
    timerName: 'Название таймера',
    hours: 'Часы',
    minutes: 'Минуты',
    seconds: 'Секунды',
    create: 'Создать',
    activeTimers: 'Активные Таймеры',
    noActiveTimers: 'Нет активных таймеров',
    createOneAbove: 'Создайте один выше',
    completed: 'Завершен',
    running: 'Работает',
    paused: 'Приостановлен',
    timerCompleted: 'Таймер Завершен!',
    timerReady: '{name} готов!',
    ok: 'ОК',

    // Timer Presets
    boileggs: 'Варить Яйца',
    steamrice: 'Варить Рис',
    marinate: 'Мариновать',
    restdough: 'Отдых Теста',
    simmerbroth: 'Тушить Бульон',

    // Onboarding
    chefIntro: 'Мяу-чудесный день! Я Шеф Кай, начинающий повар. Я буду вашим гидом в этом кулинарном путешествии. Прежде чем мы начнем нарезать и обжаривать, мне нужно узнать несколько деталей, чтобы убедиться, что кухня идеальна для вас.',
    measurementPreferenceTitle: 'Как вы хотите, чтобы я предоставлял измерения ингредиентов?',
    measurementOption1: 'Метрическая (кг/г, л/мл)',
    measurementOption2: 'Имперская (фунты/унции, галлоны/кварты)',
    dietPreferenceTitle: 'Каков ваш основной стиль питания?',
    dietOption1: 'Всеядный',
    dietOption2: 'Веган',
    continue: 'Продолжить',
    back: 'Назад',
    start: 'Начать',
  },
  ko: {
    // Navigation
    home: '홈',
    anime: '애니메이션',
    favorites: '즐겨찾기',
    profile: '프로필',
    timers: '타이머',

    // Welcome Screen
    welcome: '환영합니다',
    animeRecipes: '애니메이션 레시피',
    discoverNewRecipes: '좋아하는 애니메이션에서 영감을 받은 새로운 레시피를 발견하세요',
    getStarted: '시작하기',

    // Home Screen
    continueWatching: '요리 계속하기',
    trends: '인기',
    allRecipes: '모든 레시피',
    viewMore: '더 보기',
    browseAnime: '애니메이션 탐색',
    searchRecipes: '레시피 검색...',
    all: '전체',
    quickFilter: '빠른',
    easyFilter: '쉬운',
    popular: '인기',

    // Search Screen
    findPerfectRecipe: '완벽한 레시피 찾기',
    filters: '필터',
    clearAll: '전체 지우기',
    recentSearches: '최근 검색',
    clear: '지우기',
    suggestedRecipes: '추천 레시피',
    resultsFound: '개의 결과',
    noRecipesFound: '레시피를 찾을 수 없습니다',
    tryAdjustingSearch: '검색어나 필터를 조정해 보세요',

    // Filter Categories
    difficulty: '난이도',
    time: '시간',
    category: '카테고리',
    easy: '쉬움 (1-2 ⭐)',
    medium: '보통 (3 ⭐)',
    hard: '어려움 (4-5 ⭐)',
    quick: '빠름 (< 30분)',
    'medium-time': '보통 (30-60분)',
    long: '오래 걸림 (> 60분)',
    main: '메인 요리',
    snack: '스낵',
    dessert: '디저트',
    drink: '음료',
    naruto: '나루토',
    onepiece: '원피스',
    demonslayer: '귀멸의 칼날',
    ghibli: '스튜디오 지브리',
    pokemon: '포켓몬',
    dragonball: '드래곤볼',

    // Recipe Detail
    recipeNotFound: '레시피를 찾을 수 없습니다',
    ingredients: '재료',
    instructions: '조리법',
    step: '단계',
    serve: '인분',

    // Anime Screen
    animeCollection: '애니메이션 컬렉션',
    browseRecipesByAnime: '애니메이션별로 레시피 탐색',
    searchAnime: '애니메이션 검색...',
    recipes: '레시피',
    recipe: '레시피',
    noRecipesAvailable: '이 애니메이션에 사용 가능한 레시피가 없습니다',
    noIngredientsAvailable: '사용 가능한 재료가 없습니다',
    checkBackSoon: '더 많은 콘텐츠를 위해 곧 다시 확인하세요',

    // Favorites Screen
    yourSavedRecipes: '저장된 레시피',
    searchYourFavorites: '즐겨찾기 검색...',
    noFavoritesYet: '아직 즐겨찾기가 없습니다!',
    discoverAmazingRecipes: '멋진 레시피를 발견하고 빠른 액세스를 위해 여기에 저장하세요',
    exploreRecipes: '레시피 탐색',

    // Profile Screen
    animeChef: '애니메이션 셰프',
    preferences: '환경 설정',
    theme: '테마',
    language: '언어',
    notifications: '알림',
    enabled: '활성화됨',
    toolsSupport: '도구 및 지원',
    shareApp: '앱 공유',
    helpSupport: '도움말 및 지원',
    privacyPolicy: '개인정보 보호정책',
    dataManagement: '데이터 관리',
    clearAllData: '모든 데이터 지우기',
    chooseLanguage: '언어 선택',
    selectLanguage: '언어 선택',
    close: '닫기',
    light: '밝게',
    dark: '어둡게',
    auto: '자동',

    // Achievement Levels
    'master chef': '마스터 셰프',
    'expert cook': '전문 요리사',
    'home cook': '가정 요리사',
    apprentice: '견습생',
    beginner: '초보자',

    // Share Messages
    shareMessage: '애니메이션 레시피에서 {count}개의 멋진 레시피를 완성했습니다! 🍜✨',
    shareTitle: '애니메이션 레시피 - 애니메이션처럼 요리하세요!',
    shareRecipeMessage: '{recipe} 완전 좋아해요 😍 만들어 볼래요? 앱 설치: {link} 🍜',

    // Help & Privacy
    helpSupportTitle: '도움말 및 지원',
    helpContent: '도움이 필요하시면 지원 페이지를 방문하거나 이메일로 문의하세요. 레시피에 관한 모든 질문에 답변해 드립니다.',
    gotIt: '알겠습니다',
    privacyPolicyTitle: '개인정보 보호정책',
    privacyContent: '귀하의 개인정보를 존중합니다. 모든 데이터는 기기에 로컬로 저장됩니다. 개인 정보를 제3자와 공유하지 않습니다.',
    understood: '이해했습니다',
    clearDataTitle: '데이터 지우기',
    clearDataMessage: '모든 데이터를 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.',
    cancel: '취소',
    clearData: '데이터 지우기',
    success: '성공',
    allDataCleared: '모든 데이터가 지워졌습니다',
    error: '오류',
    errorClearingData: '데이터를 지울 수 없습니다. 다시 시도해주세요.',
    apply: '적용',
    selected: '선택됨',

    // Recipe progress
    cookingProgress: '요리 진행 상황',
    reset: '재설정',

    // Units
    measurementSystem: '측정 시스템',
    metric: '미터법',
    imperial: '야드파운드법',
    steps: '단계',

    // Diet types
    vegan: '비건',
    omnivore: '잡식',
    dietPreference: '식단 선호도',

    // Timers
    manageTimers: '요리 타이머 관리',
    quickStartTimers: '빠른 시작 타이머',
    customTimer: '사용자 정의 타이머',
    createCustomTimer: '사용자 정의 타이머 만들기',
    timerName: '타이머 이름',
    hours: '시간',
    minutes: '분',
    seconds: '초',
    create: '만들기',
    activeTimers: '활성 타이머',
    noActiveTimers: '활성 타이머 없음',
    createOneAbove: '위에서 만들기',
    completed: '완료됨',
    running: '실행 중',
    paused: '일시 중지됨',
    timerCompleted: '타이머 완료!',
    timerReady: '{name} 준비 완료!',
    ok: '확인',

    // Timer Presets
    boileggs: '계란 삶기',
    steamrice: '밥 짓기',
    marinate: '재우기',
    restdough: '반죽 휴지',
    simmerbroth: '육수 끓이기',

    // Onboarding
    chefIntro: '야옹-멋진 하루! 저는 셰프 카이입니다. 요리 견습생이에요. 이 요리 여행의 가이드가 되겠습니다. 썰고 볶기 전에, 당신에게 완벽한 주방을 만들기 위해 몇 가지 세부 사항을 알아야 합니다.',
    measurementPreferenceTitle: '재료 측정을 어떻게 제공해 드릴까요?',
    measurementOption1: '미터법 (kg/g, L/ml)',
    measurementOption2: '야드파운드법 (lb/oz, Gal/qt)',
    dietPreferenceTitle: '주요 식단 스타일은 무엇인가요?',
    dietOption1: '잡식',
    dietOption2: '비건',
    continue: '계속',
    back: '뒤로',
    start: '시작',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    anime: 'أنمي',
    favorites: 'المفضلة',
    profile: 'الملف الشخصي',
    timers: 'المؤقتات',

    // Welcome Screen
    welcome: 'مرحباً بك في',
    animeRecipes: 'وصفات الأنمي',
    discoverNewRecipes: 'اكتشف وصفات جديدة مستوحاة من الأنمي المفضل لديك',
    getStarted: 'ابدأ',

    // Home Screen
    continueWatching: 'متابعة الطهي',
    trends: 'الشائع',
    allRecipes: 'جميع الوصفات',
    viewMore: 'عرض المزيد',
    browseAnime: 'تصفح الأنمي',
    searchRecipes: 'ابحث عن وصفات...',
    all: 'الكل',
    quickFilter: 'سريع',
    easyFilter: 'سهل',
    popular: 'شائع',

    // Search Screen
    findPerfectRecipe: 'ابحث عن الوصفة المثالية',
    filters: 'الفلاتر',
    clearAll: 'مسح الكل',
    recentSearches: 'عمليات البحث الأخيرة',
    clear: 'مسح',
    suggestedRecipes: 'وصفات مقترحة',
    resultsFound: 'نتيجة',
    noRecipesFound: 'لم يتم العثور على وصفات',
    tryAdjustingSearch: 'حاول تعديل البحث أو الفلاتر',

    // Filter Categories
    difficulty: 'الصعوبة',
    time: 'الوقت',
    category: 'الفئة',
    easy: 'سهل (1-2 ⭐)',
    medium: 'متوسط (3 ⭐)',
    hard: 'صعب (4-5 ⭐)',
    quick: 'سريع (< 30 دقيقة)',
    'medium-time': 'متوسط (30-60 دقيقة)',
    long: 'طويل (> 60 دقيقة)',
    main: 'طبق رئيسي',
    snack: 'وجبة خفيفة',
    dessert: 'حلوى',
    drink: 'مشروب',
    naruto: 'ناروتو',
    onepiece: 'ون بيس',
    demonslayer: 'قاتل الشياطين',
    ghibli: 'ستوديو جيبلي',
    pokemon: 'بوكيمون',
    dragonball: 'دراجون بول',

    // Recipe Detail
    recipeNotFound: 'لم يتم العثور على الوصفة',
    ingredients: 'المكونات',
    instructions: 'التعليمات',
    step: 'خطوة',
    serve: 'حصص',

    // Anime Screen
    animeCollection: 'مجموعة الأنمي',
    browseRecipesByAnime: 'تصفح الوصفات حسب الأنمي',
    searchAnime: 'ابحث عن أنمي...',
    recipes: 'وصفات',
    recipe: 'وصفة',
    noRecipesAvailable: 'لا توجد وصفات متاحة لهذا الأنمي',
    noIngredientsAvailable: 'لا توجد مكونات متاحة',
    checkBackSoon: 'تحقق مرة أخرى قريباً للمزيد من المحتوى',

    // Favorites Screen
    yourSavedRecipes: 'وصفاتك المحفوظة',
    searchYourFavorites: 'ابحث في مفضلاتك...',
    noFavoritesYet: 'لا توجد مفضلات حتى الآن!',
    discoverAmazingRecipes: 'اكتشف وصفات رائعة واحفظها هنا للوصول السريع',
    exploreRecipes: 'استكشف الوصفات',

    // Profile Screen
    animeChef: 'طاهي الأنمي',
    preferences: 'التفضيلات',
    theme: 'المظهر',
    language: 'اللغة',
    notifications: 'الإشعارات',
    enabled: 'مفعّل',
    toolsSupport: 'الأدوات والدعم',
    shareApp: 'مشاركة التطبيق',
    helpSupport: 'المساعدة والدعم',
    privacyPolicy: 'سياسة الخصوصية',
    dataManagement: 'إدارة البيانات',
    clearAllData: 'مسح جميع البيانات',
    chooseLanguage: 'اختر اللغة',
    selectLanguage: 'حدد اللغة',
    close: 'إغلاق',
    light: 'فاتح',
    dark: 'داكن',
    auto: 'تلقائي',

    // Achievement Levels
    'master chef': 'الطاهي الماهر',
    'expert cook': 'طباخ خبير',
    'home cook': 'طباخ منزلي',
    apprentice: 'متدرب',
    beginner: 'مبتدئ',

    // Share Messages
    shareMessage: 'لقد أكملت {count} وصفة رائعة في وصفات الأنمي! 🍜✨',
    shareTitle: 'وصفات الأنمي - اطبخ مثل الأنمي!',
    shareRecipeMessage: 'أُحب {recipe} كثيراً 😍 تريد تجربتها؟ حمّل التطبيق: {link} 🍜',

    // Help & Privacy
    helpSupportTitle: 'المساعدة والدعم',
    helpContent: 'للحصول على المساعدة، قم بزيارة صفحة الدعم أو اتصل بنا عبر البريد الإلكتروني. نحن هنا للمساعدة في أي أسئلة حول الوصفات.',
    gotIt: 'فهمت',
    privacyPolicyTitle: 'سياسة الخصوصية',
    privacyContent: 'نحن نحترم خصوصيتك. يتم تخزين جميع البيانات محلياً على جهازك. لا نشارك المعلومات الشخصية مع أطراف ثالثة.',
    understood: 'مفهوم',
    clearDataTitle: 'مسح البيانات',
    clearDataMessage: 'هل أنت متأكد من أنك تريد حذف جميع بياناتك؟ لا يمكن التراجع عن هذا الإجراء.',
    cancel: 'إلغاء',
    clearData: 'مسح البيانات',
    success: 'نجح',
    allDataCleared: 'تم مسح جميع البيانات',
    error: 'خطأ',
    errorClearingData: 'لا يمكن مسح البيانات. يرجى المحاولة مرة أخرى.',
    apply: 'تطبيق',
    selected: 'محدد',

    // Recipe progress
    cookingProgress: 'تقدم الطهي',
    reset: 'إعادة تعيين',

    // Units
    measurementSystem: 'نظام القياس',
    metric: 'متري',
    imperial: 'إمبراطوري',
    steps: 'خطوات',

    // Diet types
    vegan: 'نباتي',
    omnivore: 'آكل لحوم',
    dietPreference: 'تفضيل النظام الغذائي',

    // Timers
    manageTimers: 'إدارة مؤقتات الطهي',
    quickStartTimers: 'مؤقتات البدء السريع',
    customTimer: 'مؤقت مخصص',
    createCustomTimer: 'إنشاء مؤقت مخصص',
    timerName: 'اسم المؤقت',
    hours: 'ساعات',
    minutes: 'دقائق',
    seconds: 'ثواني',
    create: 'إنشاء',
    activeTimers: 'المؤقتات النشطة',
    noActiveTimers: 'لا توجد مؤقتات نشطة',
    createOneAbove: 'قم بإنشاء واحد أعلاه',
    completed: 'مكتمل',
    running: 'قيد التشغيل',
    paused: 'متوقف مؤقتاً',
    timerCompleted: 'اكتمل المؤقت!',
    timerReady: '{name} جاهز!',
    ok: 'حسناً',

    // Timer Presets
    boileggs: 'سلق البيض',
    steamrice: 'طهي الأرز',
    marinate: 'التتبيل',
    restdough: 'راحة العجين',
    simmerbroth: 'غلي المرق',

    // Onboarding
    chefIntro: 'مياو-يوم رائع! أنا الشيف كاي، طاهٍ طموح. سأكون مرشدك في هذه الرحلة الطهوية. قبل أن نبدأ بالتقطيع والقلي، أحتاج إلى معرفة بعض التفاصيل للتأكد من أن المطبخ مثالي لك.',
    measurementPreferenceTitle: 'كيف تفضل أن أقدم لك قياسات المكونات؟',
    measurementOption1: 'متري (كجم/جم، لتر/مل)',
    measurementOption2: 'إمبراطوري (رطل/أونصة، جالون/كوارت)',
    dietPreferenceTitle: 'ما هو نمط نظامك الغذائي الرئيسي؟',
    dietOption1: 'آكل لحوم',
    dietOption2: 'نباتي',
    continue: 'متابعة',
    back: 'رجوع',
    start: 'ابدأ',
  },
  tr: {
    // Navigation
    home: 'Ana Sayfa',
    anime: 'Anime',
    favorites: 'Favoriler',
    profile: 'Profil',
    timers: 'Zamanlayıcılar',

    // Welcome Screen
    welcome: 'Hoş Geldiniz',
    animeRecipes: 'Anime Tarifleri',
    discoverNewRecipes: 'Favori animenizden ilham alan yeni tarifler keşfedin',
    getStarted: 'Başlayın',

    // Home Screen
    continueWatching: 'Pişirmeye Devam Et',
    trends: 'Trendler',
    allRecipes: 'Tüm Tarifler',
    viewMore: 'Daha Fazla Gör',
    browseAnime: 'Anime\'lere Göz At',
    searchRecipes: 'Tarif ara...',
    all: 'Tümü',
    quickFilter: 'Hızlı',
    easyFilter: 'Kolay',
    popular: 'Popüler',

    // Search Screen
    findPerfectRecipe: 'Mükemmel tarifi bulun',
    filters: 'Filtreler',
    clearAll: 'Tümünü Temizle',
    recentSearches: 'Son Aramalar',
    clear: 'Temizle',
    suggestedRecipes: 'Önerilen Tarifler',
    resultsFound: 'sonuç bulundu',
    noRecipesFound: 'Tarif bulunamadı',
    tryAdjustingSearch: 'Aramanızı veya filtrelerinizi ayarlamayı deneyin',

    // Filter Categories
    difficulty: 'Zorluk',
    time: 'Süre',
    category: 'Kategori',
    easy: 'Kolay (1-2 ⭐)',
    medium: 'Orta (3 ⭐)',
    hard: 'Zor (4-5 ⭐)',
    quick: 'Hızlı (< 30dk)',
    'medium-time': 'Orta (30-60dk)',
    long: 'Uzun (> 60dk)',
    main: 'Ana Yemek',
    snack: 'Atıştırmalık',
    dessert: 'Tatlı',
    drink: 'İçecek',
    naruto: 'Naruto',
    onepiece: 'One Piece',
    demonslayer: 'Demon Slayer',
    ghibli: 'Studio Ghibli',
    pokemon: 'Pokémon',
    dragonball: 'Dragon Ball',

    // Recipe Detail
    recipeNotFound: 'Tarif bulunamadı',
    ingredients: 'Malzemeler',
    instructions: 'Talimatlar',
    step: 'Adım',
    serve: 'porsiyon',

    // Anime Screen
    animeCollection: 'Anime Koleksiyonu',
    browseRecipesByAnime: 'Anime\'ye göre tariflere göz atın',
    searchAnime: 'Anime ara...',
    recipes: 'tarif',
    recipe: 'tarif',
    noRecipesAvailable: 'Bu anime için mevcut tarif yok',
    noIngredientsAvailable: 'Mevcut malzeme yok',
    checkBackSoon: 'Daha fazla içerik için yakında tekrar kontrol edin',

    // Favorites Screen
    yourSavedRecipes: 'Kayıtlı tariflerin',
    searchYourFavorites: 'Favorilerinizde ara...',
    noFavoritesYet: 'Henüz favori yok!',
    discoverAmazingRecipes: 'Harika tarifler keşfedin ve hızlı erişim için burada kaydedin',
    exploreRecipes: 'Tarifleri Keşfet',

    // Profile Screen
    animeChef: 'Anime Şefi',
    preferences: 'Tercihler',
    theme: 'Tema',
    language: 'Dil',
    notifications: 'Bildirimler',
    enabled: 'Etkin',
    toolsSupport: 'Araçlar ve Destek',
    shareApp: 'Uygulamayı Paylaş',
    helpSupport: 'Yardım ve Destek',
    privacyPolicy: 'Gizlilik Politikası',
    dataManagement: 'Veri Yönetimi',
    clearAllData: 'Tüm Verileri Temizle',
    chooseLanguage: 'Dil Seç',
    selectLanguage: 'Dil Seçin',
    close: 'Kapat',
    light: 'Açık',
    dark: 'Koyu',
    auto: 'Otomatik',

    // Achievement Levels
    'master chef': 'Usta Şef',
    'expert cook': 'Uzman Aşçı',
    'home cook': 'Ev Aşçısı',
    apprentice: 'Çırak',
    beginner: 'Başlangıç',

    // Share Messages
    shareMessage: 'Anime Tarifleri\'nde {count} harika tarif tamamladım! 🍜✨',
    shareTitle: 'Anime Tarifleri - Anime gibi pişirin!',
    shareRecipeMessage: '{recipe}\'i çok seviyorum 😍 Denemek ister misin? Uygulamayı indir: {link} 🍜',

    // Help & Privacy
    helpSupportTitle: 'Yardım ve Destek',
    helpContent: 'Yardım için destek sayfamızı ziyaret edin veya e-posta ile bize ulaşın. Tarifler hakkında herhangi bir sorunuzda yardımcı olmak için buradayız.',
    gotIt: 'Anladım',
    privacyPolicyTitle: 'Gizlilik Politikası',
    privacyContent: 'Gizliliğinize saygı duyuyoruz. Tüm veriler cihazınızda yerel olarak saklanır. Kişisel bilgileri üçüncü taraflarla paylaşmıyoruz.',
    understood: 'Anlaşıldı',
    clearDataTitle: 'Verileri Temizle',
    clearDataMessage: 'Tüm verilerinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    cancel: 'İptal',
    clearData: 'Verileri Temizle',
    success: 'Başarılı',
    allDataCleared: 'Tüm veriler temizlendi',
    error: 'Hata',
    errorClearingData: 'Veriler temizlenemedi. Lütfen tekrar deneyin.',
    apply: 'Uygula',
    selected: 'seçildi',

    // Recipe progress
    cookingProgress: 'Pişirme İlerlemesi',
    reset: 'Sıfırla',

    // Units
    measurementSystem: 'Ölçüm Sistemi',
    metric: 'Metrik',
    imperial: 'İmparatorluk',
    steps: 'adım',

    // Diet types
    vegan: 'Vegan',
    omnivore: 'Omnivor',
    dietPreference: 'Diyet Tercihi',

    // Timers
    manageTimers: 'Pişirme zamanlayıcılarınızı yönetin',
    quickStartTimers: 'Hızlı Başlat Zamanlayıcılar',
    customTimer: 'Özel Zamanlayıcı',
    createCustomTimer: 'Özel Zamanlayıcı Oluştur',
    timerName: 'Zamanlayıcı adı',
    hours: 'Saat',
    minutes: 'Dakika',
    seconds: 'Saniye',
    create: 'Oluştur',
    activeTimers: 'Aktif Zamanlayıcılar',
    noActiveTimers: 'Aktif zamanlayıcı yok',
    createOneAbove: 'Yukarıda bir tane oluşturun',
    completed: 'Tamamlandı',
    running: 'Çalışıyor',
    paused: 'Duraklatıldı',
    timerCompleted: 'Zamanlayıcı Tamamlandı!',
    timerReady: '{name} hazır!',
    ok: 'Tamam',

    // Timer Presets
    boileggs: 'Yumurta Haşla',
    steamrice: 'Pirinç Pişir',
    marinate: 'Marine Et',
    restdough: 'Hamur Dinlendir',
    simmerbroth: 'Et Suyu Kaynat',

    // Onboarding
    chefIntro: 'Miyav-harika bir gün! Ben Şef Kai, hevesli bir aşçıyım. Bu mutfak yolculuğunda rehberiniz olacağım. Doğramaya ve soteye başlamadan önce, mutfağın sizin için mükemmel olduğundan emin olmak için birkaç ayrıntıyı bilmem gerekiyor.',
    measurementPreferenceTitle: 'Malzeme ölçümlerini nasıl vermemi istersiniz?',
    measurementOption1: 'Metrik (kg/g, L/ml)',
    measurementOption2: 'İmparatorluk (lb/oz, Gal/qt)',
    dietPreferenceTitle: 'Ana diyet tarzınız nedir?',
    dietOption1: 'Omnivor',
    dietOption2: 'Vegan',
    continue: 'Devam Et',
    back: 'Geri',
    start: 'Başla',
  },
  th: {
    // Navigation
    home: 'หน้าหลัก',
    anime: 'อนิเมะ',
    favorites: 'รายการโปรด',
    profile: 'โปรไฟล์',
    timers: 'ตัวจับเวลา',

    // Welcome Screen
    welcome: 'ยินดีต้อนรับสู่',
    animeRecipes: 'สูตรอาหารอนิเมะ',
    discoverNewRecipes: 'ค้นพบสูตรอาหารใหม่ที่ได้แรงบันดาลใจจากอนิเมะที่คุณชื่นชอบ',
    getStarted: 'เริ่มต้น',

    // Home Screen
    continueWatching: 'ทำอาหารต่อ',
    trends: 'กำลังฮิต',
    allRecipes: 'สูตรอาหารทั้งหมด',
    viewMore: 'ดูเพิ่มเติม',
    browseAnime: 'เรียกดูอนิเมะ',
    searchRecipes: 'ค้นหาสูตรอาหาร...',
    all: 'ทั้งหมด',
    quickFilter: 'เร็ว',
    easyFilter: 'ง่าย',
    popular: 'ยอดนิยม',

    // Search Screen
    findPerfectRecipe: 'ค้นหาสูตรที่สมบูรณ์แบบ',
    filters: 'ตัวกรอง',
    clearAll: 'ล้างทั้งหมด',
    recentSearches: 'การค้นหาล่าสุด',
    clear: 'ล้าง',
    suggestedRecipes: 'สูตรอาหารที่แนะนำ',
    resultsFound: 'ผลลัพธ์ที่พบ',
    noRecipesFound: 'ไม่พบสูตรอาหาร',
    tryAdjustingSearch: 'ลองปรับการค้นหาหรือตัวกรองของคุณ',

    // Filter Categories
    difficulty: 'ความยาก',
    time: 'เวลา',
    category: 'หมวดหมู่',
    easy: 'ง่าย (1-2 ⭐)',
    medium: 'ปานกลาง (3 ⭐)',
    hard: 'ยาก (4-5 ⭐)',
    quick: 'เร็ว (< 30 นาที)',
    'medium-time': 'ปานกลาง (30-60 นาที)',
    long: 'นาน (> 60 นาที)',
    main: 'จานหลัก',
    snack: 'ของว่าง',
    dessert: 'ของหวาน',
    drink: 'เครื่องดื่ม',
    naruto: 'นารูโตะ',
    onepiece: 'วันพีซ',
    demonslayer: 'ดาบพิฆาตอสูร',
    ghibli: 'สตูดิโอจิบลิ',
    pokemon: 'โปเกมอน',
    dragonball: 'ดราก้อนบอล',

    // Recipe Detail
    recipeNotFound: 'ไม่พบสูตรอาหาร',
    ingredients: 'ส่วนผสม',
    instructions: 'วิธีทำ',
    step: 'ขั้นตอน',
    serve: 'ที่',

    // Anime Screen
    animeCollection: 'คอลเลกชันอนิเมะ',
    browseRecipesByAnime: 'เรียกดูสูตรอาหารตามอนิเมะ',
    searchAnime: 'ค้นหาอนิเมะ...',
    recipes: 'สูตรอาหาร',
    recipe: 'สูตรอาหาร',
    noRecipesAvailable: 'ไม่มีสูตรอาหารสำหรับอนิเมะนี้',
    noIngredientsAvailable: 'ไม่มีส่วนผสมที่พร้อมใช้งาน',
    checkBackSoon: 'กลับมาตรวจสอบอีกครั้งเร็วๆ นี้สำหรับเนื้อหาเพิ่มเติม',

    // Favorites Screen
    yourSavedRecipes: 'สูตรอาหารที่บันทึกไว้',
    searchYourFavorites: 'ค้นหาในรายการโปรด...',
    noFavoritesYet: 'ยังไม่มีรายการโปรด!',
    discoverAmazingRecipes: 'ค้นพบสูตรอาหารที่น่าทึ่งและบันทึกไว้ที่นี่เพื่อเข้าถึงได้อย่างรวดเร็ว',
    exploreRecipes: 'สำรวจสูตรอาหาร',

    // Profile Screen
    animeChef: 'พ่อครัวอนิเมะ',
    preferences: 'การตั้งค่า',
    theme: 'ธีม',
    language: 'ภาษา',
    notifications: 'การแจ้งเตือน',
    enabled: 'เปิดใช้งาน',
    toolsSupport: 'เครื่องมือและการสนับสนุน',
    shareApp: 'แชร์แอป',
    helpSupport: 'ช่วยเหลือและสนับสนุน',
    privacyPolicy: 'นโยบายความเป็นส่วนตัว',
    dataManagement: 'การจัดการข้อมูล',
    clearAllData: 'ล้างข้อมูลทั้งหมด',
    chooseLanguage: 'เลือกภาษา',
    selectLanguage: 'เลือกภาษา',
    close: 'ปิด',
    light: 'สว่าง',
    dark: 'มืด',
    auto: 'อัตโนมัติ',

    // Achievement Levels
    'master chef': 'เชฟมือหนึ่ง',
    'expert cook': 'พ่อครัวผู้เชี่ยวชาญ',
    'home cook': 'พ่อครัวบ้าน',
    apprentice: 'ลูกศิษย์',
    beginner: 'ผู้เริ่มต้น',

    // Share Messages
    shareMessage: 'ฉันทำสูตรอาหารที่น่าทึ่ง {count} รายการใน Anime Recipes เสร็จแล้ว! 🍜✨',
    shareTitle: 'Anime Recipes - ทำอาหารเหมือนในอนิเมะ!',
    shareRecipeMessage: 'ฉันหลงรัก {recipe} เลย 😍 ถ้าอยากลอง ดาวน์โหลดแอปได้ที่นี่: {link} 🍜',

    // Help & Privacy
    helpSupportTitle: 'ช่วยเหลือและสนับสนุน',
    helpContent: 'สำหรับความช่วยเหลือ โปรดเยี่ยมชมหน้าสนับสนุนของเราหรือติดต่อเราทางอีเมล เราพร้อมช่วยเหลือคำถามใดๆ เกี่ยวกับสูตรอาหาร',
    gotIt: 'เข้าใจแล้ว',
    privacyPolicyTitle: 'นโยบายความเป็นส่วนตัว',
    privacyContent: 'เราเคารพความเป็นส่วนตัวของคุณ ข้อมูลทั้งหมดจะถูกเก็บไว้ในอุปกรณ์ของคุณเท่านั้น เราไม่แชร์ข้อมูลส่วนบุคคลกับบุคคลที่สาม',
    understood: 'เข้าใจแล้ว',
    clearDataTitle: 'ล้างข้อมูล',
    clearDataMessage: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลทั้งหมดของคุณ? การดำเนินการนี้ไม่สามารถย้อนกลับได้',
    cancel: 'ยกเลิก',
    clearData: 'ล้างข้อมูล',
    success: 'สำเร็จ',
    allDataCleared: 'ข้อมูลทั้งหมดถูกล้างแล้ว',
    error: 'ข้อผิดพลาด',
    errorClearingData: 'ไม่สามารถล้างข้อมูลได้ กรุณาลองอีกครั้ง',
    apply: 'ใช้',
    selected: 'เลือกแล้ว',

    // Recipe progress
    cookingProgress: 'ความคืบหน้าในการทำอาหาร',
    reset: 'รีเซ็ต',

    // Units
    measurementSystem: 'ระบบการวัด',
    metric: 'เมตริก',
    imperial: 'อิมพีเรียล',
    steps: 'ขั้นตอน',

    // Diet types
    vegan: 'มังสวิรัติ',
    omnivore: 'ทุกอย่าง',
    dietPreference: 'ความชอบด้านอาหาร',

    // Timers
    manageTimers: 'จัดการตัวจับเวลาทำอาหารของคุณ',
    quickStartTimers: 'ตัวจับเวลาเริ่มด่วน',
    customTimer: 'ตัวจับเวลาแบบกำหนดเอง',
    createCustomTimer: 'สร้างตัวจับเวลาแบบกำหนดเอง',
    timerName: 'ชื่อตัวจับเวลา',
    hours: 'ชั่วโมง',
    minutes: 'นาที',
    seconds: 'วินาที',
    create: 'สร้าง',
    activeTimers: 'ตัวจับเวลาที่ใช้งานอยู่',
    noActiveTimers: 'ไม่มีตัวจับเวลาที่ใช้งานอยู่',
    createOneAbove: 'สร้างหนึ่งข้างบน',
    completed: 'เสร็จสมบูรณ์',
    running: 'กำลังทำงาน',
    paused: 'หยุดชั่วคราว',
    timerCompleted: 'ตัวจับเวลาเสร็จสมบูรณ์!',
    timerReady: '{name} พร้อมแล้ว!',
    ok: 'ตกลง',

    // Timer Presets
    boileggs: 'ต้มไข่',
    steamrice: 'นึ่งข้าว',
    marinate: 'หมัก',
    restdough: 'พักแป้ง',
    simmerbroth: 'ต้มน้ำซุป',

    // Onboarding
    chefIntro: 'เมี๊ยว-วันที่ยอดเยี่ยม! ฉันชื่อเชฟไค พ่อครัวมือใหม่ ฉันจะเป็นผู้นำทางในการเดินทางด้านอาหารครั้งนี้ ก่อนที่เราจะเริ่มหั่นและผัด ฉันต้องรู้รายละเอียดสองสามอย่างเพื่อให้แน่ใจว่าครัวเหมาะสมสำหรับคุณ',
    measurementPreferenceTitle: 'คุณต้องการให้ฉันให้การวัดส่วนผสมอย่างไร?',
    measurementOption1: 'เมตริก (กก./ก., ล./มล.)',
    measurementOption2: 'อิมพีเรียล (ปอนด์/ออนซ์, แกลลอน/ควอต)',
    dietPreferenceTitle: 'รูปแบบอาหารหลักของคุณคืออะไร?',
    dietOption1: 'ทุกอย่าง',
    dietOption2: 'มังสวิรัติ',
    continue: 'ดำเนินการต่อ',
    back: 'ย้อนกลับ',
    start: 'เริ่มต้น',
  },
  id: {
    // Navigation
    home: 'Beranda',
    anime: 'Anime',
    favorites: 'Favorit',
    profile: 'Profil',
    timers: 'Pengatur Waktu',

    // Welcome Screen
    welcome: 'Selamat Datang di',
    animeRecipes: 'Resep Anime',
    discoverNewRecipes: 'Temukan resep baru yang terinspirasi dari anime favorit Anda',
    getStarted: 'Mulai',

    // Home Screen
    continueWatching: 'Lanjutkan Memasak',
    trends: 'Trending',
    allRecipes: 'Semua Resep',
    viewMore: 'Lihat Lebih Banyak',
    browseAnime: 'Jelajahi Anime',
    searchRecipes: 'Cari resep...',
    all: 'Semua',
    quickFilter: 'Cepat',
    easyFilter: 'Mudah',
    popular: 'Populer',

    // Search Screen
    findPerfectRecipe: 'Temukan resep yang sempurna',
    filters: 'Filter',
    clearAll: 'Hapus Semua',
    recentSearches: 'Pencarian Terkini',
    clear: 'Hapus',
    suggestedRecipes: 'Resep yang Disarankan',
    resultsFound: 'hasil ditemukan',
    noRecipesFound: 'Resep tidak ditemukan',
    tryAdjustingSearch: 'Coba sesuaikan pencarian atau filter Anda',

    // Filter Categories
    difficulty: 'Kesulitan',
    time: 'Waktu',
    category: 'Kategori',
    easy: 'Mudah (1-2 ⭐)',
    medium: 'Sedang (3 ⭐)',
    hard: 'Sulit (4-5 ⭐)',
    quick: 'Cepat (< 30 menit)',
    'medium-time': 'Sedang (30-60 menit)',
    long: 'Lama (> 60 menit)',
    main: 'Hidangan Utama',
    snack: 'Camilan',
    dessert: 'Pencuci Mulut',
    drink: 'Minuman',
    naruto: 'Naruto',
    onepiece: 'One Piece',
    demonslayer: 'Demon Slayer',
    ghibli: 'Studio Ghibli',
    pokemon: 'Pokémon',
    dragonball: 'Dragon Ball',

    // Recipe Detail
    recipeNotFound: 'Resep tidak ditemukan',
    ingredients: 'Bahan-bahan',
    instructions: 'Petunjuk',
    step: 'Langkah',
    serve: 'porsi',

    // Anime Screen
    animeCollection: 'Koleksi Anime',
    browseRecipesByAnime: 'Jelajahi resep berdasarkan anime',
    searchAnime: 'Cari anime...',
    recipes: 'resep',
    recipe: 'resep',
    noRecipesAvailable: 'Tidak ada resep yang tersedia untuk anime ini',
    noIngredientsAvailable: 'Tidak ada bahan yang tersedia',
    checkBackSoon: 'Periksa kembali segera untuk konten lebih banyak',

    // Favorites Screen
    yourSavedRecipes: 'Resep tersimpan Anda',
    searchYourFavorites: 'Cari di favorit Anda...',
    noFavoritesYet: 'Belum ada favorit!',
    discoverAmazingRecipes: 'Temukan resep menakjubkan dan simpan di sini untuk akses cepat',
    exploreRecipes: 'Jelajahi Resep',

    // Profile Screen
    animeChef: 'Koki Anime',
    preferences: 'Preferensi',
    theme: 'Tema',
    language: 'Bahasa',
    notifications: 'Notifikasi',
    enabled: 'Diaktifkan',
    toolsSupport: 'Alat & Dukungan',
    shareApp: 'Bagikan Aplikasi',
    helpSupport: 'Bantuan & Dukungan',
    privacyPolicy: 'Kebijakan Privasi',
    dataManagement: 'Manajemen Data',
    clearAllData: 'Hapus Semua Data',
    chooseLanguage: 'Pilih Bahasa',
    selectLanguage: 'Pilih Bahasa',
    close: 'Tutup',
    light: 'Terang',
    dark: 'Gelap',
    auto: 'Otomatis',

    // Achievement Levels
    'master chef': 'Koki Ahli',
    'expert cook': 'Juru Masak Ahli',
    'home cook': 'Juru Masak Rumahan',
    apprentice: 'Magang',
    beginner: 'Pemula',

    // Share Messages
    shareMessage: 'Saya telah menyelesaikan {count} resep menakjubkan di Resep Anime! 🍜✨',
    shareTitle: 'Resep Anime - Masak seperti di anime!',
    shareRecipeMessage: 'Lagi suka banget {recipe} 😍 Mau coba? Unduh aplikasinya: {link} 🍜',

    // Help & Privacy
    helpSupportTitle: 'Bantuan & Dukungan',
    helpContent: 'Untuk bantuan, kunjungi halaman dukungan kami atau hubungi kami melalui email. Kami siap membantu pertanyaan apa pun tentang resep.',
    gotIt: 'Mengerti',
    privacyPolicyTitle: 'Kebijakan Privasi',
    privacyContent: 'Kami menghormati privasi Anda. Semua data disimpan secara lokal di perangkat Anda. Kami tidak membagikan informasi pribadi dengan pihak ketiga.',
    understood: 'Dipahami',
    clearDataTitle: 'Hapus Data',
    clearDataMessage: 'Apakah Anda yakin ingin menghapus semua data Anda? Tindakan ini tidak dapat dibatalkan.',
    cancel: 'Batal',
    clearData: 'Hapus Data',
    success: 'Berhasil',
    allDataCleared: 'Semua data telah dihapus',
    error: 'Kesalahan',
    errorClearingData: 'Tidak dapat menghapus data. Silakan coba lagi.',
    apply: 'Terapkan',
    selected: 'dipilih',

    // Recipe progress
    cookingProgress: 'Kemajuan Memasak',
    reset: 'Atur Ulang',

    // Units
    measurementSystem: 'Sistem Pengukuran',
    metric: 'Metrik',
    imperial: 'Imperial',
    steps: 'langkah',

    // Diet types
    vegan: 'Vegan',
    omnivore: 'Omnivora',
    dietPreference: 'Preferensi Diet',

    // Timers
    manageTimers: 'Kelola pengatur waktu memasak Anda',
    quickStartTimers: 'Pengatur Waktu Mulai Cepat',
    customTimer: 'Pengatur Waktu Kustom',
    createCustomTimer: 'Buat Pengatur Waktu Kustom',
    timerName: 'Nama pengatur waktu',
    hours: 'Jam',
    minutes: 'Menit',
    seconds: 'Detik',
    create: 'Buat',
    activeTimers: 'Pengatur Waktu Aktif',
    noActiveTimers: 'Tidak ada pengatur waktu aktif',
    createOneAbove: 'Buat satu di atas',
    completed: 'Selesai',
    running: 'Berjalan',
    paused: 'Dijeda',
    timerCompleted: 'Pengatur Waktu Selesai!',
    timerReady: '{name} sudah siap!',
    ok: 'OK',

    // Timer Presets
    boileggs: 'Rebus Telur',
    steamrice: 'Kukus Nasi',
    marinate: 'Marinasi',
    restdough: 'Istirahatkan Adonan',
    simmerbroth: 'Rebus Kaldu',

    // Onboarding
    chefIntro: 'Meow-hari yang luar biasa! Saya Chef Kai, juru masak yang bercita-cita tinggi. Saya akan menjadi pemandu Anda dalam perjalanan kuliner ini. Sebelum kita mulai memotong dan menumis, saya perlu mengetahui beberapa detail untuk memastikan dapur sempurna untuk Anda.',
    measurementPreferenceTitle: 'Bagaimana Anda ingin saya memberikan pengukuran bahan?',
    measurementOption1: 'Metrik (kg/g, L/ml)',
    measurementOption2: 'Imperial (lb/oz, Gal/qt)',
    dietPreferenceTitle: 'Apa gaya diet utama Anda?',
    dietOption1: 'Omnivora',
    dietOption2: 'Vegan',
    continue: 'Lanjutkan',
    back: 'Kembali',
    start: 'Mulai',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage && translations[savedLanguage as Language]) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  const getLanguageInfo = (lang: Language) => {
    const languageMap = {
      es: { name: 'Español', flag: '🇪🇸' },
      en: { name: 'English', flag: '🇺🇸' },
      it: { name: 'Italiano', flag: '🇮🇹' },
      de: { name: 'Deutsch', flag: '🇩🇪' },
      fr: { name: 'Français', flag: '🇫🇷' },
      pt: { name: 'Português', flag: '🇧🇷' },
      ja: { name: '日本語', flag: '🇯🇵' },
      hi: { name: 'हिन्दी', flag: '🇮🇳' },
      zh: { name: '中文', flag: '🇨🇳' },
      ru: { name: 'Русский', flag: '🇷🇺' },
      ko: { name: '한국어', flag: '🇰🇷' },
      ar: { name: 'العربية', flag: '🇸🇦' },
      tr: { name: 'Türkçe', flag: '🇹🇷' },
      th: { name: 'ไทย', flag: '🇹🇭' },
      id: { name: 'Bahasa Indonesia', flag: '🇮🇩' },
    };
    return languageMap[lang];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLanguageInfo }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};