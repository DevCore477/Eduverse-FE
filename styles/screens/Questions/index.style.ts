import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40,
      paddingBottom: 44,
      // paddingHorizontal: 16,
      gap: 20
    },
    tagBtnContainer: {
      height: 70,
      paddingHorizontal: 16,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between"
    },
    headerContainer: {
      paddingHorizontal: 20,
      alignItems: "center",
    },
    subjectTitle: {
      fontSize: 26,
      fontWeight: "700",
      color: "#FFFFFF",
      textAlign: "center",
    },
    levelText: {
      fontSize: 14,
      fontWeight: "400",
      color: "#FFFFFF",
      opacity: 0.9,
      marginTop: 4,
    },
    progressContainer: {
      width: "100%",
      alignItems: "center",
    },
    progressText: {
      fontSize: 12,
      color: "#FFFFFF",
      textAlign: "center",
      marginVertical: 10,
    },
    pointsText: {
      fontSize: 12,
      fontWeight: "500",
      color: "#FFFFFF",
    },
    questionNumber: {
      fontSize: 20,
      fontWeight: "500",
      color: "#FFFFFF",
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    errorText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.error,
      textAlign: "center",
      padding: 20,
    },
    hintContainer: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginHorizontal: 20,
      marginBottom: 16,
      borderRadius: 12,
    },
    hintCorrect: {
      backgroundColor: "#4CAF50",
    },
    hintWrong: {
      backgroundColor: "#FF5252",
    },
    hintText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
      textAlign: "center",
    },
    scoreContainer: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
    },
    scoreText: {
      fontSize: 12,
      color: "#FFFFFF",
    },
    questionContainer: {
      flex: 1,
      gap: 50,
      paddingHorizontal:16
    },
    questionText: {
      fontSize: 18,
      fontWeight: "500",
      color: "#FFFFFF",
      flexWrap: 'wrap',
      flexShrink: 1
    },
    IntegrationQuestionContainer: {
      flex: 1,
      gap: 8
    },
    integrationPracHeading: {
      fontSize: 32,
      fontWeight: "700",
      color: theme.white,
      textAlign: "center",
      width: 300
    },
    integrationPracQuestion: {
      fontSize: 32,
      fontWeight: "600",
      color: theme.white,
      textAlign: "center"
    },

    answeredBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      alignSelf: 'center',
      marginBottom: 16,
      marginTop: 8,
    },
    correctBadge: {
      backgroundColor: '#E8F5E8',
      borderWidth: 2,
      borderColor: '#00AC56',
    },
    incorrectBadge: {
      backgroundColor: '#FFEBEE',
      borderWidth: 2,
      borderColor: '#FF0000',
    },
    answeredText: {
      fontWeight: '600',
      fontSize: 14,
    },
    correctBadgeText: {
      color: '#2E7D32',
    },
    incorrectBadgeText: {
      color: '#D32F2F',
    },
    nextButton: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      alignItems: 'center',
      marginTop: 24,
      marginHorizontal: 16,
    },
    nextButtonText: {
      color: "#fff",
      fontWeight: '600',
      fontSize: 12,
    },
    retryButton: {
      backgroundColor: '#FF6B6B',
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
      marginHorizontal: 16,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    retryButtonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 18,
    },
  });

