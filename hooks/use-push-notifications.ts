import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import {axiosInstance} from "@/config/api-config";
import {Platform} from "react-native";
import {firebaseAuth} from "@/config/firebase";

export async function getFCMToken() {
    if (!Device.isDevice) {
        console.log("Must use physical device");
        return null;
    }

    const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        console.log("Permission not granted");
        return null;
    }

    const token = (
        await Notifications.getDevicePushTokenAsync()
    ).data;

    console.log("✅ FCM TOKEN:", token);
    const user = firebaseAuth.currentUser;
    if (!user) return;
    await axiosInstance.post("/notifications/register", {
        token: token,
        platform: Platform.OS,
    });}
