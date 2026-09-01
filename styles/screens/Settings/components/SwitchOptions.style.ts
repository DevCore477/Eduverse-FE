import { flexRowLabelGroup, flexRowLabelText } from "@/styles/common/flexRowLabel";
import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
    container: {
        flexDirection: isRTL ? "row-reverse" : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        padding: 18,
    },
    leftSection: {
        ...flexRowLabelGroup,
        flexDirection: isRTL ? "row-reverse" : 'row',
        alignItems: 'center',
        gap: 12

    },
    text: {
        ...flexRowLabelText,
        fontSize: 16,
        color: theme.text
    },
});
