import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    id: string | number | null;
    name: string;
    username: string;
    handle: string;
    email: string;
    phone: string;
    avatarUrl: string;
    university: string;
    address: string;
    rating: number;
    token?: string; // Add token field
}

const initialState: UserState = {
    id: null,
    name: 'Kevin Nguyễn',
    username: 'Nguyễn Văn Kevin',
    handle: '@hoclTcungnhau',
    email: 'kv@hcmut.edu.vn',
    phone: '0869611401',
    avatarUrl: 'https://i.pravatar.cc/300',
    university: 'ĐH Bách Khoa TP.HCM',
    address: 'B12, KP6, Linh Trung, Thủ Đức, TP.HCM',
    rating: 4.5,
    token: undefined,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
