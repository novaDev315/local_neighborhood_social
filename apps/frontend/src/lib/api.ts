import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Users API
export const usersApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.patch('/users/me', data),
  getUser: (id: string) => api.get(`/users/${id}`),
};

// Posts API
export const postsApi = {
  getAll: (params?: { neighborhoodId?: string; limit?: number; offset?: number }) =>
    api.get('/posts', { params }),
  getOne: (id: string) => api.get(`/posts/${id}`),
  create: (data: any) => api.post('/posts', data),
  update: (id: string, data: any) => api.patch(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
  addReaction: (id: string, type: string) => api.post(`/posts/${id}/reactions/${type}`),
  getComments: (id: string) => api.get(`/posts/${id}/comments`),
  createComment: (id: string, data: { content: string; parentId?: string }) =>
    api.post(`/posts/${id}/comments`, data),
};

// Events API
export const eventsApi = {
  getUpcoming: (params?: { neighborhoodId?: string }) =>
    api.get('/events/upcoming', { params }),
  getOne: (id: string) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: string, data: any) => api.patch(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
};

// Marketplace API
export const marketplaceApi = {
  getAll: (params?: { neighborhoodId?: string; category?: string }) =>
    api.get('/marketplace', { params }),
  getOne: (id: string) => api.get(`/marketplace/${id}`),
  create: (data: any) => api.post('/marketplace', data),
  update: (id: string, data: any) => api.patch(`/marketplace/${id}`, data),
  delete: (id: string) => api.delete(`/marketplace/${id}`),
};

// Safety Alerts API
export const safetyApi = {
  getActive: () => api.get('/safety-alerts/active'),
  getOne: (id: string) => api.get(`/safety-alerts/${id}`),
  create: (data: any) => api.post('/safety-alerts', data),
};

// Neighborhoods API
export const neighborhoodsApi = {
  getAll: () => api.get('/neighborhoods'),
  getOne: (id: string) => api.get(`/neighborhoods/${id}`),
};

// Groups API
export const groupsApi = {
  getAll: (params?: { neighborhoodId?: string }) => api.get('/groups', { params }),
  getOne: (id: string) => api.get(`/groups/${id}`),
  create: (data: any) => api.post('/groups', data),
};

// Businesses API
export const businessesApi = {
  getAll: () => api.get('/businesses'),
  getOne: (id: string) => api.get(`/businesses/${id}`),
};
