import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    cardContainer: {
        flex: 1,
        gap: 32
    },
    paymentDetailText: {
        color: theme.green,
        fontWeight: "500",
        fontSize: 20
    },
    cardDetailContainer: {
        gap: 16,
        justifyContent: "space-between",
    },
    iconsContent: {
        width: 70,
        height: 120,
        alignSelf: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: theme.green,
        borderRadius: 10,
        position: "relative"
    },

    iconCard: {
        width: 60,
        height: 110,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        backgroundColor: "#E0DFF180",
        borderWidth: 1,
        borderColor: "#E0DFF1",
        overflow: "hidden"
    },

    cameraContainter: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        right: isRTL ? undefined : -4,
        left: isRTL ? -4 : undefined,
        bottom: -4,
        backgroundColor: theme.green,
        width: 20,
        height: 20,
        borderRadius: 10
    },

    titleText: {
        flex: 1,
        minWidth: 0,
        marginRight: 8,
        fontSize: 15,
        fontWeight: 500,
        color: theme.text
    },
    descText: {
        flex: 1,
        minWidth: 0,
        fontSize: 15,
        fontWeight: 600,
        color: theme.text,
        textAlign: isRTL ? "left" : "right",
    },
    planDetailContainer: {
        gap: 16,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E0DFF1"
    },
    planDetailText: {
        gap: 16,
        flexDirection: isRTL ? "row-reverse" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        minWidth: 0,
    },
    planDetailTextLeft: {
        flex: 1,
        minWidth: 0,
        gap: 4,
        alignItems: isRTL ? "flex-end" : "flex-start",
    },
    planName: {
        fontSize: 14,
        fontWeight: "600",
        color: theme.green
    },
    priceInfoLabel: {
        flex: 1,
        minWidth: 0,
        fontSize: 14,
        fontWeight: "600",
        color: theme.green,
    },
    planDeviceInfo: {
        fontSize: 13,
        fontWeight: 400,
        color: theme.text
    },
    planTax: {
        fontSize: 12,
        fontWeight: 300,
        fontStyle: "italic"
    },
    planPriceText: {
        fontSize: 15,
        fontWeight: "600",
        color: theme.text
    },
    priceInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        minWidth: 0,
    },
    priceText: {
        fontSize: 18,
        fontWeight: "600",
        color: theme.green
    },
    contactContainer: {
        gap: 8,
        justifyContent: 'center',
        alignItems: "center"
    },
    contactText: {
        textAlign: "center",
        fontSize: 15,
        fontWeight: "400",
        color: theme.text
    },
    contactEmailText: {
        fontSize: 14,
        fontWeight: "400",
        color: theme.green
    },
    pageHeading: {
        fontSize: 25,
        fontWeight: 700,
        color: theme.green,
        textAlign: isRTL ? "right" : "left",
    },
    noteHeading: {
        fontWeight: "400",
        fontSize: 15,
        color: theme.green
    },
    noteDesc: {
        fontWeight: "400",
        fontSize: 13,
        paddingHorizontal:10,
        color: theme.lightGray,
        textAlign: "center"
    }
})