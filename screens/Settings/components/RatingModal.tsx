import { EmptyStarIcon, NedjmatiStar, StarIcon, X } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { SwitchButton } from "@/screens/ParentDashboard/components/SwitchButton";
import { styles } from "@/styles/screens/Settings/components/RatingModal.style";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

interface RatingModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (rating: number) => void;
    isSubmitting?: boolean;
}

const RatingModal = ({ visible, onClose, onSubmit, isSubmitting = false }: RatingModalProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const themedStyles = styles(theme);

    const [rating, setRating] = useState<number>(0);
    const [showError, setShowError] = useState<boolean>(false);

    // Reset rating when modal opens
    useEffect(() => {
        if (visible) {
            setRating(0);
            setShowError(false);
        }
    }, [visible]);

    const handleStarPress = (starNumber: number) => {
        if (isSubmitting) return;
        setRating(starNumber);
        setShowError(false);
    };

    const handleSubmit = () => {
        if (isSubmitting) return;

        if (rating === 0) {
            setShowError(true);
            return;
        }
        onSubmit(rating);
        // Don't reset rating here - let parent handle success/failure
    };

    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => handleStarPress(i)}
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.5 : 1 }}
                >
                    {i <= rating ? (
                        <Image source={StarIcon} style={{ width: 30, height: 30 }} />
                    ) : (
                        <Image source={EmptyStarIcon} style={{ width: 30, height: 30 }} />
                    )}
                </TouchableOpacity>
            );
        }
        return stars;
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={isSubmitting ? undefined : onClose}
        >
            <View style={themedStyles.overlay}>
                <View style={themedStyles.modalContent}>
                    <NedjmatiStar width={80} height={80} />
                    <Text style={themedStyles.title}>{t("ratingModal.title")}</Text>
                    <Text style={themedStyles.subTitle}>{t("ratingModal.subTitle")}</Text>

                    {/* Star Container */}
                    <View style={themedStyles.starContainer}>
                        {renderStars()}
                    </View>

                    {/* Error Message */}
                    {showError && (
                        <Text style={themedStyles.errorText}>
                            {t("ratingModal.selectRatingError")}
                        </Text>
                    )}

                    {/* Close Button - Hide when submitting */}
                    {!isSubmitting && (
                        <Pressable onPress={onClose} style={themedStyles.closeButton}>
                            <View style={themedStyles.closeButtonInner}>
                                <X width={38} height={38} />
                            </View>
                        </Pressable>
                    )}

                    {/* Submit Button */}
                    <View style={themedStyles.btnActionContainer}>
                        <SwitchButton
                            noWrap={true}
                            title={t("ratingModal.submit")}
                            colorOne="#EC6F9E"
                            colorTwo="#EC8B6A"
                            textStyle={{ color: theme.white, fontSize: 14 }}
                            onPress={handleSubmit}
                            btnSyle={{ width: 140 }}
                            disabled={isSubmitting}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default RatingModal;