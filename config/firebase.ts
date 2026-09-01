import crashlytics from "@react-native-firebase/crashlytics";
import analytics from "@react-native-firebase/analytics";
import perf from "@react-native-firebase/perf";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Constants from "expo-constants";

const firebaseConfig = {
    apiKey: Constants.expoConfig?.extra?.FIREBASE_API_KEY,
    authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN,
    projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID,
    messagingSenderId: Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID,
    appId: Constants.expoConfig?.extra?.FIREBASE_APP_ID,
};

const app = firebase.initializeApp(firebaseConfig);
const firebaseAuth = firebase.auth(app);

export const initFirebase = () => {
    console.log("🔥 Firebase initializing...");
    crashlytics().setCrashlyticsCollectionEnabled(true);
    analytics().setAnalyticsCollectionEnabled(true);
    perf().setPerformanceCollectionEnabled(true);
    console.log("🔥 Firebase Crashlytics, Analytics & Performance initialized");
};

export { firebaseAuth };
