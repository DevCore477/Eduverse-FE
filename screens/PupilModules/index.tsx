import { PupilOneIconPng } from "@/assets/images";
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
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";


export default function PupilModulesScreen() {
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

    const SUBJECT_THEMES = [
        {
            firstBgColor: '#A991D2', // Purple
            secondBgColor: '#F7C0E9', // Light Pink
            firstColor: '#A991D2', // Purple
            secondColor: '#F7C0E9', // Light Pink
        },
        {
            firstBgColor: '#EC6F9E', // Pink
            secondBgColor: '#EC8B6A', // Orange-Pink
            firstColor: '#EC6F9E', // Pink
            secondColor: '#EC8B6A', // Orange-Pink
        },
        {
            firstBgColor: '#5670EC', // Blue
            secondBgColor: '#07BAFE', // Light Blue
            firstColor: '#5670EC', // Blue
            secondColor: '#07BAFE', // Light Blue
        },
        {
            firstBgColor: '#49BC9E', // Green
            secondBgColor: '#00ADA7', // Teal
            firstColor: '#49BC9E', // Green
            secondColor: '#00ADA7', // Teal
        }
    ];

    const INFO_CARD_DATA_UNLOCKED =
        moduleData?.subjects.map((subject, index) => {
            const theme = SUBJECT_THEMES[index % SUBJECT_THEMES.length]

            return {
                title: subject.name,
                description: `${t("pupilModule.level")} ${subject.completedLessons+1}`,
                icon: <Image source={PupilOneIconPng} style={{ width: 60, height: 60 }} />,
                total: subject.totalLessons,
                current: subject.completedLessons,
                isSubjectCard: true,

                ...theme,
            }
        }) ?? []

    return (
        <>
            <View style={themedStyles.container}>
                <Header isAllowedBack={false} showProgessBar={false} stepBarSide={2} isSettings={true}
                    isDefaultBG={true} view={
                        <View>
                            <Text style={themedStyles.pupilProfileText}>{t("pupilModule.text")}</Text>
                        </View>
                    } />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} >
                    <View style={{ gap: 16 }}>
                        {INFO_CARD_DATA_UNLOCKED.map((info, index) => (
                            <InfoCard key={index} title={info.title} description={info.description} icon={info.icon} isSubjectCard={info.isSubjectCard} firstBgColor={info.firstBgColor} secondBgColor={info.secondBgColor} firstColor={info.firstColor} secondColor={info.secondColor} total={info.total} current={info.current} />
                        ))}
                        {/* {INFO_CARD_DATA_LOCKED.map((info, index) => ( */}
                        {/* <InfoCard title={INFO_CARD_DATA_LOCKED.title} description={INFO_CARD_DATA_LOCKED.description} icon={INFO_CARD_DATA_LOCKED.icon} hasUnlocked={INFO_CARD_DATA_LOCKED.hasUnlocked} firstBgColor={INFO_CARD_DATA_LOCKED.firstBgColor} secondBgColor={INFO_CARD_DATA_LOCKED.secondBgColor} firstColor={INFO_CARD_DATA_LOCKED.firstColor} secondColor={INFO_CARD_DATA_LOCKED.secondColor} /> */}
                        {/* ))} */}
                    </View>
                </ScrollView>
            </View>
        </>
    )
}