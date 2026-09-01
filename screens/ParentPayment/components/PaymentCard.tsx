import { DollarIcon } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/screens/ParentPayment/components/PaymentCard.style";
import { Text, View } from "react-native";

interface PaymentCardProps {
    name: string;
    price: number;
    maxProfiles: number;
    buyedAt: string;
    status: string
}

export default function PaymentCard({ name, price, maxProfiles, buyedAt, status }: PaymentCardProps) {

    const theme = useTheme();
    const { t, isRTL } = useTranslation();
    const themedStyles = styles(theme, status, isRTL);

    return (
        <View style={themedStyles.container}>
            <View style={themedStyles.rightContainer}>
                <View style={themedStyles.iconContainer}>
                    <DollarIcon width={24} height={24} />
                </View>
                <View style={themedStyles.textContainer}>
                    <View>
                        <View>
                            <Text>{name}</Text>
                            <Text>{maxProfiles === 3 ? t("paymentCard.upTo3Pupils") : t("paymentCard.only1Pupil")} </Text>
                        </View>
                        <Text>{t("paymentCard.subscriptionPurchased")}</Text>
                    </View>
                    <View>
                        <Text>{buyedAt}</Text>
                        <View>
                            <View style={themedStyles.dot}></View>
                            <Text>{status === "ACTIVE" ? t("paymentCard.active") : t("paymentCard.inactive")}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <Text style={themedStyles.price}>
                ${price}
            </Text>
        </View>
    )
}