import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useTTS } from "@/hooks/use-tts";
import {
  useCompleteLessonStep,
  useRenewAttempts,
} from "@/services/subjects/subjectMutation";
import { useGetLessonStepInfo } from "@/services/subjects/subjectQuery";
import type { RootState } from "@/store";
import { styles } from "@/styles/screens/Lessons/LessonIntro/index.style";
import { TBackendErrorResponse } from "@/types/global";
import { safeNavigate } from "@/utils/safeNavigator";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import { AxiosError } from "axios";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

interface TextPart {
  type: "text" | "space";
  content: string;
  style: {
    color: string;
    fontWeight?: "bold" | "normal";
  };
  isEmoji?: boolean;
  originalIndex?: number;
}

// Function to remove emojis and non-text characters
// Detect language from text content - check from 3rd word to avoid translation markers
const detectLanguage = (text: string): "en" | "ar" | "fr" => {
  if (!text) return "en";
  
  // Split text into words and skip first 2 words (may be translation markers like "Question:")
  const words = text.split(/\s+/);
  const textToCheck = words.slice(2).join(" ");
  
  if (!textToCheck.trim()) {
    // If not enough words, check from 1st word
    return detectLanguageFromText(text);
  }
  
  return detectLanguageFromText(textToCheck);
};

// Helper function to detect language from text
const detectLanguageFromText = (text: string): "en" | "ar" | "fr" => {
  // Arabic Unicode range
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  
  // French specific characters and common words
  const frenchIndicators = /\b(le|la|les|un|une|des|est|sont|et|ou|mais|avec|pour|dans|sur|ce|cette|ces|je|tu|il|elle|nous|vous|ils|elles|bonjour|merci|oui|non)\b/i;
  
  // Check for Arabic characters
  if (arabicRegex.test(text)) {
    return "ar";
  }
  
  // Check for French indicators
  if (frenchIndicators.test(text)) {
    return "fr";
  }
  
  // Default to English
  return "en";
};

const cleanTextForTTS = (text: string, language: string): string => {
  if (!text) return "";

  console.log("language is ", language);
  console.log("otext is ", text);
  let cleanedText = text.replace(/<\/?[^>]+(>|$)/g, ""); // This will remove HTML tags

  // Remove emojis and symbols
  // Note: We preserve all text from backend regardless of language
  // Only remove emoji characters, not language-specific characters
  cleanedText = cleanedText.replace(/[\u{1F000}-\u{1FFFF}]/gu, "");

  // Remove keycap numbers
  cleanedText = cleanedText.replace(/[\d]\uFE0F?\u20E3/g, "");

  // Replace "=" with "equals to" for better TTS
  cleanedText = cleanedText.replace(/=/g, " equals to ");

  // Remove any remaining emoji modifiers
  cleanedText = cleanedText.replace(/[\uFE0F\u20E3\u200D]/g, "");

  // Clean up multiple dots
  cleanedText = cleanedText.replace(/\.{2,}/g, "...");

  // Clean up whitespace
  cleanedText = cleanedText.replace(/\s+/g, " ").trim();

  return cleanedText;
};

// Function to check if a word contains emoji
const containsEmoji = (word: string): boolean => {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F251}\u{1F3FB}-\u{1F3FF}\u{1F900}-\u{1F9FF}]/gu;
  return emojiRegex.test(word);
};

// Updated function to process text with HTML tags (handles nested tags and preserves line breaks)
const processTextWithHtml = (
  text: string,
  defaultColor: string,
): TextPart[] => {
  if (!text) return [];

  const parts: TextPart[] = [];

  // Normalize line breaks but DON'T replace all whitespace with spaces
  // Just normalize different types of line breaks to \n
  const normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Stack to keep track of current styles
  const styleStack: Array<{ color?: string; fontWeight?: "bold" | "normal" }> =
    [];
  let currentColor = defaultColor;
  let currentFontWeight: "bold" | "normal" = "normal";

  // Parse the HTML string and line breaks
  let currentIndex = 0;
  // Match both HTML tags AND line breaks
  const tagAndLineBreakRegex = /<(\/)?(span|b)([^>]*)>|\n/g;
  let match;

  while ((match = tagAndLineBreakRegex.exec(normalizedText)) !== null) {
    // Add text before the tag or line break
    if (match.index > currentIndex) {
      const textChunk = normalizedText.substring(currentIndex, match.index);
      if (textChunk) {
        // Split into words and add them, preserving spaces
        // Use a regex that captures spaces as separate tokens
        const words = textChunk.split(/(\s+)/);
        words.forEach((word) => {
          if (word.trim()) {
            // This is a word
            parts.push({
              type: "text",
              content: word,
              style: {
                color: currentColor,
                fontWeight: currentFontWeight,
              },
              isEmoji: containsEmoji(word),
            });
          } else if (word === " ") {
            // This is a space
            parts.push({
              type: "space",
              content: " ",
              style: {
                color: currentColor,
                fontWeight: currentFontWeight,
              },
            });
          }
          // Note: We don't handle \n here because it would be captured by the regex match
        });
      }
    }

    // Handle line breaks
    if (match[0] === "\n") {
      parts.push({
        type: "space", // Using 'space' type but with content '\n' to indicate line break
        content: "\n",
        style: {
          color: currentColor,
          fontWeight: currentFontWeight,
        },
      });
      currentIndex = match.index + 1;
      continue;
    }

    // Handle HTML tags
    const isClosingTag = match[1] === "/";
    const tagName = match[2];
    const tagAttributes = match[3];

    if (isClosingTag) {
      // Pop from style stack
      if (styleStack.length > 0) {
        styleStack.pop();
        // Update current styles based on stack
        const lastStyle = styleStack[styleStack.length - 1] || {};
        currentColor = lastStyle.color || defaultColor;
        currentFontWeight = lastStyle.fontWeight || "normal";
      } else {
        currentColor = defaultColor;
        currentFontWeight = "normal";
      }
    } else {
      // Opening tag - create new style based on current stack
      const newStyle: { color?: string; fontWeight?: "bold" | "normal" } = {};

      if (tagName === "span") {
        // Extract color from span
        const colorMatch = tagAttributes.match(/color:\s*([^;>"]+)/);
        newStyle.color = colorMatch ? colorMatch[1].trim() : "red";
      } else if (tagName === "b") {
        newStyle.fontWeight = "bold";
      }

      // Apply new styles on top of current
      if (newStyle.color) currentColor = newStyle.color;
      if (newStyle.fontWeight) currentFontWeight = newStyle.fontWeight;

      // Push combined style to stack
      styleStack.push({ color: currentColor, fontWeight: currentFontWeight });
    }

    currentIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (currentIndex < normalizedText.length) {
    const textChunk = normalizedText.substring(currentIndex);
    if (textChunk) {
      const words = textChunk.split(/(\s+)/);
      words.forEach((word) => {
        if (word.trim()) {
          parts.push({
            type: "text",
            content: word,
            style: {
              color: currentColor,
              fontWeight: currentFontWeight,
            },
            isEmoji: containsEmoji(word),
          });
        } else if (word === " ") {
          parts.push({
            type: "space",
            content: " ",
            style: {
              color: currentColor,
              fontWeight: currentFontWeight,
            },
          });
        }
      });
    }
  }

  return parts;
};

export default function LessonIntroScreen() {
  const theme = useTheme();
  const { t, isRTL } = useTranslation();
  const themedStyles = styles(theme, isRTL);
  const params = useLocalSearchParams();
  const { showLoader, hideLoader, showToast } = useOverlay();
  const {
    speak,
    pause,
    resume,
    player,
    status,
    isPending: isTTSLoading,
    isAudioLoading,
  } = useTTS();

  const language = useSelector((s: RootState) => s.settings.language) as
    | "en"
    | "ar"
    | "fr";

  // Get params
  const stepId =
    (Array.isArray(params.stepId) ? params.stepId[0] : params.stepId) ?? "";
  const videoStepId =
    (Array.isArray(params.videoStepId)
      ? params.videoStepId[0]
      : params.videoStepId) ?? "";
  const questionStepId =
    (Array.isArray(params.questionStepId)
      ? params.questionStepId[0]
      : params.questionStepId) ?? "";
  const subjectName =
    (Array.isArray(params.subjectName)
      ? params.subjectName[0]
      : params.subjectName) ?? "";
  const level =
    (Array.isArray(params.level) ? params.level[0] : params.level) ?? "";
  const lessonId =
    (Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId) ??
    "";
  const levelId =
    (Array.isArray(params.levelId) ? params.levelId[0] : params.levelId) ?? "";
  const unitId =
    (Array.isArray(params.unitId) ? params.unitId[0] : params.unitId) ?? "";
  const subjectId =
    (Array.isArray(params.subjectId)
      ? params.subjectId[0]
      : params.subjectId) ?? "";
  const questionType =
    (Array.isArray(params.questionType)
      ? params.questionType[0]
      : params.questionType) ?? "";
  const levelNo =
    (Array.isArray(params.levelNo) ? params.levelNo[0] : params.levelNo) ?? "";
  const questionId =
    (Array.isArray(params.questionId)
      ? params.questionId[0]
      : params.questionId) ?? "";
  const isForRenew =
    (Array.isArray(params.isForRenew)
      ? params.isForRenew[0]
      : params.isForRenew) === "true";
  const isFromMap =
    (Array.isArray(params.isFromMap)
      ? params.isFromMap[0]
      : params.isFromMap) === "true";
  const lessonNo =
    (Array.isArray(params.lessonNo) ? params.lessonNo[0] : params.lessonNo) ??
    "";

  console.log("lesson intro level id ", levelId);

  const hasVideoString = Array.isArray(params.hasVideo)
    ? params.hasVideo[0]
    : (params.hasVideo ?? "");
  const hasVideoBoolean = hasVideoString === "true";

  const hasQuestionString = Array.isArray(params.hasQuestion)
    ? params.hasQuestion[0]
    : (params.hasQuestion ?? "");
  const hasQuestionBoolean = hasQuestionString === "true";

  // Get pupil ID
  const pupil = useSelector((s: RootState) => s.activePupil.pupil);
  const pupilId = pupil?.id ?? "";
  // Use query directly
  const { data: stepData, isPending } = useGetLessonStepInfo(stepId);
  
  console.log("📖 LessonIntro Step Data:", JSON.stringify(stepData, null, 2));
  console.log("🌐 Language from stepData:", stepData?.content?.media?.extras?.language);
  const { mutate: renewAttempts, isPending: isRenewAttemptPending } =
    useRenewAttempts();
  const { mutate: completeStep, isPending: isCompleteStepPending } =
    useCompleteLessonStep(pupilId || "", stepId);

  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const [isAudioPreloaded, setIsAudioPreloaded] = useState(false);
  const [canMoveToVideo, setCanMoveToVideo] = useState(false);
  const [hasAudioFinished, setHasAudioFinished] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const waveformHeights = useRef<number[]>([]);
  const introTextRef = useRef("");
  const waveformRef = useRef<View>(null);
  const [waveformWidth, setWaveformWidth] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const lastSeekTime = useRef<number>(0);

  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [seekTimeOnDrag, setSeekTimeOnDrag] = useState(0);

  // Refs for smooth drag: batch updates to one per frame
  const dragPositionRef = useRef(0);
  const seekTimeOnDragRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const wasPlayingBeforeDragRef = useRef(false);

  const handleBack = async () => {
    // Stop audio before navigating back
    try {
      await stop();
      setHasAudioFinished(false);
      setHighlightedWordIndex(-1);
    } catch (e) {
      console.log("Error stopping audio on back:", e);
    }
    
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
  };

  useBackButtonHandler({ onBackPress: handleBack });

  const currentTime = status?.currentTime ?? 0;
  const duration = status?.duration ?? 0;
  const isPlaying = status?.playing ?? false;

  // Access data directly from query
  const introductionText = stepData?.content?.media?.extras?.text ?? "";
  
  // Get pre-generated audio URL if available
  const preGeneratedAudioUrl = stepData?.content?.media?.ttsAudioUrl ?? null;
  const hasPreGeneratedAudio = !!preGeneratedAudioUrl;
  
  console.log("preGeneratedAudioUrl:", preGeneratedAudioUrl);
  console.log("hasPreGeneratedAudio:", hasPreGeneratedAudio);

  // Clean text for display (keep emojis for display)
  const displayText = introductionText;

  // Use language from API if available, otherwise detect from text
  const apiLanguage = stepData?.content?.media?.extras?.language as string | undefined;
  const validApiLanguage = apiLanguage && ["en", "ar", "fr"].includes(apiLanguage) ? apiLanguage as "en" | "ar" | "fr" : null;
  
  // Detect language - check from 3rd word to avoid translation markers
  const words = introductionText.split(/\s+/);
  const textToCheck = words.slice(2).join(" ");
  const detectedLanguage = validApiLanguage || detectLanguage(introductionText);
  
  console.log("📝 Text to check for language:", textToCheck);
  console.log("🌐 API Language:", apiLanguage);
  console.log("🌐 Detected Language:", detectedLanguage);
  
  // Clean text for TTS (remove emojis)
  const ttsText = cleanTextForTTS(introductionText, detectedLanguage);

  // console.log("displayText is ", displayText)
  // Process text with HTML tags - use theme.colors.text instead of theme.white
  const processedTextParts = processTextWithHtml(displayText, theme.white);

  // console.log("processedTextParts is ", processedTextParts)

  // Get only non-emoji words for TTS synchronization (from processed parts)
  const nonEmojiWords = processedTextParts
    .filter((part) => part.type === "text" && !part.isEmoji)
    .map((part) => part.content);

  const handlePlayPause = async () => {
    // If audio is not loaded yet, trigger loading first
    if (!status?.isLoaded) {
      // If we have pre-generated audio or text, trigger loading
      if (hasPreGeneratedAudio && preGeneratedAudioUrl) {
        try {
          await speak({ text: preGeneratedAudioUrl, language: detectedLanguage, isUrl: true }, { shouldPlay: false });
        } catch (e) {
          console.log("Error preloading audio on play:", e);
        }
      } else if (ttsText) {
        try {
          await speak({ text: ttsText, language: detectedLanguage }, { shouldPlay: false });
        } catch (e) {
          console.log("Error generating TTS on play:", e);
        }
      }
      return;
    }

    if (hasAudioFinished) {
      // If audio has finished, start from beginning
      player.seekTo(0);
      setHasAudioFinished(false);
      setHighlightedWordIndex(-1);
      resume();
    } else {
      // Normal play/pause
      status.playing ? pause() : resume();
    }
  };

  const handleDragStart = (event: any) => {
    if (!duration || !player?.seekTo || duration <= 0 || waveformWidth <= 0) {
      return;
    }

    const { locationX } = event.nativeEvent;
    const progress = Math.max(0, Math.min(1, locationX / waveformWidth));
    const seekTime = progress * duration;

    wasPlayingBeforeDragRef.current = isPlaying;
    if (isPlaying) {
      pause();
    }

    setIsDragging(true);
    dragPositionRef.current = locationX;
    seekTimeOnDragRef.current = seekTime;
    setDragPosition(locationX);
    setSeekTimeOnDrag(seekTime);
    updateHighlightedWord(seekTime);
  };

  const handleDragMove = (event: any) => {
    if (!isDragging || !duration || waveformWidth <= 0) {
      return;
    }

    const { locationX } = event.nativeEvent;
    const clampedX = Math.max(0, Math.min(locationX, waveformWidth));
    const progress = clampedX / waveformWidth;
    const seekTime = progress * duration;

    dragPositionRef.current = clampedX;
    seekTimeOnDragRef.current = seekTime;

    if (rafIdRef.current == null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        setDragPosition(dragPositionRef.current);
        setSeekTimeOnDrag(seekTimeOnDragRef.current);
        updateHighlightedWord(seekTimeOnDragRef.current);
      });
    }
  };

  const handleDragEnd = () => {
    if (!isDragging || !player?.seekTo) {
      return;
    }

    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    const seekTime = seekTimeOnDragRef.current;
    const wasPlaying = wasPlayingBeforeDragRef.current;

    setIsDragging(false);
    setIsSeeking(true);
    lastSeekTime.current = seekTime;

    player.seekTo(seekTime);

    if (hasAudioFinished) {
      setHasAudioFinished(false);
    }

    // Wait for seek to complete then resume playback so user doesn't have to tap again
    const resumeDelay = 200;
    setTimeout(() => {
      setIsSeeking(false);
      if (status?.isLoaded && player) {
        resume();
      }
    }, resumeDelay);
  };

  // Get the actual width of the waveform container
  const handleWaveformLayout = (e: any) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0 && width !== waveformWidth) {
      setWaveformWidth(width);
    }
  };

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  // Calculate word timing boundaries based on word length (longer words = more time)
  const wordTimingBoundaries = useMemo(() => {
    if (!duration || nonEmojiWords.length === 0) return [];

    // Calculate total characters (excluding spaces)
    const totalChars = nonEmojiWords.reduce(
      (sum, word) => sum + word.length,
      0,
    );

    // Create cumulative time boundaries
    const boundaries: number[] = [];
    let cumulativeTime = 0;

    nonEmojiWords.forEach((word) => {
      // Each character gets proportional time
      const wordDuration = (word.length / totalChars) * duration;
      cumulativeTime += wordDuration;
      boundaries.push(cumulativeTime);
    });

    return boundaries;
  }, [duration, nonEmojiWords]);

  // Function to update highlighted word based on current time
  const updateHighlightedWord = (time: number) => {
    if (
      !duration ||
      !ttsText ||
      nonEmojiWords.length === 0 ||
      wordTimingBoundaries.length === 0
    ) {
      setHighlightedWordIndex(-1);
      return;
    }

    // Start highlighting 1 second before audio time to sync better
    const adjustedTime = time + 1;
    
    // Find the word index based on cumulative time boundaries
    let wordIndex = -1;
    for (let i = 0; i < wordTimingBoundaries.length; i++) {
      if (adjustedTime >= wordTimingBoundaries[i]) {
        wordIndex = i;
      } else {
        break;
      }
    }

    // Ensure index is within bounds
    const safeIndex = Math.max(
      -1,
      Math.min(wordIndex, nonEmojiWords.length - 1),
    );

    // Find the corresponding index in the processed text parts
    let displayIndex = -1;
    let nonEmojiCount = 0;

    for (let i = 0; i < processedTextParts.length; i++) {
      if (
        processedTextParts[i].type === "text" &&
        !processedTextParts[i].isEmoji
      ) {
        if (nonEmojiCount === safeIndex) {
          displayIndex = i;
          break;
        }
        nonEmojiCount++;
      }
    }

    setHighlightedWordIndex(displayIndex);
  };

  const handleLessonComplete = () => {
    completeStep(undefined, {
      onSuccess: () => {
        if (hasVideoBoolean) {
          safeNavigate(
            router,
            pathname,
            {
              pathname: "/(default-bg)/(pupil-bg)/lesson-video",
              params: {
                stepId: videoStepId,
                audioStepId: stepId,
                questionStepId: questionStepId,
                subjectName: subjectName,
                level: level,
                lessonId: lessonId,
                subjectId,
                levelNo,
                levelId,
                unitId,
                questionType,
                hasVideo: hasVideoString,
                hasQuestion: hasQuestionString,
                isFromMap: isFromMap ? "true" : "false",
              },
            },
            "replace",
          );
        } else if (hasQuestionBoolean) {
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
                  audioStepId: stepId,
                  videoStepId: videoStepId,
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
      },
    });
  };

  const handleMoveToVideo = async () => {
    // Stop all audio before navigating
    try {
      // Use the TTS hook's pause function to stop audio
      if (status?.isLoaded && status.playing) {
        pause(); // This will stop the TTS audio
      }

      // Also ensure the player is stopped
      if (player && typeof player.pause === "function") {
        try {
          player.pause();
        } catch (error) {
          console.log("Error pausing player:", error);
        }
      }

      // Reset audio states
      setHasAudioFinished(false);
      setHighlightedWordIndex(-1);
    } catch (error) {
      console.error("Error stopping audio before navigation:", error);
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

  useEffect(() => {
    if (!waveformHeights.current.length) {
      waveformHeights.current = Array.from(
        { length: 50 },
        () => Math.random() * 30 + 10,
      );
    }
  }, []);

  useEffect(() => {
    if (isPending || isCompleteStepPending || isRenewAttemptPending || isTTSLoading || isAudioLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [
    isPending,
    isCompleteStepPending,
    isRenewAttemptPending,
    isTTSLoading,
    isAudioLoading,
    showLoader,
    hideLoader,
  ]);

  const [audioCompleted, setAudioCompleted] = useState(false);

  // Auto-navigate when audio finishes
  useEffect(() => {
    if (audioCompleted && !isPending && stepData) {
      handleMoveToVideo();
      setAudioCompleted(false); // Reset to prevent multiple navigations
    }
  }, [audioCompleted, isPending, stepData]);

  useEffect(() => {
    if (status?.didJustFinish) {
      // Audio has finished playing
      setHighlightedWordIndex(-1);
      setHasAudioFinished(true);
      setCanMoveToVideo(true);
      
      // Mark audio as completed for auto-navigation
      setAudioCompleted(true);
    }
  }, [status?.didJustFinish]);

  useEffect(() => {
    introTextRef.current = introductionText;
  }, [introductionText]);

  // Load pre-generated audio or TTS based on availability
  useEffect(() => {
    if (hasPreGeneratedAudio && preGeneratedAudioUrl && !isAudioPreloaded) {
      // Use pre-generated audio
      console.log("Loading pre-generated audio:", preGeneratedAudioUrl);
      speak({ text: preGeneratedAudioUrl, isUrl: true }, { shouldPlay: false })
        .then(() => {
          setIsAudioPreloaded(true);
          setHasAudioFinished(false);
          setHighlightedWordIndex(-1);
        })
        .catch(console.error);
    } else if (!hasPreGeneratedAudio && ttsText && !isAudioPreloaded) {
      // Fall back to TTS if no pre-generated audio
      console.log("ttsText is ", ttsText);
      console.log("detected language is ", detectedLanguage);

      speak({ text: ttsText, language: detectedLanguage }, { shouldPlay: false })
        .then(() => {
          setIsAudioPreloaded(true);
          // Reset finished state when new audio is loaded
          setHasAudioFinished(false);
          setHighlightedWordIndex(-1);
        })
        .catch(console.error);
    }
  }, [ttsText, hasPreGeneratedAudio, preGeneratedAudioUrl, detectedLanguage]);

  // Improved text highlighting synchronization
  useEffect(() => {
    if (!duration || !ttsText || !isPlaying || isSeeking) return;

    // Only update highlighting when audio is playing
    const updateHighlight = () => {
      if (isPlaying && status?.isLoaded) {
        updateHighlightedWord(currentTime);
      }
    };

    // Update highlighting
    updateHighlight();
  }, [
    currentTime,
    isPlaying,
    duration,
    ttsText,
    status?.isLoaded,
    isSeeking,
    wordTimingBoundaries,
  ]);

  useEffect(() => {
    if (currentTime >= 5) setCanMoveToVideo(true);
  }, [currentTime]);

  // Update play button icon based on audio state
  const getPlayButtonIcon = () => {
    if (isTTSLoading || isAudioLoading) {
      return "hourglass"; // Show loading state
    }
    if (hasAudioFinished) {
      return "play"; // Show play icon when audio has finished
    }
    return isPlaying ? "pause" : "play";
  };

  // Render play button content
  const renderPlayButtonContent = () => {
    if (isTTSLoading || isAudioLoading) {
      return <ActivityIndicator size="large" color="#FFF" />;
    }
    return <Ionicons name={getPlayButtonIcon()} size={40} color="#FFF" />;
  };

  // RTL languages array
  const rtlLanguages = [
    "Arabic",
    "Islamic Education",
    "Mathematics",
    "History",
    "Music",
    "Civic",
    "Science_Technology",
    "Science",
    "Geography",
    "Islamic",
  ];

  return (
    <View style={themedStyles.container}>
      <Header
        isAllowedBack
        showProgessBar={false}
        stepBarSide={1}
        isSettings
        isDefaultBG={false}
        backIconColor="#FFF"
        view={
          <View style={{ alignItems: "center" }}>
            <Text style={themedStyles.headerTitle}>
              {t("lessonIntro.headerTitle")}
            </Text>
            <Text style={themedStyles.headerSubtitle}>
              {t("lessonIntro.levelSubtitle")} {params.levelNo ?? ""}
            </Text>
          </View>
        }
        onBackPressed={handleBack}
      />

      <View style={themedStyles.scrollView}>
        {/* Audio */}
        <View style={themedStyles.audioSection}>
          <TouchableOpacity
            style={themedStyles.playButton}
            onPress={handlePlayPause}
            disabled={isTTSLoading || isAudioLoading}
          >
            {renderPlayButtonContent()}
          </TouchableOpacity>

          <View style={themedStyles.waveformContainer}>
            <View
              style={themedStyles.waveform}
              onLayout={handleWaveformLayout}
              ref={waveformRef}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              {waveformHeights.current.map((h: number, i: number) => {
                const progress = (i + 0.5) / waveformHeights.current.length;
                const isHighlighted =
                  progress <=
                  (isDragging
                    ? seekTimeOnDrag / duration
                    : currentTime / duration);

                return (
                  <View
                    key={i}
                    style={[
                      themedStyles.waveformBar,
                      {
                        height: h,
                        backgroundColor: isHighlighted ? "#FFD93D" : "#FFF",
                      },
                    ]}
                  />
                );
              })}

              {isDragging && (
                <>
                  <View
                    style={[
                      themedStyles.dragPointer,
                      { left: dragPosition - 2 },
                    ]}
                  />
                  <View style={themedStyles.dragTimeContainer}>
                    <Text style={themedStyles.dragTimeText}>
                      {formatTime(seekTimeOnDrag)}
                    </Text>
                  </View>
                </>
              )}
            </View>

            <View style={themedStyles.timeContainer}>
              <Text style={themedStyles.timeText}>
                {formatTime(currentTime)}
              </Text>
              <Text style={themedStyles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>
        </View>

        {/* Text - Modified to use processedTextParts with bold support and line breaks */}
        <View style={themedStyles.introBox}>
          <ScrollView>
            <Text
              style={[
                themedStyles.introText,
                {
                  textAlign: rtlLanguages.includes(subjectName)
                    ? "right"
                    : "left",
                },
              ]}
            >
              {processedTextParts.map((part, index) => {
                if (part.type === "space") {
                  if (part.content === "\n") {
                    // For line breaks, we need to create a new line
                    // Using {"\n"} in a Text component will create a line break
                    return <Text key={`break-${index}`}>{"\n"}</Text>;
                  }
                  return <Text key={`space-${index}`}> </Text>;
                }

                const shouldHighlight =
                  index === highlightedWordIndex && !part.isEmoji;

                return (
                  <Text
                    key={`text-${index}`}
                    style={[
                      {
                        color: part.style.color,
                        fontWeight: part.style.fontWeight || "normal",
                      },
                      shouldHighlight ? themedStyles.highlightedWord : {},
                      part.isEmoji ? themedStyles.emojiText : {},
                    ]}
                  >
                    {part.content}
                  </Text>
                );
              })}
            </Text>
          </ScrollView>
        </View>

        {/* Next */}
        {/* <TouchableOpacity
          style={[
            themedStyles.nextButton,
            {
              alignSelf: "center",
              opacity: canMoveToVideo ? 1 : 0.5,
              backgroundColor: canMoveToVideo
                ? themedStyles.nextButton.backgroundColor
                : "#CCCCCC",
            },
          ]}
          onPress={handleMoveToVideo}
          disabled={!canMoveToVideo}
          accessibilityState={{ disabled: !canMoveToVideo }}
          activeOpacity={0.8}
        >
          <Text
            style={[
              themedStyles.nextButtonText,
              { color: canMoveToVideo ? "#FFF" : "#666" },
            ]}
          >
            {hasVideoBoolean
              ? "Move to lesson video"
              : "Let's start your journey"}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={canMoveToVideo ? "#FFF" : "#666"}
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
