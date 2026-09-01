import { StyleSheet } from "react-native";

export const styles = (theme: any) =>
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
    optionsGrid: {
      flexDirection: "column",
      flexWrap: "wrap",
      gap: 16,
      justifyContent: "center",
      paddingHorizontal: 10,
    },
    optionButton: {
      width: "100%",
      // aspectRatio: 1,
    },
    starIcon: {
      position: "absolute",
      left: 8,
      top: 10,
      width: 24,
      height: 24,
    },
    optionGradient: {
      flex: 1,
      borderRadius: 20,
      justifyContent: "flex-start",
      alignItems: "center",
      width: "100%",
      height: "auto",
      padding: 10,
    },
    selectedOption: {
      // borderWidth: 4,
      // borderColor: theme.white,
      shadowColor: theme.white,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    optionNumber: {
      marginTop: 18,
      fontSize: 18,
      fontWeight: "700",
      color: "#FFFFFF",
      textAlign: "center",
    },
    correctIndicator: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    incorrectIndicator: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    correctIndicatorText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 14,
    },
    incorrectIndicatorText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 14,
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
  });
