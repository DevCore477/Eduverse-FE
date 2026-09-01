import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        backgroundColor: theme.navBar,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 30,
        paddingVertical: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        shadowColor: "#00AC56",         // Shadow color
        shadowOffset: { width: 0, height: 30 },   // Increase shadow offset to make the shadow larger
        shadowOpacity: 1,             // Increase opacity for a darker shadow
        shadowRadius: 24,               // Increase radius for a more blurred shadow
        elevation: 20,                     // Android-specific shadow
    },

    iconContainer: {
        flex: 1,
        minWidth: 0,
        flexDirection: "column",
        alignItems: "center",
        gap: 4
    },
    text: {
        fontSize: 10,
        fontWeight: 400,
    },
    notificationBadge: {
        position: "absolute",
        top: -9,
        right: 9,
        width: 18,
        height: 18,
        backgroundColor: "#00AC56", // Red background color for the notification badge
        borderRadius: 9, // Makes it circular
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // To ensure it's on top of other content
    },
    notificationCount: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#FFDE3C", // White text color
    },

})
