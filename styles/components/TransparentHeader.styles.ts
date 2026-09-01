import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: 'transparent',
        paddingVertical: 12,   // optional
    },

    leftSection: {
        flex: 1 / 4,
        minWidth: 0,
        alignItems: 'flex-start',
        marginLeft: 12,
    },
    centerSection: {
        flex: 1,
        minWidth: 0,
        alignItems: 'center',
    },
    centerContentWrapper: {
        flex: 1,
        minWidth: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    rightSection: {
        flex: 1 / 4,
        minWidth: 0,
        alignItems: 'flex-end',
    }
});
