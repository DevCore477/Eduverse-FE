import { PupilOneIconSvg } from "@/assets/images"; // Assuming PupilOneIcon is an SVG component
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

interface LevelStartProps {
  size?: number;
}

const LevelStart: React.FC<LevelStartProps> = ({ size = 64 }) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme === "dark" ? "dark" : "light"];

  // Create animated value for glow effect
  const glowAnimation = useRef(new Animated.Value(0.3)).current;

  // Start glow animation on mount
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 0.8,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0.3,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
  }, []);

  return (
    <View
    >
      <Animated.View
        style={[
          styles.glowContainer,
          {
            opacity: glowAnimation,
            shadowOpacity: glowAnimation.interpolate({
              inputRange: [0.3, 0.8],
              outputRange: [0.4, 0.8],
            }),
            shadowRadius: glowAnimation.interpolate({
              inputRange: [0.3, 0.8],
              outputRange: [size / 2, size / 1.5],
            }),
            elevation: 8,
          },
        ]}
      >
        <PupilOneIconSvg
          width={size} // Set the size based on passed 'size' prop
          height={size} // Set the size based on passed 'size' prop
        />
      </Animated.View>
    </View>
  );
};

export default LevelStart;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  glowContainer: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#FFD203',
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
