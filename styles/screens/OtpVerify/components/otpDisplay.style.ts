import { ThemeType } from "@/types/global";
import { StyleSheet } from "react-native";

export const styles =(theme:ThemeType)=> StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10, 
    marginTop:30
  },
  item: {
    width: 20,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  char: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.text, 
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 100,
    backgroundColor:theme.gray ,
  },
});