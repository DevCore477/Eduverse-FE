import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";

interface ButtonProps {
    text: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    onPress: () => void;
    isGradient?: boolean;
}

export default function Button({ text, style, textStyle, onPress, isGradient = false }: ButtonProps) {
    return (
        isGradient ? (
            <LinearGradient
                colors={['#00AC56', '#00743A']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={style}
            >
                <Pressable onPress={onPress} style={{
                    flex: 1,
                    width: "100%",
                    borderRadius: 10,
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Text style={textStyle}>{text}</Text>
                </Pressable>
            </LinearGradient>
        ) : (
            <Pressable onPress={onPress} style={style}>
                <Text style={textStyle}>{text}</Text>
            </Pressable>
        )
    );
}
