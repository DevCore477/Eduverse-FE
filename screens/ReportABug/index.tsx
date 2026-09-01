import { ReportBugStar } from "@/assets/images";
import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/screens/ReportABUg/index.style";
import React from "react";
import { Text, View } from "react-native";

export default function ReportABugScreen() {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const { t, isRTL } = useTranslation();
  useBackButtonHandler();

  return (
    <View style={themedStyles.container}>
      <Header
        isAllowedBack={true}
        showProgessBar={false}
        isDefaultBG={true}
        view={
          <View>
            <Text style={themedStyles.settingHeading}>
              {t("reportABug.text")}
            </Text>
          </View>
        }
      />
      <ReportBugStar width={200} height={200} />
      <View style={themedStyles.textContainer}>
        <View style={themedStyles.textReportContainer}>
          <Text style={themedStyles.textHeading}>{t("reportABug.report")}</Text>
          <Text style={themedStyles.textDescription}>
            {t("reportABug.desc")}
          </Text>
        </View>
        <Text style={themedStyles.textEmail}>team@nedjmati.com</Text>
      </View>
    </View>
  );
}
