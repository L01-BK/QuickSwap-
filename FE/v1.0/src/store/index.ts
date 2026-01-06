import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './reducer/themeSlice';
import userReducer from './reducer/userSlice';
import navigationReducer from './reducer/navigationSlice';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        user: userReducer,
        navigation: navigationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
