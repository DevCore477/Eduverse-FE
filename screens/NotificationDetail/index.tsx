import { EMptyGreenTickIcon } from "@/assets/images";
import Header from "@/components/Header";
import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { markNotificationAsRead } from "@/services/push-notifications/notificationMutation";
import { styles } from "@/styles/screens/NotifcationDetail/index.style";
import { TNotificationDetainIntegrationFinalChallenge } from "@/types/questions";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function NotificationDetailScreen() {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const { t, isRTL } = useTranslation();
  const params = useLocalSearchParams();
  const { showLoader, hideLoader } = useOverlay();

  const notificationId = Array.isArray(params.notificationId)
    ? params.notificationId[0]
    : params.notificationId;
  const { mutate: markAsRead } = markNotificationAsRead();

  const pupilId =
    (Array.isArray(params.pupilId) ? params.pupilId[0] : params.pupilId) ?? "";
  const pupilName =
    (Array.isArray(params.pupilName)
      ? params.pupilName[0]
      : params.pupilName) ?? "";
  const questionId =
    (Array.isArray(params.questionId)
      ? params.questionId[0]
      : params.questionId) ?? "";

  const [questionData, setQuestionData] =
    useState<TNotificationDetainIntegrationFinalChallenge | null>(null);
  const [isPending, setIsPending] = useState(true);

  const fetchQuestion = useCallback(async () => {
    if (!pupilId || !questionId) {
      setIsPending(false);
      return;
    }
    setIsPending(true);
    try {
      const response = await axiosInstance.get(
        ENDPOINTS.journey.getLessonQuestionById(pupilId, questionId)
      );
      setQuestionData(response.data.data ?? null);
    } catch {
      setQuestionData(null);
    } finally {
      setIsPending(false);
    }
  }, [pupilId, questionId]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const requirements =
    questionData?.challengeJson?.writingTask?.requirements ?? [];
  const context = questionData?.challengeJson?.writingTask?.context ?? "";

  const reviewPoints =
    questionData?.challengeJson?.selfCorrectionGrid?.criteria?.map(
      (criteria) => {
        let name = "";
        let points = 0;

        // Check for points
        if (criteria.maxPoints) {
          points = criteria.maxPoints;
        } else if (criteria.points) {
          points = criteria.points;
        }

        // Check for description
        if (criteria.description) {
          name = criteria.description;
        } else if (criteria.indicators && criteria.indicators?.length > 0) {
          const filteredIndicators = criteria.indicators
            .map((indicator) => {
              return indicator
                .replace(/(\(\d+(\.\d+)? نُقْطَة\)|\d+(\.\d+)? نُقْطَة)/g, "")
                .trim(); // Regex to remove points with or without parentheses
            })
            .filter((indicator) => indicator?.length > 0);

          if (filteredIndicators?.length > 0) {
            name = filteredIndicators.join(", "); // Join the filtered indicators as a single string
          }
        }
        return { name, points };
      },
    ) ?? [];

  const formatPoints = (points: number) => {
    return points < 10 ? `0${points}` : `${points}`;
  };

  useEffect(() => {
    isPending ? showLoader() : hideLoader();
  }, [isPending, showLoader, hideLoader]);

  useEffect(() => {
    if (notificationId) {
      markAsRead(notificationId);
    }
  }, [notificationId ?? null, markAsRead]);

  return (
    <View style={themedStyles.container}>
      <Header
        isAllowedBack={true}
        backhref="/(default-bg)/(parent-bg)/notifications"
        showProgessBar={false}
        stepBarSide={1}
        isDefaultBG={true}
        isSettings={true}
        view={
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Text style={themedStyles.headerTitle}>{t("notificationDetail.arabicStudies")}</Text>
            <Text style={themedStyles.headerSubtitle}>
              {pupilName} {t("notificationDetail.writtenAssessment")}
            </Text>
          </View>
        }
      />
      <ScrollView
        style={{ flex: 1, gap: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 24 }}>
          <Text style={themedStyles.writingContext}>{context}</Text>
          <Text style={themedStyles.writingRequiredText}>{t("notificationDetail.required")}:</Text>
          <View style={{ justifyContent: "flex-start", gap: 16 }}>
            {requirements.map((req, index) => (
              <View key={index} style={themedStyles.writingRequiredRow}>
                <EMptyGreenTickIcon width={24} height={24} />
                <Text style={themedStyles.writingRequired}>{req}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ gap: 20, paddingBottom: 20, paddingTop: 20 }}>
          <Text style={themedStyles.taskReviewText}>{t("notificationDetail.taskReviewPoints")}</Text>
          <View style={{ gap: 12 }}>
            {reviewPoints.map((review, index) => (
              <View
                key={index}
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={themedStyles.reviewPointText}>
                  {formatPoints(review.points)} {t("notificationDetail.points")}
                </Text>
                <Text style={themedStyles.reviewNameText}>{review.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
