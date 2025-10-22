import { UserProgress, UserStats } from '@/types';
import { UnitSystem } from '@/utils/unitConversion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserContextType {
  favorites: string[];
  addFavorite: (recipeId: string) => void;
  removeFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  progress: UserProgress[];
  updateProgress: (recipeId: string, completedSteps: string[], percentage: number) => void;
  getRecipeProgress: (recipeId: string) => UserProgress | undefined;
  userStats: UserStats;
  updateStats: () => void;
  clearAllData: () => Promise<void>;
  measurementUnit: UnitSystem;
  setMeasurementUnit: (unit: UnitSystem) => void;
  dietPreference: 'omnivore' | 'vegan';
  setDietPreference: (preference: 'omnivore' | 'vegan') => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    recipesStarted: 0,
    recipesCompleted: 0,
    totalProgress: 0,
    favoriteCount: 0,
  });
  const [measurementUnit, setMeasurementUnitState] = useState<UnitSystem>('metric');
  const [dietPreference, setDietPreferenceState] = useState<'omnivore' | 'vegan'>('omnivore');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [savedFavorites, savedProgress, savedStats, savedMeasurementUnit, savedDietPreference] = await Promise.all([
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('progress'),
        AsyncStorage.getItem('userStats'),
        AsyncStorage.getItem('@app_measurement_preference'),
        AsyncStorage.getItem('@app_diet_preference'),
      ]);

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
      if (savedStats) {
        setUserStats(JSON.parse(savedStats));
      }
      if (savedMeasurementUnit) {
        setMeasurementUnitState(savedMeasurementUnit as UnitSystem);
      }
      if (savedDietPreference) {
        setDietPreferenceState(savedDietPreference as 'omnivore' | 'vegan');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveFavorites = async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const saveProgress = async (newProgress: UserProgress[]) => {
    try {
      await AsyncStorage.setItem('progress', JSON.stringify(newProgress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const saveStats = async (newStats: UserStats) => {
    try {
      await AsyncStorage.setItem('userStats', JSON.stringify(newStats));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  const addFavorite = (recipeId: string) => {
    const newFavorites = [...favorites, recipeId];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const removeFavorite = (recipeId: string) => {
    const newFavorites = favorites.filter(id => id !== recipeId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const isFavorite = (recipeId: string) => {
    return favorites.includes(recipeId);
  };

  const updateProgress = (recipeId: string, completedSteps: string[], percentage: number) => {
    const existingProgressIndex = progress.findIndex(p => p.recipeId === recipeId);
    const newProgress = {
      recipeId,
      completedSteps,
      percentage,
      lastUpdated: new Date(),
    };

    let updatedProgress;
    if (existingProgressIndex >= 0) {
      updatedProgress = [...progress];
      updatedProgress[existingProgressIndex] = newProgress;
    } else {
      updatedProgress = [...progress, newProgress];
    }

    setProgress(updatedProgress);
    saveProgress(updatedProgress);
    updateStats();
  };

  const getRecipeProgress = (recipeId: string): UserProgress | undefined => {
    return progress.find(p => p.recipeId === recipeId);
  };

  const updateStats = () => {
    // Ensure progress and favorites are arrays before calculating stats
    const validProgress = Array.isArray(progress) ? progress : [];
    const validFavorites = Array.isArray(favorites) ? favorites : [];

    const stats: UserStats = {
      recipesStarted: validProgress.length,
      recipesCompleted: validProgress.filter(p => p.percentage === 100).length,
      totalProgress: validProgress.length > 0
        ? Math.round(validProgress.reduce((sum, p) => sum + p.percentage, 0) / validProgress.length)
        : 0,
      favoriteCount: validFavorites.length,
    };

    setUserStats(stats);
    saveStats(stats);
  };

  const setMeasurementUnit = async (unit: UnitSystem) => {
    try {
      await AsyncStorage.setItem('@app_measurement_preference', unit);
      setMeasurementUnitState(unit);
    } catch (error) {
      console.error('Error setting measurement unit:', error);
    }
  };

  const setDietPreference = async (preference: 'omnivore' | 'vegan') => {
    try {
      await AsyncStorage.setItem('@app_diet_preference', preference);
      setDietPreferenceState(preference);
    } catch (error) {
      console.error('Error setting diet preference:', error);
    }
  };

  const clearAllData = async () => {
    try {
      // Clear AsyncStorage completely
      await AsyncStorage.clear();

      // Reset all states to initial values
      setFavorites([]);
      setProgress([]);
      setUserStats({
        recipesStarted: 0,
        recipesCompleted: 0,
        totalProgress: 0,
        favoriteCount: 0,
      });
      setMeasurementUnitState('metric');
      setDietPreferenceState('omnivore');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      progress,
      updateProgress,
      getRecipeProgress,
      userStats,
      updateStats,
      clearAllData,
      measurementUnit,
      setMeasurementUnit,
      dietPreference,
      setDietPreference,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};