import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
    },
    question: {
      fontSize: 26,
      fontWeight: "600",
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 24,
    },
    optionsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
      justifyContent: "center",
      paddingHorizontal: 10,
    },
    optionButton: {
      flex: 1,
    },
    optionGradient: {
      flex: 1,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      width: 160,
      height: 80,
      padding: 10
    },
    starIcon: {
      position: "absolute",
      left: 8,
      top: 10,
      width: 24,
      height: 24
    },
    selectedOption: {
      shadowColor: theme.white,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    optionText: {
      marginTop: 2,
      fontSize: 20,
      fontWeight: "700",
      color: "#FFFFFF",
      textAlign: "center"
    },
    disabledOption: {
      opacity: 0.6,
    },
    disabledIcon: {
      opacity: 0.5,
    },
    disabledText: {
      opacity: 0.7,
    },
    correctIndicator: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    incorrectIndicator: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    correctIndicatorText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
    },
    incorrectIndicatorText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
    },
  });

