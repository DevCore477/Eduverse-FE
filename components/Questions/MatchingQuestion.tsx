import { GreenTickIcon, LetsStartStarIcon, RedCrossIcon } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/components/Questions/MatchingQuestion.style";
import { MatchingChallengeJson } from "@/types/questions";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MatchingQuestionProps {
  question: MatchingChallengeJson;
  onAnswer: (answer: any) => void;
  selectedAnswer: Array<{ left: string, right: string }>;
  userWasCorrect?: boolean | null;
  showCorrectAnswer?: boolean;
  isDisabled?: boolean;
}

interface RightItem {
  id: number;
  text: string;
}

interface LeftItem {
  id: number;
  text: string;
}

const gradientColors = [
  ["#A991D2", "#F7C0E9"],
  ["#EC6F9E", "#EC8B6A"],
  ["#849530", "#C3DE45"],
] as const;

const MatchingQuestion = ({
  question,
  onAnswer,
  selectedAnswer,
  isDisabled = false,
  userWasCorrect = null,
  showCorrectAnswer = false,
}: MatchingQuestionProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const themedStyles = styles(theme);

  const content = question.content ? question.content.pairs : question.matchItems ? question.matchItems : [];
  const contentKey = JSON.stringify(content);

  // Create left items - keep ALL items, even with duplicate text
  const leftItems: LeftItem[] = useMemo(() => {
    return content.map((pair, index) => ({
      id: index,
      text: pair.left,
    }));
  }, [contentKey]);

  // Create right items - shuffle only once when content changes
  const rightItems: RightItem[] = useMemo(() => {
    const items = content.map((pair, index) => ({
      id: index,
      text: pair.right,
    }));
    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }, [contentKey]);

  // Store matches as leftId -> rightId mapping
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [selectedLeftId, setSelectedLeftId] = useState<number | null>(null);
  const isInitializedRef = useRef(false);
  const prevQuestionIdRef = useRef<number | null>(null);

  useEffect(() => {
    console.log(">>> MatchingQuestion: selectedAnswer:", selectedAnswer, "question.id:", question.id);
    
    // Only use selectedAnswer to initialize - don't reset on empty
    // This prevents reset when parent re-renders with empty array
  }, [selectedAnswer, question.id]);

  const handleLeftPress = (leftItem: LeftItem) => {
    if (isDisabled) return;
    setSelectedLeftId(prev => (prev === leftItem.id ? null : leftItem.id));
  };

  const handleRightPress = (rightItem: RightItem) => {
    if (isDisabled || selectedLeftId === null) return;

    const newMatches = { ...matches };

    // Remove any existing match for this right item
    Object.keys(newMatches).forEach(key => {
      const leftId = Number(key);
      if (newMatches[leftId] === rightItem.id) {
        delete newMatches[leftId];
      }
    });

    // Add new match
    newMatches[selectedLeftId] = rightItem.id;

    setMatches(newMatches);
    setSelectedLeftId(null);
  };

  const handleRemoveMatchByRightId = (rightId: number) => {
    if (isDisabled) return;

    const newMatches = { ...matches };

    Object.keys(newMatches).forEach(leftKey => {
      if (newMatches[Number(leftKey)] === rightId) {
        delete newMatches[Number(leftKey)];
      }
    });

    setMatches(newMatches);
  };

  const getMatchedText = (leftItem: LeftItem) => {
    const rightId = matches[leftItem.id];
    const rightItem = rightItems.find(item => item.id === rightId);
    return rightItem?.text ?? null;
  };

  const isRightMatched = (rightItem: RightItem) => {
    return Object.values(matches).includes(rightItem.id);
  };

  const handleSubmit = () => {
    if (isDisabled) return;

    // Convert matches back to answer format as an array of {left, right} pairs
    const answerArray = Object.entries(matches).map(([leftId, rightId]) => {
      const leftItem = leftItems.find(item => item.id === Number(leftId));
      const rightItem = rightItems.find(item => item.id === rightId);

      return {
        left: leftItem?.text || '',
        right: rightItem?.text || ''
      };
    });

    // Check the format of the correct answer in the question data
    const correctAnswer = question.answer;
    // console.log("Correct answer format:", typeof correctAnswer);

    if (Array.isArray(correctAnswer)) {
      // If correct answer is an array, send the answer as array
      // console.log("Sending answer as array format");
      onAnswer(answerArray);
    } else if (typeof correctAnswer === 'object' && correctAnswer !== null) {
      // If correct answer is an object, convert our array to object format
      // Backend expects: { question: sentence } e.g., { "Who is he?": "He is my cousin, Ahmed." }
      const answerObject: Record<string, string> = {};
      answerArray.forEach(pair => {
        // key = question (left), value = sentence (right)
        answerObject[pair.left] = pair.right;
      });
      onAnswer(answerObject);
    } else if (typeof correctAnswer === "string") {
      const formattedAnswer = answerArray
        .map(pair => `${pair.right}-${pair.left}`)
        .join(", ");
      onAnswer(formattedAnswer);
    } else {
      onAnswer(answerArray)
    }
  };

  const allMatched = Object.keys(matches).length === leftItems.length;

  return (
    <>
      <View style={themedStyles.columnsContainer}>
        {/* LEFT COLUMN */}
        <View style={themedStyles.column}>
          <Text style={themedStyles.columnTitle}>{t("questions.match")}</Text>

          {leftItems.map((leftItem, index) => {
            const matchedText = getMatchedText(leftItem);
            const gradient = gradientColors[index % gradientColors.length];

            return (
              <TouchableOpacity
                key={`left-${leftItem.id}`}
                onPress={() => handleLeftPress(leftItem)}
                disabled={isDisabled}
                activeOpacity={isDisabled ? 1 : 0.8}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <LinearGradient
                  colors={gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    themedStyles.optionGradient,
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
                  <Text style={themedStyles.itemText}>{leftItem.text}</Text>

                  {matchedText && (
                    <Text style={themedStyles.matchedText}>→ {matchedText}</Text>
                  )}

                  {showCorrectAnswer && userWasCorrect === true && (
                    <View style={themedStyles.correctIndicator}>
                      <Image source={GreenTickIcon} style={{ width: 20, height: 20 }} />
                    </View>
                  )}
                  {userWasCorrect === false && (
                    <View style={themedStyles.incorrectIndicator}>
                      <Image source={RedCrossIcon} style={{ width: 20, height: 20 }} />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RIGHT COLUMN */}
        <View style={themedStyles.column}>
          <Text style={themedStyles.columnTitle}>{t("questions.with")}</Text>

          {rightItems.map((rightItem, index) => {
            const gradient = gradientColors[index % gradientColors.length];
            const matched = isRightMatched(rightItem);

            return (
              <TouchableOpacity
                key={`right-${rightItem.id}`}
                onPress={() => handleRightPress(rightItem)}
                disabled={isDisabled || matched}
                activeOpacity={isDisabled ? 1 : 0.8}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <LinearGradient
                  colors={gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    themedStyles.optionGradient,
                    themedStyles.rightItem,
                    isDisabled && themedStyles.disabledOption,
                  ]}
                >
                  <Text style={themedStyles.itemText}>{rightItem.text}</Text>

                  {matched && !isDisabled && (
                    <TouchableOpacity
                      onPress={() => handleRemoveMatchByRightId(rightItem.id)}
                      style={themedStyles.removeButton}
                    >
                      <Text style={themedStyles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {!isDisabled && (
        <TouchableOpacity
          style={[
            themedStyles.submitButton,
            !allMatched && themedStyles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!allMatched}
        >
          <Text style={themedStyles.submitButtonText}>
            {t("questions.submitMatches")} ({Object.keys(matches).length}/{leftItems.length})
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default MatchingQuestion;