import { flexRowLabelGroup, flexRowLabelText } from "@/styles/common/flexRowLabel";
import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, open: boolean, isRTL: boolean) => StyleSheet.create({
    languageRow: {
        height: 60,
        padding: 18,
        paddingRight: isRTL ? 18 : 32,
        paddingLeft: isRTL ? 32 : 18,
        borderRadius: 12,
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: open ? theme.dropdownBg : theme.background,
    },
    languageTextContainer: {
        ...flexRowLabelGroup,
        gap: 12,
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
    },
    languageText: {
        ...flexRowLabelText,
        fontSize: 16,
        color: theme.text

    },
    optionsContainer: {
        backgroundColor: "transparent",
        flexDirection: "column",
        gap: 4
    },
    optionRow: {
        backgroundColor: theme.dropdownBg,
        height: 60,
        paddingRight: isRTL ? 16 : 32,
        paddingLeft: isRTL ? 32 : 16,
        paddingVertical: 18,
        borderRadius: 12,
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        gap: 12,
        minWidth: 0,
    },
    optionText: {
        ...flexRowLabelText,
        fontSize: 16,
        color: theme.text
    }
});
