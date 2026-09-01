import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        position: "absolute",
        top: 50,
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: theme.toastBg, // your screenshot style
        borderRadius: 30,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E0DFF1",
        zIndex: 99,
        elevation: 5,
        padding: 12,
    },

    iconContainer: {
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },

    text: {
        marginLeft: 8,
        color: "#2D1C1C",
        fontSize: 16,
        fontWeight: "500",
    },
});