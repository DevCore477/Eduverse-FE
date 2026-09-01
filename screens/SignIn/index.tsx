import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useLogin } from "@/services/auth/authMutation";
import { firebaseLogout } from "@/services/firebase/auth";
import { firebaseAuth } from "@/config/firebase";
import { saveAuthToken, clearSessionStart } from "@/config/api-config";
import { useAppDispatch } from "@/store/hooks";
import { clearParent, setParent } from "@/store/parentSlice";
import { styles } from "@/styles/screens/SignIn/index.style";
import { TLogin } from "@/types/auth";
import { FieldTypes, TBackendErrorResponse } from "@/types/global";
import { hasNetworkConnection } from "@/utils/checkNetworks";
import { mapBackendError } from "@/utils/errorMapping";
import { safeNavigate } from "@/utils/safeNavigator";
import { AxiosError } from "axios";
import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SignInForm from "./components/SignInForm";

export default function SignInScreen() {
    const theme = useTheme();
    const router = useRouter();
    const pathname = usePathname()
    const { mutate: login, isPending } = useLogin();
    const dispatch = useAppDispatch();
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);
    const { showLoader, hideLoader, showToast } = useOverlay();

    useBackButtonHandler()

    const onFormSubmit = async (data: TLogin) => {

        const isOnline = await hasNetworkConnection();

        if (!isOnline) {
            showToast("network")
            return;
        }

        login(
            data,
            {
                onSuccess: async (response) => {
                    try {
                        const user = response?.data?.user;
                        if (!user?.user) {
                            showToast("retry");
                            return;
                        }
                        console.log("user in login  ", JSON.stringify(user, null, 2))
                        
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
                        
                        dispatch(setParent(userWithToken));
                        if (user.user.subscription) {
                            if (user.user.subscription.isUnderManualReview) {
                                showToast("manualPaymentReview")
                                await firebaseLogout();
                                dispatch(clearParent())
                                return
                            } else {
                                if (!user.user.pinCode) {
                                    safeNavigate(router, pathname,
                                        { pathname: "/(default-bg)/create-pin", params: { showBackButton: "true" } })
                                } else {
                                    safeNavigate(router, pathname, "/(default-bg)/(parent-bg)/parent-dashboard", "replace")
                                }
                            }
                        } else {
                            if (user.user.trailStatue === "active") {
                                if (!user.user.pinCode) {
                                    safeNavigate(router, pathname,
                                        { pathname: "/(default-bg)/create-pin", params: { showBackButton: "true" } })
                                } else {
                                    safeNavigate(router, pathname, "/(default-bg)/(parent-bg)/parent-dashboard", "replace")
                                }
                            } else {
                                safeNavigate(router, pathname, "/(custom-bg)/pricing-plans")
                            }
                        }
                    } catch (e) {
                        console.warn("Login onSuccess error:", e);
                        showToast("retry");
                    }
                },
                onError: (err: unknown) => {
                    let errorMsg = "Something went wrong, please try again";

                    // Handle Firebase auth errors
                    const firebaseErr = err as { code?: string; message?: string };
                    if (firebaseErr.code) {
                        errorMsg = firebaseErr.code; // e.g., "auth/invalid-credential"
                    } else {
                        // Handle Axios errors
                        const axiosErr = err as AxiosError<TBackendErrorResponse>;
                        errorMsg = axiosErr.response?.data?.error ?? errorMsg;
                    }
                    console.log("Error message", errorMsg)
                    const mappedError = mapBackendError(errorMsg);

                    if (errorMsg === "ERR_BAD_REQUEST") {
                        showToast("userNotFound")
                    } else if (errorMsg === "auth/invalid-credential") {
                        showToast("invalid")
                    } else {
                        switch (mappedError.field) {
                            case FieldTypes.INVALID_CREDS:
                                showToast("invalid")
                                break;

                            default:
                                showToast("retry")
                                break;
                        }
                    }
                },
                onSettled: () => {
                    hideLoader();
                },
            }
        );
    }

    useEffect(() => { isPending ? showLoader() : hideLoader() }, [isPending, showLoader, hideLoader])

    return (
        <View style={themedStyles.container} >
            <Header isAllowedBack={true} showProgessBar={false} isDefaultBG={true} isSettings={true} view={
                <View>
                    <Text style={themedStyles.signInText}>{t("signIn.text")}</Text>
                </View>
            } />

            <SignInForm onFormSubmit={onFormSubmit} />

            <View style={themedStyles.row}>
                <Text style={themedStyles.moveToRegister}>
                    {t("signIn.noAccount")}
                </Text>

                <TouchableOpacity onPress={() => safeNavigate(router, pathname, "/(default-bg)/register", "replace")}>
                    <Text style={themedStyles.link}> {t("signIn.registerText")} </Text>
                </TouchableOpacity>
            </View>

            {/* <OverlayUI visible={isPending} mode={"loader"} />

            <OverlayUI
                visible={toastVisible}
                mode="toast"
                toastType={toastType}
                onToastHide={() => setToastVisible(false)}
            /> */}
        </View>
    );
}
