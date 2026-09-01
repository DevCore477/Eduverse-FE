import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, size: number) =>
  StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    },
    centerContent: {
      position: "absolute",
      alignItems: "center",
    },
    label: {
      fontSize: 12,
      color: theme.text,
    },
    value: {
      fontSize: 16,
      fontWeight: "600",
    },
  });
