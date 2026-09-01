import { AiGenratorIcon, ChagePassGreenIcon, DarkModeIconGreen, LogoutGreenIcon, NotificationGreenIcon, RateAppGreenIcon, ShareAppGreenIcon } from "@/assets/images";
import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { clearAuthToken, clearDeviceToken, clearSessionStart, stopTokenRefreshCycle } from "@/config/api-config";
import { firebaseLogout } from "@/services/firebase/auth";
import { useCreateRating } from "@/services/rating/ratingMutation";
import { RootState } from "@/store";
import { clearActivePupil } from "@/store/activePupilSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearParent } from "@/store/parentSlice";
import { toggleAiGenerator, toggleDarkMode, toggleNotification } from "@/store/settingsSlice";
import { clearSubjects } from "@/store/subjectSlice";
import { styles } from "@/styles/screens/Settings/index.style";
import { ScreenTypeKey } from "@/types/screenType";
import { isScreenTypeKey } from "@/utils/checkScreenType";
import { safeNavigate } from "@/utils/safeNavigator";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import LanguageSelector from "./components/LanguageSelector";
import MoreOptionsSelector from "./components/MoreOptionSelector";
import RatingModal from "./components/RatingModal";
import SwitchOptions from "./components/SwitchOptions";
import TextOptions from "./components/TextOptions";

export default function SettingsScreen() {
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    useBackButtonHandler()
    const { screenType, backHref, isUpgradePlan, paymentApprovalWait } = useLocalSearchParams()
    const rawScreenType =
        Array.isArray(screenType)
            ? screenType[0]
            : screenType;

    const screenTypeParam: ScreenTypeKey | null =
        typeof rawScreenType === "string" && isScreenTypeKey(rawScreenType)
            ? rawScreenType
            : null;

    const isUpgradePlanString = Array.isArray(isUpgradePlan) ? isUpgradePlan[0] : isUpgradePlan ?? "";
    console.log("isUpgradePlanString ", isUpgradePlanString)
    const isUpgradePlanBoolean = isUpgradePlanString === "true";
    console.log("isUpgradePlanBoolean ", isUpgradePlanBoolean)

    const paymentApprovalWaitString = Array.isArray(paymentApprovalWait) ? paymentApprovalWait[0] : paymentApprovalWait ?? "";
    const paymentApprovalWaitBoolean = paymentApprovalWaitString === "true";

    let parsedBackHref = null;
    if (backHref) {
        const backHrefStr = Array.isArray(backHref) ? backHref[0] : backHref;
        parsedBackHref = JSON.parse(backHrefStr);
    }

    // console.log("paymentApprovalWaitBoolean ", paymentApprovalWaitBoolean)
    // console.log("parsed back ref ", parsedBackHref)


    // console.log("screenTypeParam", screenTypeParam)
    const { darkMode, aiGenerator, notification } = useAppSelector(
        (state: RootState) => state.settings
    );

    const { t, isRTL } = useTranslation()
    const parent = useAppSelector(
        (state: RootState) => state.parent.parent
    );
    const activePupil = useAppSelector(
        (state: RootState) => state.activePupil.pupil
    );
    const themedStyles = styles(theme);
    const { showLoader, hideLoader, showToast } = useOverlay();
    const { mutate: createRating, isPending, isError } = useCreateRating()
    const [notificationEnabled, setNotificationEnabled] = useState(notification);
    const [darkModeEnabled, setDarkModeEnabled] = useState(darkMode);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [aiGenratorEnabled, setAiGenratorEnabled] = useState(aiGenerator);

    // console.log("parent is ", parent)

    const TEXT_OPTIONS = [
        ...(((screenTypeParam === "pricingPlan" || screenTypeParam === "paymentMethod" || screenTypeParam === "paymentCardDetails") || parent?.user.subscription || parent?.user.trailStatue === "active") && !activePupil ? [{ text: t("setting.rateApp"), icon: RateAppGreenIcon, onPress: () => { setIsRatingModalOpen(true) } }] : []),
        { text: t("setting.shareApp"), icon: ShareAppGreenIcon, onPress: () => { console.log("share app") } },
        ...((parent?.user.subscription || parent?.user.trailStatue === "active") && !activePupil && !paymentApprovalWaitBoolean ? [{ text: t("setting.changePass"), icon: ChagePassGreenIcon, onPress: () => { safeNavigate(router, pathname, "/(default-bg)/change-password") } }] : [])
    ];

    useEffect(() => {
        setDarkModeEnabled(darkMode);
    }, [darkMode]);

    useEffect(() => {
        setAiGenratorEnabled(aiGenerator);
    }, [aiGenerator]);

    useEffect(() => {
        setNotificationEnabled(notification)
    }, [notification])

    useEffect(() => {
        if (isPending) {
            showLoader();
        } else {
            hideLoader();
        }
        return () => {
            hideLoader();
        };
    }, [isPending, showLoader, hideLoader]);

    const handleDarkModeChange = () => {
        dispatch(toggleDarkMode());
    };

    const handleAiGenratorChange = () => {
        dispatch(toggleAiGenerator());
    };

    const handleNotificationChange = () => {
        dispatch(toggleNotification());
    };

    const queryClient = useQueryClient();

const handleLogout = async () => {
        const isPupilLogout = !!activePupil;

        stopTokenRefreshCycle();
        await clearAuthToken();
        await clearDeviceToken();
        await clearSessionStart();
        await firebaseLogout();
        
        if (isPupilLogout) {
            dispatch(clearActivePupil());
            dispatch(clearSubjects());
        } else {
            dispatch(clearParent());
            dispatch(clearActivePupil());
            dispatch(clearSubjects());
        }
        queryClient.clear();
        queryClient.removeQueries();

        if (isPupilLogout) {
            safeNavigate(router, pathname, "/(default-bg)/pupil-listing", "replace")
        } else {
            safeNavigate(router, pathname, "/(default-bg)", "replace");
        }
    };

    const handleOnRatingSubmission = (rating: number) => {
        createRating({ rating }, {
            onSuccess: async () => {
                showToast("ratingSuccess");

                // Wait a moment for toast to appear, then close modal
                setTimeout(() => {
                    setIsRatingModalOpen(false);
                }, 500);
            },
            onError: (err: unknown) => {
                showToast("retry");
                // Close modal after showing error toast
                setTimeout(() => {
                    setIsRatingModalOpen(false);
                }, 500);
            }
        });
    };



    return (
        <View style={themedStyles.container}>
            <RatingModal
                visible={isRatingModalOpen}
                onClose={() => {
                    if (!isPending) {
                        setIsRatingModalOpen(false);
                    }
                }}
                onSubmit={handleOnRatingSubmission}
                isSubmitting={isPending}
            />
            <Header
                isAllowedBack={true}
                showProgessBar={false}
                isDefaultBG={true}
                isSettings={false}
                // onBackPressed={() => safeNavigate(router, pathname, parsedBackHref)}
                view={
                    <View>
                        <Text style={themedStyles.settingHeading}>{t("setting.text")}</Text>
                    </View>
                }
            />
            <ScrollView
                style={themedStyles.contentContainer}
                contentContainerStyle={themedStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <LanguageSelector />

                {((screenTypeParam === "pricingPlan" || screenTypeParam === "paymentMethod" || screenTypeParam === "paymentCardDetails") || parent?.user.subscription || parent?.user.trailStatue === "active") &&
                    <SwitchOptions
                        text={t("setting.notification")}
                        icon={NotificationGreenIcon}
                        value={notificationEnabled}
                        onValueChange={handleNotificationChange}
                    />
                }

                <SwitchOptions
                    text={t("setting.darkMode")}
                    icon={DarkModeIconGreen}
                    value={darkModeEnabled}
                    onValueChange={handleDarkModeChange}
                />

                {activePupil &&
                    <SwitchOptions
                        text={t("setting.aiVoiceGeneration")}
                        icon={AiGenratorIcon}
                        value={aiGenratorEnabled}
                        onValueChange={handleAiGenratorChange}
                    />
                }


                {TEXT_OPTIONS.map((option, index) => (
                    <TextOptions key={index} {...option} />
                ))}

                <MoreOptionsSelector />

                {((screenTypeParam === "pricingPlan" || screenTypeParam === "paymentMethod" || screenTypeParam === "paymentCardDetails") || parent?.user.subscription || parent?.user.trailStatue === "active") &&
                    <TextOptions
                        text={t("setting.logout")}
                        icon={LogoutGreenIcon}
                        onPress={handleLogout}
                    />
                }
            </ScrollView>
        </View>
    );
}