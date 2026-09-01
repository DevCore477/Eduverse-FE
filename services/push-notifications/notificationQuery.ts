import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TGetNotification, TNotification } from "@/types/notification";
import { useQuery } from "@tanstack/react-query";

export const useGetNotifications = (data: TGetNotification) => {
    return useQuery<{ notifications: TNotification[]; unreadCount: number }, Error>({
        queryKey: ['getNotifications', { userId: data.userId, notify: data.notify, pupilId: data.pupilId }],
        queryFn: async () => {
            const response = await axiosInstance.get(ENDPOINTS.notifications.getAll(data.notify, data.pupilId))
            const notifications: TNotification[] = response.data.data;
            const filteredNotifications = notifications.filter(n => n.payload?.notify === data.notify);
            return {
                notifications: filteredNotifications,
                unreadCount: filteredNotifications.filter(n => !n.isRead).length
            };
        },
        enabled: !!data.userId,
        retry: 1,
        staleTime: 0,
    });
}
