import { axiosInstance, ENDPOINTS, setDeviceToken, saveAuthToken, startTokenRefreshCycle, saveSessionStart } from "@/config/api-config";
import { firebaseAuth } from "@/config/firebase";
import { logLogin, logSignUp, setUserId } from "@/utils/firebase-analytics";
import {
    TForgetPassword,
    TLogin,
    TRegister,
    TResendOtp,
    TResetPassword,
    TUpdatePassword,
    TVerifyOtp
} from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import {
    signInWithCustomToken,
    signInWithEmailAndPassword,
    updatePassword
} from "firebase/auth";
import AuthService from "./deviceAuthService";

export const useRegister = () => {
    return useMutation({
        mutationFn: async (data: TRegister) => {
            // 1️⃣ Create user in Firebase (via backend)
            const response = await axiosInstance.post(ENDPOINTS.auth.register, {
                ...data
            });
            
            try {
                // 2️⃣ Sign in with custom token from backend
                await signInWithCustomToken(firebaseAuth, response.data.data.token);
                
                // 3️⃣ Get Firebase UID
                const firebaseUser = firebaseAuth.currentUser;
                if (!firebaseUser) {
                    throw new Error("Firebase user not found after registration");
                }
                console.log("🔑 Firebase UID (register):", firebaseUser.uid);
                
                // 4️⃣ Get Firebase ID token (parallel with device setup)
                const idTokenPromise = firebaseUser.getIdToken();
                
                // 5️⃣ Initialize device token and get device info IN PARALLEL
                let deviceTokenPromise = AuthService.initializeDeviceToken();
                const deviceInfoPromise = AuthService.getDeviceInfo();
                
                // Wait for all in parallel
                const [idToken, deviceToken, deviceInfo] = await Promise.all([
                    idTokenPromise,
                    deviceTokenPromise,
                    deviceInfoPromise
                ]);
                
                // Save token and start refresh cycle
                await saveAuthToken(idToken);
                await saveSessionStart();
                startTokenRefreshCycle();
                
                // Clean device token
                let cleanDeviceToken = deviceToken;
                if (cleanDeviceToken && cleanDeviceToken.startsWith('ExponentPushToken[')) {
                    cleanDeviceToken = cleanDeviceToken.replace(/^ExponentPushToken\[|\]$/g, '');
                }
                console.log("📱 Device Token (register):", cleanDeviceToken);
                
                if (!cleanDeviceToken) {
                    cleanDeviceToken = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                }
                
                // Save device token for API requests
                await setDeviceToken(cleanDeviceToken);
                console.log("📋 Device Info (register):", deviceInfo);
                
                // 6️⃣ Call device-login to register device session
                console.log("📤 Calling device-login after registration...");
                try {
                    const deviceLoginResponse = await axiosInstance.post(ENDPOINTS.auth.deviceLogin, {
                        firebaseUid: firebaseUser.uid,
                        deviceToken: cleanDeviceToken,
                        deviceInfo: deviceInfo,
                    });
                    console.log("✅ device-login (register) response:", JSON.stringify(deviceLoginResponse.data));
                } catch (deviceError: any) {
                    console.log("⚠️ device-login failed (register):", deviceError.response?.data || deviceError.message);
                }
                
                const userId = response.data.data.user.id;
                setUserId(userId);
                logSignUp(isEmail(data.identifier) ? "email" : "phone");
            } catch (e) {
                console.log(e, 'res')
            }
            return response.data;
        }
    });
};

const isEmail = (value: string) => value.includes("@");


export const useLogin = () => {
    console.log("hello", axiosInstance.getUri())
    return useMutation({
        mutationFn: async (data: TLogin) => {
            // 1️⃣ Firebase login
            if (isEmail(data.identifier)) {
                await signInWithEmailAndPassword(
                    firebaseAuth,
                    data.identifier,
                    data.password
                );
            }

            // 2️⃣ Get Firebase UID
            const firebaseUser = firebaseAuth.currentUser;
            if (!firebaseUser) {
                throw new Error("Firebase user not found");
            }

            console.log("🔑 Firebase UID:", firebaseUser.uid);

            // 3️⃣ Get fresh Firebase ID token FIRST (must be fresh for backend auth)
            const idToken = await firebaseUser.getIdToken(true);
            console.log("🔑 Got fresh Firebase ID token");
            
            // 4️⃣ Get device token and info in parallel
            const deviceTokenPromise = AuthService.initializeDeviceToken();
            const deviceInfoPromise = AuthService.getDeviceInfo();
            
            const [deviceToken, deviceInfo] = await Promise.all([
                deviceTokenPromise,
                deviceInfoPromise
            ]);
            
            // Clean device token
            let cleanDeviceToken = deviceToken;
            if (cleanDeviceToken && cleanDeviceToken.startsWith('ExponentPushToken[')) {
                cleanDeviceToken = cleanDeviceToken.replace(/^ExponentPushToken\[|\]$/g, '');
            }
            console.log("📱 Device Token (clean):", cleanDeviceToken);
            
            if (!cleanDeviceToken) {
                cleanDeviceToken = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                console.log("⚠️ Using fallback device token:", cleanDeviceToken);
            }
            
            // Save device token for API requests
            await setDeviceToken(cleanDeviceToken);
            console.log("📋 Device Info:", deviceInfo);

            // 5️⃣ Call device-login endpoint to save session in DB
            console.log("📤 Sending device-login request...");
            console.log("📤 Payload:", {
                firebaseUid: firebaseUser.uid,
                deviceToken: cleanDeviceToken,
                deviceInfo: deviceInfo,
            });
            
            try {
                // Send camelCase - interceptor will convert to snake_case
                const deviceLoginResponse = await axiosInstance.post(ENDPOINTS.auth.deviceLogin, {
                    firebaseUid: firebaseUser.uid,
                    deviceToken: cleanDeviceToken,
                    deviceInfo: deviceInfo,
                });
                console.log("✅ device-login response:", JSON.stringify(deviceLoginResponse.data));
            
                // Check if device limit was exceeded (kicked another device)
                if (deviceLoginResponse.data.data?.kickedDevice) {
                    console.log("⚠️ Device kicked:", deviceLoginResponse.data.data.kickedDevice);
                }

                // 6️⃣ Now call regular /auth/login to get user data
                console.log("📤 Calling regular /auth/login for user data...");
                const loginResponse = await axiosInstance.post(ENDPOINTS.auth.login);
                console.log("✅ /auth/login response:", JSON.stringify(loginResponse.data));
                
                // Save token and start refresh cycle
                await saveAuthToken(idToken);
                await saveSessionStart();
                startTokenRefreshCycle();
                
                const userId = loginResponse.data.data?.user?.user?.id;
                console.log("👤 User ID:", userId);
                
                if (userId) {
                    setUserId(userId);
                }
                
                logLogin(isEmail(data.identifier) ? "email" : "phone");
                
                console.log("🎉 Login successful, returning data");
                return loginResponse.data;
            } catch (apiError: any) {
                console.log("❌ Login error:", apiError.response?.data || apiError.message);
                console.log("❌ Login status:", apiError.response?.status);
                if (apiError.response?.data) {
                    console.log("❌ Full error response:", JSON.stringify(apiError.response?.data));
                }
                throw apiError;
            }
        }
    });
};

export const useForgetPassword = () => {
    return useMutation({
        mutationFn: async (data: TForgetPassword) => {
            // const forgotPassLink = "nedjmatiapp://(default-bg)/create-password"
            // const forgotPassLink = "https://unluckily-tinpot-annmarie.ngrok-free.dev/create-password";
            //
            // const actionCodeSettings = {
            //     url: forgotPassLink,
            //     handleCodeInApp: true
            // }
            try {
                // const response = await sendPasswordResetEmail(firebaseAuth, data.identifier);
                const response = await axiosInstance.post(ENDPOINTS.auth.forgetPassword, data);
                return response.data;
            } catch (e) {
                console.log(e)
            }
        }
    });
};

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: async (data: TVerifyOtp) => {
            try {
                const response = await axiosInstance.post(ENDPOINTS.auth.verfiyOtp, {
                    ...data
                });
                return response.data;
            } catch (e: any) {
                console.log(e.message, 'error in verify otp')
            }
        }
    });
};

export const useResendOtp = () => {
    return useMutation({
        mutationFn: async (data: TResendOtp) => {
            try {
                const response = await axiosInstance.post(ENDPOINTS.auth.resendOtp, {
                    ...data
                });
                return response.data;
            } catch (err: any) {
                console.log(err.message, 'error in resendOTP')
            }
        }
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: async (data: TUpdatePassword) => {
            try {
                const response = await axiosInstance.post(ENDPOINTS.auth.resetPassword, data)
                return response.data;
            } catch (e) {
                console.log(e, 'error in update Password')
            }
        }
    })
}

export const useResetPassword = () => {
    return useMutation({
        mutationFn: async (data: TResetPassword) => {
            const response = await updatePassword(data.user, data.newPassword)
            return response;
        }
    });
};


export const useDeleteAccount = () => {
    return useMutation({
        mutationFn: async () => {
            await axiosInstance.delete(ENDPOINTS.auth.deleteAccount);
        }
    });
}