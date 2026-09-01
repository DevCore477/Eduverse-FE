import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TPupilCreate, TPupilUpdate } from "@/types/pupil";
import { useMutation } from "@tanstack/react-query";

export const useCreatePupil = () => {
    return useMutation({
        mutationFn: async (data: TPupilCreate) => {
            const { token, ...pupil } = data
            const response = await axiosInstance.post(ENDPOINTS.pupil.createPupil, {
                ...pupil
            });
            return response.data;
        }
    });
};

export const usePatchPupil = () => {
    return useMutation({
        mutationFn: async (data: TPupilUpdate) => {
            const { token, id, ...pupil } = data
            const response = await axiosInstance.patch(ENDPOINTS.pupil.patchPupil(id), {
                ...pupil
            })
            return response.data;
        }
    });
};
