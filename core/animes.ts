export interface AnimeTranslation {
    name: string;
    description?: string;
}

export interface Anime {
    id: string;
    emoji: string;
    color: string; // color hexadecimal para UI
    image: any; // Referencia a imagen local o URL
    recipeCount: number;
    translations: {
        [language: string]: AnimeTranslation;
    };
    tags?: string[]; // para filtros: ["action", "fantasy", "comedy", "drama", etc.]
    year?: number; // año de estreno
    genre?: string[]; // géneros del anime
}

export const animes: Anime[] = [
    {
        id: 'scientists',
        emoji: '🔬',
        color: '#2ECC71',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.40.jpeg'),
        recipeCount: 0,
        year: 2000,
        genre: ['sci-fi', 'adventure', 'comedy'],
        translations: {
            es: {
                name: 'Scientists',
                description: 'Inventos locos, experimentos y recetas fuera de lo común.'
            },
            en: {
                name: 'Scientists',
                description: 'Crazy inventions, experiments, and out-of-the-box recipes.'
            }
        },
        tags: ['science', 'inventions', 'comedy']
    },
    {
        id: 'slayers',
        emoji: '🗡️',
        color: '#9B59B6',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.40.jpeg'),
        recipeCount: 1,
        year: 1995,
        genre: ['fantasy', 'adventure', 'comedy'],
        translations: {
            es: {
                name: 'Slayers',
                description: 'Magos y espadachines en aventuras épicas llenas de humor.'
            },
            en: {
                name: 'Slayers',
                description: 'Mages and swordsmen in epic adventures full of humor.'
            }
        },
        tags: ['fantasy', 'magic', 'adventure', 'classic']
    },
    {
        id: 'stands',
        emoji: '💎',
        color: '#7D3C98',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.42 (4).jpeg'),
        recipeCount: 0,
        year: 2012,
        genre: ['action', 'supernatural', 'adventure'],
        translations: {
            es: {
                name: 'Stands',
                description: 'Poderes espirituales y batallas estilizadas al puro estilo JoJo.'
            },
            en: {
                name: 'Stands',
                description: 'Spiritual powers and stylized battles in true JoJo fashion.'
            }
        },
        tags: ['jojo', 'supernatural', 'stylish', 'battle']
    },
    {
        id: 'demon-slayer',
        emoji: '⚔️',
        color: '#E74C3C',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.40.jpeg'),
        recipeCount: 8,
        year: 2019,
        genre: ['action', 'supernatural', 'historical'],
        translations: {
            es: {
                name: 'Demon Slayer',
                description: 'Kimetsu no Yaiba - Historia de Tanjiro y su lucha contra demonios'
            },
            en: {
                name: 'Demon Slayer',
                description: 'Kimetsu no Yaiba - Story of Tanjiro and his fight against demons'
            }
        },
        tags: ['action', 'supernatural', 'emotional', 'traditional-japanese']
    },
    {
        id: 'one-piece',
        emoji: '🏴‍☠️',
        color: '#F39C12',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.42 (1).jpeg'),
        recipeCount: 12,
        year: 1999,
        genre: ['adventure', 'comedy', 'action'],
        translations: {
            es: {
                name: 'One Piece',
                description: 'Las aventuras de Luffy y su tripulación en busca del One Piece'
            },
            en: {
                name: 'One Piece',
                description: 'The adventures of Luffy and his crew in search of the One Piece'
            }
        },
        tags: ['adventure', 'comedy', 'friendship', 'pirates', 'long-running']
    },
    {
        id: 'pirates',
        emoji: '🏴‍☠️',
        color: '#F39C12',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.42 (2).jpeg'),
        recipeCount: 12,
        year: 1999,
        genre: ['adventure', 'comedy', 'action'],
        translations: {
            es: {
                name: 'One Piece',
                description: 'Las aventuras de Luffy y su tripulación en busca del One Piece'
            },
            en: {
                name: 'One Piece',
                description: 'The adventures of Luffy and his crew in search of the One Piece'
            }
        },
        tags: ['adventure', 'comedy', 'friendship', 'pirates', 'long-running']
    },
    {
        id: 'naruto',
        emoji: '🍜',
        color: '#FF9500',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.42 (3).jpeg'),
        recipeCount: 10,
        year: 2002,
        genre: ['action', 'adventure', 'coming-of-age'],
        translations: {
            es: {
                name: 'Naruto',
                description: 'La historia de Naruto Uzumaki y su camino para convertirse en Hokage'
            },
            en: {
                name: 'Naruto',
                description: 'The story of Naruto Uzumaki and his path to become Hokage'
            }
        },
        tags: ['ninja', 'ramen', 'perseverance', 'friendship', 'action']
    },
    {
        id: 'my-hero-academia',
        emoji: '🦸',
        color: '#3498DB',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.42 (4).jpeg'),
        recipeCount: 6,
        year: 2016,
        genre: ['action', 'superhero', 'school'],
        translations: {
            es: {
                name: 'My Hero Academia',
                description: 'La academia de superhéroes donde Midoriya aprende a ser el mejor'
            },
            en: {
                name: 'My Hero Academia',
                description: 'The superhero academy where Midoriya learns to be the best'
            }
        },
        tags: ['superhero', 'school', 'action', 'inspirational', 'modern']
    },
    {
        id: 'attack-on-titan',
        emoji: '🛡️',
        color: '#8E44AD',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.43.jpeg'),
        recipeCount: 7,
        year: 2013,
        genre: ['action', 'drama', 'dark-fantasy'],
        translations: {
            es: {
                name: 'Attack on Titan',
                description: 'La lucha de la humanidad contra los titanes gigantes'
            },
            en: {
                name: 'Attack on Titan',
                description: 'Humanity\'s fight against giant titans'
            }
        },
        tags: ['dark', 'intense', 'survival', 'mystery', 'military']
    },
    {
        id: 'studio-ghibli',
        emoji: '🌸',
        color: '#E91E63',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.43 (2).jpeg'),
        recipeCount: 15,
        year: 1985,
        genre: ['fantasy', 'slice-of-life', 'family'],
        translations: {
            es: {
                name: 'Studio Ghibli',
                description: 'Películas animadas mágicas y emotivas de Miyazaki'
            },
            en: {
                name: 'Studio Ghibli',
                description: 'Magical and emotional animated films by Miyazaki'
            }
        },
        tags: ['magical', 'whimsical', 'family-friendly', 'beautiful', 'emotional']
    },
    {
        id: 'dragon-ball',
        emoji: '🐉',
        color: '#FF6B35',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.40.jpeg'),
        recipeCount: 5,
        year: 1986,
        genre: ['action', 'adventure', 'comedy'],
        translations: {
            es: {
                name: 'Dragon Ball',
                description: 'Las aventuras de Goku y sus amigos en busca de las esferas del dragón'
            },
            en: {
                name: 'Dragon Ball',
                description: 'Goku and his friends\' adventures in search of the dragon balls'
            }
        },
        tags: ['martial-arts', 'power-ups', 'comedy', 'adventure', 'classic']
    },
    {
        id: 'pokemon',
        emoji: '⚡',
        color: '#F1C40F',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.42 (1).jpeg'),
        recipeCount: 8,
        year: 1997,
        genre: ['adventure', 'fantasy', 'family'],
        translations: {
            es: {
                name: 'Pokémon',
                description: 'Las aventuras de entrenadores y sus criaturas Pokémon'
            },
            en: {
                name: 'Pokémon',
                description: 'The adventures of trainers and their Pokémon creatures'
            }
        },
        tags: ['adventure', 'cute', 'family-friendly', 'collecting', 'battles']
    },
    {
        id: 'doraemon',
        emoji: '🐱',
        color: '#00BFFF',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.42 (2).jpeg'),
        recipeCount: 3,
        year: 1979,
        genre: ['comedy', 'family', 'sci-fi'],
        translations: {
            es: {
                name: 'Doraemon',
                description: 'Las aventuras del gato cósmico Doraemon y su amigo Novita'
            },
            en: {
                name: 'Doraemon',
                description: 'The adventures of the cosmic cat Doraemon and his friend Nobita'
            }
        },
        tags: ['family-friendly', 'comedy', 'sci-fi', 'friendship', 'classic']
    },
    {
        id: 'shin-chan',
        emoji: '👶',
        color: '#FF69B4',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.42 (3).jpeg'),
        recipeCount: 2,
        year: 1992,
        genre: ['comedy', 'family', 'slice-of-life'],
        translations: {
            es: {
                name: 'Shin Chan',
                description: 'Las travesuras de Shinnosuke Nohara, un niño de 5 años muy travieso'
            },
            en: {
                name: 'Shin Chan',
                description: 'The mischievous adventures of Shinnosuke Nohara, a very naughty 5-year-old boy'
            }
        },
        tags: ['family', 'comedy', 'slice-of-life', 'childhood', 'mischievous']
    },
    {
        id: 'card-captor-sakura',
        emoji: '🌸',
        color: '#FFB6C1',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.42 (4).jpeg'),
        recipeCount: 1,
        year: 1998,
        genre: ['magical-girl', 'fantasy', 'romance'],
        translations: {
            es: {
                name: 'Card Captor Sakura',
                description: 'Las aventuras mágicas de Sakura Kinomoto, cazadora de cartas'
            },
            en: {
                name: 'Card Captor Sakura',
                description: 'The magical adventures of Sakura Kinomoto, card captor'
            }
        },
        tags: ['magical-girl', 'fantasy', 'romance', 'magic', 'school', 'cute']
    },
    {
        id: 'your-name',
        emoji: '💫',
        color: '#9370DB',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.43.jpeg'),
        recipeCount: 1,
        year: 2016,
        genre: ['romance', 'fantasy', 'drama'],
        translations: {
            es: {
                name: 'Your Name',
                description: 'La historia de Taki y Mitsuha que intercambian cuerpos a través del tiempo'
            },
            en: {
                name: 'Your Name',
                description: 'The story of Taki and Mitsuha who swap bodies across time'
            }
        },
        tags: ['romance', 'fantasy', 'drama', 'time-travel', 'beautiful', 'emotional']
    },
    {
        id: 'detective-conan',
        emoji: '🕵️',
        color: '#2C3E50',
        image: require('@/assets/wallpapers/WhatsApp Image 2025-10-12 at 15.37.43 (2).jpeg'),
        recipeCount: 1,
        year: 1996,
        genre: ['mystery', 'detective', 'crime'],
        translations: {
            es: {
                name: 'Detective Conan',
                description: 'Las aventuras del detective adolescente Shinichi Kudo convertido en Conan Edogawa'
            },
            en: {
                name: 'Detective Conan',
                description: 'The adventures of teenage detective Shinichi Kudo turned into Conan Edogawa'
            }
        },
        tags: ['mystery', 'detective', 'crime', 'long-running', 'intellectual', 'suspense']
    }
];

// Completar traducciones a todos los idiomas soportados replicando EN/ES si faltan
const supportedLanguages = ['es', 'en', 'it', 'de', 'fr', 'pt', 'ja', 'hi', 'zh', 'ru', 'ko', 'ar', 'tr', 'th', 'id'];
animes.forEach((anime) => {
    const base = anime.translations['en'] || anime.translations['es'];
    supportedLanguages.forEach((lang) => {
        if (!anime.translations[lang]) {
            anime.translations[lang] = {
                name: base?.name || anime.id,
                description: base?.description
            };
        }
    });
});

// Funciones de utilidad para animes
export const getAnimeById = (id: string): Anime | undefined => {
    return animes.find(anime => anime.id === id);
};

export const getAnimeTranslation = (id: string, language: string): AnimeTranslation | undefined => {
    const anime = getAnimeById(id);
    return anime?.translations[language];
};

export const searchAnimes = (query: string, language: string = 'es'): Anime[] => {
    const lowercaseQuery = query.toLowerCase();
    return animes.filter(anime => {
        const translation = anime.translations[language];
        return translation?.name.toLowerCase().includes(lowercaseQuery) ||
            translation?.description?.toLowerCase().includes(lowercaseQuery) ||
            anime.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
            anime.genre?.some(g => g.toLowerCase().includes(lowercaseQuery));
    });
};

export const getAnimesByGenre = (genre: string): Anime[] => {
    return animes.filter(anime => anime.genre?.includes(genre));
};

export const getAnimesByYear = (year: number): Anime[] => {
    return animes.filter(anime => anime.year === year);
};
