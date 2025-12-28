import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { setAppId, setCount } from './requestSlice';

interface Comet {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  k_x?: number;
  k_y?: number;
  k_z?: number;
}

interface CometsState {
  comets: Comet[];
  loading: boolean;
  error: string | null;
}

const initialState: CometsState = {
  comets: [],
  loading: false,
  error: null,
};

// Получение списка услуг
export const getCometsList = createAsyncThunk(
  'comets/getCometsList',
  async (params?: { name?: string; price_min?: number; price_max?: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.comets.cometsList(params);
      const data = response.data;
      
      // Сохраняем app_id и count корзины в requestSlice
      if (data.draft_request_id) {
        dispatch(setAppId(data.draft_request_id));
      }
      if (data.items_count !== undefined) {
        dispatch(setCount(data.items_count));
      }
      
      return Array.isArray(data) ? data : (data.results || data.comets || []);
    } catch (error: any) {
      return rejectWithValue('Ошибка при загрузке услуг');
    }
  }
);

const cometsSlice = createSlice({
  name: 'comets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCometsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCometsList.fulfilled, (state, action) => {
        state.loading = false;
        state.comets = action.payload;
      })
      .addCase(getCometsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cometsSlice.reducer;

