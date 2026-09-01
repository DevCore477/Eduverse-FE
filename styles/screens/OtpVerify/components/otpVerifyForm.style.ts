import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        marginTop: 30,
        alignItems: "center",
    },
    header: {
        fontSize: 24,
        fontWeight: "700",
        color: theme.green,
        textAlign: "center",
    },
    subText: {
        marginTop: 8,
        fontSize: 16,
        color: theme.placeHolderText,
        width: "70%",
        textAlign: "center",
    },
    errorText: {
        marginTop: 12,
        marginBottom: -4, 
        color: theme.error,   
        fontSize: 14,
        textAlign: "center",
        fontWeight: "500",
    },
    identifierText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: "500",
        color: theme.green,
        textAlign: "center",
    },
    hiddenInput: {
        // keep it off-screen but focusable
        position: "absolute",
        width: 1,
        height: 1,
        opacity: 0,
        left: -100,
    },
    button: {
        marginTop: 30,
        height: 60,
        backgroundColor: theme.btnFormPrimary,
        borderRadius: 10,
        alignItems: 'center',
        width: "100%"
    },
    buttonText: {
        color: theme.btnFormSecondary,
        fontWeight: '600',
        fontSize: 16,
        textAlign: "center"
    },
});
