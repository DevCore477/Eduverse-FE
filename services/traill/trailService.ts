import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { useMutation } from "@tanstack/react-query";

export const useStartTrail = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post(ENDPOINTS.trail.startTrail);
            return response.data.data;
        }
    });
};