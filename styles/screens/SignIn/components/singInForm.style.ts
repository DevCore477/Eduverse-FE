import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
    label: { fontWeight: "500", marginBottom: 8, textAlign: isRTL ? "right" : "left", color: theme.text,marginTop: 16 },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: theme.borderSecondary,
        color: theme.text,
        paddingVertical: 12,
        textAlign: isRTL ? "right" : "left",
        paddingHorizontal: 16,
        borderRadius: 10,
        padding:10,
    },
    eyeButton: {
        position: "absolute",
        right: isRTL ? undefined : 12,
        left: isRTL ? 12 : undefined,
        top:20,
    },
    error: {
        color: "red",
        marginTop: 2,
        fontSize: 12,
        textAlign: isRTL ? "right" : "left"
    },
    termsRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 20,
        paddingHorizontal: 2,
        gap: 15,
    },

    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        backgroundColor: theme.secondary,
        alignItems: "center",
        justifyContent: "center",
    },

    forgetPassText: {
        marginTop: 20,
        color: theme.green,
        textAlign: isRTL ? "left" : "right",
    },
    checkboxActive: {
        backgroundColor: theme.btnPrimary,
        borderColor: theme.btnPrimary,
    },

    checkboxIcon: {
        fontSize: 16,
    },

    termsText: {
        flex: 1,
        minWidth: 0,
        color: theme.textSecondary,
        fontSize: 13.5,
    },

    link: {
        color: theme.primary,
        fontWeight: "600",
    },

    button: {
        marginTop: 20,
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
