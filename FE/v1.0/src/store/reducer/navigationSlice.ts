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
    | 'notification';

export type OtpContext = 'register' | 'forgot-password' | 'profile-change-password';
export type MainTab = 'home' | 'grid' | 'add' | 'bookmark' | 'profile';

interface NavigationState {
    currentScreen: Screen;
    otpContext: OtpContext;
    selectedPost: Post | null;
    homeActiveTab: MainTab;
    resetEmail?: string;
    resetOtp?: string;
    homePosts: Post[];
    homePage: number;
    homeScrollOffset: number;
}

const initialState: NavigationState = {
    currentScreen: 'onboarding',
    otpContext: 'register',
    selectedPost: null,
    homeActiveTab: 'home',
    resetEmail: '',
    resetOtp: '',
    homePosts: [],
    homePage: 0,
    homeScrollOffset: 0,
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
        setHomePosts: (state, action: PayloadAction<Post[]>) => {
            state.homePosts = action.payload;
        },
        setHomePage: (state, action: PayloadAction<number>) => {
            state.homePage = action.payload;
        },
        setHomeScrollOffset: (state, action: PayloadAction<number>) => {
            state.homeScrollOffset = action.payload;
        },
        resetNavigation: () => initialState,
    },
});

export const { navigateTo, setOtpContext, selectPost, setHomeActiveTab, resetNavigation, setResetEmail, setResetOtp, setHomePosts, setHomePage, setHomeScrollOffset } = navigationSlice.actions;
export default navigationSlice.reducer;
