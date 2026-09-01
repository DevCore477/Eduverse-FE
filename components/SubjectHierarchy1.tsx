import { IntegrationStar, StarsEarned } from "@/assets/images";
import { useTranslation } from "@/hooks/use-translation";
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
import { Circle, Svg } from "react-native-svg";

/* ---------------- SCREEN & LAYOUT ---------------- */
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GAP = 16;
const CONTAINER_PADDING = 0; // Set this to match your parent container's padding

// Calculate width for 2 cards in a row
// Total available width minus left/right padding, minus gap between cards
const CARD_WIDTH = (SCREEN_WIDTH - CONTAINER_PADDING * 2 - GAP * 3) / 2;

/* ---------------- TYPES ---------------- */
interface CardData {
  id: string;
  title: string;
  description?: string;
  gradientColors: [string, string];
  starsEarned?: number;
  iconName?: keyof typeof Ionicons.glyphMap;
  showStarEarned?: boolean;
  showIntegrationStar?: boolean;
  starProgress?: number;
  isLocked?: boolean;
}

interface SubjectHierarchy1Props {
  cards?: CardData[];
  onCardPress?: (cardId: string, isIntegration?: boolean) => void;
}

interface CircularProgressProps {
  size: number;
  progress: number;
  strokeWidth: number;
  backgroundColor: string;
  progressColor: string;
  children: React.ReactNode;
}

/* ---------------- CIRCULAR PROGRESS ---------------- */
const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  progress,
  strokeWidth,
  backgroundColor,
  progressColor,
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View
        style={{
          position: "absolute",
          top: strokeWidth,
          left: strokeWidth,
          width: size - strokeWidth * 2,
          height: size - strokeWidth * 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </View>
    </View>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
const SubjectHierarchy1: React.FC<SubjectHierarchy1Props> = ({
  cards,
  onCardPress,
}) => {
  const { t } = useTranslation();
  const handleCardPress = (cardId: string, isIntegration: boolean) => {
    onCardPress?.(cardId, isIntegration);
  };

  return (
    <View style={styles.container}>
      {cards?.map((card, index) => (
        <View
          key={card.id}
          style={[
            styles.cardWrapper,
            // Add marginRight to every first card in the pair
            index % 2 === 0 && styles.cardMarginRight,
          ]}
        >
          <TouchableOpacity
            onPress={() =>
              handleCardPress(card.id, card.title === "Integrations")
            }
            activeOpacity={0.85}
            style={styles.cardTouchable}
          >
            <LinearGradient
              colors={card.gradientColors}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Ionicons name="play" size={28} color="rgba(255,255,255,0.9)" />
              </View>

              {/* Text */}
              <View style={styles.textContainer}>
                <Text style={styles.title}>
                  {card.title === "Integrations"
                    ? `Unit 0${index + 1}`
                    : card.title.replace("_", " ")}
                </Text>

                {card.title === "Integrations" ? (
                  <>
                    <Text style={styles.integrationSubtitle}>
                      {t("subjectHierarchy.startWriting")}
                    </Text>
                    <Text style={styles.integrationTitle}>
                      {t("subjectHierarchy.integration")}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.starsLabel}>
                      {t("subjectHierarchy.starsEarned")}
                    </Text>
                    <Text style={styles.starsValue}>
                      {!card.starsEarned ? 0 : card.starsEarned}
                    </Text>
                  </>
                )}
              </View>

              {/* Star / Progress */}
              {card.title === "Integrations" ? (
                <View style={styles.integrationStarContainer}>
                  <IntegrationStar width={102} height={112} />
                </View>
              ) : (
                <View style={styles.starEarnedContainer}>
                  <CircularProgress
                    size={52}
                    progress={card.starProgress || 0}
                    strokeWidth={8}
                    backgroundColor="rgba(255,255,255,0.3)"
                    progressColor="#FFFFFF"
                  >
                    <StarsEarned width={24} height={24} />
                  </CircularProgress>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: CONTAINER_PADDING,
  },

  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: GAP,
  },

  cardMarginRight: {
    marginRight: GAP,
  },

  cardTouchable: {
    flex: 1,
  },

  card: {
    width: "100%",
    height: CARD_WIDTH, // square
    borderRadius: 20,
    padding: 16,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    alignItems: "flex-start",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },

  starsLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },

  starsValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },

  integrationSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },

  integrationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },

  starEarnedContainer: {
    position: "absolute",
    bottom: 14,
    right: 14,
  },

  integrationStarContainer: {
    position: "absolute",
    top: 50,
    right: 5,
  },
});

export default SubjectHierarchy1;
