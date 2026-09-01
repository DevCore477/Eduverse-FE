import Button from "@/components/Button";
import OTPDisplay from "@/components/OtpDisplay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/screens/OtpVerify/components/otpVerifyForm.style";
import { TAcessPin } from "@/types/parent";
import { capitalizeFirstLetter } from "@/utils/caseConversions";
import React, { useRef, useState } from "react";
import {
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface VerifyPinFormProps {
    onFormSubmit: (data: TAcessPin) => void
    totalLength?: number;
    otpError?: string;
}

export default function VerifyPinForm({
    onFormSubmit,
    totalLength = 4,
    otpError
}: VerifyPinFormProps) {
    const theme = useTheme();
    const themedStyles = styles(theme);
    const user = useAppSelector((state) => state.parent.parent);
    const { t } = useTranslation()
    const [pin, setPin] = useState("");
    const inputRef = useRef<TextInput | null>(null);

    const handleChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setPin(numericText);
    };

    const handleSubmit = () => {
        if (pin.length === totalLength) {
            onFormSubmit({ token: "", pin: pin, parentId: user?.user.id })
        }
    };

    const handlePinDisplayPress = () => {
        Keyboard.dismiss();

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    };

    return (
        <View style={themedStyles.container}>
            <Text style={themedStyles.header}>{t("verifyPin.requestHead")}</Text>
            <Text style={themedStyles.subText}>{t("verifyPin.hello")}! {capitalizeFirstLetter(user?.user.firstName ?? "")} {capitalizeFirstLetter(user?.user.lastName ?? "")} {"\n"}
                {t("verifyPin.request")}</Text>

            <TouchableOpacity onPress={handlePinDisplayPress}>
                <OTPDisplay value={pin} totalLength={totalLength} />
            </TouchableOpacity>
            {otpError && <Text style={themedStyles.errorText}>{otpError}</Text>}

            <TextInput
                ref={inputRef}
                value={pin}
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
                text={t("verifyPin.btnText")}
                style={[themedStyles.button, { marginTop: 30 }]}
                textStyle={themedStyles.buttonText}
                onPress={handleSubmit}
                isGradient={true}
            />
        </View>
    );
}