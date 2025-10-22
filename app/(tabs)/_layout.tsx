import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { Heart, Home as HomeIcon, Play, User } from 'lucide-react-native';
import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
  const shortestSide = Math.min(width, height);
  const computedIconSize = Math.round(clamp(shortestSide * 0.055, 20, 28));
  const computedLabelFontSize = Math.round(clamp(shortestSide * 0.028, 10, 12));
  const contentHeight = clamp(computedIconSize + computedLabelFontSize + 16, 48, 64);
  const topPadding = 8;
  const barHeight = (insets.bottom > 0 ? insets.bottom : 0) + topPadding + contentHeight;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => (
          <LinearGradient
            colors={
              isDark
                ? ['#000000', '#0a0a0a', '#0b0f19'] // opaco para evitar ver el contenido bajo la barra
                : ['#ffffff', '#f8fafc', '#fdf6f0'] // opaco para evitar ver el contenido bajo la barra
            }
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        ),
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: theme.border + '10',
          borderTopWidth: Platform.OS === 'ios' ? 0.2 : 0.3,
          height: barHeight + 10,
          paddingTop: 10,
          position: 'absolute',
          shadowColor: 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
          ...Platform.select({
            ios: {
              shadowColor: theme.text,
              shadowOffset: { width: 0, height: -0.5 },
              shadowOpacity: 0.02,
              shadowRadius: 4,
            },
          }),
        },
        tabBarActiveTintColor: isDark ? '#1e90ff' : '#ff9900',
        tabBarInactiveTintColor: isDark ? '#555' : '#888',
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {
          fontSize: computedLabelFontSize,
          fontWeight: '600',
          marginTop: 2,
          marginBottom: 0,
          letterSpacing: -0.2,
        },
        tabBarIconStyle: { marginTop: 0, marginBottom: 0, justifyContent: 'center', alignItems: 'center' },
        tabBarItemStyle: { height: contentHeight, paddingVertical: 0, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center' },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('home'),
          tabBarAccessibilityLabel: t('home'),
          tabBarIcon: ({ color }) => <HomeIcon size={computedIconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="anime"
        options={{
          title: t('anime'),
          tabBarAccessibilityLabel: t('anime'),
          tabBarIcon: ({ color }) => <Play size={computedIconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('favorites'),
          tabBarAccessibilityLabel: t('favorites'),
          tabBarIcon: ({ color }) => <Heart size={computedIconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarAccessibilityLabel: t('profile'),
          tabBarIcon: ({ color }) => <User size={computedIconSize} color={color} />,
        }}
      />
    </Tabs>
  );
}
