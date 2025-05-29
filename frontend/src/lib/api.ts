import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (data: { email: string; password: string; role: string }) =>
        api.post('/auth/login', data),
    register: (data: any, role: 'farmer' | 'buyer') =>
        api.post(`/auth/register/${role}`, data),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data: any) => api.put('/auth/update-profile', data),
};

export const productAPI = {
    getProducts: (params?: any) => api.get('/products', { params }),
    getProduct: (id: string) => api.get(`/products/${id}`),
    createProduct: (data: any) => api.post('/products', data),
    updateProduct: (id: string, data: any) => api.put(`/products/${id}`, data),
    deleteProduct: (id: string) => api.delete(`/products/${id}`),
};

export const orderAPI = {
    getOrders: () => api.get('/orders'),
    getOrder: (id: string) => api.get(`/orders/${id}`),
    createOrder: (data: any) => api.post('/orders', data),
    updateOrder: (id: string, data: any) => api.put(`/orders/${id}`, data),
};

export default api; 