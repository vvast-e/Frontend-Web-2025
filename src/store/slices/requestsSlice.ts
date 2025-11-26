import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { requestsApi, Distance, RequestComet, cometActionsApi } from '../../api/generated/api'

// Async thunks
export const loadUserRequests = createAsyncThunk(
    'requests/loadUserRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await requestsApi.getUserRequests()
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load requests')
        }
    }
)

export const loadCurrentRequest = createAsyncThunk(
    'requests/loadCurrentRequest',
    async (_, { rejectWithValue }) => {
        try {
            const cartInfo = await requestsApi.getCartInfo()
            if (cartInfo.request_id) {
                const request = await requestsApi.getRequest(cartInfo.request_id)
                return request
            }
            return null
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load current request')
        }
    }
)

export const loadRequestById = createAsyncThunk(
    'requests/loadRequestById',
    async (requestId: number, { rejectWithValue }) => {
        try {
            const response = await requestsApi.getRequest(requestId)
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load request')
        }
    }
)

export const addCometToRequest = createAsyncThunk(
    'requests/addComet',
    async ({
        cometId,
        quantity = 1,
        coords_x = 0,
        coords_y = 0,
        coords_z = 0
    }: {
        cometId: number,
        quantity?: number,
        coords_x?: number,
        coords_y?: number,
        coords_z?: number
    }, { rejectWithValue }) => {
        try {
            const response = await cometActionsApi.addCometToDraft(cometId, {
                quantity,
                coords_x,
                coords_y,
                coords_z
            })
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add comet to request')
        }
    }
)

export const updateCometInRequest = createAsyncThunk(
    'requests/updateComet',
    async ({
        requestId,
        cometId,
        data
    }: {
        requestId: number,
        cometId: number,
        data: { quantity?: number, coords_x?: number, coords_y?: number, coords_z?: number }
    }, { rejectWithValue }) => {
        try {
            const response = await requestsApi.updateCometInRequest(requestId, cometId, data)
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update comet in request')
        }
    }
)

export const removeCometFromRequest = createAsyncThunk(
    'requests/removeComet',
    async ({
        requestId,
        cometId
    }: {
        requestId: number,
        cometId: number
    }, { rejectWithValue }) => {
        try {
            await requestsApi.removeCometFromRequest(requestId, cometId)
            return cometId
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove comet from request')
        }
    }
)

export const confirmRequest = createAsyncThunk(
    'requests/confirmRequest',
    async (requestId: number, { rejectWithValue }) => {
        try {
            const response = await requestsApi.updateRequest(requestId, { status: 'formed' })
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to confirm request')
        }
    }
)

export const deleteRequest = createAsyncThunk(
    'requests/deleteRequest',
    async (requestId: number, { rejectWithValue }) => {
        try {
            await requestsApi.deleteRequest(requestId)
            return requestId
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete request')
        }
    }
)

// Slice
interface RequestsState {
    currentRequest: Distance | null  // draft заявка
    userRequests: Distance[]         // все заявки пользователя
    loading: boolean
    error: string | null
}

const initialState: RequestsState = {
    currentRequest: null,
    userRequests: [],
    loading: false,
    error: null
}

const requestsSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        clearCurrentRequest: (state) => {
            state.currentRequest = null
        },
        clearError: (state) => {
            state.error = null
        },
        // Синхронные обновления для оптимистичных обновлений UI
        addCometOptimistic: (state, action: PayloadAction<RequestComet>) => {
            if (state.currentRequest) {
                state.currentRequest.distance_comets.push(action.payload)
            }
        },
        updateCometOptimistic: (state, action: PayloadAction<{ cometId: number, data: Partial<RequestComet> }>) => {
            if (state.currentRequest) {
                const comet = state.currentRequest.distance_comets.find(c => c.id === action.payload.cometId)
                if (comet) {
                    Object.assign(comet, action.payload.data)
                }
            }
        },
        removeCometOptimistic: (state, action: PayloadAction<number>) => {
            if (state.currentRequest) {
                state.currentRequest.distance_comets = state.currentRequest.distance_comets.filter(
                    c => c.id !== action.payload
                )
            }
        }
    },
    extraReducers: (builder) => {
        // Load User Requests
        builder
            .addCase(loadUserRequests.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loadUserRequests.fulfilled, (state, action) => {
                state.userRequests = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(loadUserRequests.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        // Load Current Request (draft via cart_info)
        builder
            .addCase(loadCurrentRequest.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loadCurrentRequest.fulfilled, (state, action) => {
                state.currentRequest = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(loadCurrentRequest.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
                // Если нет текущей заявки, это не ошибка
                state.currentRequest = null
            })

        // Load Request by ID (detail page)
        builder
            .addCase(loadRequestById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loadRequestById.fulfilled, (state, action) => {
                state.currentRequest = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(loadRequestById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        // Add Comet to Request
        builder
            .addCase(addCometToRequest.fulfilled, (state, action) => {
                state.currentRequest = action.payload
            })

        // Update Comet in Request
        builder
            .addCase(updateCometInRequest.fulfilled, (state, action) => {
                if (state.currentRequest) {
                    const index = state.currentRequest.distance_comets.findIndex(c => c.id === action.payload.id)
                    if (index !== -1) {
                        state.currentRequest.distance_comets[index] = action.payload
                    }
                }
            })

        // Remove Comet from Request
        builder
            .addCase(removeCometFromRequest.fulfilled, (state, action) => {
                if (state.currentRequest) {
                    state.currentRequest.distance_comets = state.currentRequest.distance_comets.filter(
                        c => c.id !== action.payload
                    )
                }
            })

        // Confirm Request
        builder
            .addCase(confirmRequest.fulfilled, (state, action) => {
                if (state.currentRequest && state.currentRequest.id === action.payload.id) {
                    state.currentRequest = action.payload
                }
                // Обновляем в списке заявок
                const index = state.userRequests.findIndex(r => r.id === action.payload.id)
                if (index !== -1) {
                    state.userRequests[index] = action.payload
                }
                // Очищаем current request так как она больше не draft
                state.currentRequest = null
            })

        // Delete Request
        builder
            .addCase(deleteRequest.fulfilled, (state, action) => {
                state.userRequests = state.userRequests.filter(r => r.id !== action.payload)
                if (state.currentRequest && state.currentRequest.id === action.payload) {
                    state.currentRequest = null
                }
            })
    }
})

export const {
    clearCurrentRequest,
    clearError,
    addCometOptimistic,
    updateCometOptimistic,
    removeCometOptimistic
} = requestsSlice.actions
export default requestsSlice.reducer
