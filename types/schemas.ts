import { z } from "zod";

// Regex that supports English, Arabic, and French characters (including accented letters)
const NAME_REGEX = /^[A-Za-z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFÀ-ÖØ-öø-ÿ]+(?:[.\s][A-Za-z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFÀ-ÖØ-öø-ÿ]+)*$/;

export interface ValidationMessages {
  passwordRequired: string;
  passwordMinLength: string;
  emailRequired: string;
  emailValid: string;
  passwordsDoNotMatch: string;
  confirmPasswordRequired: string;
  privacyPolicy: string;
}

const defaultMessages: ValidationMessages = {
  passwordRequired: "Password is required",
  passwordMinLength: "Password must be at least 8 characters with 1 uppercase & 1 number",
  emailRequired: "Email Address is required",
  emailValid: "Please enter a valid email address",
  passwordsDoNotMatch: "Passwords do not match",
  confirmPasswordRequired: "Please confirm your password",
  privacyPolicy: "You must agree to Terms & Privacy",
};

export const RegisterSchema = (messages: ValidationMessages = defaultMessages) => z.object({
  firstName: z.string().trim().min(1, "First name is required").refine(
    (val) => val.replace(/[^A-Za-z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFÀ-ÖØ-öø-ÿ]/g, "").length <= 8,
    "Must be at most 8 letters"
  ).regex(NAME_REGEX, "Only letters are allowed"),
  lastName: z.string().trim().min(1, "Last name is required").refine(
    (val) => val.replace(/[^A-Za-z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFÀ-ÖØ-öø-ÿ]/g, "").length <= 8,
    "Must be at most 8 letters"
  ).regex(NAME_REGEX, "Only letters are allowed"),
  identifier: z
    .string()
    .trim()
    .min(1, messages.emailRequired)
    .refine(
      (val) =>
        /^\S+@\S+\.\S+$/.test(val),
      messages.emailValid
    ),
  password: z
    .string()
    .trim()
    .min(1, messages.passwordRequired)
    .regex(
      /^(?=.*[A-Z])(?=.*\d).{8,}$/,
      messages.passwordMinLength
    ),
  accepted: z.boolean().refine((val) => val === true, {
    message: messages.privacyPolicy,
  }),
});

export type RegisterData = z.infer<typeof RegisterSchema>;


export const SignInSchema = (messages: ValidationMessages = defaultMessages) => z.object({
  identifier: z
    .string()
    .trim()
    .min(1, messages.emailRequired)
    .refine(
      (val) =>
        /^\S+@\S+\.\S+$/.test(val),
      messages.emailValid
    ),
  password: z
    .string()
    .trim()
    .min(1, messages.passwordRequired)
    .regex(
      /^(?=.*[A-Z])(?=.*\d).{8,}$/,
      messages.passwordMinLength
    ),
});

export type SignInData = z.infer<typeof SignInSchema>;


export const ForgotPasswordSchema = (messages: ValidationMessages = defaultMessages) => z.object({
  identifier: z
    .string()
    .trim()
    .min(1, messages.emailRequired)
    .refine(
      (val) =>
        /^\S+@\S+\.\S+$/.test(val),
      messages.emailValid
    ),
});

export type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;


export const NewPasswordSchema = (messages: ValidationMessages = defaultMessages) => z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(1, messages.passwordRequired)
      .regex(
        /^(?=.*[A-Z])(?=.*\d).{8,}$/,
        messages.passwordMinLength
      ),
    confirmPassword: z
      .string()
      .trim()
      .min(1, messages.confirmPasswordRequired),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: messages.passwordsDoNotMatch,
    path: ["confirmPassword"],
  });

export type NewPasswordData = z.infer<typeof NewPasswordSchema>;


export const ChangePasswordSchema = (messages: ValidationMessages = defaultMessages) => z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(1, messages.passwordRequired),

    newPassword: z
      .string()
      .trim()
      .min(1, messages.passwordRequired)
      .regex(
        /^(?=.*[A-Z])(?=.*\d).{8,}$/,
        messages.passwordMinLength
      ),

    confirmNewPassword: z
      .string()
      .trim()
      .min(1, messages.confirmPasswordRequired),
  })
  .refine(
    (data) => data.newPassword === data.confirmNewPassword,
    {
      message: messages.passwordsDoNotMatch,
      path: ["confirmNewPassword"],
    }
  );

export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;


export const PupilSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").refine(
    (val) => val.replace(/[^A-Za-z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFÀ-ÖØ-öø-ÿ]/g, "").length <= 30,
    "Must be at most 30 letters"
  ).regex(NAME_REGEX, "Only letters are allowed"),
  lastName: z.string().trim().min(1, "Last name is required").refine(
    (val) => val.replace(/[^A-Za-z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFÀ-ÖØ-öø-ÿ]/g, "").length <= 30,
    "Must be at most 30 letters"
  ).regex(NAME_REGEX, "Only letters are allowed"),
  // age: z.number().min(1, "Age is required"),
  age: z.union([
    z.number().min(6, "Age must be at least 6 years").max(11, "Age must be at most 11 years"),
    z.null(),
    z.undefined()
  ]).refine(
    (val) => val !== null && val !== undefined,
    "Age is required"
  ),
  grade: z.string().trim().min(1, "Grade is required"),
});

export type PupilData = z.infer<typeof PupilSchema>;


export const ParentSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").refine(
    (val) => val.replace(/[^A-Za-z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFÀ-ÖØ-öø-ÿ]/g, "").length <= 8,
    "Must be at most 8 letters"
  ).regex(NAME_REGEX, "Only letters are allowed"),
  lastName: z.string().trim().min(1, "Last name is required").refine(
    (val) => val.replace(/[^A-Za-z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFÀ-ÖØ-öø-ÿ]/g, "").length <= 8,
    "Must be at most 8 letters"
  ).regex(NAME_REGEX, "Only letters are allowed"),
  identifier: z
    .string()
    .trim()
    .min(1, "Email Address is required")
    .refine(
      (val) =>
        /^\S+@\S+\.\S+$/.test(val),
      "Please enter a valid email address"
    ),
  pinCode: z
    .string()
    .trim()
    .min(4, "Pin code must be 4 digits")
    .max(4, "Pin code must be 4 digits"),
});

export type ParentData = z.infer<typeof ParentSchema>;
