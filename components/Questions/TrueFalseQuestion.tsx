import { GreenTickIcon, LetsStartStarIcon, RedCrossIcon } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { styles } from "@/styles/components/Questions/TrueFalseQuestion.style";
import { TrueFalseChallengeJson } from "@/types/questions";
import { getLanguageFromSubject, TRUE_FALSE_LABELS } from "@/utils/subjectHelpers";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";

interface TrueFalseQuestionProps {
  question: TrueFalseChallengeJson;
  onAnswer: (answer: boolean) => void;
  selectedAnswer: boolean | null;
  subjectName: string
  userWasCorrect?: boolean | null;
  showCorrectAnswer?: boolean;
  isDisabled?: boolean;
}

const TrueFalseQuestion = ({
  question,
  onAnswer,
  subjectName,
  selectedAnswer,
  userWasCorrect = null,
  showCorrectAnswer = false,
  isDisabled = false // Add this with default
}: TrueFalseQuestionProps) => {
  const theme = useTheme();
  const themedStyles = styles(theme);


 

  const language = getLanguageFromSubject(subjectName);
  const labels = TRUE_FALSE_LABELS[language];
  const isRTL = labels.isRTL;

  const options = [
    { label: labels.true, value: true, colors: ["#A991D2", "#F7C0E9"] as const },
    { label: labels.false, value: false, colors: ["#EC6F9E", "#EC8B6A"] as const },
  ];

  return (
    <View style={[
      themedStyles.optionsContainer,
      isRTL && { flexDirection: "row-reverse" },
    ]}>
      {options.map((option) => {
        const isActuallyCorrect = option.value === question.answer;
        const isUserSelection = selectedAnswer === option.value;

        const shouldShowTick = userWasCorrect === true &&
          isUserSelection &&
          isActuallyCorrect;

        const shouldShowCross = userWasCorrect === false &&
          isUserSelection &&
          !isActuallyCorrect;

        return (
          <TouchableOpacity
            key={option.label}
            onPress={() => {
              // Only allow answering if not disabled
              if (!isDisabled) {
                onAnswer(option.value);
              }
            }}
            style={themedStyles.optionButton}
            activeOpacity={isDisabled ? 1 : 0.8} // No opacity change when disabled
            disabled={isDisabled} // Disable touch when disabled
          >
            <LinearGradient
              colors={option.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                themedStyles.optionGradient,
                isUserSelection && themedStyles.selectedOption,
                isDisabled && themedStyles.disabledOption, // Add disabled style
              ]}
            >
              <Image
                source={LetsStartStarIcon}
                style={[
                  themedStyles.starIcon,
                  isDisabled && themedStyles.disabledIcon, // Add disabled icon style
                ]}
              />
              <Text
                style={[
                  themedStyles.optionText,
                  isRTL && { textAlign: "right" },
                  isDisabled && themedStyles.disabledText,
                ]}
              >
                {option.label}
              </Text>


              {/* Show tick on user's correct selection */}
              {shouldShowTick && (
                <View style={[
                  themedStyles.correctIndicator,
                ]}>
                  <Image source={GreenTickIcon} style={{ width: 20, height: 20 }} />
                </View>
              )}

              {/* Show cross on user's wrong selection */}
              {shouldShowCross && (
                <View style={[
                  themedStyles.incorrectIndicator,
                ]}>
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

export default TrueFalseQuestion;