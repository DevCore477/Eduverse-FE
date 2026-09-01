import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 40,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 100,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: "700",
      color: "#00AC56", // Green
      textAlign: "center",
    },
    headerSubtitle: {
      fontSize: 14,
      fontWeight: "400",
      color: "#00AC56", // Green
      textAlign: "center",
      marginTop: 4,
    },
    videoContainer: {
      width: "100%",
      height: 250,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: "#000",
      marginBottom: 24,
      position: "relative",
    },
    youtubeContainer: {
      width: "100%",
      height: 250,
      borderRadius: 16,
      overflow: "hidden",
    },
    video: {
      width: "100%",
      height: "100%",
    },
    videoControlsOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "space-between",
      padding: 12,
    },
    fullscreenButton: {
      alignSelf: "flex-end",
      padding: 8,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 8,
    },
    bottomControls: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 8,
      padding: 8,
      gap: 12,
    },
    controlButton: {
      padding: 4,
    },
    progressBarContainer: {
      flex: 1,
      height: 4,
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderRadius: 2,
      overflow: "hidden",
      marginHorizontal: 8,
    },
    progressBar: {
      height: "100%",
      backgroundColor: "#EC6F9E", // Pink
      borderRadius: 2,
    },
    timeText: {
      fontSize: 12,
      color: "#FFF",
      fontWeight: "500",
      minWidth: 45,
    },
    durationContainer: {
      marginBottom: 24,
    },
    durationLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#00AC56", // Green
      marginBottom: 8,
    },
    durationValue: {
      fontSize: 32,
      fontWeight: "700",
      color: "#333",
    },
    setsContainer: {
      marginBottom: 24,
    },
    setsLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#00AC56", // Green
      marginBottom: 12,
    },
    setsButtons: {
      flexDirection: "row",
      gap: 12,
    },
    setButton: {
      flex: 1,
      height: 50,
      borderRadius: 8,
      backgroundColor: "#E5E5E5",
      justifyContent: "center",
      alignItems: "center",
    },
    setButtonSelected: {
      backgroundColor: "#00AC56", // Green
    },
    setButtonText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#666",
    },
    setButtonTextSelected: {
      color: "#FFF",
    },
    messageText: {
      fontSize: 14,
      color: "#666",
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 20,
    },
    startButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: 200,
      height: 43,
      backgroundColor: "#FFDE3C", // Yellow - same as lesson intro
      borderRadius: 8,
      paddingHorizontal: 24,
      gap: 8,
      alignSelf: "center",
    },
    startButtonDisabled: {
      backgroundColor: "#E5E5E5",
    },
    startButtonText: {
      color: "#FFF", // White text - same as lesson intro
      fontSize: 14,
      fontWeight: "600",
    },
    startButtonTextDisabled: {
      color: "#999",
    },
    nextButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      width: 230,
      height: 43,

      backgroundColor: "#FFDE3C",
      borderRadius: 8,

      paddingHorizontal: 24,
      gap: 8, // RN 0.71+
    },

    nextButtonText: {
      color: "#FFF",
      fontSize: 14,
      fontWeight: "600",
    },
  });

