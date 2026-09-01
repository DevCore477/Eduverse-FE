import { StyleSheet } from "react-native";

export const styles = (theme: any) =>
  StyleSheet.create({
  
    question: {
      fontSize: 26,
      fontWeight: "600",
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 24,
    },
    inputContainer: {
      paddingHorizontal: 10,
      gap: 20,
      position: "relative"
    },
    input: {
      flex: 1,
      backgroundColor: theme.white,
      borderRadius: 16,
      paddingHorizontal: 20,
      paddingVertical: 18,
      fontSize: 18,
      fontWeight: "500",
      color: "#2D1C1C",
      borderWidth: 2,
      borderColor: theme.gray,
    },
    disabledInput: {
      backgroundColor: theme.disabledBackground || '#E0E0E0',
      color: theme.disabledText || '#999',
      borderColor: theme.disabledBorder || '#CCCCCC',
    },
    correctInput: {
      borderColor: theme.success || '#00AC56',
      backgroundColor: 'rgba(0, 172, 86, 0.1)',
      paddingRight: 50, // Make space for the indicator on the right
    },
    incorrectInput: {
      borderColor: theme.error || '#FF3B30',
      backgroundColor: 'rgba(255, 59, 48, 0.1)',
      paddingRight: 50, // Make space for the indicator on the right
    },
    submitButton: {
      backgroundColor: theme.btnFormSecondary,
      paddingVertical: 18,
      width:150,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
    },
    submitButtonText: {
      color: "#fff",
      fontWeight: '700',
      fontSize: 18,
    },
    // Indicator styles for correct/incorrect answers
    indicatorContainer: {
      position: 'absolute',
      right: 12, // Position inside the input, next to the text
      top: '50%',
    },
    // Style when submit button is visible
    indicatorContainerWithButton: {
      position: 'absolute',
      right: 112, // input right (12) + submit button width (100)
      top: '50%',
      transform: [{ translateY: -12 }],
    },
    correctAnswerContainer: {
      marginTop: 20,
      padding: 16,
      backgroundColor: 'rgba(0, 172, 86, 0.1)',
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.success || '#00AC56',
      marginHorizontal: 10,
    },
    correctAnswerLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.success || '#00AC56',
      marginBottom: 8,
    },
    correctAnswerText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#2D1C1C",
    },
  });