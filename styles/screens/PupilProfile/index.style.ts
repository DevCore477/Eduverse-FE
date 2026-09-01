import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
        gap: 30
    },
    headerContainer: {
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    settingHeading: {
        fontSize: 32,
        fontWeight: "700",
        color: theme.green
    },
    pupilProfileText: {
        fontSize: 26,
        fontWeight: 700,
        color: theme.green,
    },
    pupilProfileDescription: {
        marginBottom: 14,
        color: theme.text,
        textAlign: isRTL ? "right" : "left"
    },
    nameText: {
        fontSize: 20,
        fontWeight: "600",
        color: theme.green,
        textAlign: "center"
    },
    iconsContent: {
        alignSelf: "center",
        gap: 12
    },
    iconCard: {
        borderRadius: 20,
        padding: 10
    },
    text: {
        fontSize: 20,
        fontWeight: "500",
        color: theme.text,
        textAlign: isRTL ? "right" : "left"
    },
})
