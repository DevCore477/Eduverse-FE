import Header from "@/components/Header";
import OverlayUI from "@/components/OverlayUI";
import SubjectHierarchy2 from "@/components/SubjectHierarchy2";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useGetJourneyMap } from "@/services/subjects/subjectQuery";
import type { RootState } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/screens/SubjectHierarchy/index.style";
import { safeNavigate } from "@/utils/safeNavigator";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

interface LessonData {
  id: string;
  title: string;
  description?: string;
  gradientColors: [string, string];
  isCompleted: boolean;
  iconName?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
}

// Gradient colors for lessons - matching the design images
const LESSON_GRADIENTS: [string, string][] = [
  ["#A991D2", "#E8D5F2"], // Lesson 1: Purple to Light Purple
  ["#F7C0E9", "#EC8B6A"], // Lesson 2: Pink to Orange
  ["#5670EC", "#07BAFE"], // Lesson 3: Blue to Light Blue
  ["#EC8B6A", "#FFD93D"], // Lesson 4: Orange to Yellow
  ["#00AC56", "#00D4A3"], // Lesson 5: Green to Teal
  ["#A991D2", "#E8D5F2"], // Lesson 6: Purple to Light Purple
];

export default function SubjectHierarchyLessonsScreen() {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showLoader, hideLoader, showToast } = useOverlay();

  // Get params
  const unitId =
    (Array.isArray(params.unitId) ? params.unitId[0] : params.unitId) ?? "";
  const levelNo =
    (Array.isArray(params.levelNo) ? params.levelNo[0] : params.levelNo) ?? "";
  const subjectId =
    (Array.isArray(params.subjectId)
      ? params.subjectId[0]
      : params.subjectId) ?? "";
  const subjectName =
    (Array.isArray(params.subjectName)
      ? params.subjectName[0]
      : params.subjectName) ?? "";
  const levelId =
    (Array.isArray(params.levelId) ? params.levelId[0] : params.levelId) ?? "";

  console.log("subject-heir-lesson level id ", levelId);

  const isIntegration =
    (Array.isArray(params.isIntegration)
      ? params.isIntegration[0]
      : params.isIntegration) === "true";

  // Get pupil ID
  const pupil = useAppSelector((s: RootState) => s.activePupil.pupil);
  const pupilId = pupil?.id || "";

  useBackButtonHandler({
    onBackPress: () => {
      safeNavigate(
        router,
        pathname,
        {
          pathname: "/(default-bg)/(pupil-bg)/(with-nav)/subject-hierarchy",
          params: {
            levelId: levelId,
            subjectId: subjectId,
            subjectName: subjectName,
            levelNo,
          },
        },
        "replace",
      );
    },
  });
  console.log("pupil id is ", pupilId);
  console.log("subject id is ", subjectId);

  const {
    data: journeyMapData,
    isPending,
    isError,
  } = useGetJourneyMap({ pupilId, subjectId });
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [currentUnitTitle, setCurrentUnitTitle] = useState<string>("");

  // Show/hide loader based on loading state
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

  // Fetch journey map and extract lessons for the selected unit
  useEffect(() => {
    // console.log("JOurney map in subject-hirachu-lesson is ", JSON.stringify(journeyMapData, null, 2))
    // console.log("JOurney map in subject-hirachu-lesson is ", journeyMapData)

    if (!journeyMapData?.structure?.length) {
      router.replace({
        pathname: "/(default-bg)/(pupil-bg)/(with-nav)/subject-hierarchy",
        params: { levelId, subjectId, subjectName, levelNo },
      });
      return;
    }
    console.log(
      "journeyMapData?.structure?.length ",
      journeyMapData?.structure?.length,
    );

    const rootNode = journeyMapData.structure[0];
    if (!rootNode?.children?.length) {
      router.replace({
        pathname: "/(default-bg)/(pupil-bg)/(with-nav)/subject-hierarchy",
        params: { levelId, subjectId, subjectName, levelNo },
      });
      return;
    }
    // console.log("rootNode?.children?.length ", rootNode?.children?.length)
    // console.log("rootNode?.children? ", JSON.stringify(rootNode?.children, null, 2))
    // console.log("level id is ",levelId)
    const selectedLevel = rootNode.children.find(
      (child: any) => child.id === levelId && child.nodeType === "level",
    );

    if (!selectedLevel?.children?.length) {
      router.replace({
        pathname: "/(default-bg)/(pupil-bg)/(with-nav)/subject-hierarchy",
        params: { levelId, subjectId, subjectName, levelNo },
      });
      return;
    }

    const selectedUnit = selectedLevel?.children.find(
      (unit: any) => unit.id === unitId && unit.nodeType === "unit",
    );
    console.log("selectedUnit ", selectedUnit);
    if (!selectedUnit) {
      router.replace({
        pathname: "/(default-bg)/(pupil-bg)/(with-nav)/subject-hierarchy",
        params: { levelId, subjectId, subjectName, levelNo },
      });
      return;
    }

    setCurrentUnitTitle(selectedUnit?.title || "Unit");

    const unitLessons = selectedUnit.children ?? [];

    const lessonsData: LessonData[] = unitLessons
      .filter(
        (lesson: any) =>
          lesson.nodeType === "lesson" || lesson.node_type === "lesson",
      )
      .map((lesson: any, index: number) => {
        const progress = lesson.progress;
        return {
          id: lesson.id,
          title: lesson.title || `Lesson ${index + 1}`,
          description: progress
            ? `${progress.completedSteps || 0}/${progress.totalSteps || 0}`
            : undefined,
          isCompleted:
            progress &&
            (progress.completedSteps === progress.totalSteps ||
              progress.completedSteps === progress.totalSteps - 1),
          gradientColors: LESSON_GRADIENTS[index % LESSON_GRADIENTS.length],
          iconName: "play",
        };
      });

    if (lessonsData.length === 0) {
      router.replace({
        pathname: "/(default-bg)/(pupil-bg)/(with-nav)/subject-hierarchy",
        params: { levelId, subjectId, subjectName, levelNo },
      });
      return;
    }

    setLessons(lessonsData);
    hideLoader();
  }, [journeyMapData, unitId, levelId, subjectId, subjectName, levelNo, router]);

  const handleItemPress = (itemId: string, index: number) => {
    // Navigate to lesson grid (lesson cards)

    safeNavigate(
      router,
      pathname,
      {
        pathname: "/(default-bg)/(pupil-bg)/(with-nav)/lesson-grid",
        params: {
          lessonId: itemId,
          subjectId,
          subjectName,
          pupilId: pupilId || "",
          isIntegration: isIntegration ? "true" : "false",
          levelNo,
          lessonNo: index.toString(),
          unitId,
          levelId,
        },
      },
      "replace",
    );
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("in useFocusEffect lesson data is ", lessons)
  //   }, [])
  // );
  // useEffect(()=>{
  //   console.log("in useEffect lesson data is  ",lessons)
  // },[lessons])
  return (
    <View style={themedStyles.container}>
      <Header
        isAllowedBack={true}
        backhref={`/(default-bg)/(pupil-bg)/(with-nav)/subject-hierarchy?levelId=${levelId}&subjectId=${subjectId}&subjectName=${subjectName}&levelNo=${levelNo}`}
        showProgessBar={false}
        isDefaultBG={true}
        isSettings={true}
        view={
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Text style={themedStyles.greeting}>{subjectName}</Text>
            <Text style={themedStyles.subtitle}>
              {currentUnitTitle
                ? `${t("subjectHierarchy.youAreAt")} ${currentUnitTitle.replace(/_/g, " ")} ${t("subjectHierarchy.lessons")}`
                : t("subjectHierarchy.subtitle")}
            </Text>
          </View>
        }
      />

      {/* Items List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        {isPending ? (
          <OverlayUI visible={isPending} mode={"loader"} />
        ) : lessons.length > 0 ? (
          <View style={themedStyles.listContainer}>
            <SubjectHierarchy2 items={lessons} onItemPress={handleItemPress} />
          </View>
        ) : (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: theme.text }}>
              {t("subjectHierarchy.noLessonsAvailable")}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
