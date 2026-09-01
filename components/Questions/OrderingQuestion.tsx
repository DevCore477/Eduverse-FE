import { GreenTickIcon, RedCrossIcon } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { styles } from "@/styles/components/Questions/OrderingQuestion.style";
import { OrderingChallengeJson } from "@/types/questions";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface OrderingQuestionProps {
  question: OrderingChallengeJson;
  onAnswer: (answer: string[]) => void;
  selectedAnswer: string[] | null;
  isDisabled?: boolean;
  userWasCorrect?: boolean | null;
  showCorrectAnswer?: boolean;
}

const gradientColors = [
  ["#A991D2", "#F7C0E9"],
  ["#EC6F9E", "#EC8B6A"],
  ["#849530", "#C3DE45"],
] as const;

const OrderingQuestion = ({
  question,
  onAnswer,
  selectedAnswer,
  isDisabled = false,
  userWasCorrect = null,
  showCorrectAnswer = false,
}: OrderingQuestionProps) => {
  const theme = useTheme();
  const themedStyles = styles(theme);

  console.log("ordering question is ", JSON.stringify(question, null, 2))
  const [orderedItems, setOrderedItems] = useState<string[]>([
    ...question?.content?.items || [],
  ]);

  // Initialize with selectedAnswer if provided
  useEffect(() => {
    if (Array.isArray(selectedAnswer)) {
      setOrderedItems(selectedAnswer);
    }
  }, [selectedAnswer]);

  // Reset on retry
  useEffect(() => {
    if (selectedAnswer === null) {
      setOrderedItems([...question?.content?.items || []]);
    }
  }, [selectedAnswer, question?.content?.items]);

  const moveItem = (index: number, direction: "up" | "down") => {
    if (isDisabled) return;

    const newOrder = [...orderedItems];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      [newOrder[index], newOrder[targetIndex]] = [
        newOrder[targetIndex],
        newOrder[index],
      ];
      setOrderedItems(newOrder);
    }
  };

  const handleSubmit = () => {
    if (isDisabled) return;
    onAnswer(orderedItems);
  };

  return (
    <View style={{alignItems:"center"}}>
      <View style={themedStyles.itemsContainer}>
        {orderedItems.map((item, index) => {
          const gradient = gradientColors[index % gradientColors.length];

          return (
            <LinearGradient
              key={`${item}-${index}`}
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                themedStyles.itemRow,
                isDisabled && themedStyles.disabledItem,
              ]}
            >
              {/* LEFT CONTENT */}
              <View style={themedStyles.itemContent}>
                <View style={themedStyles.orderNumber}>
                  <Text style={themedStyles.orderNumberText}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={themedStyles.itemText}>
                  {item}
                </Text>
              </View>

              {/* CONTROLS */}
              <View style={themedStyles.controls}>
                <TouchableOpacity
                  onPress={() => moveItem(index, "up")}
                  disabled={index === 0 || isDisabled}
                  activeOpacity={isDisabled ? 1 : 0.8}
                  style={[
                    themedStyles.controlButton,
                    (index === 0 || isDisabled) &&
                    themedStyles.controlButtonDisabled,
                  ]}
                >

                  <Ionicons
                    name="chevron-up"
                    size={24}
                    color={
                      index === 0 || isDisabled
                        ? theme.placeHolderText
                        : theme.primary
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => moveItem(index, "down")}
                  disabled={index === orderedItems.length - 1 || isDisabled}
                  activeOpacity={isDisabled ? 1 : 0.8}
                  style={[
                    themedStyles.controlButton,
                    (index === orderedItems.length - 1 || isDisabled) &&
                    themedStyles.controlButtonDisabled,
                  ]}
                >
                  <Ionicons
                    name="chevron-down"
                    size={24}
                    color={
                      index === orderedItems.length - 1 || isDisabled
                        ? theme.placeHolderText
                        : theme.primary
                    }
                  />
                </TouchableOpacity>
              </View>

              {/* RIGHT INDICATOR */}
              <View style={themedStyles.indicatorContainer}>
                {(isDisabled && userWasCorrect) &&
                  <Image source={GreenTickIcon} style={themedStyles.indicatorIcon} />}
                {(!isDisabled && userWasCorrect === false) &&
                  <Image source={RedCrossIcon} style={themedStyles.indicatorIcon} />}
              </View>
            </LinearGradient>
          );
        })}
      </View>

      {/* SUBMIT BUTTON */}
      {!isDisabled && (
        <TouchableOpacity
          style={themedStyles.submitButton}
          onPress={handleSubmit}
          activeOpacity={isDisabled ? 1 : 0.8}
          disabled={isDisabled}
        >
          <Text style={themedStyles.submitButtonText}>
            Submit
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OrderingQuestion;
