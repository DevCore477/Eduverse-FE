import { useTheme } from "@/hooks/use-theme";
import { styles } from "@/styles/components/StepBar.styles";
import React from "react";
import { View } from "react-native";

interface StepBarProps {
    side: number
}
export default function StepBar({ side }: StepBarProps) {
    const theme = useTheme();
    const isRight = side === 2;
    const themedStyles = styles(theme);
    return (
        <View style={themedStyles.container}>
            {/* Left Half */}
            <View
                style={[
                    themedStyles.half,
                    {
                        backgroundColor: isRight ? themedStyles.secondary.color : themedStyles.primary.color
                    },
                    !isRight && { // Left half rounded when side is LEFT (1)

                        borderTopRightRadius: themedStyles.border.borderTopRightRadius,
                        borderBottomRightRadius: themedStyles.border.borderBottomRightRadius
                    }
                ]}
            />
            {/* Right Half */}
            <View
                style={[
                    themedStyles.half,
                    {
                        backgroundColor: isRight ? themedStyles.primary.color : themedStyles.secondary.color
                    },
                    isRight && { // Right half rounded when side is RIGHT (2)
                        borderTopLeftRadius: themedStyles.border.borderTopLeftRadius,
                        borderBottomLeftRadius: themedStyles.border.borderBottomLeftRadius
                    }
                ]}
            />
        </View>
    );
}