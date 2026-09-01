
import Header from "@/components/Header";
import OverlayUI from "@/components/OverlayUI";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { clearAuthToken, clearDeviceToken, clearSessionStart, stopTokenRefreshCycle } from "@/config/api-config";
import { firebaseLogout } from "@/services/firebase/auth";
import { useChangePassword } from "@/services/parent/parentMutation";
import { clearActivePupil } from "@/store/activePupilSlice";
import { useAppDispatch } from "@/store/hooks";
import { clearParent } from "@/store/parentSlice";
import { clearSubjects } from "@/store/subjectSlice";
import { styles } from "@/styles/screens/CreatePassword/index.style";
import { TBackendErrorResponse } from "@/types/global";
import { TChangePassword } from "@/types/parent";
import { ToastType } from "@/types/toastType";
import { hasNetworkConnection } from "@/utils/checkNetworks";
import { safeNavigate } from "@/utils/safeNavigator";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import ChangePasswordForm from "./components/ChangePasswordForm";


export default function ChangePasswordScreen() {
    const theme = useTheme();
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);
    const { mutate: changePassword, isPending } = useChangePassword();
    const [toastType, setToastType] = useState<ToastType>("retry");
    const [toastVisible, setToastVisible] = useState(false);
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const router = useRouter();
    useBackButtonHandler()

    const onFormSubmit = async (data: TChangePassword) => {

        const isOnline = await hasNetworkConnection();

        if (!isOnline) {
            setToastType("network");
            setToastVisible(true);
            return;
        }

        changePassword(
            data,
            {
                onSuccess: async () => {
                    setToastType("passwordUpdated")
                    setToastVisible(true)
                    stopTokenRefreshCycle();
                    await clearAuthToken();
                    await clearDeviceToken();
                    await clearSessionStart();
                    await firebaseLogout();
                    dispatch(clearParent());
                    dispatch(clearActivePupil());
                    dispatch(clearSubjects())
                    queryClient.clear();
                    queryClient.cancelQueries()
                    setTimeout(() => {
                        safeNavigate(router, pathname, "/(default-bg)", "replace");
                    }, 1000);
                },
                onError: (err: any) => {
                    const axiosErr = err as AxiosError<TBackendErrorResponse>;
                    console.log("error is ", axiosErr)
                    setToastVisible(true);
                    setToastType("retry")
                }
            }
        );
    }


    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={true} showProgessBar={false} stepBarSide={2} isSettings={true}
                onSettingsPress={() => { router.push("/setting") }}
                isDefaultBG={true}
                view={
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                    >
                        <Text style={themedStyles.createPassText}>{t("changePassword.text")}</Text>
                        <Text style={themedStyles.createPassDescription}>{t("changePassword.desc")}</Text>
                    </View>
                }
            />


            <ChangePasswordForm onFormSubmit={onFormSubmit} />

            <OverlayUI visible={isPending} mode="loader" />

            <OverlayUI
                visible={toastVisible}
                mode="toast"
                toastType={toastType}
                onToastHide={() => setToastVisible(false)}
            />
        </View >
    );
}
