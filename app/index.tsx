import { useAuthBootstrap } from "@/hooks/use-auth-bootstrap";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearParent, setParent } from "@/store/parentSlice";
import { setLanguage } from "@/store/settingsSlice";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/theme";
import { getAuthToken } from "@/config/api-config";
import { store } from "@/store";
import { useColorScheme } from "@/hooks/use-color-scheme";
import RotatingDotsLoader from "@/components/RotatingDotsLoader";
import i18n from "@/i18n";

export default function Index() {
  const { user, loading } = useAuthBootstrap();
  const parent = useAppSelector((state) => state.parent.parent);
  const activePupil = useAppSelector((state) => state.activePupil.pupil);
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const scheme = colorScheme === "dark" ? "dark" : "light";
  const theme = Colors[scheme];

  console.log("✅ ✅ ✅ ✅ ✅ ✅  parent is nedjmati.app", parent);
  console.log("✅ ✅ ✅ ✅ ✅ ✅  active pupil is nedjmati.app", activePupil);
  console.log("✅ ✅ ✅ ✅ ✅ ✅  user is nedjmati.app", user);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      void (async () => {
        const token = await getAuthToken();
        const currentParent = store.getState().parent.parent;
        dispatch(
          setParent({
            token: currentParent?.token ?? token ?? undefined,
            user: user,
          }),
        );
        if (user.language) {
          dispatch(setLanguage(user.language));
          i18n.locale = user.language;
          console.log("🌍 Language synced from backend:", user.language);
        }
      })();
    } else {
      dispatch(clearParent());
    }
  }, [user, loading, dispatch]);

  // Ensure this render is consistent by handling loading early
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <RotatingDotsLoader size={80} dotSize={15} color={theme.green} innerColor={theme.green} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(default-bg)" />;
  }

  // TODO : handle subciption pending case here ( manual payment)

  if (
    (user.trailStatue === "expired" || user.trailStatue === "not_started") &&
    user.subscription?.status !== "active"
  ) {
    return (
      <Redirect
        href={{
          pathname: "/(custom-bg)/pricing-plans",
          params: { isTrailExpired: "true" },
        }}
      />
    );
  }

  if (user.subscription?.status === "active" && !user.pinCode) {
    return (
      <Redirect
        href={{
          pathname: "/(default-bg)/create-pin",
          params: { showBackButton: "false" }
        }}
      />
    );
  }

  // Conditional rendering for redirection, but hooks are already called consistently
  if (activePupil && user && parent) {
    return (
      <Redirect
        href={{
          pathname: "/(default-bg)/(pupil-bg)/(with-nav)/pupil-dashboard",
          params: { pupilId: activePupil.id },
        }}
      />
    );
  }


  return <Redirect href="/(default-bg)/(parent-bg)/parent-dashboard" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});