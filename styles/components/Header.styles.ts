// import { StyleSheet } from "react-native";

// export const styles = StyleSheet.create({
//     container: {
//         height: 80,
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     transparentContainer: {
//         height: 80,
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         backgroundColor: 'transparent',
//         // paddingTop: 50,
//     },
//     leftSection: {
//         flex: 1/4,
//         alignItems: 'flex-start',
//         marginLeft:12,
//     },
//     centerSection: {
//         flex: 1,
//         alignItems: 'center',
//     },
//     rightSection: {
//         flex: 1/4,
//         alignItems: 'flex-end',
//         marginRight: 12,
//         justifyContent: 'center',
//         minHeight: 80,
//     }
// });

import { StyleSheet } from "react-native";

// export const styles = StyleSheet.create({
//     container: {
//         height: 80,
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     leftSection: {
//         flex: 1 / 4,
//         alignItems: 'flex-start',
//         marginLeft: 12,
//     },
//     centerSection: {
//         flex: 1,
//         alignItems: 'center',
//     },
//     rightSection: {
//         flex: 1 / 4,
//         alignItems: 'flex-end',
//         justifyContent: 'center',
//         minHeight: 80,
//     }
// });

export const styles = StyleSheet.create({
    container: {
        height: 80,
        flexDirection: "row",
        alignItems: "center",
    },
    leftSection: {
        width: 56,
        alignItems: "center",
        justifyContent: "center",
    },
    centerSection: {
        flex: 1,
        minWidth: 0,
        alignItems: "center",
        justifyContent: "center",
        marginLeft:-10
    },
    centerContentWrapper: {
        flex: 1,
        minWidth: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    rightSection: {
        width: 56,
        alignItems: "center",
        justifyContent: "center",
    },
    settingsPressable: {
        alignItems: "center",
        justifyContent: "center",
    },
});
