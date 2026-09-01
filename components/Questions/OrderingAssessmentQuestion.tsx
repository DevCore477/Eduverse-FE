import { GreenTickIcon, InstructionIcon, RedCrossIcon, StarIcon, UpDownIcon, YellowHamburger } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { styles } from "@/styles/components/Questions/OrderingAssessmentQuestion.style";
import { TIntegrationOrderingChallengeJsonType2, TIntegrationOrderingNormalizedQuestion } from "@/types/questions";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
    DragEndParams,
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TagButton from "./TagButtons";

type OrderedItem = {
    id: string;
    text: string;
    gradientColors: readonly [string, string];
};

interface OrderingOptionProps {
    item: OrderedItem;
    drag: () => void;
    isActive: boolean;
    isDisabled: boolean
    userWasCorrect?: boolean | null;
}

function OrderingOption({ item, drag, isActive, isDisabled, userWasCorrect }: OrderingOptionProps) {
    return (
        <ScaleDecorator>
            <Pressable
                onLongPress={drag}
                style={{ marginVertical: 4 }}
                disabled={isActive}
            >
                <LinearGradient
                    colors={item.gradientColors}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{
                        paddingRight: 16,
                        paddingLeft: 56,
                        flexDirection: "row-reverse",
                        // flexDirection:"row",
                        borderRadius: 20,
                        // gap: 16,
                        height: 60,
                        alignItems: "center",
                        opacity: isActive ? 0.8 : 1,
                    }}
                >
                    <View style={{
                        gap: 16,
                        alignItems: "center",
                        flexDirection: "row-reverse",
                    }}>

                        <YellowHamburger width={20} height={14} />
                        <Text style={{
                            fontSize: 18,
                            color: "#fff",
                            textAlign: "right",
                            flex: 1,
                        }}>
                            {item.text}
                        </Text>
                    </View>
                    {(isDisabled && userWasCorrect) &&
                        <Image source={GreenTickIcon} style={{
                            width: 24,
                            height: 24,
                        }} />}
                    {(!isDisabled && userWasCorrect === false) &&
                        <Image source={RedCrossIcon} style={{
                            width: 24,
                            height: 24,
                        }} />}
                </LinearGradient>
            </Pressable>
        </ScaleDecorator>
    );
}

interface OrderingAssessmentQuestionProps {
    question: TIntegrationOrderingNormalizedQuestion | TIntegrationOrderingChallengeJsonType2;
    onAnswer: (answer: string[]) => void;
    isDisabled: boolean
    userWasCorrect?: boolean | null;
}

type TOrderAssessment = {
    type: string,
    context: string
    items: string[]
}

export default function OrderingAssessmentQuestion({ question, onAnswer, isDisabled, userWasCorrect }: OrderingAssessmentQuestionProps) {
    const theme = useTheme();
    const themedStyles = styles(theme);
    const gradientColors = [
        ["#A991D2", "#F7C0E9"] as const,
        ["#EC6F9E", "#EC6F9E"] as const,
        ["#FFD203", "#EC913F"] as const,
        ["#849530", "#C3DE45"] as const
    ];

    const assesmnet: TOrderAssessment = {
        type: "orderingTask" in question ? question.orderingTask.type : "ordering Task",
        context: "orderingTask" in question ? question.orderingTask.context : question.question,
        items: "orderingTask" in question ? question.orderingTask.items : question.content.items
    }

    // Initialize state with the items
    const [orderedItems, setOrderedItems] = useState<OrderedItem[]>(() => {
        return assesmnet.items.map((text, index) => ({
            id: index.toString(),
            text,
            gradientColors: gradientColors[index % gradientColors.length]
        }));
    });

    const handleDragEnd = ({ data }: DragEndParams<OrderedItem>) => {
        setOrderedItems(data);
    };

    const renderItem = ({ item, drag, isActive }: RenderItemParams<OrderedItem>) => {
        return (
            <OrderingOption
                item={item}
                drag={drag}
                isActive={isActive}
                isDisabled={isDisabled}
                userWasCorrect={userWasCorrect}
            />

        );
    };

    const handleSubmit = () => {
        // Extract just the text values in order
        const answer = orderedItems.map(item => item.text);
        console.log("order is ", answer)
        onAnswer(answer);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView style={themedStyles.optionsGrid}>
                <LinearGradient
                    colors={['#00AC56', '#00743A']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        elevation: 4,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        height: 60
                    }}
                >
                    <TagButton text="Medium" gradientColors={["#E28C0B", "#E28C0B"]} isDisable={true} onPress={() => { }} />
                    <TagButton text="10 Points" gradientColors={["#EC6F9E", "#EC8B6A"]} isDisable={true} onPress={() => { }} icon={StarIcon} />
                </LinearGradient>

                <View style={{ flex: 1, paddingHorizontal: 16, gap: 24 }}>

                    <Text style={themedStyles.orderingType}>{assesmnet.type}</Text>
                    <Text style={themedStyles.orderingText}>{assesmnet.context}</Text>

                    {/* Draggable List */}
                    <View style={{ flex: 1 }}>
                        <DraggableFlatList
                            data={orderedItems}
                            keyExtractor={(item) => item.id}
                            onDragEnd={handleDragEnd}
                            renderItem={renderItem}
                            contentContainerStyle={{
                                paddingVertical: 8,
                                paddingBottom: 16,
                                gap: 16,
                            }}
                            scrollEnabled={true}
                            dragHitSlop={{ left: -50, right: -50 }}
                            activationDistance={10}

                        />
                    </View>

                    <View style={themedStyles.swipeContainer}>
                        <Image source={InstructionIcon} style={{ width: 24, height: 24 }} />
                        <Text style={themedStyles.swipeText}>اسحب للطلب</Text>
                        <UpDownIcon width={18} height={20} />
                    </View>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        activeOpacity={isDisabled ? 1 : 0.8}
                        disabled={isDisabled}
                    >
                        <LinearGradient
                            colors={
                                isDisabled
                                    ? ['#E0E0E0', '#BDBDBD'] // disabled colors
                                    : ['#FFDE3C', '#DAB500'] // active colors
                            }
                            start={{ x: 1, y: 1 }}
                            end={{ x: 0, y: 1 }}
                            style={themedStyles.checkButton}
                        >
                            <Text
                                style={[
                                    themedStyles.checkButtonText,
                                    isDisabled && { color: '#8E8E8E' },
                                ]}
                            >
                                Check
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
}