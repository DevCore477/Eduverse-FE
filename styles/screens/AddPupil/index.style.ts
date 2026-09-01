import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 44,
    },
    headerContainer: {
        alignItems: isRTL ? "flex-end" : "flex-start"
    },
    dashboardHeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    parentZoneText: {
        fontSize: 26,
        fontWeight: 700,
        color: theme.green,
    },
    parentZoneDescription: {
        marginBottom: 14,
        color: theme.text
    },
    cotentContainer: {
        flex: 1,
        justifyContent: "space-between",
    }
})
