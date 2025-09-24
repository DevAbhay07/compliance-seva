import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
import uiSlice from './slices/uiSlice'
import complianceSlice from './slices/complianceSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['compliance', 'ui'] // Persist compliance data and UI preferences
}

const rootReducer = combineReducers({
  ui: uiSlice,
  compliance: complianceSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch