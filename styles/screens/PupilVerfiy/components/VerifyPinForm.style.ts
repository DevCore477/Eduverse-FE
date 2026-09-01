import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        alignItems: "center",
    },
    header: {
        fontSize: 24,
        fontWeight: "700",
        color: theme.green,
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
        backgroundColor: theme.white,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent:"center",
        width: "100%"
    },
    buttonText: {
        color: theme.green,
        fontWeight: '600',
        fontSize: 16,
        textAlign: "center"
    },
});
