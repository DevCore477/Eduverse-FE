
export const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

export function detectIdentifierType(identifier: string): "email" | "phone" {
    if (EMAIL_REGEX.test(identifier)) return "email";
    if (PHONE_REGEX.test(identifier)) return "phone";
    throw new Error("Invalid email or phone number");
}