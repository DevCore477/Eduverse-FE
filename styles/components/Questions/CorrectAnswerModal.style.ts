import { StyleSheet } from "react-native";

export const styles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
    },
    topStarContainer: {
      position: "absolute",
      top: "50%",
      marginTop: -240,
      zIndex: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    modalContainer: {
      paddingTop: 30,
      paddingHorizontal: 30,
      paddingBottom: 65,
      width: 340,
      height: 480,
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
    },
    backgroundSvg: {
      position: "absolute",
      top: 50,
    },
    topContent: {
      paddingTop: 64,
      marginBottom: 4,
      marginRight:10,
      zIndex: 1,
    },
    message: {
      fontSize: 17,
      fontWeight: "600",
      color: "#FFFFFF",
      textAlign: "center",
      zIndex: 1,
    },
    congratsText: {
      fontSize: 28,
      fontWeight: "700",
      color: "#FFDE3C",
      textAlign: "center",
      marginTop: 8,
      zIndex: 1,
    },
    arrowButton: {
      width: 50,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
    },
    hintText: {
      fontSize: 13,
      fontWeight: "500",
      color: "#FFFFFF",
      textAlign: "center",
      lineHeight: 20,
      zIndex: 1,
      paddingHorizontal: 10,
    },
  });
