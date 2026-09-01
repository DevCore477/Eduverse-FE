import { StyleSheet } from "react-native";

export const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    question: {
      fontSize: 24,
      fontWeight: "700",
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 32,
    },
    optionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
      justifyContent: "center",
      paddingHorizontal: 10,
    },
    optionGradient: {
      flex: 1,
      borderRadius: 20,
      justifyContent: "flex-start",
      alignItems: "center",
      width: 170,
      height: 120,
      padding: 10
    },
    scrollContainer: {
      flex: 1,
      marginBottom: 16,
    },
    columnsContainer: {
      flexDirection: "row",
      gap: 12,
      paddingBottom: 20,
    },
    column: {
      flex: 1,
      gap: 10,
    },
    columnTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 8,
    },
    itemButton: {
      backgroundColor: theme.white,
      paddingVertical: 16,
      paddingHorizontal: 14,
      borderRadius: 12,
      minHeight: 60,
      justifyContent: "center",
      position: 'relative',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    rightItem: {
      backgroundColor: theme.gray,
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
    correctItem: {
      backgroundColor: "rgba(0, 172, 86, 0.15)",
      borderWidth: 2,
      borderColor: "#00AC56",
    },
    incorrectItem: {
      backgroundColor: "rgba(255, 59, 48, 0.15)",
      borderWidth: 2,
      borderColor: "#FF3B30",
    },
    disabledOption: {
      opacity: 0.6,
    },
    itemText: {
      marginTop: 24,
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
      textAlign: "center"
    },
    disabledText: {
      color: "#999999",
    },
    correctText: {
      color: "#00AC56",
    },
    incorrectText: {
      color: "#FF3B30",
    },
    starIcon: {
      position: "absolute",
      left: 8,
      top: 10,
      width: 24,
      height: 24
    },
    disabledIcon: {
      opacity: 0.5,
    },
    matchedText: {
      fontSize: 12,
      fontWeight: "500",
      color: theme.primary,
      textAlign: "center",
      marginTop: 4,
    },
    leftItemContainer: {
      position: 'relative',
    },
    removeButton: {
      position: "absolute",
      top: 5,
      right: 5,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: "#FF5252",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2,
    },
    removeButtonText: {
      fontSize: 10,
      textAlign: "center",
      fontWeight: "700",
      color: "#FFFFFF",
    },
    indicatorContainer: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: [{ translateY: -12 }],
    },
    indicatorIcon: {
      width: 24,
      height: 24,
    },
    submitButton: {
      backgroundColor: theme.btnFormSecondary,
      paddingVertical: 18,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
      fontSize: 18,
      fontWeight: "700",
      color: "#ffff",
    },
  });