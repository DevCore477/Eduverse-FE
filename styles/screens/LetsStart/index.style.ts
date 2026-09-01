import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 44,
    },
    textContainer: {
        gap: 12,
        marginTop: 10,
    },
    congratsText: {
        color: theme.white,
        fontWeight: "700",
        fontSize: 20,
        textAlign: "center"
    },
    descText: {
        color: theme.white,
        maxWidth: 300,
        fontWeight: "500",
        fontSize: 14,
        textAlign: "center"
    },
    button: {
        flexDirection: "row",
        marginTop: 35,
        width: 180,
        height: 60,
        borderRadius: 10,
        padding: 16,
        gap: 4,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
    },
    buttonText: {
        color: theme.green,
        fontSize: 15,
        fontWeight: "700"
    }
})