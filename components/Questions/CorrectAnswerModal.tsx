import { HappyBGWithConfettiImage, SimpleOneStarImage, SimpleThreeStarsImage, SimpleTwoStarsImage, ThreeHappyStarsImage } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/components/Questions/CorrectAnswerModal.style";
import { ArrowRight } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, Image, Modal, Pressable, Text, View } from "react-native";

interface CorrectAnswerModalProps {
  visible: boolean;
  hint: string;
  onNext: () => void;
  stars?: number;
}

const CorrectAnswerModal = ({ visible, hint, onNext, stars = 1 }: CorrectAnswerModalProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const themedStyles = styles(theme);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  const getStarsComponent = () => {
    switch (stars) {
      case 1:
        // return <SimpleOneStar width={55} height={55} />;
        return <Image source={SimpleOneStarImage} style={{ height: 60, width: 120 }} />;
      case 2:
        // return <SimpleTwoStars width={100} height={55} />;
        return <Image source={SimpleTwoStarsImage} style={{ height: 60, width: 120 }}/>;
      case 3:
      default:
        // return <SimpleThreeStars width={140} height={55} />;
        return <Image source={SimpleThreeStarsImage} style={{ height: 60, width: 120 }} />;
    }
  };

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
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onNext}>
      <View style={themedStyles.overlay}>
        {/* Three happy stars at the top */}
        <View style={themedStyles.topStarContainer}>
          {/*<ThreeHappyStars width={150} height={100} />*/}
          <Image source={ThreeHappyStarsImage} />
        </View>

        {/* Main Modal Container */}
        <Animated.View
          style={[
            themedStyles.modalContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Background SVG */}
          <Image source={HappyBGWithConfettiImage} width={340} height={480} style={themedStyles.backgroundSvg} />

          {/* Simple stars row */}
          <View style={themedStyles.topContent}>
            {getStarsComponent()}
          </View>

          {/* Message */}
          <View style={{ gap: 14, justifyContent: "center", alignItems: "center" }}>
            <View>
              <Text style={themedStyles.message}>{t("questions.niceJobCorrect")}</Text>
              <Text style={themedStyles.congratsText}>{t("questions.congratulation")}</Text>
            </View>

            {/* Arrow button */}
            <Pressable onPress={onNext} style={themedStyles.arrowButton}>
              <ArrowRight size={50} color="#FFFFFF" strokeWidth={4} />
            </Pressable>

            {/* Hint text */}
            <Text style={themedStyles.hintText}>{hint}</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CorrectAnswerModal;
