import { createContext, ReactNode, useContext, useCallback, useRef } from "react";
import { useRouter, usePathname } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { clearAuthToken, clearDeviceToken, clearSessionStart, stopTokenRefreshCycle } from "@/config/api-config";
import { firebaseLogout } from "@/services/firebase/auth";
import { useAppDispatch } from "@/store/hooks";
import { clearParent } from "@/store/parentSlice";
import { clearActivePupil } from "@/store/activePupilSlice";
import { clearSubjects } from "@/store/subjectSlice";
import { safeNavigate } from "@/utils/safeNavigator";

interface SessionContextType {
    handleSessionExpired: (showToast?: (type: string) => void) => Promise<void>;
    handleUnauthorized: (showToast?: (type: string) => void) => Promise<void>;
    isSessionExpired: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const isProcessingRef = useRef(false);

    const handleLogout = useCallback(async (showToast?: (type: string) => void) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        try {
            stopTokenRefreshCycle();
            await clearAuthToken();
            await clearDeviceToken();
            await clearSessionStart();
            await firebaseLogout();
            dispatch(clearParent());
            dispatch(clearActivePupil());
            dispatch(clearSubjects());
            queryClient.clear();
            queryClient.cancelQueries();
            
            if (showToast) {
                showToast("sessionExpired");
            }
            
            safeNavigate(router, pathname, "/(default-bg)", "replace");
        } catch (error) {
            console.error("Error during logout:", error);
            safeNavigate(router, pathname, "/(default-bg)", "replace");
        } finally {
            setTimeout(() => {
                isProcessingRef.current = false;
            }, 1000);
        }
    }, [router, pathname, dispatch, queryClient]);

    const handleSessionExpired = useCallback(async (showToast?: (type: string) => void) => {
        await handleLogout(showToast);
    }, [handleLogout]);

    const handleUnauthorized = useCallback(async (showToast?: (type: string) => void) => {
        await handleLogout(showToast);
    }, [handleLogout]);

    return (
        <SessionContext.Provider
            value={{
                handleSessionExpired,
                handleUnauthorized,
                isSessionExpired: false,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}

export async function handleApi401Error(
    router: ReturnType<typeof useRouter>,
    pathname: string,
    dispatch: any,
    queryClient: any,
    showToast?: (type: string) => void
) {
    try {
        stopTokenRefreshCycle();
        await clearAuthToken();
        await clearDeviceToken();
        await clearSessionStart();
        await firebaseLogout();
        dispatch(clearParent());
        dispatch(clearActivePupil());
        dispatch(clearSubjects());
        queryClient.clear();
        queryClient.cancelQueries();
        
        if (showToast) {
            showToast("sessionExpired");
        }
        
        safeNavigate(router, pathname, "/(default-bg)", "replace");
    } catch (error) {
        console.error("Error handling 401:", error);
        safeNavigate(router, pathname, "/(default-bg)", "replace");
    }
}
