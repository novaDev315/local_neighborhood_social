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

// Messages API
export const messagesApi = {
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (id: string) => api.get(`/messages/conversations/${id}`),
  sendMessage: (data: { recipientId: string; content: string }) =>
    api.post('/messages', data),
  markAsRead: (id: string) => api.patch(`/messages/${id}/read`),
  getUnreadCount: () => api.get('/messages/unread-count'),
};

// Lost & Found API
export const lostFoundApi = {
  getAll: (params?: { type?: string; status?: string }) =>
    api.get('/lost-found', { params }),
  getOne: (id: string) => api.get(`/lost-found/${id}`),
  create: (data: any) => api.post('/lost-found', data),
  update: (id: string, data: any) => api.patch(`/lost-found/${id}`, data),
  delete: (id: string) => api.delete(`/lost-found/${id}`),
  addSighting: (id: string, data: any) => api.post(`/lost-found/${id}/sightings`, data),
  markReunited: (id: string) => api.patch(`/lost-found/${id}/reunited`),
};

// Recommendations API
export const recommendationsApi = {
  getAll: (params?: { category?: string }) =>
    api.get('/recommendations', { params }),
  getOne: (id: string) => api.get(`/recommendations/${id}`),
  create: (data: any) => api.post('/recommendations', data),
  addReview: (id: string, data: { rating: number; comment: string }) =>
    api.post(`/recommendations/${id}/reviews`, data),
  search: (query: string) => api.get('/recommendations/search', { params: { q: query } }),
};

// Lending Library API
export const lendingApi = {
  getItems: (params?: { category?: string; status?: string }) =>
    api.get('/lending/items', { params }),
  getItem: (id: string) => api.get(`/lending/items/${id}`),
  createItem: (data: any) => api.post('/lending/items', data),
  updateItem: (id: string, data: any) => api.patch(`/lending/items/${id}`, data),
  deleteItem: (id: string) => api.delete(`/lending/items/${id}`),
  requestBorrow: (itemId: string, data: { startDate: string; endDate: string; message?: string }) =>
    api.post(`/lending/items/${itemId}/borrow`, data),
  getMyRequests: () => api.get('/lending/my-requests'),
  getMyItems: () => api.get('/lending/my-items'),
  approveRequest: (id: string) => api.patch(`/lending/requests/${id}/approve`),
  rejectRequest: (id: string) => api.patch(`/lending/requests/${id}/reject`),
  returnItem: (id: string) => api.patch(`/lending/requests/${id}/return`),
};

// Pets API
export const petsApi = {
  getAll: (params?: { type?: string }) => api.get('/pets', { params }),
  getOne: (id: string) => api.get(`/pets/${id}`),
  create: (data: any) => api.post('/pets', data),
  update: (id: string, data: any) => api.patch(`/pets/${id}`, data),
  delete: (id: string) => api.delete(`/pets/${id}`),
  getMyPets: () => api.get('/pets/user/my-pets'),
  getPlaydates: (params?: { petType?: string }) =>
    api.get('/pets/playdates/upcoming', { params }),
  createPlaydate: (data: any) => api.post('/pets/playdates', data),
};

// Volunteers API
export const volunteersApi = {
  getOpportunities: (params?: { category?: string }) =>
    api.get('/volunteers/opportunities', { params }),
  getOpportunity: (id: string) => api.get(`/volunteers/opportunities/${id}`),
  createOpportunity: (data: any) => api.post('/volunteers/opportunities', data),
  updateOpportunity: (id: string, data: any) =>
    api.patch(`/volunteers/opportunities/${id}`, data),
  deleteOpportunity: (id: string) => api.delete(`/volunteers/opportunities/${id}`),
  signup: (id: string) => api.post(`/volunteers/opportunities/${id}/signup`),
  cancelSignup: (id: string) => api.delete(`/volunteers/opportunities/${id}/signup`),
  getSignups: (id: string) => api.get(`/volunteers/opportunities/${id}/signups`),
  getMySignups: () => api.get('/volunteers/my-signups'),
  logHours: (id: string, hours: number) =>
    api.post(`/volunteers/signups/${id}/hours`, { hours }),
  getMyStats: () => api.get('/volunteers/my-stats'),
  getLeaderboard: () => api.get('/volunteers/leaderboard'),
};
