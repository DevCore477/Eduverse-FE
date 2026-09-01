import { User } from "firebase/auth"
import { TUserSubscription } from "./auth"
import { RecentActivity, TPupilData } from "./pupil"

export type TParent = {
    id:string
    firstName: string
    lastName: string
    identifier: string
    pinCode: string
    createdAt: string
    profileImageBase64?: string
    subscription: TUserSubscription | null
    language?: "en" | "ar" | "fr"
}

export type TUpdateParent = Partial<TParent> & {
    token?: string
}
export type TAcessPin = {
    pin: string
    token?: string
    parentId?: string
}

export type TAuthenticate = {
    id?: string
    token?: string
}

export type TStatsOverview = {
    levelsPercent: number
    starsPercent: number
    badgesPercent: number
    pointsPercent?: number
}

export type TParenDashboardResponse = {
    overview: TStatsOverview
    pupils: TPupilData[]
    recentActivities: RecentActivity[]
}

export type TChangePassword = {
    user: User 
    newPassword: string
}
