import { SettingsIconGreen, SettingsIconWhite } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { styles } from "@/styles/components/Header.styles";
import { ScreenTypeKey } from "@/types/screenType";
import { safeNavigate } from "@/utils/safeNavigator";
import { Href, useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, View, ViewStyle } from "react-native";
import StepBar from "./StepBar";

interface HeaderProps {
  isAllowedBack: boolean;
  backhref?: Href
  showProgessBar: boolean;
  stepBarSide?: number;
  isDefaultBG?: boolean;
  isSettings?: boolean;
  view?: React.ReactNode;
  containerStyle?: ViewStyle;
  backIconColor?: string;
  settingsIconColor?: string;  // New prop for settings icon color
  screenType?: ScreenTypeKey | null
  onSettingsPress?: () => void;
  onBackPressed?: () => void;
  isUpgradePlan?: string
  paymentApprovalWait?: boolean
}

export default function Header({
  isAllowedBack,
  backhref,
  showProgessBar,
  stepBarSide = 1,
  isDefaultBG = false,
  isSettings = false,
  view,
  containerStyle,
  backIconColor,
  settingsIconColor,  // Destructure the new prop
  screenType,
  onSettingsPress,
  onBackPressed,
  isUpgradePlan = "false",
  paymentApprovalWait = false
}: HeaderProps) {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const pathname = usePathname();

  const fullBackHref = {
    pathname,
    params: params
  }
  // console.log("full pathname is ", fullBackHref)
  const ICON_SIZE = 28;

  const resolvedBackIconColor =
    backIconColor ?? (isDefaultBG ? theme.backArrow || "#2D1C1C" : theme.text);

  // Default settings icon color
  const resolvedSettingsIconColor = settingsIconColor || (isDefaultBG ? "#1E7F4D" : theme.text);

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      if (screenType) {
        safeNavigate(router, pathname, {
          pathname: "/setting",
          params: {
            screenType: screenType,
            isUpgradePlan,
            paymentApprovalWait: paymentApprovalWait ? "true" : "false",
            backHref: JSON.stringify(fullBackHref),
          }
        });
      } else {
        safeNavigate(router, pathname, {
          pathname: "/setting", params: {
            isUpgradePlan,
            paymentApprovalWait: paymentApprovalWait ? "true" : "false",
            backHref: JSON.stringify(fullBackHref)
          }
        });
      }
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* LEFT */}
      <View style={styles.leftSection}>
        {isAllowedBack && (
          <Pressable onPress={() => {
            if (onBackPressed) {
              onBackPressed()
            }
            else {
              router.back()
            }
          }} hitSlop={10}>
            <ChevronLeft size={ICON_SIZE} color={resolvedBackIconColor} />
          </Pressable>
        )}
      </View>

      {/* CENTER */}
      <View style={styles.centerSection}>
        {showProgessBar ? (
          <StepBar side={stepBarSide} />
        ) : (
          view && <View style={styles.centerContentWrapper}>{view}</View>
        )}
      </View>

      {/* RIGHT */}
      <View style={styles.rightSection}>
        {isSettings && (
          <Pressable
            style={styles.settingsPressable}
            onPress={handleSettingsPress}
            hitSlop={10}
          >
            {isDefaultBG ? (
              <SettingsIconGreen
                width={64}
                height={80}
                color={resolvedSettingsIconColor}
              />
            ) : (
              <SettingsIconWhite
                width={32}
                height={32}
                color={resolvedSettingsIconColor}
              />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}
