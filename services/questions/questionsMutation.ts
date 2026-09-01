import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { QuestionAnswer } from "@/types/questions";

// API Base URL - Update this based on your API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.example.com";

interface SubmitAnswerPayload {
  questionId: string;
  answer: any;
  timeSpent?: number;
}

interface SubmitAnswerResponse {
  isCorrect: boolean;
  pointsEarned: number;
  correctAnswer?: any;
  explanation?: string;
}

/**
 * Submit an answer for a question
 */
export const useSubmitAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitAnswerPayload): Promise<SubmitAnswerResponse> => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/questions/${payload.questionId}/submit`,
          {
            answer: payload.answer,
            timeSpent: payload.timeSpent,
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error submitting answer:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries after successful submission
      queryClient.invalidateQueries({ queryKey: ["question", variables.questionId] });
    },
  });
};

interface CompleteQuizPayload {
  lessonId: string;
  answers: QuestionAnswer[];
  totalTime?: number;
}

interface CompleteQuizResponse {
  score: number;
  totalPoints: number;
  percentage: number;
  isPassed: boolean;
  rewards?: {
    points: number;
    badges?: string[];
  };
}

/**
 * Submit completed quiz with all answers
 */
export const useCompleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CompleteQuizPayload): Promise<CompleteQuizResponse> => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/lessons/${payload.lessonId}/complete`,
          {
            answers: payload.answers,
            totalTime: payload.totalTime,
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error completing quiz:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries after quiz completion
      queryClient.invalidateQueries({ queryKey: ["questions", variables.lessonId] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      queryClient.invalidateQueries({ queryKey: ["pupil-stats"] });
    },
  });
};

interface SaveProgressPayload {
  lessonId: string;
  currentQuestionIndex: number;
  answers: QuestionAnswer[];
}

/**
 * Save quiz progress (for resuming later)
 */
export const useSaveQuizProgress = () => {
  return useMutation({
    mutationFn: async (payload: SaveProgressPayload): Promise<{ success: boolean }> => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/lessons/${payload.lessonId}/progress`,
          {
            currentQuestionIndex: payload.currentQuestionIndex,
            answers: payload.answers,
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error saving quiz progress:", error);
        throw error;
      }
    },
  });
};


