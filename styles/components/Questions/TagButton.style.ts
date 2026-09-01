import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, btnWidth: number) =>
  StyleSheet.create({
    btnContainer: {
      height: 40,
      width: btnWidth,
      borderWidth: 1,
      borderRadius: 20,
      borderColor: theme.btnFormSecondary,
      flexDirection: "row",
      gap: 4,
      justifyContent: "center",
      alignItems: "center"
    },
    btnText: {
      color: theme.white,
      fontSize: 12,
      fontWeight: "600"
    },
    activeContainer: {
      borderWidth: 2,
      borderColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    activeText: {
      fontWeight: "700",
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2
    }
  });
