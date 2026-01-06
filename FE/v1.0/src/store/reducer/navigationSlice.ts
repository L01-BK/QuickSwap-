import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../components/PostDetail';

export type Screen =
    | 'onboarding'
    | 'login'
    | 'register'
    | 'otp'
    | 'forgot-password'
    | 'reset-password'
    | 'home'
    | 'post-detail'
    | 'my-account'
    | 'profile';

export type OtpContext = 'register' | 'forgot-password';
export type MainTab = 'home' | 'grid' | 'add' | 'bookmark' | 'profile';

interface NavigationState {
    currentScreen: Screen;
    otpContext: OtpContext;
    selectedPost: Post | null;
    homeActiveTab: MainTab;
}

const initialState: NavigationState = {
    currentScreen: 'onboarding',
    otpContext: 'register',
    selectedPost: null,
    homeActiveTab: 'home',
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        navigateTo: (state, action: PayloadAction<Screen>) => {
            state.currentScreen = action.payload;
        },
        setOtpContext: (state, action: PayloadAction<OtpContext>) => {
            state.otpContext = action.payload;
        },
        selectPost: (state, action: PayloadAction<Post | null>) => {
            state.selectedPost = action.payload;
        },
        setHomeActiveTab: (state, action: PayloadAction<MainTab>) => {
            state.homeActiveTab = action.payload;
        },
        resetNavigation: () => initialState,
    },
});

export const { navigateTo, setOtpContext, selectPost, setHomeActiveTab, resetNavigation } = navigationSlice.actions;
export default navigationSlice.reducer;
