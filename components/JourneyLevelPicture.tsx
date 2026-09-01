import {
  BadgeIcon,
  CurrentLevelStar,
  JourneyBgPNG,
  LevelEightBG,
  LevelFiveBG,
  LevelFourBG,
  LevelOneBG,
  LevelSevenBG,
  LevelSixBG,
  LevelThreeBG,
  LevelTwoBG,
} from "@/assets/images";
import { useTranslation } from "@/hooks/use-translation";
import {
  LEVEL_POSITIONS,
  SLIDER_LEVEL_POSITIONS,
  TLevelItem,
} from "@/types/subjects";
import { safeNavigate } from "@/utils/safeNavigator";
import { ImageStyle } from "expo-image";
import { usePathname, useRouter } from "expo-router";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const LEVEL_IMAGES = [
  LevelOneBG,
  LevelTwoBG,
  LevelThreeBG,
  LevelFourBG,
  LevelFiveBG,
  LevelSixBG,
  LevelSevenBG,
  LevelEightBG,
];

interface JourneyLevelPictureProps {
  levelsData: TLevelItem[];
  subjectId: string;
  subjectName: string;
  pupilId: string;
  currentUnlockedLevel: number;
  size: number;
}

// Helper function to render individual level icon (t passed from parent to avoid hooks in callback)
const renderLevelIcon = (
  levelData: TLevelItem,
  level: number,
  size: number,
  t: (key: string) => string,
) => {
  const levelNo = levelData?.level || 0;
  const isLocked = levelData?.isLocked || false;
  const isCurrent = levelData?.isCurrent || false;
  const isCompleted = levelData?.isCompleted || false;

  const levelLabelStyle: TextStyle = {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: "center" as const,
  };

  const imageIndex = Math.max(
    0,
    Math.min(levelNo - 1, LEVEL_IMAGES.length - 1),
  );

  const image = LEVEL_IMAGES[imageIndex];

  if (isCurrent) {
    return (
      <View style={{ position: "relative" }}>
        <Image
          source={image}
          style={{
            width: 50,
            height: 50,
            borderWidth: 1,
            borderColor: "#FFD203",
            borderRadius: 8,
            position: "absolute",
            top: -50,
            left: -40,
          }}
        />
        <Image
          source={CurrentLevelStar}
          style={{
            width: 50,
            height: 50,
            position: "absolute",
          }}
        />
        <Text style={[levelLabelStyle, { position: "absolute", top: 52 }]}>
          {t("pupilModule.levelText")} {level}
        </Text>
      </View>
    );
  } else if (isCompleted) {
    return (
      <View style={{ position: "relative", alignItems: "center" }}>
        <View
          style={{
            position: "absolute",
            top: -20,
            flexDirection: "row",
            gap: 0,
          }}
        >
          <Image
            source={BadgeIcon}
            style={{
              width: 28,
              height: 28,
              marginRight: -8,
              transform: [{ rotate: "-20deg" }],
            }}
          />
          <Image
            source={BadgeIcon}
            style={{ width: 28, height: 28, marginTop: -8 }}
          />
          <Image
            source={BadgeIcon}
            style={{
              width: 28,
              height: 28,
              marginLeft: -8,
              transform: [{ rotate: "27deg" }],
            }}
          />
        </View>
        <Image
          source={image}
          style={{
            width: 50,
            height: 50,
            borderWidth: 1,
            borderColor: "#FFD203",
            borderRadius: 25,
          }}
          resizeMode="cover"
        />
        <Text style={levelLabelStyle}>
          {t("pupilModule.levelText")} {level}
        </Text>
      </View>
    );
  } else if (isLocked) {
    return (
      <View>
        <Image
          source={image}
          style={{
            width: 50,
            height: 50,
            borderWidth: 1,
            borderColor: "#FFD203",
            borderRadius: 8,
          }}
          resizeMode="cover"
        />
        <Text style={levelLabelStyle}>
          {t("pupilModule.levelText")} {level}
        </Text>
      </View>
    );
  } else {
    return (
      <Image
        source={image}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }
};
const JourneyLevelPicture: React.FC<JourneyLevelPictureProps> = ({
  levelsData = [],
  subjectId,
  subjectName,
  pupilId,
  currentUnlockedLevel,
  size = 50,
}) => {
  const { t } = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [initialScrollDone, setInitialScrollDone] = useState<boolean>(false);
  const [contentReady, setContentReady] = useState(false);

  const levelPerImage: number = 5;

  // Group the levels into chunks of 8
  const groupedLevels: TLevelItem[][] = [];
  for (let i = 0; i < levelsData.length; i += levelPerImage) {
    const slicedLevels = levelsData.slice(i, i + levelPerImage);
    groupedLevels.push(slicedLevels);
  }

  // REVERSE THE GROUPED LEVELS for upward scrolling
  const reversedGroupedLevels = [...groupedLevels].reverse();

  // Calculate full screen dimensions
  useEffect(() => {
    const { width, height } = Dimensions.get("window");
    setContainerHeight(height);
    setContainerWidth(width);
  }, []);

  // Handle scroll to detect current page (vertical)
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const pageIndex = Math.round(offsetY / (containerHeight - 40));
    // Calculate page index from bottom for reversed order
    const reversedPageIndex = reversedGroupedLevels.length - 1 - pageIndex;
  };

  const router = useRouter();
  const pathname = usePathname();

  const onLevelPress = (levelData: TLevelItem, levelNo: number) => {
    console.log("level data is ", levelData);
    console.log("levelNo is ", levelNo);

    if (levelData.isLesson) {
      safeNavigate(
        router,
        pathname,
        {
          pathname: "/(default-bg)/(pupil-bg)/(with-nav)/lesson-grid",
          params: {
            lessonId: levelData.id,
            subjectId,
            subjectName,
            pupilId: pupilId,
            levelNo,
            isFromMap: "true",
          },
        },
      );
    } else {
      safeNavigate(
        router,
        pathname,
        {
          pathname: "/(default-bg)/(pupil-bg)/(with-nav)/subject-hierarchy",
          params: {
            levelId: levelData?.id,
            subjectId: subjectId,
            subjectName: subjectName,
            levelNo,
          },
        },
      );
    }
  };

  const pageSliderContainerStyle: ViewStyle = {
    height: containerHeight,
    width: containerWidth,
    position: "relative" as const,
  };

  const pageContainerStyle: ViewStyle = {
    flex: 1,
    width: containerWidth,
    position: "relative" as const,
  };
  const imageStyle: ImageStyle = {
    width: containerWidth,
    height: containerHeight,
    resizeMode: "stretch" as const,
    position: "absolute" as const,
  };

  const imageStyleSlider: ImageStyle = {
    width: containerWidth,
    height: containerHeight,
    resizeMode: "stretch" as const,
    position: "absolute" as const,
  };

  const levelContainerStyle = (top: number, left: number): ViewStyle => ({
    position: "absolute" as const,
    top,
    left,
    zIndex: 1,
  });

  const levelWrapperStyle: ViewStyle = {
    alignItems: "center",
  };

  // Check if there's only one page (8 or fewer levels)
  const hasOnlyOnePage = groupedLevels.length <= 1;

  useEffect(() => {
    if (
      !contentReady ||
      !scrollViewRef.current ||
      currentUnlockedLevel <= 0 ||
      initialScrollDone
    ) {
      return;
    }

    const pageHeight = containerHeight + 20;
    const targetPage = Math.floor((currentUnlockedLevel - 1) / levelPerImage);
    const reversedTargetPage = groupedLevels.length - 1 - targetPage;
    const scrollPosition = reversedTargetPage * pageHeight;

    scrollViewRef.current.scrollTo({
      y: scrollPosition,
      animated: false,
    });

    setInitialScrollDone(true);
  }, [
    contentReady,
    currentUnlockedLevel,
    containerHeight,
    groupedLevels.length,
    initialScrollDone,
  ]);

  // Alternative approach: Prevent initial render until we know where to scroll
  const [shouldRenderContent, setShouldRenderContent] = useState(false);

  useEffect(() => {
    if (containerHeight > 0) {
      setShouldRenderContent(true);
    }
  }, [containerHeight]);

  if (!shouldRenderContent) {
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  }

  return (
    <View
      style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-end" }}
    >
      {hasOnlyOnePage ? (
        <View style={[pageContainerStyle]}>
          {groupedLevels[0] && (
            <>
              <Image source={JourneyBgPNG} style={imageStyle} />
              {groupedLevels[0].map((levelData: TLevelItem, idx: number) => {
                const levelPosition = hasOnlyOnePage
                  ? LEVEL_POSITIONS[idx]
                  : SLIDER_LEVEL_POSITIONS[idx];
                const absoluteLeft: number =
                  levelPosition.left * containerWidth;
                const absoluteTop: number = levelPosition.top * containerHeight;

                return (
                  <View
                    key={levelData?.id || idx}
                    style={levelContainerStyle(absoluteTop, absoluteLeft)}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        onLevelPress(levelData, levelData?.level || idx + 1)
                      }
                      activeOpacity={0.85}
                      style={[levelWrapperStyle, { padding: 20 }]}
                    >
                      {renderLevelIcon(
                        levelData,
                        levelData?.level || idx + 1,
                        size,
                        t,
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </>
          )}
        </View>
      ) : (
        <>
          <ScrollView
            ref={scrollViewRef}
            style={styles.container}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => setContentReady(true)}
            alwaysBounceVertical={true}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {reversedGroupedLevels.map(
              (levelGroup: TLevelItem[], groupIndex: number) => {
                // Calculate the original group index (from bottom)
                const originalGroupIndex =
                  groupedLevels.length - 1 - groupIndex;

                return (
                  <View key={groupIndex} style={pageSliderContainerStyle}>
                    <Image source={JourneyBgPNG} style={imageStyleSlider} />
                    {levelGroup.map((levelData: TLevelItem, idx: number) => {
                      const levelPosition = hasOnlyOnePage
                        ? LEVEL_POSITIONS[idx]
                        : SLIDER_LEVEL_POSITIONS[idx];

                      const absoluteLeft = levelPosition.left * containerWidth;
                      const absoluteTop = levelPosition.top * containerHeight;

                      // Calculate actual level number (levels 1-8 are at bottom, 9-16 above them)
                      const actualLevel =
                        originalGroupIndex * levelPerImage + idx + 1;

                      return (
                        <View
                          key={levelData?.id || idx}
                          style={levelContainerStyle(absoluteTop, absoluteLeft)}
                        >
                          <TouchableOpacity
                            onPress={() => onLevelPress(levelData, actualLevel)}
                            activeOpacity={0.85}
                            style={[levelWrapperStyle, { padding: 20 }]}
                          >
                            {renderLevelIcon(levelData, actualLevel, size, t)}
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                );
              },
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default memo(JourneyLevelPicture);

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: width,
    height: height,
    resizeMode: "stretch",
    borderRadius: 10,
  },
});
