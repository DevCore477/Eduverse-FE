import Header from "@/components/Header";
import { useTranslation } from "@/hooks/use-translation";
import { Text, View } from "react-native";

export default function WaitForManualPayment() {
    const { t } = useTranslation();
    return (
        <View style={{
            flex: 1, paddingHorizontal: 16,
            paddingTop: 40,
            paddingBottom: 44,
            gap: 32
        }}>
            <Header isAllowedBack={false} showProgessBar={false} isDefaultBG={true} isSettings={true} paymentApprovalWait={true} />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 18 }}>{t("waitForManualPayment.message")}</Text>
            </View>
        </View>
    )
}