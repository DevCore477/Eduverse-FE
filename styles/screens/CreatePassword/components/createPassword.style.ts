import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
    label: { fontWeight: "500", marginBottom: 4, color: theme.text, marginTop: 16, textAlign: isRTL ? "right" : "left" },
    input: {
        height: 50,
        borderWidth: 1,
        color: theme.text,
        borderColor: theme.borderSecondary,
        textAlign: isRTL ? "right" : "left",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
    },

    eyeButton: {
        position: "absolute",
        right: isRTL ? undefined : 12,
        left: isRTL ? 12 : undefined,
        top: 14,
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
