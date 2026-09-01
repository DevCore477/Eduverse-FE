import OverlayUI from "@/components/OverlayUI";
import ErrorBoundary from "@/components/ErrorBoundary";
import { initFirebase } from "@/config/firebase";
import { ConnectivityProvider } from "@/contexts/ConnectivityContext";
import { OverlayProvider, useOverlay } from "@/contexts/OverlayContext";
import { SessionProvider, useSession } from "@/contexts/SessionContext";
import { useTheme } from "@/hooks/use-theme";
import i18n from "@/i18n";
import { persistor, RootState, store } from "@/store";
import { clearActivePupil } from "@/store/activePupilSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearParent, setTrialStatus } from "@/store/parentSlice";
import { setLanguage } from "@/store/settingsSlice";
import { clearSubjects } from "@/store/subjectSlice";
import { logScreenView } from "@/utils/firebase-analytics";
import {
  startScreenTrace,
  stopScreenTrace,
} from "@/utils/firebase-performance";
import { safeNavigate } from "@/utils/safeNavigator";
import { setUnauthorizedCallback } from "@/config/api-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Constants from "expo-constants";
import { SplashScreen, Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { io } from "socket.io-client";

const queryClient = new QueryClient();

const useFirstLaunchClearStorage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const firstLaunch = await AsyncStorage.getItem("firstLaunch");
      if (!firstLaunch) {
        await AsyncStorage.setItem("firstLaunch", "true");
        dispatch(clearParent());
        dispatch(clearActivePupil());
        dispatch(clearSubjects());
        console.log("First launch: Cleared persisted data");
      } else {
        console.log("Not first launch: Persisted data kept");
      }
    };

    checkFirstLaunch();
  }, [dispatch]);
};

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppContent() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.parent.parent);
  const activePupil = useAppSelector((state) => state.activePupil.pupil);
  const theme = useTheme();
  const { overlayState, hideToast, showToast } = useOverlay();
  const { handleUnauthorized } = useSession();
  const language = useAppSelector(
    (state: RootState) => state.settings.language,
  );
  const themeMode = useAppSelector((state: RootState) =>
    state.settings.darkMode === true ? "dark" : "light",
  );

  useEffect(() => {
    setUnauthorizedCallback(() => {
      handleUnauthorized((type) => showToast(type as any));
    });
  }, [handleUnauthorized, showToast]);

  useEffect(() => {
    i18n.locale = language;
  }, [language]);

  useEffect(() => {
    if (user?.user?.language) {
      dispatch(setLanguage(user.user.language));
    }
  }, [user?.user?.language, dispatch]);

  useEffect(() => {
    if (pathname) {
      logScreenView(pathname);
      (async () => {
        const trace = await startScreenTrace(pathname);
        if (trace) {
          await stopScreenTrace(trace);
        }
      })();
    }
  }, [pathname]);

  if (!Constants.expoConfig?.extra?.API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured in app.config.ts");
  }
  const API_URL = Constants.expoConfig.extra.API_BASE_URL;
  const socket = io(API_URL, {
    auth: {
      userId: user?.user.id,
    },
  });

  useEffect(() => {
    socket.on("newNotification", (data) => {
      if (data.type === "trial_expired") {
        dispatch(setTrialStatus("expired"));

        const isPupilLogout = !!activePupil;
        if (isPupilLogout) {
          dispatch(clearActivePupil());
          dispatch(clearSubjects());
          queryClient.clear();
          queryClient.removeQueries();
          safeNavigate(router, pathname, "/(default-bg)", "replace");
        }
        safeNavigate(router, pathname, {
          pathname: "/(custom-bg)/pricing-plans",
          params: { isTrailExpired: "true" },
        });
      }
    });

    return () => {
      socket.off("newNotification");
    };
  }, [socket]);

  return (
    <>
      <StatusBar style={themeMode === "light" ? "dark" : "light"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      />
      <OverlayUI visible={overlayState.loaderVisible} mode="loader" />
      <OverlayUI
        visible={overlayState.toastVisible}
        mode="toast"
        toastType={overlayState.toastType}
        onToastHide={() => {
          overlayState.toastOnHide?.();
          hideToast();
        }}
      />
    </>
  );
}

function AppBootstrap() {
  useFirstLaunchClearStorage();

  useEffect(() => {
    console.log("🚀 Initializing Firebase...");
    initFirebase();
  }, []);

  return <AppContent />;
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ConnectivityProvider>
            <OverlayProvider>
              <SessionProvider>
                <ErrorBoundary>
                  <AppBootstrap />
                </ErrorBoundary>
              </SessionProvider>
            </OverlayProvider>
          </ConnectivityProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
