import Button from "@/components/Button";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/screens/CreatePassword/components/createPassword.style";
import { PartialTUpdatePassword } from "@/types/auth";
import { NewPasswordData, NewPasswordSchema } from "@/types/schemas";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface NewPasswordFormProps {
    onFormSubmit: (data: PartialTUpdatePassword) => void;
}

export default function NewPasswordForm({ onFormSubmit }: NewPasswordFormProps) {
    const theme = useTheme();
    const { t, isRTL } = useTranslation();
    const themedStyles = styles(theme, isRTL);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const validationMessages = {
        passwordRequired: t("validation.passwordRequired"),
        passwordMinLength: t("validation.passwordMinLength"),
        emailRequired: t("validation.emailRequired"),
        emailValid: t("validation.emailValid"),
        passwordsDoNotMatch: t("validation.passwordsDoNotMatch"),
        confirmPasswordRequired: t("validation.confirmPasswordRequired"),
    };

    const { control, handleSubmit, formState: { errors }, reset } = useForm<NewPasswordData>({
        resolver: zodResolver(NewPasswordSchema(validationMessages)),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        reset({
            newPassword: "",
            confirmPassword: "",
        });
    }, [reset]);

    const onSubmit = (data: NewPasswordData) => {
        const newPasswordData: PartialTUpdatePassword = {
            password: data.newPassword,
            confirmPassword: data.confirmPassword,
        };
        onFormSubmit(newPasswordData);
    };

    return (
        <View>
            {/* New Password */}
            <Text style={themedStyles.label}>{t("createPassword.newPass")}</Text>
            <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, value } }) => (
                    <View style={{ position: "relative" }}>
                        <TextInput
                            placeholder={t("createPassword.enterNewPass")}
                            placeholderTextColor={theme.placeHolderText}
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry={!showPassword}
                            style={themedStyles.input}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={themedStyles.eyeButton}
                        >
                            <Ionicons
                                name={showPassword ? "eye-off" : "eye"}
                                size={20}
                                color="#B6B1B2"
                            />
                        </TouchableOpacity>
                    </View>
                )}
            />
            {errors.newPassword && <Text style={themedStyles.error}>{errors.newPassword.message}</Text>}

            {/* Confirm New Password */}
            <Text style={themedStyles.label}>{t("createPassword.confirmPass")}</Text>
            <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                    <View style={{ position: "relative" }}>
                        <TextInput
                            placeholder={t("createPassword.enterConfirmPass")}
                            placeholderTextColor={theme.placeHolderText}
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry={!showConfirm}
                            style={themedStyles.input}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirm(!showConfirm)}
                            style={themedStyles.eyeButton}
                        >
                            <Ionicons
                                name={showConfirm ? "eye-off" : "eye"}
                                size={20}
                                color="#B6B1B2"
                            />
                        </TouchableOpacity>
                    </View>
                )}
            />
            {errors.confirmPassword && <Text style={themedStyles.error}>{errors.confirmPassword.message}</Text>}

            {/* Submit Button */}
            <Button
                text={t("createPassword.btnText")}
                style={[themedStyles.button, { marginTop: 30 }]}
                textStyle={themedStyles.buttonText}
                onPress={handleSubmit(onSubmit)}
                isGradient={true}
            />
        </View>
    );
}
