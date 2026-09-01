import { SettingsIconGreen, SettingsIconWhite } from "@/assets/images"
import { useTheme } from "@/hooks/use-theme"
import { styles } from "@/styles/components/TransparentHeader.styles"
import { safeNavigate } from "@/utils/safeNavigator"
import { usePathname, useRouter } from "expo-router"
import { ChevronLeft } from 'lucide-react-native'
import { Pressable, View } from "react-native"
import StepBar from "./StepBar"

interface TransparentHeaderProps {
    isAllowedBack: boolean
    showProgessBar: boolean
    stepBarSide?: number
    isDefaultBG?: boolean
    isSettings?: boolean
    view?: React.ReactNode
    backIconColor?: string;
}

export default function TransparentHeader({
    isAllowedBack,
    showProgessBar,
    stepBarSide = 1,
    isDefaultBG = false,
    isSettings = false,
    view,
    backIconColor
}: TransparentHeaderProps) {
    const theme = useTheme();
    const router = useRouter()
    const pathname = usePathname()

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                {isAllowedBack &&
                    <Pressable onPress={() => router.back()}>
                        <ChevronLeft size={28} color={backIconColor ?? theme.text} />
                    </Pressable>
                }
            </View>

            <View style={styles.centerSection}>
                {showProgessBar ? (
                    <StepBar side={stepBarSide} />
                ) : (
                    view && <View style={styles.centerContentWrapper}>{view}</View>
                )}
            </View>


            <Pressable style={styles.rightSection} onPress={() => safeNavigate(router, pathname, "/(default-bg)/checker")}>
                {!isSettings && (
                    isDefaultBG ? (
                        <SettingsIconGreen width={64} height={80} />
                    ) : (
                        <SettingsIconWhite width={28} height={28} />
                    )
                )}
            </Pressable>
        </View>
    )
}
