import { InstructionIcon, YellowTickIcon } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/components/Questions/WritingAssessmentQuestion.style";
import { TIntegrationWritingNormalizedQuestion } from "@/types/questions";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, Text, View } from "react-native";

interface WritingAsessmentQuestionProps {
    question: TIntegrationWritingNormalizedQuestion
    onAnswer: (answer: string) => void
}

const WritingAsessmentQuestion = ({
    question,
    onAnswer
}: WritingAsessmentQuestionProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const themedStyles = styles(theme);

    const requirements = question?.writingTask?.requirements || []
    return (
        <ScrollView contentContainerStyle={themedStyles.optionsGrid}>
            {/* <Text style={themedStyles.writingType}>{question.writingTask.type}</Text> */}
            <Text style={themedStyles.writingType}>{t("questions.writingTask")}</Text>
            <Text style={themedStyles.writingContext}>{question.writingTask.context}</Text>
            <Text style={themedStyles.writingRequiredText}>{t("notificationDetail.required")}:</Text>
            <View style={{ flex: 1, justifyContent: "flex-start",gap:2 }}>
                {requirements.map((req, index) => (
                    <View key={index} style={themedStyles.writingRequiredRow}>
                        <YellowTickIcon width={20} height={20} />
                        <Text style={themedStyles.writingRequired}>{req}</Text>
                    </View>
                ))}
            </View>
            <LinearGradient
                colors={['#A991D2', '#9c6c90ff']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={themedStyles.instructionContainer}>
                <LinearGradient
                    colors={['#A991D2', '#F7C0E9']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={themedStyles.instructionIconContainer}>
                    <Image source={InstructionIcon} style={{ width: 36, height: 36 }} />
                </LinearGradient>
                <Text style={themedStyles.instructionContainerHeading}>اكتب في دفترك!</Text>
                <Text style={themedStyles.instructionContainerText}>{question.writingTask.instruction}</Text>
            </LinearGradient>
            <Pressable onPress={() => { onAnswer("hiuhwidewh") }}>
                <LinearGradient
                    colors={["#FFDE3C", "#DAB500"]}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 1 }}
                    style={themedStyles.finishedButton}
                >
                    <Text style={themedStyles.finishedButtonText}>
                        Finished Writing
                    </Text>
                </LinearGradient>
            </Pressable>
        </ScrollView>
    );
};
export default WritingAsessmentQuestion;