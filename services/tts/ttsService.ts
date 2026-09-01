import { axiosInstance, ENDPOINTS } from "@/config/api-config";

export type TTSLanguage = "en" | "ar" | "fr";

export interface TTSPayload {
  text: string;
  language?: TTSLanguage;
  isUrl?: boolean; // Flag to indicate if text is a pre-generated audio URL
}

export interface TTSResponse {
  audio: string;
}

export const synthesizeSpeech = async (
  payload: TTSPayload
): Promise<TTSResponse> => {
  // If isUrl is true, return the URL as audio data directly (no API call needed)
  if (payload.isUrl) {
    return { audio: payload.text };
  }
  
  const response = await axiosInstance.post(ENDPOINTS.polly.tts, payload);
  return response.data.data;
};
