import i18n from "@/i18n"
import { RootState } from "@/store"
import { useAppSelector } from "@/store/hooks"

export function useTranslation() {
  const language = useAppSelector(
    (state: RootState) => state.settings.language
  )

  i18n.locale = language

  return {
    t: (key: string) => i18n.t(key),
    isRTL: language === "ar",
  }
}
