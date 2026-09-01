import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { firebaseAuth } from '@/config/firebase';
import {
    signInWithEmailAndPassword,
    User,
    IdTokenResult,
} from 'firebase/auth';
import { axiosInstance, ENDPOINTS, getDeviceToken, setDeviceToken, clearDeviceToken } from '@/config/api-config';
import {
    DeviceInfo,
    DeviceSession,
    DeviceLoginResponse,
    ActiveDevicesResponse,
    DeviceLoginRequest,
    AuthTokens,
    SessionData,
    AuthError,
    AuthErrorCodes,
    DeviceLimitType,
} from '@/types/device';

const AUTH_TOKENS_KEY = 'authTokens';
const SESSION_DATA_KEY = 'sessionData';

const FORCE_LOGOUT_EVENT = 'FORCE_LOGOUT';

type TokenRefreshListener = () => void;
type MessageListener = (message: any) => void;
type NotificationOpenListener = (message: any) => void;

class AuthServiceClass {
    private deviceToken: string | null = null;
    private idToken: string | null = null;

    async initializeDeviceToken(): Promise<string> {
        try {
            const hasPermission = await this.requestPermission();
            if (!hasPermission) {
                throw new Error('Notification permission denied');
            }

            const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.EXPO_PROJECT_ID,
            });
            
            // Store via api-config functions
            await setDeviceToken(expoPushToken);

            return expoPushToken;
        } catch (error) {
            console.error('❌ Error initializing device token:', error);
            throw error;
        }
    }

    private async requestPermission(): Promise<boolean> {
        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted';
    }

    async getStoredDeviceToken(): Promise<string | null> {
        return await getDeviceToken();
    }

    async login(
        email: string,
        password: string
    ): Promise<{ user: User; session: SessionData }> {
        try {
            await this.ensureDeviceToken();

            const firebaseUser = await signInWithEmailAndPassword(
                firebaseAuth,
                email,
                password
            );

            this.idToken = await firebaseUser.user.getIdToken(true);

            const deviceInfo = await this.getDeviceInfo();

            const deviceLoginData: DeviceLoginRequest = {
                firebaseUid: firebaseUser.user.uid,
                deviceToken: this.deviceToken!,
                deviceInfo,
            };

            const response = await axiosInstance.post<{
                data: DeviceLoginResponse;
            }>(ENDPOINTS.auth.deviceLogin, deviceLoginData);

            const loginResponse = response.data.data;

            const tokens: AuthTokens = {
                idToken: this.idToken,
                deviceToken: this.deviceToken!,
            };
            await AsyncStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens));

            const sessionData: SessionData = {
                userId: loginResponse.user.id,
                sessionId: loginResponse.sessionId,
                maxDevices: loginResponse.maxDevices || loginResponse.subscription?.plan.maxDevices || 1,
                planType: loginResponse.maxDevices <= 1 ? 'basic' : 'family',
            };
            await AsyncStorage.setItem(
                SESSION_DATA_KEY,
                JSON.stringify(sessionData)
            );

            return {
                user: firebaseUser.user,
                session: sessionData,
            };
        } catch (error: any) {
            console.error('❌ Login error:', error);
            
            if (error.response?.status === 403) {
                const errorData = error.response?.data;
                if (errorData?.error?.code === 'DEVICE_LIMIT_EXCEEDED') {
                    const authError: AuthError = {
                        code: AuthErrorCodes.DEVICE_LIMIT_EXCEEDED,
                        message: errorData.error.message || 'Device limit exceeded',
                        maxDevices: errorData.error.maxDevices,
                        currentDevices: errorData.error.currentDevices,
                    };
                    await firebaseAuth.signOut();
                    throw authError;
                }
            }

            throw error;
        }
    }

    private async ensureDeviceToken(): Promise<string> {
        if (!this.deviceToken) {
            this.deviceToken = await this.initializeDeviceToken();
        }
        return this.deviceToken;
    }

    async authenticatedRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        try {
            await this.ensureDeviceToken();
            
            const user = firebaseAuth.currentUser;
            if (user) {
                this.idToken = await user.getIdToken();
            }

            const headers: Record<string, string> = {
                ...(options.headers as Record<string, string>),
                'Content-Type': 'application/json',
            };

            if (this.idToken) {
                headers['Authorization'] = `Bearer ${this.idToken}`;
            }

            if (this.deviceToken) {
                headers['X-Device-Token'] = this.deviceToken;
            }

            const response = await fetch(`${endpoint}`, {
                ...options,
                headers,
            });

            if (response.status === 403) {
                const errorData = await response.json();
                if (errorData?.error?.code === 'SESSION_INVALIDATED') {
                    await this.handleForceLogout(
                        errorData.error.message || 'Session invalidated'
                    );
                }
            }

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            return response.json();
        } catch (error: any) {
            if (error.response?.status === 403) {
                const errorData = error.response?.data;
                if (errorData?.error?.code === 'SESSION_INVALIDATED') {
                    await this.handleForceLogout(
                        errorData.error.message || 'Session invalidated'
                    );
                }
            }
            throw error;
        }
    }

    async handleForceLogout(message: string = 'Session invalidated'): Promise<void> {
        console.log('🚪 Force logout triggered:', message);
        
        try {
            await firebaseAuth.signOut();
        } catch (error) {
            console.error('Error signing out from Firebase:', error);
        }

        await this.clearStorage();

        DeviceEventEmitter.emit(FORCE_LOGOUT_EVENT, { message });
    }

    private async clearStorage(): Promise<void> {
        try {
            await clearDeviceToken();
            await AsyncStorage.multiRemove([
                AUTH_TOKENS_KEY,
                SESSION_DATA_KEY,
            ]);
            this.deviceToken = null;
            this.idToken = null;
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }

    async getDeviceInfo(): Promise<DeviceInfo> {
        const deviceName = Platform.OS === 'ios' 
            ? `${Platform.OS} Device` 
            : `${Platform.OS} Device`;
        
        return {
            name: deviceName,
            type: Platform.OS === 'ios' ? 'ios' : 'android',
            model: Platform.OS === 'ios' ? 'iPhone' : 'Android',
            brand: 'Nedjmati',
            systemVersion: Platform.Version?.toString() || '1.0.0',
            appVersion: '1.0.0',
        };
    }

    async getActiveDevices(): Promise<ActiveDevicesResponse> {
        try {
            const response = await axiosInstance.get<{
                data: ActiveDevicesResponse;
            }>(ENDPOINTS.auth.devices, {
                headers: await this.getAuthHeaders(),
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching active devices:', error);
            throw error;
        }
    }

    async logoutDevice(deviceToken: string): Promise<void> {
        try {
            await axiosInstance.post(
                ENDPOINTS.auth.logoutDevice,
                { deviceToken },
                {
                    headers: await this.getAuthHeaders(),
                }
            );
        } catch (error) {
            console.error('Error logging out device:', error);
            throw error;
        }
    }

    async logoutOtherDevices(): Promise<void> {
        try {
            await axiosInstance.post(
                ENDPOINTS.auth.logoutOtherDevices,
                {},
                {
                    headers: await this.getAuthHeaders(),
                }
            );
        } catch (error) {
            console.error('Error logging out other devices:', error);
            throw error;
        }
    }

    private async getAuthHeaders(): Promise<Record<string, string>> {
        await this.ensureDeviceToken();
        
        const user = firebaseAuth.currentUser;
        if (user) {
            this.idToken = await user.getIdToken();
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.idToken) {
            headers['Authorization'] = `Bearer ${this.idToken}`;
        }

        if (this.deviceToken) {
            headers['X-Device-Token'] = this.deviceToken;
        }

        return headers;
    }

    setupMessageListener(): void {
        Notifications.addNotificationReceivedListener(async (notification: Notifications.Notification) => {
            console.log('📬 Foreground notification:', notification);
            
            const data = notification.request.content.data as Record<string, any>;
            if (data?.type === 'FORCE_LOGOUT') {
                await this.handleForceLogout(
                    data.message || 'Session terminated'
                );
            }
        });

        Notifications.addNotificationResponseReceivedListener(
            (response: Notifications.NotificationResponse) => {
                console.log('📬 Notification response:', response);
                
                const data = response.notification.request.content.data as Record<string, any>;
                if (data?.type === 'FORCE_LOGOUT') {
                    this.handleForceLogout(
                        data.message || 'Session terminated'
                    );
                }
            }
        );
    }

    removeMessageListener(): void {
    }

    addForceLogoutListener(
        callback: (event: { message: string }) => void
    ): () => void {
        const listener = DeviceEventEmitter.addListener(
            FORCE_LOGOUT_EVENT,
            callback
        );
        return () => listener.remove();
    }

    async getSessionData(): Promise<SessionData | null> {
        try {
            const data = await AsyncStorage.getItem(SESSION_DATA_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting session data:', error);
            return null;
        }
    }

    async getMaxDevices(): Promise<number> {
        const session = await this.getSessionData();
        return session?.maxDevices || 1;
    }

    getDeviceLimit(planType: DeviceLimitType): number {
        return planType === 'basic' ? 1 : 3;
    }

    async validateSession(): Promise<boolean> {
        try {
            const user = firebaseAuth.currentUser;
            if (!user) {
                return false;
            }

            const idTokenResult: IdTokenResult = await user.getIdTokenResult();
            const expirationTime = new Date(idTokenResult.expirationTime).getTime();
            const currentTime = Date.now();

            if (expirationTime < currentTime) {
                await this.handleForceLogout('Token expired');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error validating session:', error);
            return false;
        }
    }
}

export const AuthService = new AuthServiceClass();
export default AuthService;
