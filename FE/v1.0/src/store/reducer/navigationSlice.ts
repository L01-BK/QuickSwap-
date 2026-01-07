import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../types';

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
    | 'profile'
    | 'notification'
    | 'help-support'
    | 'about-app';

export type OtpContext = 'register' | 'forgot-password';
export type MainTab = 'home' | 'grid' | 'add' | 'bookmark' | 'profile';

interface NavigationState {
    currentScreen: Screen;
    otpContext: OtpContext;
    selectedPost: Post | null;
    homeActiveTab: MainTab;
    resetEmail?: string;
    resetOtp?: string;
}

const initialState: NavigationState = {
    currentScreen: 'onboarding',
    otpContext: 'register',
    selectedPost: null,
    homeActiveTab: 'home',
    resetEmail: '',
    resetOtp: '',
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
        setResetEmail: (state, action: PayloadAction<string>) => {
            state.resetEmail = action.payload;
        },
        setResetOtp: (state, action: PayloadAction<string>) => {
            state.resetOtp = action.payload;
        },
        resetNavigation: () => initialState,
    },
});

export const { navigateTo, setOtpContext, selectPost, setHomeActiveTab, resetNavigation, setResetEmail, setResetOtp } = navigationSlice.actions;
export default navigationSlice.reducer;