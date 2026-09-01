import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
    scroll: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingBottom: 44,
        gap: 30
    },
    dashboardHeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: 0,
    },
    dashboardHeaderLeft: {
        flex: 1,
        minWidth: 0,
    },
    textRowFill: {
        flex: 1,
        minWidth: 0,
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
    pupilNameContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
    },
    pupilDetailText: {
        fontSize: 26,
        fontWeight: 700,
        color: theme.green,
    },
    parentZoneText: {
        fontSize: 28,
        fontWeight: 700,
        color: theme.green,
        marginBottom: 2,
        marginTop: 4
    },
    parentZoneDescription: {
        fontSize:12,
        color: theme.text,
        maxWidth: "100%",
    },
    progressInsignthsTextContainer: {
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: 0,
    },
    cotentContainer: {
        flex: 1,
        flexDirection: "row",
        gap: 6,
    },
    detailsLink: {
        color: theme.green,
        fontSize: 14,
        fontWeight: "500",
        textDecorationLine: "underline",
        textDecorationColor: theme.green,
        textDecorationStyle: "solid"
    },
    progressCircles: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6
    },
})
