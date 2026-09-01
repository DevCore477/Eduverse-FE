import { LeftArrow, PauseIcon, PlayIcon2, PointStar } from "@/assets/images";
import DifficultyProgressTabs from "@/components/DifficultyProgressTabs";
import Header from "@/components/Header";
import CorrectAnswerModal from "@/components/Questions/CorrectAnswerModal";
import ImageChoiceQuestion from "@/components/Questions/ImageChoiceQuestion";
import LevelCompleteModal from "@/components/Questions/LevelCompleteModal";
import MatchingQuestion from "@/components/Questions/MatchingQuestion";
import MultipleChoiceQuestion from "@/components/Questions/MultipleChoiceQuestion";
import OrderingAssessmentQuestion from "@/components/Questions/OrderingAssessmentQuestion";
import OrderingQuestion from "@/components/Questions/OrderingQuestion";
import TrueFalseQuestion from "@/components/Questions/TrueFalseQuestion";
import WritingAsessmentQuestion from "@/components/Questions/WritingAsessmentQuestion";
import WritingAssessmentModal from "@/components/Questions/WritingAssesmentModal";
import WrongAnswerModal from "@/components/Questions/WrongAnswerModal";
import RotatingDotsLoader from "@/components/RotatingDotsLoader";
import { useAutoSpeak } from "@/hooks/use-auto-speak";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import {
  useCompleteLessonStep,
  useSubmitAnswer,
  useSubmitIntegrationAnswer,
} from "@/services/subjects/subjectMutation";
import { useGetLessonQuestionByDifficulty } from "@/services/subjects/subjectQuery";
import { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addOrUpdateQuestionInLesson,
  removeQuestionFromLesson,
} from "@/store/lessonQuestionSlice";
import { styles } from "@/styles/screens/Questions/index.style";
import { FieldTypes, TBackendErrorResponse } from "@/types/global";
import {
  FillBlankChallengeJson,
  ImageChoiceChallengeJson,
  MatchingChallengeJson,
  MultipleChoiceChallengeJson,
  OrderingChallengeJson,
  TFinalChallenge,
  TIntegrationFinalChallenge,
  TIntegrationOrderingNormalizedQuestion,
  TIntegrationOrderingNormalizedQuestionType2,
  TIntegrationWritingNormalizedQuestion,
  TNormalizedQuestion,
  TPostSubmitAnswer,
  TPostSubmitIntegrationAnswer,
  TPracticeQuestion,
  TPracticeQuestions,
  TQuestionResult,
  TrueFalseChallengeJson,
} from "@/types/questions";
import { mapBackendError } from "@/utils/errorMapping";
import { safeNavigate } from "@/utils/safeNavigator";
import {
  getLanguageFromSubject,
  isRTLFromLanguage,
  TRUE_FALSE_LABELS,
} from "@/utils/subjectHelpers";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFocusEffect,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type QuestionFlowState = {
  type: "practice" | "easy" | "medium" | "hard";
  index: number;
  questions: (
    | TPracticeQuestion
    | TFinalChallenge
    | TIntegrationFinalChallenge
  )[];
};

export default function QuestionsScreen() {
  const theme = useTheme();
  const { t, isRTL } = useTranslation();
  const themedStyles = styles(theme);
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const aiGenratorEnabled = useAppSelector(
    (state: RootState) => state.settings.aiGenerator,
  );

  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationData, setNavigationData] = useState<any>(null);
  const lastVoiceClickRef = useRef<number>(0);
  const isVoiceInitiatedRef = useRef(false);
  const activePupil = useAppSelector((state) => state.activePupil.pupil);
  const lessonQuestions = useAppSelector(
    (state) => state.lessonQuestions.lessons,
  );
  const pupilId = activePupil?.id ?? "";
  // Get params from navigation
  const stepId =
    (Array.isArray(params.stepId) ? params.stepId[0] : params.stepId) ?? "";
  const videoStepId =
    (Array.isArray(params.videoStepId)
      ? params.videoStepId[0]
      : params.videoStepId) ?? "";
  const audioStepId =
    (Array.isArray(params.audioStepId)
      ? params.audioStepId[0]
      : params.audioStepId) ?? "";

  const levelId =
    (Array.isArray(params.levelId) ? params.levelId[0] : params.levelId) ?? "";
  const unitId =
    (Array.isArray(params.unitId) ? params.unitId[0] : params.unitId) ?? "";
  const subjectId =
    (Array.isArray(params.subjectId)
      ? params.subjectId[0]
      : params.subjectId) ?? "";
  const lessonId =
    (Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId) ??
    "";
  const questionType =
    (Array.isArray(params.questionType)
      ? params.questionType[0]
      : params.questionType) ?? "";
  const paramSubjectName =
    (Array.isArray(params.subjectName)
      ? params.subjectName[0]
      : params.subjectName) ?? "";
  const levelNo =
    (Array.isArray(params.levelNo) ? params.levelNo[0] : params.levelNo) ?? "";
  const lessonNo =
    (Array.isArray(params.lessonNo) ? params.lessonNo[0] : params.lessonNo) ??
    "";
  const paramLevel =
    (Array.isArray(params.level) ? params.level[0] : params.level) ?? "";
  const hasVideoString = Array.isArray(params.hasVideo)
    ? params.hasVideo[0]
    : (params.hasVideo ?? "");
  const hasVideoBoolean = hasVideoString === "true";
  const isFromMap =
    (Array.isArray(params.isFromMap)
      ? params.isFromMap[0]
      : params.isFromMap) === "true";

  const hasQuestionString = Array.isArray(params.hasQuestion)
    ? params.hasQuestion[0]
    : (params.hasQuestion ?? "");
  const hasQuestionBoolean = hasQuestionString === "true";

  console.log("final journey level id is ", levelId);

  const queryClient = useQueryClient();

  const subjectName = paramSubjectName;
  const levelName = paramLevel;

  const defaultLanguage =
    subjectName === "Arabic" ? "ar" : subjectName === "French" ? "fr" : "en";

  const {
    speak: speakText,
    isSpeaking,
    stop: stopSpeaking,
    pause: pauseSpeaking,
    resume: resumeSpeaking,
    isPaused,
    isPending: isSpeakPending,
  } = useAutoSpeak({
    enabled: true,
    defaultLanguage: defaultLanguage, // Set the language dynamically here
  });

  // API call to get questions by difficulty
  const { data: lessonQuestionByDiff, isPending } =
    useGetLessonQuestionByDifficulty({ lessonId });
  
  // Get language from API response
  const apiLanguage = lessonQuestionByDiff?.language;
  
  // Also detect from question text (skip first 2 words)
  const practiceQuestions = lessonQuestionByDiff?.practiceQuestions;
  const firstQuestion = practiceQuestions?.easy?.[0] || practiceQuestions?.medium?.[0] || practiceQuestions?.hard?.[0];
  const questionText = firstQuestion?.questionJson?.question || "";
  const words = questionText.split(/\s+/);
  const textToCheck = words.slice(2).join(" ");
  
  const { mutate: submitAnswer, isPending: isSubmitPending } =
    useSubmitAnswer();
  const {
    mutate: submitIntegrationAnswer,
    isPending: isSubmitIntegrationPending,
  } = useSubmitIntegrationAnswer();
  const { mutate: lessonComplete, isPending: isLessonCompletePending } =
    useCompleteLessonStep(pupilId, stepId);

  // State for question flow
  const [flowState, setFlowState] = useState<QuestionFlowState>({
    type: "practice",
    index: 0,
    questions: [],
  });

  const [recentAnswerResult, setRecentAnswerResult] = useState<{
    questionId: string;
    isCorrect: boolean;
    answer: any;
  } | null>(null);

  const { showToast, showLoader, hideLoader } = useOverlay();
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  
  // Debug: track when selectedAnswer becomes null
  useEffect(() => {
    console.log(">>> selectedAnswer current value:", selectedAnswer);
  }, [selectedAnswer]);
  
  const [staEarned, setStarEarned] = useState(0);

  // State for modals
  const [showCorrectModal, setShowCorrectModal] = useState(false);
  const [showWritingModal, setShowWritingModal] = useState(false);
  const [showWrongModal, setShowWrongModal] = useState(false);
  const [showNoCorrectAnswerWarning, setShowNoCorrectAnswerWarning] =
    useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const [currentHint, setCurrentHint] = useState("");
  const [isAttemptsFinished, setIsAttemptsFinished] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("easy");
  const [completedDifficulties, setCompletedDifficulties] = useState<
    ("practice" | "easy" | "medium" | "hard")[]
  >([]);
  const [questionHistory, setQuestionHistory] = useState<QuestionFlowState[]>(
    [],
  );
  const [hasCorrectAnswer, setHasCorrectAnswer] = useState({
    easy: false,
    medium: false,
    hard: false,
  });

  // Get questions from API response
  const practiceQuestion = lessonQuestionByDiff?.practiceQuestions;
  const easyFinalQuestions = lessonQuestionByDiff?.finalChallenges.easy ?? [];
  const mediumFinalQuestions =
    lessonQuestionByDiff?.finalChallenges.medium ?? [];
  const hardFinalQuestions = lessonQuestionByDiff?.finalChallenges.hard ?? [];

  // Get current question based on flow state
  const currentQuestion =
    flowState.questions.length > 0
      ? flowState.questions[flowState.index]
      : null;
  const progress =
    flowState.questions.length > 0
      ? ((flowState.index + 1) / flowState.questions.length) * 100
      : 0;
  const stepsAway = flowState.questions.length - flowState.index - 1;

  // Add this inside your QuestionsScreen component
  useFocusEffect(
    useCallback(() => {
      // This runs when the screen comes into focus
      // Reset the attempts finished state when returning from video
      setIsAttemptsFinished(false);
      setShowWrongModal(false);
      // Don't reset selectedAnswer here as it causes issues with user selections

      return () => {
        // This runs when screen loses focus (optional cleanup)
      };
    }, []),
  );

  useEffect(() => {
    if (
      isLessonCompletePending ||
      isSubmitIntegrationPending ||
      isSubmitPending
    ) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [
    isLessonCompletePending,
    isSubmitIntegrationPending,
    isSubmitPending,
    showLoader,
    hideLoader,
  ]);

  useEffect(() => {
    if (!aiGenratorEnabled) {
      stopSpeaking();
    }
  }, [aiGenratorEnabled]);

  // Track when all questions in current difficulty are answered
  useEffect(() => {
    if (!currentQuestion || flowState.questions.length === 0) return;

    const currentLesson = lessonQuestions.find(
      (lesson) => lesson.lessonId === lessonId,
    );
    if (!currentLesson) return;

    // Count how many questions in current difficulty have been answered
    const answeredQuestionsInDifficulty = currentLesson.questions.filter(
      (q) => {
        // Find if this question exists in current difficulty questions
        const questionId = "id" in currentQuestion ? currentQuestion.id : "";
        return flowState.questions.some((fq) => {
          const fqId = "id" in fq ? fq.id : "";
          return fqId === q.questionId;
        });
      },
    ).length;

    const totalQuestionsInDifficulty = flowState.questions.length;

    // If all questions are answered in this difficulty, mark it as completed
    if (
      answeredQuestionsInDifficulty >= totalQuestionsInDifficulty &&
      !completedDifficulties.includes(flowState.type) &&
      flowState.type !== "practice"
    ) {
      setCompletedDifficulties((prev) => [...prev, flowState.type]);
    }
  }, [lessonQuestions, flowState, lessonId, currentQuestion]);

  useEffect(() => {
    if (lessonQuestionByDiff && !isPending) {
      // Start with practice question if available
      if (practiceQuestion) {
        const firstPracticeQuestion =
          getFirstAvailablePracticeQuestion(practiceQuestion);
        if (firstPracticeQuestion) {
          moveToPractice(firstPracticeQuestion);
        }
      } else if (easyFinalQuestions.length > 0) {
        moveToEasy();
      } else if (mediumFinalQuestions.length > 0) {
        moveToMedium();
      } else if (hardFinalQuestions.length > 0) {
        moveToHard();
      }
    }
  }, [lessonQuestionByDiff, isPending]);

  const getFirstAvailablePracticeQuestion = (
    practiceQuestion: TPracticeQuestions | undefined,
  ) => {
    if (!practiceQuestion) {
      return null;
    } else if (practiceQuestion.easy.length > 0) {
      return practiceQuestion.easy[0];
    } else if (practiceQuestion.medium.length > 0) {
      return practiceQuestion.medium[0];
    } else if (practiceQuestion.hard.length > 0) {
      return practiceQuestion.hard[0];
    } else {
      return null;
    }
  };

  const getQuestionData = (
    question: TPracticeQuestion | TFinalChallenge | TIntegrationFinalChallenge,
  ):
    | TNormalizedQuestion
    | TIntegrationWritingNormalizedQuestion
    | TIntegrationOrderingNormalizedQuestion
    | TIntegrationOrderingNormalizedQuestionType2
    | null => {
    if ("questionJson" in question) {
      const qj = question.questionJson;
      return {
        id: qj.id,
        type: qj.type,
        hints: qj.hints,
        answer: qj.answer,
        points: qj.points,
        question: qj.question,
        difficulty: qj.difficulty,
        options: qj.options,
        content: qj.content,
        matchItems: qj.matchItems,
        isIntegration: false,
      };
    } else if ("challengeJson" in question) {
      const cj = question.challengeJson;
      if (cj.type === "writing_assessment") {
        return {
          id: cj.id,
          type: cj.type,
          hints: cj.hints,
          points: cj.points,
          difficulty: cj.difficulty,
          writingTask: cj.writingTask,
          selfCorrectionGrid: cj.selfCorrectionGrid,
          payload: cj.payload,
          isIntegration: true,
        };
      } else if (cj.type === "ordering_assessment") {
        if ("orderingTask" in cj) {
          return {
            id: cj.id,
            type: cj.type,
            hints: cj.hints,
            points: cj.points,
            difficulty: cj.difficulty,
            orderingTask: cj.orderingTask,
            payload: cj.payload,
            isIntegration: true,
          };
        } else {
          return {
            id: cj.id,
            type: cj.type,
            question: cj.question,
            hints: cj.hints,
            answer: cj.answer,
            difficulty: cj.difficulty,
            points: cj.points,
            content: cj.content,
            payload: cj.payload,
            isIntegration: true,
          };
        }
      } else {
        return {
          id: cj.id,
          type: cj.type,
          hints: cj.hints,
          answer: cj.answer,
          points: cj.points,
          question: cj.question,
          difficulty: cj.difficulty,
          options: cj.options,
          content: cj.content,
          matchItems: cj.matchItems,
          isIntegration: false,
        };
      }
    }
    return null;
  };

  // Get current question data
  const currentQuestionData = currentQuestion
    ? getQuestionData(currentQuestion)
    : null;

  // Function to check if current question has already been answered
  const getQuestionStatus = useCallback(() => {
    if (!currentQuestion) return null;

    // Get the lesson from Redux store
    const currentLesson = lessonQuestions.find(
      (lesson) => lesson.lessonId === lessonId,
    );

    if (!currentLesson) return null;

    // Get question ID from currentQuestion
    const questionId =
      "id" in currentQuestion
        ? currentQuestion.id
        : currentQuestionData?.id.toString() || "";

    return currentLesson.questions.find((q) => q.questionId === questionId);
  }, [currentQuestion, lessonId, lessonQuestions, currentQuestionData]);

  const moveToPractice = (firstPracticeQuestion: TPracticeQuestion) => {
    const initialState = {
      type: "practice" as const,
      index: 0,
      questions: [firstPracticeQuestion],
    };
    setFlowState(initialState);
    setQuestionHistory([initialState]);
  };

  const moveToEasy = () => {
    const nextState = {
      type: "easy" as const,
      index: 0,
      questions: easyFinalQuestions,
    };
    setCurrentDifficulty("easy");
    setFlowState(nextState);
    setQuestionHistory((prev) => [...prev, nextState]);
    setSelectedAnswer(null);
  };

  const moveToMedium = () => {
    const nextState = {
      type: "medium" as const,
      index: 0,
      questions: mediumFinalQuestions,
    };
    setCurrentDifficulty("medium");
    setFlowState(nextState);
    setQuestionHistory((prev) => [...prev, nextState]);
    setSelectedAnswer(null);
  };

  const moveToHard = () => {
    const nextState = {
      type: "hard" as const,
      index: 0,
      questions: hardFinalQuestions,
    };
    setCurrentDifficulty("hard");
    setFlowState(nextState);
    setQuestionHistory((prev) => [...prev, nextState]);
    setSelectedAnswer(null);
  };

  // Function to move to next available difficulty
  const moveToNextDifficulty = () => {
    // Check which difficulties are available and not completed
    if (flowState.type === "practice") {
      if (easyFinalQuestions.length > 0) {
        moveToEasy();
      } else if (mediumFinalQuestions.length > 0) {
        moveToMedium();
      } else if (hardFinalQuestions.length > 0) {
        moveToHard();
      } else {
        console.log("All difficulties completed or no more questions");
        return false;
      }
      return true;
    } else if (flowState.type === "easy") {
      // Check if user got at least one correct answer in easy
      const currentLesson = lessonQuestions.find(
        (lesson) => lesson.lessonId === lessonId,
      );
      const hasCorrectEasyAnswer =
        currentLesson?.questions.some(
          (q) => q.difficulty === "easy" && q.isCorrect,
        ) || hasCorrectAnswer.easy;

      if (hasCorrectEasyAnswer) {
        if (mediumFinalQuestions.length > 0) {
          moveToMedium();
        } else if (hardFinalQuestions.length > 0) {
          moveToHard();
        } else {
          console.log("All difficulties completed or no more questions");
          return false;
        }
        return true;
      } else {
        console.log("No correct answer in easy difficulty yet");
        return false;
      }
    } else if (flowState.type === "medium") {
      // Check if user got at least one correct answer in medium
      const currentLesson = lessonQuestions.find(
        (lesson) => lesson.lessonId === lessonId,
      );
      const hasCorrectMediumAnswer =
        currentLesson?.questions.some(
          (q) => q.difficulty === "medium" && q.isCorrect,
        ) || hasCorrectAnswer.medium;

      if (hasCorrectMediumAnswer) {
        if (hardFinalQuestions.length > 0) {
          moveToHard();
        } else {
          console.log("All difficulties completed or no more questions");
          return false;
        }
        return true;
      } else {
        return false;
      }
    } else {
      console.log("All difficulties completed or no more questions");
      // All difficulties completed or no more questions
      return false;
    }
  };

  // Handle back button press
  const handleBackPress = () => {
    setIsNavigating(true);
    stopSpeaking();

    // If on practice question, do default back action
    if (flowState.type === "practice" && flowState.index === 0) {
      safeNavigate(
        router,
        pathname,
        {
          pathname: "/(default-bg)/(pupil-bg)/(with-nav)/lesson-grid",
          params: {
            lessonId,
            subjectId,
            subjectName,
            lessonNo,
            pupilId,
            levelId,
            levelNo,
            unitId,
            isFromMap: isFromMap ? "true" : "false",
          },
        },
        "replace",
      );
      return;
    }

    // If there's history, go back to previous state
    if (questionHistory.length > 1) {
      // Remove current state from history
      const newHistory = [...questionHistory];
      newHistory.pop();
      const previousState = newHistory[newHistory.length - 1];

      // Update state
      setFlowState(previousState);
      setQuestionHistory(newHistory);

      // Update current difficulty based on the previous state
      if (previousState.type !== "practice") {
        setCurrentDifficulty(previousState.type);
      }
    } else {
      console.log("No history, default back");
      safeNavigate(
        router,
        pathname,
        {
          pathname: "/(default-bg)/(pupil-bg)/(with-nav)/lesson-grid",
          params: {
            lessonId,
            subjectId,
            lessonNo,
            subjectName,
            pupilId,
            levelNo,
            isFromMap: isFromMap ? "true" : "false",
          },
        },
        "replace",
      );
    }

    setTimeout(() => setIsNavigating(false), 1000);
  };

  // Handle tag button presses
  const handleDifficultyChange = (difficulty: "easy" | "medium" | "hard") => {
    // Don't allow switching to completed difficulties

    let questions: TFinalChallenge[] | TIntegrationFinalChallenge[] = [];

    switch (difficulty) {
      case "easy":
        questions = easyFinalQuestions;
        break;
      case "medium":
        questions = mediumFinalQuestions;
        break;
      case "hard":
        questions = hardFinalQuestions;
        break;
    }

    if (questions.length > 0) {
      const newState = {
        type: difficulty,
        index: 0,
        questions,
      };

      setCurrentDifficulty(difficulty);
      setFlowState(newState);
      setQuestionHistory((prev) => [...prev, newState]);
      setSelectedAnswer(null);
      setShowCorrectModal(false);
      setShowWrongModal(false);
    }
  };

  const TAG_BUTTONS = [
    {
      onPress: () => handleDifficultyChange("easy"),
      text: "Easy",
      gradientColors: ["#00AC56", "#00AC56"] as const,
      isLock: () => {
        return false;
      },
    },
    {
      onPress: () => handleDifficultyChange("medium"),
      text: "Medium",
      gradientColors: ["#E28C0B", "#FFAD4B"] as const,
      isLock: () => {
        // Check multiple conditions for medium lock
        if (mediumFinalQuestions.length === 0) return true;

        const currentLesson = lessonQuestions.find(
          (lesson) => lesson.lessonId === lessonId,
        );

        // Check if user has correct answer in easy
        // First check hasCorrectAnswer state (set when user answers correctly)
        if (hasCorrectAnswer.easy) return false;

        const hasCorrectEasyAnswer = currentLesson?.questions.some(
          (q) => q.difficulty === "easy" && q.isCorrect,
        );

        return !hasCorrectEasyAnswer;
      },
    },
    {
      onPress: () => handleDifficultyChange("hard"),
      text: "Hard",
      gradientColors: ["#EC6F9E", "#EC8B6A"] as const,
      isLock: () => {
        // Check multiple conditions for hard lock
        if (hardFinalQuestions.length === 0) return true;

        // Check if user has correct answer in medium
        const currentLesson = lessonQuestions.find(
          (lesson) => lesson.lessonId === lessonId,
        );
        const hasCorrectMediumAnswer =
          currentLesson?.questions.some(
            (q) => q.difficulty === "medium" && q.isCorrect,
          ) || hasCorrectAnswer.medium;

        return !hasCorrectMediumAnswer;
      },
    },
  ];

  // Reset modals and selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowCorrectModal(false);
    setShowWrongModal(false);
    setCurrentHint("");
  }, [flowState.type, flowState.index]);

  // Update question history when moving to next question within same difficulty
  useEffect(() => {
    // Only add to history if this is a new position within the same difficulty
    if (questionHistory.length === 0 || flowState.questions.length === 0)
      return;

    const lastState = questionHistory[questionHistory.length - 1];
    if (
      lastState.type === flowState.type &&
      lastState.index !== flowState.index
    ) {
      setQuestionHistory((prev) => [...prev, flowState]);
    }
  }, [flowState]);

  // Function to play/replay the question voice
  const playQuestionVoice = useCallback(() => {
    if (!currentQuestionData) return;

    // Mark that voice is being initiated
    isVoiceInitiatedRef.current = true;

    const language = getLanguageFromSubject(subjectName);
    const optionLabel = t("lessonVideo.option");

    let optionsText = "";

    switch (currentQuestionData.type) {
      case "true_false":
        optionsText = `${optionLabel} 1: ${TRUE_FALSE_LABELS[language].true}, ${optionLabel} 2: ${TRUE_FALSE_LABELS[language].false}`;
        break;

      case "fill_blank":
        optionsText = "";
        break;

      case "ordering":
        optionsText =
          currentQuestionData?.content?.items
            ?.map(
              (option, index) => `${optionLabel} ${index + 1}: ${option}`,
            )
            .join(", ") || "";
        break;

      case "match":
        optionsText =
          currentQuestionData?.content?.pairs
            ?.map(
              (pair, index) =>
                `${t("lessonVideo.match")} ${index + 1}: ${pair.left} with ${pair.right}`,
            )
            .join(", ") || "";
        break;

      default:
        if (
          currentQuestionData &&
          "options" in currentQuestionData
        ) {
          optionsText =
            currentQuestionData?.options
              ?.map(
                (option, index) => `${optionLabel} ${index + 1}: ${option}`,
              )
              .join(", ") || "";
        }
        break;
    }
    
    const text =
      currentQuestionData && "question" in currentQuestionData
        ? `${t("lessonVideo.question")}: ${currentQuestionData?.question}. ${optionsText}`
        : `${t("lessonVideo.question")}: `;

    // Reset the flag after a short delay
    setTimeout(() => {
      isVoiceInitiatedRef.current = false;
    }, 1000);

    // Use API language if available, otherwise fall back to default
    speakText(text, apiLanguage);
  }, [currentQuestionData, subjectName, speakText, t, apiLanguage]);

  const handleAnswer = useCallback(
    (answer: any) => {
      if (!currentQuestion || !currentQuestionData) return;
      const newAnswer =
        currentQuestionData.type === "fill_blank" ? [answer] : answer;

      setSelectedAnswer(newAnswer);

      // Get the question ID from currentQuestion
      const questionId =
        "id" in currentQuestion
          ? currentQuestion.id
          : currentQuestionData.id.toString();

      const responseData = { answeredAt: new Date() };
      const type =
        currentQuestionData.type === "ordering_assessment"
          ? "ordering"
          : currentQuestionData.type === "writing_assessment"
            ? "writing"
            : "null";

      if (!currentQuestionData.isIntegration) {
        const data: TPostSubmitAnswer = {
          params: { pupilId, questionId },
          data: { answer: newAnswer, responseData },
        };
        if (currentQuestionData.type === "match") {
          console.log(
            "[Matching Question] Payload sent to backend:",
            JSON.stringify(data, null, 2),
          );
        }
        if (currentQuestionData.type === "fill_blank") {
          console.log(
            "[Fill Blank] Payload sent to backend:",
            JSON.stringify(data, null, 2),
          );
          console.log(
            "[Fill Blank] Answer selected:",
            JSON.stringify(answer, null, 2),
          );
          console.log(
            "[Fill Blank] Expected answer:",
            JSON.stringify(currentQuestionData.answer, null, 2),
          );
        }
        submitAnswer(data, {
          onSuccess: (response) => {
            if (currentQuestionData.type === "match") {
              console.log(
                "[Matching Question] Backend response:",
                JSON.stringify(response, null, 2),
              );
            }
            queryClient.invalidateQueries({
              queryKey: [
                "getJourneyMap",
                { pupilId: pupilId, subjectId: subjectId },
              ],
            });
            setRecentAnswerResult({
              questionId: response.questionId,
              isCorrect: response.isCorrect,
              answer: answer,
            });

            // Extract data from API response
            const {
              questionId,
              questionType,
              isCorrect,
              correctAnswer,
              yourAnswer,
              starsEarned,
              pointsEarned,
            currentAttempt,
              attemptsLeft,
              maxAttemptsAllowed,
              progress,
            } = response;

            const question: TQuestionResult = {
              questionId,
              questionType,
              difficulty: flowState.type,
              isCorrect,
              correctAnswer,
              yourAnswer,
              starsEarned,
              pointsEarned,
              currentAttempt,
              attemptsLeft,
              maxAttemptsAllowed,
            };

            dispatch(addOrUpdateQuestionInLesson({ lessonId, question }));

            // Update state
            setStarEarned(starsEarned);

            // Update hasCorrectAnswer state if this is a final challenge
            if (isCorrect && flowState.type !== "practice") {
              setHasCorrectAnswer((prev) => ({
                ...prev,
                [flowState.type]: true,
              }));
            }

            // Use the hints from currentQuestionData instead of API feedback
            const hint = isCorrect
              ? currentQuestionData.hints?.correct || "Great job!"
              : currentQuestionData.hints?.wrong || "Try again!";

            setCurrentHint(hint);

            // Show appropriate modal based on API response
            setShowCorrectModal(false);
            setShowWrongModal(false);
            setShowCompleteModal(false);

            if (type === "writing") {
              setShowWritingModal(true);
            } else {
              if (isCorrect) {
                setShowCorrectModal(true);
              } else {
                // Show wrong answer modal with attempts info
                setShowWrongModal(true);
              }
            }
          },
          onError: (error: any) => {
            const axiosErr = error as AxiosError<TBackendErrorResponse>;

            if (axiosErr.response?.data.error.includes("Maximum attempts")) {
              setIsAttemptsFinished(true);

              // For maximum attempts, use the wrong hint from question data
              const hint =
                currentQuestionData?.hints?.wrong ||
                "Maximum attempts reached. Please try again.";
              setCurrentHint(hint);
            } else {
              // For other errors, use the wrong hint from question data
              const hint =
                currentQuestionData?.hints?.wrong ||
                "Network error. Please check your connection and try again.";
              setCurrentHint(hint);
            }

            console.log("axios error is ", axiosErr);
            // Reset selected answer so user can try again
            setSelectedAnswer(null);

            // Show wrong answer modal
            setShowWrongModal(true);
          },
        });
      } else {
        const responseText =
          currentQuestionData.type === "writing_assessment"
            ? answer
            : undefined;
        const data: TPostSubmitIntegrationAnswer = {
          params: { pupilId, lessonId, questionId },
          data: { type, responseText, answer, responseData },
        };
        if (currentQuestionData.type === "match") {
          console.log(
            "[Matching Question] Payload sent to backend:",
            JSON.stringify(data, null, 2),
          );
        }
        submitIntegrationAnswer(data, {
          onSuccess: (response) => {
            if (currentQuestionData.type === "match") {
              console.log(
                "[Matching Question] Backend response:",
                JSON.stringify(response, null, 2),
              );
            }
            queryClient.invalidateQueries({
              queryKey: [
                "getJourneyMap",
                { pupilId: pupilId, subjectId: subjectId },
              ],
            });
            setRecentAnswerResult({
              questionId: response.questionId,
              isCorrect: response.isCorrect,
              answer: answer,
            });

            // Extract data from API response
            const {
              questionId,
              questionType,
              isCorrect,
              starsEarned,
              pointsEarned,
            } = response;

            const question: TQuestionResult = {
              questionId,
              questionType,
              difficulty: flowState.type,
              isCorrect,
              starsEarned,
              pointsEarned,
            };

            dispatch(addOrUpdateQuestionInLesson({ lessonId, question }));

            // Update state
            setStarEarned(starsEarned);

            // Update hasCorrectAnswer state if this is a final challenge
            if (isCorrect && flowState.type !== "practice") {
              setHasCorrectAnswer((prev) => ({
                ...prev,
                [flowState.type]: true,
              }));
            }

            // Use the hints from currentQuestionData instead of API feedback
            const hint = isCorrect
              ? currentQuestionData.hints?.correct || "Great job!"
              : currentQuestionData.hints?.wrong || "Try again!";

            setCurrentHint(hint);

            // Show appropriate modal based on API response
            setShowCorrectModal(false);
            setShowWrongModal(false);
            setShowCompleteModal(false);

            if (type === "writing") {
              setShowWritingModal(true);
            } else {
              if (isCorrect) {
                setShowCorrectModal(true);
              } else {
                // Show wrong answer modal with attempts info
                setShowWrongModal(true);
              }
            }
          },
          onError: (error: any) => {
            const axiosErr = error as AxiosError<TBackendErrorResponse>;

            if (axiosErr.response?.data.error.includes("Maximum attempts")) {
              setIsAttemptsFinished(true);

              // For maximum attempts, use the wrong hint from question data
              const hint =
                currentQuestionData?.hints?.wrong ||
                "Maximum attempts reached. Please try again.";
              setCurrentHint(hint);
            } else {
              // For other errors, use the wrong hint from question data
              const hint =
                currentQuestionData?.hints?.wrong ||
                "Network error. Please check your connection and try again.";
              setCurrentHint(hint);
            }

            console.log("axios error is ", axiosErr);
            // Reset selected answer so user can try again
            setSelectedAnswer(null);

            // Show wrong answer modal
            setShowWrongModal(true);
          },
        });
      }
    },
    [
      currentQuestion,
      currentQuestionData,
      flowState.type,
      pupilId,
      submitAnswer,
      submitIntegrationAnswer,
      getQuestionStatus,
    ],
  );

  const handleNext = () => {
    if (!currentQuestion) return;
    setIsNavigating(true);
    stopSpeaking();

    // Close all modals first
    setShowCorrectModal(false);
    setShowWrongModal(false);
    setShowCompleteModal(false);
    setShowWritingModal(false);

    // Check if we should move to next question or next difficulty
    if (flowState.index < flowState.questions.length - 1) {
      // Move to next question in current difficulty
      setFlowState((prev) => ({
        ...prev,
        index: prev.index + 1,
      }));
      // Reset answer for next question
      setSelectedAnswer(null);
    } else {
      // Mark current difficulty as completed
      if (
        !completedDifficulties.includes(flowState.type) &&
        flowState.type !== "practice"
      ) {
        setCompletedDifficulties((prev) => [...prev, flowState.type]);
      }

      // Special handling for practice questions
      if (flowState.type === "practice") {
        // Mark practice as completed
        if (!completedDifficulties.includes("practice")) {
          setCompletedDifficulties((prev) => [...prev, "practice"]);
        }

        // Try to move to easy difficulty
        const movedToEasy = moveToNextDifficulty();

        if (!movedToEasy) {
          // Check if all questions/difficulties are done
          const allDifficultiesDone = checkIfAllDifficultiesCompleted();
          if (allDifficultiesDone) {
            handleLessonComplete();
          }
        }
      } else {
        // For non-practice difficulties
        const moved = moveToNextDifficulty();

        if (!moved) {
          // Check if all difficulties are completed
          const allDifficulties = [
            "practice",
            "easy",
            "medium",
            "hard",
          ] as const;
          const allCompleted = allDifficulties.every(
            (difficulty) =>
              completedDifficulties.includes(difficulty) ||
              (difficulty === "easy" && easyFinalQuestions.length === 0) ||
              (difficulty === "medium" && mediumFinalQuestions.length === 0) ||
              (difficulty === "hard" && hardFinalQuestions.length === 0),
          );

          if (allCompleted) {
            console.log(
              "All difficulties completed, showing level complete modal",
            );
            handleLessonComplete();
          } else {
            console.log("Some difficulties not completed but cannot proceed");
          }
        }
      }
    }
    setTimeout(() => setIsNavigating(false), 1000);
  };

  // Add this helper function
  const checkIfAllDifficultiesCompleted = () => {
    const allDifficulties = ["practice", "easy", "medium", "hard"] as const;
    return allDifficulties.every(
      (difficulty) =>
        completedDifficulties.includes(difficulty) ||
        (difficulty === "easy" && easyFinalQuestions.length === 0) ||
        (difficulty === "medium" && mediumFinalQuestions.length === 0) ||
        (difficulty === "hard" && hardFinalQuestions.length === 0),
    );
  };

  const handleRenew = () => {
    setShowWrongModal(false);
    setIsAttemptsFinished(false);
    console.log("hasVideoBoolean ", hasVideoBoolean);
    if (hasVideoBoolean) {
      safeNavigate(router, pathname, {
        pathname: "/(default-bg)/(pupil-bg)/lesson-video",
        params: {
          stepId: videoStepId,
          audioStepId: audioStepId,
          questionStepId: stepId,
          subjectName: subjectName,
          level: levelName,
          lessonId: lessonId,
          subjectId,
          levelNo,
          levelId,
          unitId,
          isForRenew: "true",
          questionId: currentQuestion?.id,
          questionType: questionType,
          hasVideo: hasVideoString,
          hasQuestion: hasQuestionString,
          isFromMap: isFromMap ? "true" : "false",
        },
      });
    } else {
      safeNavigate(router, pathname, {
        pathname: "/(level-bg)/(pupil-bg)/lesson-intro",
        params: {
          stepId: audioStepId,
          videoStepId: videoStepId,
          questionStepId: stepId,
          subjectName: subjectName,
          level: levelName,
          lessonId: lessonId,
          subjectId,
          levelNo,
          levelId,
          unitId,
          isForRenew: "true",
          questionId: currentQuestion?.id,
          questionType: questionType,
          hasVideo: hasVideoString,
          hasQuestion: hasQuestionString,
          isFromMap: isFromMap ? "true" : "false",
        },
      });
    }
  };

  const handleRetry = () => {
    stopSpeaking();
    // Close all modals
    setShowCorrectModal(false);
    setShowWrongModal(false);
    setShowCompleteModal(false);
    setShowNoCorrectAnswerWarning(false);

    if (showNoCorrectAnswerWarning) {
      // If warning was shown, restart from first question in current difficulty
      setFlowState((prev) => ({
        ...prev,
        index: 0,
      }));
    } else {
      // Get the existing result
      const existingResult = getQuestionStatus();

      if (existingResult && !existingResult.isCorrect) {
        // If question was answered incorrectly, remove it from Redux
        // This allows user to try again with a fresh attempt
        dispatch(
          removeQuestionFromLesson({
            lessonId,
            questionId: existingResult.questionId,
          }),
        );
      }
    }

    // Always reset the selected answer for a fresh attempt
    setSelectedAnswer(null);
  };

  const handleSkip = () => {
    setIsNavigating(true);
    stopSpeaking();

    // Close all modals first
    setShowCorrectModal(false);
    setShowWrongModal(false);
    setShowCompleteModal(false);
    setShowNoCorrectAnswerWarning(false);

    if (flowState.type === "practice") {
      // Skip practice question, move to next available difficulty
      if (!completedDifficulties.includes("practice")) {
        setCompletedDifficulties((prev) => [...prev, "practice"]);
      }

      // Try to move to easy difficulty
      const moved = moveToNextDifficulty();

      if (!moved) {
        // Check if we should show completion modal
        const allDone = checkIfAllDifficultiesCompleted();
        if (allDone) {
          handleLessonComplete();
        }
      }
    } else {
      // For non-practice difficulties
      if (flowState.index < flowState.questions.length - 1) {
        // Not the last question, just move to next
        setFlowState((prev) => ({
          ...prev,
          index: prev.index + 1,
        }));
      } else {
        if (currentQuestionData?.isIntegration) {
          setCompletedDifficulties((prev) => [...prev, currentDifficulty]);
        } else {
          // Check if user got at least one correct answer in this difficulty
          const currentLesson = lessonQuestions.find(
            (lesson) => lesson.lessonId === lessonId,
          );
          const hasCorrectAnswerInDifficulty =
            currentLesson?.questions.some(
              (q) => q.difficulty === flowState.type && q.isCorrect,
            ) || hasCorrectAnswer[flowState.type];

          if (!hasCorrectAnswerInDifficulty) {
            // Show special warning modal
            setCurrentHint(
              `You need to answer at least one question correctly in ${flowState.type} difficulty to proceed. Let's start from the beginning!`,
            );
            // Reset selected answer
            setSelectedAnswer(null);
            setShowNoCorrectAnswerWarning(true);

            // Show wrong modal with special message
            setShowWrongModal(true);
            return;
          }

          // Mark difficulty as completed if not already
          if (!completedDifficulties.includes(flowState.type)) {
            setCompletedDifficulties((prev) => [...prev, flowState.type]);
          }
        }

        // Try to move to next difficulty
        const moved = moveToNextDifficulty();

        if (!moved) {
          const allDone = checkIfAllDifficultiesCompleted();
          if (allDone) {
            handleLessonComplete();
          }
        }
      }
    }
    setTimeout(() => setIsNavigating(false), 1000);
  };

  // const handleNextLevel = () => {

  //   setShowCompleteModal(false);
  //   router.back();
  // };

  const handleNextLevel = () => {
    setShowCompleteModal(false);

    // Apply navigation logic here
    if (navigationData?.nodeType) {
      if (
        navigationData.nodeType === "unit" ||
        navigationData.nodeType === "lesson"
      ) {
        if (
          subjectName.toLowerCase() === "arabic" ||
          subjectName.toLowerCase() === "english" ||
          subjectName.toLowerCase() === "french"
        ) {
          safeNavigate(
            router,
            pathname,
            {
              pathname:
                "/(default-bg)/(pupil-bg)/(with-nav)/subject-hierarchy-lessons",
              params: {
                subjectName,
                unitId,
                levelId,
                subjectId,
                stepId,
                levelNo,
              },
            },
            "replace",
          );
        } else {
          safeNavigate(
            router,
            pathname,
            {
              pathname: `/(journey-map)/subject-journey`,
              params: {
                subjectName,
                subjectId,
                userId: pupilId,
              },
            },
            "replace",
          );
        }
      } else if (navigationData.nodeType === "level") {
        safeNavigate(
          router,
          pathname,
          {
            pathname: "/(default-bg)/(pupil-bg)/(with-nav)/subject-hierarchy",
            params: {
              levelId,
              subjectId,
              subjectName,
              levelNo,
            },
          },
          "replace",
        );
      } else if (navigationData.nodeType === "root") {
        safeNavigate(
          router,
          pathname,
          {
            pathname: `/(journey-map)/subject-journey`,
            params: {
              subjectName,
              subjectId,
              userId: pupilId,
            },
          },
          "replace",
        );
      }
    } else {
      // Fallback if no navigation data
      safeNavigate(
        router,
        pathname,
        {
          pathname: "/(default-bg)/(pupil-bg)/(with-nav)/lesson-grid",
          params: {
            lessonId,
            subjectId,
            lessonNo,
            subjectName,
            pupilId,
            levelNo,
            isFromMap: isFromMap ? "true" : "false",
          },
        },
        "replace",
      );
    }

    // Clear navigation data
    setNavigationData(null);
  };

  const handleLessonComplete = () => {
    lessonComplete(undefined, {
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: [
            "getJourneyMap",
            { pupilId: pupilId, subjectId: subjectId },
          ],
        });

        // Store the navigation data to use in handleNextLevel
        setNavigationData(response.navigateTo);

        // Show the success modal instead of navigating immediately
        setShowCompleteModal(true);
      },
      onError: (err) => {
        const axiosErr = err as AxiosError<TBackendErrorResponse>;
        const errorMsg =
          axiosErr.response?.data?.error ??
          "Something went wrong, please try again";
        console.log("error message ", errorMsg);
        const mappedError = mapBackendError(errorMsg);
        switch (mappedError.field) {
          case FieldTypes.LOCKED:
            showToast("JourneyLock");
            break;
        }

        setTimeout(() => {
          safeNavigate(
            router,
            pathname,
            {
              pathname: "/(default-bg)/(pupil-bg)/(with-nav)/lesson-grid",
              params: {
                lessonId,
                subjectId,
                subjectName,
                lessonNo,
                pupilId,
                levelNo,
                isFromMap: isFromMap ? "true" : "false",
              },
            },
            "replace",
          );
        }, 300);
      },
    });
  };

  const handleCloseComplete = () => {
    setShowCompleteModal(false);
  };

  const renderQuestion = () => {
    if (!currentQuestionData) return null;
    // if (currentQuestionData.isIntegration) {
    //   return null;
    // }

    const existingResult = getQuestionStatus();
    const isQuestionAnswered = existingResult?.attemptsLeft !== 3;
    const language = getLanguageFromSubject(subjectName);
    const isRTL = isRTLFromLanguage(language);

    let userWasCorrect: boolean | null = null;
    let userAnswer: any = null;

    if (
      recentAnswerResult &&
      recentAnswerResult.questionId === currentQuestionData.id.toString()
    ) {
      userWasCorrect = recentAnswerResult.isCorrect;
      userAnswer = recentAnswerResult.answer;
    } else if (existingResult) {
      userWasCorrect = existingResult.isCorrect;
      userAnswer = existingResult.yourAnswer;

      // Convert string to boolean for True/False questions
      if (currentQuestionData.type === "true_false") {
        userAnswer = userAnswer === "true" || userAnswer === true;
      }
    }
    
    // console.log("selected answer is ", selectedAnswer)
    // console.log("user was correct ", userWasCorrect)
    // console.log("is question answered ", isQuestionAnswered)
    // console.log("is existing true ", existingResult?.isCorrect)

    // console.log("currentQuestionData ", currentQuestionData.type)

    return (
      <View style={{ flex: 1 }} key={`q-view-${currentQuestionData.id}`}>
        {currentQuestionData.type === "ordering_assessment" && (
          <OrderingAssessmentQuestion
            question={currentQuestionData}
            onAnswer={handleAnswer}
            userWasCorrect={isQuestionAnswered ? userWasCorrect : null}
            isDisabled={existingResult?.isCorrect === true}
          />
        )}
        {currentQuestionData.type === "writing_assessment" && (
          <WritingAsessmentQuestion
            question={currentQuestionData}
            onAnswer={handleAnswer}
          />
        )}
        {!currentQuestionData.isIntegration && (
          <View style={themedStyles.questionContainer} key={`q-container-${currentQuestionData.id}`}>
            <View
              style={{
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              {currentQuestionData.hints.pictureUrl && (
                <Image
                  key={currentQuestionData.id}
                  source={{ uri: currentQuestionData.hints.pictureUrl }}
                  style={{ width: 83, height: 83, borderRadius: 12 }}
                />
              )}

              {"question" in currentQuestionData && (
                <Text
                  style={[
                    themedStyles.questionText,
                    {
                      textAlign: isRTL ? "right" : "left",
                      writingDirection: isRTL ? "rtl" : "ltr",
                    },
                  ]}
                >
                  {currentQuestionData.question}
                </Text>
              )}
            </View>

            <ScrollView
              style={themedStyles.scrollView}
              contentContainerStyle={themedStyles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {currentQuestionData.type === "true_false" && (
                <TrueFalseQuestion
                  key={`tfq-${String(currentQuestionData.id)}`}
                  question={currentQuestionData as TrueFalseChallengeJson}
                  onAnswer={handleAnswer}
                  subjectName={subjectName}
                  selectedAnswer={
                    isQuestionAnswered ? userAnswer : selectedAnswer
                  }
                  userWasCorrect={userWasCorrect}
                  showCorrectAnswer={userWasCorrect === true}
                  isDisabled={existingResult?.isCorrect === true}
                />
              )}

              {currentQuestionData.type === "multiple_choice" && (
                <MultipleChoiceQuestion
                  key={`mcq-${String(currentQuestionData.id)}`}
                  question={currentQuestionData as MultipleChoiceChallengeJson}
                  onAnswer={handleAnswer}
                  selectedAnswer={
                    isQuestionAnswered ? userAnswer : selectedAnswer
                  }
                  userWasCorrect={isQuestionAnswered ? userWasCorrect : null}
                  showCorrectAnswer={userWasCorrect === true}
                  isDisabled={existingResult?.isCorrect === true}
                />
              )}

              {currentQuestionData.type === "fill_blank" && (
                // <FillBlankQuestion
                //   question={currentQuestionData as FillBlankChallengeJson}
                //   onAnswer={handleAnswer}
                //   selectedAnswer={selectedAnswer}
                //   userWasCorrect={!userWasCorrect ? isQuestionAnswered ? userWasCorrect : null : !selectedAnswer ? userWasCorrect : selectedAnswer}
                //   showCorrectAnswer={userWasCorrect === true}
                //   isDisabled={existingResult?.isCorrect === true}
                // />

                <MultipleChoiceQuestion
                  key={`fb-${String(currentQuestionData.id)}`}
                  question={currentQuestionData as FillBlankChallengeJson}
                  onAnswer={handleAnswer}
                  selectedAnswer={
                    isQuestionAnswered ? userAnswer : selectedAnswer
                  }
                  userWasCorrect={isQuestionAnswered ? userWasCorrect : null}
                  showCorrectAnswer={userWasCorrect === true}
                  isDisabled={existingResult?.isCorrect === true}
                />
              )}

              {currentQuestionData.type === "ordering" && (
                <OrderingQuestion
                  key={`ord-${String(currentQuestionData.id)}`}
                  question={currentQuestionData as OrderingChallengeJson}
                  onAnswer={handleAnswer}
                  selectedAnswer={
                    isQuestionAnswered ? userAnswer : selectedAnswer
                  }
                  userWasCorrect={isQuestionAnswered ? userWasCorrect : null}
                  showCorrectAnswer={userWasCorrect === true}
                  isDisabled={existingResult?.isCorrect === true}
                />
              )}

              {currentQuestionData.type === "match" && (
                <MatchingQuestion
                  key={`mat-${String(currentQuestionData.id)}`}
                  question={currentQuestionData as MatchingChallengeJson}
                  onAnswer={handleAnswer}
                  selectedAnswer={
                    isQuestionAnswered ? userAnswer || [] : selectedAnswer || []
                  }
                  userWasCorrect={isQuestionAnswered ? userWasCorrect : null}
                  showCorrectAnswer={userWasCorrect === true}
                  isDisabled={existingResult?.isCorrect === true}
                />
              )}

              {currentQuestionData.type === "image_choice" && (
                <ImageChoiceQuestion
                  key={`img-${String(currentQuestionData.id)}`}
                  question={currentQuestionData as ImageChoiceChallengeJson}
                  onAnswer={handleAnswer}
                  selectedAnswer={
                    isQuestionAnswered ? userAnswer : selectedAnswer
                  }
                  userWasCorrect={userWasCorrect}
                  showCorrectAnswer={userWasCorrect === true}
                  isDisabled={existingResult?.isCorrect === true}
                />
              )}

              {/* <WritingAsessmentQuestion question={currentQuestion} */}

              {/* Add Next Question button for already answered questions */}
              {isQuestionAnswered &&
                existingResult &&
                !showCorrectModal &&
                !showWrongModal &&
                (existingResult.isCorrect ? (
                  <Pressable
                    style={({ pressed }) => [themedStyles.nextButton]}
                    onPress={handleNext}
                  >
                    {({ pressed }) => (
                      <LinearGradient
                        colors={["#FFDE3C", "#DAB500"]}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 1 }}
                        style={{
                          width: 160,
                          height: 43,
                          paddingVertical: 10,
                          paddingHorizontal: 16,
                          borderRadius: 8,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          elevation: 4,
                        }}
                      >
                        <Text style={themedStyles.nextButtonText}>
                          {t("questions.nextQuestion")}
                        </Text>
                        <LeftArrow width={20} />
                      </LinearGradient>
                    )}
                  </Pressable>
                ) : (
                  <Pressable
                    style={({ pressed }) => [themedStyles.nextButton]}
                    onPress={handleSkip}
                  >
                    {({ pressed }) => (
                      <LinearGradient
                        colors={["#FFDE3C", "#DAB500"]}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 1 }}
                        style={{
                          width: 160,
                          height: 43,
                          paddingVertical: 10,
                          paddingHorizontal: 16,
                          borderRadius: 8,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          elevation: 4,
                        }}
                      >
                        <Text style={themedStyles.nextButtonText}>
                          {t("questions.skipQuestion")}
                        </Text>
                        <LeftArrow width={20} />
                      </LinearGradient>
                    )}
                  </Pressable>
                ))}
            </ScrollView>
          </View>
        )}
        {/* Show retry button if answered incorrectly */}
        {/* {isQuestionAnswered && !existingResult.isCorrect && (
            <TouchableOpacity
              style={themedStyles.retryButton}
              onPress={handleRetry}
            >
              <Text style={themedStyles.retryButtonText}>
                Try Again
              </Text>
            </TouchableOpacity>
          )} */}
      </View>
    );
  };

  useBackButtonHandler({ onBackPress: handleBackPress });

  return (
    <View style={themedStyles.container}>
      <Header
        isAllowedBack={true}
        showProgessBar={false}
        containerStyle={{ paddingHorizontal: 16 }}
        isDefaultBG={false}
        isSettings={true}
        backIconColor={"#fff"}
        onBackPressed={handleBackPress}
        view={
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Text style={themedStyles.subjectTitle}>{subjectName}</Text>
            <Text style={themedStyles.levelText}>
              {flowState.type === "practice"
                ? t("lessonFlow.final_journey")
                : `${levelName} ${t("lessonFlow.questions")}`}
            </Text>
          </View>
        }
      />

      {/* Show difficulty buttons only when not in practice mode */}
      {flowState.type !== "practice" && !currentQuestionData?.isIntegration && (
        <View style={{ paddingHorizontal: 16, zIndex: 100 }}>
          <DifficultyProgressTabs
            progress={progress}
            currentDifficulty={currentDifficulty}
            onPress={handleDifficultyChange}
            locks={{
              easy: false,
              medium: TAG_BUTTONS[1].isLock(),
              hard: TAG_BUTTONS[2].isLock(),
            }}
          />

          <Text style={themedStyles.progressText}>
            You’re {stepsAway} step{stepsAway !== 1 ? "s" : ""} away from next
            level
          </Text>
        </View>
      )}

      <View style={{ flex: 1, gap: 24 }}>
        {/* TODO: MAKE IT TO !currentQuestionData?.isIntegration ONCE UI IS DONE */}
        {!currentQuestionData?.isIntegration && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              paddingHorizontal: 16,
            }}
          >
            <Text style={themedStyles.questionNumber}>
              {flowState.type === "practice"
                ? t("lessonFlow.questions")
                : `${t("lessonFlow.questions")} ${flowState.index + 1}`}
            </Text>
            <LinearGradient
              colors={["#849530", "#C3DE45"]}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 1 }}
              style={{
                width: 80,
                height: 24,
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                elevation: 4,
              }}
            >
              <Image source={PointStar} style={{ width: 16, height: 16 }} />
              <Text style={themedStyles.pointsText}>
                {currentQuestionData?.points || 0} pts
              </Text>
            </LinearGradient>
            <Pressable
              onPress={async () => {
                // If AI is not enabled, don't do anything
                if (!aiGenratorEnabled) return;
                
                // If already navigating, don't allow replay
                if (isNavigating) return;

                const now = Date.now();
                // Prevent multiple clicks within 500ms
                if (now - lastVoiceClickRef.current < 500) return;
                lastVoiceClickRef.current = now;

                // If currently speaking, pause it
                if (isSpeaking) {
                  pauseSpeaking();
                } else if (isPaused) {
                  // Resume from paused state
                  resumeSpeaking();
                } else {
                  // Play/replay the question voice
                  playQuestionVoice();
                }
              }}
            >
              <LinearGradient
                colors={
                  aiGenratorEnabled
                    ? ["#D87AFF", "#F7C0E9"]
                    : ["#C6C6C6", "#9E9E9E"]
                }
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 1 }}
                style={{
                  width: 80,
                  height: 24,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  elevation: 4,
                }}
              >
                {isSpeakPending && !isSpeaking && (
                  <RotatingDotsLoader size={16} dotSize={2} />
                )}
                {isSpeaking ? (
                  <PauseIcon width={9} height={12} />
                ) : (
                  <PlayIcon2 width={9} height={12} />
                )}
                <Text style={themedStyles.pointsText}>
                  {isSpeaking ? t("questions.stop") : t("questions.play")}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}
        {renderQuestion()}
        {/* {renderIntegrationQuestion()} */}
      </View>

      <CorrectAnswerModal
        visible={showCorrectModal}
        hint={currentHint}
        onNext={handleNext}
        stars={staEarned}
      />

      <WritingAssessmentModal
        visible={showWritingModal}
        onClose={() => setShowWritingModal(false)}
        onNext={handleNext}
      />

      <WrongAnswerModal
        visible={showWrongModal}
        isAttemptsFinished={isAttemptsFinished}
        onRenew={handleRenew}
        hint={currentHint}
        onRetry={handleRetry}
        onSkip={handleSkip}
        isNoCorrectAnswerWarning={showNoCorrectAnswerWarning}
      />

      <LevelCompleteModal
        visible={showCompleteModal}
        isLesson={
          subjectName.toLowerCase() === "arabic" ||
          subjectName.toLowerCase() === "english" ||
          subjectName.toLowerCase() === "french"
            ? true
            : false
        }
        level={levelNo}
        lesson={lessonNo}
        onNextLevel={handleNextLevel}
        onClose={handleCloseComplete}
      />
    </View>
  );
}
