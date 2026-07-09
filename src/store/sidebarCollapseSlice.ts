import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarCollapseState {
    isOpenCollapse: boolean;
}

const initialState: SidebarCollapseState = {
    isOpenCollapse: false,
};

const sidebarCollapseSlice = createSlice({
    name: 'sidebarCollapse',
    initialState,
    reducers: {
        setCollapse: (state, action: PayloadAction<boolean>) => {
            state.isOpenCollapse = action.payload;
        },
        toggleCollapse: (state) => {
            state.isOpenCollapse = !state.isOpenCollapse;
        },
    },
});

export const { setCollapse, toggleCollapse } = sidebarCollapseSlice.actions;
export default sidebarCollapseSlice.reducer;
