import { BadgeIcon, PupilOneIconSvg, StarIcon } from "@/assets/images";
import Header from "@/components/Header";
import InfoCard from "@/components/InfoCard";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useGetPupilModuleData } from "@/services/pupil/pupilQuery";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setParentPupil } from "@/store/parentPupilSlice";
import { styles } from "@/styles/screens/PupilProfile/index.style";
import { capitalizeFirstLetter } from "@/utils/caseConversions";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function PupilProfileScreen() {
    const theme = useTheme();
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);
    const { pupilId } = useLocalSearchParams();
    const pupilIdString = Array.isArray(pupilId) ? pupilId[0] : pupilId || "";
    const user = useAppSelector((state) => state.parent.parent);
    const { data: moduleData, isPending, isError, error } = useGetPupilModuleData({ id: user?.user.id, token: user?.token }, pupilIdString);
    const { showLoader, hideLoader, showToast } = useOverlay();
    const dispatch = useAppDispatch()
    useBackButtonHandler()

    useEffect(() => {
        if (!isPending && moduleData) {
            dispatch(setParentPupil(moduleData))
        }
    }, [isPending, moduleData])

    useEffect(() => {
        if (isPending) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [isPending, showLoader, hideLoader]);

    useEffect(() => {
        if (isError) {
            showToast("retry");
        }
    }, [isError, showToast]);

    const infoCardData = [
        {
            title: t("pupilProfile.stars"),
            description: t("pupilProfile.starDesc"),
            total: moduleData?.stars.total,
            current: moduleData?.stars.earned,
            icon: <Image source={StarIcon} style={{ width: 60, height: 60 }} />,
            firstBgColor: "#00743A",
            secondBgColor: "#00AC56"
        },
        {
            title: t("pupilProfile.badges"),
            description: t("pupilProfile.badgeDesc"),
            total: moduleData?.badges.total,
            current: moduleData?.badges.earned,
            icon: <Image source={BadgeIcon} style={{ width: 60, height: 60 }} />,
            firstBgColor: "#00743A",
            secondBgColor: "#00AC56"
        }

    ]

    const earned = moduleData?.stars.earned ?? 1
    const total = moduleData?.stars.total ?? 1
    const info = (earned / total) * 100

    console.log("earned ", earned)
    console.log("total ", total)
    console.log("infoCardData ", info)
    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={false}
                showProgessBar={false}
                isDefaultBG={true}
                isSettings={true} view={
                    <View>
                        <Text style={themedStyles.pupilProfileText}>{t("pupilProfile.text")}</Text>
                    </View>
                } />


            <View style={themedStyles.iconsContent}>
                <LinearGradient
                    colors={['#A991D2', '#F7C0E9']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={themedStyles.iconCard}>
                    <PupilOneIconSvg width={120} height={120} />
                </LinearGradient>
                <Text style={themedStyles.nameText}>{capitalizeFirstLetter(moduleData?.firstName ?? "")} {capitalizeFirstLetter(moduleData?.lastName ?? "")}</Text>
            </View>

            <View style={{ gap: 20 }}>
                <Text style={themedStyles.text}>{t("pupilProfile.achievement")}</Text>
                <View style={{ gap: 16 }}>
                    {infoCardData.map((info, index) => (
                        <InfoCard key={index} {...info} />
                    ))}
                </View>
            </View>
        </View>
    )
}

