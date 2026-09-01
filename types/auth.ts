import { User } from "firebase/auth"
import { TPlan } from "./pricingPlans"

export type TRegister = {
    identifier: string
    firstName: string
    lastName: string
    password: string
}


export type TTrailInfo = {
    trailStartDate?: Date;
    trailEndDate?: Date;
    trailStatus?: 'not_started' | 'active' | 'expired' | 'converted';
    maxPupilsAllowed?: number;
}

export type TAuthResponse = {
    token?: string
    refreshToken?: string
    user: TUser
}

export type TUser = {
    id: string
    identifier: string
    email?: string
    pinCode?: string
    phoneNumber?: string
    trailStartDate?: Date;
    trailEndDate?: Date;
    trailStatue?: 'not_started' | 'active' | 'expired' | 'converted';
    maxPupilsAllowed?: number;
    firstName: string
    lastName: string
    createdAt: string
    subscription: TUserSubscription | null
    language?: "en" | "ar" | "fr"
}
export type TUserSubscription = {
    id: string
    status: "pending" | "active" | "expired" | "cancelled"
    startDate: Date
    endDate: Date
    isUnderManualReview: boolean
    plan: TUserPlans
}

export type TUserPlans = Omit<TPlan, "allowedYears" | "description" | "createdAt">

export type TLogin = {
    identifier: string
    password: string
}

export type TForgetPassword = {
    identifier: string
}

export type TVerifyOtp = {
    identifier: string
    otp: string
}
export type TResendOtp = TForgetPassword


export type TResetPassword = {
    user: User | null
    newPassword: string
}

export type TUpdatePassword = {
    identifier: string
    password: string
    confirmPassword: string
}

export type PartialTResetPassword = Omit<TResetPassword, 'id'>;
export type PartialTUpdatePassword = Omit<TUpdatePassword, 'identifier'>;