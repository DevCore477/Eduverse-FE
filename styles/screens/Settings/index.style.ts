import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 44,
        gap:32
    },
    contentContainer: {
        flex: 1
    },
    scrollContent: {
        gap: 6
    },
    settingHeading: {
        fontSize: 26,
        fontWeight: "700",
        color: theme.green
    }
});
