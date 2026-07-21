import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    isOpen: false,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload
      state.unreadCount = action.payload.filter(n => !n.isRead).length
    },
    addNotification: (state, action) => {
      state.items = [action.payload, ...state.items]
      if (!action.payload.isRead) state.unreadCount++
    },
    markAllRead: (state) => {
      state.items = state.items.map(n => ({ ...n, isRead: true }))
      state.unreadCount = 0
    },
    markRead: (state, action) => {
      const item = state.items.find(n => n.id === action.payload)
      if (item && !item.isRead) {
        item.isRead = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    toggleNotificationPanel: (state) => {
      state.isOpen = !state.isOpen
    },
  },
})

export const { setNotifications, addNotification, markAllRead, markRead, toggleNotificationPanel } = notificationSlice.actions
export default notificationSlice.reducer
