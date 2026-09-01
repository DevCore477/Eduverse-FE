import { useTheme } from "@/hooks/use-theme";
import { styles } from "@/styles/components/Questions/TagButton.style";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Pressable, Text } from "react-native";

interface TagButtonProps {
    onPress: () => void;
    text: string;
    gradientColors: readonly [string, string];
    isDisable?: boolean
    icon?: any
}

const TagButton = ({ onPress, text, gradientColors, isDisable = false, icon }: TagButtonProps) => {
    const screenWidth = Dimensions.get('window').width;
    const btnWidth = screenWidth / 3 * 0.85
    const theme = useTheme()
    const themedStyles = styles(theme, btnWidth);

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisable}
            style={({ pressed }) => [
                {
                    opacity: pressed ? 0.8 : 1,
                }
            ]}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 1 }}
                style={[
                    themedStyles.btnContainer,
                ]}
            >
                {icon && <Image source={icon} style={{ width: 20, height: 20 }} />}
                <Text style={[
                    themedStyles.btnText,
                ]}>
                    {text}
                </Text>
            </LinearGradient>
        </Pressable>
    );
};

export default TagButton;