import { PupilOneIconSvg, PupilThreeIcon, PupilTwoIcon } from "@/assets/images";
import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useGetPupils } from "@/services/parent/parentQuery";
import { useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/screens/PupilListing/index.style";
import { DashboardTypes } from "@/types/global";
import { capitalizeFirstLetter } from "@/utils/caseConversions";
import { safeNavigate } from "@/utils/safeNavigator";
import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SwitchButton } from "../ParentDashboard/components/SwitchButton";
import PupilBox from "./components/PupilBox";

export default function PupilListingScreen() {
  const theme = useTheme();
  const { t, isRTL } = useTranslation();
  const themedStyles = styles(theme, isRTL);
  const user = useAppSelector((state) => state.parent.parent);
  const {
    data: pupils,
    isPending,
    isError,
    error,
  } = useGetPupils({ id: user?.user?.id, token: user?.token });
  const { showLoader, hideLoader, showToast } = useOverlay();
  useBackButtonHandler();

  const router = useRouter();
  const pathname = usePathname();

  const maxProfiles = user?.user.subscription?.plan.maxProfiles ?? 1;

  useEffect(() => {
    if (isPending) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isPending, showLoader, hideLoader]);

  const colorMapping = [
    {
      colorOne: "#A991D2",
      colorTwo: "#F7C0E9",
      borderColor: "#00000026",
      icon: PupilOneIconSvg,
    },
    {
      colorOne: "#EC6F9E",
      colorTwo: "#EC6F9E",
      borderColor: "#00000026",
      icon: PupilTwoIcon,
    },
    {
      colorOne: "#5670EC",
      colorTwo: "#07BAFE",
      borderColor: "#00000026",
      icon: PupilThreeIcon,
    },
  ];

  const pupilsData = (pupils ?? []).map((pupil, index) => ({
    icon: colorMapping[index]?.icon ?? PupilOneIconSvg,
    name: `${capitalizeFirstLetter(pupil.firstName)}`,
    id: pupil.id,
    colorOne: colorMapping[index]?.colorOne ?? "#A991D2",
    colorTwo: colorMapping[index]?.colorTwo ?? "#F7C0E9",
    borderColor: colorMapping[index]?.borderColor ?? "#00000026",
    firstName: capitalizeFirstLetter(pupil.firstName ?? ""),
    lastName: capitalizeFirstLetter(pupil.lastName ?? ""),
  }));

  const pupilsToShow = pupilsData.slice(0, maxProfiles);

  return (
    <View style={themedStyles.container}>
      <Header
        isAllowedBack={false}
        showProgessBar={false}
        stepBarSide={2}
        isDefaultBG={true}
        isSettings={true}
        screenType={"pupilListing"}
        view={
          <View>
            <Text style={themedStyles.parentZoneText}>
              {t("pupilListing.text")}
            </Text>
          </View>
        }
      />

      <View style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
        <SwitchButton
          noWrap={true}
          title={t("setting.switchBtnParentText")}
          colorOne="#00AC56"
          colorTwo="#00743A"
          textStyle={{ color: "#FFDE3C" }}
          btnSyle={{ width: 110 }}
          onPress={() =>
            safeNavigate(router, pathname, {
              pathname: "/(default-bg)/verfiy-pin",
              params: { redirectTo: DashboardTypes.PARENT },
            })
          }
        />
      </View>

      <View style={themedStyles.cotentContainer}>
        {pupilsToShow.length > 0 ? (
          pupilsToShow.map((pupil, index) => (
            <PupilBox
              key={index}
              data={pupil}
              onClickPupilBox={() => {
                if (pupils && pupils.length > 0 && pupils[index]) {
                  // Dispatch the active pupil to the store
                }
                safeNavigate(router, pathname, {
                  pathname: "/(level-bg)/pupil-verify",
                  params: {
                    pupilId: pupilsData[index].id,
                    firstName: pupilsData[index].firstName,
                    lastName: pupilsData[index].lastName,
                  },
                });
              }}
            />
          ))
        ) : (
          <View style={themedStyles.noPupilsContainer}>
            <Text style={themedStyles.noPupilsText}>
              {!isPending && "No pupil added yet"}
              {/* e.g., "No pupil added yet" */}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
