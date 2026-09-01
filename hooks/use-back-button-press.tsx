// hooks/use-back-button-press.ts
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useOverlay } from "@/hooks/use-overlay";

interface UseBackButtonHandlerOptions {
  onBackPress?: () => void;
  exitAppScreen?: boolean;
  preventDefault?: boolean;
}

const useBackButtonHandler = (options: UseBackButtonHandlerOptions = {}) => {
  const router = useRouter();
  const {
    onBackPress,
    exitAppScreen = false,
    preventDefault = true
  } = options;
  const { hideLoader } = useOverlay()


  useEffect(() => {
    const backAction = () => {
      hideLoader();
      if (exitAppScreen) {
        BackHandler.exitApp();
        return true;
      }

      // If a custom callback is provided, use it
      if (onBackPress) {
        onBackPress();
      } else {
        // Otherwise, use default router.back()
        router.back();
      }

      return preventDefault; // Return true to prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      backHandler.remove();
    };
  }, [router, onBackPress, exitAppScreen, preventDefault]);
};

export default useBackButtonHandler;