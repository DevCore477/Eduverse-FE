import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        width:"47%",
        height:180,
        borderRadius:20,
        justifyContent:"center",
        alignItems:"center"
    },
    text:{
        color:theme.white,
        fontSize:20,
        fontWeight:"600",
        textAlign:"center"
    }
    
})
