import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 44,
        gap: 24
    },
    iconsContent: {
        alignSelf: "center",
        borderRadius: 20,
        gap: 12
    },
    iconCard: {
        borderRadius: 20,
        padding: 10
    },
    nameText: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        color: theme.white
    },
    descriptionText: {
        fontSize: 22,
        maxWidth: 300,
        fontWeight: "600",
        textAlign: "center",
        color: theme.white
    },
})