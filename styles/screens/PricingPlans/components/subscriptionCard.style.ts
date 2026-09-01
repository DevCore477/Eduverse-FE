import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      borderRadius: 20,
      padding: 14,
    },
    containerOne: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      minWidth: 0,
      gap: 8,
    },
    containerTwo: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    containerThree: {
      display: "flex",
      alignItems: "center",
    },
    priceNumber: {
      color: theme.white,
      fontSize: 18,
      fontWeight: 600,
    },
    priceText: {
      flex: 1,
      minWidth: 0,
      color: theme.white,
      marginTop: 4,
      fontSize: 10,
      fontWeight: 500,
    },
    deviceNumber: {
      color: theme.white,
      fontSize: 60,
      fontWeight: 600,
    },
    deviceText: {
      color: theme.white,
      fontSize: 18,
      fontWeight: 600,
    },
    planName: {
      color: theme.btnFormSecondary,
      fontSize: 18,
      fontWeight: 600,
    },
    planText: {
      color: theme.white,
      fontSize: 12,
      fontWeight: 500,
    },
  });
