import { TickGreen } from "@/assets/images";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useGetParent } from "@/services/parent/parentQuery";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/screens/ParentPayment/index.style";
import { safeNavigate } from "@/utils/safeNavigator";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SwitchButton } from "../ParentDashboard/components/SwitchButton";

import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { setTrialStatus, updateSubscription } from "@/store/parentSlice";
import { useQueryClient } from "@tanstack/react-query";

export default function ParentPaymentScreen() {
  const theme = useTheme();
  const { isInApp } = useLocalSearchParams();
  const { t, isRTL } = useTranslation();
  const language = useAppSelector((state) => state.settings.language);
  const user = useAppSelector((state) => state.parent.parent);
  const {
    data: parentData,
    isPending,
    isError,
  } = useGetParent({ id: user?.user.id });
  const { showLoader, hideLoader, showToast } = useOverlay();
  const queryClient = useQueryClient(); // Access the query client
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  useBackButtonHandler();

  const isInAppString = Array.isArray(isInApp) ? isInApp[0] : (isInApp ?? "");
  const isInAppBoolean = isInAppString === "true";

  console.log("isInAppBoolean ", isInAppBoolean);

  useEffect(() => {
    if (parentData?.subscription) {
      dispatch(updateSubscription(parentData?.subscription));
    }
  }, [parentData?.subscription, dispatch]);

  useEffect(() => {
    if (!isInAppBoolean) {
      console.log("hey there");
      const userId = user ? user.user.id : "";
      console.log("user id is ", userId);
      queryClient.invalidateQueries({ queryKey: ["getParent", userId] });
      dispatch(setTrialStatus("converted"));
    }
  }, [isInAppBoolean, queryClient, user?.user.id]);

  const themedStyles = styles(theme, isRTL);
  const noOfOfDevices =
    user?.user.trailStatue === "active"
      ? 1
      : parentData?.subscription?.plan.maxDevices;
  const planName = parentData?.subscription?.plan.name;
  const price = parentData?.subscription?.plan.price;
  const startDate =
    user?.user.trailStatue === "active" && user.user.trailStartDate
      ? user.user.trailStartDate
      : (parentData?.subscription?.startDate ?? new Date());
  const endDate =
    user?.user.trailStatue === "active" && user.user.trailEndDate
      ? user.user.trailEndDate
      : (parentData?.subscription?.endDate ?? new Date());
  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear();
  const yearGap = endYear - startYear;
  const day = String(new Date(endDate).getDate()).padStart(2, "0");
  const month = String(new Date(endDate).getMonth() + 1).padStart(2, "0");
  const year = new Date(endDate).getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const formatPrice = (price: any) => {
        const num = Number(price);
        return num.toLocaleString('en-US');
    };

  console.log("nof of devices are ", noOfOfDevices);

  useEffect(() => {
    if (isPending) {
      showLoader();
    } else {
      hideLoader();
    }
    return () => {
      hideLoader();
    };
  }, [isPending, showLoader, hideLoader]);

  useEffect(() => {
    if (isError) {
      showToast("retry");
    }
  }, [isError, showToast]);

  return (
    <View style={themedStyles.container}>
      <Header
        isAllowedBack={false}
        showProgessBar={false}
        isDefaultBG={true}
        isSettings={true}
        view={
          <View>
            <Text style={themedStyles.paymentZoneText}>
              {t("parentPlanScreen.heading")}
            </Text>
          </View>
        }
      />

      <View style={themedStyles.planInfoContainer}>
        <View style={themedStyles.planInfoText}>
          <Text style={themedStyles.planInfoName}>
            {user?.user.trailStatue === "active"
              ? t("parentPlanScreen.freePlanText")
              : planName == "Family Plan"
                ? t("parentPlanScreen.familyPlanText")
                : t("parentPlanScreen.basicPlanText")}
          </Text>
          <Text style={themedStyles.planInfoDesc}>
            {user?.user.trailStatue === "active" ? (
              `${t("parentPlanScreen.freePlanDesc")} ${formattedDate}`
            ) : (
              <>
                {t("parentPlanScreen.planDesc1")} {formattedDate}.
                {t("parentPlanScreen.planDesc2")} DZD {formatPrice(price)}
                {t("parentPlanScreen.planDesc3")} {yearGap}
                {t("parentPlanScreen.planDesc4")}
              </>
            )}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <SwitchButton
            noWrap={true}
            title={t("parentPlanScreen.upgradeBtnText")}
            colorOne="#00AC56"
            colorTwo="#00743A"
            textStyle={{ color: "#FFDE3C" }}
            btnSyle={{ width: language === "fr" ? 140 : 100 }}
            onPress={() =>
              safeNavigate(router, pathname, {
                pathname: "/(custom-bg)/pricing-plans",
                params: { isUpgradePlan: "true" },
              })
            }
          />
        </View>
      </View>

      <View style={themedStyles.planBenefitsContainer}>
        <Text style={themedStyles.planBenefitText}>
          {t("parentPlanScreen.planBenfits")}
        </Text>
        <View style={themedStyles.planBenefitList}>
          <View style={themedStyles.planBenfitRow}>
            <TickGreen width={14} height={13} />
            <Text style={themedStyles.planBenefit}>
              {noOfOfDevices === 1
                ? t("parentPlanScreen.basicPlanBenefit1")
                : t("parentPlanScreen.familyPlanBenefit1")}
            </Text>
          </View>
          <View style={themedStyles.planBenfitRow}>
            <TickGreen width={14} height={13} />
            <Text style={themedStyles.planBenefit}>
              {noOfOfDevices === 1
                ? t("parentPlanScreen.basicPlanBenefit2")
                : t("parentPlanScreen.familyPlanBenefit2")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
