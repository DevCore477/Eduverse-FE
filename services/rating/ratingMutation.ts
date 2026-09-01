import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TRating } from "@/types/rating";
import { useMutation } from "@tanstack/react-query";

export const useCreateRating = () => {
    return useMutation({
        mutationFn: async (data:TRating) => {
            const response = await axiosInstance.post(ENDPOINTS.rating.createRating, data);
            return response.data;
        }
    });
};