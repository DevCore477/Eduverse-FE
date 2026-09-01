import { PupilOneIconSvg, PupilThreeIcon, PupilTwoIcon } from "@/assets/images";
import Header from "@/components/Header";
import NotificationCard from "@/components/NotificationCard";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { markNotificationAsRead } from "@/services/push-notifications/notificationMutation";
import { useGetNotifications } from "@/services/push-notifications/notificationQuery";
import { useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/screens/Notifications/index.style";
import { TNotification } from "@/types/notification";
import { capitalizeFirstLetter } from "@/utils/caseConversions";
import { safeNavigate } from "@/utils/safeNavigator";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

const NotificationsScreen = () => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const { t } = useTranslation();
  const rotuer = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  useBackButtonHandler();

  const activePupil = useAppSelector((state) => state.activePupil.pupil);
  const user = useAppSelector((state) => state.parent.parent);
  const { showLoader, hideLoader } = useOverlay();

  const { data: notificationData, isPending } = useGetNotifications({
    userId: user?.user.id ?? "",
    notify: "pupil",
    pupilId: activePupil?.id ?? "",
  });
  const { mutate: markAsRead, isPending: isMarkingReadPending } =
    markNotificationAsRead();

  // Step 1: Initialize state for notifications
  const [notificationsState, setNotificationsState] = useState<TNotification[]>(
    [],
  );

  // Set notifications when data is fetched
  useEffect(() => {
    if (notificationData?.notifications && activePupil?.id) {
      // Filter notifications where type is "pupil" and pupilId matches activePupil.id
      const filteredNotifications = notificationData.notifications.filter(
        (notification) =>
          notification.payload.notify === "pupil" &&
          notification.pupilId === activePupil.id,
      );
      setNotificationsState(filteredNotifications);
    }
  }, [notificationData, activePupil?.id]);

  console.log(
    "notificationsState ",
    JSON.stringify(notificationsState, null, 2),
  );

  const handlePress = useCallback((item: TNotification) => {
    // Handle stalled lesson notification (writing assessment for parent)
    if (item.type === "stalled_lesson") {
      safeNavigate(rotuer, pathname, {
        pathname: "/(default-bg)/(parent-bg)/notification-detail",
        params: {
          pupilId: item.pupilId,
          questionId: item.payload?.meta?.questionId,
        },
      });
    }
    // Handle "continue where you left off" notifications - navigate to lesson grid
    else if (item.payload?.meta?.lessonId && activePupil?.id) {
      safeNavigate(rotuer, pathname, {
        pathname: "/(default-bg)/(pupil-bg)/(with-nav)/lesson-grid",
        params: {
          pupilId: activePupil.id,
          lessonId: item.payload.meta.lessonId,
          subjectId: item.payload.meta.subjectId || "",
          subjectName: item.payload.meta.subjectName || "",
          levelId: item.payload.meta.levelId || "",
          levelNo: item.payload.meta.levelNo || "",
          unitId: item.payload.meta.unitId || "",
          lessonNo: item.payload.meta.lessonNo || "",
          isFromMap: "false",
        },
      });
    }
  }, [activePupil?.id]);

  const handleMarkAsRead = useCallback(
    (id: string) => {
      // Step 2: Optimistically update the UI
      const updatedNotifications = notificationsState.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      );

      // Step 3: Update the notifications in state
      setNotificationsState(updatedNotifications);

      // Now, call the API in the background without blocking the UI
      markAsRead(id, {
        onSuccess: () => {
          console.log("Notification marked as read successfullyyy");
          queryClient.invalidateQueries({
            queryKey: ["getNotifications", { userId: user?.user.id }],
          });
        },
        onError: () => {
          console.error("Failed to mark notification as read");

          // Optionally, revert the optimistic update if the API fails
          setNotificationsState(notificationsState); // revert back to original state
        },
      });
    },
    [notificationsState, markAsRead],
  );

  const pupilIcons = [PupilOneIconSvg, PupilTwoIcon, PupilThreeIcon];
  const getPupilIcon = (index: number) => pupilIcons[index % pupilIcons.length];

  // useEffect(() => { isPending ? showLoader() : hideLoader() }, [isPending, showLoader, hideLoader])

  return (
    <View style={themedStyles.container}>
      {/* Header */}
      <Header
        isAllowedBack={false}
        showProgessBar={false}
        isDefaultBG={true}
        isSettings={true}
        view={
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Text style={themedStyles.greeting}>{t("notifications.title")}</Text>
            <Text style={themedStyles.subtitle}>{t("notifications.subtitle")}</Text>
          </View>
        }
      />

      {/* Notifications List */}
      <FlatList
        data={notificationsState}
        keyExtractor={(item) => item.id}
        style={themedStyles.list}
        contentContainerStyle={themedStyles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={themedStyles.subtitle}>{t("notifications.allCaughtUp")}</Text>
        }
        renderItem={({ item, index }) => {
          const IconComponent = getPupilIcon(index);

          return (
            <NotificationCard
              title="Notification"
              message={item.message}
              meta={capitalizeFirstLetter(item.type)}
              isRead={item.isRead}
              createdAt={item.createdAt}
              icon={
                <View style={themedStyles.iconCircle}>
                  <IconComponent width={50} height={50} />
                </View>
              }
              onPress={() => {
                handleMarkAsRead(item.id);
                handlePress(item);
              }}
              handleMarkAsRead={() => {
                handleMarkAsRead(item.id);
              }}
              notificationId={item.id}
            />
          );
        }}
      />
    </View>
  );
};

export default NotificationsScreen;
