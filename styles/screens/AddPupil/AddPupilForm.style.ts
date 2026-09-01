import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType, isRTL: boolean) => StyleSheet.create({
  label: { fontWeight: "500", marginBottom: 8, color: theme.text, marginTop: 16, textAlign: isRTL ? "right" : "left" },
  input: {
    height: 50,
    borderWidth: 1,
    color: theme.text,
    borderColor: theme.borderSecondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: "center",
    textAlign: isRTL ? "right" : "left"
  },
  dropdownInput: {
    height: 50,
    borderWidth: 1,
    color: theme.text,
    borderColor: theme.borderSecondary,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    justifyContent: "center",
    position: "relative", 
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 14,
  },
  error: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
  termsRow: {
    flexDirection: "row",
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
    color: theme.text,
    fontSize: 13.5,
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
