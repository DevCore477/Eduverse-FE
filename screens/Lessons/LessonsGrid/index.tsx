import LessonIntroduction from "@/assets/images/lessongrid/LessonIntroduction.svg";
import LessonVideo from "@/assets/images/lessongrid/LessonVideo.svg";
import LetsStart from "@/assets/images/PupilOne.svg";
import Header from "@/components/Header";
import LessonCardComponent from "@/components/LessonCard";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import {
  useGetSubjectLessonCardsOld,
  useGetSubjects,
} from "@/services/subjects/subjectMutation";
import { useGetLessonProgress } from "@/services/subjects/subjectQuery";
import { useAppDispatch } from "@/store/hooks";
import { setLessonQuestions } from "@/store/lessonQuestionSlice";
import { styles } from "@/styles/screens/Lessons/LessonGrid/index.style";
import { TLessonQuestionResult } from "@/types/questions";
import { safeNavigate } from "@/utils/safeNavigator";

import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

const CARD_UI_MAP = {
  lesson_intro: { icon: "play", Image: LessonIntroduction },
  lesson_video: { icon: "play", Image: LessonVideo },
  // practice_questions: { icon: "bulb", Image: PracticeLesson },
  final_journey: { Image: LetsStart },
} as const;

const CARD_ORDER: (keyof typeof CARD_UI_MAP)[] = [
  "lesson_intro",
  "lesson_video",
  // "practice_questions",
  "final_journey",
];

export default function LessonsGridScreen() {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const params = useLocalSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const pupilId =
    (Array.isArray(params.pupilId) ? params.pupilId[0] : params.pupilId) ?? "";
  const unitId =
    (Array.isArray(params.unitId) ? params.unitId[0] : params.unitId) ?? "";
  const levelId =
    (Array.isArray(params.levelId) ? params.levelId[0] : params.levelId) ?? "";
  const levelNo =
    (Array.isArray(params.levelNo) ? params.levelNo[0] : params.levelNo) ?? "";
  const lessonNo =
    (Array.isArray(params.lessonNo) ? params.lessonNo[0] : params.lessonNo) ??
    "";
  const paramLessonId =
    (Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId) ??
    "";
  const isIntegration =
    (Array.isArray(params.isIntegration)
      ? params.isIntegration[0]
      : params.isIntegration) === "true";

  const isFromMap =
    (Array.isArray(params.isFromMap)
      ? params.isFromMap[0]
      : params.isFromMap) === "true";

  const subjectId =
    (Array.isArray(params.subjectId)
      ? params.subjectId[0]
      : params.subjectId) ?? "";

  const paramSubjectName =
    (Array.isArray(params.subjectName)
      ? params.subjectName[0]
      : params.subjectName) ?? "";

  const lessonId = paramLessonId;

  console.log("lesson-grid level id is ", levelId);

  const [hasAudio, setHasAudio] = useState<boolean>(false);
  const [hasVideo, setHasVideo] = useState<boolean>(false);
  const [hasQuestion, setHasQuestion] = useState<boolean>(false);

  const { showLoader, hideLoader } = useOverlay();
  const [lessons, setLessons] = useState<any[]>([]);
  const [subjectName, setSubjectName] = useState<string>(paramSubjectName);

  // Initialize mutations
  const { mutate: getCards, isPending } = useGetSubjectLessonCardsOld(
    pupilId,
    paramLessonId || lessonId,
  );
  const { mutate: getSubjects } = useGetSubjects(pupilId);
  // const { mutate: getJourneyMap } = useGetJourneyMapOld(pupilId);
  // const { data: journeyMapData, isPending: isGetJourneyMap, isError } = useGetJourneyMap({ pupilId, subjectId })
  const { data: lessonProgress, isPending: isLessonProgressPending } =
    useGetLessonProgress({ pupilId, lessonId });

  console.log("lesson id is ", lessonId);
  const handleBack = () => {
    if (isFromMap) {
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
    } else {
      safeNavigate(
        router,
        pathname,
        {
          pathname:
            "/(default-bg)/(pupil-bg)/(with-nav)/subject-hierarchy-lessons",
          params: {
            subjectName,
            unitId,
            subjectId,
            levelId,
            lessonNo,
            levelNo,
          },
        },
        "replace",
      );
    }
  };

  useBackButtonHandler({ onBackPress: handleBack });

  const getStepIds = () => {
    const stepIds = {
      introStepId: "",
      videoStepId: "",
      finalJourneyStepId: "",
    };

    lessons.forEach((lesson) => {
      if (lesson.key === "lesson_intro") {
        stepIds.introStepId = lesson.stepId;
      } else if (lesson.key === "lesson_video") {
        stepIds.videoStepId = lesson.stepId;
      } else if (lesson.key === "final_journey") {
        stepIds.finalJourneyStepId = lesson.stepId;
      }
    });

    return stepIds;
  };

  useEffect(() => {
    if (isLessonProgressPending || isPending) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLessonProgressPending, isPending]);

  useEffect(() => {
    if (lessonProgress) {
      // console.log("lesson progress ", JSON.stringify(lessonProgress, null, 2));

      const allQuestions = [
        lessonProgress.progressData.practice?.questions[0] ?? {},
        ...(lessonProgress.progressData.finalChallenge?.questions || []),
      ];

      // console.log("all questions ",JSON.stringify(allQuestions, null, 2))
      // Dispatch lesson progress to Redux
      const lesson: TLessonQuestionResult = {
        lessonId,
        questions: allQuestions,
      };
      // console.log("set lesson questions are ", JSON.stringify(lesson, null, 2))
      // Dispatch the action inside useEffect to avoid rendering issues
      dispatch(setLessonQuestions({ data: lesson }));
    }
  }, [lessonProgress, dispatch, lessonId]);

  // Fetch subject name
  useEffect(() => {
    if (!pupilId) return;

    getSubjects(undefined, {
      onSuccess: (res) => {
        // console.log("subject data is ", JSON.stringify(res, null, 2))
        const targetSubjectId = subjectId;
        const subject = res?.find((s: any) => s.id === targetSubjectId);
        if (subject) {
          setSubjectName(subject.name || subject.title || "Subject");
        } else {
          console.log("Subject not found in response");
        }
      },
      onError: (err) => {
        console.error("Error fetching subjects:", err);
      },
    });
  }, [pupilId, getSubjects, subjectId]);

  useEffect(() => {
    if (!pupilId || !lessonId) return;

    setHasAudio(false);
    setHasVideo(false);
    setHasQuestion(false);

    getCards(undefined, {
      onSuccess: (res: any) => {
        const cardsFromAPI = res?.cards ?? [];
        const cardsByKey = new Map(cardsFromAPI.map((c: any) => [c.key, c]));

        console.log("cards by key is ", cardsByKey);
        let hasIntroCard = false;
        let hasVideoCard = false;
        let hasJourneyCard = false;

        const orderedCards = CARD_ORDER.filter((key) =>
          cardsByKey.has(key),
        ).map((key) => {
          // Try to find card by exact key match first
          let card = cardsFromAPI.find((c: any) => c.key === key);

          // If not found, try to find by partial match (for UUID keys)
          if (!card) {
            card = cardsFromAPI.find((c: any) => {
              if (key === "lesson_intro" && c.key.includes("lesson_")) {
                hasIntroCard = true;
                return true;
              }
              if (key === "lesson_video" && c.key.includes("video")) {
                hasVideoCard = true;
                return true;
              }
              if (key === "final_journey" && c.key.includes("journey")) {
                hasJourneyCard = true;
                return true;
              }
              return false;
            });
          } else {
            if (key === "lesson_intro") hasIntroCard = true;
            if (key === "lesson_video") hasVideoCard = true;
            if (key === "final_journey") hasJourneyCard = true;
          }

          const ui = CARD_UI_MAP[key];

          // Use translated title based on card key
          const getTranslatedTitle = (cardKey: string) => {
            console.log("card key is ", cardKey);
            const translationKey = `lessonFlow.${cardKey}` as const;
            return t(translationKey);
          };

          return {
            key,
            title: getTranslatedTitle(key),
            stepId: card?.stepId ?? card?.step_id ?? "",
            isUnlocked: card?.unlocked ?? false,
            completed: card?.completed ?? false,
            lockedReason: card?.lockedReason ?? null,
            ui,
            subjectName,
            levelNo,
          };
        });

        // console.log("ordered cards are ", JSON.stringify(orderedCards, null, 2));

        setHasAudio(hasIntroCard);
        setHasVideo(hasVideoCard);
        setHasQuestion(hasJourneyCard);

        setLessons(orderedCards);
      },
      onError: (err: any) => {
        console.error("Error fetching lesson cards:", err);
      },
    });
  }, [pupilId, paramLessonId, lessonId, getCards, subjectName, levelNo]);

  // useEffect(() => {
  //   console.log("hasAudio ", hasAudio)
  //   console.log("hasVideo ", hasVideo)
  //   console.log("hasQuestion ", hasQuestion)
  // }, [hasAudio, hasVideo, hasQuestion])

  return (
    <View style={themedStyles.container}>
      {/* Header with back button */}
      <Header
        isAllowedBack={true}
        showProgessBar={false}
        stepBarSide={1}
        isSettings={true}
        isDefaultBG={true}
        settingsIconColor="green"
        view={
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Text style={themedStyles.pageHeading}>{subjectName}</Text>
            <Text style={themedStyles.subtitle}>
              {t("lessonIntro.levelSubtitle")} {levelNo}
            </Text>
          </View>
        }
        onBackPressed={handleBack}
      />

      {/* Grid */}
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.key}
        style={{ marginTop: 10 }}
        numColumns={2}
        renderItem={({ item }) => (
          <LessonCardComponent
            isUnlocked={true} // TODO : REMOVE THE CONDITION WHEN DONE
            style={{ flex: 1 }}
            onPress={() => {
              // TODO : REMOVE THE CONDITION WHEN DONE
              // console.log("item is ",item)
              // if (!item.isUnlocked) {
              //   return;
              // }

              const stepIds = getStepIds();
              // Navigate based on card type and whether it's integration
              if (isIntegration) {
                // For integration lessons, always navigate to integration assessment
                safeNavigate(
                  router,
                  pathname,
                  {
                    pathname: "/(level-bg)/(pupil-bg)/integration-assessment",
                    params: {
                      stepId: item.stepId,
                      subjectName: item.subjectName,
                      level: item.level,
                      lessonId: paramLessonId || lessonId,
                      subjectId,
                      levelNo,
                      unitId,
                      levelId,
                      lessonNo,
                      isFromMap: isFromMap ? "true" : "false",
                    },
                  },
                  "replace",
                );
              } else if (item.key === "lesson_intro") {
                // Normal lesson flow - intro
                safeNavigate(
                  router,
                  pathname,
                  {
                    pathname: "/(level-bg)/(pupil-bg)/lesson-intro",
                    params: {
                      stepId: stepIds.introStepId,
                      videoStepId: stepIds.videoStepId,
                      questionStepId: stepIds.finalJourneyStepId,
                      subjectName: item.subjectName,
                      level: item.level,
                      lessonId: paramLessonId || lessonId,
                      subjectId,
                      levelNo,
                      levelId,
                      lessonNo,
                      unitId,
                      questionType:
                        item.key === "practice_questions"
                          ? "practice"
                          : "final",
                      hasVideo: String(hasVideo),
                      hasQuestion: String(hasQuestion),
                      isFromMap: isFromMap ? "true" : "false",
                    },
                  },
                  "replace",
                );
              } else if (item.key === "lesson_video") {
                // Normal lesson flow - video
                safeNavigate(
                  router,
                  pathname,
                  {
                    pathname: "/(default-bg)/(pupil-bg)/lesson-video",
                    params: {
                      stepId: stepIds.videoStepId,
                      audioStepId: stepIds.introStepId,
                      questionStepId: stepIds.finalJourneyStepId,
                      subjectName: item.subjectName,
                      level: item.level,
                      lessonId: paramLessonId || lessonId,
                      subjectId,
                      levelNo,
                      levelId,
                      lessonNo,
                      unitId,
                      questionType:
                        item.key === "practice_questions"
                          ? "practice"
                          : "final",
                      hasVideo: String(hasVideo),
                      hasQuestion: String(hasQuestion),
                      isFromMap: isFromMap ? "true" : "false",
                    },
                  },
                  "replace",
                );
              } else if (item.key === "final_journey") {
                // Normal lesson flow - questions
                safeNavigate(
                  router,
                  pathname,
                  {
                    pathname: "/(level-bg)/(pupil-bg)/questions",
                    params: {
                      stepId: item.stepId,
                      audioStepId: stepIds.introStepId,
                      videoStepId: stepIds.videoStepId,
                      subjectName: item.subjectName,
                      level: item.level,
                      lessonId: paramLessonId || lessonId,
                      subjectId,
                      levelNo,
                      unitId,
                      lessonNo,
                      levelId,
                      questionType:
                        item.key === "practice_questions"
                          ? "practice"
                          : "final",
                      hasVideo: String(hasVideo),
                      hasQuestion: String(hasQuestion),
                      isFromMap: isFromMap ? "true" : "false",
                    },
                  },
                  "replace",
                );
              } else {
                // TODO: Handle other card types
                console.log("Navigation for", item.key, "not yet implemented");
              }
            }}
            title={item.title}
            subjectName={item.subjectName}
            level={item.level}
            showLevel={item.key === "final_journey"} // Only show level on final_journey card
            cardType={
              item.key as "lesson_intro" | "lesson_video" | "final_journey"
            } // Pass card type for gradient
            IconName={item.ui.icon}
            SvgComponent={item.ui.Image}
            gradientColors={["#A991D2", "#F7C0E9"]} // Default fallback, now controlled by theme
          />
        )}
      />
    </View>
  );
}
