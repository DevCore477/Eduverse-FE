import { flexRowLabelGroup } from "@/styles/common/flexRowLabel";
import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 40,
      paddingBottom: 40,
    },
    signInText: {
      fontSize: 26,
      fontWeight: 700,
      color: theme.green,
    },
    row: {
      ...flexRowLabelGroup,
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "center",
      marginTop: 24,
    },

    moveToRegister: {
      textAlign: "center",
      color: theme.text,
    },
    link: {
      color: theme.green,
      fontWeight: "600",
    },
  });
