import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FiltersState {
    title: string
}

const initialState: FiltersState = {
    title: '',
}

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload
        },
        resetFilters: (state) => {
            state.title = ''
        },
    },
})

export const { setTitle, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer


