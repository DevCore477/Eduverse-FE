import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 44,
        gap: 32
    },
    parentProfileText: {
        fontSize: 26,
        fontWeight: 700,
        color: theme.green,
    },
    parentProfileDescription: {
        marginBottom: 14,
        color: theme.text
    },
    nameText: {
        fontSize: 20,
        fontWeight: "600",
        color: theme.green,
        textAlign: "center"
    },
    emailText: {
        fontSize: 16,
        fontWeight: "600",
        color: theme.text,
        textAlign: "center"
    },
    iconsContent: {
        alignItems: "center",
        justifyContent: "center",
        gap: 16
    },
    iconCard: {
        padding: 10,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: "#E0DFF1",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },

    textContainer: {
        alignItems: "center",
        justifyContent: "center",
        gap: 6
    },
    text: {
        fontSize: 16,
        fontWeight: "500",
        color: theme.text
    },
})
