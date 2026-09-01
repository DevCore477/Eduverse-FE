"use client";

import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import {
  useCompleteLessonStep,
  useRenewAttempts,
} from "@/services/subjects/subjectMutation";
import { useGetLessonStepInfo } from "@/services/subjects/subjectQuery";
import type { RootState } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/screens/Lessons/LessonVideo/index.style";
import { TBackendErrorResponse } from "@/types/global";
import { safeNavigate } from "@/utils/safeNavigator";
import { Ionicons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

export default function LessonVideoScreen() {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showLoader, hideLoader, showToast } = useOverlay();

  // Get params
  const stepId =
    (Array.isArray(params.stepId) ? params.stepId[0] : params.stepId) ?? "";
  const audioStepId =
    (Array.isArray(params.audioStepId)
      ? params.audioStepId[0]
      : params.audioStepId) ?? "";
  const questionStepId =
    (Array.isArray(params.questionStepId)
      ? params.questionStepId[0]
      : params.questionStepId) ?? "";
  const subjectId =
    (Array.isArray(params.subjectId)
      ? params.subjectId[0]
      : params.subjectId) ?? "";
  const unitId =
    (Array.isArray(params.unitId) ? params.unitId[0] : params.unitId) ?? "";
  const levelId =
    (Array.isArray(params.levelId) ? params.levelId[0] : params.levelId) ?? "";
  const levelNo =
    (Array.isArray(params.levelNo) ? params.levelNo[0] : params.levelNo) ?? "";
  const subjectName =
    (Array.isArray(params.subjectName)
      ? params.subjectName[0]
      : params.subjectName) ?? "";
  const level =
    (Array.isArray(params.level) ? params.level[0] : params.level) ?? "";
  const lessonId =
    (Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId) ??
    "";
  const isForRenew =
    (Array.isArray(params.isForRenew)
      ? params.isForRenew[0]
      : (params.isForRenew ?? "")) === "true";
  const questionId =
    (Array.isArray(params.questionId)
      ? params.questionId[0]
      : params.questionId) ?? "";
  const questionType =
    (Array.isArray(params.questionType)
      ? params.questionType[0]
      : params.questionType) ?? "";
  const isFromMap =
    (Array.isArray(params.isFromMap)
      ? params.isFromMap[0]
      : params.isFromMap) === "true";
  const hasVideoString = Array.isArray(params.hasVideo)
    ? params.hasVideo[0]
    : (params.hasVideo ?? "");
  const hasVideoBoolean = hasVideoString === "true";
  const lessonNo =
    (Array.isArray(params.lessonNo) ? params.lessonNo[0] : params.lessonNo) ??
    "";

  const hasQuestionString = Array.isArray(params.hasQuestion)
    ? params.hasQuestion[0]
    : (params.hasQuestion ?? "");
  const hasQuestionBoolean = hasQuestionString === "true";

  console.log("lesson-video level id is ", levelId);
  // Get pupil ID
  const pupil = useAppSelector((s: RootState) => s.activePupil.pupil);
  const pupilId = pupil?.id ?? "";

  // Validate pupilId
  const isValidUUID = (str: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };
  const validPupilId = pupilId && isValidUUID(pupilId) ? pupilId : null;

  const handleBack = () => {
    if (questionId && isForRenew) {
      router.back();
    } else {
      safeNavigate(
        router,
        pathname,
        {
          pathname: "/(default-bg)/(pupil-bg)/(with-nav)/lesson-grid",
          params: {
            lessonId,
            subjectId,
            subjectName,
            pupilId,
            levelId,
            lessonNo,
            levelNo,
            unitId,
            isFromMap: isFromMap ? "true" : "false",
          },
        },
        "replace",
      );
    }
  };

  useBackButtonHandler({ onBackPress: handleBack });

  const { data: stepData, isPending } = useGetLessonStepInfo(stepId);
  const { mutate: renewAttempts, isPending: isRenewAttemptPending } =
    useRenewAttempts();
  const { mutate: completeStep, isPending: isCompleteStepPending } =
    useCompleteLessonStep(validPupilId || "", stepId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [isYouTube, setIsYouTube] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string>("");
  const [watchTimer, setWatchTimer] = useState<NodeJS.Timeout | null>(null);
  const [skipAvailableAfterSeconds, setSkipAvailableAfterSeconds] = useState<
    number | null
  >(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Get video URL from step data
  const getVideoUrl = (): string => {
    if (!stepData) return "";
    return stepData?.content?.media?.videoUrl ?? "";
  };

  // Get skip available time from API - return null if not available, otherwise use 5 as default
  const getSkipAfterSeconds = (): number | null => {
    if (!stepData) return null;
    const skipTime = stepData?.content?.media?.skipAvailableAfterSeconds;
    // If skipTime is null, undefined, or 0, return null (which will trigger default 5)
    if (skipTime === null || skipTime === undefined || skipTime === 0) {
      return null;
    }
    return skipTime;
  };

  const videoUrl = getVideoUrl();

  console.log("stepData is ", stepData);
  console.log("videoUrl is ", videoUrl);

  // Update skip time when stepData loads
  useEffect(() => {
    if (stepData) {
      const skipTime = getSkipAfterSeconds();
      setSkipAvailableAfterSeconds(skipTime);
    }
  }, [stepData]);

  // Calculate the effective skip time (null means use 5 seconds)
  const effectiveSkipTime =
    skipAvailableAfterSeconds === null ? 5 : skipAvailableAfterSeconds;

  // Calculate if enough time has been watched
  const hasWatchedEnoughTime =
    isPending || skipAvailableAfterSeconds === null
      ? false
      : currentTime >= effectiveSkipTime;

  // Button should be disabled if:
  // 1. Video is not ready (not loaded yet)
  // 2. We haven't watched enough time AND skip time is still loading
  const isButtonEnabled = isVideoReady && (hasWatchedEnoughTime || canProceed);

  // Show/hide loader
  useEffect(() => {
    if (isPending || isRenewAttemptPending || isCompleteStepPending) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [
    isPending,
    isRenewAttemptPending,
    isCompleteStepPending,
    showLoader,
    hideLoader,
  ]);

  // Handle YouTube player state changes
  const onYouTubeStateChange = (state: string) => {
    // console.log("YouTube state changed:", state);
    if (state === "playing" || state === "buffering" || state === "queued") {
      setIsVideoReady(true);
    }
    if (state === "playing") {
      setIsPlaying(true);
      // Start timer only if we haven't already watched enough
      if (!hasWatchedEnoughTime) {
        startWatchTimer();
      }
    } else if (state === "paused") {
      setIsPlaying(false);
      stopWatchTimer();
    } else if (state === "ended") {
      setIsPlaying(false);
      stopWatchTimer();
      setCanProceed(true);
    }
  };

  // Try to get YouTube progress - if this works, use it instead of timer
  const onYouTubeProgress = (data: {
    currentTime: number;
    duration: number;
  }) => {
    // console.log("YouTube progress:", data);
    // Update current time from YouTube player if available
    setCurrentTime(data.currentTime);

    // Check if current time is past effective skip threshold
    if (data.currentTime >= effectiveSkipTime) {
      setCanProceed(true);
      stopWatchTimer(); // Stop timer since we've reached threshold
    }
  };

  // Timer to track how many seconds the video has been playing
  const startWatchTimer = () => {
    if (watchTimer) {
      clearInterval(watchTimer);
    }

    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + 1;
        // Enable proceed when enough time has been watched
        if (newTime >= effectiveSkipTime) {
          setCanProceed(true);
          stopWatchTimer();
        }
        return newTime;
      });
    }, 1000);

    setWatchTimer(timer);
  };

  const stopWatchTimer = () => {
    if (watchTimer) {
      clearInterval(watchTimer);
      setWatchTimer(null);
    }
  };

  // Reset timer when component unmounts
  useEffect(() => {
    return () => {
      stopWatchTimer();
    };
  }, []);

  // When effective skip threshold changes, check if we should enable button
  useEffect(() => {
    if (currentTime >= effectiveSkipTime) {
      setCanProceed(true);
    }
  }, [currentTime, effectiveSkipTime]);

  const handleLessonComplete = () => {
    completeStep(undefined, {
      onSuccess: () => {
        if (hasQuestionBoolean) {
          hideLoader();
          if (questionId && isForRenew) {
            router.back();
          } else {
            safeNavigate(
              router,
              pathname,
              {
                pathname: "/(level-bg)/(pupil-bg)/questions",
                params: {
                  stepId: questionStepId,
                  audioStepId: audioStepId,
                  videoStepId: stepId,
                  subjectName: subjectName,
                  level: level,
                  lessonId: lessonId,
                  subjectId,
                  levelNo,
                  unitId,
                  levelId,
                  questionType,
                  hasVideo: hasVideoString,
                  hasQuestion: hasQuestionString,
                  isFromMap: isFromMap ? "true" : "false",
                },
              },
              "replace",
            );
          }
        }
      },
      onError: (err) => {
        const axiosErr = err as AxiosError<TBackendErrorResponse>;
        const errorMsg =
          axiosErr.response?.data?.error ??
          "Something went wrong, please try again";
        console.log("error message ", errorMsg);
        showToast("retry");
        hideLoader();
      },
    });
  };

  const handleStartJourney = () => {
    // Only proceed if button is enabled
    if (!isButtonEnabled) {
      console.log(
        "Cannot navigate yet - video not sufficiently watched or data still loading",
      );
      return;
    }
    if (questionId && isForRenew) {
      renewAttempts(
        { pupilId, lessonId, questionId },
        {
          onSuccess: () => {
            console.log("successfully renewed");
            // hideLoader()
          },
          onError: () => {
            console.log("Failed to renew");
            // hideLoader()
          },
        },
      );
    }
    handleLessonComplete();
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;

    // Match various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  // Check if URL is a YouTube URL
  const isYouTubeUrl = (url: string): boolean => {
    if (!url) return false;
    return (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("youtube.com/embed")
    );
  };

  // Check if it's a YouTube video and extract ID
  useEffect(() => {
    if (videoUrl) {
      const youtube = isYouTubeUrl(videoUrl);
      setIsYouTube(youtube);
      if (youtube) {
        const videoId = extractYouTubeId(videoUrl);
        if (videoId) {
          setYoutubeVideoId(videoId);
        }
      } else {
        console.log("Not a YouTube URL or videoUrl is 'voide'");
      }
    } else {
      console.log("No video URL found in step data");
    }
  }, [videoUrl]);

  // Calculate remaining time to watch
  const hasSkipTime = effectiveSkipTime > 0;

  return (
    <View style={themedStyles.container}>
      <Header
        isAllowedBack={true}
        showProgessBar={false}
        stepBarSide={1}
        isSettings={true}
        isDefaultBG={true}
        containerStyle={{ paddingHorizontal: 16 }}
        settingsIconColor="green"
        view={
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Text style={themedStyles.headerTitle}>
              {t("lessonVideo.headerTitle")}
            </Text>
            <Text style={themedStyles.headerSubtitle}>
              {t("lessonIntro.levelSubtitle")} {levelNo}
            </Text>
          </View>
        }
        onBackPressed={handleBack}
      />

      <ScrollView
        style={themedStyles.scrollView}
        contentContainerStyle={themedStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Player */}
        {isYouTube && youtubeVideoId && videoUrl !== "voide" && (
          <View style={themedStyles.videoContainer}>
            <View style={themedStyles.youtubeContainer}>
              <YoutubePlayer
                height={250}
                videoId={youtubeVideoId}
                play={isPlaying}
                mute={false}
                onChangeState={onYouTubeStateChange}
                onProgress={onYouTubeProgress}
                webViewStyle={{ opacity: 0.99 }}
                initialPlayerParams={{
                  controls: true,
                  modestbranding: true,
                  rel: false,
                  start: 0, // Start at 0 seconds by default
                }}
              />
            </View>
          </View>
        )}

        {/* Message */}
        <Text style={themedStyles.messageText}>
          {isPending
            ? t("lessonVideo.loadingVideoInfo")
            : !isVideoReady
              ? t("lessonVideo.pleaseWait")
              : hasSkipTime
                ? t("lessonVideo.watchVideo")
                : t("lessonVideo.endMessage")}
        </Text>

        <TouchableOpacity
          style={[
            themedStyles.nextButton,
            {
              alignSelf: "center",
              opacity: isButtonEnabled ? 1 : 0.5,
              backgroundColor: isButtonEnabled
                ? themedStyles.nextButton.backgroundColor
                : "#CCCCCC",
            },
          ]}
          onPress={handleStartJourney}
          disabled={!isButtonEnabled}
          activeOpacity={isButtonEnabled ? 0.8 : 1}
        >
          <Text
            style={[
              themedStyles.nextButtonText,
              { color: isButtonEnabled ? "#FFF" : "#666" },
            ]}
          >
            {" "}
            {t("lessonVideo.startJourney")}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isButtonEnabled ? "#FFF" : "#666"}
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
