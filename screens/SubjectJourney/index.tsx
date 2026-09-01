import Header from "@/components/Header";
import JourneyLevelPicture from "@/components/JourneyLevelPicture";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useGetJourneyMap } from "@/services/subjects/subjectQuery";
import type { RootState } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/screens/SubjectJourney/index.style";
import { TLevelItem } from "@/types/subjects";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

const PUPIL_DASHBOARD_HREF = {
  pathname: "/(default-bg)/(pupil-bg)/(with-nav)/pupil-dashboard" as const,
};

export default function SubjectJourney() {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const params = useLocalSearchParams();
  const router = useRouter();

  const { showLoader, hideLoader, showToast } = useOverlay();

  const goToPupilCourses = useCallback(() => {
    router.replace(PUPIL_DASHBOARD_HREF);
  }, [router]);

  useBackButtonHandler({ onBackPress: goToPupilCourses });

  const pupil = useAppSelector((s: RootState) => s.activePupil.pupil);
  const pupilId = pupil?.id || "";

  const subjectId = String(params.subjectId || "");
  const subjectName = String(params.subjectName || "Subject");
  const { t } = useTranslation();

  const {
    data: journeyMapData,
    isPending,
    isError,
  } = useGetJourneyMap({ pupilId, subjectId });
  console.log("pupil id is ", pupilId);
  console.log("subject id is ", subjectId);

  const [levels, setLevels] = useState<TLevelItem[]>([]);

  const currentUnlockedLevel = useMemo(() => {
    const unlockedLevel = levels.findLast((level) => !level.isLocked);
    return unlockedLevel ? unlockedLevel.level : 0;
    // return 0
  }, [levels]);

  /**
   * Recursively checks if a node is complete by traversing its children
   * Rules:
   * - If node has children: it's complete when ALL its children are complete
   * - If node has no children (leaf): it's complete when completed_steps >= 3 (for 4 total steps)
   */
  const isNodeComplete = (node: any): boolean => {
    // Base case: If node has children, check if ALL children are complete
    if (node.children && node.children.length > 0) {
      return node.children.every((child: any) => isNodeComplete(child));
    }

    // Leaf node (lesson/topic with no children): check progress
    if (node.progress) {
      const { totalSteps, completedSteps } = node.progress;
      // Topics have 4 total steps, need at least 3 completed
      return completedSteps >= 3 && totalSteps === 4;
    }

    // If no progress data, consider incomplete
    return false;
  };

  useEffect(() => {
    if (!journeyMapData?.structure?.[0]) return;

    const rootNode = journeyMapData?.structure?.[0];
    if (!rootNode?.children) return;

    // Get first-level children (levels or lessons)
    const firstLevelNodes = rootNode.children.filter(
      (child: any) =>
        child.node_type === "level" ||
        child.node_type === "lesson" ||
        child.nodeType === "level" ||
        child.nodeType === "lesson",
    );

    const levelsData: TLevelItem[] = firstLevelNodes.map(
      (node: any, index: number) => {
        // Recursively check if this node is complete
        const isCompleted = isNodeComplete(node);

        // Determine if locked:
        // - Level 1: never locked
        // - Level 2+: locked if previous level is NOT complete
        let isLocked = false;
        if (index > 0) {
          // Check if ALL previous levels are complete
          const allPreviousCompleted = firstLevelNodes
            .slice(0, index)
            .every((prevNode: any, prevIndex: number) => {
              // For previous nodes, we need to check their completion status
              // But careful: we can't use levelsData because it's not built yet
              return isNodeComplete(prevNode);
            });

          isLocked = !allPreviousCompleted;
        }

        // Determine if current:
        // - Find the first level that is NOT complete
        // - That's the current level
        let isCurrent = false;

        // Find the first incomplete level
        const firstIncompleteIndex = firstLevelNodes.findIndex((_, i) => {
          const nodeToCheck = firstLevelNodes[i];
          return !isNodeComplete(nodeToCheck);
        });

        // If this node is the first incomplete node, it's current
        if (firstIncompleteIndex === index) {
          isCurrent = true;
        }

        // Special case: if all levels are complete, then the last level is current
        if (
          firstIncompleteIndex === -1 &&
          index === firstLevelNodes.length - 1
        ) {
          isCurrent = true;
        }

        return {
          id: node.id,
          title: node.title || `${t("pupilModule.level")} ${index + 1}`,
          level: index + 1,
          isLocked,
          isCurrent,
          isCompleted,
          stars: node.progress?.stars?.earned || 0,
          isLesson: node.node_type === "lesson" || node.nodeType === "lesson",
        };
      },
    );

    setLevels(levelsData);
  }, [journeyMapData]);

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

  const headerSubtitle = useMemo(() => {
    if (currentUnlockedLevel > 0) {
      return `${t("pupilModule.level")} ${currentUnlockedLevel}`;
    }
    return `${t("pupilModule.level")} ${currentUnlockedLevel}`;
  }, [currentUnlockedLevel]);

  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.headerContainer}>
        <Header
          isAllowedBack={true}
          onBackPressed={goToPupilCourses}
          showProgessBar={false}
          stepBarSide={1}
          isSettings={true}
          isDefaultBG={false}
          backIconColor="#FFFFFF"
          containerStyle={{
            paddingHorizontal: 16,
            zIndex: 10,
          }}
          view={
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
              pointerEvents="box-none"
            >
              <Text style={themedStyles.headerTitle}>{subjectName}</Text>
              <Text style={themedStyles.headerSubtitle}>{headerSubtitle}</Text>
            </View>
          }
        />
      </View>
      <View style={themedStyles.mapWrapper}>
        <JourneyLevelPicture
          levelsData={levels}
          subjectId={subjectId}
          subjectName={subjectName}
          pupilId={pupilId}
          currentUnlockedLevel={currentUnlockedLevel}
          size={50}
        />
      </View>
    </View>
  );
}
