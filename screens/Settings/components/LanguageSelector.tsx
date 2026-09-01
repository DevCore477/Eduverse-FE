import {
  ArabicFlagIcon,
  EnglishFlagIcon,
  FrenchFlagIcon,
  PickerDownIcon,
  PickerUpIcon
} from "@/assets/images"
import { useTheme } from "@/hooks/use-theme"
import { useTranslation } from "@/hooks/use-translation"
import { useUpdateParent } from "@/services/parent/parentMutation"
import { RootState } from "@/store"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setLanguage } from "@/store/settingsSlice"
import { styles } from "@/styles/screens/Settings/components/LanguageSelector.style"
import React, { useEffect, useRef, useState } from "react"
import {
  Animated,
  Pressable,
  Text,
  View
} from "react-native"

const LANGUAGES = [
    {
        language: "en",
        text: "English (US)",
        icon: EnglishFlagIcon
    },
    {
        language: "ar",
        text: "عربي",
        icon: ArabicFlagIcon
    },
    {
        language: "fr",
        text: "French",
        icon: FrenchFlagIcon
    }
]

export default function LanguageSelector() {
    const [open, setOpen] = useState(false)
    const theme = useTheme()
    const { isRTL } = useTranslation()
    const themedStyles = styles(theme, open, isRTL)
    const dispatch = useAppDispatch()
    const currentLanguage = useAppSelector(
        (state: RootState) => state.settings.language
    )

    const [selectedLanguage, setSelectedLanguage] = useState(
        LANGUAGES.find(lang => lang.language === currentLanguage) || LANGUAGES[0]
    )

    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(-5)).current

    const user = useAppSelector((state: RootState) => state.parent.parent)
    const { mutate: updateParent } = useUpdateParent()

    useEffect(() => {
        const lang = LANGUAGES.find(lang => lang.language === currentLanguage)
        if (lang) {
            setSelectedLanguage(lang)
        }
    }, [currentLanguage])

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: open ? 1 : 0,
                duration: 150,
                useNativeDriver: true
            }),
            Animated.timing(slideAnim, {
                toValue: open ? 0 : -5,
                duration: 150,
                useNativeDriver: true
            })
        ]).start()
    }, [open])

    const onSelect = (language: typeof LANGUAGES[0]) => {
        const newLanguage = language.language as "en" | "ar" | "fr"
        dispatch(setLanguage(newLanguage))
        setSelectedLanguage(language)
        setOpen(false)
        
        updateParent({
            language: newLanguage
        })
    }

    return (
        <>
            <Pressable
                style={themedStyles.languageRow}
                onPress={() => setOpen(!open)}
            >
                <View style={themedStyles.languageTextContainer}>
                    {React.createElement(selectedLanguage.icon, {
                        width: 21,
                        height: 24
                    })}
                    <Text style={themedStyles.languageText}>
                        {selectedLanguage.text}
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
                    {LANGUAGES
                        .filter(lang => lang.language !== selectedLanguage.language)
                        .map(lang => (
                            <Pressable
                                key={lang.language}
                                style={themedStyles.optionRow}
                                onPress={() => onSelect(lang)}
                            >
                                {React.createElement(lang.icon, {
                                    width: 21,
                                    height: 24
                                })}
                                <Text style={themedStyles.optionText}>
                                    {lang.text}
                                </Text>
                            </Pressable>
                        ))}
                </Animated.View>
            )}
        </>
    )
}
