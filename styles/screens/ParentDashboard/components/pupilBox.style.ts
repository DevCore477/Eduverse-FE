import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType,width:number) => StyleSheet.create({
    container: {
        width: width,
        height: 140,
        borderRadius: 20,
        backgroundColor: "#E0DFF180",
        borderColor: theme.gray,
        justifyContent: "center",
        alignItems: "center"
    },
    addText: {
        color: theme.primary,
        fontSize: 16,
        fontWeight: "500",
        textAlign:"center"
    },
    text: {
        color: theme.white,
        fontSize: 16,
        fontWeight: "500"
    }

})
