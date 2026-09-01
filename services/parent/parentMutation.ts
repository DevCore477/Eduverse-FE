import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TAcessPin, TChangePassword, TUpdateParent } from "@/types/parent";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "firebase/auth";

export const useUpdateParent = () => {
    return useMutation({
        mutationFn: async (data: Partial<TUpdateParent>) => {
            const response = await axiosInstance.patch(ENDPOINTS.parent.updateParent, {
                ...data
            });
            return response.data;
        }
    });
};

export const useAccessByPin = () => {
    return useMutation({
        mutationFn: async (data: TAcessPin) => {
            const { token, ...updatedData } = data
            const response = await axiosInstance.post(ENDPOINTS.parent.switch, {
                ...updatedData
            });
            return response.data;
        }
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: async (data: TChangePassword) => {
            const response = await updatePassword(data.user, data.newPassword)
            return response;
        }
    });
};
