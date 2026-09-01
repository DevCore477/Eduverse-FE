import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 44,
        gap: 30
    },
    planInfoContainer: {
        width: "100%",
        padding: 18,
        borderRadius: 12,
        gap: 16,
        backgroundColor: theme.dropdownBg,
        shadowColor: "#0000001A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5
    },
    planInfoText: {
        gap: 4,
        alignItems: isRTL ? "flex-end" : "flex-start"
    },
    planInfoName: {
        color: theme.green,
        fontSize: 18,
        fontWeight: 600,
        textAlign: isRTL ? "right" : "left"
    },
    planInfoDesc: {
        color: theme.text,
        textAlign: isRTL ? "right" : "left"
    },
    paymentZoneText: {
        fontSize: 26,
        fontWeight: 700,
        color: theme.green,
    },
    planBenefitsContainer: {
        gap: 20,
        alignItems: isRTL ? "flex-end" : "flex-start"
    },
    planBenefitText: {
        color: theme.text,
        fontWeight: 500,
        fontSize: 18
    },
    planBenefitList: {
        gap: 16
    },
    planBenfitRow: {
        flexDirection: isRTL ? "row-reverse" : "row",
        gap: 8,
        alignItems: "center"
    },
    planBenefit: {
        color: theme.text
    }

})