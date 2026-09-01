import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (
  theme: ThemeType,
  paymentStatus: string,
  isRTL: boolean
) =>
  StyleSheet.create({
    container: {
        flexDirection: isRTL ? "row-reverse" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 18,
        borderRadius: 12
    },
    rightContainer: {
        flexDirection: isRTL ? "row-reverse" : "row",
        gap: 12,
        alignItems: "flex-start"
    },
    
    textContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: 8
    },
    planType:{
        flexDirection:"row",
        alignItems:"center"
    },
    planName:{
        color:theme.green,
        fontSize:18,

    },
    
    iconContainer: {
        backgroundColor: paymentStatus === "ACTIVE" ? "#00AC56" : "#D80027",
        padding: 10,
        gap: 10,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center"
    },
    price: {
        fontSize: 24,
        fontWeight: "600",
        color: "#EC6F9E",
        textAlign: "center"
    },
    dot: {
        width: 4,
        height: 4,
        backgroundColor: paymentStatus === "ACTIVE" ? "#00AC56" : "#D80027",
        borderRadius:2
    }
  })