import { spacing } from '@/constants/themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { StorageService } from '@/utils/storage';
import { BlurView } from 'expo-blur';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const languageOptions = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
];

const { width, height } = Dimensions.get('window');

export default function IndexScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { language, setLanguage, t, getLanguageInfo } = useLanguage();
  const [showLanguageOptions, setShowLanguageOptions] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);

  // Animaciones - Solo para el texto y los botones
  const contentOpacity = React.useRef(new Animated.Value(0)).current;
  const contentTranslateY = React.useRef(new Animated.Value(50)).current;
  const buttonScale = React.useRef(new Animated.Value(1)).current;
  const languageButtonScale = React.useRef(new Animated.Value(1)).current;

  // Verificar si ya se completó el onboarding
  React.useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const isFirstTime = await StorageService.isFirstTime();

      if (!isFirstTime) {
        // Si ya no es la primera vez, ir directamente al home
        router.replace('/home');
      } else {
        // Es la primera vez, mostrar la animación
        setIsChecking(false);
        startAnimations();
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // En caso de error, asumir que es primera vez
      setIsChecking(false);
      startAnimations();
    }
  };

  const startAnimations = () => {
    // Fase única: Mostrar el contenido (Texto y Botones)
    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 1, duration: 1200, useNativeDriver: true, delay: 500 }),
      Animated.timing(contentTranslateY, { toValue: 0, duration: 1200, useNativeDriver: true, delay: 500 }),
    ]).start();
  };

  // 🎯 Navegación al ONBOARDING
  const handleGetStarted = () => {
    setTimeout(() => {
      router.replace('/onboarding');
    }, 100);
  };

  const toggleLanguage = () => {
    setShowLanguageOptions(!showLanguageOptions);
  };

  const selectLanguage = (lang: any) => {
    setLanguage(lang);
    setShowLanguageOptions(false);
  };

  const animateButtonPress = (scaleValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const currentLanguageInfo = getLanguageInfo(language);

  const styles = StyleSheet.create({
    container: { flex: 1, position: 'relative' },
    backgroundImage: { flex: 1, width: '100%', height: '100%' },
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'rgba(26, 32, 56, 0.4)' },
    contentContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      paddingHorizontal: 40,
    },
    buttonsContainer: { position: 'absolute', bottom: height * 0.15, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 40 },
    welcomeText: { fontSize: 24, color: '#FFFFFF', textAlign: 'center', marginBottom: spacing.lg, textShadowColor: 'rgba(0, 0, 0, 0.8)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3, fontWeight: '600', letterSpacing: -0.5 },
    title: { fontSize: 40, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: spacing.md, textShadowColor: 'rgba(0, 0, 0, 0.8)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3, letterSpacing: -1.2 },
    subtitle: { fontSize: 20, color: '#FFFFFF', textAlign: 'center', marginBottom: spacing.xxl * 2, lineHeight: 28, textShadowColor: 'rgba(0, 0, 0, 0.8)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3, fontWeight: '500', letterSpacing: -0.3 },
    startButtonWrapper: { borderRadius: 32, marginBottom: spacing.xl, overflow: 'hidden', width: '100%', maxWidth: 320, alignSelf: 'center' },
    startButton: { paddingHorizontal: spacing.xxl + 12, paddingVertical: spacing.lg, alignItems: 'center', justifyContent: 'center' },
    startButtonText: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: -0.5, textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
    languageButtonWrapper: { width: '100%', maxWidth: 320, alignItems: 'center', alignSelf: 'center' },
    languageContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    languageButton: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      backgroundColor: isDark ? 'rgba(30, 144, 255, 0.15)' : 'rgba(255, 153, 0, 0.1)',
      paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: 24, borderWidth: 1,
      borderColor: isDark ? 'rgba(30, 144, 255, 0.3)' : 'rgba(255, 153, 0, 0.2)',
      // @ts-ignore
      backdropFilter: 'blur(20px)', minWidth: 240,
    },
    languageButtonText: { fontSize: 19, color: '#FFFFFF', fontWeight: '600', marginLeft: spacing.sm, marginRight: spacing.xs, letterSpacing: -0.3, textAlign: 'center' },
    languageOptions: {
      backgroundColor: isDark ? 'rgba(15, 15, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 20, paddingVertical: spacing.sm + 4, width: 280, maxHeight: 450,
      shadowColor: isDark ? '#9F7AEA' : '#3182CE', shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.6 : 0.2, shadowRadius: 16, elevation: 12, borderWidth: 1,
      borderColor: isDark ? 'rgba(159, 122, 234, 0.4)' : 'rgba(49, 130, 206, 0.3)',
      // @ts-ignore
      backdropFilter: 'blur(30px)',
    },
    languageOption: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
    languageOptionText: { fontSize: 18, color: isDark ? '#FFF' : '#000', marginLeft: spacing.sm + 4, flex: 1, fontWeight: '500', textAlign: 'left' },
    languageFlag: { fontSize: 24 },
    activeLanguageOption: {
      backgroundColor: isDark ? 'rgba(74, 144, 226, 0.3)' : 'rgba(255, 179, 71, 0.2)',
      borderRadius: 12, marginHorizontal: spacing.sm, borderWidth: 1, borderColor: isDark ? '#4A90E2' : '#FFB347',
    },
  });

  // No mostrar nada mientras se verifica el estado
  if (isChecking) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/background.png')}
        style={styles.backgroundImage}
      >


        <BlurView intensity={40} tint="dark" style={styles.overlay}>

          {/* Contenido animado (Texto y Botones) */}
          <Animated.View
            style={[styles.contentContainer, { opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }]}
          >


            <Animated.View style={[styles.startButtonWrapper, { transform: [{ scale: buttonScale }] }]}>
              <TouchableOpacity
                onPress={() => { animateButtonPress(buttonScale); handleGetStarted(); }}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={isDark ? ['#4A90E2', '#2E5BBA'] : ['#FFB347', '#FF8C00']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.startButton}
                >
                  <Text style={styles.startButtonText}>{t('getStarted')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.languageButtonWrapper, { transform: [{ scale: languageButtonScale }] }]}>
              <TouchableOpacity
                style={styles.languageButton}
                onPress={() => { animateButtonPress(languageButtonScale); toggleLanguage(); }}
                activeOpacity={0.8}
              >
                <Text style={styles.languageFlag}>{currentLanguageInfo.flag}</Text>
                <Text style={styles.languageButtonText}>{currentLanguageInfo.name}</Text>
                <ChevronDown size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </BlurView>

        {/* Opciones de idioma (Modal) */}
        {showLanguageOptions && (
          <View style={styles.languageContainer}>
            <ScrollView style={styles.languageOptions} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.lg }}>
              {languageOptions.map((option) => (
                <TouchableOpacity
                  key={option.code}
                  style={[styles.languageOption, language === option.code && styles.activeLanguageOption]}
                  onPress={() => selectLanguage(option.code)}
                >
                  <Text style={styles.languageFlag}>{option.flag}</Text>
                  <Text style={styles.languageOptionText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ImageBackground>
    </View>
  );
}