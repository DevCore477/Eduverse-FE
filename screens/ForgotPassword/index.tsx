
import Header from "@/components/Header";
import OverlayUI from "@/components/OverlayUI";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useForgetPassword } from "@/services/auth/authMutation";
import { styles } from "@/styles/screens/ForgotPassword/index.style";
import { TForgetPassword } from "@/types/auth";
import { ToastType } from "@/types/toastType";
import { hasNetworkConnection } from "@/utils/checkNetworks";
import { safeNavigate } from "@/utils/safeNavigator";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import useBackButtonHandler from "@/hooks/use-back-button-press";


export default function ForgotPasswordScreen() {
    const theme = useTheme();
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);
    const router = useRouter();
    const pathname = usePathname()
    const [toastType, setToastType] = useState<ToastType>("retry");
    const [toastVisible, setToastVisible] = useState(false);
    const { mutate: forgetPassword, isPending } = useForgetPassword();
    useBackButtonHandler()

    const onFormSubmit = async (forgetPasswordData: TForgetPassword) => {

        const isOnline = await hasNetworkConnection();

        if (!isOnline) {
            setToastType("network");
            setToastVisible(true);
            return;
        }

        forgetPassword(
            forgetPasswordData,
            {
                onSuccess: (data) => {
                    console.log(data.data, 'response')
                    if (data.data && data.data.message && data.data.message.includes("If this account is registered")) {
                        setToastVisible(true);
                        setToastType("emailNotRegistered")
                    } else {
                        setToastVisible(true);
                        setToastType("forgotEmailSuccess")
                        setToastVisible(true);
                        setToastType("forgotEmailSuccess")
                        setTimeout(() => {
                            safeNavigate(router, pathname, {
                                pathname: "/(default-bg)/signin",
                                params: { identifier: forgetPasswordData.identifier }
                            })
                        }, 1000)
                    }
                },
                onError: (err: unknown) => {
                    console.log(err)
                    setToastVisible(true);
                    setToastType("retry")
                }
            }
        );
    }

    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={true} showProgessBar={false} stepBarSide={2} isDefaultBG={true} isSettings={true} view={
                    <View>
                        <Text style={themedStyles.forgotPassText}>{t("forgetPassword.text")}</Text>
                    </View>
                } />

            <ForgotPasswordForm onFormSubmit={onFormSubmit} />

            <TouchableOpacity onPress={() => safeNavigate(router, pathname, "/(default-bg)/signin")}>
                <Text style={themedStyles.link}>{t("forgetPassword.backSignIn")}</Text>
            </TouchableOpacity>

            <OverlayUI visible={isPending} mode={"loader"} />

            <OverlayUI
                visible={toastVisible}
                mode="toast"
                toastType={toastType}
                onToastHide={() => setToastVisible(false)}
            />
        </View >
    );
}
