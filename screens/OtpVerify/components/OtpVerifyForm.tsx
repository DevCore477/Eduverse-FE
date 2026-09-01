import Button from "@/components/Button";
import OTPDisplay from "@/components/OtpDisplay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/screens/OtpVerify/components/otpVerifyForm.style";
import { TVerifyOtp } from "@/types/auth";
import React, { useRef, useState } from "react";
import {
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface OtpVerifyFormProps {
    identifier: string;
    displayText: string;
    onFormSubmit: (data: TVerifyOtp) => void
    totalLength?: number;
    otpError?: string;
}

export default function OtpVerifyForm({
    identifier,
    displayText,
    onFormSubmit,
    totalLength = 6,
    otpError
}: OtpVerifyFormProps) {
    const theme = useTheme();
    const { t } = useTranslation();
    const themedStyles = styles(theme);

    const [otp, setOtp] = useState("");
    const inputRef = useRef<TextInput | null>(null);

    const handleChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setOtp(numericText);
    };

    const handleSubmit = () => {
        if (otp.length === totalLength) {
            const data: TVerifyOtp = {
                identifier,
                otp
            }
            onFormSubmit(data)
        }
    };

    const handleOtpDisplayPress = () => {
        // First dismiss any existing keyboard
        Keyboard.dismiss();

        // Small delay to ensure dismiss is complete
        setTimeout(() => {
            // Then focus the input
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    };

    return (
        <View style={themedStyles.container}>
            <Text style={themedStyles.header}>{t("otpVerify.verifyOtpCode")}</Text>
            <Text style={themedStyles.subText}>{displayText}</Text>
            <Text style={themedStyles.identifierText}>{identifier}</Text>

            <TouchableOpacity onPress={handleOtpDisplayPress}>
                <OTPDisplay value={otp} totalLength={totalLength} />
            </TouchableOpacity>
            {otpError && <Text style={themedStyles.errorText}>{otpError}</Text>}

            <TextInput
                ref={inputRef}
                value={otp}
                onChangeText={handleChange}
                onSubmitEditing={handleSubmit}
                keyboardType="number-pad"
                maxLength={totalLength}
                style={{ height: 0, width: 0 }}
                autoFocus={true}
                showSoftInputOnFocus={true}
                autoCapitalize="none"
                autoCorrect={false}
            />

            <Button
                text={t("otpVerify.verifyButton")}
                style={[themedStyles.button, { marginTop: 30 }]}
                textStyle={themedStyles.buttonText}
                onPress={handleSubmit}
                isGradient={true}
            />
        </View>
    );
}