import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    scroll: {
        flex: 1
    },
    container: {
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 44,
        gap: 30
    },
    dashboardHeaderContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between"
    },
    text: {
        color: theme.text,
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
    parentZoneText: {
        fontSize: 32,
        fontWeight: 700,
        color: theme.green,
        marginBottom: 2,
        marginTop: 4
    },
    parentZoneDescription: {
        color: theme.text
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
        gap: 10
    }
})
