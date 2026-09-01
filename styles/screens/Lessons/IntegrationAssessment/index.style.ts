import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 50,
    },
    loadingText: {
      fontSize: 16,
      color: "#FFF",
    },
    titleSection: {
      marginBottom: 30,
      paddingHorizontal: 10,
    },
    titleText: {
      fontSize: 22,
      fontWeight: "700",
      color: "#FFF",
      marginBottom: 10,
    },
    descriptionText: {
      fontSize: 14,
      color: "#FFF",
      lineHeight: 20,
      opacity: 0.9,
    },
    questionsBox: {
      borderRadius: 16,
      borderWidth: 2,
      borderColor: "#FFF",
      padding: 20,
      marginBottom: 30,
      height: 400,
      overflow: "hidden",
    },
    questionsHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      justifyContent: "space-between",
    },
    questionsTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FFF",
    },
    starEmoji: {
      fontSize: 20,
    },
    questionsScroll: {
      flex: 1,
    },
    questionsContent: {
      paddingRight: 10,
    },
    questionItem: {
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.2)",
    },
    questionText: {
      fontSize: 15,
      fontWeight: "600",
      color: "#FFF",
      marginBottom: 12,
      lineHeight: 20,
    },
    optionsContainer: {
      marginLeft: 10,
      gap: 8,
    },
    optionButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },
    optionText: {
      fontSize: 14,
      color: "#FFF",
      lineHeight: 18,
    },
    noQuestionsText: {
      fontSize: 15,
      color: "#FFF",
      textAlign: "center",
      marginVertical: 20,
      fontStyle: "italic",
    },
    doneButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: "#FF6B9D",
      borderRadius: 8,
      gap: 8,
      marginTop: 10,
    },
    doneButtonText: {
      color: "#FFF",
      fontSize: 14,
      fontWeight: "600",
    },
  });
