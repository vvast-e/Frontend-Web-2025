import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface CometInRequest {
  id?: number;
  comet?: {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    image_url?: string;
    k_x?: number;
    k_y?: number;
    k_z?: number;
  };
  sort_order?: number;
  coords_x?: number;
  coords_y?: number;
  coords_z?: number;
  distance_au?: number | null;
}

interface RequestData {
  telescopes_list?: string[];
}

interface RequestState {
  app_id: number | null;
  count: number;
  distance_comets: CometInRequest[];
  requestData: RequestData;
  isDraft: boolean;
  loading: boolean;
  error: string | null;
  requestList: any[];
}

const initialState: RequestState = {
  app_id: null,
  count: 0,
  distance_comets: [],
  requestData: {
    telescopes_list: [],
  },
  isDraft: false,
  loading: false,
  error: null,
  requestList: [],
};

// Получение информации о корзине
export const getCartInfo = createAsyncThunk(
  'request/getCartInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.distance.distanceCartInfo();
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Ошибка при загрузке информации о корзине');
    }
  }
);

// Получение списка заявок пользователя
export const getRequestList = createAsyncThunk(
  'request/getRequestList',
  async (params?: { status?: string; date_from?: string; date_to?: string }, { rejectWithValue }) => {
    try {
      const response = await api.distance.distanceList(params);
      return Array.isArray(response.data) ? response.data : (response.data.results || []);
    } catch (error: any) {
      return rejectWithValue('Ошибка при загрузке списка заявок');
    }
  }
);

// Получение одной заявки
export const getRequest = createAsyncThunk(
  'request/getRequest',
  async (requestId: string, { rejectWithValue }) => {
    try {
      const response = await api.distance.distanceRead(Number(requestId));
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Ошибка при загрузке заявки');
    }
  }
);

// Добавление услуги в заявку
export const addCometToRequest = createAsyncThunk(
  'request/addCometToRequest',
  async (cometId: number, { rejectWithValue }) => {
    try {
      const response = await api.comets.cometsAddToRequest(cometId, {});
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Ошибка при добавлении услуги в заявку');
    }
  }
);

// Обновление полей заявки
export const updateRequest = createAsyncThunk(
  'request/updateRequest',
  async ({ requestId, data }: { requestId: string; data: Partial<RequestData> }, { rejectWithValue }) => {
    try {
      const response = await api.distance.distanceUpdate(Number(requestId), data as any);
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Ошибка при обновлении заявки');
    }
  }
);

// Удаление заявки
export const deleteRequest = createAsyncThunk(
  'request/deleteRequest',
  async (requestId: string, { rejectWithValue }) => {
    try {
      await api.distance.distanceDelete(Number(requestId));
      return requestId;
    } catch (error: any) {
      return rejectWithValue('Ошибка при удалении заявки');
    }
  }
);

// Формирование заявки
export const formRequest = createAsyncThunk(
  'request/formRequest',
  async (requestId: string, { rejectWithValue }) => {
    try {
      const response = await api.distance.distanceFormRequest(Number(requestId), {} as any);
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Ошибка при формировании заявки');
    }
  }
);

// Удаление услуги из заявки
export const deleteCometFromRequest = createAsyncThunk(
  'request/deleteCometFromRequest',
  async ({ requestId, cometId }: { requestId: number; cometId: number }, { rejectWithValue }) => {
    try {
      await api.distance.distanceCometsDeleteCometFromRequest(
        requestId.toString()
      );
      return { requestId, cometId };
    } catch (error: any) {
      return rejectWithValue('Ошибка при удалении услуги из заявки');
    }
  }
);

// Обновление м-м записи
export const updateCometInRequest = createAsyncThunk(
  'request/updateCometInRequest',
  async ({ requestId, cometId, data }: { requestId: number; cometId: number; data: Partial<CometInRequest> }, { rejectWithValue }) => {
    try {
      // Используем instance напрямую, так как сгенерированный метод не поддерживает body
      const response = await (api as any).instance.put(
        `/distance/${requestId}/comets/${cometId}/`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Ошибка при обновлении услуги в заявке');
    }
  }
);

const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    setAppId: (state, action) => {
      state.app_id = action.payload;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearRequest: (state) => {
      state.app_id = null;
      state.count = 0;
      state.distance_comets = [];
      state.requestData = { telescopes_list: [] };
      state.isDraft = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getCartInfo
      .addCase(getCartInfo.fulfilled, (state, action) => {
        state.app_id = action.payload.request_id;
        state.count = action.payload.items_count || 0;
      })
      .addCase(getCartInfo.rejected, (state) => {
        state.app_id = null;
        state.count = 0;
      })
      // getRequest
      .addCase(getRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRequest.fulfilled, (state, action) => {
        state.loading = false;
        const request = action.payload;
        state.app_id = request.id;
        state.isDraft = request.status === 'draft';
        state.requestData = {
          telescopes_list: request.telescopes_list || [],
        };
        state.distance_comets = request.distance_comets || [];
      })
      .addCase(getRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // addCometToRequest
      .addCase(addCometToRequest.fulfilled, (state, action) => {
        const request = action.payload;
        state.app_id = request.id;
        state.count = request.distance_comets?.length || 0;
      })
      .addCase(addCometToRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // updateRequest
      .addCase(updateRequest.fulfilled, (state, action) => {
        const request = action.payload;
        state.requestData = {
          telescopes_list: request.telescopes_list || [],
        };
      })
      .addCase(updateRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // deleteRequest
      .addCase(deleteRequest.fulfilled, (state) => {
        state.app_id = null;
        state.count = 0;
        state.distance_comets = [];
        state.requestData = { telescopes_list: [] };
        state.isDraft = false;
      })
      .addCase(deleteRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // formRequest
      .addCase(formRequest.fulfilled, (state, action) => {
        const request = action.payload;
        state.isDraft = request.status === 'draft';
      })
      .addCase(formRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // deleteCometFromRequest
      .addCase(deleteCometFromRequest.fulfilled, (state, action) => {
        const { cometId } = action.payload;
        state.distance_comets = state.distance_comets.filter(
          (item) => item.comet?.id !== cometId
        );
        state.count = state.distance_comets.length;
      })
      .addCase(deleteCometFromRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // getRequestList
      .addCase(getRequestList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRequestList.fulfilled, (state, action) => {
        state.loading = false;
        const data = Array.isArray(action.payload) ? action.payload : [];
        console.log('[REDUX] getRequestList.fulfilled, payload:', action.payload);
        console.log('[REDUX] Processed data:', data);
        if (data.length > 0) {
          console.log('[REDUX] First request status:', data[0]?.status, 'type:', typeof data[0]?.status);
        }
        state.requestList = data;
      })
      .addCase(getRequestList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAppId, setCount, setError, clearRequest } = requestSlice.actions;
export default requestSlice.reducer;

