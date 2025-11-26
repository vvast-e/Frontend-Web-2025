import { configureStore } from '@reduxjs/toolkit'
import filtersReducer from './slices/filtersSlice'
import authReducer from './slices/authSlice'
import requestsReducer from './slices/requestsSlice'

export const store = configureStore({
    reducer: {
        filters: filtersReducer,
        auth: authReducer,
        requests: requestsReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


