import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 44,
        gap: 16
    },
    dashboardHeaderContainer: {
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    noPupilsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    noPupilsText: {
        fontSize: 16,
        color: theme.text,
        textAlign: "center",
    },
    parentZoneText: {
        fontSize: 26,
        fontWeight: 700,
        color: theme.green,
    },
    parentZoneDescription: {
        marginBottom: 14,
        color: theme.text,
        textAlign: isRTL ? "right" : "left",
    },
    cotentContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16
    },

})
