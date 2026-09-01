export interface TGetNotification {
    userId: string, notify: "parent" | "pupil" | undefined, pupilId?: string
}

export interface TNotification {
    id: string
    parentId: string
    pupilId?: string
    pupilName?: string
    title: string
    message: string
    type: string
    isRead: boolean
    payload: Record<string, any>;
    readAt: Date | null;
    createdAt: Date;
}