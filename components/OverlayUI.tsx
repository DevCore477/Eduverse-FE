import RotatingDotsLoader from "@/components/RotatingDotsLoader";
import Toast from "@/components/Toast";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { ToastType } from "@/types/toastType";
import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";

type OverlayMode = "loader" | "toast";

interface OverlayUIProps {
    visible: boolean;
    mode: OverlayMode;
    toastType?: ToastType;
    onToastHide?: () => void;
}

export default function OverlayUI({
    visible,
    mode,
    toastType = "retry",
    onToastHide,
}: OverlayUIProps) {
    const colorScheme = useColorScheme();

    if (!visible) return null;

    return (
        <View style={styles.overlayContainer}>
            {/* Background Blur */}
            <BlurView
                intensity={200}
                tint={
                    colorScheme === "light"
                        ? "systemMaterialLight"
                        : "systemChromeMaterialDark"
                }
                style={styles.blur}
            />

            {/* Loader */}
            {mode === "loader" && (
                <View style={styles.centerContainer}>
                    <RotatingDotsLoader />
                </View>
            )}

            {/* Toast */}
            {mode === "toast" && (
                <View style={styles.toastWrapper}>
                    <Toast
                        type={toastType}
                        visible={visible}
                        onHide={onToastHide ?? (() => {})}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
    },
    blur: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#FFFFFF1A",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    toastWrapper: {
        position: "absolute",
        top: 50,
        width: "100%",
        alignItems: "center",
    },
});
