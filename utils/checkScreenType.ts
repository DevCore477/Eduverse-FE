import { ScreenType, ScreenTypeKey } from "@/types/screenType";

export function isScreenTypeKey(value: string): value is ScreenTypeKey {
  return value in ScreenType;
}
