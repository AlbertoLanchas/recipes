import { spacing } from '@/constants/themes';
import { useTheme } from '@/contexts/ThemeContext';
import { Grid3X3, List as LayoutList } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ViewToggleProps {
  viewMode: 'single' | 'grid';
  onViewModeChange: (mode: 'single' | 'grid') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  const { theme, isDark } = useTheme();

  const styles = StyleSheet.create({
    viewToggle: {
      flexDirection: 'row',
      backgroundColor: isDark ? 'rgba(15, 15, 35, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: 12,
      padding: spacing.xs,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(30, 144, 255, 0.3)' : 'rgba(255, 153, 0, 0.3)',
    },
    viewButton: {
      padding: spacing.sm,
      borderRadius: 8,
    },
    activeViewButton: {
      backgroundColor: isDark ? '#1e90ff' : '#ff9900',
    },
  });

  return (
    <View style={styles.viewToggle}>
      <TouchableOpacity
        style={[styles.viewButton, viewMode === 'single' && styles.activeViewButton]}
        onPress={() => onViewModeChange('single')}
      >
        <LayoutList
          size={20}
          color={viewMode === 'single' ? '#FFFFFF' : theme.text}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.viewButton, viewMode === 'grid' && styles.activeViewButton]}
        onPress={() => onViewModeChange('grid')}
      >
        <Grid3X3
          size={20}
          color={viewMode === 'grid' ? '#FFFFFF' : theme.text}
        />
      </TouchableOpacity>
    </View>
  );
};