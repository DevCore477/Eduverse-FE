import { CameraIcon } from "@/assets/images";
import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useImagePickerWithPermissions } from "@/hooks/use-image-picker-with-permissions";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { clearAuthToken, clearDeviceToken, clearSessionStart, stopTokenRefreshCycle } from "@/config/api-config";
import { firebaseLogout } from "@/services/firebase/auth";
import { useRequestManualPayment } from "@/services/pricing/pricingMutation";
import { clearActivePupil } from "@/store/activePupilSlice";
import { useAppDispatch } from "@/store/hooks";
import { clearParent } from "@/store/parentSlice";
import { clearSubjects } from "@/store/subjectSlice";
import { styles } from "@/styles/screens/PaymentCardDetails/index.style";
import { TBackendErrorResponse } from "@/types/global";
import { safeNavigate } from "@/utils/safeNavigator";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Image } from "expo-image";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const CARD_DETAILS = [
    { title: "Bank", desc: "ILYES ABDERREZAK" },
    { title: "Account Title", desc: "Tadjenanet" },
    { title: "Account Number", desc: "0020732542 47" },
    { title: "IBAN Number", desc: "00799999002073254247" }
]

export default function PaymentCardDetailsScreen() {
    const theme = useTheme()
    const { t, isRTL } = useTranslation();
    const params = useLocalSearchParams()
    const themedStyles = styles(theme, isRTL)
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const router = useRouter()
    const pathname = usePathname()

    useBackButtonHandler()
    const { showLoader, hideLoader, showToast } = useOverlay();
    const { mutate: requestManualPayment, isPending } = useRequestManualPayment()
    const [showImageError, setShowImageError] = useState(false);

    const { imageUri, imageBase64, openImageSourcePicker } = useImagePickerWithPermissions({
        showToast,
        cameraDeniedMessage: "Camera access is required to capture your payment screenshot.",
        galleryDeniedMessage: "Gallery access is required to choose your payment screenshot.",
        onImageSelected: () => {
            setShowImageError(false);
        }
    });

    const planId =
        (Array.isArray(params.planId) ? params.planId[0] : params.planId) ?? "";
    const planName =
        (Array.isArray(params.planName) ? params.planName[0] : params.planName) ?? "";
    const devices =
        (Array.isArray(params.devices) ? params.devices[0] : params.devices) ?? "";
    const price =
        (Array.isArray(params.price) ? params.price[0] : params.price) ?? "";
    const isUpgradePlanString = Array.isArray(params.isUpgradePlan) ? params.isUpgradePlan[0] : params.isUpgradePlan ?? "";

    const handleRequest = () => {
        if (!imageUri || !imageBase64) {
            setShowImageError(true);
            return;
        }

        const screenshotBase64 = imageBase64
            ? `data:image/jpeg;base64,${imageBase64}`
            : undefined
        const data = { planId, requestType: "upgrade", screenshotBase64 }
        requestManualPayment(data, {
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
                queryClient.removeQueries();
                safeNavigate(router, pathname, "/(default-bg)", "replace")
            }, onError: (err) => {
                const axiosErr = err as AxiosError<TBackendErrorResponse>;
                const errorMsg = axiosErr.response?.data?.error ?? "Something went wrong, please try again";
                console.log("error message ", errorMsg)
                showToast("retry")
            }
        })
    }
    useEffect(() => {
        if (isPending) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [isPending, showLoader, hideLoader])

    const formatPrice = (price: any) => {
        const num = Number(price);
        return num.toLocaleString('en-US');
    };

    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={true} showProgessBar={false} isUpgradePlan={isUpgradePlanString} isDefaultBG={true} screenType={"paymentCardDetails"} isSettings={true} view={
                <View >
                    <Text style={themedStyles.pageHeading}>{t("paymentMethod.pageHeading")}</Text>
                </View>} />
            <ScrollView>
                <View style={{ flex: 1, gap: 32 }}>
                    <View style={themedStyles.cardContainer}>
                        <Text style={themedStyles.paymentDetailText}>{t("paymentMethod.paymentDetails")}</Text>
                        <View style={themedStyles.cardDetailContainer}>
                            {CARD_DETAILS.map((cardDetail, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: isRTL ? "row-reverse" : "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={themedStyles.titleText}>{cardDetail.title}</Text>
                                    <Text style={themedStyles.descText}>{cardDetail.desc}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={themedStyles.planDetailContainer}>
                            <View style={themedStyles.planDetailText}>
                                <View style={themedStyles.planDetailTextLeft}>
                                    <Text style={themedStyles.planName}>{planName}</Text>
                                    <Text style={themedStyles.planDeviceInfo}>{t("paymentMethod.upTo")} {devices} {t("paymentMethod.devices")} and {devices} {t("paymentMethod.pupils")}</Text>
                                    <Text style={themedStyles.planTax}>{t("paymentMethod.exclusiveOfTax")}</Text>
                                </View>
                                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                                    <Text style={themedStyles.planPriceText}>DZD {formatPrice(price)}</Text>
                                </View>
                            </View>
                            <View style={{ width: "100%", height: 1, backgroundColor: "#E0DFF1" }} />
                            <View style={themedStyles.priceInfo}>
                                <Text style={themedStyles.priceInfoLabel}>{t("paymentMethod.totalPayableBill")}</Text>
                                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                                    <Text style={themedStyles.priceText}>DZD {formatPrice(price)}.00</Text>
                                </View>
                            </View>
                        </View>
                        <View style={themedStyles.contactContainer}>
                            <Text style={themedStyles.contactText}>{t("paymentMethod.shareScreenshotAt")}</Text>
                            <Text style={themedStyles.contactEmailText}>payments@nedjmati.com</Text>
                        </View>
                    </View>
                </View>


                <View style={{ alignItems: "center", gap: 8, marginTop: 8, paddingBottom: 40 }}>
                    <Pressable onPress={openImageSourcePicker} style={themedStyles.iconsContent}>
                        <View style={themedStyles.iconCard}>
                            {imageUri ? (
                                <Image
                                    source={{
                                        uri: imageUri
                                            ? imageUri
                                            : undefined
                                    }}
                                    style={{ width: 140, height: 140, borderRadius: 70 }}
                                    contentFit="cover"
                                />
                            ) : (
                                <View style={{ width: 140, height: 140, borderRadius: 70, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 40, color: '#999' }}>+</Text>
                                </View>
                            )}
                        </View>

                        <View style={themedStyles.cameraContainter}>
                            <CameraIcon width={12} height={12} />
                        </View>
                    </Pressable>

                    {showImageError && (
                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                            Please add a payment screenshot before proceeding
                        </Text>
                    )}

                    <Pressable
                        onPress={handleRequest}
                        style={{ width: 120, height: 40, backgroundColor: "#00AC56", justifyContent: "center", alignItems: "center", borderRadius: 12 }}
                    >
                        <Text style={{ color: "#fff" }}>{t("paymentMethod.clickMe")}</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

