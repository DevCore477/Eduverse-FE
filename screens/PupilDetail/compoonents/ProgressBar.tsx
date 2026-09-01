import React from "react"
import { StyleSheet, Text, View } from "react-native"

interface ProgressBarProps {
  lable: string
  color: string
  percentageNumber: number
}

export default function ProgressBar({
  lable,
  color,
  percentageNumber
}: ProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color }]}>{lable}</Text>
        <Text style={styles.percent}>
          {percentageNumber}%
        </Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.progress,
            {
              width: `${percentageNumber}%`,
              backgroundColor: "#00AC56"
            }
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 12
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },
  label: {
    fontSize: 14,
  },
  percent: {
    fontSize: 14,
    color: "#00AC56",
    marginRight:7
  },
  track: {
    height: 12,
    backgroundColor: "#E0DFF1",
    borderRadius: 8,
    overflow: "hidden"
  },
  progress: {
    height: "100%",
    borderRadius: 8
  }
})
