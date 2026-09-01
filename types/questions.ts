export type QuestionType =
  | "true_false"
  | "multiple_choice"
  | "fill_blank"
  | "ordering"
  | "match"
  | "image_choice";

export interface QuestionHints {
  wrong: string;
  correct: string;
  pictureUrl: string | null;
}

// Base Challenge JSON interface
export interface BaseChallengeJson {
  type: QuestionType;
  hints: QuestionHints;
  points: number;
  question: string;
}

export interface TNormalizedQuestion {
  id: number;
  type:
    | "image_choice"
    | "true_false"
    | "fill_blank"
    | "match"
    | "multiple_choice"
    | "ordering";
  hints: {
    wrong: string;
    correct: string;
    pictureUrl: string | null;
  };
  answer: string | boolean | string[] | { [key: string]: string };
  points: number;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  options?: string[];
  content?: {
    pairs?: { left: string; right: string }[];
    items?: string[];
    images?: { id: string; url: string }[];
  };
  matchItems?: { left: string; right: string }[];
  isIntegration: boolean;
}

export interface TIntegrationWritingNormalizedQuestion {
  id: number;
  type: "writing_assessment";
  hints: {
    wrong: string;
    correct: string;
    pictureUrl: string | null;
  };
  points: number;
  difficulty: "easy" | "medium" | "hard";
  payload: {
    integrationType: string;
    isIntegrationLesson: boolean;
  };
  writingTask: {
    type: string;
    length: string;
    points: number;
    context: string;
    difficulty: "Easy" | "Medium" | "Hard";
    instruction: string;
    requirements: string[];
  };
  selfCorrectionGrid: {
    title: string;
    criteria: {
      name?: string;
      points?: number;
      indicators?: string[];
      description?: string;
      category?: string;
      maxPoints?: number;
    }[];
    totalPoints: number;
    noteForParent: string;
  };
  isIntegration: boolean;
}

// writing_assesment
export interface TIntegrationWritingChallengeJson {
  id: number;
  type: "writing_assessment";
  hints: {
    wrong: string;
    correct: string;
    pictureUrl: string | null;
  };
  points: number;
  payload: {
    integrationType: string;
    isIntegrationLesson: boolean;
  };
  difficulty: "easy" | "medium" | "hard";
  writingTask: {
    type: string;
    length: string;
    points: number;
    context: string;
    difficulty: "Easy" | "Medium" | "Hard";
    instruction: string;
    requirements: string[];
  };
  selfCorrectionGrid: {
    title: string;
    criteria: {
      name?: string;
      points?: number;
      indicators?: string[];
      description?: string;
      category?: string;
      maxPoints?: number;
    }[];
    totalPoints: number;
    noteForParent: string;
  };
}

// ordering_assesment
export interface TIntegrationOrderingChallengeJson {
  id: number;
  type: "ordering_assessment";
  hints: {
    wrong: string;
    correct: string;
    pictureUrl: string | null;
  };
  points: number;
  payload: {
    integrationType: string;
    isIntegrationLesson: boolean;
  };
  difficulty: "easy" | "medium" | "hard";
  orderingTask: {
    type: string;
    items: string[];
    points: number;
    context: string;
    difficulty: "Easy" | "Medium" | "Hard";
    instruction: string;
    requirements: string[];
    correctOrder: [];
  };
}

export interface TIntegrationOrderingChallengeJsonType2 {
  id: number;
  type: "ordering_assessment";
  question: string;
  hints: {
    wrong: string;
    correct: string;
    pictureUrl: string | null;
  };
  answer: string[];
  difficulty: "easy" | "medium" | "hard";
  points: number;
  content: {
    items: string[];
    context: string;
    requirements: string[];
  };
  payload: {
    integrationType: string;
    isIntegrationLesson: boolean;
  };
}

export interface TIntegrationOrderingNormalizedQuestion {
  id: number;
  type: "ordering_assessment";
  hints: {
    wrong: string;
    correct: string;
    pictureUrl: string | null;
  };
  points: number;
  payload: {
    integrationType: string;
    isIntegrationLesson: boolean;
  };
  difficulty: "easy" | "medium" | "hard";
  orderingTask: {
    type: string;
    items: string[];
    points: number;
    context: string;
    difficulty: "Easy" | "Medium" | "Hard";
    instruction: string;
    requirements: string[];
    correctOrder: string[];
  };
  isIntegration: boolean;
}

export interface TIntegrationOrderingNormalizedQuestionType2 {
  id: number;
  type: "ordering_assessment";
  question: string;
  hints: {
    wrong: string;
    correct: string;
    pictureUrl: string | null;
  };
  answer: string[];
  difficulty: "easy" | "medium" | "hard";
  points: number;
  content: {
    items: string[];
    context: string;
    requirements: string[];
  };
  payload: {
    integrationType: string;
    isIntegrationLesson: boolean;
  };
  isIntegration: boolean;
}

export interface TIntegrationFinalChallenge {
  id: string;
  challengeJson:
    | TIntegrationWritingChallengeJson
    | TIntegrationOrderingChallengeJson
    | TIntegrationOrderingChallengeJsonType2;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  questionId: number;
  orderIndex: number;
}

export interface TNotificationDetainIntegrationFinalChallenge {
  id: string;
  challengeJson: TIntegrationWritingChallengeJson;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  questionId: number;
  orderIndex: number;
}

export interface TIntegrationFinalChallenges {
  easy: TIntegrationFinalChallenge[];
  medium: TIntegrationFinalChallenge[];
  hard: TIntegrationFinalChallenge[];
}

// True/False Question
export interface TrueFalseChallengeJson extends TNormalizedQuestion {
  type: "true_false";
  answer: boolean;
}

// Multiple Choice Question
export interface MultipleChoiceChallengeJson extends TNormalizedQuestion {
  type: "multiple_choice" | "fill_blank";
  answer: string | string[];
  content?: Record<string, any>;
  options: string[];
}

// Fill in the Blank Question
export interface FillBlankChallengeJson extends TNormalizedQuestion {
  type: "fill_blank";
  answer: string[] | string;
  content?: Record<string, any>;
  options: string[];
}

// Ordering Question
export interface OrderingChallengeJson extends TNormalizedQuestion {
  type: "ordering";
  answer: string[];
  content: {
    items: string[];
  };
}

// Matching Question
export interface MatchingChallengeJson extends TNormalizedQuestion {
  type: "match";
  answer: any;
  content?: {
    pairs: Array<{
      left: string;
      right: string;
    }>;
  };
  matchItems?: Array<{
    left: string;
    right: string;
  }>;
}

// Image Choice Question
export interface ImageChoiceChallengeJson extends TNormalizedQuestion {
  type: "image_choice";
  answer: string;
  content: {
    images: Array<{
      id: string;
      url: string;
    }>;
  };
}

// Union type for all challenge JSON types
export type ChallengeJson =
  | TrueFalseChallengeJson
  | MultipleChoiceChallengeJson
  | FillBlankChallengeJson
  | OrderingChallengeJson
  | MatchingChallengeJson
  | ImageChoiceChallengeJson;

// Main Question interface
export interface Question {
  id: string;
  challenge_json: ChallengeJson;
  points: number;
  created_at: string;
}

// Question session state
export interface QuestionSession {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  answeredQuestions: number;
  totalQuestions: number;
}

// Answer submission
export interface QuestionAnswer {
  questionId: string;
  answer: string | boolean | string[] | Record<string, string>;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface TGetLessonByDifficulty {
  lessonId: string;
}

export interface TGetLessonQUestionById {
  pupilId: string;
  questionId: string;
}

export interface TFinalChallenge {
  id: string;
  challengeJson: {
    id: number;
    type:
      | "image_choice"
      | "true_false"
      | "fill_blank"
      | "match"
      | "multiple_choice"
      | "ordering";
    hints: {
      wrong: string;
      correct: string;
      pictureUrl: string | null;
    };
    answer: boolean | string | string[] | { [key: string]: string }; // Different types for answers based on the challenge type
    points: number;
    question: string;
    difficulty: "easy" | "medium" | "hard";
    options?: string[]; // For multiple_choice
    content?: {
      pairs?: { left: string; right: string }[]; // For matching
      items?: string[]; // For ordering
    };
    matchItems?: { left: string; right: string }[];
  };
  points: number;
  difficulty: "easy" | "medium" | "hard";
  questionId: number;
  orderIndex: number;
}

export interface TFinalChallenges {
  easy: TFinalChallenge[];
  medium: TFinalChallenge[];
  hard: TFinalChallenge[];
}

export interface TPracticeQuestion {
  id: string;
  questionJson: {
    id: number;
    type:
      | "image_choice"
      | "true_false"
      | "fill_blank"
      | "match"
      | "multiple_choice"
      | "ordering";
    hints: {
      wrong: string;
      correct: string;
      pictureUrl: string | null;
    };
    answer: boolean | string | string[] | { [key: string]: string }; // Different types for answers based on the challenge type
    points: number;
    question: string;
    difficulty: "easy" | "medium" | "hard";
    options?: string[]; // For multiple_choice
    content?: {
      pairs?: { left: string; right: string }[]; // For matching
      items?: string[]; // For ordering
    };
    matchItems?: { left: string; right: string }[];
  };
  points: number;
  difficulty: "easy" | "medium" | "hard";
  orderIndex: number;
}

export interface TPracticeQuestions {
  easy: TPracticeQuestion[];
  medium: TPracticeQuestion[];
  hard: TPracticeQuestion[];
}

export interface TLessonByDifficulty {
  lessonId: string;
  lessonTitle: string;
  practiceQuestions: TPracticeQuestions;
  finalChallenges: TFinalChallenges;
  language?: "en" | "ar" | "fr";
}

export interface TIntegrationLessonByDifficulty {
  lessonId: string;
  lessonTitle: string;
  practiceQuestions: TPracticeQuestions;
  finalChallenges: TIntegrationFinalChallenges;
  language?: "en" | "ar" | "fr";
}

export interface TPostSubmitAnswerParams {
  pupilId: string;
  questionId: string;
}

export interface TPostSubmitIntegrationAnswerParams {
  pupilId: string;
  lessonId: string;
  questionId: string;
}

export interface TPostSubmitAnswerData {
  answer: boolean | string | string[] | { [key: string]: string };
  responseData: { answeredAt: Date };
}
export interface TPostSubmIntegrationAnswerData {
  type: string;
  responseText?: string;
  answer?: string[];
  responseData: { answeredAt: Date };
}

export interface TPostSubmitAnswer {
  params: TPostSubmitAnswerParams;
  data: TPostSubmitAnswerData;
}

export interface TPostSubmitIntegrationAnswer {
  params: TPostSubmitIntegrationAnswerParams;
  data: TPostSubmIntegrationAnswerData;
}

export interface TQuestionResult {
  questionId: string;
  questionType: string;
  difficulty: "easy" | "medium" | "hard" | "practice";
  isCorrect: boolean;
  correctAnswer?: boolean | string | string[] | { [key: string]: string };
  yourAnswer?: boolean | string | string[] | { [key: string]: string };
  starsEarned: number;
  pointsEarned: number;
  currentAttempt?: number;
  attemptsLeft?: number;
  maxAttemptsAllowed?: number;
}
export interface TLessonQuestionResult {
  lessonId: string;
  questions: TQuestionResult[];
}

export interface TPostRenewAttempts {
  pupilId: string;
  lessonId: string;
  questionId: string;
}

export interface TGetLessonProgress {
  pupilId: string;
  lessonId: string;
}

export interface TGetJourneyMap {
  pupilId: string;
  subjectId: string;
}

export interface TProgressData {
  practice: { stars: number; questions: TQuestionResult[] };
  finalChallenge: { stars: number; questions: TQuestionResult[] };
}

export interface TLessonProgress {
  id: string;
  nodeId: string;
  progressData: TProgressData;
}
