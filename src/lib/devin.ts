const baseURL = 'https://api.devin.ai/v1';
const apiKey = process.env.DEVIN_API_KEY;

if (!apiKey) {
    throw new Error('DEVIN_API_KEY environment variable is not set.');
}

async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${baseURL}${path}`;

    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${apiKey}`);

    // Let fetch set the Content-Type for FormData automatically, including the boundary
    if (!(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: 'Request failed', details: response.statusText }));
        console.error('Devin API Error:', errorBody);
        throw new Error(`API request failed with status ${response.status}`);
    }

    // Handle responses with no content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json() as Promise<T>;
}

export const devinApi = {
    get: <T>(path: string): Promise<T> => {
        return fetchApi<T>(path, { method: 'GET' });
    },
    post: <T>(path: string, body: any): Promise<T> => {
        const isFormData = body instanceof FormData;
        return fetchApi<T>(path, {
            method: 'POST',
            body: isFormData ? body : JSON.stringify(body),
        });
    },
    put: <T>(path: string, body: any): Promise<T> => {
        return fetchApi<T>(path, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },
};