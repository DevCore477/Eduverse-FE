import NavigationBar from "@/components/NavigationBar"
import OverlayUI from "@/components/OverlayUI"
import OfflineBanner from "@/components/OfflineBanner"
import { useOverlay } from "@/hooks/use-overlay"
import { useConnectivity } from "@/hooks/use-connectivity"
import { useTheme } from "@/hooks/use-theme"
import { styles } from "@/styles/app/_layout.styles"
import { Slot, Stack } from "expo-router"
import { View } from "react-native"

export default function ParentLayout() {
    const theme = useTheme()
    const themedStyles = styles(theme)
    const { overlayState, hideToast } = useOverlay()
    const { connectivity } = useConnectivity()

    return (
        <View style={{ flex: 1 }}>
            {/* <Stack screenOptions={{ headerShown: false, contentStyle: themedStyles.container }} /> */}
            <Slot />
            <NavigationBar currentDashboard="parent" />
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
        </View >
    )
}
