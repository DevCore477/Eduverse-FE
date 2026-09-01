import {
  Question,
  QuestionAnswer,
  ChallengeJson,
  TrueFalseChallengeJson,
  MultipleChoiceChallengeJson,
  FillBlankChallengeJson,
  OrderingChallengeJson,
  MatchingChallengeJson,
  ImageChoiceChallengeJson,
} from "@/types/questions";

/**
 * Validates if a user answer is correct for a given question
 */
export const validateAnswer = (
  question: ChallengeJson,
  userAnswer: any
): boolean => {
  try {
    switch (question.type) {
      case "true_false":
        return userAnswer === question.answer;

      case "multiple_choice":
      case "image_choice":
        return userAnswer === question.answer;

      case "fill_blank":
        if (!Array.isArray(userAnswer)) return false;
        return (
          userAnswer.length === question.answer.length &&
          userAnswer.every(
            (ans, idx) =>
              ans.toLowerCase().trim() ===
              question.answer[idx].toLowerCase().trim()
          )
        );

      case "ordering":
        if (!Array.isArray(userAnswer)) return false;
        return (
          userAnswer.length === question.answer.length &&
          userAnswer.every((ans, idx) => ans === question.answer[idx])
        );

      case "matching":
        if (typeof userAnswer !== "object" || Array.isArray(userAnswer))
          return false;
        const correctAnswer = question.answer;
        return (
          Object.keys(correctAnswer).length === Object.keys(userAnswer).length &&
          Object.keys(correctAnswer).every(
            (key) => userAnswer[key] === correctAnswer[key]
          )
        );

      default:
        return false;
    }
  } catch (error) {
    console.error("Error validating answer:", error);
    return false;
  }
};

/**
 * Calculate quiz statistics
 */
export const calculateQuizStats = (
  questions: Question[],
  answers: QuestionAnswer[]
) => {
  const totalQuestions = questions.length;
  const answeredQuestions = answers.length;
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const earnedPoints = answers.reduce((sum, a) => sum + a.pointsEarned, 0);
  const percentage =
    totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  return {
    totalQuestions,
    answeredQuestions,
    correctAnswers,
    incorrectAnswers: answeredQuestions - correctAnswers,
    totalPoints,
    earnedPoints,
    percentage,
    isPassed: percentage >= 60, // Configurable pass threshold
  };
};

/**
 * Shuffle array (useful for randomizing question order or options)
 */
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get question type display name
 */
export const getQuestionTypeName = (type: string): string => {
  const typeNames: Record<string, string> = {
    true_false: "True/False",
    multiple_choice: "Multiple Choice",
    fill_blank: "Fill in the Blank",
    ordering: "Ordering",
    matching: "Matching",
    image_choice: "Image Choice",
  };
  return typeNames[type] || "Unknown";
};

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Type guard functions
 */
export const isTrueFalseQuestion = (
  question: ChallengeJson
): question is TrueFalseChallengeJson => {
  return question.type === "true_false";
};

export const isMultipleChoiceQuestion = (
  question: ChallengeJson
): question is MultipleChoiceChallengeJson => {
  return question.type === "multiple_choice";
};

export const isFillBlankQuestion = (
  question: ChallengeJson
): question is FillBlankChallengeJson => {
  return question.type === "fill_blank";
};

export const isOrderingQuestion = (
  question: ChallengeJson
): question is OrderingChallengeJson => {
  return question.type === "ordering";
};

export const isMatchingQuestion = (
  question: ChallengeJson
): question is MatchingChallengeJson => {
  return question.type === "matching";
};

export const isImageChoiceQuestion = (
  question: ChallengeJson
): question is ImageChoiceChallengeJson => {
  return question.type === "image_choice";
};


