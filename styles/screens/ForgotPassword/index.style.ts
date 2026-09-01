import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 44,
    },
    headerContainer: {
        alignItems: isRTL ? "flex-end" : "flex-start"
    },
    forgotPassText: {
        fontSize: 26,
        fontWeight: 700,
        color: theme.green,
    },
    forgotPassDescription: {
        marginBottom: 10,
        paddingBottom: 10,
        color: theme.text
    },
    link: {
        marginTop: 24,
        textAlign: "center",
        color: theme.green,
        fontWeight: "600",
    },
})