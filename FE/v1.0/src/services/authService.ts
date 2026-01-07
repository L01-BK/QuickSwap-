import { BASE_URL, handleApiError } from '../utils/api';

export const forgotPassword = async (email: string) => {
    const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    // The backend returns a string message, not always JSON.
    if (!response.ok) {
        return handleApiError(response);
    }
    return response.text();
};

export const checkOtp = async (email: string, otp: string) => {
    const response = await fetch(`${BASE_URL}/api/auth/check-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
        return handleApiError(response);
    }
    return response.text();
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
    });

    if (!response.ok) {
        return handleApiError(response);
    }
    return response.text();
};
