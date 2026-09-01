import {
    HomeGrayIcon,
    HomeGreenIcon,
    ModuleGrayIcon,
    ModuleGreenIcon,
    NotificationGrayIcon,
    NotificationGreenIcon,
    PaymentGrayIcon,
    PaymentGreenIcon,
    ProfileGrayIcon,
    ProfileGreenIcon,
} from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useGetNotifications } from "@/services/push-notifications/notificationQuery";
import { useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/components/NavigationBar.style";
import { safeNavigate } from "@/utils/safeNavigator";
import { useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Href, usePathname, useRouter, useSegments } from "expo-router";
import { useEffect, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgProps } from "react-native-svg";
import { io } from "socket.io-client";

interface NavigationBarProps {
  currentDashboard: "parent" | "pupil";
}

type NavItem = {
  key: string;
  text: string;
  unSelectedIcon: React.FC<SvgProps>;
  selectedIcon: React.FC<SvgProps>;
  redirectTo: Href;
  params?: Record<string, string | undefined>;
};

export default function NavigationBar({
  currentDashboard,
}: NavigationBarProps) {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const pupilData = useAppSelector((state) => state.activePupil.pupil);
  const user = useAppSelector((state) => state.parent.parent);
  const insets = useSafeAreaInsets();
  const segments = useSegments();

  // Determine which notification type to fetch based on current dashboard
  const notificationType = currentDashboard === "parent" ? "parent" : "pupil";
  const pupilId = currentDashboard === "pupil" && pupilData?.id ? pupilData.id : undefined;

  // Only fetch notifications when we have a valid userId
  const hasValidUserId = !!user?.user.id;
  
  // Fetch notifications with unread count
  const { data: notificationData } = useGetNotifications({
    userId: user?.user.id ?? "",
    notify: notificationType,
    pupilId,
  });

  const unreadCount = notificationData?.unreadCount ?? 0;

  // Socket connection
  if (!Constants.expoConfig?.extra?.API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured in app.config.ts");
  }

  const API_URL = Constants.expoConfig.extra.API_BASE_URL;
  const socket = io(API_URL, {
    auth: {
      userId: user?.user.id,
    },
  });

  const NAVBAR_DATA: NavItem[] = useMemo(() => {
    if (currentDashboard === "parent") {
      return [
        {
          key: "parent-home",
          text: t("navigationBar.home"),
          unSelectedIcon: HomeGrayIcon,
          selectedIcon: HomeGreenIcon,
          redirectTo: "/(default-bg)/(parent-bg)/parent-dashboard",
        },
        {
          key: "plans",
          text: t("navigationBar.payments"),
          unSelectedIcon: PaymentGrayIcon,
          selectedIcon: PaymentGreenIcon,
          redirectTo: {
            pathname: "/(default-bg)/(parent-bg)/parent-payments",
            params: { isInApp: "true" },
          },
        },
        {
          key: "parent-notifications",
          text: t("navigationBar.notifications"),
          unSelectedIcon: NotificationGrayIcon,
          selectedIcon: NotificationGreenIcon,
          redirectTo: "/(default-bg)/(parent-bg)/notifications",
        },
        {
          key: "parent-profile",
          text: t("navigationBar.profile"),
          unSelectedIcon: ProfileGrayIcon,
          selectedIcon: ProfileGreenIcon,
          redirectTo: "/(default-bg)/(parent-bg)/parent-profile",
        },
      ];
    }

    return [
      {
        key: "pupil-home",
        text: t("navigationBar.home"),
        unSelectedIcon: HomeGrayIcon,
        selectedIcon: HomeGreenIcon,
        redirectTo: "/(default-bg)/(pupil-bg)/(with-nav)/pupil-dashboard",
      },
      {
        key: "modules",
        text: t("navigationBar.modules"),
        unSelectedIcon: ModuleGrayIcon,
        selectedIcon: ModuleGreenIcon,
        redirectTo: {
          pathname: "/(default-bg)/(pupil-bg)/(with-nav)/pupil-modules",
          params: { pupilId: pupilData?.id },
        },
      },
      {
        key: "pupil-notifications",
        text: t("navigationBar.notifications"),
        unSelectedIcon: NotificationGrayIcon,
        selectedIcon: NotificationGreenIcon,
        redirectTo: "/(default-bg)/(pupil-bg)/(with-nav)/notifications",
      },
      {
        key: "pupil-profile",
        text: t("navigationBar.profile"),
        unSelectedIcon: ProfileGrayIcon,
        selectedIcon: ProfileGreenIcon,
        redirectTo: {
          pathname: "/(default-bg)/(pupil-bg)/(with-nav)/pupil-profile",
          params: { pupilId: pupilData?.id },
        },
      },
    ];
  }, [currentDashboard, t, pupilData]);

  const isRouteActive = (item: NavItem) => {
    const lastSegment = segments[segments.length - 1];

    if (typeof item.redirectTo === "string") {
      const routeName = item.redirectTo.split("/").pop();
      return routeName === lastSegment;
    }

    const routeName = item.redirectTo.pathname.split("/").pop();
    return routeName === lastSegment;
  };

  // Check if currently on notifications page
  const isOnNotificationsPage = useMemo(() => {
    const lastSegment = segments[segments.length - 1];
    return lastSegment === "notifications";
  }, [segments]);

  // Invalidate notification query when new notification arrives via socket
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("newNotification", (data) => {
      if (data.type === "parent" || data.type === "pupil") {
        queryClient.invalidateQueries({
          queryKey: ["getNotifications", { userId: user?.user.id }],
        });
      }
    });

    return () => {
      socket.off("newNotification");
    };
  }, [socket, queryClient, user?.user.id]);

  // Update app icon badge when unread count changes
  useEffect(() => {
    const updateBadge = async () => {
      try {
        if (unreadCount > 0) {
          await Notifications.setBadgeCountAsync(unreadCount);
        } else {
          await Notifications.setBadgeCountAsync(0);
        }
      } catch (error) {
        console.log("Error setting badge count:", error);
      }
    };

    updateBadge();
  }, [unreadCount]);

  return (
    <View
      style={[themedStyles.container, { paddingBottom: 15 + insets.bottom }]}
    >
      {NAVBAR_DATA.map((item) => {
        const isSelected = isRouteActive(item);

        return (
          <Pressable
            key={item.key}
            onPress={() => {
              safeNavigate(router, pathname, item.redirectTo);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={themedStyles.iconContainer}
          >
            {isSelected ? (
              <item.selectedIcon width={24} height={24} />
            ) : (
              <item.unSelectedIcon width={24} height={24} />
            )}
            <Text
              style={{
                color: isSelected ? "#00AC56" : "#A9ABAD",
                fontSize: 10,
                textAlign: "center",
                width: "100%",
              }}
            >
              {item.text}
            </Text>

            {item.key.includes("notifications") && unreadCount > 0 && (
              <View style={themedStyles.notificationBadge}>
                <Text style={themedStyles.notificationCount}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
