import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../services/authService.jsx'

const user = JSON.parse(localStorage.getItem('krishimitra_user'))
const token = localStorage.getItem('krishimitra_token')

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    return await authService.login(credentials)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed')
  }
})

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    return await authService.register(userData)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed')
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout()
})

export const refreshProfile = createAsyncThunk('auth/refreshProfile', async (_, thunkAPI) => {
  try {
    return await authService.getProfile()
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch profile')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    token: token || null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
    isAuthenticated: !!token,
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('krishimitra_user', JSON.stringify(state.user))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
      .addCase(refreshProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { reset, setUser, updateUser } = authSlice.actions
export default authSlice.reducer
