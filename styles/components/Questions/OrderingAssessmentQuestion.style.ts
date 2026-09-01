import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
    StyleSheet.create({
        optionsGrid: {
            flexGrow: 1,
            gap: 32,
        },
        orderingType: {
            color: theme.btnFormSecondary,
            fontSize: 32,
            fontWeight: "600",
            textAlign: "center"
        },
        orderingText: {
            color: theme.white,
            fontSize: 24,
            fontWeight: "500",
            textAlign: "right"
        },
        swipeContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6
        },
        questionRow: {
            flexDirection: 'row-reverse', // Arabic RTL
            alignItems: 'center',
            gap: 8,
        },

        inlineIndicatorIcon: {
            width: 22,
            height: 22,
        },
        swipeText: {
            fontWeight: "500",
            textAlign: "center",
            color: "#fff"
        },
        checkButton: {
            width: 160,
            height: 43,
            paddingVertical: 10,
            paddingHorizontal: 16,
            marginBottom: 20,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            gap: 8,
            elevation: 4,
        },
        checkButtonText: {
            color: theme.white,
            fontSize: 14,
            fontWeight: "600",
        },
        indicatorContainer: {
            position: 'absolute',
            right: 50,
            top: 30,
        },
        indicatorIcon: {
            width: 24,
            height: 24,
        },
    });

