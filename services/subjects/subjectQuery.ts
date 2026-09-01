import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TGetJourneyMap, TGetLessonByDifficulty, TGetLessonProgress, TGetLessonQUestionById, TIntegrationLessonByDifficulty, TLessonByDifficulty, TLessonProgress, TNotificationDetainIntegrationFinalChallenge } from "@/types/questions";
import { TStepInfo } from "@/types/subjects";
import { useQuery } from "@tanstack/react-query";
import { string } from "zod";

export const useGetLessonQuestionByDifficulty = (data: TGetLessonByDifficulty) => {
    return useQuery<TLessonByDifficulty | TIntegrationLessonByDifficulty, Error>({
        queryKey: ['getLessonQuestionByDiff', data.lessonId],
        queryFn: async () => {
            const response = await axiosInstance.get(
                ENDPOINTS.journey.getQuestionByDifficulty(data.lessonId)
            );
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};


// NOTE : only using this for writing notification detail, so if you want to use it for others too then ad the return types
export const useGetLessonQuestionById = (data: TGetLessonQUestionById) => {
    const enabled = Boolean(data?.pupilId && data?.questionId);
    return useQuery<TNotificationDetainIntegrationFinalChallenge, Error>({
        queryKey: ['getLessonQuestionById', { pupilId: data.pupilId, questionId: data.questionId }],
        queryFn: async () => {
            const response = await axiosInstance.get(
                ENDPOINTS.journey.getLessonQuestionById(data.pupilId, data.questionId)
            );
            return response.data.data;
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export const useGetLessonProgress = (data: TGetLessonProgress) => {
    return useQuery<TLessonProgress, Error>({
        queryKey: ['getLessonProgress', data.lessonId],
        queryFn: async () => {
            const response = await axiosInstance.get(
                ENDPOINTS.journey.getLessonProgress(data.pupilId, data.lessonId)
            );
            return response.data.data;
        },
        staleTime: 0,
        retry: 1,
    });
};

export const useGetJourneyMap = (data: TGetJourneyMap) => {
    const isEnabled = data.pupilId.trim().length > 0 && data.subjectId.trim().length > 0;
    // console.log("data for journey map is ", JSON.stringify(data, null, 2))
    return useQuery<any, Error>({
        queryKey: ['getJourneyMap', { pupilId: data.pupilId, subjectId: data.subjectId }],
        queryFn: async () => {
            const response = await axiosInstance.get(
                ENDPOINTS.journey.getJourneyMap(data.pupilId, data.subjectId)
            );
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
        enabled: isEnabled,
    });
};

export const useGetLessonStepInfo = (step_id: string) => {
    return useQuery<TStepInfo, Error>({
        queryKey: ['getLesonStepInfo', step_id],
        queryFn: async () => {
            const response = await axiosInstance.get(ENDPOINTS.journey.getStepInfo.replace(":step_id", step_id), {
                params: {
                    step_id: step_id,
                }
            });
            return response.data.data;

        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};

export const useGetSubjectLessonCards = (pupilId: string, lessonId: string) => {
    return useQuery<any, Error>({
        queryKey: ['getLessonCards', { pupilId: string, lessonId: string }],
        queryFn: async () => {
            const response = await axiosInstance.get(ENDPOINTS.journey.getLessonCards.replace(":pupil_id", pupilId).replace(":lesson_id", lessonId), {
                params: {
                    pupil_id: pupilId,
                    lesson_id: lessonId,
                }
            });
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};
