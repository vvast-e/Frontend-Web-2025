import { configureStore } from '@reduxjs/toolkit'
import filtersReducer from './slices/filtersSlice'
import userReducer from './slices/userSlice'
import requestReducer from './slices/requestSlice'
import cometsReducer from './slices/cometsSlice'
import moderatorReducer from './slices/moderatorSlice'

export const store = configureStore({
    reducer: {
        filters: filtersReducer,
        user: userReducer,
        request: requestReducer,
        comets: cometsReducer,
        moderator: moderatorReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


