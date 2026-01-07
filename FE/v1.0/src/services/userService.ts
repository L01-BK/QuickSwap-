import { BASE_URL, handleApiError } from '../utils/api';

export interface UpdateUserProfileRequest {
    name?: string;
    username?: string;
    handle?: string;
    phone?: string;
    university?: string;
    address?: string;
    avatarUrl?: string;
}

export const updateUserProfile = async (data: UpdateUserProfileRequest, token?: string) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/api/users/me`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
    });

    return handleApiError(response);
};
