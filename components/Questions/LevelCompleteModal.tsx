import { CongratsBG, FeedbackBadge, X } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/components/Questions/LevelCompleteModal.style";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, Text, View } from "react-native";

interface LevelCompleteModalProps {
  visible: boolean;
  level: string;
  lesson:string
  isLesson: boolean
  onNextLevel: () => void;
  onClose: () => void;
}

const LevelCompleteModal = ({
  visible,
  level,
  lesson,
  isLesson,
  onNextLevel,
  onClose,
}: LevelCompleteModalProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const themedStyles = styles(theme);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const medalAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      medalAnims.forEach(anim => anim.setValue(0));

      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.stagger(
          100,
          medalAnims.map(anim =>
            Animated.spring(anim, {
              toValue: 1,
              tension: 40,
              friction: 5,
              useNativeDriver: true,
            })
          )
        ),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={themedStyles.overlay}>
        <Animated.View
          style={[
            themedStyles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Background SVG - fills entire modal */}
          <CongratsBG width={360} height={480} style={themedStyles.backgroundSvg} />

          {/* Close button */}
          <Pressable onPress={onClose} style={themedStyles.closeButton}>
            <View style={themedStyles.closeButtonInner}>
              <X width={38} height={38} />
            </View>
          </Pressable>

          {/* Medals */}
          <View style={themedStyles.medalsContainer}>
            {medalAnims.map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  themedStyles.medalWrapper,
                  index === 1 && themedStyles.centerMedal,
                  {
                    transform: [
                      { scale: anim },
                      {
                        translateY: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-10, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <FeedbackBadge width={index === 1 ? 120 : 50} height={index === 1 ? 120 : 60} />
              </Animated.View>
            ))}
          </View>

          {/* Message */}
          <Text style={themedStyles.congratsText}>{t("questions.congratulations")}</Text>
          <Text style={themedStyles.levelText}>{isLesson ? `${t("questions.levelCompleteLesson")} ${lesson} ${t("questions.levelCompleteAtLevel")} ${level}` : `${t("questions.levelCompleteLevelOnly")} ${level}`} </Text>

          {/* Next Level button */}
          <Pressable onPress={onNextLevel} >
            <LinearGradient
              colors={["#D87AFF", "#F7C0E9"]}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 1 }}
              style={themedStyles.nextButton}
            >
              <Text style={themedStyles.nextButtonText}>{t("questions.nextLevel")}</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default LevelCompleteModal;
