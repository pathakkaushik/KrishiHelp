import { createSlice } from '@reduxjs/toolkit'

const savedTheme = localStorage.getItem('krishimitra_theme') || 'dark'

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: savedTheme,
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark'
      localStorage.setItem('krishimitra_theme', state.mode)
      if (state.mode === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload
      localStorage.setItem('krishimitra_theme', state.mode)
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
