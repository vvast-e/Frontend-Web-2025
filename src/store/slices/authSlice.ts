import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authApi, User, LoginRequest, RegisterRequest } from '../../api/generated/api'

// Async thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials)
            // Backend возвращает {status: "ok", user: {email: string}}
            if (response.status === 'ok') {
                localStorage.setItem('isAuthenticated', 'true')
                localStorage.setItem('userEmail', response.user.email)
                return { email: response.user.email }
            } else {
                return rejectWithValue('Login failed')
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Login failed')
        }
    }
)

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: RegisterRequest, { rejectWithValue }) => {
        try {
            const response = await authApi.register(userData)
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed')
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authApi.logout()
            localStorage.removeItem('isAuthenticated')
            localStorage.removeItem('userEmail')
        } catch (error: any) {
            // Даже если logout на сервере не удался, очищаем локальное состояние
            localStorage.removeItem('isAuthenticated')
            localStorage.removeItem('userEmail')
            return rejectWithValue(error.response?.data?.message || 'Logout failed')
        }
    }
)

export const loadUserProfile = createAsyncThunk(
    'auth/loadProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.getProfile()
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load profile')
        }
    }
)

export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',
    async (profileData: Partial<User>, { rejectWithValue }) => {
        try {
            const response = await authApi.updateProfile(profileData)
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile')
        }
    }
)

// Slice
interface AuthState {
    user: User | null
    userEmail: string | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
}

const initialState: AuthState = {
    user: null,
    userEmail: null,
    isAuthenticated: false,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setAuthFromStorage: (state) => {
            // При загрузке страницы сбрасываем авторизацию
            state.isAuthenticated = false
            state.userEmail = null
            state.user = null
        }
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.userEmail = action.payload.email
                state.isAuthenticated = true
                state.loading = false
                state.error = null
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
                state.isAuthenticated = false
                state.user = null
            })

        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload
                state.userEmail = action.payload.email
                state.loading = false
                state.error = null
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        // Logout
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null
                state.userEmail = null
                state.isAuthenticated = false
                state.error = null
            })

        // Load Profile
        builder
            .addCase(loadUserProfile.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loadUserProfile.fulfilled, (state, action) => {
                state.user = action.payload
                state.userEmail = action.payload.email
                localStorage.setItem('userEmail', action.payload.email)
                state.loading = false
                state.error = null
            })
            .addCase(loadUserProfile.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        // Update Profile
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.user = action.payload
                state.userEmail = action.payload.email
                localStorage.setItem('userEmail', action.payload.email)
                state.loading = false
                state.error = null
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export const { clearError, setAuthFromStorage } = authSlice.actions
export default authSlice.reducer


