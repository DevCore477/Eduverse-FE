import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useCreatePupil } from "@/services/pupil/PupilMutation";
import { useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/screens/AddPupil/index.style";
import { TBackendErrorResponse } from "@/types/global";
import { TPupilCreate } from "@/types/pupil";
import { PupilData } from "@/types/schemas";
import { hasNetworkConnection } from "@/utils/checkNetworks";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { UseFormSetError } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import AddPupilForm from "../../components/AddPupilForm";

export default function AddPupilScreen() {
    const theme = useTheme();
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);
    const { mutate: createPupil, isPending } = useCreatePupil();
    const { showLoader, hideLoader, showToast } = useOverlay();
    const queryClient = useQueryClient()
    const user = useAppSelector((state) => state.parent.parent);
    const router = useRouter();
    useBackButtonHandler()

    useEffect(() => {
        if (isPending) {
            showLoader();
        } 
    }, [isPending, showLoader, hideLoader]);

    const onFormSubmit = async (data: TPupilCreate, setError: UseFormSetError<PupilData>) => {
        const isOnline = await hasNetworkConnection();

        if (!isOnline) {
            showToast("network");
            return;
        }

        createPupil(data, {
            onSuccess: (response) => {
                // const user = response.data.data;
                queryClient.invalidateQueries({ queryKey: ['getPupils', user?.user.id] })
                queryClient.invalidateQueries({ queryKey: ['getDashboardData', user?.user.id] })
                router.back();
            },
            onError: (err: unknown) => {
                hideLoader();
                const axiosErr = err as AxiosError<TBackendErrorResponse>;
                console.log("Errior in add form is  ", axiosErr.response?.data?.error)
                showToast("retry");
            }
        });
    };


    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={true} showProgessBar={false} stepBarSide={2} isSettings={true} isDefaultBG={true} view={
                <View>
                    <Text style={themedStyles.parentZoneText}>{t("addPupil.text")}</Text>
                </View>
            } />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <AddPupilForm onFormSubmit={onFormSubmit} />
            </ScrollView>
        </View>
    )
}