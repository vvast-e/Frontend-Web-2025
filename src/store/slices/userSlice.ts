import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface UserState {
  username: string;
  email: string;
  id: number | null;
  isAuthenticated: boolean;
  is_superuser: boolean;
  error?: string | null;
}

const initialState: UserState = {
  username: '',
  email: '',
  id: null,
  isAuthenticated: false,
  is_superuser: false,
  error: null,
};

// Асинхронное действие для авторизации
export const loginUserAsync = createAsyncThunk(
  'user/loginUserAsync',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.users.usersLogin({
        email: credentials.email,
        password: credentials.password,
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Ошибка авторизации';
      return rejectWithValue(errorMessage);
    }
  }
);

// Асинхронное действие для деавторизации
export const logoutUserAsync = createAsyncThunk(
  'user/logoutUserAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.users.usersLogout();
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Ошибка при выходе из системы');
    }
  }
);

// Асинхронное действие для получения профиля
export const getProfileAsync = createAsyncThunk(
  'user/getProfileAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.users.usersProfileRead();
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Ошибка при загрузке профиля');
    }
  }
);

// Асинхронное действие для обновления профиля
export const updateProfileAsync = createAsyncThunk(
  'user/updateProfileAsync',
  async (data: { email?: string; username?: string; password?: string }, { rejectWithValue }) => {
    try {
      const response = await api.users.usersProfileUpdate(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при обновлении профиля');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        const { user } = action.payload;
        state.email = user?.email || '';
        state.username = user?.email || '';
        state.id = user?.id || null;
        state.is_superuser = user?.is_superuser || false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.username = '';
        state.email = '';
        state.id = null;
        state.isAuthenticated = false;
        state.is_superuser = false;
        state.error = null;
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        const user = action.payload;
        state.email = user?.email || '';
        state.username = user?.username || user?.email || '';
        state.id = user?.id || null;
        state.is_superuser = user?.is_superuser || false;
        state.isAuthenticated = true;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        const user = action.payload;
        state.email = user?.email || state.email;
        state.username = user?.username || state.username;
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;

