import Header from "@/components/Header";
import SubjectHierarchy1 from "@/components/SubjectHierarchy1";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import type { RootState } from "@/store";
import { styles } from "@/styles/screens/SubjectHierarchy/index.style";

import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useGetJourneyMap } from "@/services/subjects/subjectQuery";
import { useAppSelector } from "@/store/hooks";
import { safeNavigate } from "@/utils/safeNavigator";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

interface UnitData {
  id: string;
  title: string;
  description?: string;
  gradientColors: [string, string];
  starsEarned?: number;
  starsTotal?: number;
  iconName?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  showStarEarned?: boolean;
  showIntegrationStar?: boolean;
  starProgress?: number;
  isLocked?: boolean;
}

// Gradient colors for units - matching the design images exactly
const UNIT_GRADIENTS: [string, string][] = [
  ["#A991D2", "#F7C0E9"], // Unit 01: Purple to Pink
  ["#F7C0E9", "#EC8B6A"], // Unit 02: Pink to Orange
  ["#5670EC", "#07BAFE"], // Unit 03: Blue to Light Blue
  ["#00AC56", "#00C9A7"], // Unit 04: Green to Teal (brighter teal)
];

export default function SubjectHierarchyScreen() {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showLoader, hideLoader, showToast } = useOverlay();

  // Get params
  const levelId =
    (Array.isArray(params.levelId) ? params.levelId[0] : params.levelId) ?? "";
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

  // Get pupil ID
  const pupil = useAppSelector((s: RootState) => s.activePupil.pupil);
  const pupilId = pupil?.id || "";

  useBackButtonHandler({
    onBackPress: () => {
      safeNavigate(
        router,
        pathname,
        {
          pathname: `/(journey-map)/subject-journey`,
          params: {
            subjectName: subjectName,
            subjectId: subjectId,
            userId: pupilId,
          },
        },
        "replace",
      );
    },
  });

  const {
    data: journeyMapData,
    isPending,
    isError,
  } = useGetJourneyMap({ pupilId, subjectId });
  const [units, setUnits] = useState<UnitData[]>([]);
  const [currentLevelTitle, setCurrentLevelTitle] = useState<string>("");

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

  useEffect(() => {
    if (!journeyMapData?.structure?.[0]) {
      router.replace({
        pathname: "/(journey-map)/subject-journey",
        params: { subjectName, subjectId, userId: pupilId },
      });
      return;
    }
    const rootNode = journeyMapData?.structure?.[0];

    const selectedLevel = rootNode.children.find(
      (child: any) =>
        child.id === levelId &&
        (child.nodeType === "lesson" || child.nodeType === "level"),
    );
    setCurrentLevelTitle(
      selectedLevel?.title || `${t("pupilModule.level")} ${levelNo}`,
    );

    // Extract units from the selected level
    const levelUnits = selectedLevel?.children || [];

    const unitsData: UnitData[] = levelUnits
      .filter((unit: any) => unit.nodeType === "unit")
      .map((unit: any, index: number) => {
        // First unit is always unlocked, others are locked by default
        // TODO: Implement proper locking logic based on previous unit completion
        const isLocked = index > 0; // First unit (index 0) is unlocked
        const isIntegrationUnit = unit.payload?.isIntegrationUnit === true;

        return {
          id: unit.id,
          title:
            unit.title || `${"Unit"} ${String(index + 1).padStart(2, "0")}`,
          description: unit.description,
          gradientColors: UNIT_GRADIENTS[index % UNIT_GRADIENTS.length],
          starsEarned: unit.progress.stars.earned,
          starsTotal: unit.progress.stars.total,
          iconName: isLocked ? "lock-closed" : ("play" as const),
          showStarEarned: !isIntegrationUnit && !isLocked,
          showIntegrationStar: isIntegrationUnit && !isLocked,
          starProgress:
            (unit.progress.stars.earned / unit.progress.stars.total) * 100,
          isLocked,
        };
      });

    if (unitsData.length === 0) {
      router.replace({
        pathname: "/(journey-map)/subject-journey",
        params: { subjectName, subjectId, userId: pupilId },
      });
      return;
    }

    setUnits(unitsData);
  }, [journeyMapData, levelId, levelNo, subjectId, subjectName, pupilId, router, t]);

  const handleCardPress = (cardId: string) => {
    safeNavigate(
      router,
      pathname,
      {
        pathname:
          "/(default-bg)/(pupil-bg)/(with-nav)/subject-hierarchy-lessons",
        params: {
          subjectName,
          unitId: cardId,
          subjectId,
          levelId,
          levelNo,
        },
      },
      "replace",
    );
  };

  return (
    <View style={themedStyles.container}>
      <Header
        isAllowedBack={true}
        backhref={`/(journey-map)/subject-journey?subjectId=${subjectId}&subjectName=${subjectName}`}
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
              {currentLevelTitle
                ? `You're at ${currentLevelTitle.replace(/_/g, " ")} units`
                : "Let's learn together with Nedjmati"}
            </Text>
          </View>
        }
      />

      {/* Cards List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        {isPending ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: theme.text }}>
              {t("subjectHierarchy.loadingUnits")}
            </Text>
          </View>
        ) : units.length > 0 ? (
          <View style={themedStyles.listContainer}>
            <SubjectHierarchy1 cards={units} onCardPress={handleCardPress} />
          </View>
        ) : (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: theme.text }}>
              {t("subjectHierarchy.noUnitsAvailable")}
            </Text>
          </View>
        )}
      </ScrollView>
      {/* <NavigationBar currentDashboard="pupil" /> */}
    </View>
  );
}
