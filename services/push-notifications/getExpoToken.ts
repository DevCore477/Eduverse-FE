import * as Notifications from 'expo-notifications'

export async function getExpoToken() {
  const { status } = await Notifications.requestPermissionsAsync()
  if (status !== 'granted') return null

  return (await Notifications.getExpoPushTokenAsync()).data
}
