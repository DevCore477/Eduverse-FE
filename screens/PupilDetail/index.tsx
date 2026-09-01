import { PupilDeatilSubjectBG, PupilOneIconSvg } from "@/assets/images";
import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useGetPupilModuleData } from "@/services/pupil/pupilQuery";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setParentPupil } from "@/store/parentPupilSlice";
import { styles } from "@/styles/screens/PupilDetail/index.style";
import { safeNavigate } from "@/utils/safeNavigator";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import ProgressCircle from "../../components/ProgressCircles";
import PupilSubjectBox, { ShowDesc } from "../../components/PupilSubjectBox";
import ProgressBar from "./compoonents/ProgressBar";
import EditProfileButton from "./compoonents/PupilEditButton";
import { capitalizeFirstLetter } from "@/utils/caseConversions";


export default function PupilDetailScreen() {
    const theme = useTheme();
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);
    const router = useRouter()
    const pathname = usePathname()
    const { pupilId } = useLocalSearchParams();
    const pupilIdString = Array.isArray(pupilId) ? pupilId[0] : pupilId || "";
    const user = useAppSelector((state) => state.parent.parent);
    const { data: dashboardData, isPending, isError, error } = useGetPupilModuleData({ id: user?.user.id, token: user?.token }, pupilIdString);
    const { showLoader, hideLoader, showToast } = useOverlay();
    const dispatch = useAppDispatch()
    useBackButtonHandler()

    const subjectColors = [
        {
            colorOne: "#A991D2",
            colorTwo: "#F7C0E9",
        },
        {
            colorOne: "#EC709C",
            colorTwo: "#EC8477",
        },
    ]

    const progressInsights = [
        {
            total: dashboardData?.levels.total ?? 100,
            current: dashboardData?.levels.completed ?? 0,
            label: t("pupilDetails.levels"),
            circleColor: "#FFDEEA",
            circleActiveColor: "#EC6F9E",
            textColor: "#FFAD4B"
        },
        {
            total: dashboardData?.stars.total ?? 100,
            current: dashboardData?.stars.earned ?? 0,
            label: t("pupilDetails.stars"),
            circleColor: "#CEF1FF",
            circleActiveColor: "#0CB5FD",
            textColor: "#00AC56"
        },
        {
            total: dashboardData?.badges.total ?? 100,
            current: dashboardData?.badges.earned ?? 0,
            label: t("pupilDetails.badges"),
            circleColor: "#FFE0D8",
            circleActiveColor: "#FFA27C",
            textColor: "#EC709C"
        },
        {
            total: dashboardData?.points?.total ?? 100,
            current: dashboardData?.points?.earned ?? 0,
            label: t("pupilDetails.points"),
            circleColor: "#E8D5FF",
            circleActiveColor: "#A991D2",
            textColor: "#A991D2"
        },
    ]

    const screenWidth = Dimensions.get('window').width;
    const subjects = dashboardData?.subjects ?? []

    const progressBarColors = ["#EC8A6C", "#EC709C"]

    const progressBar = subjects.map((subject, index) => ({
        lable: subject.name.replace(/_/g, " "),
        percentageNumber: subject.percent,
        color: progressBarColors[index % progressBarColors.length]
    }))


    const PUPIL_SUBJECTS = useMemo(() => [
        {
            icon: PupilDeatilSubjectBG,
            colorOne: "#A991D2",
            colorTwo: "#F7C0E9",
        },
        {
            icon: PupilDeatilSubjectBG,
            colorOne: "#EC709C",
            colorTwo: "#EC8477",
        },
    ], [])

    const recentActivity = useMemo(() => {
        return dashboardData?.recentActivities?.map((activity, index) => {
            const subjectIndex = index % PUPIL_SUBJECTS.length;  // To loop over the subjects if there are more activities than subjects
            return {
                ...activity,
                icon: PUPIL_SUBJECTS[subjectIndex].icon,
                colorOne: PUPIL_SUBJECTS[subjectIndex].colorOne,
                colorTwo: PUPIL_SUBJECTS[subjectIndex].colorTwo,
            };
        });
    }, [dashboardData?.recentActivities, PUPIL_SUBJECTS]);



    // console.log("progress bar ", progressBar)
    useEffect(() => {
        if (!isPending && dashboardData) {
            dispatch(setParentPupil(dashboardData))
        }
    }, [isPending, dashboardData])

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

    return (
        <View style={{
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 40,
        }}>
            <Header isAllowedBack={true} showProgessBar={false} stepBarSide={2} isSettings={true} isDefaultBG={true}
                view={
                    <View>
                        <Text style={themedStyles.pupilDetailText}>{t("pupilDetails.pageheading")}</Text>
                    </View>
                } />
            <View style={{ flex: 1, gap: 30, marginTop: 16 }}>
                <View style={themedStyles.dashboardHeaderContainer}>
                    <View style={themedStyles.dashboardHeaderLeft}>
                        <View style={themedStyles.pupilNameContainer}>
                            <Text style={themedStyles.parentZoneText}>{capitalizeFirstLetter(dashboardData?.firstName ?? "")}</Text>
                            <PupilOneIconSvg width={40} height={40} />
                        </View>
                        <Text style={themedStyles.parentZoneDescription}>{capitalizeFirstLetter(dashboardData?.firstName ?? "")} {capitalizeFirstLetter(dashboardData?.lastName ?? "")}’s {t("pupilDetails.desc")}</Text>
                    </View>

                    <EditProfileButton onPress={() => { safeNavigate(router, pathname, { pathname: "/(default-bg)/(parent-bg)/edit-pupil", params: { pupilId: pupilIdString } }) }} />
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={themedStyles.scroll}>
                    <View
                        style={themedStyles.container}>

                        <View style={themedStyles.recentActivitiesContainer}>
                            <Text style={themedStyles.text}>{t("pupilDetails.recentActivities")}</Text>
                            <ScrollView horizontal
                                showsHorizontalScrollIndicator={false}>
                                {recentActivity && recentActivity?.length > 0 && recentActivity.map((subject, index) => (
                                    <PupilSubjectBox
                                        key={index}
                                        data={subject}
                                        showDesc={ShowDesc.NONE}
                                    />
                                ))}
                            </ScrollView>
                        </View>

                        <View style={themedStyles.recentActivitiesContainer}>
                            <View style={themedStyles.progressInsignthsTextContainer}>
                                <Text style={[themedStyles.text, themedStyles.textRowFill]}>{t("pupilDetails.insights")}</Text>
                                <Pressable onPress={() => { safeNavigate(router, pathname, { pathname: "/(default-bg)/(parent-bg)/pupil-insight-details", params: { pupilId: pupilIdString } }) }} >
                                    <Text style={themedStyles.detailsLink}>
                                        {t("pupilDetails.details")}
                                    </Text>
                                </Pressable>
                            </View>
                            <View style={themedStyles.progressCircles}>
                                {progressInsights.map((progress, index) => (
                                    <ProgressCircle key={index} screenWidth={screenWidth} total={progress.total} current={progress.current} circleActiveColor={progress.circleActiveColor} circleColor={progress.circleColor} label={progress.label} textColor={progress.textColor} />
                                ))
                                }
                            </View>
                        </View>

                        <View style={themedStyles.recentActivitiesContainer}>
                            <Text style={themedStyles.text}>{t("pupilDetails.subjectProgress")}</Text>
                            <View >
                                {progressBar.map((progress, index) => (
                                    <ProgressBar key={index} lable={progress.lable} color={progress.color} percentageNumber={progress.percentageNumber} />
                                ))
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView >
            </View>
        </View>
    )
}