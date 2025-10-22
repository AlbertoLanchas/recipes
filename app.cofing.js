export default {
  expo: {
    name: "Anime Food Recipes",
    slug: "animefoodrecipe",
    version: "1.1.0",
    orientation: "portrait",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#EDE7D4"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.bydark.animefoodrecipe"
    },
    android: {
      package: "com.bydark.animefoodrecipe",
      versionCode: 1
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/images/icon.png"
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-web-browser",
      "expo-localization"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "c548ccb0-d4c8-4d82-8936-2a34f8645ea6"
      }
    },
    owner: "bydark"
  }
}