import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  LANGUAGE: '@app_language',
  FIRST_TIME: '@app_first_time',
  MEASUREMENT_PREFERENCE: '@app_measurement_preference',
  DIET_PREFERENCE: '@app_diet_preference',
};

export interface OnboardingPreferences {
  language: string;
  measurementPreference: string;
  dietPreference: string;
}

export const StorageService = {
  async getLanguage(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.LANGUAGE);
    } catch (error) {
      console.error('Error getting language:', error);
      return null;
    }
  },

  async setLanguage(language: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LANGUAGE, language);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  },

  async isFirstTime(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(KEYS.FIRST_TIME);
      return value === null;
    } catch (error) {
      console.error('Error checking first time:', error);
      return true;
    }
  },

  async setNotFirstTime(): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.FIRST_TIME, 'false');
    } catch (error) {
      console.error('Error setting first time:', error);
    }
  },

  async getMeasurementPreference(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.MEASUREMENT_PREFERENCE);
    } catch (error) {
      console.error('Error getting measurement preference:', error);
      return null;
    }
  },

  async setMeasurementPreference(preference: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.MEASUREMENT_PREFERENCE, preference);
    } catch (error) {
      console.error('Error setting measurement preference:', error);
    }
  },

  async getDietPreference(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.DIET_PREFERENCE);
    } catch (error) {
      console.error('Error getting diet preference:', error);
      return null;
    }
  },

  async setDietPreference(preference: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.DIET_PREFERENCE, preference);
    } catch (error) {
      console.error('Error setting diet preference:', error);
    }
  },

  async saveOnboardingPreferences(preferences: OnboardingPreferences): Promise<void> {
    try {
      await Promise.all([
        this.setLanguage(preferences.language),
        this.setMeasurementPreference(preferences.measurementPreference),
        this.setDietPreference(preferences.dietPreference),
        this.setNotFirstTime(),
      ]);
    } catch (error) {
      console.error('Error saving onboarding preferences:', error);
    }
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
};
