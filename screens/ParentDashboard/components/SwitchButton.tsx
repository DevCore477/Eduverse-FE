import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

interface SwitchButtonProps {
    title?: string
    colorOne?:string
    colorTwo?:string
    onPress?: () => void
    style?: ViewStyle
    textStyle?: TextStyle
    noWrap?: boolean
    btnSyle?:StyleProp<ViewStyle>
    disabled?:boolean
}

export const SwitchButton = ({
    title,
    colorOne="#C6C6C6",
    colorTwo="#9E9E9E",
    onPress,
    style,
    textStyle,
    noWrap = false,
    btnSyle,
    disabled=false
}: SwitchButtonProps) => {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                { opacity: pressed ? 0.8 : 1 },
                style,
            ]}
            disabled={disabled}
        >
            <LinearGradient
                colors={[colorOne, colorTwo]}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 1 }}
                style={[styles.button,btnSyle]}
            >
                <Text
                    style={[styles.text, textStyle]}
                    numberOfLines={noWrap ? 1 : undefined}
                >
                    {title}
                </Text>
            </LinearGradient>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    button: {
        width: 100,
        height: 39,
        borderRadius: 8,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    text: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FFFFFF',

    },
});
