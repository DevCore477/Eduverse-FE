import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
  label: {
    fontWeight: "500", textAlign: isRTL ? "right" : "left",
    marginBottom: 8, color: theme.text, marginTop: 16
  },
  input: {
    height: 50,
    borderWidth: 1,
    color: theme.text,
    borderColor: theme.borderSecondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    textAlign: isRTL ? "right" : "left",
    borderRadius: 10,
  },
  eyeButton: {
    position: "absolute",
    right: isRTL ? undefined : 12,
    left: isRTL ? 12 : undefined,
    top: 20,
  },
  error: {
    color: "red",
    marginTop: 2,
    fontSize: 12,
    textAlign: isRTL ? "right" : "left"
  },
  termsRow: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "flex-start",
    marginTop: 16,
    paddingHorizontal: 2,
    gap: 10,

  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: theme.gray,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxActive: {
    backgroundColor: theme.green,
    borderColor: theme.green,
  },

  checkboxIcon: {
    fontSize: 16,
  },

  termsText: {
    flex: 1,
    minWidth: 0,
    color: theme.text,
    fontSize: 13.5,
    textAlign: isRTL ? "right" : "left"
  },

  link: {
    color: theme.green,
    fontWeight: "600",
  },

  button: {
    marginTop: 30,
    height: 60,
    backgroundColor: theme.btnFormPrimary,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.btnFormSecondary,
    fontWeight: '600',
    fontSize: 16,
    textAlign: "center"
  },
})
