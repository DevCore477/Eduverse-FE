import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 44,
        alignItems: "center",
        gap: 32
    },
    settingHeading: {
        fontSize: 26,
        fontWeight: "700",
        color: theme.green,
    },
    textContainer: {
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    textReportContainer: {
        flexDirection: "column",
        gap: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    textHeading: {
        color: theme.green,
        fontSize: 32,
        fontWeight: "700"
    },
    textDescription: {
        fontSize: 14,
        color: theme.textDesc
    },
    textEmail: {
        color: theme.green,
        fontSize: 28,
        fontWeight: "500"
    },
})