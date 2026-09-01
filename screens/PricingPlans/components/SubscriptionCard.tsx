import { DInarGoldIcon } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/screens/PricingPlans/components/subscriptionCard.style";
import { TPlan } from "@/types/pricingPlans";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

interface SubscriptionCardProps extends TPlan {
  onPress: (planId: string) => void;
}
export default function SubscrptionCard(data: SubscriptionCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const themedStyles = styles(theme);

  const formatPrice = (price: number) => {
    const num = Number(price);
    return num.toLocaleString("en-US");
  };

  return (
    <LinearGradient
      colors={["#B8D240", "#00D168"]}
      start={{ x: 0.0043, y: 0 }}
      end={{ x: 0.9961, y: 0 }}
      style={themedStyles.container}
    >
      <Pressable
        onPress={() => data.onPress(data.id)}
        style={{ width: "100%", height: "100%" }}
      >
        <View style={themedStyles.containerOne}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <DInarGoldIcon width={20} height={20} />
            <Text style={themedStyles.priceNumber}>
              {formatPrice(data.price)}{" "}
            </Text>
          </View>
          <Text style={themedStyles.priceText}>
            {t("paymentMethod.for")} {data.allowedYears}{" "}
            {t("paymentMethod.year")}
          </Text>
        </View>
        <View style={themedStyles.containerTwo}>
          <Text style={themedStyles.deviceNumber}>{data.maxDevices}</Text>
          {data.maxDevices > 0 && (
            <Text style={themedStyles.deviceText}>
              {data.maxDevices > 1
                ? t("paymentMethod.upTo") + " \n" + t("paymentMethod.devices")
                : t("paymentMethod.device") + " \n" + t("paymentMethod.only")}
            </Text>
          )}
        </View>
        <View style={themedStyles.containerThree}>
          <Text style={themedStyles.planName}>
            {data.planCode === "basic"
              ? t("paymentMethod.basicPlan")
              : t("paymentMethod.familyPlan")}
          </Text>
          {data.maxProfiles > 0 && (
            <Text style={themedStyles.planText}>
              {data.maxProfiles > 1
                ? t("paymentMethod.upto3Pupils")
                : t("paymentMethod.only1Pupil")}
            </Text>
          )}
        </View>
      </Pressable>
    </LinearGradient>
  );
}
