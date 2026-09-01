import { ConfigContext, ExpoConfig } from "@expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig =>
  ({
    ...config,
    name: "nedjmati-app",
    slug: "nedjmati-app",
    version: "1.1.2",
    orientation: "portrait",
    scheme: "nedjmatiapp", // This creates the custom scheme automatically
    userInterfaceStyle: "automatic",
    icon: "./assets/images/NedjmatiSplashLogo.png",

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.nedjmati.nedjmatiapp",
    },

    android: {
      // Remove the spread to avoid overwriting intentFilters
      // ...config.android,
      versionCode: 16,
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
      },
      predictiveBackGestureEnabled: false,
      package: "com.nedjmati.nedjmatiapp",

      // BOTH intent filters - custom scheme AND https
      intentFilters: [
        {
          // Custom scheme filter (nedjmatiapp://)
          action: "VIEW",
          data: [{ scheme: "nedjmatiapp" }],
          category: ["BROWSABLE", "DEFAULT"],
        },
        {
          // HTTPS App Links filter (https://api.nedjmati.com/create-password)
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "api.nedjmati.com",
              pathPrefix: "/create-password",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
        {
          // Payment success callback
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "api.nedjmati.com",
              pathPrefix: "/subscriptions",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],

      // Do not declare READ_MEDIA_* / READ_EXTERNAL_STORAGE for infrequent image pick —
      // Google Play requires the Android Photo Picker path without broad media permissions.
      permissions: ["CAMERA", "NOTIFICATIONS"],
      blockedPermissions: [
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
      ],
    },

    web: {
      output: "static",
    },

    plugins: [
      "expo-notifications",
      "expo-asset",
      "expo-audio",
      "expo-font",
      [
        "expo-image-picker",
        {
          photosPermission:
            "Allow Nedjmati to access your photos when you choose a profile or payment image.",
          cameraPermission:
            "Allow Nedjmati to use the camera when you take a photo for your profile or payment details.",
          microphonePermission: false,
        },
      ],
      "expo-image",
      "expo-localization",
      "expo-secure-store",
      "expo-sharing",
      "expo-web-browser",
      "expo-router",
      "@react-native-firebase/app",
      "@react-native-firebase/messaging",
      ["@react-native-firebase/crashlytics", { "appDebug": false }],
      [
        "expo-splash-screen",
        {
          backgroundColor: "#fff",
          image: "./assets/images/NedjmatiSplashLogo.png",
          dark: {
            image: "./assets/images/NedjmatiSplashLogo.png",
            backgroundColor: "#262626",
          },
          imageWidth: 240,
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      router: {},
      eas: {
        projectId: "e206428a-297b-4631-89ea-551e68dc5dd3",
      },
      API_BASE_URL:
        process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:5000",
      FIREBASE_API_KEY:
        process.env.FIREBASE_API_KEY ??
        "AIzaSyDd39L7Scd5kzMNAD64EGOvsQe1Mmt7aa4",
      FIREBASE_AUTH_DOMAIN:
        process.env.FIREBASE_AUTH_DOMAIN ?? "googleapis.com",
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? "nedjmati-d53b9",
      FIREBASE_APP_ID:
        process.env.FIREBASE_APP_ID ??
        "1:754959603248:android:eb36a806f9fc63d8c8bff5",
      FIREBASE_MESSAGING_SENDER_ID:
        process.env.FIREBASE_MESSAGING_SENDER_ID ?? "754959603248",
    },
  }) as ExpoConfig;
