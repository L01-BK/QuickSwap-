import { BASE_URL, handleApiError } from '../utils/api';

export interface UploadResponse {
    url: string;
}

export const uploadImage = async (uri: string, token: string): Promise<UploadResponse> => {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('file', {
        uri: uri,
        type: type,
        name: filename,
    } as any);

    const response = await fetch(`${BASE_URL}/api/upload/image`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    });

    return handleApiError(response);
};
