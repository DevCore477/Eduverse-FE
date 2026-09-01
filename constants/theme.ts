import { Platform } from "react-native";

export const Colors = {
  light: {
    primary: "#00AC56",
    secondary: "#E0DFF1",
    btnPrimary: "#00AC56",
    btnSecondary: "#fff",
    btnFormPrimary: "#00AC56",
    btnFormSecondary: "#FFDE3C",
    borderPrimary: "#00AC56",
    borderSecondary: "#DDDADA",
    text: "#2D1C1C",
    textSecondary: "#5E5B5B",
    textDesc: "#2D1C1C",
    placeHolderText: "#B6B1B2",
    gray: "#E0DFF1",
    white: "#fff",
    green: "#00AC56",
    background: "#fff",
    lightGray: "#736E6E",
    error: "#FF4D4D",
    toastBg: "#EFEDF7",
    navBar: "#fff",
    dropdownBg: "#F5F4FB",
    submitBtnClr: "#ec8771",
    cancelBtnClr: "#fbaa43",
    backArrow: "#2D1C1C",
    gradients: {
      lessonIntro: ["#A991D2", "#F7C0E9"] as [string, string],
      lessonVideo: ["#EC6F9E", "#EC8B6A"] as [string, string],
      practiceQuestions: ["#C1D5B0", "#91BF9B"] as [string, string],
      finalJourney: ["#00AC56", "#00743A"] as [string, string],
      locked: ["#C6C6C6", "#9E9E9E"] as [string, string],
    },
  },
  dark: {
    primary: "#E0DFF1",
    secondary: "#00AC56",
    btnSecondary: "#00AC56",
    btnPrimary: "#fff",
    btnFormSecondary: "#FFDE3C",
    btnFormPrimary: "#FFDE3C",
    borderPrimary: "#00AC56",
    borderSecondary: "#DDDADA",
    textDesc: "#DDDADA",
    text: "#fff",
    backArrow: "#E0DFF1",
    placeHolderText: "#B6B1B2",
    textSecondary: "#B6B1B2",
    dropdownBg: "#333333",
    gray: "#E0DFF1",
    lightGray: "#B6B1B2",
    white: "#fff",
    green: "#00AC56",
    background: "#262626",
    error: "#FF4D4D",
    toastBg: "#EFEDF7",
    navBar: "#333333",
    submitBtnClr: "#ec8771",
    cancelBtnClr: "#fbaa43",
    gradients: {
      lessonIntro: ["#A991D2", "#F7C0E9"] as [string, string],
      lessonVideo: ["#EC6F9E", "#EC8B6A"] as [string, string],
      finalJourney: ["#00AC56", "#00743A"] as [string, string],
      locked: ["#C6C6C6", "#9E9E9E"] as [string, string],
    },
  },
  gradients: {
    lessonIntro: ["#A991D2", "#F7C0E9"] as [string, string],
    lessonVideo: ["#EC6F9E", "#EC8B6A"] as [string, string],
    practiceQuestions: ["#C1D5B0", "#91BF9B"] as [string, string],
    finalJourney: ["#00AC56", "#00743A"] as [string, string],
    locked: ["#C6C6C6", "#9E9E9E"] as [string, string],
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});