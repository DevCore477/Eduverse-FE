import OverlayUI from '@/components/OverlayUI';
import OfflineBanner from '@/components/OfflineBanner';
import { useOverlay } from "@/hooks/use-overlay";
import { useConnectivity } from "@/hooks/use-connectivity";
import { useTheme } from '@/hooks/use-theme';
import { styles } from '@/styles/app/_layout.styles';
import { Slot } from 'expo-router';
import { View } from "react-native";
import 'react-native-reanimated';


export default function RootLayout() {
  const theme = useTheme()
  const themedStyles = styles(theme)
  const { overlayState, hideToast } = useOverlay()
  const { connectivity } = useConnectivity()

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      {/* <Stack screenOptions={{ headerShown: false, contentStyle: themedStyles.container }} /> */}
      <OverlayUI
        visible={overlayState.loaderVisible}
        mode="loader"
      />
      <OverlayUI
        visible={overlayState.toastVisible}
        mode="toast"
        toastType={overlayState.toastType}
        onToastHide={() => {
          overlayState.toastOnHide?.()
          hideToast()
        }}
      />
      <OfflineBanner visible={!connectivity.isConnected} />
    </View>
  );
}
