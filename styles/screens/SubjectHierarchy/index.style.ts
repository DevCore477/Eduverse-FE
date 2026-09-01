import { ThemeType } from "@/types/global"
import { StyleSheet } from "react-native"

export const styles = (theme: ThemeType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            paddingTop: 40,
            paddingHorizontal: 16,
            // paddingBottom: 44,
            gap: 25,
        },
        header: {
            backgroundColor: 'transparent',
            marginBottom: 2,
        },

        greeting: {
            fontSize: 26,
            fontWeight: "700",
            color: theme.green,
            textAlign: "center",
        },
        subtitle: {
            fontSize: 14,
            fontWeight: "400",
            color: theme.text,
            opacity: 0.9,
            marginTop: 4,
        },
        heroSection: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        listContainer: {
            gap: 16,
            paddingBottom: 44
        },
        card: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 20,
            padding: 20,
            minHeight: 140,
            minWidth: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
        },
        cardLeft: {
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            flex: 1,
            minWidth: 0,
        },
        iconContainer: {
            width: 56,
            height: 56,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
        },
        levelText: {
            fontSize: 12,
            color: "#FFFFFF",
            opacity: 0.8,
            fontWeight: "500",
        },
        titleText: {
            minWidth: 0,
            alignSelf: "stretch",
            fontSize: 18,
            fontWeight: "700",
            color: "#FFFFFF",
            marginTop: 4,
        },
        cardRight: {
            alignItems: "center",
            justifyContent: "center",
            width: 140,
        },
        iconOverlay: {
            width: 180,
            height: 120,
            top: -18,
            right: 0,
            position: 'absolute'
        },
        iconStarOverlay: {
            position: 'relative',
            right: 0,
            top: -10
        },
        progressIndicators: {
            flexDirection: "row",
            gap: 8,
        },
        indicator: {
            width: 12,
            height: 6,
            borderRadius: 3,
        },
    })
