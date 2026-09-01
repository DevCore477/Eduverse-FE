import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 40,
            paddingBottom: 40,
            gap: 16
        },
        pageHeading: {
            fontSize: 26,
            fontWeight: 700,
            color: theme.green,
        },
        headerContainer: {
            width: "100%",
            height: 200,
            paddingHorizontal: 16,
            paddingVertical: 40,
            backgroundColor: theme.green,
            justifyContent: "flex-end",
            gap: 6,
            alignItems: isRTL ? "flex-end" : "flex-start"
        },
        titleText: {
            fontSize: 20,
            fontWeight: 600,
            width: 300,
            color: theme.white,
            lineHeight: 28,
            textAlign: isRTL ? "right" : "left"
        },
        lastUpdatedText: {
            fontSize: 12,
            color: theme.white,
            textAlign: isRTL ? "right" : "left"

        },
        contentContainer: {
            backgroundColor: theme.background,
            paddingHorizontal: 16,
            paddingVertical: 40,
            gap: 16,
        },
        contentBlock: {
            gap: 6,
            alignItems: isRTL ? "flex-end" : "flex-start"

        },
        contentMainHeading: {
            fontSize: 18,
            fontWeight: 600,
            color: theme.text,
            textAlign: isRTL ? "right" : "left"

        },
        contentIntroText: {
            fontSize: 14,
            color: theme.text,
            textAlign: isRTL ? "right" : "left"

        },
        contentBlockHeading: {
            fontSize: 18,
            fontWeight: 500,
            color: theme.text,
            textAlign: isRTL ? "right" : "left"

        }
    });
