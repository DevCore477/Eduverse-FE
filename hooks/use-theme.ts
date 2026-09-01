import { Colors } from "@/constants/theme";
import { RootState } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { ThemeType } from "@/types/global";

export function useTheme(): ThemeType {
  const darkMode = useAppSelector(
    (state: RootState) => state.settings.darkMode
  );
  
  const scheme = darkMode ? "dark" : "light";

  return Colors[scheme];
}
