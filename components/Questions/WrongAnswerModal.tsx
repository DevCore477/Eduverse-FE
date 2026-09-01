import {
  SadBG,
  SkipIcon,
  ThreeSadStarsImage,
  TryAgainArrow,
} from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/components/Questions/WrongAnswerModal.style";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Image, Modal, Pressable, Text, View } from "react-native";

interface WrongAnswerModalProps {
  visible: boolean;
  hint: string;
  onRetry: () => void;
  onSkip: () => void;
  onRenew: () => void;
  isAttemptsFinished: boolean;
  isNoCorrectAnswerWarning?: boolean; // New prop for warning about no correct answers
}

const WrongAnswerModal = ({
  visible,
  hint,
  onRetry,
  onSkip,
  onRenew,
  isAttemptsFinished,
  isNoCorrectAnswerWarning = false,
}: WrongAnswerModalProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const themedStyles = styles(
    theme,
    isAttemptsFinished,
    isNoCorrectAnswerWarning,
  );
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onRetry}
    >
      <View style={themedStyles.overlay}>
        {/* Three sad stars at the top */}
        <View style={themedStyles.topStarContainer}>
          <Image source={ThreeSadStarsImage} />
        </View>

        {/* Main Modal Container */}
        <Animated.View
          style={[
            themedStyles.modalContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Background SVG */}
          <SadBG width={340} height={480} style={themedStyles.backgroundSvg} />

          {/* Message */}
          <View style={{ gap: 4 }}>
            <Text style={themedStyles.message}>
              {isNoCorrectAnswerWarning
                ? t("questions.needOneCorrectAnswer")
                : t("questions.notCorrectAnswer")}
            </Text>
            <Text style={themedStyles.tryAgainText}>
              {isNoCorrectAnswerWarning
                ? t("questions.startFromBeginning")
                : t("questions.tryAgain")}
            </Text>
          </View>

          {/* Hint section */}
          <View style={themedStyles.hintContainer}>
            {isNoCorrectAnswerWarning ||
              (isAttemptsFinished && (
                <Text style={themedStyles.hintLabel}>
                  {t("questions.hint")}
                </Text>
              ))}
            <Text style={themedStyles.hintText}>{hint}</Text>
          </View>

          <View style={themedStyles.btnContainer}>
            {/* Start Over/Retry button */}
            <Pressable
              onPress={isAttemptsFinished ? onRenew : onRetry}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <LinearGradient
                colors={
                  isNoCorrectAnswerWarning
                    ? ["#5670EC", "#07BAFE"]
                    : ["#D87AFF", "#F7C0E9"]
                }
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 1 }}
                style={themedStyles.button}
              >
                {!isNoCorrectAnswerWarning && (
                  <TryAgainArrow width={12} height={12} />
                )}
                <Text style={themedStyles.btnText}>
                  {isNoCorrectAnswerWarning
                    ? t("questions.startOver")
                    : isAttemptsFinished
                      ? t("questions.renew")
                      : t("questions.retry")}
                </Text>
              </LinearGradient>
            </Pressable>

            {/* Skip button - only show if not attempts finished and not warning modal */}
            {!isAttemptsFinished && !isNoCorrectAnswerWarning && (
              <Pressable
                onPress={onSkip}
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <LinearGradient
                  colors={["#EC6F9E", "#EC8B6A"]}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 0, y: 1 }}
                  style={themedStyles.button}
                >
                  <Text style={themedStyles.btnText}>
                    {t("questions.skip")}
                  </Text>
                  <SkipIcon width={12} height={12} />
                </LinearGradient>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default WrongAnswerModal;
