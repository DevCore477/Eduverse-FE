import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type LanguageCode = "en" | "ar" | "fr"

interface SettingsState {
  language: LanguageCode
  darkMode: boolean
  aiGenerator: boolean
  notification: boolean
}

const initialState: SettingsState = {
  language: "en",
  darkMode: false,
  aiGenerator: false,
  notification: false
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<LanguageCode>) {
      state.language = action.payload
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode
    },
    toggleAiGenerator(state) {
      state.aiGenerator = !state.aiGenerator
    },
    toggleNotification(state) {
      state.notification = !state.notification
    }
  },
})

export const { setLanguage, toggleDarkMode, toggleAiGenerator,toggleNotification } = settingsSlice.actions
export default settingsSlice.reducer
