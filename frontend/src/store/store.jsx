import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.jsx'
import themeReducer from './slices/themeSlice.jsx'
import notificationReducer from './slices/notificationSlice.jsx'
import complaintReducer from './slices/complaintSlice.jsx'
import uiReducer from './slices/uiSlice.jsx'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    notifications: notificationReducer,
    complaints: complaintReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
      },
    }),
})

export default store
