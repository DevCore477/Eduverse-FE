import { axiosInstance, ENDPOINTS } from '@/config/api-config'
import { useMutation } from '@tanstack/react-query'
import { Platform } from 'react-native'
import { getExpoToken } from './getExpoToken'
// import { getFcmToken } from './getFcmToken'

// Register push token
export async function registerPushToken(role: 'parent' | 'pupil') {
  try {
    // let token = await getFcmToken()
    // let provider: 'fcm' | 'expo' = 'fcm'

    // if (!token) {
    //   token = await getExpoToken()
    //   provider = 'expo'
    // }

    const token = await getExpoToken()
    const provider = 'expo'

    if (!token) {
      console.warn('No push token available')
      return { success: false, reason: 'no_token' }
    }

    await axiosInstance.post(ENDPOINTS.notifications.register, {
      token,
      provider,
      role,
      platform: Platform.OS,
    })
    return { success: true, provider }
  } catch (error) {
    return { success: false, reason: 'api_error', error }
  }
}

// Mark notification as read
export const markNotificationAsRead = () => {
  return useMutation({
    mutationFn: async (id:string) => {
      const response = await axiosInstance.patch(ENDPOINTS.notifications.markAsRead(id))
      return response.data.data;
    }
  });
};


// Test notification
export async function testNotification() {
  try {
    const response = await axiosInstance.post(ENDPOINTS.notifications.test)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error }
  }
}
