import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    optionsGrid: {
      flexGrow: 1,
      gap: 20,
      paddingHorizontal: 16,
      paddingBottom: 16
    },
    writingType: {
      color: theme.btnFormSecondary,
      fontSize: 28,
      fontWeight: "600",
      textAlign: "center"
    },
    writingContext: {
      fontWeight: "500",
      color: theme.white,
      fontSize: 20,
      textAlign: "right"
    },
    writingRequiredText: {
      fontWeight: "500",
      color: theme.btnFormSecondary,
      fontSize: 20,
      textAlign: "right"
    },

    writingRequiredRow: {
      flexDirection: "row-reverse",
      // alignItems: "flex-start",
      gap: 12,
    },
    writingRequired: {
      fontSize: 18,
      color: theme.white,
      textAlign: "right",
      paddingLeft: 32
    },
    instructionContainer: {
      paddingVertical: 32,
      paddingHorizontal: 16,
      gap: 12,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    instructionIconContainer: {
      width: 60, height: 60,
      paddingVertical: 24,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
    },
    instructionContainerHeading: {
      fontWeight: "600",
      fontSize: 18,
      color: theme.white,
      textAlign: "center"
    },
    instructionContainerText: {
      fontWeight: "500",
      fontSize: 16,
      color: theme.white,
      textAlign: "center"
    },
    finishedButton: {
      width: 160,
      height: 43,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      gap: 8,
      elevation: 4,
    },
    finishedButtonText: {
      color: theme.white,
      fontSize: 14,
      fontWeight: "600",
    },
  });

