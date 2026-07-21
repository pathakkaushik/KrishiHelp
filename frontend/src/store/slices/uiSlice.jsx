import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    sidebarCollapsed: false,
    globalLoading: false,
    pageTitle: 'KrishiMitra AI',
    breadcrumbs: [],
    modal: {
      isOpen: false,
      type: null,
      data: null,
    },
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload
    },
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload
    },
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload
    },
    openModal: (state, action) => {
      state.modal = { isOpen: true, ...action.payload }
    },
    closeModal: (state) => {
      state.modal = { isOpen: false, type: null, data: null }
    },
  },
})

export const {
  toggleSidebar, setSidebarOpen, toggleSidebarCollapse,
  setGlobalLoading, setPageTitle, setBreadcrumbs,
  openModal, closeModal,
} = uiSlice.actions

export default uiSlice.reducer
