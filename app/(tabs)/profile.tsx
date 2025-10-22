import { spacing } from '@/constants/themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { StorageService } from '@/utils/storage';
import { UnitSystem } from '@/utils/unitConversion';
import { useRouter } from 'expo-router';
import { ChevronRight, Globe, CircleHelp as HelpCircle, Moon, Ruler, Settings, Share2, Shield, Sun, Trash2, Utensils } from 'lucide-react-native';
import React from 'react';
import { Alert, Modal, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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

export default function ProfileScreen() {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const { language, setLanguage, t, getLanguageInfo } = useLanguage();
  const { userStats, clearAllData, measurementUnit, setMeasurementUnit, dietPreference, setDietPreference } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showLanguageModal, setShowLanguageModal] = React.useState(false);

  const handleThemeChange = () => {
    const modes: ('light' | 'dark' | 'auto')[] = ['light', 'dark', 'auto'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode as any);
    setShowLanguageModal(false);
  };

  const handleMeasurementUnitChange = () => {
    const newUnit: UnitSystem = measurementUnit === 'metric' ? 'imperial' : 'metric';
    setMeasurementUnit(newUnit);
  };

  const handleDietPreferenceChange = () => {
    const newPreference: 'omnivore' | 'vegan' = dietPreference === 'omnivore' ? 'vegan' : 'omnivore';
    setDietPreference(newPreference);
  };

  const handleShare = async () => {
    try {
      const appLink = 'https://play.google.com/store/apps/details?id=com.bydark.animefoodrecipe';
      const shareText = `${t('shareMessage').replace('{count}', userStats.recipesCompleted.toString())} - ${t('shareTitle')}`;
      const shareTextWithLink = `${shareText}\n\n${appLink}`;
      if (Platform.OS === 'web') {

        // Web Share API si está disponible
        if (typeof navigator !== 'undefined' && (navigator as any).share) {
          try {
            await (navigator as any).share({
              title: t('shareTitle'),
              text: shareTextWithLink,
              url: appLink,
            });
            return;
          } catch {
            // continúa con el fallback
          }
        }

        // Intentar copiar el enlace de la app
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(shareTextWithLink);
            Alert.alert(t('success'), t('linkCopied'));
          } else {
            // Fallback: mostrar el enlace para copiar manualmente
            Alert.alert(t('shareTitle'), `${t('copyLinkBelow')}\n\n${shareTextWithLink}`);
          }
        } catch {
          // Si el portapapeles falla, mostrar el enlace
          Alert.alert(t('shareTitle'), `${t('copyLinkBelow')}\n\n${shareTextWithLink}`);
        }
      } else {
        // Plataformas nativas
        const message = shareTextWithLink;
        await Share.share({
          message,
          url: appLink,
          title: t('shareTitle'),
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleHelp = () => {
    Alert.alert(
      t('helpSupportTitle'),
      t('helpContent'),
      [{ text: t('gotIt'), style: 'default' }]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      t('privacyPolicyTitle'),
      t('privacyContent'),
      [{ text: t('understood'), style: 'default' }]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      t('clearDataTitle'),
      t('clearDataMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('clearData'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Borrar todos los datos de AsyncStorage
              await StorageService.clearAllData();
              // Borrar datos del contexto de usuario
              await clearAllData();
              // Redirigir a la pantalla inicial para volver a configurar
              router.replace('/');
            } catch (error) {
              Alert.alert(t('error'), t('errorClearingData'));
            }
          }
        }
      ]
    );
  };

  const currentLanguageInfo = getLanguageInfo(language);

  const getThemeIcon = () => {
    if (themeMode === 'light') return <Sun size={20} color={theme.text} />;
    if (themeMode === 'dark') return <Moon size={20} color={theme.text} />;
    return <Settings size={20} color={theme.text} />;
  };

  const getAchievementLevel = () => {
    const completed = userStats.recipesCompleted;
    if (completed >= 50) return { level: 'Master Chef', icon: '👨‍🍳', color: '#FFD700' };
    if (completed >= 25) return { level: 'Expert Cook', icon: '⭐', color: '#FF6B6B' };
    if (completed >= 10) return { level: 'Home Cook', icon: '🍳', color: '#4ECDC4' };
    if (completed >= 5) return { level: 'Apprentice', icon: '📚', color: '#45B7D1' };
    return { level: 'Beginner', icon: '🌱', color: '#96CEB4' };
  };

  const achievement = getAchievementLevel();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: insets.top,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
      backgroundColor: theme.background,
      alignItems: 'center',
    },
    profileAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: spacing.xs,
      letterSpacing: -0.5,
    },
    achievementBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: achievement.color + '20',
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: spacing.xs + 2,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: achievement.color + '40',
    },
    achievementText: {
      fontSize: 12,
      fontWeight: '600',
      color: achievement.color,
      marginLeft: spacing.xs,
    },
    section: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: spacing.md,
      letterSpacing: -0.3,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
      gap: spacing.xs,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.sm,
      backgroundColor: theme.cardBackground,
      borderRadius: 16,
      paddingHorizontal: spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    statIcon: {
      marginBottom: spacing.xs,
    },
    statNumber: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: spacing.xs,
      letterSpacing: -0.5,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
      fontWeight: '500',
    },
    progressContainer: {
      backgroundColor: theme.cardBackground,
      borderRadius: 16,
      padding: spacing.lg,
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.border,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    progressPercentage: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.primary,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 4,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDark ? 'rgba(15, 15, 35, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: 16,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(30, 144, 255, 0.3)' : 'rgba(255, 153, 0, 0.3)',
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingText: {
      fontSize: 16,
      color: theme.text,
      marginLeft: spacing.sm,
      fontWeight: '500',
    },
    settingValue: {
      fontSize: 14,
      color: theme.textSecondary,
      textTransform: 'capitalize',
      fontWeight: '500',
      marginRight: spacing.xs,
    },
    dangerItem: {
      borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(220, 38, 38, 0.2)',
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)',
    },
    dangerText: {
      color: isDark ? '#fca5a5' : '#dc2626',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
    },
    modalContainer: {
      backgroundColor: isDark ? 'rgba(15, 15, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 24,
      padding: spacing.lg,
      width: '85%',
      maxHeight: '70%',
      shadowColor: isDark ? '#1e90ff' : '#ff9900',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.7 : 0.3,
      shadowRadius: 16,
      elevation: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(30, 144, 255, 0.4)' : 'rgba(255, 153, 0, 0.3)',
      backdropFilter: 'blur(30px)',
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: spacing.lg,
      letterSpacing: -0.3,
    },
    languageModalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      borderRadius: 12,
      marginBottom: spacing.xs,
    },
    activeLanguageModalOption: {
      backgroundColor: isDark ? 'rgba(159, 122, 234, 0.3)' : 'rgba(49, 130, 206, 0.2)',
      borderWidth: 1,
      borderColor: isDark ? '#9F7AEA' : '#3182CE',
      backdropFilter: 'blur(10px)',
    },
    languageFlag: {
      fontSize: 24,
      marginRight: spacing.sm,
    },
    languageModalText: {
      fontSize: 16,
      color: theme.text,
      flex: 1,
      fontWeight: '500',
    },
    activeLanguageModalText: {
      color: isDark ? '#1e90ff' : '#ff9900',
      fontWeight: '600',
    },
    closeModalButton: {
      backgroundColor: isDark ? '#1e90ff' : '#ff9900',
      borderRadius: 12,
      paddingVertical: spacing.sm,
      marginTop: spacing.md,
    },
    closeModalText: {
      color: '#FFFFFF',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <View style={styles.profileAvatar}>
          {Platform.OS === 'web' ? (
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  backgroundImage: isDark
                    ? 'linear-gradient(135deg, #4A90E2 0%, #2E5BBA 100%)'
                    : 'linear-gradient(135deg, #FFB347 0%, #FF8C00 100%)'
                }
              ]}
            />
          ) : (
            <LinearGradient
              colors={isDark ? ['#4A90E2', '#2E5BBA'] : ['#FFB347', '#FF8C00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          <User size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.profileName}>Anime Chef</Text>
        <Text style={styles.profileName}>{t('animeChef')}</Text>
        <View style={styles.achievementBadge}>
          <Text style={{ fontSize: 16 }}>{achievement.icon}</Text>
          <Text style={styles.achievementText}>{t(achievement.level.toLowerCase().replace(' ', ''))}</Text>
        </View>
      </View> */}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('preferences')}</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleThemeChange}>
            <View style={styles.settingLeft}>
              {getThemeIcon()}
              <Text style={styles.settingText}>{t('theme')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.settingValue}>{t(themeMode)}</Text>
              <ChevronRight size={20} color={theme.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => setShowLanguageModal(true)}>
            <View style={styles.settingLeft}>
              <Globe size={20} color={theme.text} />
              <Text style={styles.settingText}>{t('language')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.settingValue}>{currentLanguageInfo.flag} {currentLanguageInfo.name}</Text>
              <ChevronRight size={20} color={theme.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleMeasurementUnitChange}>
            <View style={styles.settingLeft}>
              <Ruler size={20} color={theme.text} />
              <Text style={styles.settingText}>{t('measurementSystem')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.settingValue}>{t(measurementUnit)}</Text>
              <ChevronRight size={20} color={theme.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleDietPreferenceChange}>
            <View style={styles.settingLeft}>
              <Utensils size={20} color={theme.text} />
              <Text style={styles.settingText}>{t('dietPreference')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.settingValue}>{t(dietPreference)}</Text>
              <ChevronRight size={20} color={theme.textSecondary} />
            </View>
          </TouchableOpacity>

        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('toolsSupport')}</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleShare}>
            <View style={styles.settingLeft}>
              <Share2 size={20} color={theme.text} />
              <Text style={styles.settingText}>{t('shareApp')}</Text>
            </View>
            <ChevronRight size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleHelp}>
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color={theme.text} />
              <Text style={styles.settingText}>{t('helpSupport')}</Text>
            </View>
            <ChevronRight size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handlePrivacy}>
            <View style={styles.settingLeft}>
              <Shield size={20} color={theme.text} />
              <Text style={styles.settingText}>{t('privacyPolicy')}</Text>
            </View>
            <ChevronRight size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dataManagement')}</Text>

          <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleClearData}>
            <View style={styles.settingLeft}>
              <Trash2 size={20} color={isDark ? '#fca5a5' : '#dc2626'} />
              <Text style={[styles.settingText, styles.dangerText]}>{t('clearAllData')}</Text>
            </View>
            <ChevronRight size={20} color={isDark ? '#fca5a5' : '#dc2626'} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: spacing.lg }}
            >
              {languageOptions.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageModalOption,
                    language === lang.code && styles.activeLanguageModalOption
                  ]}
                  onPress={() => handleLanguageSelect(lang.code)}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[
                    styles.languageModalText,
                    language === lang.code && styles.activeLanguageModalText
                  ]}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.closeModalText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}