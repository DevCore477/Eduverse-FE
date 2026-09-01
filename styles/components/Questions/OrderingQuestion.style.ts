import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    question: {
      fontSize: 26,
      fontWeight: "600",
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 24,
    },
    itemsContainer: {
      gap: 12,
      marginBottom: 20,
    },
    itemRow: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      paddingVertical: 2,
      paddingHorizontal: 12,
      width:"100%",
      gap: 12,
      borderWidth: 2,
      borderColor: "transparent",
      position: 'relative',
    },
    disabledItem: {
    },
    itemContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    orderNumber: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "#DAB500",

      justifyContent: "center",
      alignItems: "center",
    },
    orderNumberText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },

    correctOrderNumber: {
      backgroundColor: "#00AC56",
    },
    incorrectOrderNumber: {
      backgroundColor: "#FF3B30",
    },
    disabledOrderNumber: {
      backgroundColor: "#CCCCCC",
    },
    itemText: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      color: "#ffff",
    },
    correctText: {
      color: "#00AC56",
    },
    incorrectText: {
      color: "#FF3B30",
    },
    disabledText: {
      color: "#666666",
    },
    controls: {
      gap: 4,
    },
    controlButton: {
      padding: 4,
    },
    controlButtonDisabled: {
      opacity: 0.3,
    },
    submitButton: {
      backgroundColor: theme.btnFormSecondary,
      paddingVertical: 18,
      width: 150,
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
    // Indicator styles for tick/cross icons
    indicatorContainer: {
      position: 'absolute',
      right: 50,
      top: 30,
    },
    indicatorIcon: {
      width: 24,
      height: 24,
    },
  });