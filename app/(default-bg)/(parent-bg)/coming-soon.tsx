import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useTranslation } from "@/hooks/use-translation";
import { Text, View } from "react-native";

export default function CommingSoon() {
    const { t } = useTranslation();
    useBackButtonHandler()
    return (
        <View style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}>
            <Text style={{ textAlign: "center", fontSize: 32, color: "#00AC56" }}>{t("commingSoon.text")}</Text>
        </View>
    )
}