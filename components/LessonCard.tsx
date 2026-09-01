import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface LessonCardComponentProps {
  isUnlocked: boolean;
  onPress: () => void;
  title: string;
  subjectName?: string;
  level?: string;
  showLevel?: boolean; // New prop to control level visibility
  IconName: keyof typeof Ionicons.glyphMap;
  SvgComponent: React.FC<any>;
  gradientColors: [string, string];
  style?: any;
  cardType?: "lesson_intro" | "lesson_video" | "final_journey"; // New prop for card type
}

const LessonCardComponent = ({
  isUnlocked,
  onPress,
  title,
  subjectName,
  level,
  showLevel = false, // Default to false
  IconName,
  SvgComponent,
  gradientColors,
  style,
  cardType,
}: LessonCardComponentProps) => {
  const theme = useTheme();

  // Determine gradient colors based on card type using theme
  const getGradientColors = () => {
    if (!isUnlocked) return theme.gradients.locked;

    switch (cardType) {
      case "lesson_intro":
        return theme.gradients.lessonIntro;
      case "lesson_video":
        return theme.gradients.lessonVideo;
      case "final_journey":
        return theme.gradients.finalJourney;
      default:
        return gradientColors;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        console.log("LessonCard pressed:", { title, isUnlocked });
        onPress();
      }}
      disabled={!isUnlocked}
      activeOpacity={0.8}
      style={style}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={cardType === "final_journey" ? { x: 1, y: 1 } : { x: 1, y: 0 }}
      >
        {/* Icon with padlock overlay */}
        {cardType !== "final_journey" && (
          <View style={styles.iconContainerWithLock}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={IconName}
                size={24}
                color="rgba(255,255,255,0.8)"
              />
            </View>

            {/* Padlock overlay - positioned over icon */}
            {!isUnlocked && (
              <View style={styles.lockOverlay}>
                <Ionicons name="lock-closed" size={24} color="white" />
              </View>
            )}
          </View>
        )}

        {/* Subject Name */}
        {subjectName && cardType !== "final_journey" && (
          <View style={styles.subjectContainer}>
            <Text style={styles.subjectText}>{subjectName}</Text>
          </View>
        )}

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              cardType === "final_journey" ? { fontSize: 22 } : {},
            ]}
          >
            {title}
          </Text>
        </View>

        {/* SVG / Emoji */}
        <View style={styles.emojiContainer}>
          <SvgComponent
            width={cardType === "final_journey" ? 150 : 110}
            height={cardType === "final_journey" ? 150 : 110}
          />
        </View>

        {/* Level Badge - Only show on final_journey card */}
        {level && showLevel && (
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{level}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: screenWidth * 0.44, // 44% of screen width
    height: screenWidth * 0.65, // 60% of screen width (adjust as needed)
    borderRadius: 20,
    padding: 16,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
    position: "relative",
  },
  iconContainerWithLock: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  subjectContainer: {
    marginTop: 4,
  },
  subjectText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  titleContainer: {
    marginTop: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
  },
  emojiContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  levelBadge: {
    alignItems: "flex-end",
    position: "absolute",
    bottom: 10,
    right: 20,
  },
  levelText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
});

export default LessonCardComponent;
