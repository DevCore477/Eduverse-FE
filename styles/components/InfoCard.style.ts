import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
    container: {
        backgroundColor: theme.green,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 18,
        flexDirection: isRTL ? "row-reverse" : "row",
        gap: 12,
        alignItems: "center",
        elevation: 4, 
    },
    contentContainer: {
        flex: 1,
        flexDirection: "column",
        gap: 16,
    },
    pupilIconContainer: {
        borderTopEndRadius: 12,
        borderBottomEndRadius: 12,
        overflow: "hidden"
    },
    textContainer: {
        flexDirection: isRTL ? "row-reverse" : "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingRight: 14,
        minWidth: 0,
    },
    titleColumn: {
        flex: 1,
        minWidth: 0,
    },
    numberText: {
        fontSize: 14,
        fontWeight: "600",
        color: theme.white

    },
    descriptionText: {
        fontSize: 14,
        maxWidth: "100%",
        fontWeight: "400",
        color: theme.white,
        textAlign: isRTL ? "right" : "left" 
    },
    titleText: {
        fontSize: 20,
        fontWeight: "500",
        color: theme.white,
        textAlign: isRTL ? "right" : "left"
    },
    lockIconContainer: {
        borderColor: theme.white,
        borderRadius: 8,
        borderWidth: 1,
        padding: 10
    }

})
