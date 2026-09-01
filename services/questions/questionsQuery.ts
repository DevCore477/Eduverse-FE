import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Question } from "@/types/questions";

// API Base URL - Update this based on your API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.example.com";

/**
 * Fetch questions for a specific lesson or module
 */
export const useGetQuestions = (lessonId: string, options?: any) => {
  return useQuery({
    queryKey: ["questions", lessonId],
    queryFn: async (): Promise<Question[]> => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lessons/${lessonId}/questions`);
        return response.data;
      } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
      }
    },
    enabled: !!lessonId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/**
 * Fetch a single question by ID
 */
export const useGetQuestion = (questionId: string, options?: any) => {
  return useQuery({
    queryKey: ["question", questionId],
    queryFn: async (): Promise<Question> => {
      try {
        const response = await axios.get(`${API_BASE_URL}/questions/${questionId}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching question:", error);
        throw error;
      }
    },
    enabled: !!questionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/**
 * Fetch questions by subject and level
 */
export const useGetQuestionsByLevel = (
  subjectId: string,
  level: number,
  options?: any
) => {
  return useQuery({
    queryKey: ["questions", "subject", subjectId, "level", level],
    queryFn: async (): Promise<Question[]> => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/subjects/${subjectId}/levels/${level}/questions`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching questions by level:", error);
        throw error;
      }
    },
    enabled: !!subjectId && level > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/**
 * Example response type for question submission
 */
export interface SubmitAnswerResponse {
  isCorrect: boolean;
  pointsEarned: number;
  correctAnswer?: any;
  explanation?: string;
}


