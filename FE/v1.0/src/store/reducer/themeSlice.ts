import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
    isNightMode: boolean;
}

const initialState: ThemeState = {
    isNightMode: false,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.isNightMode = !state.isNightMode;
        },
        setTheme: (state, action) => {
            state.isNightMode = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
