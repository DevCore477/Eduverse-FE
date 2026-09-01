import { EyeIcon, EyeOffIcon } from "@/assets/images";
import Button from "@/components/Button";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/screens/Register/components/registerForm.styles";
import { TRegister } from "@/types/auth";
import { RegisterData, RegisterSchema } from "@/types/schemas";
import { safeNavigate } from "@/utils/safeNavigator";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm, UseFormSetError } from "react-hook-form";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// Store form values outside component to persist across unmounts
const persistedFormValues: RegisterData = {
  firstName: "",
  lastName: "",
  identifier: "",
  password: "",
  accepted: false,
};

// Export function to clear persisted values (called on successful registration)
export const clearPersistedRegisterValues = () => {
  Object.assign(persistedFormValues, {
    firstName: "",
    lastName: "",
    identifier: "",
    password: "",
    accepted: false,
  });
};

interface RegisterFormProps {
  onFormSubmit: (data: TRegister, setError: UseFormSetError<RegisterData>,reset:any) => void;
}

export default function RegisterForm({ onFormSubmit }: RegisterFormProps) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { t, isRTL } = useTranslation()
  const themedStyles = styles(theme, isRTL);
  const router = useRouter()
  const pathname = usePathname()
  const hasRestored = useRef(false);

  const validationMessages = {
    passwordRequired: t("validation.passwordRequired"),
    passwordMinLength: t("validation.passwordMinLength"),
    emailRequired: t("validation.emailRequired"),
    emailValid: t("validation.emailValid"),
    passwordsDoNotMatch: t("validation.passwordsDoNotMatch"),
    confirmPasswordRequired: t("validation.confirmPasswordRequired"),
  };

  const { control, handleSubmit, setError, watch, reset, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(RegisterSchema(validationMessages)),
    defaultValues: persistedFormValues,
  });

  // Watch all form values to persist them
  const formValues = watch();

  // Persist form values whenever they change
  useEffect(() => {
    if (formValues.firstName || formValues.lastName || formValues.identifier || formValues.password || formValues.accepted) {
      Object.assign(persistedFormValues, formValues);
    }
  }, [formValues]);

  // Restore form values on mount
  useEffect(() => {
    if (!hasRestored.current) {
      const hasPersistedData = persistedFormValues.firstName || 
                                persistedFormValues.lastName || 
                                persistedFormValues.identifier || 
                                persistedFormValues.password;
      
      if (hasPersistedData) {
        reset(persistedFormValues);
        hasRestored.current = true;
      }
    }
  }, [reset]);

  const onSubmit = (data: RegisterData) => {
    onFormSubmit(data, setError,reset)
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1, marginTop: 16 }}
      behavior={"height"}
      keyboardVerticalOffset={120}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* First Name */}
          <Text style={themedStyles.label}>{t("register.firstName")}</Text>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder={t("register.enterFirstName")}
                placeholderTextColor={theme.placeHolderText}
                value={value}
                onChangeText={onChange}
                style={themedStyles.input}
              />
            )}
          />
          {errors.firstName && <Text style={themedStyles.error}>{errors.firstName.message}</Text>}

          {/* Last Name */}
          <Text style={themedStyles.label}>{t("register.lastName")}</Text>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder={t("register.enterLastName")}
                placeholderTextColor={theme.placeHolderText}
                value={value}
                onChangeText={onChange}
                style={themedStyles.input}
              />
            )}
          />
          {errors.lastName && <Text style={themedStyles.error}>{errors.lastName.message}</Text>}

          {/* Email */}
          <Text style={themedStyles.label}>{t("register.emailPhone")}</Text>
          <Controller
            control={control}
            name="identifier"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder={t("register.enterEmail")}
                placeholderTextColor={theme.placeHolderText}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                style={themedStyles.input}
              />
            )}
          />
          {errors.identifier && <Text style={themedStyles.error}>{errors.identifier.message}</Text>}

          {/* Password */}
          <Text style={themedStyles.label}>{t("register.password")}</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View style={{ position: "relative" }}>
                <TextInput
                  placeholder={t("register.enterPassword")}
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
                  {showPassword ?
                    <EyeIcon width={16} height={12} /> :
                    <EyeOffIcon width={16} height={12} />
                  }
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && <Text style={themedStyles.error}>{errors.password.message}</Text>}

          {/* Terms */}
          <Controller
            control={control}
            name="accepted"
            render={({ field: { value, onChange } }) => (
              <View>
                <View style={themedStyles.termsRow}>
                  <TouchableOpacity
                    onPress={() => onChange(!value)}
                    style={[themedStyles.checkbox, value && themedStyles.checkboxActive]}
                  >
                    {value && <Ionicons name="checkmark" size={16} color={theme.gray} />}
                  </TouchableOpacity>
                  <Text style={themedStyles.termsText}>
                    {t("register.byRegistering")}
                    <Text
                      style={themedStyles.link}
                      onPress={() =>
                        safeNavigate(router, pathname, {
                          pathname: "/(default-bg)/terms-and-condition",
                          params: { isPrivacy: "false" },
                        })
                      }
                    >
                      {t("register.termCondition")}
                    </Text>
                    {" "}
                    {t("register.and")}{" "}
                    <Text
                      style={themedStyles.link}
                      onPress={() =>
                        safeNavigate(router, pathname, {
                          pathname: "/(default-bg)/terms-and-condition",
                          params: { isPrivacy: "true" },
                        })
                      }
                    >
                      {t("register.privacy")}
                    </Text>.
                  </Text>
                </View>
                {errors.accepted && <Text style={themedStyles.error}>{errors.accepted.message}</Text>}
              </View>
            )}
          />

          {/* Submit Button */}
          <Button
            text={t("register.text")}
            style={[themedStyles.button, { marginTop: 30 }]}
            textStyle={themedStyles.buttonText}
            onPress={handleSubmit(onSubmit)}
            isGradient={true}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
