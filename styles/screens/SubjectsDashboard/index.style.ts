import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 40,
            gap: 16
        },
        header: {
            backgroundColor: 'transparent',
            marginBottom: 2
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
        heroSection: {
            paddingHorizontal: 16,
            paddingVertical: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            transform: [{ translateY: 10 }]
        },
        courseText: {
            fontSize: 26,
            fontWeight: 700,
            color: theme.green
        },
        coursesTitle: {
            fontSize: 26,
            fontWeight: 700,
            color: theme.green
        },
        greeting: {
            fontSize: 28,
            fontWeight: "700",
            color: "#4CAF50",
            marginBottom: 4,

        },
        subtitle: {
            fontSize: 14,
            color: theme.text,
            opacity: 0.7,
            marginBottom: 4,
        },
        currentSubjectText: {
            fontSize: 12,
            color: theme.text,
            opacity: 0.6,
            marginTop: 4,
            fontStyle: "italic",
        },
        listContainer: {
            gap: 16,
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
        mascotEmoji: {
            fontSize: 56,
        },
        settingsButton: {
            backgroundColor: "#4CAF50",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 8,
        },
        settingsButtonText: {
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: "600",
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
        }
    });
