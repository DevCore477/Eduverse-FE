import { firebaseAuth } from "@/config/firebase";
import { startHttpMetric, stopHttpMetric } from "@/utils/firebase-performance";
import { toCamel, toSnake } from "@/utils/caseConversions";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { store } from "@/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { DeviceEventEmitter } from "react-native";
import { onAuthStateChanged, getIdToken } from "firebase/auth";

const TOKEN_KEY = "auth_token";
const LAST_ACTIVITY_KEY = "last_activity";
const DEVICE_TOKEN_KEY = "deviceToken";
const SESSION_START_KEY = "session_start_time";

const SESSION_DURATION_DAYS = 30;
const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

// Token refresh configuration
const TOKEN_REFRESH_INTERVAL_MS = 50 * 60 * 1000; // Refresh every 50 minutes
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minute buffer before expiry

let onUnauthorizedCallback: (() => void) | null = null;
let isRefreshingToken = false;
let firebaseAuthInitialized = false;

// Listen for Firebase auth state
onAuthStateChanged(firebaseAuth, (user) => {
  firebaseAuthInitialized = true;
  console.log("🔥 Firebase auth state changed, user:", user ? "exists" : "null");
});
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: any) => void;
}> = [];

export const setUnauthorizedCallback = (callback: () => void) => {
    onUnauthorizedCallback = callback;
};

export const saveAuthToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const clearAuthToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const updateLastActivity = async () => {
  try {
    await AsyncStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  } catch (error) {
    console.log("Error updating last activity:", error);
  }
};

export const getLastActivity = async (): Promise<number | null> => {
  try {
    const timestamp = await AsyncStorage.getItem(LAST_ACTIVITY_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    console.log("Error getting last activity:", error);
    return null;
  }
};

export const getDeviceToken = async (): Promise<string | null> => {
  try {
    let token: string | null = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);
    if (!token) {
      // Try to get fresh token if not stored
      try {
        const Notifications = require('expo-notifications');
        const Constants = require('expo-constants');
        const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.EXPO_PROJECT_ID,
        });
        if (expoPushToken) {
          token = expoPushToken;
          if (token && token.startsWith('ExponentPushToken[')) {
            token = token.replace(/^ExponentPushToken\[|\]$/g, '');
          }
          if (token) {
            await AsyncStorage.setItem(DEVICE_TOKEN_KEY, token);
          }
        }
      } catch (e) {
        console.log("Error getting fresh device token:", e);
      }
    } else if (token.startsWith('ExponentPushToken[')) {
      token = token.replace(/^ExponentPushToken\[|\]$/g, '');
    }
    return token;
  } catch (error) {
    console.log("Error getting device token:", error);
    return null;
  }
};

export const setDeviceToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(DEVICE_TOKEN_KEY, token);
};

export const clearDeviceToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(DEVICE_TOKEN_KEY);
};

export const saveSessionStart = async (): Promise<void> => {
  await AsyncStorage.setItem(SESSION_START_KEY, Date.now().toString());
};

export const getSessionStart = async (): Promise<number | null> => {
  const timestamp = await AsyncStorage.getItem(SESSION_START_KEY);
  return timestamp ? parseInt(timestamp, 10) : null;
};

export const clearSessionStart = async (): Promise<void> => {
  await AsyncStorage.removeItem(SESSION_START_KEY);
};

export const isSessionExpired = async (): Promise<boolean> => {
  const sessionStart = await getSessionStart();
  // No session start = new install or cleared data = not expired, just need to login
  if (!sessionStart) return false;
  return (Date.now() - sessionStart) > SESSION_DURATION_MS;
};

let authReady = false;
export const setAuthReady = (ready: boolean) => {
  authReady = ready;
  console.log("🔐 Auth ready set to:", ready);
};
export const isAuthReady = () => authReady;

let tokenRefreshTimer: ReturnType<typeof setInterval> | null = null;
let tokenRefreshRunning = false;

const startTokenRefreshTimer = () => {
  stopTokenRefreshTimer();
  tokenRefreshTimer = setInterval(() => {
    console.log("⏰ Background token refresh triggered");
    refreshAndSaveToken();
  }, TOKEN_REFRESH_INTERVAL_MS);
  console.log("🔄 Token refresh timer started (every 50 min)");
};

const stopTokenRefreshTimer = () => {
  if (tokenRefreshTimer) {
    clearInterval(tokenRefreshTimer);
    tokenRefreshTimer = null;
    console.log("⏹️ Token refresh timer stopped");
  }
};

export const getTokenExpirationTime = async (): Promise<number | null> => {
  try {
    const user = firebaseAuth.currentUser;
    if (!user) return null;
    const tokenResult = await user.getIdTokenResult();
    return new Date(tokenResult.expirationTime).getTime();
  } catch (error) {
    console.log("❌ Failed to get token expiration:", error);
    return null;
  }
};

export const isTokenExpiringSoon = async (bufferMs = TOKEN_EXPIRY_BUFFER_MS): Promise<boolean> => {
  const expirationTime = await getTokenExpirationTime();
  if (!expirationTime) return true;
  return (expirationTime - Date.now()) < bufferMs;
};

export const startTokenRefreshCycle = () => {
  startTokenRefreshTimer();
};

export const stopTokenRefreshCycle = () => {
  stopTokenRefreshTimer();
};

export const refreshAndSaveToken = async () => {
  if (tokenRefreshRunning) return;
  tokenRefreshRunning = true;
  try {
    const user = firebaseAuth.currentUser;
    if (!user) {
      console.log("⚠️ No Firebase user for background token refresh");
      return;
    }
    const newToken = await user.getIdToken(true);
    await saveAuthToken(newToken);
    console.log("✅ Background token refresh succeeded");
  } catch (error) {
    console.log("❌ Background token refresh failed:", error);
  } finally {
    tokenRefreshRunning = false;
  }
};

const FORCE_LOGOUT_EVENT = 'FORCE_LOGOUT';

const handleForceLogout = async (message: string = 'Session invalidated') => {
  console.log('🚪 Force logout triggered:', message);
  
  try {
    await firebaseAuth.signOut();
  } catch (error) {
    console.error('Error signing out from Firebase:', error);
  }

  await clearAuthToken();
  await clearDeviceToken();
  
  DeviceEventEmitter.emit(FORCE_LOGOUT_EVENT, { message });
};

const INACTIVITY_DAYS = 30;
const INACTIVITY_MS = INACTIVITY_DAYS * 24 * 60 * 60 * 1000;

export const checkInactivityLogout = async (): Promise<boolean> => {
  const lastActivity = await getLastActivity();
  if (!lastActivity) {
    return false;
  }
  const now = Date.now();
  const inactiveTime = now - lastActivity;
  return inactiveTime > INACTIVITY_MS;
};

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

const getFreshToken = async (): Promise<string> => {
  const user = firebaseAuth.currentUser;
  if (user) {
    const idToken = await user.getIdToken(true);
    await saveAuthToken(idToken);
    return idToken;
  }
  throw new Error("No user found");
};

if (!Constants.expoConfig?.extra?.API_BASE_URL) {
  throw new Error("API_BASE_URL is not configured in app.config.ts");
}

const API_URL = Constants.expoConfig.extra.API_BASE_URL;

// console.log("url is ",API_URL)
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(async (config) => {
  // Wait for auth to be ready if needed (max 5 seconds)
  let retries = 0;
  while (!authReady && retries < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    retries++;
  }
  
  // Also ensure Firebase auth is initialized
  retries = 0;
  while (!firebaseAuthInitialized && retries < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    retries++;
  }
  
  console.log("🔐 Making API request, authReady:", authReady, "firebaseInit:", firebaseAuthInitialized);
  
  const user = firebaseAuth.currentUser;
  
  // Start performance tracking
  const metric = await startHttpMetric(config.url || '', config.method?.toUpperCase() || 'GET');
  (config as any)._httpMetric = metric;
  
  // Update last activity on each request
  updateLastActivity();
  
  // Add Firebase ID token
  let authToken = null;
  if (user) {
    try {
      // Check if token is expiring soon and refresh proactively
      const tokenResult = await user.getIdTokenResult();
      const expirationTime = new Date(tokenResult.expirationTime).getTime();
      const timeUntilExpiry = expirationTime - Date.now();
      
      if (timeUntilExpiry < TOKEN_EXPIRY_BUFFER_MS) {
        console.log("⚠️ Token expiring soon, refreshing proactively");
        authToken = await user.getIdToken(true);
        await saveAuthToken(authToken);
      } else {
        authToken = await user.getIdToken();
      }
      config.headers.Authorization = `Bearer ${authToken}`;
    } catch (e) {
      console.log("⚠️ Could not get Firebase token:", e);
    }
  }
  
  if (!authToken) {
    // Fallback to persisted token from AsyncStorage
    const persistedToken = await getAuthToken();
    if (persistedToken) {
      config.headers.Authorization = `Bearer ${persistedToken}`;
    } else {
      // Fallback to Redux (for backwards compatibility)
      const state = store.getState();
      const reduxToken = state.parent.parent?.token;
      if (reduxToken) {
        config.headers.Authorization = `Bearer ${reduxToken}`;
      }
    }
  }
  
  if (!config.headers.Authorization) {
    console.log("⚠️ No authorization token available for:", config.url);
  }
  
  // Add device token header
  let deviceToken = await getDeviceToken();
  if (!deviceToken) {
    // Try to get a fresh token
    try {
      const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.EXPO_PROJECT_ID,
      });
      if (expoPushToken) {
        deviceToken = expoPushToken;
        if (deviceToken.startsWith('ExponentPushToken[')) {
          deviceToken = deviceToken.replace(/^ExponentPushToken\[|\]$/g, '');
        }
        await setDeviceToken(deviceToken);
        console.log("📱 Got fresh device token for API call");
      }
    } catch (e) {
      console.log("⚠️ Could not get device token:", e);
    }
  }
  
  if (deviceToken) {
    config.headers['X-Device-Token'] = deviceToken;
    console.log("📱 Using device token:", deviceToken.substring(0, 10) + "...");
  } else {
    console.log("⚠️ No device token available!");
  }
  
  if (config.data) {
    config.data = toSnake(config.data);
  }
  if (config.params) {
    config.params = toSnake(config.params);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  async (response) => {
    const metric = (response.config as any)?._httpMetric;
    if (metric) {
      await stopHttpMetric(response?.status, response?.headers?.['content-length']);
    }
    return response;
  },
  async (error: AxiosError) => {
    const metric = (error.config as any)?._httpMetric;
    if (metric) {
      await stopHttpMetric(error.response?.status || 0);
    }
    
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    console.log("❌ API ERROR:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data,
    });

    // Handle 401 - Token refresh and retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshingToken) {
        // Queue the request while token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshingToken = true;

      try {
        console.log("🔄 Attempting to refresh token...");
        
        if (!firebaseAuth.currentUser) {
          console.log("⚠️ No Firebase user — cannot refresh token. Using persisted token if available.");
          const persistedToken = await getAuthToken();
          if (persistedToken) {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${persistedToken}`;
            }
            processQueue(null, persistedToken);
            isRefreshingToken = false;
            return axiosInstance(originalRequest);
          }
          throw new Error("No user found and no persisted token");
        }
        
        const newToken = await getFreshToken();
        
        // Update the authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        
        // Process queued requests with new token
        processQueue(null, newToken);
        isRefreshingToken = false;
        
        console.log("✅ Token refreshed successfully, retrying request");
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("❌ Token refresh failed:", refreshError);
        processQueue(refreshError, null);
        isRefreshingToken = false;
        
        // Check if it's a legitimate auth failure (not just token expiry)
        const errorMessage = (error.response?.data as any)?.error || "";
        const isAuthFailure = errorMessage.toLowerCase().includes("invalid") || 
                             errorMessage.toLowerCase().includes("expired") ||
                             errorMessage.toLowerCase().includes("unauthorized");
        
        if (isAuthFailure) {
          // Only trigger logout for genuine auth failures
          if (onUnauthorizedCallback) {
            onUnauthorizedCallback();
          }
        }
        
        return Promise.reject(error);
      }
    }
    
    // Handle 403 SESSION_INVALIDATED - Force logout
    if (error.response?.status === 403) {
      const errorData = error.response?.data as any;
      const errorCode = errorData?.errorCode || errorData?.error?.code || errorData?.details;
      
      console.log('🔍 Checking SESSION_INVALIDATED:', errorCode);
      
      if (errorCode === 'SESSION_INVALIDATED') {
        console.log('🚪 SESSION_INVALIDATED - forcing logout');
        await handleForceLogout(errorData?.message || errorData?.error || 'Session invalidated');
        if (onUnauthorizedCallback) {
          onUnauthorizedCallback();
        }
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use((response) => {
  if (response.data) {
    response.data = toCamel(response.data);
  }
  return response;
});

export const ENDPOINTS = {
  auth: {
    register: "/auth/signup",
    login: "/auth/login",
    forgetPassword: "/auth/forgot-password",
    verfiyOtp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
    resetPassword: "/auth/reset-password",
    revokeToken: "/auth/revoke-tokens",
    deleteAccount: "/auth/delete-account",
    deviceLogin: "/auth/device-login",
    devices: "/auth/devices",
    logoutDevice: "/auth/logout-device",
    logoutOtherDevices: "/auth/logout-others",
  },
  parent: {
    updateParent: "/parents/me",
    getParent: "/parents/me",
    getPupils: (id?: string) => `/pupils?parent_id=${id}`,
    switch: "/pupils/by-pin",
    dashboardData: "/parents/dashboard",
    changePassword: "/parents/change-password",
  },
  pupil: {
    createPupil: "/pupils",
    getPupil: (id: string) => `/pupils/${id}`,
    patchPupil: (id: string) => `/pupils/${id}`,
    pupilDetails: (id: string) => `/pupils/${id}/dashboard`,
  },
  academics: {
    getAll: "/academics",
  },
  pricing: {
    getPlans: "/subscriptions",
    purchasePlan: (isLogin: boolean) =>
      `/subscriptions/purchase?isLogin=${isLogin}`,
    upgradePlan: `/subscriptions/upgrade`,
    requestManualPayment: "/subscriptions/manual-payment/request"
  },
  trail: {
    startTrail: "/trials/start",
  },

  journey: {
    subjects: "/journey/subjects",
    getPupilSubjects: "/journeys/pupils/:pupil_id/subjects",
    getJourneyMapOld:
      "/journeys/pupils/:pupil_id/subjects/:subject_id/journey-map",
    getSubjectProgress:
      "/journeys/pupils/:pupil_id/subjects/:subject_id/progress",
    getLessonProgress: (pupilId: string, lessonId: string) =>
      `/journeys/pupils/${pupilId}/lessons/${lessonId}/progress`,
    getLessonCards: "/journeys/pupils/:pupil_id/lessons/:lesson_id/cards",
    getStepInfo: "/journeys/steps/:step_id",
    getQuestionByDifficulty: (lessonId: string) =>
      `/journeys/lessons/${lessonId}/questions-by-difficulty`,
    getLessonQuestionById: (pupilId: string, questionId: string) =>
      `/journeys/pupils/${pupilId}/questions/${questionId}`,
    submitAnswer: (pupilId: string, questionId: string) =>
      `/journeys/pupils/${pupilId}/questions/${questionId}/submit`,
    renewAttempts: (pupilId: string, lessonId: string) =>
      `/journeys/pupils/${pupilId}/lessons/${lessonId}/renew-attempts`,
    completeLessonStep: "/journeys/pupils/:pupil_id/steps/:step_id/complete",
    getIntegrations:
      "/journeys/pupils/:pupil_id/lessons/:lesson_id/integration-assessment",
    submitIntegrations: (pupilId: string, lessonId: string, questionId: string) => `/journeys/pupils/${pupilId}/lessons/${lessonId}/integration-assessment/${questionId}`,
    getJourneyMap: (pupilId: string, subjectId: string) => `/journeys/pupils/${pupilId}/subjects/${subjectId}/journey-map`
  },
  polly: {
    tts: "/polly/tts",
  },
  notifications: {
    register: "/notifications/register",
    getAll: (notify: "parent" | "pupil" | undefined, pupilId?: string) => `/notifications?notify=${notify}&pupilId=${pupilId}`,
    markAsRead: (id: string) => `/notifications/${id}/read`,
    test: "/notifications/test",
  },
  rating: {
    createRating: "/ratings",
  }
};
