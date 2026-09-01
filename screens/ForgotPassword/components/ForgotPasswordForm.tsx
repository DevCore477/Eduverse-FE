import Button from "@/components/Button";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/screens/ForgotPassword/components/forgotPaswordForm.style";
import { TForgetPassword } from "@/types/auth";
import { ForgotPasswordData, ForgotPasswordSchema } from "@/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Text,
    TextInput,
    View
} from "react-native";


interface ForgotPasswordFormProps {
    onFormSubmit: (data: TForgetPassword) => void
}
export default function ForgotPasswordForm({ onFormSubmit }: ForgotPasswordFormProps) {
    const theme = useTheme();
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);

    const validationMessages = {
        passwordRequired: t("validation.passwordRequired"),
        passwordMinLength: t("validation.passwordMinLength"),
        emailRequired: t("validation.emailRequired"),
        emailValid: t("validation.emailValid"),
        passwordsDoNotMatch: t("validation.passwordsDoNotMatch"),
        confirmPasswordRequired: t("validation.confirmPasswordRequired"),
    };

    const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordData>({
        resolver: zodResolver(ForgotPasswordSchema(validationMessages)),
        defaultValues: {
            identifier: "",
        },
    });

    const onSubmit = (data: ForgotPasswordData) => {
        const forgetPasswordData: TForgetPassword = {
            ...data
        }
        onFormSubmit(forgetPasswordData)
    };

    return (
        <View style={{ marginTop: 32 }}>
            {/* Email */}
            <Text style={themedStyles.label}>{t("forgetPassword.email")}</Text>
            <Controller
                control={control}
                name="identifier"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder={t("forgetPassword.enterEmail")}
                        value={value}
                        placeholderTextColor={theme.placeHolderText}
                        onChangeText={onChange}
                        autoCapitalize="none"
                        style={themedStyles.input}
                    />
                )}
            />
            {errors.identifier && <Text style={themedStyles.error}>{errors.identifier.message}</Text>}

            {/* Submit Button */}
            <Button
                text={t("forgetPassword.btnText")}
                style={[themedStyles.button, { marginTop: 30 }]}
                textStyle={themedStyles.buttonText}
                onPress={handleSubmit(onSubmit)}
                isGradient={true}
            />
        </View>
    );
}
