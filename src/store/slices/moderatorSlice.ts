import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface ModeratorRequest {
  id: number;
  status: string;
  created_at: string;
  formed_at: string | null;
  completed_at: string | null;
  astronomer_login: string;
  chief_astronomer_login: string | null;
  telescopes_list: string[];
  calculated_comets_count: number;
  distance_comets: any[];
}

interface ModeratorState {
  requests: ModeratorRequest[];
  filters: {
    date_from: string;
    date_to: string;
    status: string;
    creator_filter: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ModeratorState = {
  requests: [],
  filters: {
    date_from: '',
    date_to: '',
    status: '',
    creator_filter: '',
  },
  loading: false,
  error: null,
};

// Получение списка заявок для модератора
export const getModeratorRequestsList = createAsyncThunk(
  'moderator/getModeratorRequestsList',
  async (params?: { date_from?: string; date_to?: string; status?: string }, { rejectWithValue }) => {
    try {
      const response = await api.distance.distanceList(params);
      return Array.isArray(response.data) ? response.data : (response.data.results || []);
    } catch (error: any) {
      return rejectWithValue('Ошибка при загрузке списка заявок');
    }
  }
);

// Завершение заявки
export const completeRequest = createAsyncThunk(
  'moderator/completeRequest',
  async ({ requestId, action }: { requestId: string; action: 'complete' | 'reject' }, { rejectWithValue }) => {
    try {
      const response = await api.distance.distanceCompleteRequest(Number(requestId), { action } as any);
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Ошибка при завершении заявки');
    }
  }
);

const moderatorSlice = createSlice({
  name: 'moderator',
  initialState,
  reducers: {
    setDateFrom: (state, action) => {
      state.filters.date_from = action.payload;
    },
    setDateTo: (state, action) => {
      state.filters.date_to = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },
    setCreatorFilter: (state, action) => {
      state.filters.creator_filter = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        date_from: '',
        date_to: '',
        status: '',
        creator_filter: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getModeratorRequestsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getModeratorRequestsList.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(getModeratorRequestsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(completeRequest.fulfilled, (state, action) => {
        const updatedRequest = action.payload;
        const index = state.requests.findIndex(r => r.id === updatedRequest.id);
        if (index !== -1) {
          state.requests[index] = updatedRequest;
        }
      })
      .addCase(completeRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setDateFrom, setDateTo, setStatusFilter, setCreatorFilter, clearFilters } = moderatorSlice.actions;
export default moderatorSlice.reducer;

