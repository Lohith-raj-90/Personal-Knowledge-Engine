import { getToken, clearToken } from './auth.js';
import { navigate } from './router.js';

async function request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const opts = { method, headers };
    if (body && !(body instanceof FormData)) {
        opts.body = JSON.stringify(body);
    } else if (body instanceof FormData) {
        delete headers['Content-Type'];
        opts.body = body;
    }

    const res = await fetch(`/api${path}`, opts);
    const data = await res.json();
    if (!res.ok) {
        if (res.status === 401) {
            clearToken();
            navigate('/login');
        }
        throw new Error(data.error || 'Request failed');
    }
    return data;
}

export const api = {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    patch: (path, body) => request('PATCH', path, body),
    del: (path) => request('DELETE', path),
    upload: (path, formData) => request('POST', path, formData),
};
