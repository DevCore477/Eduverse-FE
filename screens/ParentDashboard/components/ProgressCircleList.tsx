import ProgressCircle from "@/components/ProgressCircles";
import { Text, TextStyle, View, ViewStyle } from "react-native";

interface ProgressCircleProps {
    recentActivitiesContainerStyle: ViewStyle;
    textStyle: TextStyle
    progressCirclesStyle: ViewStyle
    progressInsight: {
        total: number;
        current: number;
        label: string;
        circleColor: string;
        circleActiveColor: string;
        textColor: string;
    }[]
    activityText: string
    screenWidth: number
    numCircles?: number
}

export default function ProgressCircleList({ activityText, screenWidth, progressInsight, recentActivitiesContainerStyle, textStyle, progressCirclesStyle, numCircles = 4 }: ProgressCircleProps) {

    return (
        <View style={recentActivitiesContainerStyle}>
            <Text style={textStyle}>{activityText}</Text>
            <View style={progressCirclesStyle}>
                {progressInsight.map((progress, index) => (
                    <ProgressCircle key={index} screenWidth={screenWidth} hasPercentage={true} numCircles={numCircles} total={progress.total} current={progress.current} circleActiveColor={progress.circleActiveColor} circleColor={progress.circleColor} label={progress.label} textColor={progress.textColor} />
                ))}
            </View>
        </View>
    )
}