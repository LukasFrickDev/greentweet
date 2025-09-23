import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface AuthState {
  token: string | null
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  token: null,
  status: 'idle',
  error: null
}

// Thunk para login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post<{ token: string }>(
        '/api/login',
        credentials
      )
      return response.data.token
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Login falhou'
      )
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      axios.defaults.headers.common['Authorization'] = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'idle'
        state.token = action.payload
        axios.defaults.headers.common['Authorization'] =
          `Bearer ${action.payload}`
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
