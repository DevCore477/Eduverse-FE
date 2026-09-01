import { CongratsBG, WrtitngStarBG, WrtitngStarIcon, X } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/components/Questions/WritingAssesmentModal.style";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, Text, View } from "react-native";

interface WritingAssessmentModalProps {
  visible: boolean;
  onClose: () => void;
  onNext: () => void
}

const WritingAssessmentModal = ({
  visible,
  onClose,
  onNext
}: WritingAssessmentModalProps) => {
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
          <CongratsBG width={360} height={380} style={themedStyles.backgroundSvg} />

          {/* Close button */}
          <Pressable onPress={onClose} style={themedStyles.closeButton}>
            <View style={themedStyles.closeButtonInner}>
              <X width={38} height={38} />
            </View>
          </Pressable>

          <View style={{
            position: 'relative',
            width: 140,
            height: 140,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image
              source={WrtitngStarBG}
              style={{
                position: 'absolute',
                width: 110,
                height: 110,
                zIndex: 1
              }}
            />
            <Image
              source={WrtitngStarIcon}
              style={{
                position: 'absolute',
                width: 140,
                height: 140,
                zIndex: 2
              }}
            />

          </View>



          {/* Message */}
          <Text style={themedStyles.congratsText}>{t("questions.goodJob")}</Text>
          <Text style={themedStyles.levelText}>{t("questions.notificationSentToParent")}</Text>

          {/* Next Level button */}
          <Pressable onPress={onNext} >
            <LinearGradient
              colors={["#D87AFF", "#F7C0E9"]}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 1 }}
              style={themedStyles.nextButton}
            >
              <Text style={themedStyles.nextButtonText}>{t("questions.confirm")}</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default WritingAssessmentModal;
