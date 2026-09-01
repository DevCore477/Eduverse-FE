import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isEn: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 44,
    },
    image: {
        width: "100%",
        aspectRatio: 1,
        resizeMode: "contain"
    },
    textSection: {
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        marginBottom: isEn ? 50 : 30
    },
    title: {
        color: theme.green,
        fontSize: 20,
        fontWeight: 700,
        textAlign: "center"
    },
    description: {
        textAlign: 'center',
        width: "90%",
        color: theme.textSecondary,
        fontSize: 14
    },
    buttonSection: {
        flexDirection: "column",
        gap: 20 ,
    },
    registerButton: {
        height: 60,
        borderRadius: 10,
        alignItems: 'center',
    },
    registerButtonText: {
        color: theme.btnFormSecondary,
        fontWeight: '600',
        fontSize: 16,
        textAlign: "center"
    },
    orSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
    },
    orLine: {
        width: 60, height: 1, backgroundColor: theme.textSecondary
    },
    orText: {
        marginHorizontal: 10, color: theme.textSecondary
    },
    signInButton: {
        height: 60,
        padding: 16,
        backgroundColor: theme.background,
        borderWidth: 1,
        borderColor: theme.borderPrimary,
        borderRadius: 10,
        alignItems: 'center',
    },
    signInButtonText: {
        color: theme.green,
        fontWeight: '600',
        fontSize: 16
    },
})