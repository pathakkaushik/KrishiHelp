import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import complaintService from '../../services/complaintService.jsx'

export const fetchComplaints = createAsyncThunk('complaints/fetchAll', async (params, thunkAPI) => {
  try {
    return await complaintService.getComplaints(params)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch complaints')
  }
})

export const createComplaint = createAsyncThunk('complaints/create', async (data, thunkAPI) => {
  try {
    return await complaintService.createComplaint(data)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create complaint')
  }
})

export const updateComplaintStatus = createAsyncThunk('complaints/updateStatus', async ({ id, status, remarks }, thunkAPI) => {
  try {
    return await complaintService.updateStatus(id, { status, remarks })
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update status')
  }
})

const complaintSlice = createSlice({
  name: 'complaints',
  initialState: {
    complaints: [],
    selectedComplaint: null,
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    isLoading: false,
    isError: false,
    message: '',
    filters: {
      status: '',
      category: '',
      priority: '',
      search: '',
    },
  },
  reducers: {
    setSelectedComplaint: (state, action) => {
      state.selectedComplaint = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = { status: '', category: '', priority: '', search: '' }
    },
    resetComplaintState: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.isLoading = false
        state.complaints = action.payload.content || action.payload
        state.totalPages = action.payload.totalPages || 0
        state.totalElements = action.payload.totalElements || 0
        state.currentPage = action.payload.number || 0
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createComplaint.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.isLoading = false
        state.complaints = [action.payload, ...state.complaints]
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        const index = state.complaints.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.complaints[index] = action.payload
        }
        if (state.selectedComplaint?.id === action.payload.id) {
          state.selectedComplaint = action.payload
        }
      })
  },
})

export const { setSelectedComplaint, setFilters, clearFilters, resetComplaintState } = complaintSlice.actions
export default complaintSlice.reducer
