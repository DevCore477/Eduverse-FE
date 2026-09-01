import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: theme.background,
        
    },
})