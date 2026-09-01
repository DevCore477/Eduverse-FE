import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 44,
    },
    verifyOtpText: {
        fontSize: 26,
        fontWeight: 700,
        color: theme.green,
    },
    verifyOtpDescription: {
        marginBottom: 14,
        color: theme.text
    },
    havntReceivedText: {
        marginTop: 24,
        color: theme.text,
        textAlign: "center",
    },
    link: {
        color: theme.green,
        fontWeight: "600",
        marginTop: 4
    },
})