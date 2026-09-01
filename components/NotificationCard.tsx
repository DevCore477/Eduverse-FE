import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { ThemeType } from "@/types/global";
import { timeAgo } from "@/utils/dateHelper";
import { MoreVertical } from "lucide-react-native";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Themed styles factory using ThemeType
function createThemedStyles(theme: ThemeType, isRTL: boolean, isRead: boolean) {
  return StyleSheet.create({
    card: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: isRTL ? 10 : 20,
      paddingRight: isRTL ? 20 : 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isRead ? "#E0DFF1" : theme.green,
      backgroundColor: theme.background,
      gap: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    unread: {
      borderColor: theme.green,
    },
    iconWrapper: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      flex: 1,
    },
    message: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 18,
    },
    meta: {
      marginTop: 6,
      fontSize: 12,
      color: theme.green,
    },
    newIndicator: {
      position: "absolute",
      top: -20,
      right: 30,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: theme.green,
      borderWidth: 2,
      borderColor: theme.background,
    },
    actionMenu: {
      padding: 4,
    },
    menu: {
      position: "absolute",
      top: 20,
      right: 12,
      backgroundColor: theme.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.borderSecondary,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 5,
      width: 150,
      zIndex: 100,
    },
    menuItem: {
      padding: 10,
      fontSize: 14,
      color: theme.green,
    },
  });
}

export type NotificationIconType = "star" | "warning" | "calendar";

interface NotificationCardProps {
  title: string;
  message: string;
  meta: string; // e.g. "Reminder · 5 min ago"
  isRead: boolean;
  icon: React.ReactNode;
  createdAt: Date;
  notificationId: string;
  onPress: () => void;
  handleMarkAsRead: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  message,
  meta,
  isRead,
  icon,
  createdAt,
  notificationId,
  onPress,
  handleMarkAsRead,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const theme = useTheme();
  const { t, isRTL } = useTranslation();
  const themedStyles = createThemedStyles(theme, isRTL, isRead);

  const handlePressMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleMarkRead = () => {
    handleMarkAsRead(notificationId); // Mark as read
    setShowMenu(false); // Close the menu
  };

  return (
    <Pressable
      onPress={onPress}
      style={[themedStyles.card, !isRead && themedStyles.unread]}
    >
      <View style={themedStyles.iconWrapper}>
        {icon}
        {!isRead && <View style={themedStyles.newIndicator} />}
      </View>

      <View style={themedStyles.content}>
        <Text style={themedStyles.message}>{message}</Text>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <Text style={themedStyles.meta}>{meta}</Text>
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.green,
                marginHorizontal: 2,
                marginTop: 4,
                alignSelf: "center",
              }}
            />
            <Text style={themedStyles.meta}>{timeAgo(createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* Action Menu with dropdown */}
      <Pressable
        style={themedStyles.actionMenu}
        hitSlop={10}
        onPress={handlePressMenu}
      >
        <MoreVertical size={20} color={theme.green} />
        {showMenu && (
          <View style={themedStyles.menu}>
            <TouchableOpacity onPress={handleMarkRead}>
              <Text style={themedStyles.menuItem}>{t("notifications.markAsRead")}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
    </Pressable>
  );
};

export default NotificationCard;

// Removed legacy static styles in favor of themed styles.
