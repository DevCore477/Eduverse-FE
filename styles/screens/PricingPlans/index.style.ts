import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 44,
    },

    topLeft: {
        position: "absolute",
        top: 30,
        left: 0,
        resizeMode: "contain",
    },

    bottomLeft: {
        position: "absolute",
        bottom: 44,
        left: 0,
        resizeMode: "contain",
    },

    bottomRight: {
        position: "absolute",
        bottom: 44,
        right: 0,
        resizeMode: "contain",
    },

    subCardContainer: {
        display: "flex",
        flexDirection: "row",
        height: 200,
        gap: 10
    },
    pricingPlanText: {
        fontSize: 26,
        fontWeight: "700",
        color: theme.white,
        textAlign: "center",
    },
    chooseSubsNowText: {
        fontSize: 14,
        fontWeight: "400",
        color: theme.white,
        opacity: 0.9,
        marginTop: 4,
    },
    annualBilText: {
        fontSize: 20,
        fontWeight: 500,
        color: theme.white,
        textAlign: "center"
    },
    chooseFreePlanText: {
        color: theme.white,
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
    },
    underline: {
        height: 1,
        backgroundColor: "#FFDE3C",
        width: "100%",
    },
    choosePlanText: {
        color: theme.white,
        fontSize: 14,
        fontWeight: 500,
        textAlign: "center"
    },
    image: {
        width: "100%",
        aspectRatio: 1.4,
        resizeMode: "contain"
    }
})