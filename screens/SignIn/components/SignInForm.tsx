import { EyeIcon, EyeOffIcon } from "@/assets/images";
import Button from "@/components/Button";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/screens/SignIn/components/singInForm.style";
import { TLogin } from "@/types/auth";
import { SignInData, SignInSchema } from "@/types/schemas";
import { safeNavigate } from "@/utils/safeNavigator";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface SignInFormProps {
    onFormSubmit: (data: TLogin) => void
}

export default function SignInForm({ onFormSubmit }: SignInFormProps) {
    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter()
    const pathname = usePathname()
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

    const { control, handleSubmit, formState: { errors } } = useForm<SignInData>({
        resolver: zodResolver(SignInSchema(validationMessages)),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = (data: SignInData) => {
        onFormSubmit(data)
    };

    return (
        <View style={{ marginTop: 16 }}>
            {/* Email */}
            <Text style={themedStyles.label}>{t("signIn.emailPhone")}</Text>
            <Controller
                control={control}
                name="identifier"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder={t("signIn.enterEmail")}
                        placeholderTextColor={theme.placeHolderText}
                        value={value}
                        onChangeText={onChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={themedStyles.input}
                    />
                )}
            />
            {errors.identifier && <Text style={themedStyles.error}>{errors.identifier.message}</Text>}

            {/* Password */}
            <Text style={[themedStyles.label]}>{t("signIn.password")}</Text>
            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                    <View style={{ position: "relative" }}>
                        <TextInput
                            placeholder={t("signIn.enterPassword")}
                            placeholderTextColor={theme.placeHolderText}
                            value={value}
                            secureTextEntry={!showPassword}
                            onChangeText={onChange}
                            style={themedStyles.input}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={themedStyles.eyeButton}
                        >
                            {showPassword ?
                                <EyeIcon width={16} height={12} /> :
                                <EyeOffIcon width={16} height={12} />
                            }
                        </TouchableOpacity>
                    </View>
                )}
            />
            {errors.password && <Text style={themedStyles.error}>{errors.password.message}</Text>}

            <TouchableOpacity onPress={() => safeNavigate(router, pathname, "/(default-bg)/forgot-password")}>
                <Text style={themedStyles.forgetPassText}>{t("signIn.forget")}</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <Button
                text={t("signIn.text")}
                style={[themedStyles.button, { marginTop: 30 }]}
                textStyle={themedStyles.buttonText}
                onPress={handleSubmit(onSubmit)}
                isGradient={true}
            />
        </View>
    );
}
