import { FieldTypes, TMappedBackendErrors } from "@/types/global";

const errorFieldMap = [
    { keyword: "email", field: FieldTypes.EMAIL },
    { keyword: "identifier", field: FieldTypes.IDENTIFIER },
    { keyword: "username", field: FieldTypes.USER_NAME },
    { keyword: "password", field: FieldTypes.PASSWORD },
    { keyword: "phone number", field: FieldTypes.PHONE_NUMBER },
    { keyword: "otp", field: FieldTypes.OTP },
    { keyword: "pin", field: FieldTypes.PIN },
    { keyword: "credentials", field: FieldTypes.INVALID_CREDS },
    { keyword: "invalid-credential", field: FieldTypes.INVALID_CREDS },
    { keyword: "locked", field: FieldTypes.LOCKED }

]

export function mapBackendError(message: string): TMappedBackendErrors {
    if (!message) {
        return { field: null, message: "Try again Later" };
    }

    const normalizedMsg = message.toLowerCase();
    for (const { keyword, field } of errorFieldMap) {
        if (normalizedMsg.includes(keyword.toLowerCase())) {
            return { field, message };
        }
    }

    return { field: null, message: "Try again Later" };
}
