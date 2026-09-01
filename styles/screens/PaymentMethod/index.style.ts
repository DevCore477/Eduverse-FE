import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, boxWidth: number, isRTL: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 44,
      gap: 32,
    },
    cardContainer: {
      flex: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: 16,
    },
    charglyCard: {
      width: boxWidth,
      height: boxWidth,
      justifyContent: "center",
      backgroundColor: theme.gray,
      alignItems: "center",
      borderRadius: 20,

      // iOS shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 4,

      // Android shadow
    },
    manuallyCard: {
      width: boxWidth,
      height: boxWidth,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,

      // iOS shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    manuallyText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.white,
      textAlign: "center",
    },
    pageHeading: {
      fontSize: 25,
      fontWeight: 700,
      color: theme.green,
      textAlign: isRTL ? "right" : "left",
    },
  });
