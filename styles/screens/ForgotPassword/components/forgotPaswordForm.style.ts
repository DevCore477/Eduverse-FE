import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTl: boolean) => StyleSheet.create({
    label: { fontWeight: "500", marginBottom: 8, color: theme.text, textAlign: isRTl ? "right" : "left" },
    input: {
        height: 50,
        borderWidth: 1,
        color: theme.text,
        borderColor: theme.borderSecondary,
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginBottom:10
    },
    error: {
        color: "red",
        marginTop: 4,
        fontSize: 12,
    },
    button: {
        marginTop: 30,
        height: 60,
        backgroundColor: theme.btnFormPrimary,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: theme.btnFormSecondary,
        fontWeight: '600',
        fontSize: 16,
        textAlign: "center"
    },
})
