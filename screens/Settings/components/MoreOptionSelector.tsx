import {
    MoreGreenIcon,
    PickerDownIcon,
    PickerUpIcon,
    PrivacyPolicyGreenIcon,
    ReportABugGreenIcon,
    TermConditionGreenIcon
} from "@/assets/images"
import { useTheme } from "@/hooks/use-theme"
import { useTranslation } from "@/hooks/use-translation"
import { styles } from "@/styles/screens/Settings/components//MoreOptionsSelector.style"
import { safeNavigate } from "@/utils/safeNavigator"
import { usePathname, useRouter } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import {
    Animated,
    Pressable,
    Text,
    View
} from "react-native"

export default function MoreOptionsSelector() {
    const [open, setOpen] = useState(false)
    const theme = useTheme()
    const router = useRouter()
    const pathname = usePathname()
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, open, isRTL)


    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(-5)).current

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: open ? 1 : 0,
                duration: 300,
                useNativeDriver: true
            }),
            Animated.timing(slideAnim, {
                toValue: open ? 0 : -5,
                duration: 300,
                useNativeDriver: true
            })
        ]).start()
    }, [open])

    const MORE_OPTIONS = [
        {
            text: t("setting.more.privacy"),
            icon: PrivacyPolicyGreenIcon,
            onPress:() =>
                safeNavigate(router, pathname, {
                    pathname: "/(default-bg)/terms-and-condition",
                    params: { isPrivacy: "true" },
                })
        },
        {
            text: t("setting.more.terms"),
            icon: TermConditionGreenIcon,
               onPress:() =>
                safeNavigate(router, pathname, {
                    pathname: "/(default-bg)/terms-and-condition",
                    params: { isPrivacy: "false" },
                })
        },
        {
            text: t("setting.more.report"),
            icon: ReportABugGreenIcon,
            onPress: () => safeNavigate(router, pathname, "/(default-bg)/report-a-bug")
        }
    ]

    return (
        <>
            <Pressable
                style={themedStyles.languageRow}
                onPress={() => setOpen(!open)}
            >
                <View style={themedStyles.languageTextContainer}>
                    <MoreGreenIcon width={21} height={24} />
                    <Text style={themedStyles.languageText}>
                        {t("setting.more.text")}
                    </Text>
                </View>

                {open ? (
                    <PickerUpIcon width={12} height={8} />
                ) : (
                    <PickerDownIcon width={12} height={8} />
                )}
            </Pressable>

            {open && (
                <Animated.View
                    style={[
                        themedStyles.optionsContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    {MORE_OPTIONS.map(option => (
                        <Pressable
                            key={option.text}
                            style={themedStyles.optionRow}
                            onPress={option.onPress}
                        >
                            {React.createElement(option.icon, {
                                width: 21,
                                height: 24
                            })}
                            <Text style={themedStyles.optionText}>
                                {option.text}
                            </Text>
                        </Pressable>
                    ))}
                </Animated.View>
            )}
        </>
    )
}
