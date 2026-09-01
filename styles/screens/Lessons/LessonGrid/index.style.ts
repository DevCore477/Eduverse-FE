import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 40,
      gap: 25,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    progressIndicators: {
      flexDirection: "row",
      gap: 8,
    },
    indicator: {
      width: 12,
      height: 6,
      borderRadius: 3,
    },
    pageHeading: {
      fontSize: 26,
      fontWeight: "700",
      color: theme.green,
      textAlign: "center",
    },
    levelInfoSection: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      alignItems: "center",
      backgroundColor: theme.background,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      color: "#4CAF50",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.text,
      textAlign: "center",
      opacity: 0.7,
    },
    gridContainer: {
      paddingHorizontal: 12,
      paddingBottom: 20,
    },
    columnWrapper: {
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 12,
    },
    lessonCard: {
      flex: 0.48,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 20,
      justifyContent: "space-between",
      minHeight: 280,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    cardHeader: {
      alignItems: "flex-start",
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "rgba(255, 255, 255, 0.6)",
      alignItems: "center",
      justifyContent: "center",
    },
    cardContent: {
      gap: 4,
    },
    subjectText: {
      fontSize: 12,
      color: "rgba(255, 255, 255, 0.8)",
      fontWeight: "500",
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    emojiContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 12,
    },
    emoji: {
      fontSize: 64,
    },
    levelBadge: {
      alignItems: "flex-end",
    },
    levelText: {
      fontSize: 12,
      color: "rgba(255, 255, 255, 0.8)",
      fontWeight: "500",
    },
  });
