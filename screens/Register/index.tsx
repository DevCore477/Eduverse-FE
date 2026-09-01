import Header from "@/components/Header";
import OverlayUI from "@/components/OverlayUI";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useRegister } from "@/services/auth/authMutation";
import { firebaseAuth } from "@/config/firebase";
import { saveAuthToken } from "@/config/api-config";
import { useAppDispatch } from "@/store/hooks";
import { setParent } from "@/store/parentSlice";
import { styles } from "@/styles/screens/Register/index.style";
import { TRegister } from "@/types/auth";
import { FieldTypes, TBackendErrorResponse } from "@/types/global";
import { RegisterData } from "@/types/schemas";
import { ToastType } from "@/types/toastType";
import { hasNetworkConnection } from "@/utils/checkNetworks";
import { mapBackendError } from "@/utils/errorMapping";
import { safeNavigate } from "@/utils/safeNavigator";
import { AxiosError } from "axios";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { UseFormSetError } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import RegisterForm, { clearPersistedRegisterValues } from "./components/RegisterForm";

export default function RegisterScreen() {
    const theme = useTheme();
    const { mutate: register, isPending } = useRegister();
    const [toastType, setToastType] = useState<ToastType>("retry");
    const [toastVisible, setToastVisible] = useState(false);
    const router = useRouter();
    const pathname = usePathname()
    const dispatch = useAppDispatch();
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);
    useBackButtonHandler()

    const onFormSubmit = async (data: TRegister, setError: UseFormSetError<RegisterData>,reset:any) => {
        const isOnline = await hasNetworkConnection();

        if (!isOnline) {
            setToastType("network");
            setToastVisible(true);
            return;
        }

        register(data, {
            onSuccess: async (response) => {
                const user = response.data;
                console.log("user is ", user)
                // Clear persisted form values on successful registration
                clearPersistedRegisterValues();
                reset()
                
                // Get Firebase ID token and store it
                const firebaseToken = await firebaseAuth.currentUser?.getIdToken();
                
                // Save token to AsyncStorage for persistence
                if (firebaseToken) {
                    await saveAuthToken(firebaseToken);
                }
                
                const userWithToken = {
                    ...user,
                    token: firebaseToken
                };
                
                setTimeout(() => {
                    dispatch(setParent(userWithToken));
                    safeNavigate(router, pathname, "/(custom-bg)/pricing-plans");
                }, 100);
            },
            onError: (err: unknown) => {
                const axiosErr = err as AxiosError<TBackendErrorResponse>;
                const errorMsg = axiosErr.response?.data?.error ?? "Something went wrong, please try again";
                const mappedError = mapBackendError(errorMsg);

                switch (mappedError.field) {
                    case FieldTypes.EMAIL:
                    case FieldTypes.PHONE_NUMBER:
                    case FieldTypes.IDENTIFIER:
                        setError("identifier", { type: "server", message: mappedError.message });
                        break;

                    case FieldTypes.PASSWORD:
                        setError("password", { type: "server", message: mappedError.message });
                        break;

                    default:
                        setToastVisible(true);
                        setToastType("retry")
                        break;
                }
            }
        });
    };

    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={true} showProgessBar={false} isDefaultBG={true} isSettings={true} view={
                <View>
                    <Text style={themedStyles.registerText}>{t("register.text")}</Text>
                </View>} />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <RegisterForm onFormSubmit={onFormSubmit} />
            </ScrollView>

            <View style={themedStyles.row}>
                <Text style={themedStyles.moveToSignIn}>
                    {t("register.alreadyAcc")}
                </Text>
                <TouchableOpacity onPress={() => safeNavigate(router, pathname, "/(default-bg)/signin", "replace")}>
                    <Text style={themedStyles.link}>{t("register.signIn")}</Text>
                </TouchableOpacity>
            </View>

            <OverlayUI visible={isPending} mode={"loader"} />

            <OverlayUI
                visible={toastVisible}
                mode="toast"
                toastType={toastType}
                onToastHide={() => setToastVisible(false)}
            />
        </View>
    );
}
