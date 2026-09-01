import Header from "@/components/Header";
import OverlayUI from "@/components/OverlayUI";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useResendOtp, useVerifyOtp } from "@/services/auth/authMutation";
import { styles } from "@/styles/screens/OtpVerify/index.style";
import { TResendOtp, TVerifyOtp } from "@/types/auth";
import { FieldTypes, TBackendErrorResponse } from "@/types/global";
import { ToastType } from "@/types/toastType";
import { hasNetworkConnection } from "@/utils/checkNetworks";
import { detectIdentifierType } from "@/utils/detectIdentifier";
import { mapBackendError } from "@/utils/errorMapping";
import { safeNavigate } from "@/utils/safeNavigator";
import { AxiosError } from "axios";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import OtpVerifyForm from "./components/OtpVerifyForm";
import useBackButtonHandler from "@/hooks/use-back-button-press";

export default function OtpVerifyScreen() {
    const theme = useTheme();
    const themedStyles = styles(theme);
    const { t } = useTranslation();
    const { identifier } = useLocalSearchParams();
    const [otpError, setOtpError] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const [toastType, setToastType] = useState<ToastType>("retry");
    const { mutate: verifyOtp, isPending: isVerifyOtpPending } = useVerifyOtp();
    const { mutate: resendOtp, isPending: isResendOtpPending } = useResendOtp();

    const router = useRouter();
    const pathname = usePathname()
    useBackButtonHandler()

    const identifierString = Array.isArray(identifier) ? identifier[0] : identifier || "";
    const identifierType = detectIdentifierType(identifierString);

    const displayText = identifierType === "email"
        ? t("otpVerify.sentToEmail")
        : t("otpVerify.sentToPhone");

    const onFormSubmit = async (verfiyOtpData: TVerifyOtp) => {

        const isOnline = await hasNetworkConnection();

        if (!isOnline) {
            setToastType("network");
            setToastVisible(true);
            return;
        }

        verifyOtp(
            verfiyOtpData,
            {
                onSuccess: (data) => {
                    safeNavigate(router, pathname, {
                        pathname: "/(default-bg)/create-password",
                        params: { parentId: data.data.session.user.id }
                    }, "replace")
                },
                onError: (err: unknown) => {
                    const axiosErr = err as AxiosError<TBackendErrorResponse>;
                    const errMsg = axiosErr.response?.data?.error || "Something went wrong";
                    const mapped = mapBackendError(errMsg);

                    if (mapped.field === FieldTypes.OTP) {
                        setOtpError(mapped.message);
                    } else {
                        setToastVisible(true)
                        setToastType("retry")
                    }
                }

            }
        );
    }

    const onResendOtp = (data: TResendOtp) => {
        resendOtp(
            data,
            {
                onSuccess: (data) => {
                    console.log(data)
                },
                onError: (err: unknown) => {
                    const axiosErr = err as AxiosError;
                    console.log("Server response:", axiosErr.response?.data);
                }

            }
        );
    }

    return (

        <View style={themedStyles.container}>
            <View >
                <Header isAllowedBack={false} showProgessBar={false} stepBarSide={2} isDefaultBG={true} />
                <Text style={themedStyles.verifyOtpText}>{t("otpVerify.title")}</Text>
                <Text style={themedStyles.verifyOtpDescription}>{t("otpVerify.description")}</Text>
            </View>

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <OtpVerifyForm identifier={identifierString} displayText={displayText} onFormSubmit={onFormSubmit} otpError={otpError} />
                <Text style={themedStyles.havntReceivedText}>
                    {t("otpVerify.haventReceived")}{"\n"}
                    <TouchableOpacity onPress={() => {
                        const data: TResendOtp = { identifier: identifierString }
                        onResendOtp(data)
                    }}>
                        <Text style={themedStyles.link}>{t("otpVerify.resend")}</Text>
                    </TouchableOpacity>
                </Text>
            </ScrollView>

            <OverlayUI visible={isVerifyOtpPending || isResendOtpPending} mode={"loader"} />

            <OverlayUI
                visible={toastVisible}
                mode="toast"
                toastType={toastType}
                onToastHide={() => setToastVisible(false)}
            />
        </View>
    )
}
