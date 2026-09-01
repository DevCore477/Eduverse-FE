import Header from "@/components/Header";
import OverlayUI from "@/components/OverlayUI";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useUpdateParent } from "@/services/parent/parentMutation";
import { styles } from "@/styles/screens/CreatePin/index.style";
import { TBackendErrorResponse } from "@/types/global";
import { TUpdateParent } from "@/types/parent";
import { ToastType } from "@/types/toastType";
import { hasNetworkConnection } from "@/utils/checkNetworks";
import { safeNavigate } from "@/utils/safeNavigator";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import CreatePinForm from "./CreatePinForm";

export default function CreatPinScreen() {
    const theme = useTheme();
    const { t, isRTL } = useTranslation()
    const queryClient = useQueryClient()
    const themedStyles = styles(theme, isRTL);
    const { mutate: createPin, isPending: isCreatingPin } = useUpdateParent();
    const [toastVisible, setToastVisible] = useState(false);
    const [toastType, setToastType] = useState<ToastType>("retry");
    const { showLoader, hideLoader, showToast } = useOverlay();
    const { showBackButton } = useLocalSearchParams();
    const router = useRouter()
    const pathname = usePathname()

    const showBackButtonString = Array.isArray(showBackButton) ? showBackButton[0] : showBackButton ?? "";
    const showBackButtonBoolean = showBackButtonString === "true";
    useBackButtonHandler({ exitAppScreen: showBackButtonBoolean?false:true })

    useEffect(() => {
        isCreatingPin ? showLoader() : hideLoader()
    }, [isCreatingPin, showLoader, hideLoader])

    const onFormSubmit = async (data: TUpdateParent) => {

        const isOnline = await hasNetworkConnection();

        if (!isOnline) {
            setToastType("network");
            setToastVisible(true);
            return;
        }

        createPin(
            data,
            {
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({ queryKey: ["getParent", data.data.id] });
                    console.log("success data from create pin ", data)
                    safeNavigate(router, pathname, "/(default-bg)/(parent-bg)/parent-dashboard", "replace")
                },
                onError: (err: unknown) => {
                    const axiosErr = err as AxiosError<TBackendErrorResponse>;
                    const errorMsg = axiosErr.response?.data?.error ?? "Something went wrong, please try again";
                    console.log(errorMsg)
                    setToastVisible(true)
                    setToastType("retry")
                }

            }
        );
    }


    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={showBackButtonBoolean} showProgessBar={false} screenType={"creatPin"} isSettings={true} stepBarSide={2} isDefaultBG={true}
                view={
                    <View>
                        <Text style={themedStyles.verifyOtpText}>{t("createPinScreen.setPinCode")}</Text>
                    </View>
                }
            />
            {/* </View> */}

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <CreatePinForm onFormSubmit={onFormSubmit} />
            </ScrollView>

            <OverlayUI visible={isCreatingPin} mode={"loader"} />

            <OverlayUI
                visible={toastVisible}
                mode="toast"
                toastType={toastType}
                onToastHide={() => setToastVisible(false)}
            />
        </View>
    )
}
