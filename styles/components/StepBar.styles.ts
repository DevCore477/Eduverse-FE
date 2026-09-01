import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
    StyleSheet.create({
        container: {
            width: 80,
            height: 12,
            borderRadius: 999,
            overflow: "hidden",
            flexDirection: "row",
            backgroundColor: theme.secondary
        },
        half: {
            flex: 1
        },
        primary: {
            color: theme.primary
        },
        secondary: {
            color: theme.secondary
        },
        border: {
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20
        },

    });
