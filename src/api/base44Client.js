const API_URL = 'http://localhost:3001/api';

const api = {
  get: (url) => fetch(`${API_URL}${url}`).then(res => res.json()),
  post: (url, data) => fetch(`${API_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  put: (url, data) => fetch(`${API_URL}${url}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  delete: (url) => fetch(`${API_URL}${url}`, { method: 'DELETE' }).then(res => res.json()),
};

export const base44 = {
  auth: {
    isAuthenticated: async () => true,
    me: async () => ({ id: '1', name: 'Admin PolBel', role: 'admin' }),
    logout: () => { window.location.href = '/'; }
  },
  entities: {
    BlogPost: {
      list: () => api.get('/posts'),
      get: (id) => api.get(`/posts/${id}`),
      create: (data) => api.post('/posts', data),
      update: (id, data) => api.put(`/posts/${id}`, data),
      delete: (id) => api.delete(`/posts/${id}`),
    },
    Product: {
      list: () => api.get('/products'),
      create: (data) => api.post('/products', data),
      update: (id, data) => api.put(`/products/${id}`, data),
      delete: (id) => api.delete(`/products/${id}`),
    },
    Order: {
      list: () => api.get('/orders'),
      update: (id, data) => api.put(`/orders/${id}`, data),
    },
    SiteContent: {
      list: () => api.get('/content'),
      update: (id, data) => api.put(`/content/${id}`, data),
    },
    BlogComment: {
      list: () => api.get('/comments'),
      delete: (id) => api.delete(`/comments/${id}`),
    }
  }
};