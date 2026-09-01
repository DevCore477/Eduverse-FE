import { WelcomeImage } from "@/assets/images";
import Button from '@/components/Button';
import Header from '@/components/Header';
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppSelector } from "@/store/hooks";
import { styles } from '@/styles/screens/Intro/index.style';
import { safeNavigate } from "@/utils/safeNavigator";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from "react";
import { Text, View } from 'react-native';


export default function IntroScreen() {
    const theme = useTheme()
    const language = useAppSelector((state) => state.settings.language)
    const themedStyles = styles(theme, language === "en")
    const router = useRouter()
    const pathname = usePathname()
    const { t } = useTranslation()
    useBackButtonHandler({ exitAppScreen: true })

    const { hideLoader } = useOverlay()
    const queryClient = useQueryClient();
    queryClient.cancelQueries()
    
    useEffect(() => {
        hideLoader()
    }, [])

    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={false} showProgessBar={false} isDefaultBG={true} isSettings={true} />
            <Image
                source={WelcomeImage}
                style={[themedStyles.image, { marginTop: -20 }]}

            />
            <View style={themedStyles.textSection}>
                <Text style={themedStyles.title}>{t("intro.title")}</Text>
                <Text style={themedStyles.description}>{t("intro.description")}</Text>
            </View>
            <View style={themedStyles.buttonSection}>
                <Button text={t("intro.registerText")} style={themedStyles.registerButton} textStyle={themedStyles.registerButtonText} onPress={() => safeNavigate(router, pathname, "/(default-bg)/register")
                } isGradient={true} />
                <View style={themedStyles.orSection}>
                    <View style={themedStyles.orLine} />
                    <Text style={themedStyles.orText}>{t("intro.or")}</Text>
                    <View style={themedStyles.orLine} />
                </View>
                <Button text={t("intro.signInText")} style={themedStyles.signInButton} textStyle={themedStyles.signInButtonText} onPress={() => safeNavigate(router, pathname, "/signin")} />
            </View>
        </View>
    )
}