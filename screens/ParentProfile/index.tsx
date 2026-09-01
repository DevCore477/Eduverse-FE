import { PupilOneIconSvg } from "@/assets/images";
import Header from "@/components/Header";
import OTPDisplay from "@/components/OtpDisplay";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { clearAuthToken, clearDeviceToken, clearSessionStart, stopTokenRefreshCycle } from "@/config/api-config";
import { useDeleteAccount } from "@/services/auth/authMutation";
import { firebaseLogout } from "@/services/firebase/auth";
import { useGetParent } from "@/services/parent/parentQuery";
import { clearActivePupil } from "@/store/activePupilSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearParent } from "@/store/parentSlice";
import { clearSubjects } from "@/store/subjectSlice";
import { styles } from "@/styles/screens/ParentProfile/index.style";
import { TBackendErrorResponse } from "@/types/global";
import { capitalizeFirstLetter } from "@/utils/caseConversions";
import { safeNavigate } from "@/utils/safeNavigator";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Image } from "expo-image";
import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SwitchButton } from "../ParentDashboard/components/SwitchButton";

export default function ParentProfileScreen() {
    const theme = useTheme();
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const router = useRouter();
    const user = useAppSelector((state) => state.parent.parent);
    console.log("user from store is  ", JSON.stringify(user, null, 2))
    
    const { data: parentData, isPending, isError, error } = useGetParent({ id: user?.user?.id, token: "" });
    const { showLoader, hideLoader, showToast } = useOverlay();
    const { mutate: deleteAccount, isPending: isDeletingAccount } = useDeleteAccount()

    useBackButtonHandler()

    useEffect(() => {
        if (isPending || isDeletingAccount) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [isPending, isDeletingAccount, showLoader, hideLoader]);

    useEffect(() => {
        if (isError) {
            showToast("retry");
        }
    }, [isError, showToast]);

    const handleDeleteAccount = () => {
        deleteAccount(undefined, {
            onSuccess: async () => {
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
                safeNavigate(router, pathname, "/(default-bg)", "replace");
            },
            onError: (err: unknown) => {
                const axiosErr = err as AxiosError<TBackendErrorResponse>;
                console.log("Errior in add form is  ", axiosErr.response?.data?.error)
                showToast("retry")
            }
        });
    }

    // console.log("data is ", parentData)
    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={false} showProgessBar={false} stepBarSide={2} isDefaultBG={true} isSettings={true} view={
                <View>
                    <Text style={themedStyles.parentProfileText}>{t("parentProfile.text")}</Text>
                </View>
            } />

            <View style={themedStyles.iconsContent} >
                <View style={themedStyles.iconCard}>
                    {parentData?.profileImageBase64 ? (
                        <Image
                            source={{ uri: parentData.profileImageBase64 }}
                            style={{ width: 140, height: 140, borderRadius: 70 }}
                            contentFit="cover"
                        />
                    ) : <PupilOneIconSvg width={120} height={120} />}
                </View>
                <View style={themedStyles.textContainer}>
                    <Text style={themedStyles.nameText}>{capitalizeFirstLetter(parentData?.firstName ?? "")} {capitalizeFirstLetter(parentData?.lastName ?? "")}</Text>
                    <Text style={themedStyles.emailText}>{parentData?.identifier}</Text>
                </View>
                <SwitchButton noWrap={true} title={t("parentProfile.btnText")} colorOne="#00AC56" colorTwo="#00743A" textStyle={{ color: "#FFDE3C", fontSize: 14 }}
                    onPress={() => safeNavigate(router, pathname, "/(default-bg)/(parent-bg)/parent-profile-edit")}
                    btnSyle={{ width: 140 }} />
                <SwitchButton noWrap={true} title={"Delete Account"} colorOne="#FFDE3C" colorTwo="#FFDE3C" textStyle={{ color: "#0000", fontSize: 14 }}
                    onPress={handleDeleteAccount}
                    btnSyle={{ width: 140 }} />
            </View>

            <View style={themedStyles.iconsContent}>
                <Text style={themedStyles.text}>{t("parentProfile.dashboardPin")}</Text>
                <OTPDisplay value={parentData?.pinCode ?? "0000"} totalLength={4} style={{ marginTop: 0 }} textStyle={{ fontSize: 32, fontWeight: "800" }} />
            </View>
        </View>
    )
}