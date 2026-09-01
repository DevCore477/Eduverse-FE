import { LockIcon } from "@/assets/images"
import YellowProgressBar from "@/components/YellowProgressBar"
import { useTheme } from "@/hooks/use-theme"
import { useTranslation } from "@/hooks/use-translation"
import { styles } from "@/styles/components/InfoCard.style"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { Text, View } from "react-native"

interface InfoCardProps {
    title: string
    description: string
    icon: React.JSX.Element
    total?: number
    current?: number
    firstBgColor?: string
    secondBgColor?: string
    firstColor?: string
    secondColor?: string
    backgroundColor?: string
    hasUnlocked?: boolean
    isSubjectCard?: boolean
}

export default function InfoCard({
    title,
    description,
    icon,
    firstBgColor,
    secondBgColor,
    firstColor,
    secondColor,
    total,
    current,
    backgroundColor,
    hasUnlocked = true,
    isSubjectCard = false
}: InfoCardProps) {

    const theme = useTheme()
    const { isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL)

    const hasProgress =
        hasUnlocked &&
        typeof total === "number" &&
        typeof current === "number"

    const Content = (
        <>
            {firstColor && secondColor ? (
                <LinearGradient
                    colors={["transparent", firstColor, secondColor]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={themedStyles.pupilIconContainer}
                >
                    {icon}
                </LinearGradient>
            ) : (
                icon
            )}

            <View style={themedStyles.contentContainer}>
                <View style={themedStyles.textContainer}>
                    <View style={themedStyles.titleColumn}>
                        <Text style={themedStyles.titleText}>{title}</Text>
                        <Text style={themedStyles.descriptionText}>{description}</Text>
                    </View>

                    {!hasUnlocked && (
                        <View style={themedStyles.lockIconContainer}>
                            <LockIcon width={12} height={14} />
                        </View>
                    )}

                    {hasProgress && (
                        !isSubjectCard ? (
                            <Text style={themedStyles.numberText}>
                                {current < 10 ? current === 0 ? current : `0${current}` : current}
                            </Text>
                        ) : (
                            <Text style={themedStyles.numberText}>
                                {current}/{total}
                            </Text>
                        )
                    )}
                </View>

                {hasProgress && (
                    <YellowProgressBar percentageNumber={(current / total) * 100} />
                )}
            </View>
        </>
    )

    if (firstBgColor && secondBgColor) {
        return (
            <LinearGradient
                colors={[firstBgColor, secondBgColor]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={themedStyles.container}
            >
                {Content}
            </LinearGradient>
        )
    }

    if (backgroundColor) {
        return (
            <View style={[themedStyles.container, { backgroundColor }]}>
                {Content}
            </View>
        )
    }

    return null
}
