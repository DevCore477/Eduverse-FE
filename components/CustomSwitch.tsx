import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

interface CustomSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

const TRACK_WIDTH = 38;
const TRACK_PADDING = 4;
const THUMB_SIZE = 16;

const MAX_TRANSLATE =
    TRACK_WIDTH - TRACK_PADDING * 2 - THUMB_SIZE;

export function CustomSwitch({ value, onValueChange }: CustomSwitchProps) {
    const translateX = useRef(
        new Animated.Value(value ? MAX_TRANSLATE : 0)
    ).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: value ? MAX_TRANSLATE : 0,
            duration: 180,
            useNativeDriver: true
        }).start();
    }, [value]);

    return (
        <Pressable
            onPress={() => onValueChange(!value)}
            style={[
                styles.track,
                { backgroundColor: value ? "#22C55E" : "#F1F1F5" }
            ]}
        >
            <Animated.View
                style={[
                    styles.thumb,
                    { transform: [{ translateX }] }
                ]}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    track: {
        width: TRACK_WIDTH,
        height: 20,
        borderRadius: 20,
        padding: TRACK_PADDING,
        justifyContent: "center"
    },
    thumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE,
        backgroundColor: "#fff"
    }
});
