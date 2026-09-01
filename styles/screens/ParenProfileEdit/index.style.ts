import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
        // paddingBottom: 44,
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
    iconsContent: {
        width: 160,
        height: 160,
        alignSelf: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: theme.green,
        borderRadius: 80,
        position: "relative"
    },

    iconCard: {
        width: 140,
        height: 140,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 70,
        backgroundColor: "#E0DFF180",
        borderWidth: 1,
        borderColor: "#E0DFF1",
        overflow: "hidden"
    },

    cameraContainter: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        right: 0,
        bottom: 10,
        backgroundColor: theme.green,
        width: 32,
        height: 32,
        borderRadius: 16
    },

    formContainer: {
        gap: 16
    },
    text: {
        fontSize: 16,
        fontWeight: "500",
        color: theme.text
    },
})
