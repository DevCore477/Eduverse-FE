import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        marginRight: 16,
        width: 190,
        height: 115,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        position:"relative",
    },
    textContainer:{
        paddingLeft:12,
        paddingTop:16
    },
    levelText: {
        color: theme.white,
        fontSize: 12,
    },
    nameText: {
        color: theme.white,
        fontSize: 16,
        fontWeight:"600"
    },
    image:{
        position:"absolute",
        right:0,
        bottom:0,
        width:130,
        height:90
    }

})
