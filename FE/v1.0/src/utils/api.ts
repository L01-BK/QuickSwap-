export const BASE_URL = 'http://10.0.2.2:8080';

// Helper to handle API errors
export const handleApiError = async (response: Response) => {
    if (!response.ok) {
        const text = await response.text();
        try {
            const json = JSON.parse(text);
            throw new Error(json.message || 'Something went wrong');
        } catch {
            throw new Error(text || 'Something went wrong');
        }
    }
    return response.json();
};
