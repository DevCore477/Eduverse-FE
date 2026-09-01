import { GreenTickIcon, RedCrossIcon } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { styles } from "@/styles/components/Questions/FillBlankQuestion.style";
import { FillBlankChallengeJson } from "@/types/questions";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
interface FillBlankQuestionProps {
  question: FillBlankChallengeJson;
  onAnswer: (answer: string | string[]) => void;
  selectedAnswer: string[] | null;
  userWasCorrect?: boolean | null;
  showCorrectAnswer?: boolean;
  isDisabled?: boolean;
}

const FillBlankQuestion = ({
  question,
  onAnswer,
  selectedAnswer,
  isDisabled = false,
  userWasCorrect = null,
  showCorrectAnswer = false,
}: FillBlankQuestionProps) => {
  const theme = useTheme();
  const themedStyles = styles(theme);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Restore selected options from selectedAnswer
  useEffect(() => {
    if (selectedAnswer && selectedAnswer.length > 0 && !isDisabled) {
      setSelectedOptions(selectedAnswer);
    }
  }, [selectedAnswer, isDisabled]);

  const handleOptionPress = (option: string) => {
    if (isDisabled) return;
    
    const newSelected = selectedOptions.includes(option)
      ? selectedOptions.filter(o => o !== option)
      : [...selectedOptions, option];
    
    setSelectedOptions(newSelected);
    
    // Send as array since backend expects array format
    onAnswer(newSelected);
  };

  const gradientColors = [
    ["#A991D2", "#F7C0E9"] as const,
    ["#EC6F9E", "#EC8B6A"] as const,
    ["#49BC9E", "#00ADA7"] as const,
  ];

  return (
    <View style={themedStyles.optionsGrid}>
      {question.options.map((option, index) => {
        const isUserSelection = selectedOptions.includes(option);

        return (
          <TouchableOpacity
            key={`${option}-${index}`}
            onPress={() => handleOptionPress(option)}
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
              <Text style={[
                themedStyles.optionNumber,
                isDisabled && themedStyles.disabledText,
              ]}>
                {option}
              </Text>

              {isUserSelection && (
                <View style={themedStyles.correctIndicator}>
                  <Image source={GreenTickIcon} style={{ width: 20, height: 20 }} />
                </View>
              )}

              {isUserSelection && userWasCorrect === false && (
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

export default FillBlankQuestion;
