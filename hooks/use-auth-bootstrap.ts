import { axiosInstance, clearAuthToken, clearDeviceToken, setDeviceToken, getDeviceToken, setAuthReady, startTokenRefreshCycle, stopTokenRefreshCycle, saveAuthToken, saveSessionStart, isSessionExpired, clearSessionStart } from "@/config/api-config";
import { firebaseAuth } from "@/config/firebase";
import { TAuthResponse, TUser } from "@/types/auth";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { getFCMToken } from "@/hooks/use-push-notifications";
import { firebaseLogout } from "@/services/firebase/auth";
import { clearActivePupil } from "@/store/activePupilSlice";
import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearParent } from "@/store/parentSlice";
import { clearSubjects } from "@/store/subjectSlice";
import { safeNavigate } from "@/utils/safeNavigator";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "expo-router";
import { useOverlay } from "@/contexts/OverlayContext";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const PARENT_STORAGE_KEY = "persist:root";

export const useAuthBootstrap = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<TUser | null>(null);
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const router = useRouter();
    const persistedParent = useAppSelector((state) => state.parent.parent);
    const appStateRef = { current: null as ReturnType<typeof AppState.addEventListener> | null };

    const getParentFromStore = () => store.getState().parent.parent;
    const { showToast } = useOverlay();

    const getPersistedParentFromStorage = async (): Promise<TAuthResponse | null> => {
        try {
            const rootData = await AsyncStorage.getItem(PARENT_STORAGE_KEY);
            if (rootData) {
                const parsed = JSON.parse(rootData);
                if (parsed.parent) {
                    const parentData = JSON.parse(parsed.parent);
                    if (parentData?.parent?.user?.id) {
                        return parentData.parent;
                    }
                }
            }
        } catch (error) {
            console.log("Error reading persisted parent from storage:", error);
        }
        return null;
    };

    const clearSession = async (showToastMsg: boolean = false) => {
        setUser(null);
        await clearAuthToken();
        await clearDeviceToken();
        await clearSessionStart();
        await firebaseLogout();
        dispatch(clearParent());
        dispatch(clearActivePupil());
        dispatch(clearSubjects());
        queryClient.clear();
        queryClient.cancelQueries();
        stopTokenRefreshCycle();
        
        if (showToastMsg) {
            showToast("sessionExpired");
        }
        
        safeNavigate(router, pathname, "/(default-bg)", "replace");
    };

    const restoreUserFromStorage = async (): Promise<boolean> => {
        const parentFromStore = getParentFromStore();
        if (parentFromStore?.user?.id) {
            console.log("Restoring user from Redux persisted data");
            setUser(parentFromStore.user as TUser);
            return true;
        }
        
        const storedParent = await getPersistedParentFromStorage();
        if (storedParent?.user?.id) {
            console.log("Restoring user from AsyncStorage");
            dispatch({ type: 'parent/setParent', payload: storedParent });
            setUser(storedParent.user as TUser);
            return true;
        }
        
        return false;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
            try {
                const sessionExpired = await isSessionExpired();
                if (sessionExpired) {
                    console.log("⏰ 30-day session expired, logging out");
                    await clearSession(true);
                    return;
                }

                let storedDeviceToken = await getDeviceToken();
                if (!storedDeviceToken) {
                    try {
                        const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({
                            projectId: Constants.expoConfig?.extra?.EXPO_PROJECT_ID,
                        });
                        if (expoPushToken) {
                            let cleanToken = expoPushToken;
                            if (cleanToken.startsWith('ExponentPushToken[')) {
                                cleanToken = cleanToken.replace(/^ExponentPushToken\[|\]$/g, '');
                            }
                            await setDeviceToken(cleanToken);
                            storedDeviceToken = cleanToken;
                        }
                    } catch (tokenError) {
                        console.log("⚠️ Failed to get device token:", tokenError);
                    }
                }

                if (firebaseUser) {
                    console.log("firebase user found");
                    const idToken = await firebaseUser.getIdToken();
                    await saveAuthToken(idToken);
                    
                    try {
                        const res = await axiosInstance.post("/auth/login");
                        const userData = res.data.data.user.user as TUser;
                        setUser(userData);
                    } catch (apiError) {
                        console.log("Backend sync failed, restoring from local storage");
                        await restoreUserFromStorage();
                    }
                    
                    startTokenRefreshCycle();
                } else {
                    console.log("firebase user not found — checking local session");
                    
                    const restored = await restoreUserFromStorage();
                    if (!restored) {
                        console.log("No persisted user found, clearing data");
                        await clearSession(false);
                    }
                }
            } catch (err: any) {
                console.log("Error during auth bootstrap:", err);
                const is401Error = err?.response?.status === 401;
                
                const restored = await restoreUserFromStorage();
                if (!restored) {
                    await clearSession(is401Error);
                }
            } finally {
                setLoading(false);
                setAuthReady(true);
                console.log("✅ Auth ready");
            }
        });

        return () => {
            unsubscribe();
            stopTokenRefreshCycle();
            appStateRef.current?.remove();
        };
    }, []);

    useEffect(() => {
        const handleAppResume = async (nextState: AppStateStatus) => {
            if (nextState !== 'active') return;
            
            console.log('📱 App resumed from background');
            
            try {
                const sessionExpired = await isSessionExpired();
                if (sessionExpired) {
                    console.log("⏰ 30-day session expired on resume");
                    await clearSession(true);
                    return;
                }
                
                startTokenRefreshCycle();
            } catch (error) {
                console.log('⚠️ Session check failed on resume:', error);
            }
        };
        
        appStateRef.current = AppState.addEventListener('change', handleAppResume);
        
        return () => {
            appStateRef.current?.remove();
        };
    }, []);

    return { user, loading };
};
