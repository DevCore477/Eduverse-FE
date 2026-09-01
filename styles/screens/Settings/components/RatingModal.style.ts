import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            justifyContent: "center",
            alignItems: "center",
        },
        modalContent: {
            width: 340,
            height: 300, // Increased height to accommodate the comment input
            backgroundColor: theme.green,
            borderWidth: 6,
            borderRadius: 32,
            borderColor: theme.white,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
        },
        closeButton: {
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 100,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
        },
        closeButtonInner: {
            width: 38,
            height: 38,
            justifyContent: "center",
            alignItems: "center",
        },
        title: {
            fontSize: 18,
            fontWeight: 700,
            color: theme.white,
            marginBottom: 10,
        },
        subTitle: {
            fontSize: 14,
            color: theme.white,
            marginBottom: 20,
        },
        successText: {
            color: '#4CAF50', // Green color for success
            fontSize: 16,
            marginTop: 12,
            textAlign: 'center',
            fontFamily: 'YourFontFamily-SemiBold',
        },
        successContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            gap: 10,
        },
        starContainer: {
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 10,
        },
        errorText: {
            color: '#FF3B30',
            fontSize: 14,
            marginBottom: 8,
            textAlign: 'center',
        },
        commentInput: {
            height: 50,
            width: "100%",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.white,
            paddingHorizontal: 10,
            color: theme.text,
            marginBottom: 20,
            fontSize: 14,
        },
        btnActionContainer: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
        },
    });
