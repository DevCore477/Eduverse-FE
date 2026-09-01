import { useTheme } from "@/hooks/use-theme"
import { styles } from "@/styles/screens/PupilDetail/components/progressCircle"
import React from "react"
import { Text, View } from "react-native"
import Svg, { Circle } from "react-native-svg"

interface ProgressCircleProps {
  total: number
  current: number
  circleColor: string
  circleActiveColor: string
  label: string
  textColor: string
  hasPercentage?: boolean
  screenWidth: number
  numCircles?: number

}

export default function ProgressCircle({
  total,
  current,
  circleColor,
  circleActiveColor,
  label,
  textColor,
  hasPercentage = false,
  screenWidth,
  numCircles = 4
}: ProgressCircleProps) {
  const theme = useTheme();
  const size = screenWidth/numCircles - 16
  const themedStyles = styles(theme,size);

  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(current / total, 1)
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <View style={themedStyles.container}>
      <Svg width={size+2} height={size+2}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={circleColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={circleActiveColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={themedStyles.centerContent}>
        <Text style={themedStyles.label}>{label}</Text>
        <Text style={[themedStyles.value, { color: textColor }]}>{current}{hasPercentage && "%"}</Text>
      </View>
    </View>
  )
}


