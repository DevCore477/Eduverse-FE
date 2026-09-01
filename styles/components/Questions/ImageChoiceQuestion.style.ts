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
      marginBottom: 30,
      lineHeight: 32,
    },
    imagesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
      justifyContent: "center",
    },
    imageButton: {
      width: "45%",
      alignItems: "center",
    },
    imageWrapper: {
      width: "100%",
      aspectRatio: 1,
      borderRadius: 20,
      padding: 4,
      justifyContent: "center",
      alignItems: "center",
    },
    selectedImage: {
      borderWidth: 4,
      borderColor: theme.white,
      shadowColor: theme.white,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    image: {
      width: "90%",
      height: "90%",
      borderRadius: 16,
    },
    imageLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
      marginTop: 8,
      textAlign: "center",
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
    correctIndicatorText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
    },
    incorrectIndicatorText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
    },
    selectedOption: {
      // borderWidth: 4,
      // borderColor: theme.white,
      shadowColor: theme.white,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    disabledOption: {
      opacity: 0.6,
    },
    disabledIcon: {
      opacity: 0.5,
    },
    disabledText: {
      opacity: 0.7,
    },
  });

