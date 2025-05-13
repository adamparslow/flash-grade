const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:10000";

export async function httpFetch(path: string, method: string, body?: any) {
    const response = await fetch(`${BACKEND_URL}/api/${path}`, {
        method,
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    return data;
}