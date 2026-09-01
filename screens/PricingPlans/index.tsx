import { LetsStartStarIcon, PricingPlanImage } from "@/assets/images";
import Header from "@/components/Header";
import OverlayUI from "@/components/OverlayUI";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { usePurcahsePlan, useUpgradePlan } from "@/services/pricing/pricingMutation";
import { usePricingPlan } from "@/services/pricing/pricingQuery";
import { useStartTrail } from "@/services/traill/trailService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateTrail } from "@/store/parentSlice";
import { styles } from "@/styles/screens/PricingPlans/index.style";
import { TTrailInfo } from "@/types/auth";
import { TBackendErrorResponse } from "@/types/global";
import { safeNavigate } from "@/utils/safeNavigator";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Image } from "expo-image";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, Pressable, Text, View } from "react-native";
import SubscrptionCard from "./components/SubscriptionCard";

export default function PricingPlansScreen() {
  const theme = useTheme();
  const { status, isLogin, isUpgradePlan, isTrailExpired } = useLocalSearchParams();
  const statusString = Array.isArray(status) ? status[0] : status || "";
  const { showToast, showLoader, hideLoader } = useOverlay()
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  useBackButtonHandler()

  const isLoginString = Array.isArray(isLogin) ? isLogin[0] : isLogin ?? "";
  const isLoginBoolean = isLoginString === "true";

  console.log("isUpgradePlan ", isUpgradePlan)
  const isUpgradePlanString = Array.isArray(isUpgradePlan) ? isUpgradePlan[0] : isUpgradePlan ?? "";
  const isUpgradePlanBoolean = isUpgradePlanString === "true";

  const isTrailExpiredString = Array.isArray(isTrailExpired) ? isTrailExpired[0] : isTrailExpired ?? "";
  const isTrailExpiredBoolean = isTrailExpiredString === "true";

  const themedStyles = styles(theme);
  const { data: plans, isPending, isError } = usePricingPlan();
  const {
    mutate: purchasePlan,
    isPending: purchasePlanLoading,
    isError: purchasePlanError,
    reset: purchasePlanReset,
  } = usePurcahsePlan(isLoginBoolean);
  const {
    mutate: upgradePlan,
    isPending: upgradePlanLoading,
    isError: upgradePlanError,
    reset: upgradePlanReset,
  } = useUpgradePlan();

  const [paymentStatusVisible, setPaymentStatusVisible] = useState(true);
  const user = useAppSelector((state) => state.parent.parent);
  const { mutate: getFreeTrail, isPending: getTrailPendind, isError: getTrailError } = useStartTrail()

  console.log("user is ", JSON.stringify(user?.user, null, 2))
  const onPressFreeTrail = () => {
    // console.log("user?.user.trailStatus ", user?.trailStatus )
    if (user?.user.trailStatue === "not_started") {
      getFreeTrail(undefined, {
        onSuccess: (response) => {
          console.log("response from free trail update is ", JSON.stringify(response, null, 2))
          dispatch(updateTrail(response.trial as TTrailInfo))
          safeNavigate(router, pathname, {
            pathname: "/(level-bg)/lets-start",
          });
        },
        onError: (err) => {
          const axiosErr = err as AxiosError<TBackendErrorResponse>;
          const errorMsg = axiosErr.response?.data?.error ?? "Something went wrong, please try again";
          console.log("error from free trail update is ", errorMsg)
        }
      });
    } else {
      showToast("freeTrailOfferAvailed")
    }
  }

  const onPressPlan = (planId: string) => {
    if (!user || !user.user) {
      console.warn("Parent or user not ready");
      return;
    }

    // Find the selected plan from the plans array
    const selectedPlan = plans?.find(plan => plan.id === planId);

    if (!selectedPlan) {
      console.warn("Plan not found");
      return;
    }

    // Extract plan details
    const planName = selectedPlan.name
    const devices = selectedPlan.maxDevices
    const price = selectedPlan.price
    console.log("isUpgradePlanBoolean ", isUpgradePlanBoolean)
    if (isUpgradePlanBoolean) {
      upgradePlan({
        parentId: user?.user.id ?? "",
        planId: planId,
        user: user
      }, {
        onSuccess: (response) => {
          queryClient.invalidateQueries({ queryKey: ['getPupils', user?.user.id] })
          queryClient.invalidateQueries({ queryKey: ['getDashboardData', user?.user.id] })
          queryClient.invalidateQueries({ queryKey: ['getParent', user?.user.id] })
          console.log("in upgrade one ")
          const checkoutUrl = response?.data?.checkoutUrl ?? "https://checkout.chargily.com/";
          safeNavigate(router, pathname, {
            pathname: "/(default-bg)/payment-method",
            params: {
              link: checkoutUrl,
              planName: planName,
              devices: devices.toString(),
              price: price.toString(),
              planId: planId,
              isUpgradePlan: isUpgradePlanString
            }
          });
        },
        onError: (err) => {
          console.log("Error is ", err);
        }
      });
    } else {
      purchasePlan({
        parentId: user?.user.id ?? "",
        planId: planId,
        user: user
      }, {
        onSuccess: (response) => {
          console.log("checkout ", response);
          const checkoutUrl = response?.data?.checkoutUrl ?? "https://checkout.chargily.com/";
          safeNavigate(router, pathname, {
            pathname: "/(default-bg)/payment-method",
            params: {
              link: checkoutUrl,
              planName: planName,
              devices: devices.toString(),
              price: price.toString(),
              planId: planId,
              isUpgradePlan: isUpgradePlanString
            }
          });
        },
        onError: (err) => {
          console.log("Error is ", err);
        }
      });
    }
  };

  useEffect(() => {
    const exitHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      }
    );

    return () => exitHandler.remove();
  }, []);

  useEffect(() => {
    if (isPending || getTrailPendind) {
      showLoader()
    } else {
      hideLoader()
    }
  }, [isPending, getTrailPendind])

  if (isError || !plans || plans.length <= 0 || getTrailError)
    return <OverlayUI visible={isError} mode={"toast"} toastType={"retry"} />;

  return (
    <View style={themedStyles.container}>
      <View>
        {/* <Header isAllowedBack={true} backIconColor="#fff" showProgessBar={false} isSettings={true} /> */}
        <Header
          isAllowedBack={isTrailExpiredBoolean ? false : true}
          showProgessBar={false}
          backIconColor="#fff"
          stepBarSide={2}
          isSettings={true}
          isDefaultBG={false}
          screenType={"pricingPlan"}
          view={
            <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
              <Text style={themedStyles.pricingPlanText}>{t("pricingPlans.text")}</Text>
              <Text style={themedStyles.chooseSubsNowText}>
                {t("pricingPlans.desc")}
              </Text>
            </View>
          }
        />
      </View>

      <Text style={themedStyles.annualBilText}>
        {t("pricingPlans.annualBilling")}
      </Text>
      <View style={themedStyles.subCardContainer}>
        {plans.map((data, index) => {
          return (
            <SubscrptionCard
              key={index}
              {...data}
              onPress={(planId: string) => onPressPlan(planId)}
            />
          );
        })}
      </View>

      <Pressable onPress={onPressFreeTrail} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Image
          source={LetsStartStarIcon}
          style={{ width: 24, height: 24 }}
        />
        <View>
          <Text style={themedStyles.chooseFreePlanText}>
            {t("pricingPlans.freeTrail")}
          </Text>
          <View style={themedStyles.underline} />
        </View>
        <Image
          source={LetsStartStarIcon}
          style={{ width: 24, height: 24 }}
        />
      </Pressable>

      <Text style={themedStyles.choosePlanText}>
        {t("pricingPlans.pageDesc")}
      </Text>
      <Image source={PricingPlanImage} style={themedStyles.image} />

      <OverlayUI visible={purchasePlanLoading || upgradePlanLoading} mode="loader" />

      <OverlayUI
        visible={purchasePlanError || upgradePlanError}
        mode="toast"
        toastType={"retry"}
        onToastHide={() => {
          purchasePlanReset();
          upgradePlanReset();
        }}
      />

      {statusString === "fail" && paymentStatusVisible && (
        <OverlayUI
          visible={paymentStatusVisible}
          mode="toast"
          toastType={"paymentFail"}
          onToastHide={() => setPaymentStatusVisible(false)}
        />
      )}

      {statusString === "success" && paymentStatusVisible && (
        <OverlayUI
          visible={paymentStatusVisible}
          mode="toast"
          toastType={"paymentSucces"}
          onToastHide={() => setPaymentStatusVisible(false)}
        />
      )}
    </View>
  );
}