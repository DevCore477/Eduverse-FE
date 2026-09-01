import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 100,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: "700",
      color: "#FFF",
      textAlign: "center",
    },
    headerSubtitle: {
      fontSize: 14,
      fontWeight: "400",
      color: "#FFF",
      textAlign: "center",
      marginTop: 4,
    },
    audioSection: {
      alignItems: "center",
      marginTop: 40,
      marginBottom: 30,
    },
    playButton: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: "#FFDE3C", // Yellow
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    tapToPauseText: {
      fontSize: 14,
      color: "#FFF",
      marginBottom: 20,
    },
    waveformContainer: {
      width: "80%",
      paddingHorizontal: 10,
      marginRight: isRTL ? 0 : 18,
      marginLeft: isRTL ? 18 : 0,
    },
    waveform: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: 60,
      marginBottom: 10,
      backgroundColor: "transparent",
    },
    waveformBar: {
      width: 4,
      borderRadius: 2,
      marginHorizontal: 1,
    },
    timeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    timeText: {
      fontSize: 14,
      color: "#FFF",
      fontWeight: "500",
    },
    dragPointer: {
      position: "absolute",
      top: -5,
      width: 4,
      height: 70,
      backgroundColor: "#FFDE3C",
      borderRadius: 2,
      zIndex: 10,
    },
    dragTimeContainer: {
      position: "absolute",
      top: -30,
      backgroundColor: "#FFDE3C",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      transform: [{ translateX: -20 }],
    },
    dragTimeText: {
      fontSize: 12,
      color: "#000",
      fontWeight: "600",
    },
    introBox: {
      borderRadius: 16,
      borderWidth: 2,
      borderColor: "#FFF",
      padding: 20,
      marginBottom: 30,
      height: 250,
      overflow: "hidden",
    },
    introHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: 12,
    },
    introTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FFF",
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
    starEmoji: {
      fontSize: 20,
    },
    introTextScroll: {
      flex: 1,
    },
    scrollIndicator: {
      backgroundColor: "#FFDE3C",
    },
    introText: {
      fontSize: 18,
      color: "#FFF",
      lineHeight: 24,
    },
    highlightedWord: {
      color: "#FFD93D", // Yellow highlight
      fontWeight: "700",
      textDecorationLine: "underline",
    },
    emojiText: {
      fontSize: 24,
    },
    nextButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      paddingHorizontal: 20,
      paddingVertical: 12,

      backgroundColor: "#FFDE3C",
      borderRadius: 8,

      gap: 8, // RN 0.71+
    },
    nextButtonDisabled: {
      opacity: 0.5,
      backgroundColor: '#999', // or your disabled color
    },
    nextButtonText: {
      color: "#FFF",
      fontSize: 14,
      fontWeight: "600",
    },
  });
