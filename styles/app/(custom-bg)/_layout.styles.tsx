import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    stackContainer: {
        flex: 1,
        backgroundColor: "transparent"
    },
    topLeft: {
        position: "absolute",
        top: 30,
        left: 0,
        resizeMode: "contain",
    },

    bottomLeft: {
        position: "absolute",
        bottom: 44,
        left: 0,
        resizeMode: "contain",
    },

    bottomRight: {
        position: "absolute",
        bottom: 44,
        right: 0,
        resizeMode: "contain",
    },
})