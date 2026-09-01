import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/screens/TermsAndCondition/index.style";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function TermsAndCondtionScreen() {
    const theme = useTheme();
    const { t, isRTL } = useTranslation()
    const { isPrivacy } = useLocalSearchParams()
    const isPrivacyString = Array.isArray(isPrivacy) ? isPrivacy[0] : isPrivacy ?? "";
    const isPrivacyBoolean = isPrivacyString === "true";
    useBackButtonHandler()

    const themedStyles = styles(theme, isRTL);

    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={true} showProgessBar={false} isDefaultBG={true} isSettings={true}
                containerStyle={{ paddingHorizontal: 16 }}
                view={
                    <View>
                        <Text style={themedStyles.pageHeading}>{isPrivacyBoolean ? t("termsAndPrivacy.pagePrivacyHeading") : t("termsAndPrivacy.pageTermsHeading")}</Text>
                    </View>
                } />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>

                <View style={themedStyles.headerContainer}>
                    <Text style={themedStyles.titleText}>{isPrivacyBoolean ? t("termsAndPrivacy.titlePrivacy") : t("termsAndPrivacy.titleTerms")}</Text>
                    <Text style={themedStyles.lastUpdatedText}>{t("termsAndPrivacy.lastUpdated")}</Text>
                </View>

                <View
                    style={themedStyles.contentContainer}>
                    <View style={themedStyles.contentBlock}>
                        <Text style={themedStyles.contentMainHeading}>
                            {isPrivacyBoolean ? t("termsAndPrivacy.mainHeadingPrivacy") : t("termsAndPrivacy.mainHeadingTerms")}
                        </Text>
                        <Text style={themedStyles.contentIntroText}>
                            {t("termsAndPrivacy.introText")}
                        </Text>
                    </View>

                    <View style={themedStyles.contentBlock}>
                        <Text style={themedStyles.contentMainHeading}>
                            {t("termsAndPrivacy.section1Title")}
                        </Text>
                        <Text style={themedStyles.contentIntroText}>
                            {t("termsAndPrivacy.section1Text")}
                        </Text>
                    </View>

                    <View style={themedStyles.contentBlock}>
                        <Text style={themedStyles.contentBlockHeading}>
                            {t("termsAndPrivacy.section2Title")}
                        </Text>
                        <Text style={themedStyles.contentIntroText}>
                            {t("termsAndPrivacy.section2Text")}
                        </Text>
                    </View>

                    <View style={themedStyles.contentBlock}>
                        <Text style={themedStyles.contentBlockHeading}>
                            {t("termsAndPrivacy.section3Title")}
                        </Text>
                        <Text style={themedStyles.contentIntroText}>
                            {t("termsAndPrivacy.section3Text")}
                        </Text>
                    </View>

                    <View style={themedStyles.contentBlock}>
                        <Text style={themedStyles.contentBlockHeading}>
                            {t("termsAndPrivacy.section4Title")}
                        </Text>
                        <Text style={themedStyles.contentIntroText}>
                            {t("termsAndPrivacy.section4Text")}
                        </Text>
                    </View>

                    <View style={themedStyles.contentBlock}>
                        <Text style={themedStyles.contentBlockHeading}>
                            {t("termsAndPrivacy.section5Title")}
                        </Text>
                        <Text style={themedStyles.contentIntroText}>
                            {t("termsAndPrivacy.section5Text")}
                        </Text>
                    </View>

                    <View style={themedStyles.contentBlock}>
                        <Text style={themedStyles.contentBlockHeading}>
                            {t("termsAndPrivacy.section6Title")}
                        </Text>
                        <Text style={themedStyles.contentIntroText}>
                            {t("termsAndPrivacy.section6Text")}
                        </Text>
                    </View>

                    <View style={themedStyles.contentBlock}>
                        <Text style={themedStyles.contentBlockHeading}>
                            {t("termsAndPrivacy.section7Title")}
                        </Text>
                        <Text style={themedStyles.contentIntroText}>
                            {t("termsAndPrivacy.section7Text")}
                        </Text>
                    </View>

                    <View style={themedStyles.contentBlock}>
                        <Text style={themedStyles.contentBlockHeading}>
                            {t("termsAndPrivacy.section8Title")}
                        </Text>
                        <Text style={themedStyles.contentIntroText}>
                            {t("termsAndPrivacy.section8Text")}
                        </Text>
                    </View>

                    <View style={themedStyles.contentBlock}>
                        <Text style={themedStyles.contentBlockHeading}>
                            {t("termsAndPrivacy.section9Title")}
                        </Text>
                        <Text style={themedStyles.contentIntroText}>
                            {t("termsAndPrivacy.section9Text")}
                        </Text>
                    </View>
                </View>
            </ScrollView >
        </View>
    )
}