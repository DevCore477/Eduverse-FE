import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        paddingTop: 40,
        paddingHorizontal: 16,
        paddingBottom: 44,
        gap: 25,
    },
    headerContainer: {
        alignItems: isRTL ? "flex-end" : "flex-start"
    },
    createPassText: {
        fontSize: 25,
        fontWeight: 700,
        color: theme.green,
        marginBottom: 2,
    },
    createPassDescription: {
        fontSize: 12,
        marginTop: 2,
        color: theme.text
    },
    link: {
        marginTop: 24,
        textAlign: "center",
        color: theme.green,
        fontWeight: "600",
    },
})