import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TPlan } from "@/types/pricingPlans";
import { useQuery } from "@tanstack/react-query";

export const usePricingPlan = () => {
    return useQuery<TPlan[], Error>({
        queryKey: ['subscriptionPlans'],
        queryFn: async () => {
            const response = await axiosInstance.get(ENDPOINTS.pricing.getPlans);
            return response.data.data;
        },
        staleTime: 0,                
        refetchOnMount: true,        
        refetchOnWindowFocus: true,  
        retry: 1,
    });
};