import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 40,
      gap: 32
    },
    greetingContainer: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 16,
      marginLeft: 10
    },
    greeting: {
      fontSize: 26,
      fontWeight: "700",
      color: theme.green,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: "400",
      color: theme.text,
      textAlign: "center",
      opacity: 0.7,
    },
    iconCircle: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: "#00AC56", // soft green like Figma
      alignItems: "center",
      justifyContent: "center",
      marginTop: -30,
    },

    list: {
      flex: 1, // Takes remaining space, pushing navbar to bottom
    },
    listContainer: {
      gap: 16,
      paddingBottom:20
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 12,
    },
  });
