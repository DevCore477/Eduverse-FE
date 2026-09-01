import { useTheme } from "@/hooks/use-theme";
import { styles } from "@/styles/screens/OtpVerify/components/otpDisplay.style";
import { Text, TextStyle, View, ViewStyle } from "react-native";

interface OTPDisplayProps {
    value: string
    totalLength?: number
    style?: ViewStyle
    textStyle?:TextStyle
    dotStyle?:ViewStyle
}
export default function OTPDisplay({ value = "", totalLength = 6,style,textStyle ,dotStyle}: OTPDisplayProps) {
    const dots = Array.from({ length: totalLength });
    const theme = useTheme();
    const themedStyles = styles(theme);

    return (
        <View style={[themedStyles.container,style]}>
            {dots.map((_, index) => {
                const char = value[index];
                return (
                    <View key={index} style={themedStyles.item}>
                        {char ? (
                            <Text style={[themedStyles.char,textStyle]}>{char}</Text>
                        ) : (
                            <View style={[themedStyles.dot,dotStyle]} />
                        )}
                    </View>
                );
            })}
        </View>
    );
};

