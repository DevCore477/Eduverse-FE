import Header from "@/components/Header";
import OverlayUI from "@/components/OverlayUI";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useAccessByPin } from "@/services/parent/parentMutation";
import { styles } from "@/styles/screens/CreatePin/index.style";
import { DashboardTypes, TBackendErrorResponse } from "@/types/global";
import { TAcessPin } from "@/types/parent";
import { ToastType } from "@/types/toastType";
import { hasNetworkConnection } from "@/utils/checkNetworks";
import { mapBackendError } from "@/utils/errorMapping";
import { AxiosError } from "axios";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import VerifyPinForm from "./components/VerifyPinForm";
import { safeNavigate } from "@/utils/safeNavigator";
import useBackButtonHandler from "@/hooks/use-back-button-press";

export default function VerifyPinScreen() {
    const theme = useTheme();
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);
    const { redirectTo } = useLocalSearchParams()
    const { mutate: verifyPin, isPending: isVerifyingPin } = useAccessByPin();
    const [toastVisible, setToastVisible] = useState(false);
    const [toastType, setToastType] = useState<ToastType>("retry");
    const router = useRouter()
    const pathname = usePathname()
    useBackButtonHandler()

    const redirectToString = Array.isArray(redirectTo) ? redirectTo[0] : redirectTo || "";


    const onFormSubmit = async (data: TAcessPin) => {

        const isOnline = await hasNetworkConnection();

        if (!isOnline) {
            setToastType("network");
            setToastVisible(true);
            return;
        }

        verifyPin(
            data,
            {
                onSuccess: () => {
                    if (redirectToString === DashboardTypes.PUPIL)
                        safeNavigate(router, pathname, "/(default-bg)/pupil-listing", "replace")
                    else
                        safeNavigate(router, pathname, "/(default-bg)/(parent-bg)/parent-dashboard", "replace")
                },
                onError: (err: unknown) => {
                    const axiosErr = err as AxiosError<TBackendErrorResponse>;
                    const errMsg = axiosErr.response?.data?.error || "Something went wrong";
                    const mapped = mapBackendError(errMsg);
                    if (mapped.field === "pin") {
                        setToastType("invalidPin")
                    } else {
                        setToastType("retry")
                    }
                    setToastVisible(true)
                }

            }
        );
    }


    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={true} showProgessBar={false} stepBarSide={2} isDefaultBG={true} view={
                <View>
                    <Text style={themedStyles.verifyOtpText}>{t("verifyPin.text")}</Text>
                </View>
            } />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <VerifyPinForm onFormSubmit={onFormSubmit} />
            </ScrollView>

            <OverlayUI visible={isVerifyingPin} mode={"loader"} />

            <OverlayUI
                visible={toastVisible}
                mode="toast"
                toastType={toastType}
                onToastHide={() => setToastVisible(false)}
            />
        </View>
    )
}
