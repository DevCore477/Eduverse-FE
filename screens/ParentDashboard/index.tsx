import { PupilDeatilSubjectBG, PupilOneIconSvg, PupilThreeIcon, PupilTwoIcon } from "@/assets/images";
import Header from "@/components/Header";
import PupilSubjectBox from "@/components/PupilSubjectBox";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useGetParentDataInParallel } from "@/services/parent/parentQuery";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateSubscription } from "@/store/parentSlice";
import { styles } from "@/styles/screens/ParentDashboard/index.style";
import { capitalizeFirstLetter } from "@/utils/caseConversions";
import { safeNavigate } from "@/utils/safeNavigator";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import ProgressCircleList from "./components/ProgressCircleList";
import PupilList from "./components/PupilsList";
import SubjectBoxList from "./components/SubjectBoxList";
import { SwitchButton } from "./components/SwitchButton";

export default function ParentDashboardScreen() {
    const theme = useTheme();
    const { t, isRTL } = useTranslation();
    const user = useAppSelector((state) => state.parent.parent);
    const { showLoader, hideLoader, showToast } = useOverlay();
    useBackButtonHandler({ exitAppScreen: true })
    const dispatch = useAppDispatch()
    const router = useRouter()
    const pathname = usePathname()

    // console.log("Parent data is ", JSON.stringify(user, null, 2))

    const [{ data: parentData, isPending }, { data: dashboardData, isPending: getDashbaordLoader, isError: getDashboardIsError }] = useGetParentDataInParallel({ id: user?.user.id, token: "" })

    const pupils = dashboardData?.pupils ?? [];
    const count = pupils.length;

    const maxProfiles = user?.user?.trailStatue === "active"
        ? user.user.maxPupilsAllowed ?? 0
        : user?.user.subscription?.plan.maxProfiles ?? 0;

    let boxesToShow = Math.min(count, maxProfiles);
    if (count < maxProfiles) boxesToShow = count;

    const themedStyles = styles(theme, isRTL, boxesToShow);

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

    const pupilSubjects = [
        {
            subjectName: "Arabic",
            levelOrderIndex: 0,
            icon: PupilDeatilSubjectBG,
            colorOne: "#EC709C",
            colorTwo: "#EC8477",
        },
        {
            subjectName: "Mathematics",
            levelOrderIndex: 0,
            icon: PupilDeatilSubjectBG,
            colorOne: "#A991D2",
            colorTwo: "#F7C0E9",
        },
        {
            subjectName: "Music",
            levelOrderIndex: 0,
            icon: PupilDeatilSubjectBG,
            colorOne: "#EC709C",
            colorTwo: "#EC8477",
        }
    ]


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


    // console.log("recent activites ", JSON.stringify(recentActivity, null, 2))
    const colorMapping = useMemo(() => [
        { colorOne: "#A991D2", colorTwo: "#F7C0E9", borderColor: "#00000026", icon: PupilOneIconSvg },
        { colorOne: "#EC6F9E", colorTwo: "#EC6F9E", borderColor: "#00000026", icon: PupilTwoIcon },
        { colorOne: "#5670EC", colorTwo: "#07BAFE", borderColor: "#00000026", icon: PupilThreeIcon }
    ], []);

    const pupilsData = useMemo(() => pupils.map((pupil, index) => ({
        icon: colorMapping[index]?.icon ?? PupilOneIconSvg,
        id: pupil.pupilId,
        name: `${capitalizeFirstLetter(pupil.firstName)}`,
        colorOne: colorMapping[index]?.colorOne ?? "#A991D2",
        colorTwo: colorMapping[index]?.colorTwo ?? "#F7C0E9",
        borderColor: colorMapping[index]?.borderColor ?? "#00000026"
    })), [pupils, boxesToShow, colorMapping]);

    const PROGESS_INSIGHTS = useMemo(() => [
        { total: 100, current: dashboardData?.overview.levelsPercent ?? 0, label: t("parentHome.levels"), circleColor: "#FFDEEA", circleActiveColor: "#EC6F9E", textColor: "#FFAD4B" },
        { total: 100, current: dashboardData?.overview.starsPercent ?? 0, label: t("parentHome.stars"), circleColor: "#CEF1FF", circleActiveColor: "#0CB5FD", textColor: "#00AC56" },
        { total: 100, current: dashboardData?.overview.badgesPercent ?? 0, label: t("parentHome.badges"), circleColor: "#FFE0D8", circleActiveColor: "#FFA27C", textColor: "#EC709C" },
        { total: 100, current: dashboardData?.overview.pointsPercent ?? 0, label: t("parentHome.points"), circleColor: "#E8D5FF", circleActiveColor: "#A991D2", textColor: "#A991D2" },
    ], [dashboardData]);

    useEffect(() => {
        if (getDashbaordLoader || isPending) {
            showLoader();
        } {
            hideLoader();
        }
    }, [getDashbaordLoader, isPending, showLoader, hideLoader]);

    useEffect(() => {
        if (getDashboardIsError) {
            showToast("retry");
        }
    }, [getDashboardIsError, showToast]);

    useEffect(() => {
        if (parentData?.subscription) {
            dispatch(updateSubscription(parentData?.subscription));
        }
    }, [parentData?.subscription, dispatch]);




    const canAddPupil = count < maxProfiles;
    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={false} showProgessBar={false} stepBarSide={2} isDefaultBG={true} isSettings={true} view={
                <View>
                    <Text style={themedStyles.parentZoneText}>{t("parentHome.text")}</Text>
                </View>
            } />
            {pupilsData && pupilsData.length > 0 &&
                <View style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
                    <SwitchButton
                        noWrap={true}
                        title={t("setting.switchBtnPupilText")}
                        colorOne="#00AC56"
                        colorTwo="#00743A"
                        textStyle={{ color: "#FFDE3C" }}
                        btnSyle={{ width: 110 }}
                        onPress={() => safeNavigate(router, pathname, "/(default-bg)/pupil-listing", "replace")}
                    />
                </View>
            }
            <View style={{ gap: 32 }}>
                <PupilList style={themedStyles.cotentContainer} canAddPupil={canAddPupil} screenWidth={screenWidth} pupilsData={pupilsData} />

                <ProgressCircleList
                    recentActivitiesContainerStyle={themedStyles.recentActivitiesContainer}
                    textStyle={themedStyles.text}
                    progressCirclesStyle={themedStyles.progressCircles}
                    progressInsight={PROGESS_INSIGHTS}
                    screenWidth={screenWidth}
                    numCircles={4}
                    activityText={t("parentHome.activity")} />

                {pupils && pupils.length > 0 ?
                    <SubjectBoxList
                        recentActivitiesContainerStyle={themedStyles.recentActivitiesContainer}
                        textStyle={themedStyles.text}
                        subjectText={t("parentHome.recentActivity")}
                        pupilSubjects={recentActivity ?? []}
                    /> :
                    <View style={themedStyles.recentActivitiesContainer}>
                        <Text style={themedStyles.text}>{t("pupilDashboard.mandatoryModules")}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {pupilSubjects && pupilSubjects.map((pupilSubject, index) => (
                                <PupilSubjectBox
                                    key={index}
                                    data={pupilSubject}
                                    showDesc={"VIDEO_ICON"}
                                    isModule={true}
                                />
                            ))}
                        </ScrollView>
                    </View>
                }
            </View>
        </View>
    );
}
