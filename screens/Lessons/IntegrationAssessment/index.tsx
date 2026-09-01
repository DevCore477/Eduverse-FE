import Header from "@/components/Header";
import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import type { RootState } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/screens/Lessons/IntegrationAssessment/index.style";
import { safeNavigate } from "@/utils/safeNavigator";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function IntegrationAssessmentScreen() {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const router = useRouter();
  const pathname = usePathname()
  const { showLoader, hideLoader } = useOverlay();

  // Get params
  const levelId =
    (Array.isArray(params.levelId) ? params.levelId[0] : params.levelId) ?? "";
  const unitId =
    (Array.isArray(params.unitId) ? params.unitId[0] : params.unitId) ?? "";
  const levelNo =
    (Array.isArray(params.levelNo) ? params.levelNo[0] : params.levelNo) ?? "";
  const subjectId =
    (Array.isArray(params.subjectId) ? params.subjectId[0] : params.subjectId) ??
    "";
  const subjectName =
    (Array.isArray(params.subjectName)
      ? params.subjectName[0]
      : params.subjectName) ?? "";
  const lessonId =
    (Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId) ??
    "";
  const lessonNo = (Array.isArray(params.lessonNo) ? params.lessonNo[0] : params.lessonNo) ?? "";

  const isFromMap =
    (Array.isArray(params.isFromMap)
      ? params.isFromMap[0]
      : params.isFromMap) === "true";

  // Get pupil ID
  const pupil = useAppSelector((s: RootState) => s.activePupil.pupil);
  const pupilId = pupil?.id ?? "";

  // Validate pupilId
  const isValidUUID = (str: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };
  const validPupilId = pupilId && isValidUUID(pupilId) ? pupilId : null;

  const handleBack = () => {
    safeNavigate(router, pathname, {
      pathname: "/(default-bg)/(pupil-bg)/(with-nav)/lesson-grid",
      params: {
        lessonId,
        subjectId,
        lessonNo,
        subjectName,
        pupilId,
        levelNo,
        levelId,
        unitId,
        isFromMap: isFromMap ? "true" : "false"
      },
    }, "replace");
  }

  useBackButtonHandler({ onBackPress: handleBack })

  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch integration assessment data
  useEffect(() => {
    if (!validPupilId || !lessonId) {
      console.log("Missing required params:", {
        validPupilId,
        lessonId,
      });
      return;
    }

    const fetchAssessmentData = async () => {
      try {
        setIsLoading(true);
        showLoader();

        const url = ENDPOINTS.journey.getIntegrations
          .replace(":pupil_id", validPupilId)
          .replace(":lesson_id", lessonId);

        console.log("Fetching integration assessment from URL:", url);
        console.log("Parameters - pupilId:", validPupilId, "lessonId:", lessonId);

        const response = await axiosInstance.get(url);

        console.log("Integration Assessment Response:", response.data);
        setAssessmentData(response.data);
        hideLoader();
      } catch (error: any) {
        console.error("Error fetching integration assessment:", error);
        console.error("Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });

        const errorMessage = error.response?.data?.message ||
          error.response?.data?.error ||
          `Failed to load assessment (${error.response?.status || 'Unknown error'})`;
        setError(errorMessage);
        hideLoader();
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessmentData();
  }, [validPupilId, lessonId, showLoader, hideLoader]);

  // const handleDone = () => {
  //   // Navigate back or to next step
  //   handleBack()
  // };

  return (
    <View style={themedStyles.container}>
      <Header
        isAllowedBack={true}
        showProgessBar={false}
        stepBarSide={1}
        isSettings={true}
        isDefaultBG={false}
        backIconColor="#FFFFFF"
        containerStyle={{ paddingHorizontal: 16 }}
        onBackPressed={handleBack}
        view={
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Text style={themedStyles.headerTitle}>{t("integrationAssessment.headerTitle")}</Text>
            {subjectName && (
              <Text style={themedStyles.headerSubtitle}>{subjectName}</Text>
            )}
          </View>
        }
      />

      <ScrollView
        style={themedStyles.scrollView}
        contentContainerStyle={themedStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={themedStyles.loadingContainer}>
            <Text style={themedStyles.loadingText}>{t("integrationAssessment.loadingAssessment")}</Text>
          </View>
        ) : error ? (
          <View style={themedStyles.loadingContainer}>
            <Text style={themedStyles.loadingText}>Error: {error}</Text>
            <TouchableOpacity
              style={[themedStyles.doneButton, { marginTop: 20, alignSelf: "center" }]}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Text style={themedStyles.doneButtonText}>{t("integrationAssessment.goBack")}</Text>
            </TouchableOpacity>
          </View>
        ) : assessmentData ? (
          <View>
            {/* Title Section */}
            <View style={themedStyles.titleSection}>
              <Text style={themedStyles.titleText}>
                {assessmentData.title || "Integration Assessment"}
              </Text>
              <Text style={themedStyles.descriptionText}>
                {assessmentData.description || "Complete this assessment to continue"}
              </Text>
            </View>

            {/* Questions Section */}
            <View style={themedStyles.questionsBox}>
              <View style={themedStyles.questionsHeader}>
                <Text style={themedStyles.questionsTitle}>{t("integrationAssessment.questions")}</Text>
                <Text style={themedStyles.starEmoji}>⭐</Text>
              </View>

              <ScrollView
                style={themedStyles.questionsScroll}
                showsVerticalScrollIndicator={true}
                scrollIndicatorInsets={{ right: 2 }}
              >
                <View style={themedStyles.questionsContent}>
                  {assessmentData.questions && Array.isArray(assessmentData.questions) ? (
                    assessmentData.questions.map(
                      (question: any, index: number) => (
                        <View key={index} style={themedStyles.questionItem}>
                          <Text style={themedStyles.questionText}>
                            {`${index + 1}. ${question.text || question.title || ""}`}
                          </Text>
                          {question.options && Array.isArray(question.options) && (
                            <View style={themedStyles.optionsContainer}>
                              {question.options.map((option: any, optIndex: number) => (
                                <TouchableOpacity
                                  key={optIndex}
                                  style={themedStyles.optionButton}
                                  activeOpacity={0.7}
                                >
                                  <Text style={themedStyles.optionText}>
                                    • {typeof option === "string" ? option : option.text}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        </View>
                      )
                    )
                  ) : (
                    <Text style={themedStyles.noQuestionsText}>
                      {assessmentData.content || "No questions available"}
                    </Text>
                  )}
                </View>
              </ScrollView>
            </View>

            {/* Done Button */}
            <TouchableOpacity
              style={[themedStyles.doneButton, { alignSelf: "center" }]}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              <Text style={themedStyles.doneButtonText}>{t("integrationAssessment.done")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={themedStyles.loadingContainer}>
            <Text style={themedStyles.loadingText}>{t("integrationAssessment.noAssessmentData")}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
