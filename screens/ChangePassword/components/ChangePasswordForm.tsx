import Button from "@/components/Button";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/screens/CreatePassword/components/createPassword.style";
import { TChangePassword } from "@/types/parent";
import { ChangePasswordData, ChangePasswordSchema } from "@/types/schemas";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";


interface ChangePasswordFormProps {
    onFormSubmit: (data: TChangePassword) => void
}

export default function ChangePasswordForm({ onFormSubmit }: ChangePasswordFormProps) {
    const theme = useTheme();
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false)
    // const user = useAppSelector((state) => state.parent.parent);
    const [showConfirm, setShowConfirm] = useState(false);
    const auth = getAuth();

    const user = auth.currentUser;

    const validationMessages = {
        passwordRequired: t("validation.passwordRequired"),
        passwordMinLength: t("validation.passwordMinLength"),
        emailRequired: t("validation.emailRequired"),
        emailValid: t("validation.emailValid"),
        passwordsDoNotMatch: t("validation.passwordsDoNotMatch"),
        confirmPasswordRequired: t("validation.confirmPasswordRequired"),
    };

    const { control, handleSubmit, formState: { errors } } = useForm<ChangePasswordData>({
        resolver: zodResolver(ChangePasswordSchema(validationMessages)),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const onSubmit = (data: ChangePasswordData) => {
        if (user) {
            const newPasswordData: TChangePassword = {
                user: user,
                newPassword: data.newPassword,
            }
            onFormSubmit(newPasswordData)
        } else { console.error("Current user not found from getAuth()") }
    };

    return (
        <View>
            <Text style={themedStyles.label}>{t("changePassword.currentPass")}</Text>
            <Controller
                control={control}
                name="currentPassword"
                render={({ field: { onChange, value } }) => (
                    <View style={{ position: "relative" }}>
                        <TextInput
                            placeholder={t("changePassword.enterCurrPass")}
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
            {errors.currentPassword && <Text style={themedStyles.error}>{errors.currentPassword.message}</Text>}

            {/* New Password */}
            <Text style={themedStyles.label}>{t("changePassword.newPass")}</Text>
            <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, value } }) => (
                    <View style={{ position: "relative" }}>
                        <TextInput
                            placeholder={t("changePassword.enterNewPass")}
                            placeholderTextColor={theme.placeHolderText}
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry={!showNewPassword}
                            style={themedStyles.input}
                        />
                        <TouchableOpacity
                            onPress={() => setShowNewPassword(!showNewPassword)}
                            style={themedStyles.eyeButton}
                        >
                            <Ionicons
                                name={showNewPassword ? "eye-off" : "eye"}
                                size={20}
                                color="#B6B1B2"
                            />
                        </TouchableOpacity>
                    </View>
                )}
            />
            {errors.newPassword && <Text style={themedStyles.error}>{errors.newPassword.message}</Text>}

            {/* Confirm New Password */}
            <Text style={themedStyles.label}>{t("changePassword.confirmPass")}</Text>
            <Controller
                control={control}
                name="confirmNewPassword"
                render={({ field: { onChange, value } }) => (
                    <View style={{ position: "relative" }}>
                        <TextInput
                            placeholder={t("changePassword.enterConfirmPass")}
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
            {errors.confirmNewPassword && (
                (!errors.newPassword && errors.confirmNewPassword.message !== "Passwords do not match") ? (
                    <Text style={themedStyles.error}>
                        Please re-enter your new password.                        
                    </Text>
                ) : (
                    <Text style={themedStyles.error}>
                        {errors.confirmNewPassword.message}
                    </Text>
                )
            )}

            {/* Submit Button */}
            <Button
                text={t("changePassword.btnText")}
                style={[themedStyles.button, { marginTop: 30 }]}
                textStyle={themedStyles.buttonText}
                onPress={handleSubmit(onSubmit)}
                isGradient={true}
            />
        </View>
    );
}
