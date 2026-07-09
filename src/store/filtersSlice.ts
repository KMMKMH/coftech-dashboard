import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
    [key: string]: any;
}

const initialState: FiltersState = {};

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<FiltersState>) => {
            Object.assign(state, action.payload);
        },
        setFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
            state[action.payload.key] = action.payload.value;
        },
        resetFilters: (state) => {
            return {};
        },
    },
});

export const { setFilters, setFilter, resetFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
