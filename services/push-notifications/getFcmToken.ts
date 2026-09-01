// // import messaging from '@react-native-firebase/messaging'

// export async function getFcmToken() {
//   const authStatus = await messaging().requestPermission()
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL

//   if (!enabled) return null

//   return await messaging().getToken()
// }
