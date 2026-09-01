import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function RotatingDotsLoader({
  size = 100,
  dotSize = 20,
  color = "#00aa55",
  innerColor = "#00aa55",
  duration = 1500,
}) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const radius = size / 2 - dotSize / 2;
  const dots = [...Array(8).keys()];

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          { width: size, height: size, position: "absolute" },
          containerStyle,
        ]}
      >
        {dots.map((_, i) => {
          // ⬇️ Scale dot size from largest → smallest
          const scaleFactor = 1 - i * (1 / dots.length); // from 1 to 0

          const currentDotSize = dotSize * scaleFactor;
          const borderWidth = 2 * scaleFactor; // optional smoother border
          const borderClr = color;

          const angle = (i * 45 * Math.PI) / 180;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <View
              key={i}
              style={{
                width: currentDotSize,
                height: currentDotSize,
                borderRadius: currentDotSize / 2,
                backgroundColor: innerColor,
                position: "absolute",
                top: size / 2 + y - currentDotSize / 2,
                left: size / 2 + x - currentDotSize / 2,
                borderWidth,
                borderColor: borderClr,
                opacity: scaleFactor, // fade out small dots smoothly
              }}
            />
          );
        })}
      </Animated.View>
    </View>
  );
}
