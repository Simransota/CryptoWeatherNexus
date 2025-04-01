import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type Notification = {
  id: string
  type: "price_alert" | "weather_alert"
  message: string
  timestamp: number
  read: boolean
}

interface NotificationsState {
  items: Notification[]
  unreadCount: number
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, "id" | "timestamp" | "read">>) => {
      const { type, message } = action.payload
      const newNotification: Notification = {
        id: Date.now().toString(),
        type,
        message,
        timestamp: Date.now(),
        read: false,
      }
      state.items.unshift(newNotification)
      state.unreadCount += 1
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((item) => item.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount -= 1
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((item) => {
        item.read = true
      })
      state.unreadCount = 0
    },
  },
})

export const { addNotification, markAsRead, markAllAsRead } = notificationsSlice.actions
export default notificationsSlice.reducer

