import AsyncStorage from "@react-native-async-storage/async-storage"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"

import activePupilReducer from "./activePupilSlice"
import lessonQuestionReducer from './lessonQuestionSlice'
import parentPupilReducer from "./parentPupilSlice"
import parentReducer from "./parentSlice"
import settingsReducer from "./settingsSlice"
import subjectReducer from "./subjectSlice"

const rootReducer = combineReducers({
  settings: settingsReducer,
  parent: parentReducer,
  parentPupil: parentPupilReducer,
  activePupil: activePupilReducer,
  subject: subjectReducer,
  lessonQuestions: lessonQuestionReducer
})

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  whitelist: ["settings", "parent", "activePupil", "subject"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
})

export const persistor = persistStore(store)

// ✅ Inferred types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
