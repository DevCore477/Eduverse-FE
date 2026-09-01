import AddPupilForm from "@/components/AddPupilForm";
import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { usePatchPupil } from "@/services/pupil/PupilMutation";
import { useGetPupil } from "@/services/pupil/pupilQuery";
import { useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/screens/AddPupil/index.style";
import { TPupilUpdate } from "@/types/pupil";
import { PupilData } from "@/types/schemas";
import { hasNetworkConnection } from "@/utils/checkNetworks";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { UseFormSetError } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";

export default function EditPupilScreen() {
    const theme = useTheme();
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);
    const [formSubmitted, setFormSubmitted] = useState(false)
    const { mutate: patchPupil, isPending } = usePatchPupil();
    const { showLoader, hideLoader, showToast } = useOverlay();
    const { pupilId } = useLocalSearchParams();
    const pupilIdString = Array.isArray(pupilId) ? pupilId[0] : pupilId || "";
    const user = useAppSelector((state) => state.parent.parent);
    const { data: pupilData, isPending: isPupilLoading, isError: isPupilError } = useGetPupil({
        id: user?.user.id,
        token: user?.token,
    }, pupilIdString)

    const queryClient = useQueryClient()
    const router = useRouter();
    useBackButtonHandler()

    useEffect(() => {
        if (isPending || isPupilLoading) {
            showLoader();
        }
        if (!formSubmitted && !isPupilLoading) {
            hideLoader()
        }
    }, [isPending, isPupilLoading, formSubmitted, showLoader, hideLoader]);

    const onFormSubmit = async (data: TPupilUpdate, setError: UseFormSetError<PupilData>) => {
        const isOnline = await hasNetworkConnection();
        if (!isOnline) {
            showToast("network");
            return;
        }
        setFormSubmitted(true)

        patchPupil(data, {
            onSuccess: async () => {
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ['getPupils', user?.user.id] }),
                    queryClient.invalidateQueries({ queryKey: ['getPupil', pupilIdString] }),
                    queryClient.invalidateQueries({ queryKey: ['getPupilModuleData', pupilIdString] }),
                    queryClient.invalidateQueries({ queryKey: ['getDashboardData', user?.user.id] }),
                ])
                router.back();
            },
            onError: (err: unknown) => {
                hideLoader()
                showToast("retry");
            }
        });
    };

    useEffect(() => {
        if (isPupilError) {
            showToast("retry");
        }
    }, [isPupilError, showToast])

    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={true} showProgessBar={false} stepBarSide={2} isSettings={true} isDefaultBG={true} view={
                <View>
                    <Text style={themedStyles.parentZoneText}>{t("editPupil.text")}</Text>
                </View>
            } />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <AddPupilForm onFormSubmit={onFormSubmit} pupilData={pupilData} />
            </ScrollView>
        </View>
    )
}