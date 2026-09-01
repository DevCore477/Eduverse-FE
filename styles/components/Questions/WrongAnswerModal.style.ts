import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (
  theme: ThemeType,
  isAttemptsFinished: boolean,
  isNoCorrectAnswerWarning?: boolean,
) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    topStarContainer: {
      position: "absolute",
      top: "50%",
      marginTop: -254,
      zIndex: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    modalContainer: {
      paddingTop: 50,
      paddingHorizontal: 30,
      paddingBottom: 65,
      width: 340,
      height: 520,
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
      justifyContent: "center",
      gap: 14
    },
    backgroundSvg: {
      position: "absolute",
      top: 0,
      left: 0,
    },
    message: {
      fontSize: 17,
      fontWeight: "600",
      color: "#FFFFFF",
      textAlign: "center",
      marginTop: 5,
      zIndex: 1,
    },
    tryAgainText: {
      fontSize: 26,
      fontWeight: "700",
      color: "#ffff",
      textAlign: "center",
      marginTop: 8,
      zIndex: 1,
    },
    hintContainer: {
      paddingHorizontal: 20,
      zIndex: 1,
      gap: 2,
    },
    hintLabel: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FFDE3C",
      textAlign: "center",
    },
    hintText: {
      fontWeight: "500",
      color: "#FFFFFF",
      textAlign: "center",
      lineHeight: 22,
    },
    btnContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        isAttemptsFinished || isNoCorrectAnswerWarning
          ? "center"
          : "space-between",
    },
    button: {
      // width: 100,
      // height: 39,
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 30,
      flexDirection: "row",
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
    },
    btnText: {
      fontSize: 12,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });
