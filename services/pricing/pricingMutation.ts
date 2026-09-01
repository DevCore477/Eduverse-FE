import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TPurchasePlanQueryBody, TRequestManualPayment } from "@/types/pricingPlans";
import { useMutation } from "@tanstack/react-query";

export const usePurcahsePlan = (isLogin: boolean) => {
    return useMutation({
        mutationFn: async (data: TPurchasePlanQueryBody) => {
            const response = await axiosInstance.post(ENDPOINTS.pricing.purchasePlan(isLogin), {
                ...data
            });
            return response.data;
        }
    });
};


export const useUpgradePlan = () => {
    return useMutation({
        mutationFn: async (data: TPurchasePlanQueryBody) => {
            const response = await axiosInstance.post(ENDPOINTS.pricing.upgradePlan, {
                ...data
            });
            return response.data;
        }
    });
};


export const useRequestManualPayment = () => {
    return useMutation({
        mutationFn: async (data: TRequestManualPayment) => {
            const response = await axiosInstance.post(ENDPOINTS.pricing.requestManualPayment, {
                ...data
            });
            return response.data;
        }
    });
};
