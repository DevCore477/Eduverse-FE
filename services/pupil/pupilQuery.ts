import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TAuthenticate } from "@/types/parent";
import { TPupil, TPupilModulesData } from "@/types/pupil";
import { useQuery } from "@tanstack/react-query";

// will be getting token and pupil id
export const useGetPupilModuleData = (data: TAuthenticate, pupilId: string) => {
    return useQuery<TPupilModulesData, Error>({
        queryKey: ['getPupilModuleData', pupilId],
        queryFn: async () => {
            const response = await axiosInstance.get(
                ENDPOINTS.pupil.pupilDetails(pupilId)
            );
            console.log("Pupil insights API response:", response.data.data);
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
};

export const useGetPupil = (data: TAuthenticate, pupilId?: string) => {
    return useQuery<TPupil, Error>({
        queryKey: ['getPupil', pupilId],
        enabled: !!pupilId,
        queryFn: async () => {
            if (!pupilId) {
                throw new Error("pupilId is required to fetch pupil");
            }
            const response = await axiosInstance.get(
                ENDPOINTS.pupil.getPupil(pupilId)
            );
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
};