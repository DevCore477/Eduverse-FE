import { BottomLeftBoundryColor, BottomRightBoundryColor, TopLeftBoundryColor } from "@/assets/images";
import OverlayUI from "@/components/OverlayUI";
import OfflineBanner from "@/components/OfflineBanner";
import { useOverlay } from "@/hooks/use-overlay";
import { useConnectivity } from "@/hooks/use-connectivity";
import { useTheme } from '@/hooks/use-theme';
import { styles } from '@/styles/app/(custom-bg)/_layout.styles';
import { LinearGradient } from "expo-linear-gradient";
import { Slot } from 'expo-router';
import 'react-native-reanimated';


export default function RootLayout() {
  const theme = useTheme()
  const themedStyles = styles(theme)
      const { overlayState, hideToast } = useOverlay()
  const { connectivity } = useConnectivity()
  return (
    <LinearGradient
      colors={['#00AC56', '#00743A']}   // start → end colors
      start={{ x: 0.5, y: 0 }}          // top center
      end={{ x: 0.5, y: 1 }}
      style={themedStyles.container}>
      <TopLeftBoundryColor style={themedStyles.topLeft} />
      <BottomLeftBoundryColor style={themedStyles.bottomLeft} />
      <BottomRightBoundryColor style={themedStyles.bottomRight} />
      <Slot />
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
    </LinearGradient>
  );
}
