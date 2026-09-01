export interface ThemeType {
    primary: string
    secondary: string
    btnPrimary: string
    btnSecondary: string
    btnFormPrimary: string,
    btnFormSecondary: string
    borderPrimary: string
    borderSecondary: string
    text: string
    gray: string
    lightGray: string
    black: string
    placeHolderText: string
    dropdownBg: string
    textSecondary: string
    white: string
    green: string
    background: string
    error: string
    toastBg: string
    textDesc: string
    navBar: string
    submitBtnClr: string
    cancelBtnClr: string
    backArrow: string
}

export const FieldTypes = {
    EMAIL: "email",
    IDENTIFIER: "identifier",
    USER_NAME: "username",
    PASSWORD: "password",
    PHONE_NUMBER: "phone_number",
    INVALID_CREDS: "invalid_credentials",
    OTP: "otp",
    PIN: "pin",
    LOCKED: "locked"
} as const

export type TMappedBackendErrors = {
    field: string | null
    message: string
}

export type TBackendErrorResponse = {
    success: boolean;
    error: string;
    details?: string
}

export const DashboardTypes = {
    PUPIL: "pupil",
    PARENT: "parent"
} as const