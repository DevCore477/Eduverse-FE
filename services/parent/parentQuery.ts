import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TAuthenticate, TParenDashboardResponse, TParent } from "@/types/parent";
import { TPupil } from "@/types/pupil";
import { useQueries, useQuery } from "@tanstack/react-query";

export const useGetParent = (data: TAuthenticate) => {
    return useQuery<TParent, Error>({
        queryKey: ['getParent', data.id],
        queryFn: async () => {
            const response = await axiosInstance.get(
                ENDPOINTS.parent.getParent
            );
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
};

export const useGetPupils = (data: TAuthenticate) => {
    return useQuery<TPupil[], Error>({
        queryKey: ['getPupils', data.id],
        queryFn: async () => {
            const response = await axiosInstance.get(
                ENDPOINTS.parent.getPupils(data.id)
            );
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        enabled: !!data.id,
    });
};

export const useGetParentDashboardData = (data: TAuthenticate) => {
    return useQuery<TParenDashboardResponse, Error>({
        queryKey: ['getDashboardData', data.id],
        queryFn: async () => {
            const response = await axiosInstance.get(
                ENDPOINTS.parent.dashboardData
            );
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
};

export const useGetParentDataInParallel = (data: TAuthenticate) => {
    return useQueries({
        queries: [
            {
                queryKey: ['getParent', data.id],
                queryFn: async (): Promise<TParent> => {
                    const response = await axiosInstance.get(ENDPOINTS.parent.getParent);
                    return response.data.data;
                },
                staleTime: 5 * 60 * 1000,
                retry: 1,
                refetchOnWindowFocus: true,
                refetchOnMount: true,
            },
            {
                queryKey: ['getDashboardData', data.id],
                queryFn: async (): Promise<TParenDashboardResponse> => {
                    const response = await axiosInstance.get(ENDPOINTS.parent.dashboardData);
                    return response.data.data;
                },
                staleTime: 5 * 60 * 1000,
                retry: 1,
                refetchOnWindowFocus: true,
                refetchOnMount: true,
            },
        ],
    });
};
