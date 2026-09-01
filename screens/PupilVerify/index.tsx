import { PupilOneIconSvg } from "@/assets/images";
import Header from "@/components/Header";
import OverlayUI from "@/components/OverlayUI";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useAccessByPin } from "@/services/parent/parentMutation";
import { setActivePupil } from "@/store/activePupilSlice";
import { useAppDispatch } from "@/store/hooks";
import { styles } from "@/styles/screens/PupilVerfiy/index.style";
import { TBackendErrorResponse } from "@/types/global";
import { TAcessPin } from "@/types/parent";
import { ToastType } from "@/types/toastType";
import { hasNetworkConnection } from "@/utils/checkNetworks";
import { mapBackendError } from "@/utils/errorMapping";
import { safeNavigate } from "@/utils/safeNavigator";
import { AxiosError } from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import VerifyPinForm from "./components/VerifyPinForm";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { capitalizeFirstLetter } from "@/utils/caseConversions";

export default function PupilVerifyScreen() {
    const theme = useTheme();
    const themedStyles = styles(theme);
    const { t } = useTranslation()
    const { mutate: verifyPin, isPending: isVerifyingPin } = useAccessByPin();
    const [toastVisible, setToastVisible] = useState(false);
    const [toastType, setToastType] = useState<ToastType>("retry");
    const router = useRouter()
    const pathname = usePathname()
    const params = useLocalSearchParams()
    const dispatch = useAppDispatch()
    useBackButtonHandler()

    const pupilId =
        (Array.isArray(params.pupilId) ? params.pupilId[0] : params.pupilId) ?? "";
    const firstName =
        (Array.isArray(params.firstName) ? params.firstName[0] : params.firstName) ?? "";
    const lastName =
        (Array.isArray(params.lastName) ? params.lastName[0] : params.lastName) ?? "";

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
                onSuccess: (data) => {
                    const pupils = data.data
                    const activePupil = pupils.find((pupil: any) => pupil.id === pupilId)
                    dispatch(setActivePupil(activePupil));

                    safeNavigate(router, pathname, { pathname: "/(default-bg)/(pupil-bg)/(with-nav)/pupil-dashboard", params: { pupilId: pupilId } }, "replace")
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
            <Header isAllowedBack={true} backIconColor="#fff" showProgessBar={false} isDefaultBG={true} />

            <LinearGradient
                colors={['#A991D2', '#F7C0E9']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={themedStyles.iconsContent}
            >
                <PupilOneIconSvg width={100} height={100} style={themedStyles.iconCard} />
            </LinearGradient>
            <View style={{ justifyContent: "center", alignItems: "center", gap: 2 }}>
                <Text style={themedStyles.nameText}>{t("verifyPupil.hello")} {capitalizeFirstLetter(firstName)} {capitalizeFirstLetter(lastName)}</Text>
                <Text style={themedStyles.descriptionText}>{t("verifyPupil.desc")}</Text>
            </View>

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
