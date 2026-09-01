import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingTop: 40,
            gap: 25,
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: "700",
            color: theme.green,
            marginBottom: 4,
        },
        headerSubtitle: {
            fontSize: 12,
            fontWeight: "400",
            color: theme.text,
            opacity: 0.7,
        },
        writingContext: {
            fontWeight: "500",
            color: theme.text,
            fontSize: 22,
            textAlign: "right"
        },
        writingRequiredText: {
            fontWeight: "500",
            color: theme.green,
            fontSize: 22,
            textAlign: "right"
        },

        writingRequiredRow: {
            flexDirection: "row-reverse",
            // alignItems: "flex-start",
            gap: 12,
        },
        writingRequired: {
            fontSize: 18,
            color: theme.textSecondary,
            textAlign: "right",
            paddingLeft: 32
        },
        taskReviewText: {
            fontWeight: "600",
            color: theme.green,
            fontSize: 18,
        },

        reviewNameText: {
            color: theme.text,
            fontSize: 16,
        },
        reviewPointText: {
            fontWeight:"600",
            color: theme.green,
            fontSize: 14,
        },
    });
