import { GreenTickIcon, LetsStartStarIcon, RedCrossIcon } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { styles } from "@/styles/components/Questions/MultipleChoiceQuestion.style";
import { MultipleChoiceChallengeJson } from "@/types/questions";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceChallengeJson;
  onAnswer: (answer: string) => void;
  selectedAnswer: string | null;
  isDisabled?: boolean;
  userWasCorrect?: boolean | null;
  showCorrectAnswer?: boolean;
}

const MultipleChoiceQuestion = ({
  question,
  onAnswer,
  selectedAnswer,
  isDisabled = false,
  userWasCorrect = null,
  showCorrectAnswer = false
}: MultipleChoiceQuestionProps) => {
  const theme = useTheme();
  const themedStyles = styles(theme);

  console.log("multiple choice question is ", question)

  const gradientColors = [
    ["#A991D2", "#F7C0E9"] as const,
    ["#EC6F9E", "#EC8B6A"] as const,
    ["#49BC9E", "#00ADA7"] as const,
  ];

  return (
    <View style={themedStyles.optionsGrid}>
      {question.options.map((option, index) => {
        const isUserSelection = selectedAnswer === option;

        return (
          <TouchableOpacity
            key={`${option}-${index}`}
            onPress={() => {
              if (!isDisabled) {
                onAnswer(option);
              }
            }}
            style={themedStyles.optionButton}
            activeOpacity={isDisabled ? 1 : 0.8}
            disabled={isDisabled}
          >
            <LinearGradient
              colors={gradientColors[index % gradientColors.length]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                themedStyles.optionGradient,
                isUserSelection && themedStyles.selectedOption,
                isDisabled && themedStyles.disabledOption,
              ]}
            >
              <Image
                source={LetsStartStarIcon}
                style={[
                  themedStyles.starIcon,
                  isDisabled && themedStyles.disabledIcon,
                ]}
              />
              <Text style={[
                themedStyles.optionNumber,
                isDisabled && themedStyles.disabledText,
              ]}>
                {option}
              </Text>

              {(isUserSelection || question.answer === option) && userWasCorrect && (
                <View style={themedStyles.correctIndicator}>
                  <Image source={GreenTickIcon} style={{ width: 20, height: 20 }} />
                </View>
              )}

              {isUserSelection
                && userWasCorrect === false && (
                  <View style={themedStyles.incorrectIndicator}>
                    <Image source={RedCrossIcon} style={{ width: 20, height: 20 }} />
                  </View>
                )}
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default MultipleChoiceQuestion;