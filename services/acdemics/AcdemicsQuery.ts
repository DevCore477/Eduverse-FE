import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TAcademics } from "@/types/academics";
import { TAuthenticate } from "@/types/parent";
import { useQuery } from "@tanstack/react-query";

export const useGetAcademics = (data: TAuthenticate) => {
    return useQuery<TAcademics[], Error>({
        queryKey: ['getAcademics',data.id],
        queryFn: async () => {
            const response = await axiosInstance.get(
                ENDPOINTS.academics.getAll
            );
            return response.data.data;
        },
    });
};
