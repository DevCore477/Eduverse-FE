import { GreenTickIcon, RedCrossIcon } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { styles } from "@/styles/components/Questions/ImageChoiceQuestion.style";
import { ImageChoiceChallengeJson } from "@/types/questions";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";

interface ImageChoiceQuestionProps {
  question: ImageChoiceChallengeJson;
  onAnswer: (answer: string) => void;
  selectedAnswer: string | null;
  isDisabled?: boolean;
  userWasCorrect?: boolean | null;
  showCorrectAnswer?: boolean;
}

const ImageChoiceQuestion = ({
  question,
  onAnswer,
  selectedAnswer,
  isDisabled = false,
  userWasCorrect = null,
  showCorrectAnswer = false
}: ImageChoiceQuestionProps) => {
  const theme = useTheme();
  const themedStyles = styles(theme);

  return (
    <View style={themedStyles.imagesContainer}>
      {question.content.images.map((image, index) => {
        // IMPORTANT: Check if answer is image.id or image.url
        // Typically, question.answer should be the image.id
        const isActuallyCorrect = image.id === question.answer;
        const isUserSelection = selectedAnswer === image.id;
        const isWrongSelection = isUserSelection && userWasCorrect === false;

        console.log("Image:", {
          id: image.id,
          url: image.url,
          questionAnswer: question.answer,
          isActuallyCorrect,
          isUserSelection,
          isWrongSelection,
          selectedAnswer,
          userWasCorrect,
          showCorrectAnswer
        });

        return (
          <TouchableOpacity
            key={image.id}
            onPress={() => {
              if (!isDisabled) {
                onAnswer(image.id);
              }
            }}
            style={themedStyles.imageButton}
            activeOpacity={isDisabled ? 1 : 0.8}
            disabled={isDisabled}
          >
            <View style={{ position: 'relative' }}>
              <LinearGradient
                colors={["#E0DFF1", "#E0DFF1"]}
                style={[
                  themedStyles.imageWrapper,
                  isUserSelection && themedStyles.selectedOption,
                  isDisabled && themedStyles.disabledOption,
                ]}
              >
                <Image
                  source={{ uri: image.url }}
                  style={themedStyles.image}
                  contentFit="contain"
                  transition={200}
                />
              </LinearGradient>

              {/* Show correct indicator (green tick) */}
              {showCorrectAnswer && isActuallyCorrect && (
                <View style={themedStyles.correctIndicator}>
                  <Image source={GreenTickIcon} style={{ width: 24, height: 24 }} />
                </View>
              )}

              {/* Show incorrect indicator (red cross) for wrong user selection */}
              {isWrongSelection && (
                <View style={themedStyles.incorrectIndicator}>
                  <Image source={RedCrossIcon} style={{ width: 24, height: 24 }} />
                </View>
              )}
            </View>
            <Text style={themedStyles.imageLabel}>Option {index + 1}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ImageChoiceQuestion;