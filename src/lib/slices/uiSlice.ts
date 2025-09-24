import { createSlice } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean
  currentPage: string
  theme: 'light' | 'dark'
  notifications: Array<{
    id: string
    type: 'success' | 'warning' | 'error' | 'info'
    message: string
    timestamp: string
  }>
}

const initialState: UIState = {
  sidebarOpen: false,
  currentPage: 'home',
  theme: 'light',
  notifications: []
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date().toISOString()
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    }
  }
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setCurrentPage,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications
} = uiSlice.actions

export default uiSlice.reducer