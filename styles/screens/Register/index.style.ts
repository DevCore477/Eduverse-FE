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

    headerRow: {
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    registerText: {
        fontSize: 32,
        fontWeight: 700,
        color: theme.green,
        marginLeft: isRTL ? 0 : 10,
        marginRight: isRTL ? 10 : 0,
    },
    row: {
        marginBottom: 20,
        flexDirection: isRTL ? "row-reverse" : "row",
        justifyContent: "center",
    },
    moveToSignIn: {
        textAlign: "center",
        color: theme.text

    },
    link: {
        color: theme.green,
        fontWeight: "600",
    },
})