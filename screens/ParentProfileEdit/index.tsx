import { CameraIcon, PupilOneIconSvg } from "@/assets/images";
import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useImagePickerWithPermissions } from "@/hooks/use-image-picker-with-permissions";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useUpdateParent } from "@/services/parent/parentMutation";
import { useGetParent } from "@/services/parent/parentQuery";
import { useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/screens/ParenProfileEdit/index.style";
import { TUpdateParent } from "@/types/parent";
import { hasNetworkConnection } from "@/utils/checkNetworks";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import ParentEditForm from "./components/ParentEditForm";

export default function ParentProfileEditScreen() {
    const theme = useTheme();
    const themedStyles = styles(theme);
    const user = useAppSelector((state) => state.parent.parent);
    const { data: parentData, isPending: isGetParentPending, isError } = useGetParent({ id: user?.user?.id, token: user?.token });
    const { mutate: updatedParent, isPending } = useUpdateParent();
    const router = useRouter()
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const { showLoader, hideLoader, showToast } = useOverlay();

    const { imageUri, imageBase64, openImageSourcePicker } = useImagePickerWithPermissions({
        showToast,
        cameraDeniedMessage: "Camera access is required to take a profile picture.",
        galleryDeniedMessage: "Gallery access is required to choose a profile picture."
    });

    useBackButtonHandler()

    useEffect(() => {
        if (isGetParentPending || isPending) {
            showLoader();
        } else {
            hideLoader();
        }

        // Cleanup: hide loader when component unmounts
        return () => {
            hideLoader();
        };
    }, [isGetParentPending, isPending, showLoader, hideLoader]);

    useEffect(() => {
        if (isError) {
            showToast("retry");
        }
    }, [isError, showToast]);

    const onFormSubmit = async (data: TUpdateParent) => {
        const isOnline = await hasNetworkConnection();

        if (!isOnline) {
            showToast("network");
            return;
        }

        const payload: TUpdateParent & { profileImage?: string } = {
            ...data,
            profileImageBase64: imageBase64
                ? `data:image/jpeg;base64,${imageBase64}`
                : undefined
        };

        updatedParent(payload, {
            onSuccess: async () => {
                // Hide loader before navigation to prevent it from persisting
                hideLoader();
                // Invalidate queries and wait for it to complete
                await queryClient.invalidateQueries({ queryKey: ["getParent", user?.user.id] });
                router.back();
            },
            onError: () => {
                showToast("retry");
            }
        });
    };

    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={true} showProgessBar={false} stepBarSide={2} isSettings={true} isDefaultBG={true} view={
                    <View>
                        <Text style={themedStyles.parentProfileText}>{t("parentProfileEdit.text")}</Text>
                    </View>
                } />

            <Pressable onPress={openImageSourcePicker} style={themedStyles.iconsContent}>
                <View style={themedStyles.iconCard}>
                    {imageUri || parentData?.profileImageBase64 ? (
                        <Image
                            source={{
                                uri: imageUri
                                    ? imageUri
                                    : parentData!.profileImageBase64!,
                            }}
                            style={{ width: 140, height: 140, borderRadius: 70 }}
                            contentFit="cover"
                        />
                    ) : (
                        <PupilOneIconSvg width={120} height={120} />
                    )}
                </View>

                <View style={themedStyles.cameraContainter}>
                    <CameraIcon width={18} height={18} />
                </View>
            </Pressable>

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <ParentEditForm parentData={parentData} onFormSubmit={onFormSubmit} />
            </ScrollView>
        </View>
    )
}
