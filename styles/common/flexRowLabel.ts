import type { TextStyle, ViewStyle } from "react-native";

/**
 * Horizontal flex rows (icon + label, label + switch, etc.) on some Android OEMs
 * measure Text too narrowly; the label column needs flex + minWidth: 0, and the
 * Text usually needs flex: 1 + minWidth: 0 so the full string paints.
 */
export const flexRowLabelGroup: ViewStyle = {
  flex: 1,
  minWidth: 0,
};

export const flexRowLabelText: TextStyle = {
  flex: 1,
  minWidth: 0,
};

/** Header center: title must fill space between fixed left/right hit areas. */
export const headerCenterContent: ViewStyle = {
  flex: 1,
  minWidth: 0,
  alignItems: "center",
  justifyContent: "center",
};
