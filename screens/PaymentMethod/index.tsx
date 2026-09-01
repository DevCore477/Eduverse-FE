import { CharglyLogo } from "@/assets/images";
import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/screens/PaymentMethod/index.style";
import { safeNavigate } from "@/utils/safeNavigator";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { Dimensions, Linking, Pressable, Text, View } from "react-native";

export default function PaymentMethodScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { t, isRTL } = useTranslation();
  const params = useLocalSearchParams();
  const { width: screenWidth } = Dimensions.get("window");
  const boxWidth = screenWidth / 2 - 28;
  const themedStyles = styles(theme, boxWidth, isRTL);
  useBackButtonHandler();

  const link =
    (Array.isArray(params.link) ? params.link[0] : params.link) ?? "";
  const planName =
    (Array.isArray(params.planName) ? params.planName[0] : params.planName) ??
    "";
  const planId =
    (Array.isArray(params.planId) ? params.planId[0] : params.planId) ?? "";
  const devices =
    (Array.isArray(params.devices) ? params.devices[0] : params.devices) ?? "";
  const price =
    (Array.isArray(params.price) ? params.price[0] : params.price) ?? "";
  const isUpgradePlanString = Array.isArray(params.isUpgradePlan)
    ? params.isUpgradePlan[0]
    : (params.isUpgradePlan ?? "");
  const isUpgradePlanBoolean = isUpgradePlanString === "true";

  const handleCharglyPayment = () => {
    Linking.canOpenURL(link)
      .then((supported) => {
        if (supported) {
          Linking.openURL(link);
        } else {
          console.warn("Can't open URL: " + link);
        }
      })
      .catch((err) => console.error("Error opening URL", err));
  };
  return (
    <View style={themedStyles.container}>
      <Header
        isAllowedBack={true}
        showProgessBar={false}
        isUpgradePlan={isUpgradePlanString}
        isDefaultBG={true}
        isSettings={true}
        screenType={"paymentMethod"}
        view={
          <View>
            <Text style={themedStyles.pageHeading}>{t("paymentMethod.pageHeading")}</Text>
          </View>
        }
      />
      <View style={themedStyles.cardContainer}>
        <Pressable onPress={handleCharglyPayment}>
          <View style={themedStyles.charglyCard}>
            <CharglyLogo width={80} height={76} />
          </View>
        </Pressable>
        <Pressable
          onPress={() =>
            safeNavigate(router, pathname, {
              pathname: "/(default-bg)/payment-card-details",
              params: {
                planName,
                devices,
                price,
                isUpgradePlan: isUpgradePlanString,
                planId: planId,
              },
            })
          }
        >
          <LinearGradient
            colors={["#A991D2", "#F7C0E9"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={themedStyles.manuallyCard}
          >
            <Text style={themedStyles.manuallyText}>{t("paymentMethod.pay")}</Text>
            <Text style={themedStyles.manuallyText}>{t("paymentMethod.manually")}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
