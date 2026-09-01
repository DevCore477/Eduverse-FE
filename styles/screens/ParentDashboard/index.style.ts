import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean, noOfCards: number) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 44,
        gap: 16
    },
    dashboardHeaderContainer: {
        flexDirection: isRTL ? "row-reverse" : "row",
        justifyContent: "space-between",
        marginBottom: 20
    },
    parentZoneText: {
        fontSize: 26,
        fontWeight: 700,
        color: theme.green,
    },
    parentZoneDescription: {
        marginBottom: 14,
        fontSize: 13,
        textAlign: isRTL ? "right" : "left",
        color: theme.text,
    },
    cotentContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: noOfCards === 3 ? "center" : "flex-start",
        gap: 14,
    },
    progressCircles: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8
    },
    text: {
        color: theme.text,
        textAlign: isRTL ? "right" : "left",
        fontSize: 18,
        fontWeight: "500"
    },
    recentActivitiesContainer: {
        flexDirection: "column",
        gap: 16
    },
})
