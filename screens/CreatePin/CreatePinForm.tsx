import Button from "@/components/Button";
import OTPDisplay from "@/components/OtpDisplay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/screens/OtpVerify/components/otpVerifyForm.style";
import { TUpdateParent } from "@/types/parent";
import { capitalizeFirstLetter } from "@/utils/caseConversions";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import {
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface CreatePinFormProps {
    onFormSubmit: (data: TUpdateParent) => void
    totalLength?: number;
    otpError?: string;
}

export default function CreatePinForm({
    onFormSubmit,
    totalLength = 4,
    otpError
}: CreatePinFormProps) {
    const theme = useTheme();
    const themedStyles = styles(theme);
    const user = useAppSelector((state) => state.parent.parent);
    const [pin, setPin] = useState("");
    const { t } = useTranslation()
    const inputRef = useRef<TextInput | null>(null);

    const handleChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setPin(numericText);
    };

    const handleSubmit = () => {
        if (pin.length === totalLength) {
            onFormSubmit({ token: user?.token, pinCode: pin })
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
            <View style={{ width: 88, height: 88, borderRadius: 20, backgroundColor: theme.green, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
                <Image
                    source={require('@/assets/gif/SetPin.gif')}
                    style={{ width: 150, height: 150, borderRadius: 20 }}
                />
            </View>
            <Text style={themedStyles.header}>{t("createPin.hello")} {capitalizeFirstLetter(user?.user.firstName ?? "")} {capitalizeFirstLetter(user?.user.lastName ?? "")}</Text>
            <Text style={themedStyles.subText}>{t("createPin.request")}</Text>

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
                text={t("createPin.btnText")}
                style={[themedStyles.button, { marginTop: 30 }]}
                textStyle={themedStyles.buttonText}
                onPress={handleSubmit}
                isGradient={true}
            />
        </View>
    );
}