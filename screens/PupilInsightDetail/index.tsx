import { PupilDeatilSubjectBG, PupilOneIconSvg } from "@/assets/images";
import Header from "@/components/Header";
import ProgressCircle from "@/components/ProgressCircles";
import PupilSubjectBox, { ShowDesc } from "@/components/PupilSubjectBox";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useGetPupilModuleData } from "@/services/pupil/pupilQuery";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setParentPupil } from "@/store/parentPupilSlice";
import { styles } from "@/styles/screens/PupilDetail/index.style";
import { capitalizeFirstLetter } from "@/utils/caseConversions";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";


// const PUPIL_SUBJECTS = [
//     {
//         level: 3,
//         name: "Mathematics",
//         icon: PupilDeatilSubjectBG,
//         colorOne: "#A991D2",
//         colorTwo: "#F7C0E9",
//     },
//     {
//         level: 1,
//         name: "Arabic",
//         icon: PupilDeatilSubjectBG,
//         colorOne: "#EC709C",
//         colorTwo: "#EC8477",
//     },
//     {
//         level: 3,
//         name: "Mathematics",
//         icon: PupilDeatilSubjectBG,
//         colorOne: "#A991D2",
//         colorTwo: "#F7C0E9",
//     },
//     {
//         level: 1,
//         name: "Arabic",
//         icon: PupilDeatilSubjectBG,
//         colorOne: "#EC709C",
//         colorTwo: "#EC8477",
//     },
//     {
//         level: 3,
//         name: "Mathematics",
//         icon: PupilDeatilSubjectBG,
//         colorOne: "#A991D2",
//         colorTwo: "#F7C0E9",
//     },
//     {
//         level: 1,
//         name: "Arabic",
//         icon: PupilDeatilSubjectBG,
//         colorOne: "#EC709C",
//         colorTwo: "#EC8477",
//     }
// ]


export default function PupilInsigthDetailScreen() {
    const theme = useTheme();
    const router = useRouter()
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);
    const { pupilId } = useLocalSearchParams();
    const pupilIdString = Array.isArray(pupilId) ? pupilId[0] : pupilId || "";
    const user = useAppSelector((state) => state.parent.parent);
    const { showLoader, hideLoader } = useOverlay();
    const dispatch = useAppDispatch();
    
    const { data: dashboardData, isPending } = useGetPupilModuleData(
        { id: user?.user.id, token: user?.token }, 
        pupilIdString
    );

    useEffect(() => {
        if (!isPending && dashboardData) {
            dispatch(setParentPupil(dashboardData));
        }
    }, [isPending, dashboardData, dispatch]);

    useEffect(() => {
        if (isPending) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [isPending, showLoader, hideLoader]);
    
    const pupilData = dashboardData;

    useBackButtonHandler()

    const screenWidth = Dimensions.get('window').width;

    const subjectInsights = (pupilData?.subjects ?? []).map(subject => ({
        subjectName: subject.name.replace(/_/g, " "),
        insights: [
            {
                total: subject.totalLessons,
                current: subject.completedLessons,
                label: t("pupilInsight.levels"),
                circleColor: "#FFDEEA",
                circleActiveColor: "#EC6F9E",
                textColor: "#FFAD4B"
            },
            {
                total: subject.stars.total,
                current: subject.stars.earned,
                label: t("pupilInsight.stars"),
                circleColor: "#CEF1FF",
                circleActiveColor: "#0CB5FD",
                textColor: "#00AC56"
            },
            {
                total: subject.badges.total,
                current: subject.badges.earned,
                label: t("pupilInsight.badges"),
                circleColor: "#FFE0D8",
                circleActiveColor: "#FFA27C",
                textColor: "#EC709C"
            },
            {
                total: subject.points?.total ?? 100,
                current: subject.points?.earned ?? 0,
                label: t("pupilInsight.points"),
                circleColor: "#E8D5FF",
                circleActiveColor: "#A991D2",
                textColor: "#A991D2"
            }
        ],
    }))

    const pupilSubject = pupilData?.nextRecommendedSubject ? {
        subjectName: pupilData.nextRecommendedSubject.name,
        levelOrderIndex: 0,
        icon: PupilDeatilSubjectBG,
        colorOne: "#A991D2",
        colorTwo: "#F7C0E9",
    } : undefined

    return (
        <View style={{
            flex: 1, gap: 10,
            paddingHorizontal: 16,
            paddingTop: 40,
            // paddingBottom: 44,
        }}
        >
            <Header isAllowedBack={true} backhref="/(default-bg)/(parent-bg)/notifications" showProgessBar={false} stepBarSide={2} isSettings={true} isDefaultBG={true}
                view={
                    <View>
                        <Text style={themedStyles.pupilDetailText}>{t("pupilDetails.pageheading")}</Text>
                    </View>
                } />
            <View style={{ flex: 1, gap: 30, marginTop: 16 }}>
                <View>
                    <View style={themedStyles.pupilNameContainer}>
                        <Text style={themedStyles.parentZoneText}>{capitalizeFirstLetter(pupilData?.firstName ?? "")}</Text>
                        <PupilOneIconSvg width={40} height={40} />
                    </View>
                    <Text style={themedStyles.parentZoneDescription}>{capitalizeFirstLetter(pupilData?.firstName ?? "")} {capitalizeFirstLetter(pupilData?.lastName ?? "")}’s {t("pupilInsight.desc")}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={themedStyles.scroll}>
                    <View style={themedStyles.container}>
                        {subjectInsights.map((subject, index) => (
                            <View key={index} style={themedStyles.recentActivitiesContainer}>
                                <Text style={themedStyles.text}>{subject.subjectName} {t("pupilInsight.insight")}</Text>
                                <View style={themedStyles.progressCircles}>
                                    {subject.insights.map((progress, idx) => (
                                        <ProgressCircle
                                            key={idx}
                                            total={progress.total}
                                            current={progress.current}
                                            screenWidth={screenWidth}
                                            circleActiveColor={progress.circleActiveColor}
                                            circleColor={progress.circleColor}
                                            label={progress.label}
                                            textColor={progress.textColor}
                                        />
                                    ))}
                                </View>
                            </View>
                        ))}

                        <View style={themedStyles.recentActivitiesContainer}>
                            <Text style={themedStyles.text}>{t("pupilInsight.nextSubject")}</Text>
                            <ScrollView horizontal
                                showsHorizontalScrollIndicator={false}>
                                {/* {PUPIL_SUBJECTS.length > 0 && PUPIL_SUBJECTS.map((subject, index) => ( */}
                                {pupilSubject &&
                                    <PupilSubjectBox
                                        data={pupilSubject}
                                        showDesc={ShowDesc.VIDEO_ICON}
                                    />
                                }
                                {/* ))} */}
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>

    )
}