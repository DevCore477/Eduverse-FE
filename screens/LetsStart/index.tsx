import { LetsStartIconSVG, LetsStartStarBG } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/screens/LetsStart/index.style";
import { safeNavigate } from "@/utils/safeNavigator";
import { usePathname, useRouter } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function LetsStartScreen() {
    const theme = useTheme();
    const themedStyles = styles(theme);
    const router = useRouter()
    const pathanme = usePathname()
    const { t, isRTL } = useTranslation()

    return (
        <View style={themedStyles.container}>
            <View >
                <View style={{ top: -18, right: 0, position: 'absolute' }}>
                    <LetsStartStarBG width={225} height={210} />
                </View>

                <View style={{ position: 'relative', right: 5, top: 0 }}>
                    {/* <Image source={LetsStartStarIcon} style={{ width: 220, marginRight: 0 }} /> */}
                    <LetsStartIconSVG width={225} height={210} />
                </View>
            </View>
            <View style={themedStyles.textContainer}>
                <Text style={themedStyles.congratsText}>{t("letsStart.congrats")}{"\n"}{t("letsStart.text")}</Text>
                <Text style={themedStyles.descText}>{t("letsStart.desc")}</Text>
            </View>

            <Pressable onPress={() => {
                safeNavigate(router, pathanme,
                    { pathname: "/(default-bg)/create-pin", params: { showBackButton: "true" } })
            }} style={themedStyles.button}>
                {isRTL ?
                    <>
                        <ArrowLeft size={28} color={theme.green} />
                        <Text style={themedStyles.buttonText}>{t("letsStart.start")}</Text>
                    </> :
                    <>
                        <Text style={themedStyles.buttonText}>{t("letsStart.start")}</Text>
                        <ArrowRight size={26} color={theme.green} />
                    </>}
            </Pressable>
        </View>


    )
}

